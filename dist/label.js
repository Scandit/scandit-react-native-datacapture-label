import { nameForSerialization, ignoreFromSerializationIfNull, ignoreFromSerialization, serializationDefault, NoViewfinder, FactoryMaker, CameraSettings, Brush, Feedback, DefaultSerializeable, Quadrilateral, BaseNewController, BaseController, Rect, Point, Size, Anchor, PointWithUnit } from 'scandit-react-native-datacapture-core/dist/core';
import { Barcode, getBarcodeDefaults } from 'scandit-react-native-datacapture-barcode/dist/barcode';

function loadLabelCaptureDefaults(jsonDefaults) {
    const defaults = parseLabelCaptureDefaults(jsonDefaults);
    FactoryMaker.bindInstanceIfNotExists('LabelCaptureDefaults', defaults);
}
function getLabelCaptureDefaults() {
    return FactoryMaker.getInstance('LabelCaptureDefaults');
}
function parseLabelCaptureDefaults(jsonDefaults) {
    return {
        LabelCapture: {
            RecommendedCameraSettings: CameraSettings
                .fromJSON(jsonDefaults.LabelCapture.RecommendedCameraSettings),
            LabelCaptureBasicOverlay: {
                DefaultPredictedFieldBrush: Brush.fromJSON(jsonDefaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush),
                DefaultCapturedFieldBrush: Brush.fromJSON(jsonDefaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush),
                DefaultLabelBrush: Brush.fromJSON(jsonDefaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush)
            },
            LabelCaptureValidationFlowOverlay: {
                Settings: {
                    missingFieldsHintText: jsonDefaults.LabelCapture.LabelCaptureValidationFlowOverlay.Settings.missingFieldsHintText,
                    standbyHintText: jsonDefaults.LabelCapture.LabelCaptureValidationFlowOverlay.Settings.standbyHintText,
                    validationHintText: jsonDefaults.LabelCapture.LabelCaptureValidationFlowOverlay.Settings.validationHintText,
                    validationErrorText: jsonDefaults.LabelCapture.LabelCaptureValidationFlowOverlay.Settings.validationErrorText,
                    requiredFieldErrorText: jsonDefaults.LabelCapture.LabelCaptureValidationFlowOverlay.Settings.requiredFieldErrorText,
                    manualInputButtonText: jsonDefaults.LabelCapture.LabelCaptureValidationFlowOverlay.Settings.manualInputButtonText,
                }
            },
            Feedback: {
                success: Feedback.fromJSON(JSON.parse(jsonDefaults.LabelCapture.feedback).success),
            },
        },
    };
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class LabelFieldDefinition extends DefaultSerializeable {
    get name() {
        return this._name;
    }
    get patterns() {
        return this._patterns;
    }
    set patterns(value) {
        this._patterns = value;
    }
    get optional() {
        return this._optional;
    }
    set optional(value) {
        this._optional = value;
    }
    get hiddenProperties() {
        return this._hiddenProperties;
    }
    set hiddenProperties(newValue) {
        for (const key in this._hiddenProperties) {
            if (Object.prototype.hasOwnProperty.call(this._hiddenProperties, key)) {
                delete this[key];
            }
        }
        for (const key in newValue) {
            if (Object.prototype.hasOwnProperty.call(newValue, key)) {
                const item = newValue[key];
                this[key] = item;
            }
        }
        this._hiddenProperties = newValue;
    }
    constructor(name) {
        super();
        this._patterns = [];
        this._optional = false;
        this._hiddenProperties = {};
        this._name = name;
    }
}
__decorate([
    nameForSerialization('name')
], LabelFieldDefinition.prototype, "_name", void 0);
__decorate([
    nameForSerialization('patterns')
], LabelFieldDefinition.prototype, "_patterns", void 0);
__decorate([
    nameForSerialization('optional')
], LabelFieldDefinition.prototype, "_optional", void 0);
__decorate([
    ignoreFromSerialization
], LabelFieldDefinition.prototype, "_hiddenProperties", void 0);

class BarcodeField extends LabelFieldDefinition {
    get symbologySettings() {
        return this._symbologySettings;
    }
    constructor(name, symbologies) {
        super(name);
        this._symbologySettings = symbologies;
        this._symbologies = symbologies.reduce((acc, item) => {
            acc[item.symbology.toString()] = item;
            return acc;
        }, {});
    }
}
__decorate([
    nameForSerialization('symbologies'),
    ignoreFromSerializationIfNull
], BarcodeField.prototype, "_symbologies", void 0);
__decorate([
    ignoreFromSerialization
], BarcodeField.prototype, "_symbologySettings", void 0);

class LabelDateResult extends DefaultSerializeable {
    constructor(day, month, year, dayString, monthString, yearString) {
        super();
        this._day = day;
        this._month = month;
        this._year = year;
        this._dayString = dayString;
        this._monthString = monthString;
        this._yearString = yearString;
    }
    get day() {
        return this._day;
    }
    get month() {
        return this._month;
    }
    get year() {
        return this._year;
    }
    get dayString() {
        var _a;
        return (_a = this._dayString) !== null && _a !== void 0 ? _a : '';
    }
    get monthString() {
        var _a;
        return (_a = this._monthString) !== null && _a !== void 0 ? _a : '';
    }
    get yearString() {
        var _a;
        return (_a = this._yearString) !== null && _a !== void 0 ? _a : '';
    }
    static fromJSON(json) {
        return new LabelDateResult(json.day, json.month, json.year, json.dayStr, json.monthStr, json.yearStr);
    }
}
__decorate([
    nameForSerialization('day')
], LabelDateResult.prototype, "_day", void 0);
__decorate([
    nameForSerialization('month')
], LabelDateResult.prototype, "_month", void 0);
__decorate([
    nameForSerialization('year')
], LabelDateResult.prototype, "_year", void 0);
__decorate([
    nameForSerialization('dayStr')
], LabelDateResult.prototype, "_dayString", void 0);
__decorate([
    nameForSerialization('monthStr')
], LabelDateResult.prototype, "_monthString", void 0);
__decorate([
    nameForSerialization('yearStr')
], LabelDateResult.prototype, "_yearString", void 0);

class LabelField {
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get predictedLocation() {
        return this._predictedLocation;
    }
    get state() {
        return this._state;
    }
    get isRequired() {
        return this._isRequired;
    }
    get barcode() {
        return this._barcode;
    }
    get text() {
        return this._text;
    }
    asDate() {
        return this._dateResult;
    }
    static fromJSON(json) {
        const field = new LabelField();
        field._name = json.name;
        field._type = json.type;
        field._predictedLocation = Quadrilateral.fromJSON(json.location);
        field._state = json.state;
        field._isRequired = json.isRequired;
        field._barcode = json.barcode ? Barcode.fromJSON(json.barcode) : null;
        field._text = json.text;
        field._dateResult = json.date ? LabelDateResult.fromJSON(json.date) : null;
        return field;
    }
}

class CapturedLabel {
    get fields() {
        return this._fields;
    }
    get name() {
        return this._name;
    }
    get isComplete() {
        return this._isComplete;
    }
    get predictedBounds() {
        return this._predictedBounds;
    }
    get deltaTimeToPrediction() {
        return this._deltaTimeToPrediction;
    }
    get trackingID() {
        return this._trackingID;
    }
    static fromJSON(json) {
        const label = new CapturedLabel();
        label._fields = json.fields.map(LabelField.fromJSON);
        label._name = json.name;
        label._predictedBounds = Quadrilateral.fromJSON(json.predictedBounds);
        label._deltaTimeToPrediction = json.deltaTimeToPrediction;
        label._trackingID = json.trackingId;
        label._isComplete = json.isComplete;
        return label;
    }
}

class CustomBarcode extends BarcodeField {
    static initWithNameAndSymbologySettings(name, symbologySettings) {
        return new CustomBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbologies(name, symbologies) {
        const symbologySettings = Object.values(symbologies).map(symbology => {
            const symbologyObj = CustomBarcode.barcodeDefaults.SymbologySettings[symbology];
            symbologyObj.isEnabled = true;
            return symbologyObj;
        });
        return new CustomBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbology(name, symbology) {
        return CustomBarcode.initWithNameAndSymbologies(name, [symbology]);
    }
    constructor(name, symbologies) {
        super(name, symbologies);
        this.location = null;
        this._dataTypePatterns = [];
        this._fieldType = 'customBarcode';
    }
    get dataTypePatterns() {
        return this._dataTypePatterns;
    }
    set dataTypePatterns(value) {
        this._dataTypePatterns = value;
    }
    static get barcodeDefaults() {
        return getBarcodeDefaults();
    }
}
__decorate([
    nameForSerialization('location')
], CustomBarcode.prototype, "location", void 0);
__decorate([
    nameForSerialization('dataTypePatterns')
], CustomBarcode.prototype, "_dataTypePatterns", void 0);
__decorate([
    nameForSerialization('fieldType')
], CustomBarcode.prototype, "_fieldType", void 0);

class TextField extends LabelFieldDefinition {
}

class CustomText extends TextField {
    constructor(name) {
        super(name);
        this.location = null;
        this._dataTypePatterns = [];
        this._fieldType = 'customText';
    }
    get dataTypePatterns() {
        return this._dataTypePatterns;
    }
    set dataTypePatterns(value) {
        this._dataTypePatterns = value;
    }
}
__decorate([
    nameForSerialization('location')
], CustomText.prototype, "location", void 0);
__decorate([
    nameForSerialization('dataTypePatterns')
], CustomText.prototype, "_dataTypePatterns", void 0);
__decorate([
    nameForSerialization('fieldType')
], CustomText.prototype, "_fieldType", void 0);

class ExpiryDateText extends TextField {
    constructor(name) {
        super(name);
        this._fieldType = 'expiryDateText';
        this._dataTypePatterns = [];
        this._labelDateFormat = null;
    }
    get labelDateFormat() {
        return this._labelDateFormat;
    }
    set labelDateFormat(value) {
        this._labelDateFormat = value;
    }
    get dataTypePatterns() {
        return this._dataTypePatterns;
    }
    set dataTypePatterns(value) {
        this._dataTypePatterns = value;
    }
}
__decorate([
    nameForSerialization('fieldType')
], ExpiryDateText.prototype, "_fieldType", void 0);
__decorate([
    nameForSerialization('dataTypePatterns')
], ExpiryDateText.prototype, "_dataTypePatterns", void 0);
__decorate([
    nameForSerialization('labelDateFormat')
], ExpiryDateText.prototype, "_labelDateFormat", void 0);

class ImeiOneBarcode extends BarcodeField {
    static initWithNameAndSymbologySettings(name, symbologySettings) {
        return new ImeiOneBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbologies(name, symbologies) {
        const symbologySettings = Object.values(symbologies).map(symbology => {
            const symbologyObj = ImeiOneBarcode.barcodeDefaults.SymbologySettings[symbology];
            symbologyObj.isEnabled = true;
            return symbologyObj;
        });
        return new ImeiOneBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbology(name, symbology) {
        return ImeiOneBarcode.initWithNameAndSymbologies(name, [symbology]);
    }
    static get barcodeDefaults() {
        return getBarcodeDefaults();
    }
    constructor(name, symbologies) {
        super(name, symbologies);
        this._fieldType = 'imeiOneBarcode';
    }
}
__decorate([
    nameForSerialization('fieldType')
], ImeiOneBarcode.prototype, "_fieldType", void 0);

class ImeiTwoBarcode extends BarcodeField {
    static initWithNameAndSymbologySettings(name, symbologySettings) {
        return new ImeiTwoBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbologies(name, symbologies) {
        const symbologySettings = Object.values(symbologies).map(symbology => {
            const symbologyObj = ImeiTwoBarcode.barcodeDefaults.SymbologySettings[symbology];
            symbologyObj.isEnabled = true;
            return symbologyObj;
        });
        return new ImeiTwoBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbology(name, symbology) {
        return ImeiTwoBarcode.initWithNameAndSymbologies(name, [symbology]);
    }
    static get barcodeDefaults() {
        return getBarcodeDefaults();
    }
    constructor(name, symbologies) {
        super(name, symbologies);
        this._fieldType = 'imeiTwoBarcode';
    }
}
__decorate([
    nameForSerialization('fieldType')
], ImeiTwoBarcode.prototype, "_fieldType", void 0);

class LabelCaptureSession {
    get capturedLabels() {
        return this._capturedLabels;
    }
    get frameSequenceID() {
        return this._frameSequenceID;
    }
    static fromJSON(json) {
        const session = new LabelCaptureSession();
        session._frameSequenceID = json.frameSequenceId;
        session._capturedLabels = json.labels
            .map(CapturedLabel.fromJSON);
        session._capturedLabels
            .forEach(label => label.frameSequenceID = session._frameSequenceID);
        return session;
    }
}

var LabelCaptureListenerEvents;
(function (LabelCaptureListenerEvents) {
    LabelCaptureListenerEvents["didUpdateSession"] = "LabelCaptureListener.didUpdateSession";
})(LabelCaptureListenerEvents || (LabelCaptureListenerEvents = {}));
class LabelCaptureController extends BaseNewController {
    constructor(mode) {
        super('LabelCaptureProxy');
        this.mode = mode;
        this.initialize().catch(error => console.error('Failed to initialize LabelCaptureController:', error));
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mode.listeners.length > 0) {
                yield this.subscribeLabelCaptureListener();
            }
        });
    }
    setModeEnabledState(isEnabled) {
        return this._proxy.$setModeEnabledState({ modeId: this.modeId, isEnabled });
    }
    updateLabelCaptureSettings(settingsJson) {
        return this._proxy.$updateLabelCaptureSettings({ modeId: this.modeId, settingsJson });
    }
    subscribeLabelCaptureListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._boundHandleDidUpdateSession) {
                return;
            }
            yield this._proxy.$registerListenerForEvents({ modeId: this.modeId });
            this._boundHandleDidUpdateSession = this.handleDidUpdateSessionEvent.bind(this);
            this._proxy.subscribeForEvents(Object.values(LabelCaptureListenerEvents));
            this._proxy.eventEmitter.on(LabelCaptureListenerEvents.didUpdateSession, this._boundHandleDidUpdateSession);
        });
    }
    handleDidUpdateSessionEvent(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            const session = LabelCaptureSession.fromJSON(JSON.parse(payload.session));
            this.notifyListenersOfDidUpdateSession(session);
            yield this._proxy.$finishDidUpdateSessionCallback({ modeId: this.modeId, isEnabled: this.mode.isEnabled });
        });
    }
    unsubscribeLabelCaptureListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._proxy.$unregisterListenerForEvents({ modeId: this.modeId });
            this._proxy.unsubscribeFromEvents(Object.values(LabelCaptureListenerEvents));
            if (this._boundHandleDidUpdateSession) {
                this._proxy.eventEmitter.off(LabelCaptureListenerEvents.didUpdateSession, this._boundHandleDidUpdateSession);
                this._boundHandleDidUpdateSession = undefined;
            }
        });
    }
    updateFeedback(feedback) {
        this._proxy.$updateLabelCaptureFeedback({ modeId: this.modeId, feedbackJson: JSON.stringify(feedback.toJSON()) });
    }
    dispose() {
        this.unsubscribeLabelCaptureListener();
        this._proxy.dispose();
    }
    get modeId() {
        return this.mode.modeId;
    }
    notifyListenersOfDidUpdateSession(session) {
        const mode = this.mode;
        mode.listeners.forEach(listener => {
            if (listener.didUpdateSession) {
                listener.didUpdateSession(this.mode, session);
            }
        });
    }
}

