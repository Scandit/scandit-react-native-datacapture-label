/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditLabelCapture

extension ScanditDataCaptureLabel: LabelCaptureBasicOverlayDelegate {

    func labelCaptureBasicOverlay(_ overlay: LabelCaptureBasicOverlay, brushFor label: CapturedLabel) -> Brush? {
        let body = ["label": label.jsonString]
        let brush = brushForLabelLock.wait(afterDoing: {
            return sendEvent(withName: .brushForLabel, body: body)
        })
        return brush
    }

    @objc(finishBrushForLabelCallback:)
    func finishBrushForLabelCallback(jsonString: String) {
        let brushForLabel = Brush(jsonString: jsonString)
        brushForLabelLock.unlock(value: brushForLabel)
    }

    func labelCaptureBasicOverlay(_ overlay: LabelCaptureBasicOverlay,
                                  brushFor field: LabelField,
                                  of label: CapturedLabel) -> Brush? {
        let body = ["field": field.jsonString,
                    "label": label.jsonString]

        let brush = brushForFieldLock.wait {
            return sendEvent(withName: .brushForFieldOfLabel, body: body)
        }
        return brush
    }

    @objc(finishBrushForFieldOfLabelCallback:)
    func finishBrushForFieldOfLabelCallback(jsonString: String) {
        let brushForField = Brush(jsonString: jsonString)
        brushForFieldLock.unlock(value: brushForField)
    }

    func labelCaptureBasicOverlay(_ overlay: LabelCaptureBasicOverlay,
                                  didTap label: CapturedLabel) {
        guard sendEvent(withName: .didTapLabel, body: ["label": label.jsonString]) else { return }
    }
}
