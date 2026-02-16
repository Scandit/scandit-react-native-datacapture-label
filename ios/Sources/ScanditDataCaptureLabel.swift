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

@objc(ScanditDataCaptureLabel)
class ScanditDataCaptureLabel: AdvancedOverlayContainer {

    var labelCaptureModule: LabelCaptureModule!

    var trackedLabelViewCache: [ScanditRootView: TrackedLabelViewData] = [:]

    override init() {
        super.init()
        let emitter = ReactNativeEmitter(emitter: self)
        labelCaptureModule = LabelCaptureModule(
            emitter: emitter,
            viewFromJsonResolver: ReactViewFromJsonResolver(container: self)
        )
        labelCaptureModule.didStart()
    }

    override class func requiresMainQueueSetup() -> Bool {
        true
    }

    override var methodQueue: DispatchQueue! {
        sdcSharedMethodQueue
    }

    @objc override func invalidate() {
        super.invalidate()
        trackedLabelViewCache.removeAll()
        labelCaptureModule.didStop()
    }

    deinit {
        invalidate()
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        [
            "Defaults": [
                "LabelCapture": labelCaptureModule.getDefaults()
            ]
        ]
    }

    override func supportedEvents() -> [String]! {
        FrameworksLabelCaptureEvent.allCases.map { $0.rawValue }
            + FrameworksLabelCaptureValidationFlowEvents.allCases.map { $0.rawValue }
    }

    // MARK: - Command Pattern API

    @objc(executeLabel:resolve:reject:)
    func executeLabel(
        _ data: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let coreModuleName = String(describing: CoreModule.self)
        guard let coreModule = DefaultServiceLocator.shared.resolve(clazzName: coreModuleName) as? CoreModule else {
            reject("-1", "Unable to retrieve the CoreModule from the locator.", nil)
            return
        }

        let result = ReactNativeResult(resolve, reject)
        let handled = coreModule.execute(
            ReactNativeMethodCall(data),
            result: result,
            module: labelCaptureModule
        )

        if !handled {
            let methodName = data["methodName"] as? String ?? "unknown"
            reject("METHOD_NOT_FOUND", "Unknown Core method: \(methodName)", nil)
        }
    }
}

// MARK: - RCTRootViewDelegate method implementation (for old architecture support)
// We implement the delegate method directly without formal protocol conformance
// to avoid exposing RCTRootViewDelegate in the generated Swift-to-ObjC header.
extension ScanditDataCaptureLabel {
    @objc public func rootViewDidChangeIntrinsicSize(_ rootView: RCTRootView!) {
        guard rootView is ScanditRootView else { return }
        rootView.bounds.size = rootView.intrinsicContentSize
    }
}
