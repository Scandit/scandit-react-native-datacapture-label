import React from 'react';
import { ViewProps } from 'react-native';
import { Anchor, Brush, PointWithUnit, Viewfinder } from 'scandit-react-native-datacapture-core';
import { CapturedLabel, LabelCaptureSession, LabelCaptureSettings, LabelCaptureValidationFlowSettings, LabelDefinition, LabelField, LabelResultUpdateType } from 'scandit-datacapture-frameworks-label';
import { FrameData } from 'scandit-datacapture-frameworks-core';
import { LabelCaptureAdvancedOverlayView } from '../LabelCaptureAdvancedOverlayView';
/**
 * Mode lifecycle state. Camera state (on / standby / off) is driven by the
 * surrounding `<ScanditProvider frameSourceState={...}>`, not by this prop.
 *
 * - `'enabled'` (default): mode attached, `isEnabled = true`.
 * - `'disabled'`: mode attached, `isEnabled = false` (no labels delivered).
 * - `'detached'`: mode removed from the context entirely.
 */
export type LabelCaptureLifecycleState = 'enabled' | 'disabled' | 'detached';
/**
 * Basic-overlay configuration. The overlay is attached by default; pass
 * `{ enabled: false }` to skip it.
 */
export interface LabelCaptureBasicOverlayProps {
    /** Whether to attach the basic overlay. Defaults to `true`. */
    enabled?: boolean;
    /** Default brush applied to every captured label. */
    labelBrush?: Brush | null;
    /** Brush for captured (confirmed) fields. */
    capturedFieldBrush?: Brush | null;
    /** Brush for predicted fields. */
    predictedFieldBrush?: Brush | null;
    /** Whether to render scan-area guides. */
    shouldShowScanAreaGuides?: boolean;
    /** Viewfinder drawn by the basic overlay. */
    viewfinder?: Viewfinder | null;
    /** Per-label brush override. */
    brushForLabel?: (label: CapturedLabel) => Brush | null;
    /** Per-field brush override. */
    brushForFieldOfLabel?: (field: LabelField, label: CapturedLabel) => Brush | null;
    /** Tap-on-label callback. */
    didTapLabel?: (label: CapturedLabel) => void;
}
/**
 * Advanced-overlay configuration. Renders custom views per captured label /
 * field. The overlay is only attached when this prop is supplied — omit it
 * entirely if you don't need custom-view annotations. Pass `{ enabled: false }`
 * to keep the prop shape but disable the overlay (e.g. for runtime opt-out).
 *
 * Mutually exclusive with `validationFlowOverlay`; if both are supplied the
 * advanced overlay is skipped and a warning is logged.
 */
export interface LabelCaptureAdvancedOverlayProps {
    enabled?: boolean;
    shouldShowScanAreaGuides?: boolean;
    viewForCapturedLabel?: (label: CapturedLabel) => LabelCaptureAdvancedOverlayView | null;
    anchorForCapturedLabel?: (label: CapturedLabel) => Anchor;
    offsetForCapturedLabel?: (label: CapturedLabel) => PointWithUnit;
    viewForCapturedLabelField?: (field: LabelField) => LabelCaptureAdvancedOverlayView | null;
    anchorForCapturedLabelField?: (field: LabelField) => Anchor;
    offsetForCapturedLabelField?: (field: LabelField) => PointWithUnit;
}
/**
 * Validation-flow overlay configuration. The overlay is only attached when this
 * prop is supplied. Pass `{ enabled: false }` to opt out at runtime.
 *
 * Mutually exclusive with `advancedOverlay`; supplying both prefers the
 * validation flow (advanced overlay is skipped with a warning).
 */
