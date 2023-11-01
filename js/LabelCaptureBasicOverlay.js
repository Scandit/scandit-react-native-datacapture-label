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
exports.LabelCaptureBasicOverlay = void 0;
var Common_1 = require("scandit-react-native-datacapture-core/js/Common");
var Serializeable_1 = require("scandit-react-native-datacapture-core/js/private/Serializeable");
var Viewfinder_1 = require("scandit-react-native-datacapture-core/js/Viewfinder");
var LabelCaptureBasicOverlayProxy_1 = require("./native/LabelCaptureBasicOverlayProxy");
var Defaults_1 = require("./private/Defaults");
var LabelCaptureBasicOverlay = /** @class */ (function (_super) {
    __extends(LabelCaptureBasicOverlay, _super);
    function LabelCaptureBasicOverlay() {
        var _this = _super.call(this) || this;
        _this.type = 'labelCaptureBasic';
        _this._predictedFieldBrush = LabelCaptureBasicOverlay.defaultPredictedFieldBrush.copy;
        _this._capturedFieldBrush = LabelCaptureBasicOverlay.defaultCapturedFieldBrush.copy;
        _this._labelBrush = LabelCaptureBasicOverlay.defaultLabelBrush.copy;
        _this._shouldShowScanAreaGuides = false;
        _this.listener = null;
        _this._viewfinder = null;
        _this.proxy = LabelCaptureBasicOverlayProxy_1.LabelCaptureBasicOverlayProxy.forOverlay(_this);
        return _this;
    }
    Object.defineProperty(LabelCaptureBasicOverlay, "defaultPredictedFieldBrush", {
        get: function () {
            return new Common_1.Brush(Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.fillColor, Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.strokeColor, Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.strokeWidth);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelCaptureBasicOverlay, "defaultCapturedFieldBrush", {
        get: function () {
            return new Common_1.Brush(Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.fillColor, Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.strokeColor, Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.strokeWidth);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelCaptureBasicOverlay, "defaultLabelBrush", {
        get: function () {
            return new Common_1.Brush(Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.fillColor, Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.strokeColor, Defaults_1.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.strokeWidth);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelCaptureBasicOverlay.prototype, "view", {
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
    Object.defineProperty(LabelCaptureBasicOverlay.prototype, "predictedFieldBrush", {
        get: function () {
            return this._predictedFieldBrush;
        },
        set: function (newBrush) {
            this._predictedFieldBrush = newBrush;
            this.mode.didChange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelCaptureBasicOverlay.prototype, "capturedFieldBrush", {
        get: function () {
            return this._capturedFieldBrush;
        },
        set: function (newBrush) {
            this._capturedFieldBrush = newBrush;
            this.mode.didChange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelCaptureBasicOverlay.prototype, "labelBrush", {
        get: function () {
            return this._labelBrush;
        },
        set: function (newBrush) {
            this._labelBrush = newBrush;
            this.mode.didChange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelCaptureBasicOverlay.prototype, "shouldShowScanAreaGuides", {
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
    Object.defineProperty(LabelCaptureBasicOverlay.prototype, "viewfinder", {
        get: function () {
            return this._viewfinder;
        },
        set: function (newViewfinder) {
            this._viewfinder = newViewfinder;
            this.mode.didChange();
        },
        enumerable: false,
        configurable: true
    });
    LabelCaptureBasicOverlay.withLabelCapture = function (labelCapture) {
        return LabelCaptureBasicOverlay.withLabelCaptureForView(labelCapture, null);
    };
    LabelCaptureBasicOverlay.withLabelCaptureForView = function (labelCapture, view) {
        var overlay = new LabelCaptureBasicOverlay();
        overlay.mode = labelCapture;
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    };
    LabelCaptureBasicOverlay.prototype.setBrushForFieldOfLabel = function (brush, field, label) {
        return this.proxy.setBrushForFieldOfLabel(brush, field, label);
    };
    LabelCaptureBasicOverlay.prototype.setBrushForLabel = function (brush, label) {
        return this.proxy.setBrushForLabel(brush, label);
    };
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], LabelCaptureBasicOverlay.prototype, "mode", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], LabelCaptureBasicOverlay.prototype, "_view", void 0);
    __decorate([
        (0, Serializeable_1.nameForSerialization)('defaultPredictedFieldBrush')
    ], LabelCaptureBasicOverlay.prototype, "_predictedFieldBrush", void 0);
    __decorate([
        (0, Serializeable_1.nameForSerialization)('defaultCapturedFieldBrush')
    ], LabelCaptureBasicOverlay.prototype, "_capturedFieldBrush", void 0);
    __decorate([
        (0, Serializeable_1.nameForSerialization)('defaultLabelBrush')
    ], LabelCaptureBasicOverlay.prototype, "_labelBrush", void 0);
    __decorate([
        (0, Serializeable_1.nameForSerialization)('shouldShowScanAreaGuides')
    ], LabelCaptureBasicOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], LabelCaptureBasicOverlay.prototype, "listener", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], LabelCaptureBasicOverlay.prototype, "proxy", void 0);
    __decorate([
        (0, Serializeable_1.serializationDefault)(Viewfinder_1.NoViewfinder),
        (0, Serializeable_1.nameForSerialization)('viewfinder')
    ], LabelCaptureBasicOverlay.prototype, "_viewfinder", void 0);
    return LabelCaptureBasicOverlay;
}(Serializeable_1.DefaultSerializeable));
exports.LabelCaptureBasicOverlay = LabelCaptureBasicOverlay;
//# sourceMappingURL=LabelCaptureBasicOverlay.js.map