import { setLabelCaptureDefaultsLoader, LabelCaptureBasicOverlay, LabelCaptureAdvancedOverlay, LabelCaptureValidationFlowOverlay, LabelCaptureAdaptiveRecognitionOverlay, LabelCapture, registerLabelProxies, buildStaticLabelDefaultsJson, loadLabelCaptureDefaults, LabelCaptureSettings, getLabelCaptureDefaults } from './label.js';
export { AdaptiveRecognitionMode, AdaptiveRecognitionResult, AdaptiveRecognitionResultType, BarcodeField, CapturedLabel, CustomBarcode, CustomText, DateText, ExpiryDateText, ImeiOneBarcode, ImeiTwoBarcode, LabelCapture, LabelCaptureAdaptiveRecognitionOverlay, LabelCaptureAdaptiveRecognitionSettings, LabelCaptureAdvancedOverlay, LabelCaptureBasicOverlay, LabelCaptureFeedback, LabelCaptureSession, LabelCaptureSettings, LabelCaptureValidationFlowOverlay, LabelCaptureValidationFlowSettings, LabelDateComponentFormat, LabelDateFormat, LabelDateResult, LabelDefinition, LabelField, LabelFieldDefinition, LabelFieldLocation, LabelFieldLocationType, LabelFieldState, LabelFieldType, LabelFieldValueType, LabelResultUpdateType, PackingDateText, PartNumberBarcode, ReceiptScanningLineItem, ReceiptScanningResult, SerialNumberBarcode, TextField, TotalPriceText, UnitPriceText, WeightText } from './label.js';
import { _internal, DataCaptureView, initCoreProxy, initCoreDefaults, getModuleDynamicDefaults, getNativeModule, createRNNativeCaller } from 'scandit-react-native-datacapture-core';
import { Platform } from 'react-native';
import { FactoryMaker } from 'scandit-react-native-datacapture-core/dist/core';
import React, { forwardRef, useState, useCallback, useEffect, useImperativeHandle } from 'react';
import 'scandit-react-native-datacapture-barcode/dist/barcode.js';

class RNLabelNativeCallerProvider {
    getNativeCaller(_proxyType) {
        // Use getNativeModule which handles both TurboModules and legacy modules
        const nativeModule = getNativeModule('ScanditDataCaptureLabel');
        return createRNNativeCaller(nativeModule);
    }
}

function initLabelProxy() {
    initCoreProxy();
    registerLabelProxies(new RNLabelNativeCallerProvider());
}

// RN has no plugin-init gate: user code can construct LabelCapture immediately at import time,
// so the dynamic residual must be read synchronously here, not via an async round-trip.
function initLabelDefaults() {
    initCoreDefaults();
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    // Merge raw JSON into raw JSON, then let loadLabelCaptureDefaults produce the typed object —
    // never merge into the already-parsed one.
    const merged = buildStaticLabelDefaultsJson(platform);
    // Native's dynamic (and legacy full-blob fallback) payload nests under a "LabelCapture" key,
    // mirroring getDefaults — unlike core/barcode/id, which return theirs flat. Accept either shape
    // so this doesn't depend on that asymmetry (SDC-32175 hit this as a device crash on Capacitor).
    const dynamicJson = getModuleDynamicDefaults('ScanditDataCaptureLabel');
    const labelDynamic = dynamicJson.LabelCapture ?? dynamicJson;
    deepMerge(merged.LabelCapture, labelDynamic);
    // bindInstanceIfNotExists would no-op on a second load, so drop the binding first.
    FactoryMaker.instances.delete('LabelCaptureDefaults');
    loadLabelCaptureDefaults(merged);
}
// Keys whose assignment would mutate the prototype chain instead of setting a data property.
// The payload comes from our own native code, but JSON.parse can produce an own "__proto__" key
// and Object.keys lists it, so the bracket assignment below is guarded.
const UNSAFE_MERGE_KEYS = ['__proto__', 'constructor', 'prototype'];
function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (UNSAFE_MERGE_KEYS.includes(key)) {
            continue;
        }
        const sourceValue = source[key];
        const targetValue = target[key];
        // Both sides must be plain objects to recurse: an array on either side is replaced wholesale,
        // never merged key-by-key (which would leave numeric-index pollution behind).
        if (sourceValue &&
            targetValue &&
            typeof sourceValue === 'object' &&
            typeof targetValue === 'object' &&
            !Array.isArray(sourceValue) &&
            !Array.isArray(targetValue)) {
            // Copy-on-write: buildStatic*DefaultsJson hands out REFERENCES to module-level generated
            // constants, so recursing straight into targetValue would write the dynamic value into the
            // generated constant and corrupt it process-wide for every later caller. Descend into a
            // shallow copy instead.
            const branch = { ...targetValue };
            target[key] = branch;
            deepMerge(branch, sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    }
}
setLabelCaptureDefaultsLoader(initLabelDefaults);

