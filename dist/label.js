import { nameForSerialization, ignoreFromSerializationIfNull, serializationDefault, NoViewfinder, FactoryMaker, CameraSettings, Brush, DefaultSerializeable, ignoreFromSerialization, Quadrilateral, BaseController, Rect, Point, Size, Anchor, PointWithUnit } from 'scandit-react-native-datacapture-core/dist/core';
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
], LabelFieldDefinition.prototype, "_name", undefined);
__decorate([
    nameForSerialization('patterns')
], LabelFieldDefinition.prototype, "_patterns", undefined);
__decorate([
    nameForSerialization('optional')
], LabelFieldDefinition.prototype, "_optional", undefined);
__decorate([
    ignoreFromSerialization
], LabelFieldDefinition.prototype, "_hiddenProperties", undefined);

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
], BarcodeField.prototype, "_symbologies", undefined);
__decorate([
    ignoreFromSerialization
], BarcodeField.prototype, "_symbologySettings", undefined);

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
        return (_a = this._dayString) !== null && _a !== undefined ? _a : '';
    }
    get monthString() {
        var _a;
        return (_a = this._monthString) !== null && _a !== undefined ? _a : '';
    }
    get yearString() {
        var _a;
        return (_a = this._yearString) !== null && _a !== undefined ? _a : '';
    }
    static fromJSON(json) {
        return new LabelDateResult(json.day, json.month, json.year, json.dayStr, json.monthStr, json.yearStr);
    }
}
__decorate([
    nameForSerialization('day')
], LabelDateResult.prototype, "_day", undefined);
__decorate([
    nameForSerialization('month')
], LabelDateResult.prototype, "_month", undefined);
__decorate([
    nameForSerialization('year')
], LabelDateResult.prototype, "_year", undefined);
__decorate([
    nameForSerialization('dayStr')
], LabelDateResult.prototype, "_dayString", undefined);
__decorate([
    nameForSerialization('monthStr')
], LabelDateResult.prototype, "_monthString", undefined);
__decorate([
    nameForSerialization('yearStr')
], LabelDateResult.prototype, "_yearString", undefined);

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
], CustomBarcode.prototype, "location", undefined);
__decorate([
    nameForSerialization('dataTypePatterns')
], CustomBarcode.prototype, "_dataTypePatterns", undefined);
__decorate([
    nameForSerialization('fieldType')
], CustomBarcode.prototype, "_fieldType", undefined);

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
], CustomText.prototype, "location", undefined);
__decorate([
    nameForSerialization('dataTypePatterns')
], CustomText.prototype, "_dataTypePatterns", undefined);
__decorate([
    nameForSerialization('fieldType')
], CustomText.prototype, "_fieldType", undefined);

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
}
__decorate([
    nameForSerialization('fieldType')
], ExpiryDateText.prototype, "_fieldType", undefined);
__decorate([
    nameForSerialization('dataTypePatterns')
], ExpiryDateText.prototype, "_dataTypePatterns", undefined);
__decorate([
    nameForSerialization('labelDateFormat')
], ExpiryDateText.prototype, "_labelDateFormat", undefined);

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
], ImeiOneBarcode.prototype, "_fieldType", undefined);

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
], ImeiTwoBarcode.prototype, "_fieldType", undefined);

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
class LabelCaptureListenerController extends BaseController {
    constructor() {
        super('LabelCaptureListenerProxy');
    }
    static forLabelCapture(labelCapture) {
        const controller = new LabelCaptureListenerController();
        controller.mode = labelCapture;
        return controller;
    }
    subscribeListener() {
        return __awaiter(this, undefined, undefined, function* () {
            yield this._proxy.$registerListenerForEvents();
            this._proxy.on$didUpdateSession = (ev) => __awaiter(this, undefined, undefined, function* () {
                const payload = JSON.parse(ev.data);
                const session = LabelCaptureSession.fromJSON(JSON.parse(payload.session));
                this.notifyListenersOfDidUpdateSession(session);
                yield this._proxy.$finishDidUpdateSessionCallback({ isEnabled: this.mode.isEnabled });
            });
        });
    }
    unsubscribeListener() {
        return __awaiter(this, undefined, undefined, function* () {
            yield this._proxy.$unregisterListenerForEvents();
        });
    }
    notifyListenersOfDidUpdateSession(session) {
        const mode = this.mode;
        mode.isInListenerCallback = true;
        mode.listeners.forEach(listener => {
            if (listener.didUpdateSession) {
                listener.didUpdateSession(this.mode, session);
            }
        });
        mode.isInListenerCallback = false;
    }
}

