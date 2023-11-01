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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelCaptureSettings = void 0;
var Serializeable_1 = require("scandit-react-native-datacapture-core/js/private/Serializeable");
var LabelCaptureSettings = /** @class */ (function (_super) {
    __extends(LabelCaptureSettings, _super);
    function LabelCaptureSettings() {
        return _super.call(this) || this;
    }
    LabelCaptureSettings.fromJSON = function (json) {
        var settings = new LabelCaptureSettings();
        Object.keys(json).forEach(function (key) {
            settings[key] = json[key];
        });
        return settings;
    };
    LabelCaptureSettings.prototype.setProperty = function (name, value) {
        this[name] = value;
    };
    LabelCaptureSettings.prototype.getProperty = function (name) {
        return this[name];
    };
    return LabelCaptureSettings;
}(Serializeable_1.DefaultSerializeable));
exports.LabelCaptureSettings = LabelCaptureSettings;
//# sourceMappingURL=LabelCaptureSettings.js.map