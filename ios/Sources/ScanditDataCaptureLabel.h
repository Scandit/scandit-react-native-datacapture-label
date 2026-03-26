/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>

// Block type for TurboModule event emission (Swift interop)
// Defined unconditionally for Swift header generation, used only in new arch
typedef void (^SDCEventEmitBlock)(NSDictionary *_Nonnull payload);

#ifdef RCT_NEW_ARCH_ENABLED
#import <ScanditReactNativeDatacaptureLabelSpec/ScanditReactNativeDatacaptureLabelSpec.h>
#import <React/RCTInitializing.h>
#import <React/RCTInvalidating.h>
#endif

/// Obj-C++ adapter class that conforms to TurboModule spec and delegates to Swift implementation.
/// Following the Adapter Pattern from React Native's TurboModule Swift guide.
#ifdef RCT_NEW_ARCH_ENABLED
@interface NativeScanditDataCaptureLabel
    : NativeScanditDataCaptureLabelSpecBase <NativeScanditDataCaptureLabelSpec, RCTInitializing,
                                             RCTInvalidating>
#else
@interface NativeScanditDataCaptureLabel : RCTEventEmitter <RCTBridgeModule>
#endif
@end
