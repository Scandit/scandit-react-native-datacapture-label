/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
import ScanditDataCaptureBarcode
import ScanditDataCaptureCore
import ScanditFrameworksCore
import ScanditFrameworksLabel
import ScanditLabelCapture

@objc(ScanditDataCaptureLabel)
class ScanditDataCaptureLabel: RCTEventEmitter {

    var labelModule: LabelModule!

    var trackedLabelViewCache: [RCTRootView: (CapturedLabel, LabelField?)] = [:]

    override init() {
        super.init()
        let emitter = ReactNativeEmitter(emitter: self)
        let listener = FrameworksLabelCaptureListener(emitter: emitter)
        let basicOverlayListener = FrameworksLabelCaptureBasicOverlayListener(emitter: emitter)
        let advancedOverlayListener = FrameworksLabelCaptureAdvancedOverlayListener(emitter: emitter)
        labelModule = LabelModule(emitter: emitter,
                                  listener: listener,
                                  basicOverlayListener: basicOverlayListener,
                                  advancedOverlayListener: advancedOverlayListener
                                  )
        labelModule.didStart()
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return sdcSharedMethodQueue
    }

    @objc override func invalidate() {
        super.invalidate()
        trackedLabelViewCache.removeAll()
        labelModule.didStop()
    }

    deinit {
        invalidate()
    }

    override func constantsToExport() -> [AnyHashable : Any]! {
        [
            "Defaults": [
                "LabelCapture": labelModule.defaults
            ]
        ]
    }

    override func supportedEvents() -> [String]! {
        FrameworksLabelCaptureEvent.allCases.map { $0.rawValue }
    }

    // MARK: - Module API

    @objc(finishDidUpdateSessionCallback:)
    func finishDidUpdateSessionCallback(enabled: Bool) {
        labelModule.finishDidUpdateCallback(enabled: enabled)
    }

    @objc(setModeEnabledState:)
    func setModeEnabledState(enabled: Bool) {
        labelModule.setModeEnabled(enabled: enabled)
    }

    @objc(setBrushForFieldOfLabel:fieldName:labelId:resolver:rejecter:)
    func setBrushForFieldOfLabel(brushJson: String?,
                                 fieldName: String,
                                 labelId: Int,
                                 resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        let brushForFieldOfLabel = BrushForLabelField(brushJson: brushJson,
                                                      labelTrackingId: labelId,
                                                      fieldName: fieldName)
                                     labelModule.setBrushForFieldOfLabel(brushForFieldOfLabel: brushForFieldOfLabel,
                                                                         result: .create(resolve, reject))
    }

    @objc(setBrushForLabel:labelId:resolver:rejecter:)
    func setBrushForLabel(brushJson: String?,
                          labelId: Int,
                          resolve: @escaping RCTPromiseResolveBlock,
                          reject: @escaping RCTPromiseRejectBlock) {
        let brushForLabel = BrushForLabelField(brushJson: brushJson,
                                               labelTrackingId: labelId)
                              labelModule.setBrushForLabel(brushForLabel: brushForLabel, result: .create(resolve, reject))
    }

    @objc(setViewForFieldOfLabel:fieldName:labelId:resolver:rejecter:)
    func setViewForFieldOfLabel(viewJson: String?,
                                fieldName: String,
                                labelId: Int,
                                resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        let result = ReactNativeResult.create(resolve, reject)
                                    do {
                                        if let viewJson = viewJson {
                                            let config = try JSONSerialization.jsonObject(with: viewJson.data(using: .utf8)!,
                                                                                          options: []) as! [String: Any]
                                            let jsView = try JSView(with: config)
                                            try dispatchMainSync {
                                                let rootView = rootViewWith(jsView: jsView)
                                                let (label, field) = try labelModule.labelAndField(for: labelId,
                                                                                                   fieldName: fieldName)
                                                trackedLabelViewCache[rootView] = (label, field)
                                                let viewForLabelField = ViewForLabel(view: rootView,
                                                                                     trackingId: label.trackingId,
                                                                                     fieldName: field.name)
                                                labelModule.setViewForFieldOfLabel(viewForFieldOfLabel: viewForLabelField, result: result)
                                                return
                                            }
                                        }
                                    } catch {
                                        result.reject(error: error)
                                        return
                                    }
                                    let viewForLabelField = ViewForLabel(view: nil,
                                                                         trackingId: labelId,
                                                                         fieldName: fieldName)
                                    labelModule.setViewForFieldOfLabel(viewForFieldOfLabel: viewForLabelField, result: result)
    }

    @objc(setViewForCapturedLabel:labelId:resolver:rejecter:)
    func setViewForCapturedLabel(viewJson: String?,                                
                                 labelId: Int,
                                 resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        let result = ReactNativeResult.create(resolve, reject)
                                     do {
                                         if let viewJson = viewJson {
                                             let config = try JSONSerialization.jsonObject(with: viewJson.data(using: .utf8)!,
                                                                                           options: []) as! [String: Any]
                                             let jsView = try JSView(with: config)
                                             try dispatchMainSync {
                                                 let rootView = rootViewWith(jsView: jsView)
                                                 let label = try labelModule.label(for: labelId)
                                                 trackedLabelViewCache[rootView] = (label, nil)
                                                 let viewForLabel = ViewForLabel(view: rootView,
                                                                                 trackingId: label.trackingId)
                                                 labelModule.setViewForCapturedLabel(viewForLabel: viewForLabel, result: result)
                                                 return
                                             }
                                         }
                                     } catch {
                                         result.reject(error: error)
                                         return
                                     }
                                     let viewForLabel = ViewForLabel(view: nil,
                                                                     trackingId: labelId)
                                     labelModule.setViewForCapturedLabel(viewForLabel: viewForLabel, result: result)
    }

