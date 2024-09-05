import { nameForSerialization, serializationDefault, ignoreFromSerializationIfNull, DefaultSerializeable, ignoreFromSerialization, Point, Size } from 'scandit-react-native-datacapture-core/dist/core';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { Barcode } from 'scandit-react-native-datacapture-barcode';
import { CameraSettings, Color, NoViewfinder, Quadrilateral, Brush, Rect } from 'scandit-react-native-datacapture-core';
import { getBarcodeDefaults } from 'scandit-react-native-datacapture-barcode/dist/barcode';

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
/* global Reflect, Promise, SuppressedError, Symbol */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var LabelFieldType;
(function (LabelFieldType) {
    LabelFieldType["Barcode"] = "barcode";
    LabelFieldType["Text"] = "text";
    LabelFieldType["Unknown"] = "unknown";
})(LabelFieldType || (LabelFieldType = {}));
var LabelFieldState;
(function (LabelFieldState) {
    LabelFieldState["Captured"] = "captured";
    LabelFieldState["Predicted"] = "predicted";
    LabelFieldState["Unknown"] = "unknown";
})(LabelFieldState || (LabelFieldState = {}));
class CapturedLabel {
    _fields;
    _name;
    _predictedBounds;
    _deltaTimeToPrediction;
    _trackingID;
    _isComplete;
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
    frameSequenceID;
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
class LabelField {
    _name;
    _type;
    _predictedLocation;
    _state;
    _isRequired;
    _barcode;
    _text;
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
    static fromJSON(json) {
        const field = new LabelField();
        field._name = json.name;
        field._type = json.type;
        field._predictedLocation = Quadrilateral.fromJSON(json.location);
        field._state = json.state;
        field._isRequired = json.isRequired;
        field._barcode = json.barcode ? Barcode.fromJSON(json.barcode) : null;
        field._text = json.text;
        return field;
    }
}
class LabelCaptureSession {
    _capturedLabels;
    _frameSequenceID;
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

// tslint:disable:variable-name
const NativeModule$3 = NativeModules.ScanditDataCaptureLabel;
const EventEmitter$1 = new NativeEventEmitter(NativeModule$3);
// tslint:enable:variable-name
var LabelCaptureListenerEventName;
(function (LabelCaptureListenerEventName) {
    LabelCaptureListenerEventName["didUpdateSession"] = "LabelCaptureListener.didUpdateSession";
})(LabelCaptureListenerEventName || (LabelCaptureListenerEventName = {}));
class LabelCaptureListenerProxy {
    mode;
    nativeListeners = [];
    static forLabelCapture(labelCapture) {
        const proxy = new LabelCaptureListenerProxy();
        proxy.mode = labelCapture;
        return proxy;
    }
    subscribeListener() {
        NativeModule$3.registerListenerForEvents();
        const listener = EventEmitter$1.addListener(LabelCaptureListenerEventName.didUpdateSession, (body) => {
            const payload = JSON.parse(body);
            const session = LabelCaptureSession.fromJSON(JSON.parse(payload.session));
            this.notifyListenersOfDidUpdateSession(session);
            NativeModule$3.finishDidUpdateSessionCallback(this.mode.isEnabled);
        });
        this.nativeListeners.push(listener);
    }
    unsubscribeListener() {
        NativeModule$3.unregisterListenerForEvents();
        this.nativeListeners.forEach(listener => listener.remove());
        this.nativeListeners = [];
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

// tslint:disable-next-line:variable-name
const NativeModule$2 = NativeModules.ScanditDataCaptureLabel;
// tslint:disable-next-line:variable-name
const Defaults = {
    LabelCapture: {
        RecommendedCameraSettings: CameraSettings
            .fromJSON(NativeModule$2.Defaults.LabelCapture.RecommendedCameraSettings),
        LabelCaptureBasicOverlay: {
            DefaultPredictedFieldBrush: {
                fillColor: Color
                    .fromJSON(NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.fillColor),
                strokeColor: Color
                    .fromJSON(NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.strokeColor),
                strokeWidth: NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.strokeWidth,
            },
            DefaultCapturedFieldBrush: {
                fillColor: Color
                    .fromJSON(NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.fillColor),
                strokeColor: Color
                    .fromJSON(NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.strokeColor),
                strokeWidth: NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.strokeWidth,
            },
            DefaultLabelBrush: {
                fillColor: Color
                    .fromJSON(NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.fillColor),
                strokeColor: Color
                    .fromJSON(NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.strokeColor),
                strokeWidth: NativeModule$2.Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.strokeWidth,
            },
        },
    },
};

// tslint:disable:variable-name
const NativeModule$1 = NativeModules.ScanditDataCaptureLabel;
// tslint:enable:variable-name
class NativeLabelCaptureProxy {
    setModeEnabledState(enabled) {
        return NativeModule$1.setModeEnabledState(enabled);
    }
    updateLabelCaptureSettings(settingsJson) {
        return NativeModule$1.applyLabelCaptureModeSettings(settingsJson);
    }
}

class LabelCapture extends DefaultSerializeable {
    get isEnabled() {
        return this._isEnabled;
    }
    set isEnabled(isEnabled) {
        this._isEnabled = isEnabled;
        this.modeProxy.setModeEnabledState(isEnabled);
    }
    get context() {
        return this._context;
    }
    static get recommendedCameraSettings() {
        return Defaults.LabelCapture.RecommendedCameraSettings;
    }
    type = 'labelCapture';
    _isEnabled = true;
    settings;
    privateContext = null;
    get _context() {
        return this.privateContext;
    }
    set _context(newContext) {
        if (newContext == null) {
            this.listenerProxy.unsubscribeListener();
        }
        else if (this.privateContext == null) {
            this.listenerProxy.subscribeListener();
        }
        this.privateContext = newContext;
    }
    listeners = [];
    listenerProxy;
    isInListenerCallback = false;
    modeProxy;
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
        this.listenerProxy = LabelCaptureListenerProxy.forLabelCapture(this);
        this.modeProxy = new NativeLabelCaptureProxy();
    }
    applySettings(settings) {
        this.settings = settings;
        return this.modeProxy.updateLabelCaptureSettings(JSON.stringify(settings.toJSON()));
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
], LabelCapture.prototype, "_isEnabled", void 0);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "privateContext", void 0);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "listenerProxy", void 0);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "isInListenerCallback", void 0);
__decorate([
    ignoreFromSerialization
], LabelCapture.prototype, "modeProxy", void 0);

