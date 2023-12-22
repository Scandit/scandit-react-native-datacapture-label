/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
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

    // LabelCaptureBasicOverlayListener
    internal var overlay: LabelCaptureBasicOverlay?

    // LabelCaptureAdvancedOverlayListener
    internal let viewForLabelLock =
        CallbackLock<JSView>(name: ScanditDataCaptureLabelEvent.viewForLabel.rawValue)
    internal let anchorForLabelLock =
        CallbackLock<Anchor>(name: ScanditDataCaptureLabelEvent.anchorForLabel.rawValue)
    internal let offsetForLabelLock =
        CallbackLock<PointWithUnit>(name: ScanditDataCaptureLabelEvent.offsetForLabel.rawValue)

    internal var advancedOverlay: LabelCaptureAdvancedOverlay?

    override init() {
        super.init()
        registerDeserializer()
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
        capturedLabelViewCache.removeAll()
        lastCapturedLabels?.removeAll()
        lastFrameSequenceId = nil
        overlay = nil
        unlockLocks()
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
}