class LabelCaptureController extends BaseController {
    constructor() {
        super('LabelCaptureProxy');
    }
    setModeEnabledState(isEnabled) {
        return this._proxy.$setModeEnabledState({ isEnabled });
    }
    updateLabelCaptureSettings(settingsJson) {
        return this._proxy.$updateLabelCaptureSettings({ settingsJson });
    }
}

class LabelCapture extends DefaultSerializeable {
    get isEnabled() {
        return this._isEnabled;
    }
    set isEnabled(isEnabled) {
        this._isEnabled = isEnabled;
        this.modeController.setModeEnabledState(isEnabled);
    }
    get context() {
        return this._context;
    }
    static get recommendedCameraSettings() {
        return getLabelCaptureDefaults().LabelCapture.RecommendedCameraSettings;
    }
    get _context() {
        return this.privateContext;
    }
    set _context(newContext) {
        if (newContext == null) {
            this.listenerController.unsubscribeListener();
        }
        else if (this.privateContext == null) {
            this.listenerController.subscribeListener();
        }
        this.privateContext = newContext;
    }
    static forContext(context, settings) {
        const mode = new LabelCapture();
        mode.settings = settings;
        if (context) {
            context.addMode(mode);
        }
        return mode;
    }
    constructor() {
        super();
        this.type = 'labelCapture';
        this._isEnabled = true;
        this.privateContext = null;
        this.listeners = [];
        this.isInListenerCallback = false;
        this.listenerController = LabelCaptureListenerController.forLabelCapture(this);
        this.modeController = new LabelCaptureController();
    }
    applySettings(settings) {
        this.settings = settings;
        return this.modeController.updateLabelCaptureSettings(JSON.stringify(settings.toJSON()));
    }
    addListener(listener) {
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    removeListener(listener) {
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}
__decorate([
    nameForSerialization('enabled')
], LabelCapture.prototype, "_isEnabled", undefined);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "privateContext", undefined);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "listeners", undefined);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "listenerController", undefined);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "isInListenerCallback", undefined);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "modeController", undefined);

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
    constructor() {
        super('LabelCaptureAdvancedOverlayProxy');
    }
    static forOverlay(overlay) {
        const proxy = new LabelCaptureAdvancedOverlayController();
        proxy.overlay = overlay;
        return proxy;
    }
    setViewForCapturedLabel(label, view) {
        return this._proxy.$setViewForCapturedLabel({
            jsonView: view ? JSON.stringify(view.toJSON()) : null,
            trackingId: label.trackingID
        });
    }
    setAnchorForCapturedLabel(label, anchor) {
        return this._proxy.$setAnchorForCapturedLabel({
            anchor: anchor,
            trackingId: label.trackingID
        });
    }
    setOffsetForCapturedLabel(label, offset) {
        return this._proxy.$setOffsetForCapturedLabel({
            offsetJson: JSON.stringify(offset.toJSON()),
            trackingId: label.trackingID
        });
    }
    setViewForCapturedLabelField(label, field, view) {
        const identifier = `${label.trackingID}§${field.name}`;
        return this.setViewForCapturedLabelFieldPrivate(identifier, view);
    }
    setViewForCapturedLabelFieldPrivate(identifier, view) {
        return this._proxy.$setViewForCapturedLabelField({
            view: view ? JSON.stringify(view.toJSON()) : null,
            identifier: identifier
        });
    }
    setAnchorForCapturedLabelField(label, field, anchor) {
        const identifier = `${label.trackingID}§${field.name}`;
        return this.setAnchorForCapturedLabelFieldPrivate(identifier, anchor);
    }
    setAnchorForCapturedLabelFieldPrivate(identifier, anchor) {
        return this._proxy.$setAnchorForCapturedLabelField({
            anchor: anchor,
            identifier: identifier
        });
    }
    setOffsetForCapturedLabelField(label, field, offset) {
        const identifier = `${label.trackingID}§${field.name}`;
        return this.setOffsetForCapturedLabelFieldPrivate(identifier, offset);
    }
    setOffsetForCapturedLabelFieldPrivate(identifier, offset) {
        return this._proxy.$setOffsetForCapturedLabelField({
            offset: JSON.stringify(offset.toJSON()),
            identifier: identifier
        });
    }
    clearCapturedLabelViews() {
        return this._proxy.$clearCapturedLabelViews();
    }
    subscribeListener() {
        this._proxy.$registerListenerForAdvancedOverlayEvents();
        this._proxy.on$viewForLabel = (ev) => __awaiter(this, undefined, undefined, function* () {
            const payload = JSON.parse(ev.data);
            let view = null;
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.viewForCapturedLabel) {
                view = this.overlay.listener.viewForCapturedLabel(this.overlay, label);
            }
            yield this.setViewForCapturedLabel(label, view);
        });
        this._proxy.on$anchorForLabel = (ev) => __awaiter(this, undefined, undefined, function* () {
            const payload = JSON.parse(ev.data);
            let anchor = Anchor.Center;
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.anchorForCapturedLabel) {
                anchor = this.overlay.listener.anchorForCapturedLabel(this.overlay, label);
            }
            yield this.setAnchorForCapturedLabel(label, anchor);
        });
        this._proxy.on$offsetForLabel = (ev) => __awaiter(this, undefined, undefined, function* () {
            const payload = JSON.parse(ev.data);
            let offset = PointWithUnit.zero;
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.offsetForCapturedLabel) {
                offset = this.overlay.listener.offsetForCapturedLabel(this.overlay, label);
            }
            yield this.setOffsetForCapturedLabel(label, offset);
        });
        this._proxy.on$viewForCapturedLabelField = (ev) => __awaiter(this, undefined, undefined, function* () {
            const payload = JSON.parse(ev.data);
            let view = null;
            const field = LabelField.fromJSON(JSON.parse(payload.field));
            if (this.overlay.listener && this.overlay.listener.viewForCapturedLabelField) {
                view = this.overlay.listener.viewForCapturedLabelField(this.overlay, field);
            }
            yield this.setViewForCapturedLabelFieldPrivate(payload.identifier, view);
        });
        this._proxy.on$anchorForCapturedLabelField = (ev) => __awaiter(this, undefined, undefined, function* () {
            const payload = JSON.parse(ev.data);
            let anchor = Anchor.Center;
            const field = LabelField.fromJSON(JSON.parse(payload.field));
            if (this.overlay.listener && this.overlay.listener.anchorForCapturedLabelField) {
                anchor = this.overlay.listener.anchorForCapturedLabelField(this.overlay, field);
            }
            yield this.setAnchorForCapturedLabelFieldPrivate(payload.identifier, anchor);
        });
        this._proxy.on$offsetForCapturedLabelField = (ev) => __awaiter(this, undefined, undefined, function* () {
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
        return this._proxy.$unregisterListenerForAdvancedOverlayEvents();
    }
    updateAdvancedOverlay(advancedOverlayJson) {
        return this._proxy.$updateLabelCaptureAdvancedOverlay({ advancedOverlayJson });
    }
}