// tslint:disable:variable-name
const NativeModule = NativeModules.ScanditDataCaptureLabel;
const EventEmitter = new NativeEventEmitter(NativeModule);
// tslint:enable:variable-name
var LabelCaptureBasicOverlayListenerEventName;
(function (LabelCaptureBasicOverlayListenerEventName) {
    LabelCaptureBasicOverlayListenerEventName["brushForFieldOfLabel"] = "LabelCaptureBasicOverlayListener.brushForFieldOfLabel";
    LabelCaptureBasicOverlayListenerEventName["brushForLabel"] = "LabelCaptureBasicOverlayListener.brushForLabel";
    LabelCaptureBasicOverlayListenerEventName["didTapLabel"] = "LabelCaptureBasicOverlayListener.didTapLabel";
})(LabelCaptureBasicOverlayListenerEventName || (LabelCaptureBasicOverlayListenerEventName = {}));
class LabelCaptureBasicOverlayProxy {
    overlay;
    nativeListeners = [];
    static forOverlay(overlay) {
        const proxy = new LabelCaptureBasicOverlayProxy();
        proxy.overlay = overlay;
        return proxy;
    }
    setBrushForFieldOfLabel(brush, field, label) {
        return NativeModule.setBrushForFieldOfLabel(JSON.stringify(brush.toJSON()), field.name, label.trackingID);
    }
    setBrushForLabel(brush, label) {
        return NativeModule.setBrushForLabel(JSON.stringify(brush.toJSON()), label.trackingID);
    }
    subscribeListener() {
        NativeModule.registerListenerForBasicOverlayEvents();
        const brushForFieldListener = EventEmitter.addListener(LabelCaptureBasicOverlayListenerEventName.brushForFieldOfLabel, (body) => {
            const payload = JSON.parse(body);
            let brush = this.overlay.capturedFieldBrush;
            const field = LabelField.fromJSON(JSON.parse(payload.field));
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.brushForFieldOfLabel) {
                brush = this.overlay.listener.brushForFieldOfLabel(this.overlay, field, label);
            }
            NativeModule.setBrushForFieldOfLabel(brush ? JSON.stringify(brush.toJSON()) : null, field.name, label.trackingID);
        });
        const brushForLabelListener = EventEmitter.addListener(LabelCaptureBasicOverlayListenerEventName.brushForLabel, (body) => {
            const payload = JSON.parse(body);
            let brush = this.overlay.labelBrush;
            const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
            if (this.overlay.listener && this.overlay.listener.brushForLabel) {
                brush = this.overlay.listener.brushForLabel(this.overlay, label);
            }
            NativeModule.setBrushForLabel(brush ? JSON.stringify(brush.toJSON()) : null, label.trackingID);
        });
        const didTapLabelListener = EventEmitter.addListener(LabelCaptureBasicOverlayListenerEventName.didTapLabel, (body) => {
            const payload = JSON.parse(body);
            if (this.overlay.listener && this.overlay.listener.didTapLabel) {
                const label = CapturedLabel.fromJSON(JSON.parse(payload.label));
                this.overlay.listener.didTapLabel(this.overlay, label);
            }
        });
        this.nativeListeners.push(brushForFieldListener);
        this.nativeListeners.push(brushForLabelListener);
        this.nativeListeners.push(didTapLabelListener);
    }
    unsubscribeListener() {
        NativeModule.unregisterListenerForBasicOverlayEvents();
        this.nativeListeners.forEach(listener => listener.remove());
        this.nativeListeners = [];
    }
    updateBasicOverlay(basicOverlayJson) {
        return NativeModule.updateLabelCaptureBasicOverlay(basicOverlayJson);
    }
}

