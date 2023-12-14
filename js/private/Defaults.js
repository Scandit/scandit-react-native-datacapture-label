"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Defaults = void 0;
var react_native_1 = require("react-native");
var Camera_Related_1 = require("scandit-react-native-datacapture-core/js/Camera+Related");
var Common_1 = require("scandit-react-native-datacapture-core/js/Common");
// tslint:disable-next-line:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureLabel;
// tslint:disable-next-line:variable-name
exports.Defaults = {
    LabelCapture: {
        RecommendedCameraSettings: Camera_Related_1.CameraSettings
            .fromJSON(NativeModule.Defaults.LabelCapture.RecommendedCameraSettings),
        LabelCaptureBasicOverlay: {
            DefaultPredictedFieldBrush: {
                fillColor: Common_1.Color
                    .fromJSON(NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.fillColor),
                strokeColor: Common_1.Color
                    .fromJSON(NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.strokeColor),
                strokeWidth: NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.strokeWidth,
            },
            DefaultCapturedFieldBrush: {
                fillColor: Common_1.Color
                    .fromJSON(NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.fillColor),
                strokeColor: Common_1.Color
                    .fromJSON(NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.strokeColor),
                strokeWidth: NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.strokeWidth,
            },
            DefaultLabelBrush: {
                fillColor: Common_1.Color
                    .fromJSON(NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.fillColor),
                strokeColor: Common_1.Color
                    .fromJSON(NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.strokeColor),
                strokeWidth: NativeModule.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.strokeWidth,
            },
        },
    },
};
//# sourceMappingURL=Defaults.js.map