class LabelCaptureFeedback extends DefaultSerializeable {
    static get defaultFeedback() {
        return new LabelCaptureFeedback();
    }
    static get labelCaptureDefaults() {
        return getLabelCaptureDefaults();
    }
    get success() {
        return this._success;
    }
    set success(success) {
        this._success = success;
        this.updateFeedback();
    }
    updateFeedback() {
        var _a;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateFeedback(this);
    }
    constructor() {
        super();
        this.controller = null;
        this._success = LabelCaptureFeedback.labelCaptureDefaults.LabelCapture.Feedback.success;
    }
}
__decorate([
    nameForSerialization('success')
], LabelCaptureFeedback.prototype, "_success", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureFeedback.prototype, "controller", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureFeedback, "labelCaptureDefaults", null);

class LabelCapture extends DefaultSerializeable {
    get isEnabled() {
        return this._isEnabled;
    }
    set isEnabled(isEnabled) {
        var _a;
        this._isEnabled = isEnabled;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setModeEnabledState(isEnabled);
    }
    get context() {
        return this._context;
    }
    static createRecommendedCameraSettings() {
        return new CameraSettings(getLabelCaptureDefaults().LabelCapture.RecommendedCameraSettings);
    }
    /**
     * @deprecated Use createRecommendedCameraSettings() instead to get a new instance that can be safely modified.
     */
    static get recommendedCameraSettings() {
        if (LabelCapture._recommendedCameraSettings === null) {
            LabelCapture._recommendedCameraSettings = LabelCapture.createRecommendedCameraSettings();
        }
        return LabelCapture._recommendedCameraSettings;
    }
    get _context() {
        return this.privateContext;
    }
    set _context(newContext) {
        var _a, _b;
        if (newContext == null) {
            (_a = this.controller) === null || _a === void 0 ? void 0 : _a.dispose();
            this.controller = null;
            this._feedback.controller = null;
            return;
        }
        this.privateContext = newContext;
        (_b = this.controller) !== null && _b !== void 0 ? _b : (this.controller = new LabelCaptureController(this));
        this._feedback.controller = this.controller;
    }
    /**
     * @deprecated Since 7.6. This factory will be removed in 8.0.
     * Use the public constructor instead and configure manually:
     * ```ts
     * const mode = new LabelCapture(settings);
     * context.addMode(mode);
     * ```
     */
    static forContext(context, settings) {
        const mode = new LabelCapture(settings);
        if (context) {
            context.addMode(mode);
        }
        return mode;
    }
    constructor(settings) {
        super();
        this.type = 'labelCapture';
        this.modeId = Math.floor(Math.random() * 100000000);
        this.parentId = null;
        this._isEnabled = true;
        this._feedback = LabelCaptureFeedback.defaultFeedback;
        this.hasListeners = false;
        this.privateContext = null;
        this.listeners = [];
        this.controller = null;
        this.settings = settings;
    }
    applySettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.settings = settings;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateLabelCaptureSettings(JSON.stringify(settings.toJSON()));
        });
    }
    addListener(listener) {
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
        this.hasListeners = this.listeners.length > 0;
    }
    removeListener(listener) {
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        this.hasListeners = this.listeners.length > 0;
    }
    get feedback() {
        return this._feedback;
    }
    set feedback(feedback) {
        var _a;
        this._feedback.controller = null;
        this._feedback = feedback;
        this._feedback.controller = this.controller;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateFeedback(feedback);
    }
}
LabelCapture._recommendedCameraSettings = null;
__decorate([
    nameForSerialization('parentId'),
    ignoreFromSerializationIfNull
], LabelCapture.prototype, "parentId", void 0);
__decorate([
    nameForSerialization('enabled')
], LabelCapture.prototype, "_isEnabled", void 0);
__decorate([
    nameForSerialization('feedback')
], LabelCapture.prototype, "_feedback", void 0);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "privateContext", void 0);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "controller", void 0);

