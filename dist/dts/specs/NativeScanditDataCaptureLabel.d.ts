import type { TurboModule } from 'react-native';
/**
 * CodeGen specification for ScanditDataCaptureLabel TurboModule.
 *
 * This specification defines the interface between JavaScript and native code
 * for the Label Capture module. All methods maintain backwards compatibility
 * by accepting a single object parameter, matching the current legacy API.
 */
export interface Spec extends TurboModule {
    /**
     * Returns constants exported by the native module.
     * Currently exports Defaults for LabelCapture configuration.
     */
    readonly getConstants: () => {
        Defaults: {
            LabelCapture: object;
        };
    };
    /**
     * Registers a listener for LabelCapture events.
     * @param data - Object containing modeId
     */
    registerListenerForEvents(data: {
        modeId: number;
    }): void;
    /**
     * Unregisters a listener for LabelCapture events.
     * @param data - Object containing modeId
     */
    unregisterListenerForEvents(data: {
        modeId: number;
    }): void;
    /**
     * Registers a listener for basic overlay events.
     * @param data - Object containing dataCaptureViewId
     */
    registerListenerForBasicOverlayEvents(data: {
        dataCaptureViewId: number;
    }): void;
    /**
     * Unregisters a listener for basic overlay events.
     * @param data - Object containing dataCaptureViewId
     */
    unregisterListenerForBasicOverlayEvents(data: {
        dataCaptureViewId: number;
    }): void;
    /**
     * Registers a listener for advanced overlay events.
     * @param data - Object containing dataCaptureViewId
     */
    registerListenerForAdvancedOverlayEvents(data: {
        dataCaptureViewId: number;
    }): void;
    /**
     * Unregisters a listener for advanced overlay events.
     * @param data - Object containing dataCaptureViewId
     */
    unregisterListenerForAdvancedOverlayEvents(data: {
        dataCaptureViewId: number;
    }): void;
    /**
     * Registers a listener for validation flow events.
     * @param data - Object containing dataCaptureViewId
     */
    registerListenerForValidationFlowEvents(data: {
        dataCaptureViewId: number;
    }): void;
    /**
     * Unregisters a listener for validation flow events.
     * @param data - Object containing dataCaptureViewId
     */
    unregisterListenerForValidationFlowEvents(data: {
        dataCaptureViewId: number;
    }): void;
    /**
     * Finishes the didUpdateSession callback.
     * @param data - Object containing modeId and isEnabled flag
     */
    finishDidUpdateSessionCallback(data: {
        modeId: number;
        isEnabled: boolean;
    }): void;
    /**
     * Sets the enabled state of the mode.
     * @param data - Object containing modeId and isEnabled flag
     */
    setModeEnabledState(data: {
        modeId: number;
        isEnabled: boolean;
    }): void;
    /**
     * Sets the brush for a captured label.
     * @param data - Object containing dataCaptureViewId, brushJson, and trackingId
     */
    setBrushForLabel(data: {
        dataCaptureViewId: number;
        brushJson: string;
        trackingId: number;
    }): Promise<void>;
    /**
     * Sets the brush for a specific field of a captured label.
     * @param data - Object containing dataCaptureViewId, brushJson, fieldName, and trackingId
     */
    setBrushForFieldOfLabel(data: {
        dataCaptureViewId: number;
        brushJson: string;
        fieldName: string;
        trackingId: number;
    }): Promise<void>;
    /**
     * Sets a view for a captured label.
     * @param data - Object containing dataCaptureViewId, jsonView (nullable), and trackingId
     */
    setViewForCapturedLabel(data: {
        dataCaptureViewId: number;
        jsonView: string | null;
        trackingId: number;
    }): Promise<void>;
    /**
     * Sets a view for a captured label field.
     * @param data - Object containing dataCaptureViewId, view (nullable), and identifier
     */
    setViewForCapturedLabelField(data: {
        dataCaptureViewId: number;
        view: string | null;
        identifier: string;
    }): Promise<void>;
    /**
     * Sets the anchor for a captured label.
     * @param data - Object containing dataCaptureViewId, anchor, and trackingId
     */
    setAnchorForCapturedLabel(data: {
        dataCaptureViewId: number;
        anchor: string;
        trackingId: number;
    }): Promise<void>;
    /**
     * Sets the anchor for a captured label field.
     * @param data - Object containing dataCaptureViewId, anchor, and identifier
     */
    setAnchorForCapturedLabelField(data: {
        dataCaptureViewId: number;
        anchor: string;
        identifier: string;
    }): Promise<void>;
    /**
     * Sets the offset for a captured label.
     * @param data - Object containing dataCaptureViewId, offsetJson, and trackingId
     */
    setOffsetForCapturedLabel(data: {
        dataCaptureViewId: number;
        offsetJson: string;
        trackingId: number;
    }): Promise<void>;
    /**
     * Sets the offset for a captured label field.
     * @param data - Object containing dataCaptureViewId, offset, and identifier
     */
    setOffsetForCapturedLabelField(data: {
        dataCaptureViewId: number;
        offset: string;
        identifier: string;
    }): Promise<void>;
    /**
     * Clears all captured label views.
     * @param data - Object containing dataCaptureViewId
     */
    clearCapturedLabelViews(data: {
        dataCaptureViewId: number;
    }): Promise<void>;
    /**
     * Updates the basic overlay configuration.
     * @param data - Object containing dataCaptureViewId and basicOverlayJson
     */
    updateLabelCaptureBasicOverlay(data: {
        dataCaptureViewId: number;
        basicOverlayJson: string;
    }): Promise<void>;
    /**
     * Updates the advanced overlay configuration.
     * @param data - Object containing dataCaptureViewId and advancedOverlayJson
     */
    updateLabelCaptureAdvancedOverlay(data: {
        dataCaptureViewId: number;
        advancedOverlayJson: string;
    }): Promise<void>;
    /**
     * Updates the validation flow overlay configuration.
     * @param data - Object containing dataCaptureViewId and overlayJson
     */
    updateLabelCaptureValidationFlowOverlay(data: {
        dataCaptureViewId: number;
        overlayJson: string;
    }): Promise<void>;
    /**
     * Updates the LabelCapture settings.
     * @param data - Object containing modeId and settingsJson
     */
    updateLabelCaptureSettings(data: {
        modeId: number;
        settingsJson: string;
    }): Promise<void>;
    /**
     * Updates the LabelCapture feedback.
     * @param data - Object containing modeId and feedbackJson
     */
    updateLabelCaptureFeedback(data: {
        modeId: number;
        feedbackJson: string;
    }): Promise<void>;
    /**
     * Adds a listener for events (required for React Native Event Emitter).
     * @param eventName - Name of the event to listen to
     */
    addListener(eventName: string): void;
    /**
     * Removes listeners (required for React Native Event Emitter).
     * @param count - Number of listeners to remove
     */
    removeListeners(count: number): void;
}
/**
 * Gets the TurboModule instance for ScanditDataCaptureLabel.
 *
 * Uses getEnforcing to ensure the module is available. If the module is not
 * found, this will throw an error. The getNativeModule() function in core
 * already handles fallback to legacy NativeModules for backwards compatibility.
 */
declare const _default: Spec;
export default _default;
