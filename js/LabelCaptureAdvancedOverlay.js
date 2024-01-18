"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelCaptureAdvancedOverlay = void 0;
var Serializeable_1 = require("scandit-react-native-datacapture-core/js/private/Serializeable");
var LabelCaptureAdvancedOverlayProxy_1 = require("./native/LabelCaptureAdvancedOverlayProxy");
var LabelCaptureAdvancedOverlay = /** @class */ (function (_super) {
    __extends(LabelCaptureAdvancedOverlay, _super);
    function LabelCaptureAdvancedOverlay() {
        var _this = _super.call(this) || this;
        _this.type = 'labelCaptureAdvanced';
        _this.listener = null;
        _this._shouldShowScanAreaGuides = false;
        _this.proxy = LabelCaptureAdvancedOverlayProxy_1.LabelCaptureAdvancedOverlayProxy.forOverlay(_this);
        return _this;
    }
    Object.defineProperty(LabelCaptureAdvancedOverlay.prototype, "view", {
        get: function () {
            return this._view;
        },
        set: function (newView) {
            if (newView == null) {
                this.proxy.unsubscribeListener();
            }
            else if (this._view == null) {
                this.proxy.subscribeListener();
            }
            this._view = newView;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelCaptureAdvancedOverlay.prototype, "shouldShowScanAreaGuides", {
        get: function () {
            return this._shouldShowScanAreaGuides;
        },
        set: function (shouldShow) {
            this._shouldShowScanAreaGuides = shouldShow;
            this.mode.didChange();
        },
        enumerable: false,
        configurable: true
    });
    LabelCaptureAdvancedOverlay.withLabelCaptureForView = function (labelCapture, view) {
        var overlay = new LabelCaptureAdvancedOverlay();
        overlay.mode = labelCapture;
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    };
    LabelCaptureAdvancedOverlay.prototype.setViewForCapturedLabel = function (capturedLabel, view) {
        return this.proxy.setViewForCapturedLabel(capturedLabel, view);
    };
    LabelCaptureAdvancedOverlay.prototype.setAnchorForCapturedLabel = function (capturedLabel, anchor) {
        return this.proxy.setAnchorForCapturedLabel(capturedLabel, anchor);
    };
    LabelCaptureAdvancedOverlay.prototype.setOffsetForCapturedLabel = function (capturedLabel, offset) {
        return this.proxy.setOffsetForCapturedLabel(capturedLabel, offset);
    };
    LabelCaptureAdvancedOverlay.prototype.clearCapturedLabelViews = function () {
        return this.proxy.clearCapturedLabelViews();
    };
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], LabelCaptureAdvancedOverlay.prototype, "proxy", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], LabelCaptureAdvancedOverlay.prototype, "mode", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], LabelCaptureAdvancedOverlay.prototype, "_view", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], LabelCaptureAdvancedOverlay.prototype, "listener", void 0);
    __decorate([
        (0, Serializeable_1.nameForSerialization)('shouldShowScanAreaGuides')
    ], LabelCaptureAdvancedOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    return LabelCaptureAdvancedOverlay;
}(Serializeable_1.DefaultSerializeable));
exports.LabelCaptureAdvancedOverlay = LabelCaptureAdvancedOverlay;
//# sourceMappingURL=LabelCaptureAdvancedOverlay.js.map