var LabelCaptureAdvancedOverlayListenerEvents;
(function (LabelCaptureAdvancedOverlayListenerEvents) {
    LabelCaptureAdvancedOverlayListenerEvents["viewForLabel"] = "LabelCaptureAdvancedOverlayListener.viewForLabel";
    LabelCaptureAdvancedOverlayListenerEvents["anchorForLabel"] = "LabelCaptureAdvancedOverlayListener.anchorForLabel";
    LabelCaptureAdvancedOverlayListenerEvents["offsetForLabel"] = "LabelCaptureAdvancedOverlayListener.offsetForLabel";
    LabelCaptureAdvancedOverlayListenerEvents["viewForCapturedLabelField"] = "LabelCaptureAdvancedOverlayListener.viewForFieldOfLabel";
    LabelCaptureAdvancedOverlayListenerEvents["anchorForCapturedLabelField"] = "LabelCaptureAdvancedOverlayListener.anchorForFieldOfLabel";
    LabelCaptureAdvancedOverlayListenerEvents["offsetForCapturedLabelField"] = "LabelCaptureAdvancedOverlayListener.offsetForFieldOfLabel";
})(LabelCaptureAdvancedOverlayListenerEvents || (LabelCaptureAdvancedOverlayListenerEvents = {}));
class LabelCaptureAdvancedOverlayController extends BaseController {
    constructor(overlay) {
        super('LabelCaptureAdvancedOverlayProxy');
        this.overlay = overlay;
        this.initialize();
    }
    initialize() {
        if (this.overlay.listener) {
            this.subscribeListener();
        }
    }
    setViewForCapturedLabel(label, view) {
        return this._proxy.$setViewForCapturedLabel({
            jsonView: view ? JSON.stringify(view.toJSON()) : null,
            trackingId: label.trackingID,
            dataCaptureViewId: this.dataCaptureViewId
        });
    }
    setAnchorForCapturedLabel(label, anchor) {
        return this._proxy.$setAnchorForCapturedLabel({
            anchor: anchor,
            trackingId: label.trackingID,
            dataCaptureViewId: this.dataCaptureViewId
        });
    }
    setOffsetForCapturedLabel(label, offset) {
        return this._proxy.$setOffsetForCapturedLabel({
            offsetJson: JSON.stringify(offset.toJSON()),
            trackingId: label.trackingID,
            dataCaptureViewId: this.dataCaptureViewId
        });
    }
    setViewForCapturedLabelField(label, field, view) {
        const identifier = `${label.trackingID}§${field.name}`;
        return this.setViewForCapturedLabelFieldPrivate(identifier, view);
    }
    setViewForCapturedLabelFieldPrivate(identifier, view) {
        return this._proxy.$setViewForCapturedLabelField({
            view: view ? JSON.stringify(view.toJSON()) : null,
            identifier: identifier,
            dataCaptureViewId: this.dataCaptureViewId
        });
    }
    setAnchorForCapturedLabelField(label, field, anchor) {
        const identifier = `${label.trackingID}§${field.name}`;
        return this.setAnchorForCapturedLabelFieldPrivate(identifier, anchor);
    }
    setAnchorForCapturedLabelFieldPrivate(identifier, anchor) {
        return this._proxy.$setAnchorForCapturedLabelField({
            anchor: anchor,
            identifier: identifier,
            dataCaptureViewId: this.dataCaptureViewId
        });
    }
    setOffsetForCapturedLabelField(label, field, offset) {
        const identifier = `${label.trackingID}§${field.name}`;
        return this.setOffsetForCapturedLabelFieldPrivate(identifier, offset);
    }
    setOffsetForCapturedLabelFieldPrivate(identifier, offset) {
        return this._proxy.$setOffsetForCapturedLabelField({
            offset: JSON.stringify(offset.toJSON()),
            identifier: identifier,
            dataCaptureViewId: this.dataCaptureViewId
        });
    }
    clearCapturedLabelViews() {
        return this._proxy.$clearCapturedLabelViews({ dataCaptureViewId: this.dataCaptureViewId });
    }
    subscribeListener() {
        this._proxy.$registerListenerForAdvancedOverlayEvents({ dataCaptureViewId: this.dataCaptureViewId });
        this._proxy.subscribeForEvents(Object.values(LabelCaptureAdvancedOverlayListenerEvents));
        this._proxy.eventEmitter.on(LabelCaptureAdvancedOverlayListenerEvents.viewForLabel, this.handleViewForLabel.bind(this));
        this._proxy.eventEmitter.on(LabelCaptureAdvancedOverlayListenerEvents.anchorForLabel, this.handleAnchorForLabel.bind(this));
        this._proxy.eventEmitter.on(LabelCaptureAdvancedOverlayListenerEvents.offsetForLabel, this.handleOffsetForLabel.bind(this));
        this._proxy.eventEmitter.on(LabelCaptureAdvancedOverlayListenerEvents.viewForCapturedLabelField, this.handleViewForCapturedLabelField.bind(this));
        this._proxy.eventEmitter.on(LabelCaptureAdvancedOverlayListenerEvents.anchorForCapturedLabelField, this.handleAnchorForCapturedLabelField.bind(this));
        this._proxy.eventEmitter.on(LabelCaptureAdvancedOverlayListenerEvents.offsetForCapturedLabelField, this.handleOffsetForCapturedLabelField.bind(this));
    }
    handleViewForLabel(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            let view = null;
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.viewForCapturedLabel) {
                view = this.overlay.listener.viewForCapturedLabel(this.overlay, label);
            }
            yield this.setViewForCapturedLabel(label, view);
        });
    }
    handleAnchorForLabel(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            let anchor = Anchor.Center;
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.anchorForCapturedLabel) {
                anchor = this.overlay.listener.anchorForCapturedLabel(this.overlay, label);
            }
            yield this.setAnchorForCapturedLabel(label, anchor);
        });
    }
    handleViewForCapturedLabelField(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            let view = null;
            const field = LabelField.fromJSON(JSON.parse(payload.field));
            if (this.overlay.listener && this.overlay.listener.viewForCapturedLabelField) {
                view = this.overlay.listener.viewForCapturedLabelField(this.overlay, field);
            }
            yield this.setViewForCapturedLabelFieldPrivate(payload.identifier, view);
        });
    }
    handleOffsetForLabel(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            let offset = PointWithUnit.zero;
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.offsetForCapturedLabel) {
                offset = this.overlay.listener.offsetForCapturedLabel(this.overlay, label);
            }
            yield this.setOffsetForCapturedLabel(label, offset);
        });
    }
    handleAnchorForCapturedLabelField(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            let anchor = Anchor.Center;
            const field = LabelField.fromJSON(JSON.parse(payload.field));
            if (this.overlay.listener && this.overlay.listener.anchorForCapturedLabelField) {
                anchor = this.overlay.listener.anchorForCapturedLabelField(this.overlay, field);
            }
            yield this.setAnchorForCapturedLabelFieldPrivate(payload.identifier, anchor);
        });
    }
    handleOffsetForCapturedLabelField(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            let offset = PointWithUnit.zero;
            const field = LabelField.fromJSON(JSON.parse(payload.field));
            if (this.overlay.listener && this.overlay.listener.offsetForCapturedLabelField) {
                offset = this.overlay.listener.offsetForCapturedLabelField(this.overlay, field);
            }
            yield this.setOffsetForCapturedLabelFieldPrivate(payload.identifier, offset);
        });
    }
    unsubscribeListener() {
        this._proxy.$unregisterListenerForAdvancedOverlayEvents({ dataCaptureViewId: this.dataCaptureViewId });
        this._proxy.unsubscribeFromEvents(Object.values(LabelCaptureAdvancedOverlayListenerEvents));
        this._proxy.eventEmitter.off(LabelCaptureAdvancedOverlayListenerEvents.viewForLabel, this.handleViewForLabel.bind(this));
        this._proxy.eventEmitter.off(LabelCaptureAdvancedOverlayListenerEvents.anchorForLabel, this.handleAnchorForLabel.bind(this));
        this._proxy.eventEmitter.off(LabelCaptureAdvancedOverlayListenerEvents.offsetForLabel, this.handleOffsetForLabel.bind(this));
        this._proxy.eventEmitter.off(LabelCaptureAdvancedOverlayListenerEvents.viewForCapturedLabelField, this.handleViewForCapturedLabelField.bind(this));
        this._proxy.eventEmitter.off(LabelCaptureAdvancedOverlayListenerEvents.anchorForCapturedLabelField, this.handleAnchorForCapturedLabelField.bind(this));
        this._proxy.eventEmitter.off(LabelCaptureAdvancedOverlayListenerEvents.offsetForCapturedLabelField, this.handleOffsetForCapturedLabelField.bind(this));
    }
    dispose() {
        this.unsubscribeListener();
        this._proxy.dispose();
    }
    updateAdvancedOverlay(advancedOverlayJson) {
        return this._proxy.$updateLabelCaptureAdvancedOverlay({ dataCaptureViewId: this.dataCaptureViewId, advancedOverlayJson });
    }
    get dataCaptureViewId() {
        var _a, _b;
        return (_b = (_a = this.overlay.view) === null || _a === void 0 ? void 0 : _a.viewId) !== null && _b !== void 0 ? _b : -1;
    }
}