class LabelCaptureBasicOverlay extends DefaultSerializeable {
    static get defaultPredictedFieldBrush() {
        return new Brush(Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.fillColor, Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.strokeColor, Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultPredictedFieldBrush.strokeWidth);
    }
    static get defaultCapturedFieldBrush() {
        return new Brush(Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.fillColor, Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.strokeColor, Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultCapturedFieldBrush.strokeWidth);
    }
    static get defaultLabelBrush() {
        return new Brush(Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.fillColor, Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.strokeColor, Defaults.LabelCapture.LabelCaptureBasicOverlay.DefaultLabelBrush.strokeWidth);
    }
    type = 'labelCaptureBasic';
    mode;
    _view;
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
    _predictedFieldBrush = LabelCaptureBasicOverlay.defaultPredictedFieldBrush.copy;
    get predictedFieldBrush() {
        return this._predictedFieldBrush;
    }
    set predictedFieldBrush(newBrush) {
        this._predictedFieldBrush = newBrush;
        this.proxy.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    _capturedFieldBrush = LabelCaptureBasicOverlay.defaultCapturedFieldBrush.copy;
    get capturedFieldBrush() {
        return this._capturedFieldBrush;
    }
    set capturedFieldBrush(newBrush) {
        this._capturedFieldBrush = newBrush;
        this.proxy.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    _labelBrush = LabelCaptureBasicOverlay.defaultLabelBrush.copy;
    get labelBrush() {
        return this._labelBrush;
    }
    set labelBrush(newBrush) {
        this._labelBrush = newBrush;
        this.proxy.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    _shouldShowScanAreaGuides = false;
    listener = null;
    proxy;
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.proxy.updateBasicOverlay(JSON.stringify(this.toJSON()));
    }
    _viewfinder = null;
    get viewfinder() {
        return this._viewfinder;
    }
    set viewfinder(newViewfinder) {
        this._viewfinder = newViewfinder;
        this.proxy.updateBasicOverlay(JSON.stringify(this.toJSON()));
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
        this.proxy = LabelCaptureBasicOverlayProxy.forOverlay(this);
    }
    setBrushForFieldOfLabel(brush, field, label) {
        return this.proxy.setBrushForFieldOfLabel(brush, field, label);
    }
    setBrushForLabel(brush, label) {
        return this.proxy.setBrushForLabel(brush, label);
    }
}
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "mode", void 0);
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
], LabelCaptureBasicOverlay.prototype, "listener", void 0);
__decorate([
    ignoreFromSerialization
], LabelCaptureBasicOverlay.prototype, "proxy", void 0);
__decorate([
    serializationDefault(NoViewfinder),
    nameForSerialization('viewfinder')
], LabelCaptureBasicOverlay.prototype, "_viewfinder", void 0);

