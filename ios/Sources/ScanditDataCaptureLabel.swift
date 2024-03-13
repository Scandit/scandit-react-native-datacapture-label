/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
import ScanditFrameworksCore
import ScanditBarcodeCapture
import ScanditDataCaptureCore
import ScanditLabelCapture

enum ScanditDataCaptureLabelError: Int, CustomNSError {
    case invalidSequenceId = 1
    case labelNotFound
    case fieldNotFound
    case brushInvalid
    case basicOverlayNil
    case advancedOverlayNil
    case viewInvalid
    case deserializationError

    var domain: String { return "ScanditDataCaptureLabelErrorDomain" }

    var code: Int {
        return rawValue
    }

    var message: String {
        switch self {
        case .invalidSequenceId:
            return "The sequence id does not match the current sequence id."
        case .labelNotFound:
            return "Label not found."
        case .fieldNotFound:
            return "Field not found."
        case .brushInvalid:
            return "It was not possible to deserialize a valid Brush"
        case .viewInvalid:
            return "It was not possible to deserialize a valid View"
        case .basicOverlayNil:
            return "LabelCaptureBasicOverlay is <nil>"
        case .advancedOverlayNil:
            return "LabelCaptureAdvancedOverlay is <nil>"
        case .deserializationError:
            return "LabelCaptureAdvancedOverlay is <nil>"
        }
    }

    var errorUserInfo: [String: Any] {
        return [NSLocalizedDescriptionKey: message]
    }
}

@objc(ScanditDataCaptureLabel)
class ScanditDataCaptureLabel: RCTEventEmitter {
    internal let deserializer = LabelCaptureDeserializer()
    internal var hasListeners = false

    internal var capturedLabelViewCache = [RCTRootView: CapturedLabel]()

    internal var offset: [Int: PointWithUnit] = [:]

    // LabelCaptureListener
    internal let didUpdateSessionLock = CallbackLock<Bool>(name: ScanditDataCaptureLabelEvent.didUpdateSession.rawValue)
    internal var lastFrameSequenceId: Int?
    internal var lastCapturedLabels: [CapturedLabel]?

    // LabelCaptureBasicOverlayListener
    internal let brushForFieldLock =
        CallbackLock<Brush>(name: ScanditDataCaptureLabelEvent.brushForFieldOfLabel.rawValue)
    internal let brushForLabelLock =
        CallbackLock<Brush>(name: ScanditDataCaptureLabelEvent.brushForLabel.rawValue)

    // LabelCaptureAdvancedOverlayListener
    internal let viewForLabelLock =
        CallbackLock<JSView>(name: ScanditDataCaptureLabelEvent.viewForLabel.rawValue)
    internal let anchorForLabelLock =
        CallbackLock<Anchor>(name: ScanditDataCaptureLabelEvent.anchorForLabel.rawValue)
    internal let offsetForLabelLock =
        CallbackLock<PointWithUnit>(name: ScanditDataCaptureLabelEvent.offsetForLabel.rawValue)

    
    internal var modeEnabled = AtomicBool()

    internal var context: DataCaptureContext?
    internal var dataCaptureView: DataCaptureView?

    internal var labelCapture: LabelCapture? {
       willSet {
           labelCapture?.removeListener(self)
       }
       didSet {
           labelCapture?.addListener(self)
       }
    }
    
    internal var basicOverlay: LabelCaptureBasicOverlay? {
       willSet {
           basicOverlay?.delegate = nil
       }
       didSet {
           basicOverlay?.delegate = self
       }
    }
    
    internal var advancedOverlay: LabelCaptureAdvancedOverlay? {
       willSet {
           advancedOverlay?.delegate = nil
       }
       didSet {
           advancedOverlay?.delegate = self
       }
    }

    override init() {
        super.init()
        registerDeserializer()
        DeserializationLifeCycleDispatcher.shared.attach(observer: self)
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return sdcSharedMethodQueue
    }

    @objc override func invalidate() {
        super.invalidate()
        unregisterDeserializer()
        DeserializationLifeCycleDispatcher.shared.detach(observer: self)
        capturedLabelViewCache.removeAll()
        lastCapturedLabels?.removeAll()
        lastFrameSequenceId = nil
        basicOverlay = nil
        advancedOverlay = nil
        unlockLocks()
    }

    deinit {
        invalidate()
    }

    internal func unlockLocks() {
        didUpdateSessionLock.reset()
        brushForFieldLock.reset()
        brushForLabelLock.reset()
    }

    // Empty methods to unify the logic on the TS side for supporting functionality automatically provided by RN on iOS,
    // but custom implemented on Android.
    @objc func registerListenerForEvents() {
        // Empty on purpose
    }

    @objc func unregisterListenerForEvents() {
        // Empty on purpose
    }