class LabelCaptureAdvancedOverlay extends DefaultSerializeable {
    get view() {
        return this._view;
    }
    set view(newView) {
        var _a, _b;
        if (newView === null) {
            (_a = this.controller) === null || _a === void 0 ? void 0 : _a.dispose();
            this.controller = null;
            this._view = null;
            return;
        }
        this._view = newView;
        (_b = this.controller) !== null && _b !== void 0 ? _b : (this.controller = new LabelCaptureAdvancedOverlayController(this));
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        var _a;
        this._shouldShowScanAreaGuides = shouldShow;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateAdvancedOverlay(JSON.stringify(this.toJSON()));
    }
    get listener() {
        return this._listener;
    }
    set listener(listener) {
        this._listener = listener;
        this.hasListener = listener != null;
    }
    /**
     * @deprecated Since 7.6. This factory will be removed in 8.0.
     * Use the public constructor instead and add the overlay to the view manually:
     * ```ts
     * const overlay = new LabelCaptureAdvancedOverlay(labelCapture);
     * view.addOverlay(overlay);
     * ```
     */
    static withLabelCaptureForView(labelCapture, view) {
        const overlay = new LabelCaptureAdvancedOverlay(labelCapture);
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
    constructor(mode) {
        super();
        this.type = 'labelCaptureAdvanced';
        this.controller = null;
        this._view = null;
        this._listener = null;
        this.hasListener = false;
        this._shouldShowScanAreaGuides = false;
        this.modeId = mode.modeId;
    }
    setViewForCapturedLabel(capturedLabel, view) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setViewForCapturedLabel(capturedLabel, view);
        });
    }
    setViewForCapturedLabelField(field, capturedLabel, view) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setViewForCapturedLabelField(capturedLabel, field, view);
        });
    }
    setAnchorForCapturedLabel(capturedLabel, anchor) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setAnchorForCapturedLabel(capturedLabel, anchor);
        });
    }
    setAnchorForCapturedLabelField(field, capturedLabel, anchor) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setAnchorForCapturedLabelField(capturedLabel, field, anchor);
        });
    }
    setOffsetForCapturedLabel(capturedLabel, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setOffsetForCapturedLabel(capturedLabel, offset);
        });
    }
    setOffsetForCapturedLabelField(field, capturedLabel, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setOffsetForCapturedLabelField(capturedLabel, field, offset);
        });
    }
    clearCapturedLabelViews() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.clearCapturedLabelViews();
        });
    }
}
__decorate([
    ignoreFromSerialization
], LabelCaptureAdvancedOverlay.prototype, "controller", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureAdvancedOverlay.prototype, "_view", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureAdvancedOverlay.prototype, "_listener", void 0);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], LabelCaptureAdvancedOverlay.prototype, "_shouldShowScanAreaGuides", void 0);

