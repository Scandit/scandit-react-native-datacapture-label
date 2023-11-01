"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelCaptureListenerProxy = void 0;
var react_native_1 = require("react-native");
var LabelCaptureSession_1 = require("../LabelCaptureSession");
// tslint:disable:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureLabel;
var EventEmitter = new react_native_1.NativeEventEmitter(NativeModule);
// tslint:enable:variable-name
var LabelCaptureListenerEventName;
(function (LabelCaptureListenerEventName) {
    LabelCaptureListenerEventName["didUpdateSession"] = "labelCaptureListener-didUpdateSession";
})(LabelCaptureListenerEventName || (LabelCaptureListenerEventName = {}));
var LabelCaptureListenerProxy = /** @class */ (function () {
    function LabelCaptureListenerProxy() {
        this.nativeListeners = [];
    }
    LabelCaptureListenerProxy.forLabelCapture = function (labelCapture) {
        var proxy = new LabelCaptureListenerProxy();
        proxy.mode = labelCapture;
        return proxy;
    };
    LabelCaptureListenerProxy.prototype.subscribeListener = function () {
        var _this = this;
        NativeModule.registerListenerForEvents();
        var listener = EventEmitter.addListener(LabelCaptureListenerEventName.didUpdateSession, function (body) {
            var session = LabelCaptureSession_1.LabelCaptureSession.fromJSON(JSON.parse(body.session));
            _this.notifyListenersOfDidUpdateSession(session);
            NativeModule.finishDidUpdateSessionCallback(_this.mode.isEnabled);
        });
        this.nativeListeners.push(listener);
    };
    LabelCaptureListenerProxy.prototype.unsubscribeListener = function () {
        NativeModule.unregisterListenerForEvents();
        this.nativeListeners.forEach(function (listener) { return listener.remove(); });
        this.nativeListeners = [];
    };
    LabelCaptureListenerProxy.prototype.notifyListenersOfDidUpdateSession = function (session) {
        var _this = this;
        var mode = this.mode;
        mode.isInListenerCallback = true;
        mode.listeners.forEach(function (listener) {
            if (listener.didUpdateSession) {
                listener.didUpdateSession(_this.mode, session);
            }
        });
        mode.isInListenerCallback = false;
    };
    return LabelCaptureListenerProxy;
}());
exports.LabelCaptureListenerProxy = LabelCaptureListenerProxy;
//# sourceMappingURL=LabelCaptureListenerProxy.js.map