class LabelCaptureAdvancedOverlayView extends React.Component {
    static moduleName = 'LabelCaptureAdvancedOverlayViewComponent';
    toJSON() {
        return {
            moduleName: LabelCaptureAdvancedOverlayView.moduleName,
            initialProperties: this.props,
        };
    }
    get moduleName() {
        return LabelCaptureAdvancedOverlayView.moduleName;
    }
}

function buildSettings(labelCaptureSettings, labelDefinitions) {
    if (labelCaptureSettings) {
        if (labelDefinitions !== undefined) {
            console.warn('LabelCaptureAioView: `labelCaptureSettings` takes precedence; `labelDefinitions` is ignored.');
        }
        return labelCaptureSettings;
    }
    return LabelCaptureSettings.settingsFromLabelDefinitions(labelDefinitions ?? [], {});
}
const LabelCaptureAioView = forwardRef(function LabelCaptureAioView(props, ref) {
    // SDK class instances are stabilized so consumers can pass inline
    // `new Brush(...)` etc. without memoizing. Everything else is read off
    // `props` directly inside the hooks below.
    const labelCaptureSettings = _internal.useStableProp(props.labelCaptureSettings);
    const labelDefinitions = _internal.useStableProp(props.labelDefinitions);
    const basicOverlayLabelBrush = _internal.useStableProp(props.basicOverlay?.labelBrush);
    const basicOverlayCapturedFieldBrush = _internal.useStableProp(props.basicOverlay?.capturedFieldBrush);
    const basicOverlayPredictedFieldBrush = _internal.useStableProp(props.basicOverlay?.predictedFieldBrush);
    const basicOverlayViewfinder = _internal.useStableProp(props.basicOverlay?.viewfinder);
    const validationFlowSettings = _internal.useStableProp(props.validationFlowOverlay?.settings);
    const adaptiveRecognitionSettings = _internal.useStableProp(props.adaptiveRecognitionOverlay?.settings);
    const feedback = _internal.useStableProp(props.feedback);
    const context = _internal.useDataCaptureContextInternal();
    // Shared claim: coexists with any other provider-camera view, coalesced
    // by the coordinator into a single ON/OFF as views come and go.
    const [cameraActive, setCameraActive] = useState(false);
    const viewHandle = _internal.useViewHandle();
    const cameraClaim = _internal.useCameraClaim({
        mode: 'shared',
        active: cameraActive,
        nativeViewRef: viewHandle.mutableRef,
    });
    const viewRef = viewHandle.mutableRef;
    const viewId = viewHandle.id;
    const resolveSettings = useCallback(() => buildSettings(labelCaptureSettings, labelDefinitions), [labelCaptureSettings, labelDefinitions]);
    // ─── Mutual-exclusion gate (adaptive recognition vs validation flow vs advanced) ──
    // Precedence: adaptive recognition (receipt scanning) > validation flow >
    // advanced overlay. When a higher-precedence overlay is configured, the
    // lower-precedence ones are skipped with a warning. (Matches the legacy
    // `useValidationFlow=true` precedence and the Flutter overlay setup.)
    const adaptiveRecognitionConfigured = props.adaptiveRecognitionOverlay !== undefined;
    const validationFlowConfigured = props.validationFlowOverlay !== undefined;
    const advancedOverlayConfigured = props.advancedOverlay !== undefined;
    // Warn once per configuration change (an effect, not render-time) so a
    // frequently re-rendering parent doesn't spam the console.
    useEffect(() => {
        if (adaptiveRecognitionConfigured && (validationFlowConfigured || advancedOverlayConfigured)) {
            console.warn('LabelCaptureAioView: `adaptiveRecognitionOverlay` is mutually exclusive with ' +
                '`validationFlowOverlay` and `advancedOverlay`; ignoring those.');
        }
        else if (validationFlowConfigured && advancedOverlayConfigured) {
            console.warn('LabelCaptureAioView: `advancedOverlay` and `validationFlowOverlay` are mutually exclusive; ' +
                'ignoring `advancedOverlay`.');
        }
    }, [adaptiveRecognitionConfigured, validationFlowConfigured, advancedOverlayConfigured]);
    // ─── Overlays ─────────────────────────────────────────────────────────────
    const basicOverlay = _internal.useOverlay({
        view: viewRef,
        enabled: props.basicOverlay?.enabled !== false,
        factory: () => new LabelCaptureBasicOverlay(getMode()),
        factoryDeps: [],
        update: overlay => {
            if (basicOverlayLabelBrush !== undefined && basicOverlayLabelBrush !== null) {
                overlay.labelBrush = basicOverlayLabelBrush;
            }
            if (basicOverlayCapturedFieldBrush !== undefined && basicOverlayCapturedFieldBrush !== null) {
                overlay.capturedFieldBrush = basicOverlayCapturedFieldBrush;
            }
            if (basicOverlayPredictedFieldBrush !== undefined && basicOverlayPredictedFieldBrush !== null) {
                overlay.predictedFieldBrush = basicOverlayPredictedFieldBrush;
            }
            if (props.basicOverlay?.shouldShowScanAreaGuides !== undefined) {
                overlay.shouldShowScanAreaGuides = props.basicOverlay.shouldShowScanAreaGuides;
            }
            if (basicOverlayViewfinder !== undefined && basicOverlayViewfinder !== null) {
                overlay.viewfinder = basicOverlayViewfinder;
            }
        },
        updateDeps: [
            basicOverlayLabelBrush,
            basicOverlayCapturedFieldBrush,
            basicOverlayPredictedFieldBrush,
            props.basicOverlay?.shouldShowScanAreaGuides,
            basicOverlayViewfinder,
        ],
    });
    const advancedOverlay = _internal.useOverlay({
        view: viewRef,
        // Advanced overlay is off by default; opt in by passing the prop.
        // Skipped when validation flow or adaptive recognition is also
        // configured (mutual exclusion).
        enabled: advancedOverlayConfigured &&
            !validationFlowConfigured &&
            !adaptiveRecognitionConfigured &&
            props.advancedOverlay.enabled !== false,
        factory: () => new LabelCaptureAdvancedOverlay(getMode()),
        factoryDeps: [],
        update: overlay => {
            if (props.advancedOverlay?.shouldShowScanAreaGuides !== undefined) {
                overlay.shouldShowScanAreaGuides = props.advancedOverlay.shouldShowScanAreaGuides;
            }
        },
        updateDeps: [props.advancedOverlay?.shouldShowScanAreaGuides],
    });
    const validationFlowOverlay = _internal.useOverlay({
        view: viewRef,
        enabled: validationFlowConfigured && !adaptiveRecognitionConfigured && props.validationFlowOverlay.enabled !== false,
        factory: () => new LabelCaptureValidationFlowOverlay(getMode()),
        factoryDeps: [],
        update: overlay => {
            if (validationFlowSettings) {
                void overlay.applySettings(validationFlowSettings);
            }
            if (props.validationFlowOverlay?.shouldHandleKeyboardInsetsInternally !== undefined) {
                overlay.shouldHandleKeyboardInsetsInternally =
                    props.validationFlowOverlay.shouldHandleKeyboardInsetsInternally;
            }
        },
        updateDeps: [validationFlowSettings, props.validationFlowOverlay?.shouldHandleKeyboardInsetsInternally],
    });
    const adaptiveRecognitionOverlay = _internal.useOverlay({
        view: viewRef,
        enabled: adaptiveRecognitionConfigured && props.adaptiveRecognitionOverlay.enabled !== false,
        factory: () => new LabelCaptureAdaptiveRecognitionOverlay(getMode()),
        factoryDeps: [],
        update: overlay => {
            if (adaptiveRecognitionSettings) {
                void overlay.applySettings(adaptiveRecognitionSettings);
            }
        },
        updateDeps: [adaptiveRecognitionSettings],
    });
    // ─── Mode ─────────────────────────────────────────────────────────────────
    const { getMode, attach: attachMode, detach: detachMode, } = _internal.useMode({
        disabled: props.disabled,
        createMode: () => {
            const mode = new LabelCapture(resolveSettings());
            // `parentId` links the mode to its DataCaptureView for native serialization.
            mode['parentId'] = viewId;
            return mode;
        },
        applySettings: mode => mode.applySettings(resolveSettings()),
        setEnabled: (mode, enabled) => {
            if (mode.isEnabled !== enabled)
                mode.isEnabled = enabled;
        },
        attach: mode => context.addMode(mode),
        // Quiesce the shared camera while the mode is removed — removing it with
        // frames still streaming aborts natively in the engine.
        detach: mode => context.removeMode(mode),
        attachables: [basicOverlay, advancedOverlay, validationFlowOverlay, adaptiveRecognitionOverlay],
        settingsDeps: [resolveSettings],
    });
    // Enable/disable scanning, shared by the navigation prop and the imperative
    // `enable()`/`disable()` handle. Focus *attaches* (adds the mode to the shared
    // context) and blur *detaches* (removes it): the native context is
    // single-active-mode and `addMode` of a non-coexisting mode silently evicts
    // this one, so re-adding on focus keeps it the active mode and re-registers
    // its listener. Just toggling `isEnabled` is not enough.
    const enable = useCallback(async () => {
        await attachMode();
        setCameraActive(true);
        await cameraClaim.granted();
    }, [attachMode, cameraClaim]);
    const disable = useCallback(async () => {
        setCameraActive(false);
        await detachMode();
    }, [detachMode]);
    // Lifecycle: focus/blur + app foreground/background + the `disabled` veto.
    _internal.useLifecycleHook({
        navigation: props.navigation,
        disabled: props.disabled,
        appStateHandlingDisabled: props.appStateHandlingDisabled,
        onEnable: enable,
        onDisable: disable,
    });
    // ─── Feedback ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (feedback === undefined)
            return;
        getMode().feedback = feedback;
    }, [feedback, getMode]);
    // ─── Mode listener ────────────────────────────────────────────────────────
    _internal.useModeListener({
        mode: getMode(),
        listenerFns: {
            didUpdateSession: props.didScan || props.didUpdateSession
                ? async (_mode, session, getFD) => {
                    if (props.didUpdateSession)
                        await props.didUpdateSession(session, getFD);
                    if (props.didScan && session.capturedLabels?.length) {
                        await props.didScan(session.capturedLabels, session, getFD);
                    }
                }
                : undefined,
        },
        addListener: (m, l) => {
            void m.addListener(l);
        },
        removeListener: (m, l) => {
            void m.removeListener(l);
        },
    });
    // ─── Basic overlay listener ───────────────────────────────────────────────
    _internal.useModeListener({
        mode: basicOverlay.overlay,
        listenerFns: {
            brushForLabel: props.basicOverlay?.brushForLabel
                ? (_overlay, label) => props.basicOverlay.brushForLabel(label)
                : undefined,
            brushForFieldOfLabel: props.basicOverlay?.brushForFieldOfLabel
                ? (_overlay, field, label) => props.basicOverlay.brushForFieldOfLabel(field, label)
                : undefined,
            didTapLabel: props.basicOverlay?.didTapLabel
                ? (_overlay, label) => props.basicOverlay.didTapLabel(label)
                : undefined,
        },
        addListener: (overlay, l) => {
            overlay.listener = l;
        },
        removeListener: overlay => {
            overlay.listener = null;
        },
    });
    // ─── Advanced overlay listener ────────────────────────────────────────────
    _internal.useModeListener({
        mode: advancedOverlay.overlay,
        listenerFns: {
            viewForCapturedLabel: props.advancedOverlay?.viewForCapturedLabel
                ? (_overlay, label) => props.advancedOverlay.viewForCapturedLabel(label)
                : undefined,
            anchorForCapturedLabel: props.advancedOverlay?.anchorForCapturedLabel
                ? (_overlay, label) => props.advancedOverlay.anchorForCapturedLabel(label)
                : undefined,
            offsetForCapturedLabel: props.advancedOverlay?.offsetForCapturedLabel
                ? (_overlay, label) => props.advancedOverlay.offsetForCapturedLabel(label)
                : undefined,
            viewForCapturedLabelField: props.advancedOverlay?.viewForCapturedLabelField
                ? (_overlay, field) => props.advancedOverlay.viewForCapturedLabelField(field)
                : undefined,
            anchorForCapturedLabelField: props.advancedOverlay?.anchorForCapturedLabelField
                ? (_overlay, field) => props.advancedOverlay.anchorForCapturedLabelField(field)
                : undefined,
            offsetForCapturedLabelField: props.advancedOverlay?.offsetForCapturedLabelField
                ? (_overlay, field) => props.advancedOverlay.offsetForCapturedLabelField(field)
                : undefined,
        },
        addListener: (overlay, l) => {
            overlay.listener = l;
        },
        removeListener: overlay => {
            overlay.listener = null;
        },
    });
    // ─── Validation-flow overlay listener ─────────────────────────────────────
    // The shared listener interface declares all three callbacks as non-optional,
    // so we always provide stubs and route to the user's callbacks when present.
    // The shared `LabelCaptureValidationFlowListener` declares its methods as
    // non-optional. We deliberately pass a partial object (the standard
    // `useModeListener` pattern: only-defined keys make it into the proxy) and
    // cast at the boundary so unused callbacks stay strictly absent.
    _internal.useModeListener({
        mode: validationFlowOverlay.overlay,
        listenerFns: {
            didCaptureLabelWithFields: props.validationFlowOverlay?.didCaptureLabelWithFields
                ? (fields) => props.validationFlowOverlay.didCaptureLabelWithFields(fields)
                : undefined,
            didSubmitManualInputForField: props.validationFlowOverlay?.didSubmitManualInputForField
                ? (field, oldValue, newValue) => props.validationFlowOverlay.didSubmitManualInputForField(field, oldValue, newValue)
                : undefined,
            didUpdateValidationFlowResult: props.validationFlowOverlay?.didUpdateValidationFlowResult
                ? (type, asyncId, fields, getFD) => props.validationFlowOverlay.didUpdateValidationFlowResult(type, asyncId, fields, getFD)
                : undefined,
        },
        addListener: (overlay, l) => {
            overlay.listener = l;
        },
        removeListener: overlay => {
            overlay.listener = null;
        },
    });
    // ─── Adaptive-recognition overlay listener ────────────────────────────────
    // The shared `LabelCaptureAdaptiveRecognitionListener` declares its methods
    // as non-optional; we pass a partial object (only-defined keys reach the
    // proxy) and cast at the boundary, matching the validation-flow pattern.
    _internal.useModeListener({
        mode: adaptiveRecognitionOverlay.overlay,
        listenerFns: {
            didRecognize: props.adaptiveRecognitionOverlay?.didRecognize
                ? (result) => props.adaptiveRecognitionOverlay.didRecognize(result)
                : undefined,
            didFail: props.adaptiveRecognitionOverlay?.didFail
                ? () => props.adaptiveRecognitionOverlay.didFail()
                : undefined,
        },
        addListener: (overlay, l) => {
            overlay.listener = l;
        },
        removeListener: overlay => {
            overlay.listener = null;
        },
    });
    // ─── Imperative handle ────────────────────────────────────────────────────
    const basicOverlayEnabled = props.basicOverlay?.enabled !== false;
    const advancedOverlayEnabled = advancedOverlayConfigured &&
        !validationFlowConfigured &&
        !adaptiveRecognitionConfigured &&
        props.advancedOverlay.enabled !== false;
    const validationFlowOverlayEnabled = validationFlowConfigured && !adaptiveRecognitionConfigured && props.validationFlowOverlay.enabled !== false;
    useImperativeHandle(ref, () => ({
        // LabelCapture has no `reset()` on the shared API; the handle method is
        // kept for parity with other capture views and is currently a no-op.
        reset: () => {
            void getMode();
            return Promise.resolve();
        },
        basicOverlay: basicOverlayEnabled
            ? {
                setBrushForLabel: (brush, label) => basicOverlay.getOverlay()?.setBrushForLabel(brush, label) ?? Promise.resolve(),
                setBrushForFieldOfLabel: (brush, field, label) => basicOverlay.getOverlay()?.setBrushForFieldOfLabel(brush, field, label) ?? Promise.resolve(),
            }
            : undefined,
        advancedOverlay: advancedOverlayEnabled
            ? {
                setViewForCapturedLabel: (label, view) => advancedOverlay.getOverlay()?.setViewForCapturedLabel(label, view) ?? Promise.resolve(),
                setAnchorForCapturedLabel: (label, anchor) => advancedOverlay.getOverlay()?.setAnchorForCapturedLabel(label, anchor) ?? Promise.resolve(),
                setOffsetForCapturedLabel: (label, offset) => advancedOverlay.getOverlay()?.setOffsetForCapturedLabel(label, offset) ?? Promise.resolve(),
                setViewForCapturedLabelField: (field, label, view) => advancedOverlay.getOverlay()?.setViewForCapturedLabelField(field, label, view) ?? Promise.resolve(),
                setAnchorForCapturedLabelField: (field, label, anchor) => advancedOverlay.getOverlay()?.setAnchorForCapturedLabelField(field, label, anchor) ?? Promise.resolve(),
                setOffsetForCapturedLabelField: (field, label, offset) => advancedOverlay.getOverlay()?.setOffsetForCapturedLabelField(field, label, offset) ?? Promise.resolve(),
                clearCapturedLabelViews: () => advancedOverlay.getOverlay()?.clearCapturedLabelViews() ?? Promise.resolve(),
            }
            : undefined,
        validationFlowOverlay: validationFlowOverlayEnabled
            ? {
                applySettings: settings => validationFlowOverlay.getOverlay()?.applySettings(settings) ?? Promise.resolve(),
            }
            : undefined,
        enable,
        disable,
    }), [
        getMode,
        basicOverlay,
        advancedOverlay,
        validationFlowOverlay,
        basicOverlayEnabled,
        advancedOverlayEnabled,
        validationFlowOverlayEnabled,
        enable,
        disable,
    ]);
    return (React.createElement(DataCaptureView, { context: context, parentId: viewId, style: props.style ?? { flex: 1 }, ref: viewHandle.ref, onNativeDispose: teardown => cameraClaim.release(teardown) }));
});

var internal = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getLabelCaptureDefaults: getLabelCaptureDefaults
});

initLabelDefaults();
initLabelProxy();

export { LabelCaptureAdvancedOverlayView, LabelCaptureAioView, internal as _internal };