class LabelCaptureSettings extends DefaultSerializeable {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static fromJSON(json) {
        // tslint:disable-next-line:no-console
        throw new Error('This property is deprecated in favour of LabelCaptureSettings.settingsFromLabelDefinitions. Please update your code to use the new property.');
    }
    static get barcodeDefaults() {
        return getBarcodeDefaults();
    }
    static settingsFromLabelDefinitions(definitions, properties) {
        const settings = new LabelCaptureSettings();
        settings._definitions = definitions;
        if (properties) {
            settings.properties = properties;
        }
        return settings;
    }
    constructor() {
        super();
        this._definitions = [];
        this.properties = {};
    }
    settingsForSymbology(symbology) {
        return LabelCaptureSettings.barcodeDefaults.SymbologySettings[symbology];
    }
    setProperty(name, value) {
        this[name] = value;
    }
    getProperty(name) {
        return this[name];
    }
}
__decorate([
    nameForSerialization('labelDefinitions')
], LabelCaptureSettings.prototype, "_definitions", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureSettings, "barcodeDefaults", null);

var LabelDateComponentFormat;
(function (LabelDateComponentFormat) {
    LabelDateComponentFormat["DMY"] = "dmy";
    LabelDateComponentFormat["MDY"] = "mdy";
    LabelDateComponentFormat["YMD"] = "ymd";
})(LabelDateComponentFormat || (LabelDateComponentFormat = {}));

class LabelDateFormat extends DefaultSerializeable {
    constructor(componentFormat, acceptPartialDates) {
        super();
        this._componentFormat = componentFormat;
        this._acceptPartialDates = acceptPartialDates;
    }
    get componentFormat() {
        return this._componentFormat;
    }
    get acceptPartialDates() {
        return this._acceptPartialDates;
    }
}
__decorate([
    nameForSerialization('componentFormat')
], LabelDateFormat.prototype, "_componentFormat", void 0);
__decorate([
    nameForSerialization('acceptPartialDates')
], LabelDateFormat.prototype, "_acceptPartialDates", void 0);

class LabelDefinition extends DefaultSerializeable {
    get name() {
        return this._name;
    }
    get fields() {
        return this._fields;
    }
    set fields(values) {
        this._fields = values;
    }
    get hiddenProperties() {
        return this._hiddenProperties;
    }
    set hiddenProperties(newValue) {
        for (const key in this._hiddenProperties) {
            if (Object.prototype.hasOwnProperty.call(this._hiddenProperties, key)) {
                delete this[key];
            }
        }
        for (const key in newValue) {
            if (Object.prototype.hasOwnProperty.call(newValue, key)) {
                const item = newValue[key];
                this[key] = item;
            }
        }
        this._hiddenProperties = newValue;
    }
    static fromJSON(json) {
        const definition = new LabelDefinition(json.name);
        definition._fields = json.fields;
        definition.hiddenProperties = json.hidden_properties;
        return definition;
    }
    static createVinLabelDefinition(name) {
        const definition = new LabelDefinition(name);
        definition._type = 'vin';
        return definition;
    }
    static createPriceCaptureDefinition(name) {
        const definition = new LabelDefinition(name);
        definition._type = 'priceCapture';
        return definition;
    }
    static createSevenSegmentDisplayLabelDefinition(name) {
        const definition = new LabelDefinition(name);
        definition._type = 'sevenSegment';
        return definition;
    }
    constructor(name) {
        super();
        this._name = '';
        this._fields = [];
        this._type = null;
        this._hiddenProperties = {};
        this._name = name;
    }
}
__decorate([
    nameForSerialization('name')
], LabelDefinition.prototype, "_name", void 0);
__decorate([
    nameForSerialization('fields')
], LabelDefinition.prototype, "_fields", void 0);
__decorate([
    nameForSerialization('type'),
    ignoreFromSerializationIfNull
], LabelDefinition.prototype, "_type", void 0);
__decorate([
    ignoreFromSerialization
], LabelDefinition.prototype, "_hiddenProperties", void 0);

var LabelFieldLocationType;
(function (LabelFieldLocationType) {
    LabelFieldLocationType["TopLeft"] = "topLeft";
    LabelFieldLocationType["TopRight"] = "topRight";
    LabelFieldLocationType["BottomRight"] = "bottomRight";
    LabelFieldLocationType["BottomLeft"] = "bottomLeft";
    LabelFieldLocationType["Top"] = "top";
    LabelFieldLocationType["Right"] = "right";
    LabelFieldLocationType["Bottom"] = "bottom";
    LabelFieldLocationType["Left"] = "left";
    LabelFieldLocationType["Center"] = "center";
    LabelFieldLocationType["WholeLabel"] = "wholeLabel";
})(LabelFieldLocationType || (LabelFieldLocationType = {}));

class LabelFieldLocation extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this._rect = null;
        this._type = null;
    }
    static forRect(rect) {
        const location = new LabelFieldLocation();
        location._rect = rect;
        return location;
    }
    static for(left, top, right, bottom) {
        const location = new LabelFieldLocation();
        location._rect = new Rect(new Point(left, top), new Size(right - left, bottom - top));
        return location;
    }
    static topLeft() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.TopLeft;
        return location;
    }
    static topRight() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.TopRight;
        return location;
    }
    static bottomLeft() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.BottomLeft;
        return location;
    }
    static bottomRight() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.BottomRight;
        return location;
    }
    static top() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.Top;
        return location;
    }
    static bottom() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.Bottom;
        return location;
    }
    static left() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.Left;
        return location;
    }
    static right() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.Right;
        return location;
    }
    static center() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.Center;
        return location;
    }
    static wholeLabel() {
        const location = new LabelFieldLocation();
        location._type = LabelFieldLocationType.WholeLabel;
        return location;
    }
}
__decorate([
    nameForSerialization('rect')
], LabelFieldLocation.prototype, "_rect", void 0);
__decorate([
    nameForSerialization('type'),
    ignoreFromSerializationIfNull
], LabelFieldLocation.prototype, "_type", void 0);

