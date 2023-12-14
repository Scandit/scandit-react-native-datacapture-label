"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelCaptureBasicOverlayProxy = void 0;
var react_native_1 = require("react-native");
var LabelCaptureSession_1 = require("../LabelCaptureSession");
// tslint:disable:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureLabel;
var EventEmitter = new react_native_1.NativeEventEmitter(NativeModule);
// tslint:enable:variable-name
var LabelCaptureBasicOverlayListenerEventName;
(function (LabelCaptureBasicOverlayListenerEventName) {
    LabelCaptureBasicOverlayListenerEventName["brushForFieldOfLabel"] = "labelCaptureBasicOverlayListener-brushForFieldOfLabel";
    LabelCaptureBasicOverlayListenerEventName["brushForLabel"] = "labelCaptureBasicOverlayListener-brushForLabel";
    LabelCaptureBasicOverlayListenerEventName["didTapLabel"] = "labelCaptureBasicOverlayListener-didTapLabel";
})(LabelCaptureBasicOverlayListenerEventName || (LabelCaptureBasicOverlayListenerEventName = {}));
var LabelCaptureBasicOverlayProxy = /** @class */ (function () {
    function LabelCaptureBasicOverlayProxy() {
        this.nativeListeners = [];
    }
    LabelCaptureBasicOverlayProxy.forOverlay = function (overlay) {
        var proxy = new LabelCaptureBasicOverlayProxy();
        proxy.overlay = overlay;
        return proxy;
    };
    LabelCaptureBasicOverlayProxy.prototype.setBrushForFieldOfLabel = function (brush, field, label) {
        return NativeModule.setBrushForFieldOfLabel(JSON.stringify(brush.toJSON()), label.frameSequenceID, field.name, label.trackingID);
    };
    LabelCaptureBasicOverlayProxy.prototype.setBrushForLabel = function (brush, label) {
        return NativeModule.setBrushForLabel(JSON.stringify(brush.toJSON()), label.frameSequenceID, label.trackingID);
    };
    LabelCaptureBasicOverlayProxy.prototype.subscribeListener = function () {
        var _this = this;
        NativeModule.registerListenerForBasicOverlayEvents();
        var brushForFieldListener = EventEmitter.addListener(LabelCaptureBasicOverlayListenerEventName.brushForFieldOfLabel, function (body) {
            var brush = _this.overlay.capturedFieldBrush;
            if (_this.overlay.listener && _this.overlay.listener.brushForFieldOfLabel) {
                var field = LabelCaptureSession_1.LabelField.fromJSON(JSON.parse(body.field));
                var label = LabelCaptureSession_1.CapturedLabel.fromJSON(JSON.parse(body.label));
                brush = _this.overlay.listener.brushForFieldOfLabel(_this.overlay, field, label);
            }
            NativeModule.finishBrushForFieldOfLabelCallback(brush ? JSON.stringify(brush.toJSON()) : null);
        });
        var brushForLabelListener = EventEmitter.addListener(LabelCaptureBasicOverlayListenerEventName.brushForLabel, function (body) {
            var brush = _this.overlay.labelBrush;
            if (_this.overlay.listener && _this.overlay.listener.brushForLabel) {
                var label = LabelCaptureSession_1.CapturedLabel.fromJSON(JSON.parse(body.label));
                brush = _this.overlay.listener.brushForLabel(_this.overlay, label);
            }
            NativeModule.finishBrushForLabelCallback(brush ? JSON.stringify(brush.toJSON()) : null);
        });
        var didTapLabelListener = EventEmitter.addListener(LabelCaptureBasicOverlayListenerEventName.didTapLabel, function (body) {
            if (_this.overlay.listener && _this.overlay.listener.didTapLabel) {
                var label = LabelCaptureSession_1.CapturedLabel.fromJSON(JSON.parse(body.label));
                _this.overlay.listener.didTapLabel(_this.overlay, label);
            }
        });
        this.nativeListeners.push(brushForFieldListener);
        this.nativeListeners.push(brushForLabelListener);
        this.nativeListeners.push(didTapLabelListener);
    };
    LabelCaptureBasicOverlayProxy.prototype.unsubscribeListener = function () {
        NativeModule.unregisterListenerForBasicOverlayEvents();
        this.nativeListeners.forEach(function (listener) { return listener.remove(); });
        this.nativeListeners = [];
    };
    return LabelCaptureBasicOverlayProxy;
}());
exports.LabelCaptureBasicOverlayProxy = LabelCaptureBasicOverlayProxy;
//# sourceMappingURL=LabelCaptureBasicOverlayProxy.js.map