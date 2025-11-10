import { initCoreProxy, createRNNativeCaller, initCoreDefaults } from 'scandit-react-native-datacapture-core';
import { FactoryMaker, createAdvancedNativeProxy } from 'scandit-react-native-datacapture-core/dist/core';
import { NativeModules } from 'react-native';
import { LabelCaptureListenerEvents, LabelCaptureBasicOverlayListenerEvents, LabelCaptureAdvancedOverlayListenerEvents, loadLabelCaptureDefaults } from './label.js';
export { BarcodeField, CapturedLabel, CustomBarcode, CustomText, ExpiryDateText, ImeiOneBarcode, ImeiTwoBarcode, LabelCapture, LabelCaptureAdvancedOverlay, LabelCaptureBasicOverlay, LabelCaptureSession, LabelCaptureSettings, LabelDateComponentFormat, LabelDateFormat, LabelDateResult, LabelDefinition, LabelField, LabelFieldDefinition, LabelFieldLocation, LabelFieldLocationType, LabelFieldState, LabelFieldType, PackingDateText, PartNumberBarcode, SerialNumberBarcode, TextField, TotalPriceText, UnitPriceText, WeightText } from './label.js';
import React from 'react';
import 'scandit-react-native-datacapture-barcode/dist/barcode';

function initLabelProxy() {
    initCoreProxy();
    FactoryMaker.bindLazyInstance('LabelCaptureProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureLabel);
        return createAdvancedNativeProxy(caller);
    });
    FactoryMaker.bindLazyInstance('LabelCaptureListenerProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureLabel);
        return createAdvancedNativeProxy(caller, LabelCaptureListenerEvents);
    });
    FactoryMaker.bindLazyInstance('LabelCaptureBasicOverlayProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureLabel);
        return createAdvancedNativeProxy(caller, LabelCaptureBasicOverlayListenerEvents);
    });
    FactoryMaker.bindLazyInstance('LabelCaptureAdvancedOverlayProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureLabel);
        return createAdvancedNativeProxy(caller, LabelCaptureAdvancedOverlayListenerEvents);
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

initLabelDefaults();
initLabelProxy();

export { LabelCaptureAdvancedOverlayView };
