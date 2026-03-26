/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
import ScanditDataCaptureBarcode
import ScanditDataCaptureCore
import ScanditFrameworksCore
import ScanditFrameworksLabel
import ScanditLabelCapture

// MARK: - Tracked Label View Data Structure

struct TrackedLabelViewData {
    let capturedLabel: CapturedLabel
    let labelField: LabelField?
    let dataCaptureViewId: Int

    init(capturedLabel: CapturedLabel, labelField: LabelField? = nil, dataCaptureViewId: Int) {
        self.capturedLabel = capturedLabel
        self.labelField = labelField
        self.dataCaptureViewId = dataCaptureViewId
    }
}

/// Swift implementation for the Label native module.
/// This class contains all business logic and is used by the Obj-C++ adapter (NativeScanditDataCaptureLabel).
/// Following the Adapter Pattern from React Native's TurboModule Swift guide.
@objcMembers
public class ScanditDataCaptureLabelImpl: NSObject {

    var labelCaptureModule: LabelCaptureModule!

    var trackedLabelViewCache: [ScanditRootView: TrackedLabelViewData] = [:]

    /// Reference to the RCTEventEmitter adapter.
    /// Used to obtain the RCT bridge for AdvancedOverlayViewCreator in old architecture. Nil in new architecture.
    weak var emitter: RCTEventEmitter?

    public override init() {
        super.init()
    }

    /// Called by the Obj-C++ adapter to set up the emitter reference and initialize modules (old architecture).
    public func setup(with emitter: RCTEventEmitter) {
        self.emitter = emitter
        guard let reactEmitter = ScanditDataCaptureCore.ReactNativeEmitterFactory.create(emitter: emitter) else {
            fatalError("Failed to create ReactNativeEmitter")
        }
        initializeModule(with: reactEmitter)
    }

    /// Called by the Obj-C++ adapter to set up the emitter reference and initialize modules (new architecture).
    /// - Parameters:
    ///   - emitter: The RCTEventEmitter (nil in new arch since we don't inherit from RCTEventEmitter).
    ///   - turboEmitter: TurboModule emitter block for new architecture.
    @objc(setupWith:turboEmitter:)
    public func setup(with emitter: RCTEventEmitter?, turboEmitter: SDCEventEmitBlock?) {
        self.emitter = emitter
        guard
            let reactEmitter = ScanditDataCaptureCore.ReactNativeEmitterFactory.create(
                emitter: emitter,
                turboEmitter: turboEmitter
            )
        else {
            fatalError("Failed to create ReactNativeEmitter")
        }
        initializeModule(with: reactEmitter)
    }

    private func initializeModule(with reactEmitter: ReactNativeEmitter) {
        guard let viewCreator = AdvancedOverlayViewCreatorFactory.create(emitter: emitter) else {
            fatalError("Failed to create AdvancedOverlayViewCreator")
        }
        let viewResolver = ScanditDataCaptureBarcode.ReactViewFromJsonResolver(creator: viewCreator)
        labelCaptureModule = LabelCaptureModule(emitter: reactEmitter, viewFromJsonResolver: viewResolver)
        labelCaptureModule.didStart()
    }

    public func invalidate() {
        trackedLabelViewCache.removeAll()
        labelCaptureModule?.didStop()
    }

    public func getConstants() -> [AnyHashable: Any] {
        guard let module = labelCaptureModule else {
            return [:]
        }
        return [
            "Defaults": [
                "LabelCapture": module.getDefaults()
            ]
        ]
    }

    public func supportedEvents() -> [String] {
        FrameworksLabelCaptureEvent.allCases.map { $0.rawValue }
            + FrameworksLabelCaptureValidationFlowEvents.allCases.map { $0.rawValue }
    }

    // MARK: - Command Pattern API

    public func executeLabel(
        _ data: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let module = labelCaptureModule else {
            reject(
                "MODULE_NOT_INITIALIZED",
                "LabelCaptureModule is not initialized. setup() may not have been called.",
                nil
            )
            return
        }

        let coreModuleName = String(describing: CoreModule.self)
        guard let coreModule = DefaultServiceLocator.shared.resolve(clazzName: coreModuleName) as? CoreModule else {
            reject("-1", "Unable to retrieve the CoreModule from the locator.", nil)
            return
        }

        let result = ReactNativeResult(resolve, reject)
        let handled = coreModule.execute(
            ReactNativeMethodCall(data),
            result: result,
            module: module
        )

        if !handled {
            let methodName = data["methodName"] as? String ?? "unknown"
            reject("METHOD_NOT_FOUND", "Unknown Core method: \(methodName)", nil)
        }
    }

}