    @objc func registerListenerForBasicOverlayEvents() {
        // Empty on purpose
    }

    @objc func unregisterListenerForBasicOverlayEvents() {
        // Empty on purpose
    }

    @objc func registerListenerForAdvancedOverlayEvents() {
        // Empty on purpose
    }

    @objc func unregisterListenerForAdvancedOverlayEvents() {
        // Empty on purpose
    }
    
    @objc(applyLabelCaptureModeSettings:resolve:reject:)
    func applyLabelCaptureModeSettings(settingsJson: String,
                                     resolve: @escaping RCTPromiseResolveBlock,
                                     reject: @escaping RCTPromiseRejectBlock) {
        guard let mode = labelCapture else {
            resolve(nil)
            return
        }
        
        do {
            let settings = try deserializer.settings(fromJSONString: settingsJson)
            mode.apply(settings)
            resolve(nil)
        } catch {
            reject("Something wrong happened while apply the new label capture settings.", error.localizedDescription, error)
        }
    }
    
    @objc(setModeEnabledState:)
    func setModeEnabledState(enabled: Bool) {
        modeEnabled.value = enabled
        labelCapture?.isEnabled = enabled
    }
    
    func onModeRemovedFromContext() {
        labelCapture = nil
        
        if let basicOverlay = basicOverlay, let dataCaptureView = dataCaptureView {
            dataCaptureView.removeOverlay(basicOverlay)
        }
        basicOverlay = nil
        
        if let advancedOverlay = self.advancedOverlay, let dataCaptureView = self.dataCaptureView {
            dataCaptureView.removeOverlay(advancedOverlay)
        }
        self.advancedOverlay = nil
    }
}

extension ScanditDataCaptureLabel: DeserializationLifeCycleObserver {
    public func dataCaptureContext(deserialized context: DataCaptureContext?) {
        self.context = context
    }
    
    public func dataCaptureView(deserialized view: DataCaptureView?) {
        dataCaptureView = view
    }
    
    public func dataCaptureContext(addMode modeJson: String) throws {
        if JSONValue(string: modeJson).string(forKey: "type") != "labelCapture" {
            return
        }
        
        guard let dcContext = context else {
            return
        }
        do {
            let mode = try deserializer.mode(fromJSONString: modeJson, with: dcContext)
            dcContext.addMode(mode)
        }catch {
            print(error)
        }
    }
    
    public func dataCaptureContext(removeMode modeJson: String) {
        if JSONValue(string: modeJson).string(forKey: "type") != "labelCapture" {
            return
        }
        
        guard let dcContext = context else {
            return
        }
        
        guard let mode = labelCapture else {
            return
        }
        dcContext.removeMode(mode)
        onModeRemovedFromContext()
    }
    
    public func dataCaptureContextAllModeRemoved() {
        onModeRemovedFromContext()
    }
    
    public func didDisposeDataCaptureContext() {
        context = nil
        onModeRemovedFromContext()
    }
    
    public func dataCaptureView(addOverlay overlayJson: String) throws {
        let overlayType = JSONValue(string: overlayJson).string(forKey: "type")
        if overlayType != "labelCaptureBasic" && overlayType != "labelCaptureAdvanced" {
            return
        }
        
        guard let mode = labelCapture else {
            return
        }
        
        try dispatchMainSync {
            let overlay: DataCaptureOverlay = (overlayType == "labelCaptureBasic") ?
            try deserializer.basicOverlay(fromJSONString: overlayJson, withMode: mode) :
            try deserializer.advancedOverlay(fromJSONString: overlayJson, withMode: mode)
            
            dataCaptureView?.addOverlay(overlay)
        }
    }
    
    public func dataCaptureView(removeOverlay overlayJson: String) {
        let overlayType = JSONValue(string: overlayJson).string(forKey: "type")
        if overlayType != "labelCaptureBasic" && overlayType != "labelCaptureAdvanced" {
            return
        }
        
       if overlayType == "labelCaptureBasic" {
            removeCurrentBasicaOverlay()
        } else {
             removeCurrentAdvancedOverlay()
        }
    }
    
    public func dataCaptureViewRemoveAllOverlays() {
        removeCurrentBasicaOverlay()
        removeCurrentAdvancedOverlay()
    }
    
    internal func removeCurrentBasicaOverlay() {
        guard let overlay = basicOverlay else {
            return
        }
        
        dispatchMainSync {
            dataCaptureView?.removeOverlay(overlay)
        }
        basicOverlay = nil
    }
    
    internal func removeCurrentAdvancedOverlay() {
        guard let overlay = advancedOverlay else {
            return
        }
        dispatchMainSync {
            dataCaptureView?.removeOverlay(overlay)
        }
        advancedOverlay = nil
    }
}

