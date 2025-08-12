import { Camera, CameraPosition, FrameSourceState, DataCaptureView, initCoreProxy, createRNNativeCaller, initCoreDefaults } from 'scandit-react-native-datacapture-core';
import { ScreenStateManager, FactoryMaker, createNativeProxy } from 'scandit-react-native-datacapture-core/dist/core';
import { NativeModules, AppState } from 'react-native';
import { LabelCaptureSettings, LabelCapture, loadLabelCaptureDefaults, LabelCaptureBasicOverlay, LabelCaptureAdvancedOverlay, LabelCaptureValidationFlowOverlay } from './label.js';
export { BarcodeField, CapturedLabel, CustomBarcode, CustomText, ExpiryDateText, ImeiOneBarcode, ImeiTwoBarcode, LabelCapture, LabelCaptureAdvancedOverlay, LabelCaptureBasicOverlay, LabelCaptureSession, LabelCaptureSettings, LabelCaptureValidationFlowOverlay, LabelCaptureValidationFlowSettings, LabelDateComponentFormat, LabelDateFormat, LabelDateResult, LabelDefinition, LabelField, LabelFieldDefinition, LabelFieldLocation, LabelFieldLocationType, LabelFieldState, LabelFieldType, PackingDateText, PartNumberBarcode, SerialNumberBarcode, TextField, TotalPriceText, UnitPriceText, WeightText } from './label.js';
import React, { forwardRef, useRef, useMemo, useEffect } from 'react';
import 'scandit-react-native-datacapture-barcode/dist/barcode';

function initLabelProxy() {
    initCoreProxy();
    FactoryMaker.bindLazyInstance('LabelCaptureProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureLabel);
        return createNativeProxy(caller);
    });
    FactoryMaker.bindLazyInstance('LabelCaptureBasicOverlayProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureLabel);
        return createNativeProxy(caller);
    });
    FactoryMaker.bindLazyInstance('LabelCaptureAdvancedOverlayProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureLabel);
        return createNativeProxy(caller);
    });
    FactoryMaker.bindLazyInstance('LabelCaptureValidationFlowOverlayProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureLabel);
        return createNativeProxy(caller);
    });
}

// tslint:disable-next-line:variable-name
const DataCaptureLabel = NativeModules.ScanditDataCaptureLabel;
function initLabelDefaults() {
    initCoreDefaults();
    loadLabelCaptureDefaults(DataCaptureLabel.Defaults);
}

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