    @objc(setAnchorForFieldOfLabel:fieldName:labelId:resolver:rejecter:)
    func setAnchorForFieldOfLabel(anchorJson: String,
                                  fieldName: String,
                                  labelId: Int,
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        let anchorForFieldOfLabel = AnchorForLabel(anchorString: anchorJson,
                                                   trackingId: labelId,
                                                   fieldName: fieldName)
                                      labelModule.setAnchorForFieldOfLabel(anchorForFieldOfLabel: anchorForFieldOfLabel, result: .create(resolve, reject))
    }

    @objc(setAnchorForCapturedLabel:labelId:resolver:rejecter:)
    func setAnchorForCapturedLabel(anchorJson: String,
                                   labelId: Int,
                                   resolve: @escaping RCTPromiseResolveBlock,
                                   reject: @escaping RCTPromiseRejectBlock) {
        let anchorForFieldOfLabel = AnchorForLabel(anchorString: anchorJson,
                                                   trackingId: labelId)
                                       labelModule.setAnchorForCapturedLabel(anchorForLabel: anchorForFieldOfLabel, result: .create(resolve, reject))
    }

    @objc(setOffsetForFieldOfLabel:fieldName:labelId:resolver:rejecter:)
    func setOffsetForFieldOfLabel(offsetJson: String,
                                  fieldName: String,
                                  labelId: Int,
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        let offsetForFieldOfLabel = OffsetForLabel(offsetJson: offsetJson,
                                                   trackingId: labelId,
                                                   fieldName: fieldName)
                                      labelModule.setOffsetForFieldOfLabel(offsetForFieldOfLabel: offsetForFieldOfLabel,
                                                                           result: .create(resolve, reject))
    }

    @objc(setOffsetForCapturedLabel:labelId:resolver:rejecter:)
    func setOffsetForCapturedLabel(offsetJson: String,                                   
                                   labelId: Int,
                                   resolve: @escaping RCTPromiseResolveBlock,
                                   reject: @escaping RCTPromiseRejectBlock) {
        let offsetForCapturedLabel = OffsetForLabel(offsetJson: offsetJson,
                                                    trackingId: labelId)
                                       labelModule.setOffsetForCapturedLabel(offsetForLabel: offsetForCapturedLabel,
                                                                             result: .create(resolve, reject))
    }

    @objc(clearTrackedCapturedLabelViews:rejecter:)
    func clearTrackedCapturedLabelViews(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        labelModule.clearTrackedCapturedLabelViews()
        dispatchMainSync {
            trackedLabelViewCache.removeAll()
        }
        resolve(nil)
    }

    @objc func registerListenerForEvents() {
        labelModule.addListener()
    }

    @objc func unregisterListenerForEvents() {
        labelModule.removeListener()
    }

    @objc func registerListenerForBasicOverlayEvents() {
        labelModule.addBasicOverlayListener()
    }

    @objc func unregisterListenerForBasicOverlayEvents() {
        labelModule.removeBasicOverlayListener()
    }

    @objc func registerListenerForAdvancedOverlayEvents() {
        labelModule.addAdvancedOverlayListener()
    }

    @objc func unregisterListenerForAdvancedOverlayEvents() {
        labelModule.removeAdvancedOverlayListener()
    }

    @objc(updateLabelCaptureBasicOverlay:resolve:reject:)
    func updateLabelCaptureBasicOverlay(overlayJson: String,
                                        resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        labelModule.updateBasicOverlay(overlayJson: overlayJson, result: .create(resolve, reject))
    }

    @objc(updateLabelCaptureAdvancedOverlay:resolve:reject:)
    func updateLabelCaptureAdvancedOverlay(overlayJson: String,
                                           resolve: @escaping RCTPromiseResolveBlock,
                                           reject: @escaping RCTPromiseRejectBlock) {
        labelModule.updateAdvancedOverlay(overlayJson: overlayJson, result: .create(resolve, reject))
    }

    @objc(applyLabelCaptureModeSettings:resolve:reject:)
    func applyLabelCaptureModeSettings(settingsJson: String,
                                       resolve: @escaping RCTPromiseResolveBlock,
                                       reject: @escaping RCTPromiseRejectBlock) {
        labelModule.applyModeSettings(modeSettingsJson: settingsJson, result: .create(resolve, reject))
    }

    private func rootViewWith(jsView: JSView) -> ScanditRootView {
        // To support self sizing js views we need to leverage the RCTRootViewDelegate
        // see https://reactnative.dev/docs/communication-ios
        let view = ScanditRootView(bridge: bridge,
                                   moduleName: jsView.moduleName,
                                   initialProperties: jsView.initialProperties)
        view.sizeFlexibility = .widthAndHeight
        view.delegate = self
        view.backgroundColor = .clear
        view.isUserInteractionEnabled = true
        view.addGestureRecognizer(TapGestureRecognizerWithClosure { [weak view] in
            guard let view = view else { return }
            view.didTap?()
        })
        return view
    }
}

extension ScanditDataCaptureLabel: RCTRootViewDelegate {
    func rootViewDidChangeIntrinsicSize(_ rootView: RCTRootView!) {
        guard let view = rootView as? ScanditRootView else { return }
        rootView.bounds.size = rootView.intrinsicContentSize
        guard let (label, field) = trackedLabelViewCache[view] else {
            // Barcode was lost before the view updated its size.
            return
        }
        let viewForLabel = ViewForLabel(view: view, trackingId: label.trackingId, fieldName: field?.name)
        if let field = field {
            labelModule.setViewForFieldOfLabel(viewForFieldOfLabel: viewForLabel)
        } else {
            labelModule.setViewForCapturedLabel(viewForLabel: viewForLabel)
        }
    }
}
