/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2023- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditLabelCapture
import ScanditDataCaptureCore

extension ScanditDataCaptureLabel: LabelCaptureAdvancedOverlayDelegate {
    func labelCaptureAdvancedOverlay(_ overlay: LabelCaptureAdvancedOverlay, viewFor capturedLabel: CapturedLabel) -> UIView? {
        let body = ["label": capturedLabel.jsonString]
        guard let jsView = viewForLabelLock.wait(afterDoing: {
            return sendEvent(withName: .viewForLabel, body: body)
        }) else {
            return nil
        }
        
        return rootViewWith(jsView: jsView, label: capturedLabel)
    }
    
    func labelCaptureAdvancedOverlay(_ overlay: LabelCaptureAdvancedOverlay, anchorFor capturedLabel: CapturedLabel) -> Anchor {
        let body = ["label": capturedLabel.jsonString]
        guard let anchor = anchorForLabelLock.wait(afterDoing: {
            return sendEvent(withName: .anchorForLabel, body: body)
        }) else {
            return .center
        }

        return anchor
    }
    
    func labelCaptureAdvancedOverlay(_ overlay: LabelCaptureAdvancedOverlay, offsetFor capturedLabel: CapturedLabel) -> PointWithUnit {
        let body = ["label": capturedLabel.jsonString]
        guard let offset = offsetForLabelLock.wait(afterDoing: {
            return sendEvent(withName: .offsetForLabel, body: body)
        }) else {
            let labelOffset = self.offset[capturedLabel.trackingId]
            self.offset.removeValue(forKey: capturedLabel.trackingId)
            return labelOffset ?? .zero
        }

        return offset
    }
    
    @objc(finishViewForLabelCallback:)
    func finishViewForLabelCallback(jsonString: String?) {
        guard let jsonString = jsonString else {
            viewForLabelLock.unlock(value: nil)
            return
        }

        guard
            let configuration = try? JSONSerialization.jsonObject(with: jsonString.data(using: .utf8)!,
                                                                  options: []) as? [String: Any],
            let jsView = try? JSView(with: configuration) else {
                fatalError("\(jsonString) is not a valid JSView.")
        }
        viewForLabelLock.unlock(value: jsView)
    }
    
    @objc(finishAnchorForLabelCallback:)
    func finishAnchorForLabelCallback(jsonString: String) {
        var anchor = Anchor.center
        SDCAnchorFromJSONString(jsonString, &anchor)
        anchorForLabelLock.unlock(value: anchor)
    }

    @objc(finishOffsetForLabelCallback:)
    func finishOffsetForLabelCallback(jsonString: String) {
        var offset = PointWithUnit.zero
        SDCPointWithUnitFromJSONString(jsonString, &offset)
        offsetForLabelLock.unlock(value: offset)
    }
}