// tslint:disable-next-line
const LabelCaptureView = forwardRef(function LabelCaptureView(props, ref) {
    const currentProps = useRef({
        isEnabled: props.isEnabled,
        desiredCameraState: props.desiredCameraState,
    });
    const viewRef = useRef(null);
    const componentIsSetUp = useRef(false);
    const viewId = useRef(Math.floor(Math.random() * 1000000));
    const screenStateManager = useMemo(() => {
        return ScreenStateManager.getInstance();
    }, []);
    const labelCaptureModeRef = useRef(null);
    const basicOverlayRef = useRef(null);
    const advancedOverlayRef = useRef(null);
    const validationFlowOverlayRef = useRef(null);
    const cameraRef = useRef(null);
    const torchSwitchControl = useRef(null);
    const zoomSwitchControl = useRef(null);
    const appState = useRef(AppState.currentState);
    useEffect(() => {
        currentProps.current = {
            isEnabled: props.isEnabled,
            desiredCameraState: currentProps.current.desiredCameraState,
        };
        getMode().isEnabled = currentProps.current.isEnabled;
    }, [props.isEnabled]);
    useEffect(() => {
        currentProps.current = {
            isEnabled: currentProps.current.isEnabled,
            desiredCameraState: props.desiredCameraState,
        };
        if (props.desiredCameraState &&
            screenStateManager.isScreenActive(viewId.current)) {
            getCamera()?.switchToDesiredState(props.desiredCameraState);
        }
    }, [props.desiredCameraState]);
    function getMode() {
        if (labelCaptureModeRef.current !== null) {
            return labelCaptureModeRef.current;
        }
        // Create a default settings if none provided
        const settings = props.labelCaptureSettings ||
            LabelCaptureSettings.settingsFromLabelDefinitions([], {});
        // Create the label capture instance with context and settings
        labelCaptureModeRef.current = LabelCapture.forContext(props.context, settings);
        return labelCaptureModeRef.current;
    }
    function getBasicOverlay() {
        if (basicOverlayRef.current !== null) {
            return basicOverlayRef.current;
        }
        basicOverlayRef.current = LabelCaptureBasicOverlay.withLabelCapture(getMode());
        if (props.predictedFieldBrush !== undefined) {
            basicOverlayRef.current.predictedFieldBrush = props.predictedFieldBrush;
        }
        if (props.capturedFieldBrush !== undefined) {
            basicOverlayRef.current.capturedFieldBrush = props.capturedFieldBrush;
        }
        if (props.labelBrush !== undefined) {
            basicOverlayRef.current.labelBrush = props.labelBrush;
        }
        if (props.shouldShowScanAreaGuides !== undefined) {
            basicOverlayRef.current.shouldShowScanAreaGuides =
                props.shouldShowScanAreaGuides;
        }
        if (props.viewfinder !== undefined) {
            basicOverlayRef.current.viewfinder = props.viewfinder;
        }
        return basicOverlayRef.current;
    }
    function getAdvancedOverlay() {
        if (advancedOverlayRef.current !== null) {
            return advancedOverlayRef.current;
        }
        advancedOverlayRef.current =
            LabelCaptureAdvancedOverlay.withLabelCaptureForView(getMode(), null);
        if (props.shouldShowScanAreaGuides !== undefined) {
            advancedOverlayRef.current.shouldShowScanAreaGuides =
                props.shouldShowScanAreaGuides;
        }
        return advancedOverlayRef.current;
    }
    function getValidationFlowOverlay() {
        if (validationFlowOverlayRef.current !== null) {
            return validationFlowOverlayRef.current;
        }
        validationFlowOverlayRef.current =
            LabelCaptureValidationFlowOverlay.withLabelCaptureForView(getMode(), null);
        if (props.validationFlowSettings) {
            validationFlowOverlayRef.current.applySettings(props.validationFlowSettings);
        }
        return validationFlowOverlayRef.current;
    }
    function getCamera() {
        if (cameraRef.current !== null) {
            return cameraRef.current;
        }
        cameraRef.current = Camera.asPositionWithSettings(props.desiredCameraPosition || CameraPosition.WorldFacing, props.cameraSettings || LabelCapture.recommendedCameraSettings);
        return cameraRef.current;
    }
    /* SETUP */
    useEffect(() => {
        doSetup();
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) &&
                nextAppState === 'active') {
                getMode().isEnabled = currentProps.current.isEnabled;
                if (currentProps.current.desiredCameraState) {
                    getCamera()?.switchToDesiredState(currentProps.current.desiredCameraState);
                }
            }
            else {
                getMode().isEnabled = false;
                getCamera()?.switchToDesiredState(FrameSourceState.Off);
            }
            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
            doCleanup();
        };
    }, []);
    const doSetup = () => {
        screenStateManager.setActiveScreen(viewId.current);
        if (componentIsSetUp.current)
            return;
        componentIsSetUp.current = true;
        /* Handling Data Capture Context */
        props.context.setFrameSource(getCamera());
        /* Adding Label Capture mode */
        getMode();
        /* Adding Label Capture Overlays */
        if (viewRef.current) {
            if (!props.useValidationFlow) {
                viewRef.current.addOverlay(getBasicOverlay());
                viewRef.current.addOverlay(getAdvancedOverlay());
            }
            else {
                viewRef.current.addOverlay(getValidationFlowOverlay());
            }
        }
    };
    const doCleanup = () => {
        if (!componentIsSetUp.current)
            return;
        componentIsSetUp.current = false;
        /* Remove the torch control */
        if (torchSwitchControl.current) {
            viewRef.current?.removeControl(torchSwitchControl.current);
        }
        /* Remove the zoom control */
        if (zoomSwitchControl.current) {
            viewRef.current?.removeControl(zoomSwitchControl.current);
        }
        /* Closing the camera if camera is active */
        if (screenStateManager.isScreenActive(viewId.current)) {
            getCamera()?.switchToDesiredState(FrameSourceState.Off);
            props.context.setFrameSource(null);
        }
        /* Cleaning Data Capture Context */
        if (labelCaptureModeRef.current) {
            props.context.removeMode(labelCaptureModeRef.current);
        }
        labelCaptureModeRef.current = null;
        /* Cleaning Overlays */
        if (viewRef.current) {
            viewRef.current.view?.overlays?.forEach((overlay) => viewRef.current?.view?.removeOverlay(overlay));
        }
        basicOverlayRef.current = null;
        advancedOverlayRef.current = null;
        validationFlowOverlayRef.current = null;
    };
    /* LABEL CAPTURE MODE */
    useEffect(() => {
        if (props.labelCaptureSettings && labelCaptureModeRef.current) {
            labelCaptureModeRef.current.applySettings(props.labelCaptureSettings);
        }
    }, [props.labelCaptureSettings]);
    useEffect(() => {
        if (!labelCaptureModeRef.current || !componentIsSetUp.current)
            return;
        const listeners = [...getMode().listeners];
        listeners.forEach(listener => {
            getMode().removeListener(listener);
        });
        if (props.didUpdateSession) {
            getMode().addListener({
                didUpdateSession: props.didUpdateSession,
            });
        }
    }, [props.didUpdateSession]);
    /* BASIC OVERLAY */
    useEffect(() => {
        if (props.brush && basicOverlayRef.current) ;
        const overlay = getBasicOverlay();
        // Configure the basic overlay properties
        if (props.predictedFieldBrush !== undefined) {
            overlay.predictedFieldBrush = props.predictedFieldBrush;
        }
        if (props.capturedFieldBrush !== undefined) {
            overlay.capturedFieldBrush = props.capturedFieldBrush;
        }
        if (props.labelBrush !== undefined) {
            overlay.labelBrush = props.labelBrush;
        }
        if (props.shouldShowScanAreaGuides !== undefined) {
            overlay.shouldShowScanAreaGuides = props.shouldShowScanAreaGuides;
        }
        if (props.viewfinder !== undefined) {
            overlay.viewfinder = props.viewfinder;
        }
        // Set up listener with individual callback props
        const basicOverlayListener = {};
        if (props.brushForFieldOfLabel) {
            basicOverlayListener.brushForFieldOfLabel = props.brushForFieldOfLabel;
        }
        if (props.brushForLabel) {
            basicOverlayListener.brushForLabel = props.brushForLabel;
        }
        if (props.didTapLabel) {
            basicOverlayListener.didTapLabel = props.didTapLabel;
        }
        // If props.overlayListener is provided, use it for backward compatibility
        if (props.brushForFieldOfLabel ||
            props.brushForLabel ||
            props.didTapLabel) {
            overlay.listener = basicOverlayListener;
        }
    }, [
        props.brush,
        props.predictedFieldBrush,
        props.capturedFieldBrush,
        props.labelBrush,
        props.shouldShowScanAreaGuides,
        props.viewfinder,
        props.brushForFieldOfLabel,
        props.brushForLabel,
        props.didTapLabel,
    ]);
    /* ADVANCED OVERLAY */
    useEffect(() => {
        const advancedOverlay = getAdvancedOverlay();
        if (props.shouldShowScanAreaGuides !== undefined) {
            advancedOverlay.shouldShowScanAreaGuides = props.shouldShowScanAreaGuides;
        }
        // Setup advanced overlay listener from props
        const advOverlayListener = {};
        if (props.viewForCapturedLabel) {
            advOverlayListener.viewForCapturedLabel = props.viewForCapturedLabel;
        }
        if (props.anchorForCapturedLabel) {
            advOverlayListener.anchorForCapturedLabel = props.anchorForCapturedLabel;
        }
        if (props.offsetForCapturedLabel) {
            advOverlayListener.offsetForCapturedLabel = props.offsetForCapturedLabel;
        }
        if (props.viewForCapturedLabelField) {
            advOverlayListener.viewForCapturedLabelField =
                props.viewForCapturedLabelField;
        }
        if (props.anchorForCapturedLabelField) {
            advOverlayListener.anchorForCapturedLabelField =
                props.anchorForCapturedLabelField;
        }
        if (props.offsetForCapturedLabelField) {
            advOverlayListener.offsetForCapturedLabelField =
                props.offsetForCapturedLabelField;
        }
        // If props.advancedOverlayListener is provided, use it instead of individual callbacks
        if (props.viewForCapturedLabel ||
            props.anchorForCapturedLabel ||
            props.offsetForCapturedLabel ||
            props.viewForCapturedLabelField ||
            props.anchorForCapturedLabelField ||
            props.offsetForCapturedLabelField) {
            advancedOverlay.listener = advOverlayListener;
        }
    }, [
        props.viewForCapturedLabel,
        props.anchorForCapturedLabel,
        props.offsetForCapturedLabel,
        props.viewForCapturedLabelField,
        props.anchorForCapturedLabelField,
        props.offsetForCapturedLabelField,
        props.shouldShowScanAreaGuides,
    ]);
    /* VALIDATION FLOW OVERLAY */
    useEffect(() => {
        const validationFlowOverlay = getValidationFlowOverlay();
        if (props.validationFlowSettings && validationFlowOverlay) {
            validationFlowOverlay.applySettings(props.validationFlowSettings);
        }
        // Setup validation flow overlay listener from props
        const validationFlowOverlayListener = {
            didCaptureLabelWithFields: props.didCaptureLabelWithFields || ((fields) => { return; }),
        };
        // Set the listener if any callback is provided
        if (props.didCaptureLabelWithFields) {
            validationFlowOverlay.listener = validationFlowOverlayListener;
        }
    }, [props.validationFlowSettings, props.didCaptureLabelWithFields]);
    /* OVERLAY MODE SWITCHING */
    useEffect(() => {
        if (!componentIsSetUp.current || !viewRef.current)
            return;
        // Remove all existing overlays
        viewRef.current?.removeAllOverlays();
        // Add the appropriate overlays based on useValidationFlow
        if (!props.useValidationFlow) {
            viewRef.current.addOverlay(getBasicOverlay());
            viewRef.current.addOverlay(getAdvancedOverlay());
        }
        else {
            viewRef.current.addOverlay(getValidationFlowOverlay());
        }
    }, [props.useValidationFlow]);
    /* CAMERA */
    useEffect(() => {
        getCamera()?.applySettings(props.cameraSettings || LabelCapture.recommendedCameraSettings);
    }, [props.cameraSettings]);
    useEffect(() => {
        if (props.desiredCameraPosition) {
            getCamera()?.switchToDesiredState(FrameSourceState.Off);
            props.context.setFrameSource(null).then(() => {
                cameraRef.current = Camera.asPositionWithSettings(props.desiredCameraPosition || CameraPosition.WorldFacing, props.cameraSettings || LabelCapture.recommendedCameraSettings);
                props.context.setFrameSource(getCamera()).then(() => {
                    getCamera()?.switchToDesiredState(props.desiredCameraState || FrameSourceState.On);
                });
            });
        }
    }, [props.desiredCameraPosition]);
    /* CONTROLS */
    useEffect(() => {
        if (props.desiredTorchState) {
            getCamera().desiredTorchState = props.desiredTorchState;
        }
    }, [props.desiredTorchState]);
    useEffect(() => {
        if (!viewRef.current)
            return;
        if (torchSwitchControl.current) {
            viewRef.current?.removeControl(torchSwitchControl.current);
        }
        if (!props.torchSwitchControl)
            return;
        torchSwitchControl.current = props.torchSwitchControl;
        viewRef.current.addControl(torchSwitchControl.current);
    }, [props.torchSwitchControl]);
    useEffect(() => {
        if (!viewRef.current)
            return;
        if (zoomSwitchControl.current) {
            viewRef.current?.removeControl(zoomSwitchControl.current);
        }
        if (!props.zoomSwitchControl)
            return;
        zoomSwitchControl.current = props.zoomSwitchControl;
        viewRef.current.addControl(zoomSwitchControl.current);
    }, [props.zoomSwitchControl]);
    /* NAVIGATION */
    useEffect(() => {
        if (!props.navigation)
            return;
        try {
            const unsubscribeFromFocus = props.navigation.addListener('focus', () => {
                doSetup();
            });
            const unsubscribeFromBlur = props.navigation.addListener('blur', () => {
                doCleanup();
            });
            return () => {
                unsubscribeFromFocus();
                unsubscribeFromBlur();
            };
        }
        catch (e) {
            // tslint:disable-next-line:no-console
            console.error(e);
        }
    }, [props.navigation]);
    return (React.createElement(DataCaptureView, { context: props.context, style: { flex: 1 }, ref: viewRef }));
});

initLabelDefaults();
initLabelProxy();

export { LabelCaptureAdvancedOverlayView, LabelCaptureView };