class LabelCaptureAdvancedOverlay extends DefaultSerializeable {
    set view(newView) {
        if (newView == null) {
            this.proxy.unsubscribeListener();
        }
        else if (this._view == null) {
            this.proxy.subscribeListener();
        }
        this._view = newView;
    }
    get view() {
        return this._view;
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.proxy.updateAdvancedOverlay(JSON.stringify(this.toJSON()));
    }
    static withLabelCaptureForView(labelCapture, view) {
        const overlay = new LabelCaptureAdvancedOverlay();
        overlay.mode = labelCapture;
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
    constructor() {
        super();
        this.type = 'labelCaptureAdvanced';
        this.listener = null;
        this._shouldShowScanAreaGuides = false;
        this.proxy = LabelCaptureAdvancedOverlayController.forOverlay(this);
    }
    setViewForCapturedLabel(capturedLabel, view) {
        return this.proxy.setViewForCapturedLabel(capturedLabel, view);
    }
    setViewForCapturedLabelField(field, capturedLabel, view) {
        return this.proxy.setViewForCapturedLabelField(capturedLabel, field, view);
    }
    setAnchorForCapturedLabel(capturedLabel, anchor) {
        return this.proxy.setAnchorForCapturedLabel(capturedLabel, anchor);
    }
    setAnchorForCapturedLabelField(field, capturedLabel, anchor) {
        return this.proxy.setAnchorForCapturedLabelField(capturedLabel, field, anchor);
    }
    setOffsetForCapturedLabel(capturedLabel, offset) {
        return this.proxy.setOffsetForCapturedLabel(capturedLabel, offset);
    }
    setOffsetForCapturedLabelField(field, capturedLabel, offset) {
        return this.proxy.setOffsetForCapturedLabelField(capturedLabel, field, offset);
    }
    clearCapturedLabelViews() {
        return this.proxy.clearCapturedLabelViews();
    }
}
__decorate([
    ignoreFromSerialization
], LabelCaptureAdvancedOverlay.prototype, "proxy", undefined);
__decorate([
    ignoreFromSerialization
], LabelCaptureAdvancedOverlay.prototype, "mode", undefined);
__decorate([
    ignoreFromSerialization
], LabelCaptureAdvancedOverlay.prototype, "_view", undefined);
__decorate([
    ignoreFromSerialization
], LabelCaptureAdvancedOverlay.prototype, "listener", undefined);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], LabelCaptureAdvancedOverlay.prototype, "_shouldShowScanAreaGuides", undefined);

