/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import ScanditLabelCapture
import ScanditDataCaptureCore

extension ScanditDataCaptureLabel {
    func registerDeserializer() {
        deserializer.delegate = self
        ScanditDataCaptureCore.register(modeDeserializer: deserializer)
    }
    
    func unregisterDeserializer() {
        deserializer.delegate = nil
        ScanditDataCaptureCore.unregister(modeDeserializer: deserializer)
    }
}

extension ScanditDataCaptureLabel: LabelCaptureDeserializerDelegate {
    func labelCaptureDeserializer(_ deserializer: LabelCaptureDeserializer,
                                  didStartDeserializingMode mode: LabelCapture,
                                  from jsonValue: JSONValue) {
        // Empty on purpose
    }

    func labelCaptureDeserializer(_ deserializer: LabelCaptureDeserializer,
                                  didFinishDeserializingMode mode: LabelCapture,
                                  from jsonValue: JSONValue) {
        if jsonValue.containsKey("enabled") {
            mode.isEnabled = jsonValue.bool(forKey: "enabled")
        }
        mode.addListener(self)
    }

    func labelCaptureDeserializer(_ deserializer: LabelCaptureDeserializer,
                                  didStartDeserializingSettings settings: LabelCaptureSettings,
                                  from jsonValue: JSONValue) {
        // Empty on purpose
    }

    func labelCaptureDeserializer(_ deserializer: LabelCaptureDeserializer,
                                  didFinishDeserializingSettings settings: LabelCaptureSettings,
                                  from jsonValue: JSONValue) {
        // Empty on purpose
    }

    func labelCaptureDeserializer(_ deserializer: LabelCaptureDeserializer,
                                  didStartDeserializingBasicOverlay overlay: LabelCaptureBasicOverlay,
                                  from jsonValue: JSONValue) {
        // Empty on purpose
    }

    func labelCaptureDeserializer(_ deserializer: LabelCaptureDeserializer,
                                  didFinishDeserializingBasicOverlay overlay: LabelCaptureBasicOverlay,
                                  from jsonValue: JSONValue) {
        self.overlay = overlay
        overlay.delegate = self
    }

    func labelCaptureDeserializer(_ deserializer: LabelCaptureDeserializer,
                                  didStartDeserializingAdvancedOverlay overlay: LabelCaptureAdvancedOverlay,
                                  from jsonValue: JSONValue) {
        // Empty on purpose
    }

    func labelCaptureDeserializer(_ deserializer: LabelCaptureDeserializer,
                                  didFinishDeserializingAdvancedOverlay overlay: LabelCaptureAdvancedOverlay,
                                  from jsonValue: JSONValue) {
        advancedOverlay = overlay
        advancedOverlay?.delegate = self
    }
}
