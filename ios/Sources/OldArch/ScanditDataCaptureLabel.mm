/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import "ScanditDataCaptureLabel.h"
#import "ScanditLabelCaptureCore-Swift.h"

// Forward declare and import the shared method queue from Core module
// The actual implementation is in ScanditDataCaptureCore Swift module
@interface SDCSharedMethodQueue : NSObject
+ (dispatch_queue_t)queue;
@end

/// Old Architecture (Paper/Bridge) adapter for the Label native module.
/// Inherits from RCTEventEmitter and exports methods via RCT_EXPORT_METHOD macros.
@implementation NativeScanditDataCaptureLabel {
    ScanditDataCaptureLabelImpl *_impl;
}

RCT_EXPORT_MODULE(ScanditDataCaptureLabel)

- (instancetype)init {
    if (self = [super init]) {
        _impl = [[ScanditDataCaptureLabelImpl alloc] init];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)initialize {
    [_impl setupWith:self];
}

- (dispatch_queue_t)methodQueue {
    return [SDCSharedMethodQueue queue];
}

- (NSDictionary *)constantsToExport {
    return [self getConstantsOnMainQueue];
}

- (NSDictionary *)getConstants {
    return [self getConstantsOnMainQueue];
}

- (NSDictionary *)getConstantsOnMainQueue {
    __block NSDictionary *constants;
    if ([NSThread isMainThread]) {
        constants = [_impl getConstants];
    } else {
        dispatch_sync(dispatch_get_main_queue(), ^{
            constants = [_impl getConstants];
        });
    }
    return constants;
}

- (NSArray<NSString *> *)supportedEvents {
    return [_impl supportedEvents];
}

- (void)invalidate {
    [super invalidate];
    [_impl invalidate];
}

// MARK: - Native Module Methods

RCT_EXPORT_METHOD(executeLabel
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject) {
    [_impl executeLabel:data resolve:resolve reject:reject];
}

@end