class LabelCaptureSettings extends DefaultSerializeable {
    static fromJSON(json) {
        // tslint:disable-next-line:no-console
        throw new Error('This property is deprecated in favour of LabelCaptureSettings.settingsFromLabelDefinitions. Please update your code to use the new property.');
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
    setProperty(name, value) {
        this[name] = value;
    }
    getProperty(name) {
        return this[name];
    }
}
__decorate([
    nameForSerialization('labelDefinitions')
], LabelCaptureSettings.prototype, "_definitions", undefined);

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
], LabelDateFormat.prototype, "_componentFormat", undefined);
__decorate([
    nameForSerialization('acceptPartialDates')
], LabelDateFormat.prototype, "_acceptPartialDates", undefined);

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
    constructor(name) {
        super();
        this._name = '';
        this._fields = [];
        this._hiddenProperties = {};
        this._name = name;
    }
}
__decorate([
    nameForSerialization('name')
], LabelDefinition.prototype, "_name", undefined);
__decorate([
    nameForSerialization('fields')
], LabelDefinition.prototype, "_fields", undefined);
__decorate([
    ignoreFromSerialization
], LabelDefinition.prototype, "_hiddenProperties", undefined);

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
], LabelFieldLocation.prototype, "_rect", undefined);
__decorate([
    nameForSerialization('type'),
    ignoreFromSerializationIfNull
], LabelFieldLocation.prototype, "_type", undefined);

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
], PackingDateText.prototype, "_fieldType", undefined);
__decorate([
    nameForSerialization('dataTypePatterns')
], PackingDateText.prototype, "_dataTypePatterns", undefined);
__decorate([
    nameForSerialization('labelDateFormat')
], PackingDateText.prototype, "_labelDateFormat", undefined);

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
], PartNumberBarcode.prototype, "_fieldType", undefined);

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
], SerialNumberBarcode.prototype, "_fieldType", undefined);

