import { CapturedLabel, LabelField, LabelCaptureValidationFlowSettings, LabelResultUpdateType, LabelCaptureAdaptiveRecognitionSettings, AdaptiveRecognitionResult, LabelDefinition, LabelCaptureSettings, LabelCaptureSession, LabelCaptureFeedback, getLabelCaptureDefaults } from './label';
import type { LabelCaptureDefaults } from './label';
export { AdaptiveRecognitionMode, AdaptiveRecognitionResult, AdaptiveRecognitionResultType, BarcodeField, CapturedLabel, CustomBarcode, CustomText, DateText, ExpiryDateText, ImeiOneBarcode, ImeiTwoBarcode, LabelCapture, LabelCaptureAdaptiveRecognitionListener, LabelCaptureAdaptiveRecognitionOverlay, LabelCaptureAdaptiveRecognitionSettings, LabelCaptureAdvancedOverlay, LabelCaptureAdvancedOverlayListener, LabelCaptureBasicOverlay, LabelCaptureBasicOverlayListener, LabelCaptureFeedback, LabelCaptureListener, LabelCaptureSession, LabelCaptureSettings, LabelCaptureValidationFlowListener, LabelCaptureValidationFlowOverlay, LabelCaptureValidationFlowSettings, LabelDateComponentFormat, LabelDateFormat, LabelDateResult, LabelDefinition, LabelField, LabelFieldDefinition, LabelFieldLocation, LabelFieldLocationType, LabelFieldState, LabelFieldType, LabelFieldValueType, LabelResultUpdateType, PackingDateText, PartNumberBarcode, ReceiptScanningLineItem, ReceiptScanningResult, SerialNumberBarcode, TextField, TotalPriceText, UnitPriceText, WeightText } from './label';
import React from 'react';
import { DefaultSerializeable, FrameData } from 'scandit-react-native-datacapture-core/dist/dts/core';
import { StyleProp, ViewStyle } from 'react-native';
import { Brush, Viewfinder, Anchor, PointWithUnit } from 'scandit-react-native-datacapture-core';
import type { ScanditNavigationProp } from 'scandit-react-native-datacapture-core';

/**
 * A view that can be shown for a {@link CapturedLabel} through a {@link LabelCaptureAdvancedOverlay}.
 *
 * @since 6.17.0
 */
declare class LabelCaptureAdvancedOverlayView extends React.Component implements DefaultSerializeable {
    /** @since 6.17.0 */
    static moduleName: string;
    toJSON(): object;
    get moduleName(): string;
}