var LabelFieldState;
(function (LabelFieldState) {
    LabelFieldState["Captured"] = "captured";
    LabelFieldState["Predicted"] = "predicted";
    LabelFieldState["Unknown"] = "unknown";
})(LabelFieldState || (LabelFieldState = {}));

var LabelFieldType;
(function (LabelFieldType) {
    LabelFieldType["Barcode"] = "barcode";
    LabelFieldType["Text"] = "text";
    LabelFieldType["Unknown"] = "unknown";
})(LabelFieldType || (LabelFieldType = {}));

class PackingDateText extends TextField {
    constructor(name) {
        super(name);
        this._fieldType = 'packingDateText';
        this._dataTypePatterns = [];
        this._labelDateFormat = null;
    }
    get dataTypePatterns() {
        return this._dataTypePatterns;
    }
    get labelDateFormat() {
        return this._labelDateFormat;
    }
    set labelDateFormat(value) {
        this._labelDateFormat = value;
    }
}
__decorate([
    nameForSerialization('fieldType')
], PackingDateText.prototype, "_fieldType", void 0);
__decorate([
    nameForSerialization('dataTypePatterns')
], PackingDateText.prototype, "_dataTypePatterns", void 0);
__decorate([
    nameForSerialization('labelDateFormat')
], PackingDateText.prototype, "_labelDateFormat", void 0);

class PartNumberBarcode extends BarcodeField {
    static initWithNameAndSymbologySettings(name, symbologySettings) {
        return new PartNumberBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbologies(name, symbologies) {
        const symbologySettings = Object.values(symbologies).map(symbology => {
            const symbologyObj = PartNumberBarcode.barcodeDefaults.SymbologySettings[symbology];
            symbologyObj.isEnabled = true;
            return symbologyObj;
        });
        return new PartNumberBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbology(name, symbology) {
        return PartNumberBarcode.initWithNameAndSymbologies(name, [symbology]);
    }
    static get barcodeDefaults() {
        return getBarcodeDefaults();
    }
    constructor(name, symbologies) {
        super(name, symbologies);
        this._fieldType = 'partNumberBarcode';
    }
}
__decorate([
    nameForSerialization('fieldType')
], PartNumberBarcode.prototype, "_fieldType", void 0);

class SerialNumberBarcode extends BarcodeField {
    static initWithNameAndSymbologySettings(name, symbologySettings) {
        return new SerialNumberBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbologies(name, symbologies) {
        const symbologySettings = Object.values(symbologies).map(symbology => {
            const symbologyObj = SerialNumberBarcode.barcodeDefaults.SymbologySettings[symbology];
            symbologyObj.isEnabled = true;
            return symbologyObj;
        });
        return new SerialNumberBarcode(name, symbologySettings);
    }
    static initWithNameAndSymbology(name, symbology) {
        return SerialNumberBarcode.initWithNameAndSymbologies(name, [symbology]);
    }
    static get barcodeDefaults() {
        return getBarcodeDefaults();
    }
    constructor(name, symbologies) {
        super(name, symbologies);
        this._fieldType = 'serialNumberBarcode';
    }
}
__decorate([
    nameForSerialization('fieldType')
], SerialNumberBarcode.prototype, "_fieldType", void 0);

class TotalPriceText extends TextField {
    constructor(name) {
        super(name);
        this._fieldType = 'totalPriceText';
        this._dataTypePatterns = [];
    }
    get dataTypePatterns() {
        return this._dataTypePatterns;
    }
    set dataTypePatterns(value) {
        this._dataTypePatterns = value;
    }
}
__decorate([
    nameForSerialization('fieldType')
], TotalPriceText.prototype, "_fieldType", void 0);
__decorate([
    nameForSerialization('dataTypePatterns')
], TotalPriceText.prototype, "_dataTypePatterns", void 0);

class UnitPriceText extends TextField {
    constructor(name) {
        super(name);
        this._fieldType = 'unitPriceText';
        this._dataTypePatterns = [];
    }
    get dataTypePatterns() {
        return this._dataTypePatterns;
    }
    set dataTypePatterns(value) {
        this._dataTypePatterns = value;
    }
}
__decorate([
    nameForSerialization('fieldType')
], UnitPriceText.prototype, "_fieldType", void 0);
__decorate([
    nameForSerialization('dataTypePatterns')
], UnitPriceText.prototype, "_dataTypePatterns", void 0);

class WeightText extends TextField {
    constructor(name) {
        super(name);
        this._fieldType = 'weightText';
        this._dataTypePatterns = [];
    }
    get dataTypePatterns() {
        return this._dataTypePatterns;
    }
    set dataTypePatterns(value) {
        this._dataTypePatterns = value;
    }
}
__decorate([
    nameForSerialization('fieldType')
], WeightText.prototype, "_fieldType", void 0);
__decorate([
    nameForSerialization('dataTypePatterns')
], WeightText.prototype, "_dataTypePatterns", void 0);

var LabelCaptureBasicOverlayListenerEvents;
(function (LabelCaptureBasicOverlayListenerEvents) {
    LabelCaptureBasicOverlayListenerEvents["brushForFieldOfLabel"] = "LabelCaptureBasicOverlayListener.brushForFieldOfLabel";
    LabelCaptureBasicOverlayListenerEvents["brushForLabel"] = "LabelCaptureBasicOverlayListener.brushForLabel";
    LabelCaptureBasicOverlayListenerEvents["didTapLabel"] = "LabelCaptureBasicOverlayListener.didTapLabel";
})(LabelCaptureBasicOverlayListenerEvents || (LabelCaptureBasicOverlayListenerEvents = {}));
class LabelCaptureBasicOverlayController extends BaseController {
    constructor(overlay) {
        super('LabelCaptureBasicOverlayProxy');
        this.overlay = overlay;
        this.initialize();
    }
    initialize() {
        if (this.overlay.listener) {
            this.subscribeListener();
        }
    }
    setBrushForFieldOfLabel(brush, field, label) {
        return this._proxy.$setBrushForFieldOfLabel({
            brushJson: brush ? JSON.stringify(brush.toJSON()) : null,
            fieldName: field.name,
            trackingId: label.trackingID,
            dataCaptureViewId: this.dataCaptureViewId
        });
    }
    setBrushForLabel(brush, label) {
        return this._proxy.$setBrushForLabel({
            brushJson: brush ? JSON.stringify(brush.toJSON()) : null,
            trackingId: label.trackingID,
            dataCaptureViewId: this.dataCaptureViewId
        });
    }
    subscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._proxy.$registerListenerForBasicOverlayEvents({ dataCaptureViewId: this.dataCaptureViewId });
            this._proxy.subscribeForEvents(Object.values(LabelCaptureBasicOverlayListenerEvents));
            this._proxy.eventEmitter.on(LabelCaptureBasicOverlayListenerEvents.brushForFieldOfLabel, this.handleBrushForFieldOfLabel.bind(this));
            this._proxy.eventEmitter.on(LabelCaptureBasicOverlayListenerEvents.brushForLabel, this.handleBrushForLabel.bind(this));
            this._proxy.eventEmitter.on(LabelCaptureBasicOverlayListenerEvents.didTapLabel, this.handleDidTapLabel.bind(this));
        });
    }
    handleBrushForFieldOfLabel(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            let brush = this.overlay.capturedFieldBrush;
            const field = LabelField.fromJSON(JSON.parse(payload.field));
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.brushForFieldOfLabel) {
                brush = this.overlay.listener.brushForFieldOfLabel(this.overlay, field, label);
            }
            yield this.setBrushForFieldOfLabel(brush, field, label);
        });
    }
    handleBrushForLabel(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            let brush = this.overlay.labelBrush;
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.brushForLabel) {
                brush = this.overlay.listener.brushForLabel(this.overlay, label);
            }
            yield this.setBrushForLabel(brush, label);
        });
    }
    handleDidTapLabel(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            if (this.overlay.listener && this.overlay.listener.didTapLabel) {
                const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
                this.overlay.listener.didTapLabel(this.overlay, label);
            }
        });
    }
    unsubscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            this._proxy.$unregisterListenerForBasicOverlayEvents({ dataCaptureViewId: this.dataCaptureViewId });
            this._proxy.unsubscribeFromEvents(Object.values(LabelCaptureBasicOverlayListenerEvents));
            this._proxy.eventEmitter.off(LabelCaptureBasicOverlayListenerEvents.brushForFieldOfLabel, this.handleBrushForFieldOfLabel.bind(this));
            this._proxy.eventEmitter.off(LabelCaptureBasicOverlayListenerEvents.brushForLabel, this.handleBrushForLabel.bind(this));
            this._proxy.eventEmitter.off(LabelCaptureBasicOverlayListenerEvents.didTapLabel, this.handleDidTapLabel.bind(this));
        });
    }
    updateBasicOverlay(basicOverlayJson) {
        return this._proxy.$updateLabelCaptureBasicOverlay({ dataCaptureViewId: this.dataCaptureViewId, basicOverlayJson });
    }
    dispose() {
        this.unsubscribeListener();
        this._proxy.dispose();
    }
    get dataCaptureViewId() {
        var _a, _b;
        return (_b = (_a = this.overlay.view) === null || _a === void 0 ? void 0 : _a.viewId) !== null && _b !== void 0 ? _b : -1;
    }
}

