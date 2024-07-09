/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditLabelCapture

extension ScanditDataCaptureLabel: LabelCaptureListener {
    func labelCapture(_ labelCapture: LabelCapture, didUpdate session: LabelCaptureSession, frameData: FrameData) {
        let body = ["session": session.jsonString]

        lastFrameSequenceId = session.frameSequenceId
        lastCapturedLabels = session.capturedLabels

        guard let value = didUpdateSessionLock.wait(afterDoing: {
            return sendEvent(withName: .didUpdateSession, body: body)
        }) else { return }
        labelCapture.isEnabled = value
    }

    @objc(finishDidUpdateSessionCallback:)
    func finishDidUpdateSessionCallback(enabled: Bool) {
        didUpdateSessionLock.unlock(value: enabled)
    }
}