/**
 * Configuration for the {@link LabelCaptureBasicOverlay} that {@link LabelCaptureAioView} attaches by default. Every member is optional.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioBasicOverlayProps {
    /**
     * Whether to attach the basic overlay at all. Defaults to *true*; pass *false* to render the camera preview without it.
     *
     * @since 8.7.0
     */
    enabled?: boolean;
    /**
     * Default brush applied to every captured label.
     *
     * @since 8.7.0
     */
    labelBrush?: Brush | null;
    /**
     * Brush applied to captured — that is, confirmed — fields.
     *
     * @since 8.7.0
     */
    capturedFieldBrush?: Brush | null;
    /**
     * Brush applied to predicted fields.
     *
     * @since 8.7.0
     */
    predictedFieldBrush?: Brush | null;
    /**
     * Whether the overlay renders scan-area guides.
     *
     * @since 8.7.0
     */
    shouldShowScanAreaGuides?: boolean;
    /**
     * The viewfinder drawn by the basic overlay.
     *
     * @since 8.7.0
     */
    viewfinder?: Viewfinder | null;
    /**
     * Per-label brush override. Return *null* to fall back to {@link LabelCaptureAioBasicOverlayProps.labelBrush}.
     *
     * @since 8.7.0
     */
    brushForLabel?(label: CapturedLabel): Brush | null;
    /**
     * Per-field brush override. Return *null* to fall back to the captured- or predicted-field brush.
     *
     * @since 8.7.0
     */
    brushForFieldOfLabel?(field: LabelField, label: CapturedLabel): Brush | null;
    /**
     * Called when the user taps a captured label.
     *
     * @since 8.7.0
     */
    didTapLabel?(label: CapturedLabel): void;
}
/**
 * Configuration for the {@link LabelCaptureAdvancedOverlay}, which renders application-supplied views per captured label or field. The overlay is attached only when this prop is supplied; pass `{ enabled: false }` to keep the prop shape while disabling the overlay at runtime.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioAdvancedOverlayProps {
    /**
     * Whether to attach the advanced overlay. Defaults to *true* when the prop is supplied.
     *
     * @since 8.7.0
     */
    enabled?: boolean;
    /**
     * Whether the overlay renders scan-area guides.
     *
     * @since 8.7.0
     */
    shouldShowScanAreaGuides?: boolean;
    /**
     * Returns the view to draw for a captured label, or *null* to draw nothing.
     *
     * @since 8.7.0
     */
    viewForCapturedLabel?(label: CapturedLabel): LabelCaptureAdvancedOverlayView | null;
    /**
     * Returns the anchor point of the view drawn for a captured label.
     *
     * @since 8.7.0
     */
    anchorForCapturedLabel?(label: CapturedLabel): Anchor;
    /**
     * Returns the offset applied to the view drawn for a captured label.
     *
     * @since 8.7.0
     */
    offsetForCapturedLabel?(label: CapturedLabel): PointWithUnit;
    /**
     * Returns the view to draw for a captured label field, or *null* to draw nothing.
     *
     * @since 8.7.0
     */
    viewForCapturedLabelField?(field: LabelField): LabelCaptureAdvancedOverlayView | null;
    /**
     * Returns the anchor point of the view drawn for a captured label field.
     *
     * @since 8.7.0
     */
    anchorForCapturedLabelField?(field: LabelField): Anchor;
    /**
     * Returns the offset applied to the view drawn for a captured label field.
     *
     * @since 8.7.0
     */
    offsetForCapturedLabelField?(field: LabelField): PointWithUnit;
}
/**
 * Configuration for the {@link LabelCaptureValidationFlowOverlay}. The overlay is attached only when this prop is supplied; pass `{ enabled: false }` to opt out at runtime.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioValidationFlowOverlayProps {
    /**
     * Whether to attach the validation-flow overlay. Defaults to *true* when the prop is supplied.
     *
     * @since 8.7.0
     */
    enabled?: boolean;
    /**
     * Settings applied to the validation-flow overlay.
     *
     * @since 8.7.0
     */
    settings?: LabelCaptureValidationFlowSettings | null;
    /**
     * Whether the overlay adjusts its own layout for the on-screen keyboard. Turn this off to handle keyboard insets in the application instead.
     *
     * @since 8.7.0
     */
    shouldHandleKeyboardInsetsInternally?: boolean;
    /**
     * Called when the validation flow completes with the given fields.
     *
     * @since 8.7.0
     */
    didCaptureLabelWithFields?(fields: LabelField[]): void;
    /**
     * Called when the user manually edits a field’s value in the validation flow, with the previous and the newly-submitted value.
     *
     * @since 8.7.0
     */
    didSubmitManualInputForField?(field: LabelField, oldValue: string | null, newValue: string): void;
    /**
     * Called whenever the validation flow’s result changes. Receives four arguments: a {@link LabelResultUpdateType} describing the change, an async id, the {@link LabelField} values the update applies to, and a `getFrameData` function resolving to the {@link FrameData} for the frame.
     *
     * @since 8.7.0
     */
    didUpdateValidationFlowResult?(type: LabelResultUpdateType, asyncId: number, fields: LabelField[], getFrameData: () => Promise<FrameData | null>): Promise<void>;
}
/**
 * Configuration for the {@link LabelCaptureAdaptiveRecognitionOverlay}, used for receipt scanning. The overlay is attached only when this prop is supplied; pass `{ enabled: false }` to opt out at runtime.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioAdaptiveRecognitionOverlayProps {
    /**
     * Whether to attach the adaptive-recognition overlay. Defaults to *true* when the prop is supplied.
     *
     * @since 8.7.0
     */
    enabled?: boolean;
    /**
     * Settings applied to the adaptive-recognition overlay.
     *
     * @since 8.7.0
     */
    settings?: LabelCaptureAdaptiveRecognitionSettings | null;
    /**
     * Called when adaptive recognition produces a result.
     *
     * @since 8.7.0
     */
    didRecognize?(result: AdaptiveRecognitionResult): void;
    /**
     * Called when adaptive recognition fails to produce a result.
     *
     * @since 8.7.0
     */
    didFail?(): void;
}
/**
 * Configuration for {@link LabelCaptureAioView}.
 *
 * **A settings source is required:** pass either {@link LabelCaptureAioViewProps.labelDefinitions} or {@link LabelCaptureAioViewProps.labelCaptureSettings}. Both are optional on this interface, but {@link LabelCaptureAioView} requires one of them, so rendering the component with neither is a compile error — nothing is captured without a label definition. Supplying both is allowed, and settings wins with a warning.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioViewProps {
    /**
     * Style applied to the view, defaulting to `{ flex: 1 }`. This is the only React Native `View` prop the component forwards — it renders its own {@link DataCaptureView} and passes nothing else through.
     *
     * @since 8.7.0
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Navigation object for the screen the component is rendered on, for example React Navigation’s `navigation` prop (typed as [ScanditNavigationProp](#)). When it is provided, scanning is suspended — the mode is disabled and the camera turned off — while the screen is blurred or the application is backgrounded, and resumed when the screen regains focus. Ignored while {@link LabelCaptureAioViewProps.disabled} is set.
     *
     * @since 8.7.0
     */
    navigation?: ScanditNavigationProp;
    /**
     * Set to *true* to keep scanning off. Leaving it *false* does not keep scanning on — navigation and app-state handling still turn the mode on and off on their own.
     *
     * {@link LabelCaptureAioViewHandle.enable} and {@link LabelCaptureAioViewHandle.disable} change the same state directly. If you call those, this prop no longer reflects whether the component is actually scanning.
     *
     * @since 8.7.0
     */
    disabled?: boolean;
    /**
     * Turns off the automatic enabling and disabling of the mode in response to the application moving between foreground and background.
     *
     * @since 8.7.0
     */
    appStateHandlingDisabled?: boolean;
    /**
     * The label definitions to capture. Required unless {@link LabelCaptureAioViewProps.labelCaptureSettings} is supplied instead. Ignored when both are given, in which case a warning is logged.
     *
     * @since 8.7.0
     */
    labelDefinitions?: LabelDefinition[];
    /**
     * The settings applied to the underlying {@link LabelCapture} mode. Required unless {@link LabelCaptureAioViewProps.labelDefinitions} is supplied instead. Takes precedence when both are given.
     *
     * @since 8.7.0
     */
    labelCaptureSettings?: LabelCaptureSettings | null;
    /**
     * Convenience callback fired with the labels newly captured in a session update. Derived from the same native event as {@link LabelCaptureAioViewProps.didUpdateSession}: when both are set, {@link LabelCaptureAioViewProps.didUpdateSession} completes first and then this callback fires, and it is skipped entirely when the update captured nothing. `getFrameData` stays valid across both callbacks.
     *
     * @since 8.7.0
     */
    didScan?(labels: CapturedLabel[], session: LabelCaptureSession, getFrameData: () => Promise<FrameData | null>): void | Promise<void>;
    /**
     * Fires on every session update, before {@link LabelCaptureAioViewProps.didScan} for the same update.
     *
     * @since 8.7.0
     */
    didUpdateSession?(session: LabelCaptureSession, getFrameData: () => Promise<FrameData | null>): void | Promise<void>;
    /**
     * Configuration for the basic overlay, described by {@link LabelCaptureAioBasicOverlayProps}. The overlay is attached by default, so omitting this prop yields the default overlay. To skip it entirely:
     *
     * ```jsx
     * <LabelCaptureAioView
     *   labelDefinitions={definitions}
     *   basicOverlay={{ enabled: false }}
     * />
     * ```
     *
     * @since 8.7.0
     */
    basicOverlay?: LabelCaptureAioBasicOverlayProps;
    /**
     * Configuration for the advanced overlay, which renders custom views per captured label or field. Omit the prop entirely to skip the overlay; pass any object — even `{}` — to opt in. See {@link LabelCaptureAioAdvancedOverlayProps}.
     *
     * Mutually exclusive with {@link LabelCaptureAioViewProps.validationFlowOverlay} and {@link LabelCaptureAioViewProps.adaptiveRecognitionOverlay}. When more than one is supplied, adaptive recognition wins over the validation flow, which wins over the advanced overlay; the overlays that lose are not attached and a warning is logged.
     *
     * @since 8.7.0
     */
    advancedOverlay?: LabelCaptureAioAdvancedOverlayProps;
    /**
     * Configuration for the validation-flow overlay. Omit the prop entirely to skip the overlay; pass any object — even `{}` — to opt in. Mutually exclusive with {@link LabelCaptureAioViewProps.advancedOverlay} and {@link LabelCaptureAioViewProps.adaptiveRecognitionOverlay}. See {@link LabelCaptureAioValidationFlowOverlayProps}.
     *
     * @since 8.7.0
     */
    validationFlowOverlay?: LabelCaptureAioValidationFlowOverlayProps;
    /**
     * Configuration for the adaptive-recognition (receipt-scanning) overlay. Omit the prop entirely to skip the overlay; pass any object — even `{}` — to opt in. Mutually exclusive with {@link LabelCaptureAioViewProps.advancedOverlay} and {@link LabelCaptureAioViewProps.validationFlowOverlay}, and takes precedence over both. See {@link LabelCaptureAioAdaptiveRecognitionOverlayProps}.
     *
     * @since 8.7.0
     */
    adaptiveRecognitionOverlay?: LabelCaptureAioAdaptiveRecognitionOverlayProps;
    /**
     * Sound and vibration feedback emitted on capture. Omit to use the SDK default.
     *
     * @since 8.7.0
     */
    feedback?: LabelCaptureFeedback;
}
type LabelCaptureAioViewSettingsSource = {
    labelDefinitions: LabelDefinition[];
} | {
    labelCaptureSettings: LabelCaptureSettings;
};
/**
 * Imperative operations scoped to the basic overlay, reached through {@link LabelCaptureAioViewHandle.basicOverlay}. Present only while the basic overlay is enabled.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioBasicOverlayHandle {
    /**
     * Overrides the brush used for a captured label.
     *
     * @since 8.7.0
     */
    setBrushForLabel(brush: Brush, label: CapturedLabel): Promise<void>;
    /**
     * Overrides the brush used for a field of a captured label.
     *
     * @since 8.7.0
     */
    setBrushForFieldOfLabel(brush: Brush, field: LabelField, label: CapturedLabel): Promise<void>;
}
/**
 * Imperative operations scoped to the advanced overlay, reached through {@link LabelCaptureAioViewHandle.advancedOverlay}. Present only while the advanced overlay is supplied and enabled.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioAdvancedOverlayHandle {
    /**
     * Sets the view drawn for a captured label, taking precedence over {@link LabelCaptureAioAdvancedOverlayProps.viewForCapturedLabel}.
     *
     * @since 8.7.0
     */
    setViewForCapturedLabel(label: CapturedLabel, view: LabelCaptureAdvancedOverlayView | null): Promise<void>;
    /**
     * Sets the anchor point of the view drawn for a captured label.
     *
     * @since 8.7.0
     */
    setAnchorForCapturedLabel(label: CapturedLabel, anchor: Anchor): Promise<void>;
    /**
     * Sets the offset applied to the view drawn for a captured label.
     *
     * @since 8.7.0
     */
    setOffsetForCapturedLabel(label: CapturedLabel, offset: PointWithUnit): Promise<void>;
    /**
     * Sets the view drawn for a field of a captured label.
     *
     * @since 8.7.0
     */
    setViewForCapturedLabelField(field: LabelField, label: CapturedLabel, view: LabelCaptureAdvancedOverlayView | null): Promise<void>;
    /**
     * Sets the anchor point of the view drawn for a field of a captured label.
     *
     * @since 8.7.0
     */
    setAnchorForCapturedLabelField(field: LabelField, label: CapturedLabel, anchor: Anchor): Promise<void>;
    /**
     * Sets the offset applied to the view drawn for a field of a captured label.
     *
     * @since 8.7.0
     */
    setOffsetForCapturedLabelField(field: LabelField, label: CapturedLabel, offset: PointWithUnit): Promise<void>;
    /**
     * Removes every view currently drawn by the advanced overlay.
     *
     * @since 8.7.0
     */
    clearCapturedLabelViews(): Promise<void>;
}
/**
 * Imperative operations scoped to the validation-flow overlay, reached through {@link LabelCaptureAioViewHandle.validationFlowOverlay}. Present only while the validation-flow overlay is supplied and enabled.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioValidationFlowOverlayHandle {
    /**
     * Applies new settings to the validation-flow overlay.
     *
     * @since 8.7.0
     */
    applySettings(settings: LabelCaptureValidationFlowSettings): Promise<void>;
}
/**
 * Imperative operations on a {@link LabelCaptureAioView}, reached through a `ref` on the component.
 *
 * Overlay-scoped operations live under the namespaces below, each present only when its overlay is configured and enabled — so a method can never be called on an overlay that is not there.
 *
 * @since 8.7.0
 */