class LabelCaptureSettings extends DefaultSerializeable {
    _definitions = [];
    properties = {};
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

class LabelDefinition extends DefaultSerializeable {
    _name = '';
    _fields = [];
    _hiddenProperties = {};
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
    ignoreFromSerialization
], LabelDefinition.prototype, "_hiddenProperties", void 0);

class LabelFieldDefinition extends DefaultSerializeable {
    _name;
    _patterns = [];
    _optional = false;
    _hiddenProperties = {};
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
    _rect = null;
    _type = null;
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

class BarcodeField extends LabelFieldDefinition {
    _symbologies;
    _symbologySettings;
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

class TextField extends LabelFieldDefinition {
}

class CustomBarcode extends BarcodeField {
    location = null;
    _dataTypePatterns = [];
    _fieldType = 'customBarcode';
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

class CustomText extends TextField {
    location = null;
    _dataTypePatterns = [];
    _fieldType = 'customText';
    constructor(name) {
        super(name);
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

class SerialNumberBarcode extends BarcodeField {
    _fieldType = 'serialNumberBarcode';
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
    }
}
__decorate([
    nameForSerialization('fieldType')
], SerialNumberBarcode.prototype, "_fieldType", void 0);

class PartNumberBarcode extends BarcodeField {
    _fieldType = 'partNumberBarcode';
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
    }
}
__decorate([
    nameForSerialization('fieldType')
], PartNumberBarcode.prototype, "_fieldType", void 0);

class ImeiOneBarcode extends BarcodeField {
    _fieldType = 'imeiOneBarcode';
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
    }
}
__decorate([
    nameForSerialization('fieldType')
], ImeiOneBarcode.prototype, "_fieldType", void 0);

class ImeiTwoBarcode extends BarcodeField {
    _fieldType = 'imeiTwoBarcode';
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
    }
}
__decorate([
    nameForSerialization('fieldType')
], ImeiTwoBarcode.prototype, "_fieldType", void 0);

class UnitPriceText extends TextField {
    _fieldType = 'unitPriceText';
    constructor(name) {
        super(name);
    }
}
__decorate([
    nameForSerialization('fieldType')
], UnitPriceText.prototype, "_fieldType", void 0);

class TotalPriceText extends TextField {
    _fieldType = 'totalPriceText';
    constructor(name) {
        super(name);
    }
}
__decorate([
    nameForSerialization('fieldType')
], TotalPriceText.prototype, "_fieldType", void 0);

class WeightText extends TextField {
    _fieldType = 'weightText';
    constructor(name) {
        super(name);
    }
}
__decorate([
    nameForSerialization('fieldType')
], WeightText.prototype, "_fieldType", void 0);

class PackingDateText extends TextField {
    _fieldType = 'packingDateText';
    constructor(name) {
        super(name);
    }
}
__decorate([
    nameForSerialization('fieldType')
], PackingDateText.prototype, "_fieldType", void 0);

class ExpiryDateText extends TextField {
    _fieldType = 'expiryDateText';
    constructor(name) {
        super(name);
    }
}
__decorate([
    nameForSerialization('fieldType')
], ExpiryDateText.prototype, "_fieldType", void 0);

export { BarcodeField, CapturedLabel, CustomBarcode, CustomText, ExpiryDateText, ImeiOneBarcode, ImeiTwoBarcode, LabelCapture, LabelCaptureBasicOverlay, LabelCaptureSession, LabelCaptureSettings, LabelDefinition, LabelField, LabelFieldDefinition, LabelFieldLocation, LabelFieldLocationType, LabelFieldState, LabelFieldType, PackingDateText, PartNumberBarcode, SerialNumberBarcode, TextField, TotalPriceText, UnitPriceText, WeightText };