class LabelCaptureBasicOverlay extends DefaultSerializeable {
    static get defaultPredictedFieldBrush() {
        return LabelCaptureBasicOverlay.labelCaptureDefaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush;
    }
    static get defaultCapturedFieldBrush() {
        return LabelCaptureBasicOverlay.labelCaptureDefaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush;
    }
    static get defaultLabelBrush() {
        return LabelCaptureBasicOverlay.labelCaptureDefaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush;
    }
    static get labelCaptureDefaults() {
        return getLabelCaptureDefaults();
    }
    get view() {
        return this._view;
    }
    set view(newView) {
        var _a, _b;
        if (newView === null) {
            (_a = this.controller) === null || _a === void 0 ? void 0 : _a.dispose();
            this.controller = null;
            this._view = null;
            return;
        }
        this._view = newView;
        (_b = this.controller) !== null && _b !== void 0 ? _b : (this.controller = new LabelCaptureBasicOverlayController(this));
    }
    get predictedFieldBrush() {
        return this._predictedFieldBrush;
    }
    set predictedFieldBrush(newBrush) {
        var _a;
        this._predictedFieldBrush = newBrush;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    get capturedFieldBrush() {
        return this._capturedFieldBrush;
    }
    set capturedFieldBrush(newBrush) {
        var _a;
        this._capturedFieldBrush = newBrush;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    get labelBrush() {
        return this._labelBrush;
    }
    set labelBrush(newBrush) {
        var _a;
        this._labelBrush = newBrush;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    get listener() {
        return this._listener;
    }
    set listener(listener) {
        this._listener = listener;
        this.hasListener = listener != null;
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        var _a;
        this._shouldShowScanAreaGuides = shouldShow;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    get viewfinder() {
        return this._viewfinder;
    }
    set viewfinder(newViewfinder) {
        var _a;
        this._viewfinder = newViewfinder;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    /**
     * @deprecated Since 7.6. These factories will be removed in 8.0.
     * Use the public constructor instead and add the overlay to the view manually:
     * const overlay = new LabelCaptureBasicOverlay(labelCapture);
     * view.addOverlay(overlay);
     */
    static withLabelCapture(labelCapture) {
        return LabelCaptureBasicOverlay.withLabelCaptureForView(labelCapture, null);
    }
    /**
     * @deprecated Since 7.6. These factories will be removed in 8.0.
     * Use the public constructor instead and add the overlay to the view manually:
     * const overlay = new LabelCaptureBasicOverlay(labelCapture);
     * view.addOverlay(overlay);
     */
    static withLabelCaptureForView(labelCapture, view) {
        const overlay = new LabelCaptureBasicOverlay(labelCapture);
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
    constructor(mode) {
        super();
        this.type = 'labelCaptureBasic';
        this.controller = null;
        this._view = null;
        this._predictedFieldBrush = LabelCaptureBasicOverlay.defaultPredictedFieldBrush.copy;
        this._capturedFieldBrush = LabelCaptureBasicOverlay.defaultCapturedFieldBrush.copy;
        this._labelBrush = LabelCaptureBasicOverlay.defaultLabelBrush.copy;
        this._shouldShowScanAreaGuides = false;
        this.hasListener = false;
        this._listener = null;
        this._viewfinder = null;
        this.modeId = mode.modeId;
    }
    setBrushForFieldOfLabel(brush, field, label) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setBrushForFieldOfLabel(brush, field, label);
        });
    }
    setBrushForLabel(brush, label) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.setBrushForLabel(brush, label);
        });
    }
}
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "controller", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "_view", void 0);
__decorate([
    nameForSerialization('defaultPredictedFieldBrush')
], LabelCaptureBasicOverlay.prototype, "_predictedFieldBrush", void 0);
__decorate([
    nameForSerialization('defaultCapturedFieldBrush')
], LabelCaptureBasicOverlay.prototype, "_capturedFieldBrush", void 0);
__decorate([
    nameForSerialization('defaultLabelBrush')
], LabelCaptureBasicOverlay.prototype, "_labelBrush", void 0);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], LabelCaptureBasicOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "_listener", void 0);
__decorate([
    serializationDefault(NoViewfinder),
    nameForSerialization('viewfinder')
], LabelCaptureBasicOverlay.prototype, "_viewfinder", void 0);

