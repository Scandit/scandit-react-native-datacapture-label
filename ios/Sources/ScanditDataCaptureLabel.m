/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE (ScanditDataCaptureLabel, RCTEventEmitter)

RCT_EXTERN_METHOD(finishDidUpdateSessionCallback : (NSDictionary *)data)

RCT_EXTERN_METHOD(setModeEnabledState : (NSDictionary *)data)

RCT_EXTERN_METHOD(setBrushForFieldOfLabel
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setBrushForLabel
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setViewForCapturedLabel
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setViewForCapturedLabelField
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAnchorForCapturedLabel
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAnchorForCapturedLabelField
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setOffsetForCapturedLabel
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setOffsetForCapturedLabelField
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearCapturedLabelViews
                  : (NSDictionary *)data resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerListenerForEvents : (NSDictionary *)data)

RCT_EXTERN_METHOD(unregisterListenerForEvents : (NSDictionary *)data)

RCT_EXTERN_METHOD(registerListenerForBasicOverlayEvents : (NSDictionary *)data)

RCT_EXTERN_METHOD(unregisterListenerForBasicOverlayEvents : (NSDictionary *)data)

RCT_EXTERN_METHOD(registerListenerForAdvancedOverlayEvents : (NSDictionary *)data)

RCT_EXTERN_METHOD(unregisterListenerForAdvancedOverlayEvents : (NSDictionary *)data)

RCT_EXTERN_METHOD(registerListenerForValidationFlowEvents : (NSDictionary *)data)

RCT_EXTERN_METHOD(unregisterListenerForValidationFlowEvents : (NSDictionary *)data)

RCT_EXTERN_METHOD(updateLabelCaptureBasicOverlay
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateLabelCaptureAdvancedOverlay
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateLabelCaptureValidationFlowOverlay
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateLabelCaptureSettings
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)
@end
