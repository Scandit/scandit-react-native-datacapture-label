import { setLabelCaptureDefaultsLoader, LabelCaptureSettings, LabelCapture, LabelCaptureBasicOverlay, LabelCaptureAdvancedOverlay, LabelCaptureValidationFlowOverlay, registerLabelProxies, loadLabelCaptureDefaults } from './label.js';
export { AdaptiveRecognitionResult, AdaptiveRecognitionResultType, BarcodeField, CapturedLabel, CustomBarcode, CustomText, ExpiryDateText, ImeiOneBarcode, ImeiTwoBarcode, LabelCapture, LabelCaptureAdaptiveRecognitionOverlay, LabelCaptureAdaptiveRecognitionSettings, LabelCaptureAdvancedOverlay, LabelCaptureBasicOverlay, LabelCaptureFeedback, LabelCaptureSession, LabelCaptureSettings, LabelCaptureValidationFlowOverlay, LabelCaptureValidationFlowSettings, LabelDateComponentFormat, LabelDateFormat, LabelDateResult, LabelDefinition, LabelField, LabelFieldDefinition, LabelFieldLocation, LabelFieldLocationType, LabelFieldState, LabelFieldType, PackingDateText, PartNumberBarcode, ReceiptScanningLineItem, ReceiptScanningResult, SerialNumberBarcode, TextField, TotalPriceText, UnitPriceText, WeightText } from './label.js';
import { CameraPosition, FrameSourceState, DataCaptureView, initCoreProxy, initCoreDefaults, getModuleDefaults, getNativeModule, createRNNativeCaller } from 'scandit-react-native-datacapture-core';
import React, { forwardRef, useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { CameraOwnershipHelper } from 'scandit-react-native-datacapture-core/dist/core';
import 'scandit-react-native-datacapture-barcode/dist/barcode';

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

function initLabelDefaults() {
    initCoreDefaults();
    loadLabelCaptureDefaults(getModuleDefaults('ScanditDataCaptureLabel'));
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

// tslint:disable-next-line
const LabelCaptureView = forwardRef(function LabelCaptureView(props, _ref) {
    const currentProps = useRef({
        isEnabled: props.isEnabled,
        desiredCameraState: props.desiredCameraState,
    });
    const viewRef = useRef(null);
    const componentIsSetUp = useRef(false);
    const [viewId] = useState(() => Math.floor(Math.random() * 1000000));
    const [isCameraSetup, setIsCameraSetup] = useState(false);
    // Create camera owner using viewId
    const cameraOwner = useMemo(() => ({
        id: `label-capture-view-${viewId}`,
    }), [viewId]);
    const labelCaptureModeRef = useRef(null);
    const basicOverlayRef = useRef(null);
    const advancedOverlayRef = useRef(null);
    const validationFlowOverlayRef = useRef(null);
    const torchSwitchControl = useRef(null);
    const zoomSwitchControl = useRef(null);
    const appState = useRef(AppState.currentState);
    const getMode = useCallback(() => {
        if (labelCaptureModeRef.current !== null) {
            return labelCaptureModeRef.current;
        }
        // Create a default settings if none provided
        const settings = props.labelCaptureSettings || LabelCaptureSettings.settingsFromLabelDefinitions([], {});
        // Create the label capture instance with context and settings
        labelCaptureModeRef.current = new LabelCapture(settings);
        labelCaptureModeRef.current['parentId'] = viewId;
        return labelCaptureModeRef.current;
    }, [props.labelCaptureSettings, viewId]);
    useEffect(() => {
        currentProps.current = {
            isEnabled: props.isEnabled,
            desiredCameraState: currentProps.current.desiredCameraState,
        };
        getMode().isEnabled = currentProps.current.isEnabled;
    }, [props.isEnabled, getMode]);
    useEffect(() => {
        currentProps.current = {
            isEnabled: currentProps.current.isEnabled,
            desiredCameraState: props.desiredCameraState,
        };
        if (props.desiredCameraState) {
            const position = props.desiredCameraPosition || CameraPosition.WorldFacing;
            void CameraOwnershipHelper.withCamera(position, cameraOwner, async (camera) => {
                await camera.switchToDesiredState(props.desiredCameraState);
            });
        }
    }, [props.desiredCameraState, props.desiredCameraPosition, cameraOwner]);
    const getBasicOverlay = useCallback(() => {
        if (basicOverlayRef.current !== null) {
            return basicOverlayRef.current;
        }
        basicOverlayRef.current = new LabelCaptureBasicOverlay(getMode());
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
            basicOverlayRef.current.shouldShowScanAreaGuides = props.shouldShowScanAreaGuides;
        }
        if (props.viewfinder !== undefined) {
            basicOverlayRef.current.viewfinder = props.viewfinder;
        }
        return basicOverlayRef.current;
    }, [
        getMode,
        props.predictedFieldBrush,
        props.capturedFieldBrush,
        props.labelBrush,
        props.shouldShowScanAreaGuides,
        props.viewfinder,
    ]);
    const getAdvancedOverlay = useCallback(() => {
        if (advancedOverlayRef.current !== null) {
            return advancedOverlayRef.current;
        }
        advancedOverlayRef.current = new LabelCaptureAdvancedOverlay(getMode());
        if (props.shouldShowScanAreaGuides !== undefined) {
            advancedOverlayRef.current.shouldShowScanAreaGuides = props.shouldShowScanAreaGuides;
        }
        return advancedOverlayRef.current;
    }, [getMode, props.shouldShowScanAreaGuides]);
    const getValidationFlowOverlay = useCallback(() => {
        if (validationFlowOverlayRef.current !== null) {
            return validationFlowOverlayRef.current;
        }
        validationFlowOverlayRef.current = new LabelCaptureValidationFlowOverlay(getMode());
        if (props.validationFlowSettings) {
            void validationFlowOverlayRef.current.applySettings(props.validationFlowSettings);
        }
        return validationFlowOverlayRef.current;
    }, [getMode, props.validationFlowSettings]);
    // Remove getCamera function as we'll use CameraOwnershipHelper
    /* SETUP */
    useEffect(() => {
        void doSetup();
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                getMode().isEnabled = currentProps.current.isEnabled;
                if (currentProps.current.desiredCameraState) {
                    const position = props.desiredCameraPosition || CameraPosition.WorldFacing;
                    void CameraOwnershipHelper.withCamera(position, cameraOwner, async (camera) => {
                        await camera.switchToDesiredState(currentProps.current.desiredCameraState);
                    });
                }
            }
            else {
                getMode().isEnabled = false;
                const position = props.desiredCameraPosition || CameraPosition.WorldFacing;
                void CameraOwnershipHelper.withCamera(position, cameraOwner, async (camera) => {
                    await camera.switchToDesiredState(FrameSourceState.Off);
                });
            }
            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
            doDestroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const setupCamera = useCallback(async () => {
        const position = props.desiredCameraPosition || CameraPosition.WorldFacing;
        // Request ownership and set up camera
        await CameraOwnershipHelper.withCameraWhenAvailable(position, cameraOwner, async (camera) => {
            const settings = props.cameraSettings || LabelCapture.createRecommendedCameraSettings();
            await camera.applySettings(settings);
            await props.context.setFrameSource(camera);
            await camera.switchToDesiredState(props.desiredCameraState || FrameSourceState.On);
            // Mark camera as set up
            setIsCameraSetup(true);
        });
    }, [props.desiredCameraPosition, cameraOwner, props.cameraSettings, props.context, props.desiredCameraState]);
    const doSetup = useCallback(async () => {
        if (componentIsSetUp.current)
            return;
        componentIsSetUp.current = true;
        /* Setup camera with ownership - WAIT for completion */
        await setupCamera();
        /* Adding Label Capture mode */
        await props.context.addMode(getMode());
        /* Adding Label Capture Overlays */
        if (viewRef.current) {
            await viewRef.current.addOverlay(getBasicOverlay());
            if (!props.useValidationFlow) {
                await viewRef.current.addOverlay(getAdvancedOverlay());
            }
            else {
                await viewRef.current.addOverlay(getValidationFlowOverlay());
            }
        }
    }, [
        setupCamera,
        props.context,
        getMode,
        getBasicOverlay,
        getAdvancedOverlay,
        getValidationFlowOverlay,
        props.useValidationFlow,
    ]);
    const doCleanup = useCallback(() => {
        if (!componentIsSetUp.current)
            return;
        componentIsSetUp.current = false;
        // Reset camera setup state
        setIsCameraSetup(false);
        /* Remove the torch control */
        if (torchSwitchControl.current) {
            viewRef.current?.removeControl(torchSwitchControl.current);
        }
        /* Remove the zoom control */
        if (zoomSwitchControl.current) {
            viewRef.current?.removeControl(zoomSwitchControl.current);
        }
        /* Cleaning Data Capture Context */
        if (labelCaptureModeRef.current) {
            void props.context.removeMode(labelCaptureModeRef.current);
        }
        /* Cleaning Overlays */
        if (viewRef.current) {
            const view = viewRef.current;
            void Promise.all((view['view']?.overlays || []).map((overlay) => view['view']?.removeOverlay(overlay)));
        }
        /* Turn off camera and release ownership */
        const position = props.desiredCameraPosition || CameraPosition.WorldFacing;
        void CameraOwnershipHelper.withCamera(position, cameraOwner, async (camera) => {
            await camera.switchToDesiredState(FrameSourceState.Off);
            await props.context.setFrameSource(null);
        }).finally(() => {
            // Release camera ownership
            CameraOwnershipHelper.releaseOwnership(position, cameraOwner);
        });
    }, [props.desiredCameraPosition, cameraOwner, props.context]);
    const doDestroy = () => {
        doCleanup();
        labelCaptureModeRef.current = null;
        torchSwitchControl.current = null;
        zoomSwitchControl.current = null;
        basicOverlayRef.current = null;
        advancedOverlayRef.current = null;
        validationFlowOverlayRef.current = null;
    };
    /* LABEL CAPTURE MODE */
    useEffect(() => {
        if (props.labelCaptureSettings && labelCaptureModeRef.current) {
            void labelCaptureModeRef.current.applySettings(props.labelCaptureSettings);
        }
    }, [props.labelCaptureSettings, getMode]);
    useEffect(() => {
        if (!labelCaptureModeRef.current || !componentIsSetUp.current)
            return;
        const listeners = [...getMode()['listeners']];
        listeners.forEach(listener => {
            getMode().removeListener(listener);
        });
        if (props.didUpdateSession) {
            getMode().addListener({
                didUpdateSession: props.didUpdateSession,
            });
        }
    }, [props.didUpdateSession, getMode]);
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
        if (props.brushForFieldOfLabel || props.brushForLabel || props.didTapLabel) {
            overlay.listener = basicOverlayListener;
        }
    }, [props.brush, props.predictedFieldBrush, props.capturedFieldBrush, props.labelBrush, props.shouldShowScanAreaGuides, props.viewfinder, props.brushForFieldOfLabel, props.brushForLabel, props.didTapLabel, getBasicOverlay]);
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
            advOverlayListener.viewForCapturedLabelField = props.viewForCapturedLabelField;
        }
        if (props.anchorForCapturedLabelField) {
            advOverlayListener.anchorForCapturedLabelField = props.anchorForCapturedLabelField;
        }
        if (props.offsetForCapturedLabelField) {
            advOverlayListener.offsetForCapturedLabelField = props.offsetForCapturedLabelField;
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
    }, [props.viewForCapturedLabel, props.anchorForCapturedLabel, props.offsetForCapturedLabel, props.viewForCapturedLabelField, props.anchorForCapturedLabelField, props.offsetForCapturedLabelField, props.shouldShowScanAreaGuides, getAdvancedOverlay]);
    /* VALIDATION FLOW OVERLAY */
    useEffect(() => {
        const validationFlowOverlay = getValidationFlowOverlay();
        if (props.validationFlowSettings && validationFlowOverlay) {
            void validationFlowOverlay.applySettings(props.validationFlowSettings);
        }
        // Setup validation flow overlay listener from props
        const validationFlowOverlayListener = {
            didCaptureLabelWithFields: props.didCaptureLabelWithFields ||
                ((_fields) => {
                    return;
                }),
            didSubmitManualInputForField: props.didSubmitManualInputForField ||
                ((_field) => {
                    return;
                }),
        };
        // Set the listener if any callback is provided
        if (props.didCaptureLabelWithFields || props.didSubmitManualInputForField) {
            validationFlowOverlay.listener = validationFlowOverlayListener;
        }
    }, [props.validationFlowSettings, props.didCaptureLabelWithFields, props.didSubmitManualInputForField, getValidationFlowOverlay]);
    /* OVERLAY MODE SWITCHING */
    useEffect(() => {
        if (!componentIsSetUp.current || !viewRef.current)
            return;
        const view = viewRef.current;
        void (async () => {
            // Remove all existing overlays
            view['removeAllOverlays']();
            // Add the appropriate overlays based on useValidationFlow
            if (!props.useValidationFlow) {
                await view.addOverlay(getBasicOverlay());
                await view.addOverlay(getAdvancedOverlay());
            }
            else {
                await view.addOverlay(getValidationFlowOverlay());
            }
        })();
    }, [props.useValidationFlow, getBasicOverlay, getAdvancedOverlay, getValidationFlowOverlay]);
    /* CAMERA */
    useEffect(() => {
        if (!isCameraSetup)
            return; // Don't run until camera is ready
        const position = props.desiredCameraPosition || CameraPosition.WorldFacing;
        const settings = props.cameraSettings || LabelCapture.createRecommendedCameraSettings();
        void CameraOwnershipHelper.withCamera(position, cameraOwner, async (camera) => {
            await camera.applySettings(settings);
        });
    }, [props.cameraSettings, props.desiredCameraPosition, cameraOwner, isCameraSetup]);
    useEffect(() => {
        if (!isCameraSetup || !props.desiredCameraPosition)
            return; // Don't run until camera is ready
        // Handle camera position change with ownership
        const currentOwnedPosition = CameraOwnershipHelper.getOwnedPosition(cameraOwner);
        const newPosition = props.desiredCameraPosition;
        if (currentOwnedPosition && currentOwnedPosition !== newPosition) {
            // Release old camera ownership
            CameraOwnershipHelper.releaseOwnership(currentOwnedPosition, cameraOwner);
            // Set up new camera
            void setupCamera();
        }
        else if (!currentOwnedPosition) {
            // No camera owned yet, set up new camera
            void setupCamera();
        }
    }, [props.desiredCameraPosition, cameraOwner, setupCamera, isCameraSetup]);
    /* CONTROLS */
    useEffect(() => {
        if (!isCameraSetup || !props.desiredTorchState)
            return; // Don't run until camera is ready
        const position = props.desiredCameraPosition || CameraPosition.WorldFacing;
        void CameraOwnershipHelper.withCameraWhenAvailable(position, cameraOwner, camera => {
            camera.desiredTorchState = props.desiredTorchState;
        });
    }, [props.desiredTorchState, props.desiredCameraPosition, cameraOwner, isCameraSetup]);
    useEffect(() => {
        if (!viewRef.current)
            return;
        if (torchSwitchControl.current) {
            viewRef.current?.removeControl(torchSwitchControl.current);
        }
        if (!props.torchSwitchControl)
            return;
        torchSwitchControl.current = props.torchSwitchControl;
        void viewRef.current.addControl(torchSwitchControl.current);
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
        void viewRef.current.addControl(zoomSwitchControl.current);
    }, [props.zoomSwitchControl]);
    /* NAVIGATION */
    useEffect(() => {
        if (!props.navigation)
            return;
        try {
            const unsubscribeFromFocus = props.navigation.addListener('focus', () => {
                void doSetup();
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
    }, [props.navigation, doSetup, doCleanup]);
    return React.createElement(DataCaptureView, { context: props.context, style: { flex: 1 }, parentId: viewId, ref: viewRef });
});

initLabelDefaults();
initLabelProxy();

export { LabelCaptureAdvancedOverlayView, LabelCaptureView };