interface LabelCaptureAioViewHandle {
    /**
     * Present for parity with the other AIO view handles.
     *
     * {@link LabelCapture} exposes no reset operation on the shared API, so this method currently does nothing. Do not rely on it to discard captured labels.
     *
     * @since 8.7.0
     */
    reset(): Promise<void>;
    /**
     * Turns scanning on now: enables the mode and turns the camera on. Automatic navigation and application-state handling may subsequently turn it off again.
     *
     * @since 8.7.0
     */
    enable(): Promise<void>;
    /**
     * Turns scanning off now: disables the mode and turns the camera off.
     *
     * @since 8.7.0
     */
    disable(): Promise<void>;
    /**
     * Operations on the basic overlay. Omitted when the basic overlay is disabled.
     *
     * @since 8.7.0
     */
    basicOverlay?: LabelCaptureAioBasicOverlayHandle;
    /**
     * Operations on the advanced overlay. Omitted when the advanced overlay is not supplied or is disabled.
     *
     * @since 8.7.0
     */
    advancedOverlay?: LabelCaptureAioAdvancedOverlayHandle;
    /**
     * Operations on the validation-flow overlay. Omitted when the validation-flow overlay is not supplied or is disabled.
     *
     * @since 8.7.0
     */
    validationFlowOverlay?: LabelCaptureAioValidationFlowOverlayHandle;
}
/**
 * An all-in-one React component for capturing labels. Rendering this single element replaces the manual assembly of a {@link DataCaptureContext}, a {@link LabelCapture} mode, a {@link DataCaptureView} and its overlays — the component owns all of them, along with its camera claim and its lifecycle.
 *
 * The component must be rendered inside a [ScanditProvider](#), which supplies the {@link DataCaptureContext} and the shared camera. Scanning starts once the component is mounted and enabled, and stops when it unmounts.
 *
 * Configuration is passed through {@link LabelCaptureAioViewProps}. To gain manual control over the component, attach a React `ref` typed as {@link LabelCaptureAioViewHandle}.
 *
 * @since 8.7.0
 */
declare const LabelCaptureAioView: React.ForwardRefExoticComponent<(LabelCaptureAioViewProps & LabelCaptureAioViewSettingsSource) & React.RefAttributes<LabelCaptureAioViewHandle>>;



declare const internal_d_LabelCaptureDefaults: typeof LabelCaptureDefaults;
declare const internal_d_getLabelCaptureDefaults: typeof getLabelCaptureDefaults;
declare namespace internal_d {
  export {
    internal_d_LabelCaptureDefaults as LabelCaptureDefaults,
    internal_d_getLabelCaptureDefaults as getLabelCaptureDefaults,
  };
}











export { LabelCaptureAdvancedOverlayView, LabelCaptureAioView, internal_d as _internal };
export type { LabelCaptureAioAdaptiveRecognitionOverlayProps, LabelCaptureAioAdvancedOverlayHandle, LabelCaptureAioAdvancedOverlayProps, LabelCaptureAioBasicOverlayHandle, LabelCaptureAioBasicOverlayProps, LabelCaptureAioValidationFlowOverlayHandle, LabelCaptureAioValidationFlowOverlayProps, LabelCaptureAioViewHandle, LabelCaptureAioViewProps };