export interface LabelCaptureValidationFlowOverlayProps {
    /** Whether to attach the validation-flow overlay. Defaults to `true` (when the prop is supplied). */
    enabled?: boolean;
    settings?: LabelCaptureValidationFlowSettings | null;
    shouldHandleKeyboardInsetsInternally?: boolean;
    didCaptureLabelWithFields?: (fields: LabelField[]) => void;
    didSubmitManualInputForField?: (field: LabelField, oldValue: string | null, newValue: string) => void;
    didUpdateValidationFlowResult?: (type: LabelResultUpdateType, asyncId: number, fields: LabelField[], getFrameData: () => Promise<FrameData | null>) => Promise<void>;
}
interface LabelCaptureViewProps extends ViewProps {
    /** Mode lifecycle state. Defaults to `'enabled'`. */
    state?: LabelCaptureLifecycleState;
    /** Label definitions to capture. Ignored when `labelCaptureSettings` is set. */
    labelDefinitions?: LabelDefinition[];
    /** Full LabelCapture settings object. Takes precedence over `labelDefinitions`. */
    labelCaptureSettings?: LabelCaptureSettings | null;
    /**
     * Convenience callback fired with every newly-captured label
     * (`session.capturedLabels`) on a session update.
     */
    onCapture?: (labels: CapturedLabel[], session: LabelCaptureSession, getFrameData: () => Promise<FrameData | null>) => void | Promise<void>;
    /** Raw `LabelCaptureListener.didUpdateSession` passthrough. Fires alongside `onCapture` if both are set. */
    onUpdateSession?: (session: LabelCaptureSession, getFrameData: () => Promise<FrameData | null>) => void | Promise<void>;
    /**
     * Basic overlay configuration. Omit the prop (or pass `undefined`) to use
     * defaults. Pass `{ enabled: false }` to skip the overlay.
     */
    basicOverlay?: LabelCaptureBasicOverlayProps;
    /**
     * Advanced overlay configuration. Omit the prop entirely to skip the overlay;
     * pass any object (even `{}`) to opt in to custom-view annotations.
     *
     * Mutually exclusive with `validationFlowOverlay`.
     */
    advancedOverlay?: LabelCaptureAdvancedOverlayProps;
    /**
     * Validation-flow overlay configuration. Omit the prop entirely to skip
     * the overlay; pass any object (even `{}`) to opt in.
     *
     * Mutually exclusive with `advancedOverlay`; when both are supplied the
     * advanced overlay is skipped.
     */
    validationFlowOverlay?: LabelCaptureValidationFlowOverlayProps;
}
/** Imperative methods scoped to the basic overlay. Present only when `basicOverlay.enabled !== false`. */
export interface LabelCaptureBasicOverlayHandle {
    /** Override the brush for a captured label. */
    setBrushForLabel(brush: Brush, label: CapturedLabel): Promise<void>;
    /** Override the brush for a label field. */
    setBrushForFieldOfLabel(brush: Brush, field: LabelField, label: CapturedLabel): Promise<void>;
}
/** Imperative methods scoped to the advanced overlay. Present only when the `advancedOverlay` prop is supplied and enabled. */
export interface LabelCaptureAdvancedOverlayHandle {
    setViewForCapturedLabel(label: CapturedLabel, view: LabelCaptureAdvancedOverlayView | null): Promise<void>;
    setAnchorForCapturedLabel(label: CapturedLabel, anchor: Anchor): Promise<void>;
    setOffsetForCapturedLabel(label: CapturedLabel, offset: PointWithUnit): Promise<void>;
    setViewForCapturedLabelField(field: LabelField, label: CapturedLabel, view: LabelCaptureAdvancedOverlayView | null): Promise<void>;
    setAnchorForCapturedLabelField(field: LabelField, label: CapturedLabel, anchor: Anchor): Promise<void>;
    setOffsetForCapturedLabelField(field: LabelField, label: CapturedLabel, offset: PointWithUnit): Promise<void>;
    clearCapturedLabelViews(): Promise<void>;
}
/** Imperative methods scoped to the validation-flow overlay. Present only when the `validationFlowOverlay` prop is supplied and enabled. */
export interface LabelCaptureValidationFlowOverlayHandle {
    applySettings(settings: LabelCaptureValidationFlowSettings): Promise<void>;
}
/**
 * Imperative methods exposed via `ref`. Overlay-scoped methods live under
 * `basicOverlay` / `advancedOverlay` / `validationFlowOverlay` namespaces that
 * are only present when the corresponding overlay is configured + enabled — so
 * consumers can't call a method that has nothing to act on.
 */
export interface LabelCaptureViewHandle {
    /** Reset the mode's capture session. */
    reset(): Promise<void>;
    /** Basic overlay methods (omitted when `basicOverlay.enabled === false`). */
    basicOverlay?: LabelCaptureBasicOverlayHandle;
    /** Advanced overlay methods (omitted when `advancedOverlay` is not supplied or `enabled === false`). */
    advancedOverlay?: LabelCaptureAdvancedOverlayHandle;
    /** Validation-flow overlay methods (omitted when `validationFlowOverlay` is not supplied or `enabled === false`). */
    validationFlowOverlay?: LabelCaptureValidationFlowOverlayHandle;
}
export declare const LabelCaptureView: React.ForwardRefExoticComponent<LabelCaptureViewProps & React.RefAttributes<LabelCaptureViewHandle>>;
export {};
