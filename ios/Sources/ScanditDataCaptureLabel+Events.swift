/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation

enum ScanditDataCaptureLabelEvent: String, CaseIterable {
    case didUpdateSession = "labelCaptureListener-didUpdateSession"
    case brushForFieldOfLabel = "labelCaptureBasicOverlayListener-brushForFieldOfLabel"
    case brushForLabel = "labelCaptureBasicOverlayListener-brushForLabel"
    case didTapLabel = "labelCaptureBasicOverlayListener-didTapLabel"
    case viewForLabel = "labelCaptureAdvancedOverlayListener-viewForLabel"
    case anchorForLabel = "labelCaptureAdvancedOverlayListener-anchorForLabel"
    case offsetForLabel = "labelCaptureAdvancedOverlayListener-offsetForLabel"
}

extension ScanditDataCaptureLabel {
    override func supportedEvents() -> [String]! {
        return ScanditDataCaptureLabelEvent.allCases.map({$0.rawValue})
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
        unlockLocks()
    }

    func sendEvent(withName name: ScanditDataCaptureLabelEvent, body: Any!) -> Bool {
        guard hasListeners else { return false }
        sendEvent(withName: name.rawValue, body: body)
        return true
    }
}