class TotalPriceText extends TextField {
    constructor(name) {
        super(name);
        this._fieldType = 'totalPriceText';
    }
}
__decorate([
    nameForSerialization('fieldType')
], TotalPriceText.prototype, "_fieldType", undefined);

class UnitPriceText extends TextField {
    constructor(name) {
        super(name);
        this._fieldType = 'unitPriceText';
    }
}
__decorate([
    nameForSerialization('fieldType')
], UnitPriceText.prototype, "_fieldType", undefined);

class WeightText extends TextField {
    constructor(name) {
        super(name);
        this._fieldType = 'weightText';
    }
}
__decorate([
    nameForSerialization('fieldType')
], WeightText.prototype, "_fieldType", undefined);

var LabelCaptureBasicOverlayListenerEvents;
(function (LabelCaptureBasicOverlayListenerEvents) {
    LabelCaptureBasicOverlayListenerEvents["brushForFieldOfLabel"] = "LabelCaptureBasicOverlayListener.brushForFieldOfLabel";
    LabelCaptureBasicOverlayListenerEvents["brushForLabel"] = "LabelCaptureBasicOverlayListener.brushForLabel";
    LabelCaptureBasicOverlayListenerEvents["didTapLabel"] = "LabelCaptureBasicOverlayListener.didTapLabel";
})(LabelCaptureBasicOverlayListenerEvents || (LabelCaptureBasicOverlayListenerEvents = {}));
class LabelCaptureBasicOverlayController extends BaseController {
    constructor() {
        super('LabelCaptureBasicOverlayProxy');
    }
    static forOverlay(overlay) {
        const proxy = new LabelCaptureBasicOverlayController();
        proxy.overlay = overlay;
        return proxy;
    }
    setBrushForFieldOfLabel(brush, field, label) {
        return this._proxy.$setBrushForFieldOfLabel({
            brushJson: brush ? JSON.stringify(brush.toJSON()) : null,
            fieldName: field.name,
            trackingId: label.trackingID
        });
    }
    setBrushForLabel(brush, label) {
        return this._proxy.$setBrushForLabel({
            brushJson: brush ? JSON.stringify(brush.toJSON()) : null,
            trackingId: label.trackingID
        });
    }
    subscribeListener() {
        return __awaiter(this, undefined, undefined, function* () {
            yield this._proxy.$registerListenerForBasicOverlayEvents();
            this._proxy.on$brushForFieldOfLabel = (ev) => __awaiter(this, undefined, undefined, function* () {
                const payload = JSON.parse(ev.data);
                let brush = this.overlay.capturedFieldBrush;
                const field = LabelField.fromJSON(JSON.parse(payload.field));
                const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
                if (this.overlay.listener && this.overlay.listener.brushForFieldOfLabel) {
                    brush = this.overlay.listener.brushForFieldOfLabel(this.overlay, field, label);
                }
                yield this.setBrushForFieldOfLabel(brush, field, label);
            });
            this._proxy.on$brushForLabel = (ev) => __awaiter(this, undefined, undefined, function* () {
                const payload = JSON.parse(ev.data);
                let brush = this.overlay.labelBrush;
                const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
                if (this.overlay.listener && this.overlay.listener.brushForLabel) {
                    brush = this.overlay.listener.brushForLabel(this.overlay, label);
                }
                yield this.setBrushForLabel(brush, label);
            });
            this._proxy.on$didTapLabel = (ev) => __awaiter(this, undefined, undefined, function* () {
                const payload = JSON.parse(ev.data);
                if (this.overlay.listener && this.overlay.listener.didTapLabel) {
                    const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
                    this.overlay.listener.didTapLabel(this.overlay, label);
                }
            });
        });
    }
    unsubscribeListener() {
        return __awaiter(this, undefined, undefined, function* () {
            yield this._proxy.$unregisterListenerForBasicOverlayEvents();
        });
    }
    updateBasicOverlay(basicOverlayJson) {
        return this._proxy.$updateLabelCaptureBasicOverlay({ basicOverlayJson });
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
    set view(newView) {
        if (newView == null) {
            this.controller.unsubscribeListener();
        }
        else if (this._view == null) {
            this.controller.subscribeListener();
        }
        this._view = newView;
    }
    get view() {
        return this._view;
    }
    get predictedFieldBrush() {
        return this._predictedFieldBrush;
    }
    set predictedFieldBrush(newBrush) {
        this._predictedFieldBrush = newBrush;
        this.controller.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    get capturedFieldBrush() {
        return this._capturedFieldBrush;
    }
    set capturedFieldBrush(newBrush) {
        this._capturedFieldBrush = newBrush;
        this.controller.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    get labelBrush() {
        return this._labelBrush;
    }
    set labelBrush(newBrush) {
        this._labelBrush = newBrush;
        this.controller.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.controller.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    get viewfinder() {
        return this._viewfinder;
    }
    set viewfinder(newViewfinder) {
        this._viewfinder = newViewfinder;
        this.controller.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    static withLabelCapture(labelCapture) {
        return LabelCaptureBasicOverlay.withLabelCaptureForView(labelCapture, null);
    }
    static withLabelCaptureForView(labelCapture, view) {
        const overlay = new LabelCaptureBasicOverlay();
        overlay.mode = labelCapture;
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
    constructor() {
        super();
        this.type = 'labelCaptureBasic';
        this._predictedFieldBrush = LabelCaptureBasicOverlay.defaultPredictedFieldBrush.copy;
        this._capturedFieldBrush = LabelCaptureBasicOverlay.defaultCapturedFieldBrush.copy;
        this._labelBrush = LabelCaptureBasicOverlay.defaultLabelBrush.copy;
        this._shouldShowScanAreaGuides = false;
        this.listener = null;
        this._viewfinder = null;
        this.controller = LabelCaptureBasicOverlayController.forOverlay(this);
    }
    setBrushForFieldOfLabel(brush, field, label) {
        return this.controller.setBrushForFieldOfLabel(brush, field, label);
    }
    setBrushForLabel(brush, label) {
        return this.controller.setBrushForLabel(brush, label);
    }
}
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "mode", undefined);
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "_view", undefined);
__decorate([
    nameForSerialization('defaultPredictedFieldBrush')
], LabelCaptureBasicOverlay.prototype, "_predictedFieldBrush", undefined);
__decorate([
    nameForSerialization('defaultCapturedFieldBrush')
], LabelCaptureBasicOverlay.prototype, "_capturedFieldBrush", undefined);
__decorate([
    nameForSerialization('defaultLabelBrush')
], LabelCaptureBasicOverlay.prototype, "_labelBrush", undefined);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], LabelCaptureBasicOverlay.prototype, "_shouldShowScanAreaGuides", undefined);
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "listener", undefined);
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "controller", undefined);
__decorate([
    serializationDefault(NoViewfinder),
    nameForSerialization('viewfinder')
], LabelCaptureBasicOverlay.prototype, "_viewfinder", undefined);

export { BarcodeField, CapturedLabel, CustomBarcode, CustomText, ExpiryDateText, ImeiOneBarcode, ImeiTwoBarcode, LabelCapture, LabelCaptureAdvancedOverlay, LabelCaptureAdvancedOverlayController, LabelCaptureAdvancedOverlayListenerEvents, LabelCaptureBasicOverlay, LabelCaptureBasicOverlayController, LabelCaptureBasicOverlayListenerEvents, LabelCaptureController, LabelCaptureListenerController, LabelCaptureListenerEvents, LabelCaptureSession, LabelCaptureSettings, LabelDateComponentFormat, LabelDateFormat, LabelDateResult, LabelDefinition, LabelField, LabelFieldDefinition, LabelFieldLocation, LabelFieldLocationType, LabelFieldState, LabelFieldType, PackingDateText, PartNumberBarcode, SerialNumberBarcode, TextField, TotalPriceText, UnitPriceText, WeightText, getLabelCaptureDefaults, loadLabelCaptureDefaults };
