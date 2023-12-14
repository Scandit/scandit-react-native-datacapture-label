"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelCaptureAdvancedOverlayProxy = void 0;
var react_native_1 = require("react-native");
var Common_1 = require("scandit-react-native-datacapture-core/js/Common");
var LabelCaptureSession_1 = require("../LabelCaptureSession");
var CommonEnums_1 = require("scandit-react-native-datacapture-core/js/CommonEnums");
// tslint:disable:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureLabel;
var EventEmitter = new react_native_1.NativeEventEmitter(NativeModule);
// tslint:enable:variable-name
var LabelCaptureAdvancedOverlayListenerEventName;
(function (LabelCaptureAdvancedOverlayListenerEventName) {
    LabelCaptureAdvancedOverlayListenerEventName["viewForLabel"] = "labelCaptureAdvancedOverlayListener-viewForLabel";
    LabelCaptureAdvancedOverlayListenerEventName["anchorForLabel"] = "labelCaptureAdvancedOverlayListener-anchorForLabel";
    LabelCaptureAdvancedOverlayListenerEventName["offsetForLabel"] = "labelCaptureAdvancedOverlayListener-offsetForLabel";
})(LabelCaptureAdvancedOverlayListenerEventName || (LabelCaptureAdvancedOverlayListenerEventName = {}));
var LabelCaptureAdvancedOverlayProxy = /** @class */ (function () {
    function LabelCaptureAdvancedOverlayProxy() {
        this.nativeListeners = [];
    }
    LabelCaptureAdvancedOverlayProxy.forOverlay = function (overlay) {
        var proxy = new LabelCaptureAdvancedOverlayProxy();
        proxy.overlay = overlay;
        return proxy;
    };
    LabelCaptureAdvancedOverlayProxy.prototype.setViewForCapturedLabel = function (label, view) {
        return NativeModule.setViewForCapturedLabel(this.getJSONStringForView(view), label.frameSequenceID, label.trackingID);
    };
    LabelCaptureAdvancedOverlayProxy.prototype.setAnchorForCapturedLabel = function (label, anchor) {
        return NativeModule.setAnchorForCapturedLabel(anchor, label.frameSequenceID, label.trackingID);
    };
    LabelCaptureAdvancedOverlayProxy.prototype.setOffsetForCapturedLabel = function (label, offset) {
        return NativeModule.setOffsetForCapturedLabel(JSON.stringify(offset.toJSON()), label.frameSequenceID, label.trackingID);
    };
    LabelCaptureAdvancedOverlayProxy.prototype.clearCapturedLabelViews = function () {
        return NativeModule.clearCapturedLabelViews();
    };
    LabelCaptureAdvancedOverlayProxy.prototype.subscribeListener = function () {
        var _this = this;
        NativeModule.registerListenerForAdvancedOverlayEvents();
        var viewForLabelListener = EventEmitter.addListener(LabelCaptureAdvancedOverlayListenerEventName.viewForLabel, function (body) {
            var view = null;
            if (_this.overlay.listener && _this.overlay.listener.viewForCapturedLabel) {
                var label = LabelCaptureSession_1.CapturedLabel.fromJSON(JSON.parse(body.label));
                view = _this.overlay.listener.viewForCapturedLabel(_this.overlay, label);
            }
            NativeModule.finishViewForLabelCallback(_this.getJSONStringForView(view));
        });
        var anchorForLabelListener = EventEmitter.addListener(LabelCaptureAdvancedOverlayListenerEventName.anchorForLabel, function (body) {
            var anchor = CommonEnums_1.Anchor.Center;
            if (_this.overlay.listener && _this.overlay.listener.anchorForCapturedLabel) {
                var label = LabelCaptureSession_1.CapturedLabel.fromJSON(JSON.parse(body.label));
                anchor = _this.overlay.listener.anchorForCapturedLabel(_this.overlay, label);
            }
            NativeModule.finishAnchorForLabelCallback(anchor);
        });
        var offsetForLabelListener = EventEmitter.addListener(LabelCaptureAdvancedOverlayListenerEventName.offsetForLabel, function (body) {
            var offset = Common_1.PointWithUnit.zero;
            if (_this.overlay.listener && _this.overlay.listener.offsetForCapturedLabel) {
                var label = LabelCaptureSession_1.CapturedLabel.fromJSON(JSON.parse(body.label));
                offset = _this.overlay.listener.offsetForCapturedLabel(_this.overlay, label);
            }
            NativeModule.finishOffsetForLabelCallback(JSON.stringify(offset.toJSON()));
        });
        this.nativeListeners.push(viewForLabelListener);
        this.nativeListeners.push(anchorForLabelListener);
        this.nativeListeners.push(offsetForLabelListener);
    };
    LabelCaptureAdvancedOverlayProxy.prototype.unsubscribeListener = function () {
        NativeModule.unregisterListenerForAdvancedOverlayEvents();
        this.nativeListeners.forEach(function (listener) { return listener.remove(); });
        this.nativeListeners = [];
    };
    LabelCaptureAdvancedOverlayProxy.prototype.getJSONStringForView = function (view) {
        if (view == null) {
            return null;
        }
        if (!view.moduleName) {
            throw new Error('View must have moduleName defined');
        }
        if (!this.isSerializeable(view.props)) {
            // react-navigation does something like this: https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
            throw new Error('Non-serializable values were found in the view passed passed to a LabelCaptureAdvancedOverlay, which can break usage. This might happen if you have non-serializable values such as function, class instances etc. in the props for the view component that you are passing.');
        }
        var viewJSON = {
            moduleName: view.moduleName,
            initialProperties: view.props,
        };
        return JSON.stringify(viewJSON);
    };
    LabelCaptureAdvancedOverlayProxy.prototype.isSerializeable = function (o) {
        var e_1, _a;
        if (o === undefined || o === null ||
            typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
            return true;
        }
        if (Object.prototype.toString.call(o) !== '[object Object]' &&
            !Array.isArray(o)) {
            return false;
        }
        if (Array.isArray(o)) {
            try {
                for (var o_1 = __values(o), o_1_1 = o_1.next(); !o_1_1.done; o_1_1 = o_1.next()) {
                    var it = o_1_1.value;
                    if (!this.isSerializeable(it)) {
                        return false;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (o_1_1 && !o_1_1.done && (_a = o_1.return)) _a.call(o_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            for (var key in o) {
                if (!this.isSerializeable(o[key])) {
                    return false;
                }
            }
        }
        return true;
    };
    return LabelCaptureAdvancedOverlayProxy;
}());
exports.LabelCaptureAdvancedOverlayProxy = LabelCaptureAdvancedOverlayProxy;
//# sourceMappingURL=LabelCaptureAdvancedOverlayProxy.js.map