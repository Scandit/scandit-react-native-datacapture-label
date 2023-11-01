/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE (ScanditDataCaptureLabel, RCTEventEmitter)

RCT_EXTERN_METHOD(finishDidUpdateSessionCallback : (BOOL)enabled)
RCT_EXTERN_METHOD(finishBrushForFieldOfLabelCallback : (NSString *)brush)
RCT_EXTERN_METHOD(finishBrushForLabelCallback : (NSString *)brush)
RCT_EXTERN_METHOD(finishViewForLabelCallback : (NSString *)viewJSON)
RCT_EXTERN_METHOD(finishAnchorForLabelCallback : (NSString *)anchorJSON)
RCT_EXTERN_METHOD(finishOffsetForLabelCallback : (NSString *)offsetJSON)

RCT_EXTERN_METHOD(setBrushForFieldOfLabel
                  : (NSString *)brushJSON frameSequenceId
                  : (NSInteger)frameSequenceId fieldName
                  : (NSString *)fieldName labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setBrushForLabel
                  : (NSString *)brushJSON frameSequenceId
                  : (NSInteger)frameSequenceId labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setViewForCapturedLabel
                  : (NSString *)viewJSON frameSequenceId
                  : (NSInteger)frameSequenceId labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAnchorForCapturedLabel
                  : (NSString *)anchorJSON frameSequenceId
                  : (NSInteger)frameSequenceId labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setOffsetForCapturedLabel
                  : (NSString *)offsetJSON frameSequenceId
                  : (NSInteger)frameSequenceId labelId
                  : (NSInteger)labelId resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearCapturedLabelViews
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerListenerForEvents)

RCT_EXTERN_METHOD(unregisterListenerForEvents)

RCT_EXTERN_METHOD(registerListenerForBasicOverlayEvents)

RCT_EXTERN_METHOD(unregisterListenerForBasicOverlayEvents)

RCT_EXTERN_METHOD(registerListenerForAdvancedOverlayEvents)

RCT_EXTERN_METHOD(unregisterListenerForAdvancedOverlayEvents)

@end