var LabelCaptureValidationFlowListenerEvents;
(function (LabelCaptureValidationFlowListenerEvents) {
    LabelCaptureValidationFlowListenerEvents["didCaptureLabelWithFields"] = "LabelCaptureValidationFlowListener.didCaptureLabelWithFields";
})(LabelCaptureValidationFlowListenerEvents || (LabelCaptureValidationFlowListenerEvents = {}));
class LabelCaptureValidationFlowOverlayController extends BaseController {
    constructor(overlay) {
        super('LabelCaptureValidationFlowOverlayProxy');
        this.isSubscribed = false;
        this.overlay = overlay;
        this.initialize();
    }
    initialize() {
        if (this.overlay.listener) {
            this.subscribeLabelCaptureValidationFlowListener();
        }
    }
    updateValidationFlowOverlay() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._proxy.$updateLabelCaptureValidationFlowOverlay({ dataCaptureViewId: this.dataCaptureViewId, overlayJson: JSON.stringify(this.overlay.toJSON()) });
        });
    }
    subscribeLabelCaptureValidationFlowListener() {
        if (this.isSubscribed) {
            return;
        }
        this._proxy.$registerListenerForValidationFlowEvents({ dataCaptureViewId: this.dataCaptureViewId });
        this._proxy.subscribeForEvents(Object.values(LabelCaptureValidationFlowListenerEvents));
        this._proxy.eventEmitter.on(LabelCaptureValidationFlowListenerEvents.didCaptureLabelWithFields, this.handleDidCaptureLabelWithFieldsEvent.bind(this));
        this.isSubscribed = true;
    }
    unsubscribeLabelCaptureValidationFlowListener() {
        if (!this.isSubscribed) {
            return;
        }
        this._proxy.$unregisterListenerForValidationFlowEvents({ dataCaptureViewId: this.dataCaptureViewId });
        this._proxy.eventEmitter.off(LabelCaptureValidationFlowListenerEvents.didCaptureLabelWithFields, this.handleDidCaptureLabelWithFieldsEvent.bind(this));
        this._proxy.unsubscribeFromEvents(Object.values(LabelCaptureValidationFlowListenerEvents));
        this.isSubscribed = false;
    }
    handleDidCaptureLabelWithFieldsEvent(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(ev.data);
            const fields = payload.fields.map((field) => LabelField.fromJSON(JSON.parse(field)));
            this.notifyListenersOfDidCaptureLabelWithFields(fields);
        });
    }
    notifyListenersOfDidCaptureLabelWithFields(fields) {
        var _a;
        (_a = this.overlay.listener) === null || _a === void 0 ? void 0 : _a.didCaptureLabelWithFields(fields);
    }
    get dataCaptureViewId() {
        var _a, _b;
        return (_b = (_a = this.overlay.view) === null || _a === void 0 ? void 0 : _a.viewId) !== null && _b !== void 0 ? _b : -1;
    }
    dispose() {
        this.unsubscribeLabelCaptureValidationFlowListener();
        this._proxy.dispose();
    }
}

class LabelCaptureValidationFlowOverlay extends DefaultSerializeable {
    get view() {
        return this._view;
    }
    set view(newView) {
        var _a, _b;
        if (newView === null) {
            this._view = null;
            (_a = this.controller) === null || _a === void 0 ? void 0 : _a.dispose();
            this.controller = null;
            return;
        }
        this._view = newView;
        (_b = this.controller) !== null && _b !== void 0 ? _b : (this.controller = new LabelCaptureValidationFlowOverlayController(this));
    }
    /**
     * @deprecated Since 7.6. This factory will be removed in 8.0.
     * Use the public constructor instead and add the overlay to the view manually:
     * ```ts
     * const overlay = new LabelCaptureValidationFlowOverlay(labelCapture);
     * view.addOverlay(overlay);
     * ```
     */
    static withLabelCaptureForView(labelCapture, view) {
        const overlay = new LabelCaptureValidationFlowOverlay(labelCapture);
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
    get listener() {
        return this._listener;
    }
    set listener(listener) {
        var _a, _b;
        this.hasListener = listener != null;
        if (this.view == null) {
            this._listener = listener;
            return;
        }
        if (listener == null) {
            (_a = this.controller) === null || _a === void 0 ? void 0 : _a.unsubscribeLabelCaptureValidationFlowListener();
        }
        else if (this.listener == null) {
            (_b = this.controller) === null || _b === void 0 ? void 0 : _b.subscribeLabelCaptureValidationFlowListener();
        }
        this._listener = listener;
    }
    applySettings(settings) {
        var _a, _b;
        this.settings = settings;
        return (_b = (_a = this.controller) === null || _a === void 0 ? void 0 : _a.updateValidationFlowOverlay()) !== null && _b !== void 0 ? _b : Promise.resolve();
    }
    constructor(mode) {
        super();
        this.type = 'validationFlow';
        this.settings = null;
        this.hasListener = false;
        this._listener = null;
        this.controller = null;
        this._view = null;
        this.modeId = mode.modeId;
    }
}
__decorate([
    nameForSerialization('hasListener')
], LabelCaptureValidationFlowOverlay.prototype, "hasListener", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureValidationFlowOverlay.prototype, "_listener", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureValidationFlowOverlay.prototype, "controller", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureValidationFlowOverlay.prototype, "_view", void 0);

class LabelCaptureValidationFlowSettings extends DefaultSerializeable {
    static create() {
        return new LabelCaptureValidationFlowSettings();
    }
    constructor() {
        super();
        const defaults = getLabelCaptureDefaults().LabelCapture.LabelCaptureValidationFlowOverlay.Settings;
        this._missingFieldsHintText = defaults.missingFieldsHintText;
        this._standbyHintText = defaults.standbyHintText;
        this._validationHintText = defaults.validationHintText;
        this._validationErrorText = defaults.validationErrorText;
        this._requiredFieldErrorText = defaults.requiredFieldErrorText;
        this._manualInputButtonText = defaults.manualInputButtonText;
    }
    get missingFieldsHintText() {
        return this._missingFieldsHintText;
    }
    set missingFieldsHintText(text) {
        this._missingFieldsHintText = text;
    }
    get standbyHintText() {
        return this._standbyHintText;
    }
    set standbyHintText(text) {
        this._standbyHintText = text;
    }
    get validationHintText() {
        return this._validationHintText;
    }
    set validationHintText(text) {
        this._validationHintText = text;
    }
    get validationErrorText() {
        return this._validationErrorText;
    }
    set validationErrorText(text) {
        this._validationErrorText = text;
    }
    get requiredFieldErrorText() {
        return this._requiredFieldErrorText;
    }
    set requiredFieldErrorText(text) {
        this._requiredFieldErrorText = text;
    }
    get manualInputButtonText() {
        return this._manualInputButtonText;
    }
    set manualInputButtonText(text) {
        this._manualInputButtonText = text;
    }
}
__decorate([
    nameForSerialization('missingFieldsHintText')
], LabelCaptureValidationFlowSettings.prototype, "_missingFieldsHintText", void 0);
__decorate([
    nameForSerialization('standbyHintText')
], LabelCaptureValidationFlowSettings.prototype, "_standbyHintText", void 0);
__decorate([
    nameForSerialization('validationHintText')
], LabelCaptureValidationFlowSettings.prototype, "_validationHintText", void 0);
__decorate([
    nameForSerialization('validationErrorText')
], LabelCaptureValidationFlowSettings.prototype, "_validationErrorText", void 0);
__decorate([
    nameForSerialization('requiredFieldErrorText')
], LabelCaptureValidationFlowSettings.prototype, "_requiredFieldErrorText", void 0);
__decorate([
    nameForSerialization('manualInputButtonText')
], LabelCaptureValidationFlowSettings.prototype, "_manualInputButtonText", void 0);

export { BarcodeField, CapturedLabel, CustomBarcode, CustomText, ExpiryDateText, ImeiOneBarcode, ImeiTwoBarcode, LabelCapture, LabelCaptureAdvancedOverlay, LabelCaptureAdvancedOverlayController, LabelCaptureAdvancedOverlayListenerEvents, LabelCaptureBasicOverlay, LabelCaptureBasicOverlayController, LabelCaptureBasicOverlayListenerEvents, LabelCaptureController, LabelCaptureFeedback, LabelCaptureListenerEvents, LabelCaptureSession, LabelCaptureSettings, LabelCaptureValidationFlowListenerEvents, LabelCaptureValidationFlowOverlay, LabelCaptureValidationFlowOverlayController, LabelCaptureValidationFlowSettings, LabelDateComponentFormat, LabelDateFormat, LabelDateResult, LabelDefinition, LabelField, LabelFieldDefinition, LabelFieldLocation, LabelFieldLocationType, LabelFieldState, LabelFieldType, PackingDateText, PartNumberBarcode, SerialNumberBarcode, TextField, TotalPriceText, UnitPriceText, WeightText, getLabelCaptureDefaults, loadLabelCaptureDefaults };
