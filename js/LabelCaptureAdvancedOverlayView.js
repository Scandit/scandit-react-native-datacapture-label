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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelCaptureAdvancedOverlayView = void 0;
var react_1 = __importDefault(require("react"));
var LabelCaptureAdvancedOverlayView = /** @class */ (function (_super) {
    __extends(LabelCaptureAdvancedOverlayView, _super);
    function LabelCaptureAdvancedOverlayView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LabelCaptureAdvancedOverlayView.prototype, "moduleName", {
        get: function () {
            return LabelCaptureAdvancedOverlayView.moduleName;
        },
        enumerable: false,
        configurable: true
    });
    LabelCaptureAdvancedOverlayView.moduleName = 'LabelCaptureAdvancedOverlayViewComponent';
    return LabelCaptureAdvancedOverlayView;
}(react_1.default.Component));
exports.LabelCaptureAdvancedOverlayView = LabelCaptureAdvancedOverlayView;
//# sourceMappingURL=LabelCaptureAdvancedOverlayView.js.map