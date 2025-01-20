/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE (ScanditDataCaptureLabel, RCTEventEmitter)

RCT_EXTERN_METHOD(finishDidUpdateSessionCallback : (BOOL)enabled)

RCT_EXTERN_METHOD(setModeEnabledState : (BOOL)enabled)

RCT_EXTERN_METHOD(setBrushForFieldOfLabel
                  : (NSString *)brushJSON fieldName
                  : (NSString *)fieldName labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setBrushForLabel
                  : (NSString *)brushJSON labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setViewForCapturedLabel
                  : (NSString *)viewJSON labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAnchorForCapturedLabel
                  : (NSString *)anchorJSON labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setOffsetForCapturedLabel
                  : (NSString *)offsetJSON labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearCapturedLabelViews)

RCT_EXTERN_METHOD(registerListenerForEvents)

RCT_EXTERN_METHOD(unregisterListenerForEvents)

RCT_EXTERN_METHOD(registerListenerForBasicOverlayEvents)

RCT_EXTERN_METHOD(unregisterListenerForBasicOverlayEvents)

RCT_EXTERN_METHOD(registerListenerForAdvancedOverlayEvents)

RCT_EXTERN_METHOD(unregisterListenerForAdvancedOverlayEvents)

RCT_EXTERN_METHOD(updateLabelCaptureBasicOverlay
                  : (NSString *)overlayJson resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateLabelCaptureAdvancedOverlay
                  : (NSString *)overlayJson resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(applyLabelCaptureModeSettings
                  : (NSString *)modeSettingsJson resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

@end