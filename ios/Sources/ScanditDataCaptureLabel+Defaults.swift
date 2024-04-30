/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditLabelCapture
import ScanditDataCaptureCore

extension ScanditDataCaptureLabel {
    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["Defaults": defaults]
    }

    var defaults: [String: Any] {
        return ["LabelCapture": labelCaptureDefaults]
    }

    var labelCaptureDefaults: [String: Any] {
        return ["RecommendedCameraSettings": recommendedCameraSettings,
                "LabelCaptureBasicOverlay": labelCaptureBasicOverlay]
    }

    var recommendedCameraSettings: [AnyHashable: Any] {
        return LabelCapture.recommendedCameraSettings.rntsdc_dictionary
    }

    var labelCaptureBasicOverlay: [String: Any] {
        return ["DefaultPredictedFieldBrush": LabelCaptureBasicOverlay.defaultPredictedFieldBrush.rntsdc_dictionary,
                "DefaultCapturedFieldBrush": LabelCaptureBasicOverlay.defaultCapturedFieldBrush.rntsdc_dictionary,
                "DefaultLabelBrush": LabelCaptureBasicOverlay.defaultLabelBrush.rntsdc_dictionary]
    }
}
