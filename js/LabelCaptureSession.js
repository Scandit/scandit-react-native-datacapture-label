"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelCaptureSession = exports.LabelField = exports.CapturedLabel = exports.LabelFieldState = exports.LabelFieldType = void 0;
var Barcode_1 = require("scandit-react-native-datacapture-barcode/js/Barcode");
var Common_1 = require("scandit-react-native-datacapture-core/js/Common");
var LabelFieldType;
(function (LabelFieldType) {
    LabelFieldType["Barcode"] = "barcode";
    LabelFieldType["Text"] = "text";
    LabelFieldType["Unknown"] = "unknown";
})(LabelFieldType || (exports.LabelFieldType = LabelFieldType = {}));
var LabelFieldState;
(function (LabelFieldState) {
    LabelFieldState["Captured"] = "captured";
    LabelFieldState["Predicted"] = "predicted";
    LabelFieldState["Unknown"] = "unknown";
})(LabelFieldState || (exports.LabelFieldState = LabelFieldState = {}));
var CapturedLabel = /** @class */ (function () {
    function CapturedLabel() {
    }
    Object.defineProperty(CapturedLabel.prototype, "fields", {
        get: function () {
            return this._fields;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CapturedLabel.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CapturedLabel.prototype, "isComplete", {
        get: function () {
            return this._isComplete;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CapturedLabel.prototype, "predictedBounds", {
        get: function () {
            return this._predictedBounds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CapturedLabel.prototype, "deltaTimeToPrediction", {
        get: function () {
            return this._deltaTimeToPrediction;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CapturedLabel.prototype, "trackingID", {
        get: function () {
            return this._trackingID;
        },
        enumerable: false,
        configurable: true
    });
    CapturedLabel.fromJSON = function (json) {
        var label = new CapturedLabel();
        label._fields = json.fields.map(LabelField.fromJSON);
        label._name = json.name;
        label._predictedBounds = Common_1.Quadrilateral.fromJSON(json.predictedBounds);
        label._deltaTimeToPrediction = json.deltaTimeToPrediction;
        label._trackingID = json.trackingId;
        label._isComplete = json.isComplete;
        return label;
    };
    return CapturedLabel;
}());
exports.CapturedLabel = CapturedLabel;
var LabelField = /** @class */ (function () {
    function LabelField() {
    }
    Object.defineProperty(LabelField.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelField.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelField.prototype, "predictedLocation", {
        get: function () {
            return this._predictedLocation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelField.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelField.prototype, "isRequired", {
        get: function () {
            return this._isRequired;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelField.prototype, "barcode", {
        get: function () {
            return this._barcode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelField.prototype, "text", {
        get: function () {
            return this._text;
        },
        enumerable: false,
        configurable: true
    });
    LabelField.fromJSON = function (json) {
        var field = new LabelField();
        field._name = json.name;
        field._type = json.type;
        field._predictedLocation = Common_1.Quadrilateral.fromJSON(json.location);
        field._state = json.state;
        field._isRequired = json.isRequired;
        field._barcode = json.barcode ? Barcode_1.Barcode.fromJSON(json.barcode) : null;
        field._text = json.text;
        return field;
    };
    return LabelField;
}());
exports.LabelField = LabelField;
var LabelCaptureSession = /** @class */ (function () {
    function LabelCaptureSession() {
    }
    Object.defineProperty(LabelCaptureSession.prototype, "capturedLabels", {
        get: function () {
            return this._capturedLabels;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelCaptureSession.prototype, "frameSequenceID", {
        get: function () {
            return this._frameSequenceID;
        },
        enumerable: false,
        configurable: true
    });
    LabelCaptureSession.fromJSON = function (json) {
        var session = new LabelCaptureSession();
        session._frameSequenceID = json.frameSequenceId;
        session._capturedLabels = json.labels
            .map(CapturedLabel.fromJSON);
        session._capturedLabels
            .forEach(function (label) { return label.frameSequenceID = session._frameSequenceID; });
        return session;
    };
    return LabelCaptureSession;
}());
exports.LabelCaptureSession = LabelCaptureSession;
//# sourceMappingURL=LabelCaptureSession.js.map