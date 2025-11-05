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

@objc(ScanditDataCaptureLabel)
class ScanditDataCaptureLabel: RCTEventEmitter {

    var labelModule: LabelModule!

    var trackedLabelViewCache: [RCTRootView: (CapturedLabel, LabelField?)] = [:]

    override init() {
        super.init()
        let emitter = ReactNativeEmitter(emitter: self)
        labelModule = LabelModule(emitter: emitter)
        labelModule.didStart()
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return sdcSharedMethodQueue
    }

    @objc override func invalidate() {
        super.invalidate()
        trackedLabelViewCache.removeAll()
        labelModule.didStop()
    }

    deinit {
        invalidate()
    }

    override func constantsToExport() -> [AnyHashable : Any]! {
        [
            "Defaults": [
                "LabelCapture": labelModule.defaults.toEncodable()
            ]
        ]
    }

    override func supportedEvents() -> [String]! {
        FrameworksLabelCaptureEvent.allCases.map { $0.rawValue }
    }

    // MARK: - Module API

    @objc(finishDidUpdateSessionCallback:)
    func finishDidUpdateSessionCallback(_ data: [String: Any]) {
        if let enabled = data["isEnabled"] as? Bool {
            labelModule.finishDidUpdateCallback(enabled: enabled)
        }
    }

    @objc(setModeEnabledState:)
    func setModeEnabledState(_ data: [String: Any]) {
        if let enabled = data["isEnabled"] as? Bool {
            labelModule.setModeEnabled(enabled: enabled)
        }
    }

    @objc(setBrushForFieldOfLabel:resolver:rejecter:)
    func setBrushForFieldOfLabel(_ data: [String: Any],
                                 resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        guard let brushJson = data["brushJson"] as? String,
              let labelId = data["trackingId"] as? Int,
              let fieldName = data["fieldName"] as? String else {
            reject("error", "One or more of the fields required for setBrushForFieldOfLabel not set", nil)
            return
        }
        let brushForFieldOfLabel = BrushForLabelField(brushJson: brushJson,
                                                      labelTrackingId: labelId,
                                                      fieldName: fieldName)
                                     labelModule.setBrushForFieldOfLabel(brushForFieldOfLabel: brushForFieldOfLabel,
                                                                         result: .create(resolve, reject))
    }

    @objc(setBrushForLabel:resolver:rejecter:)
    func setBrushForLabel(_ data: [String: Any],
                          resolve: @escaping RCTPromiseResolveBlock,
                          reject: @escaping RCTPromiseRejectBlock) {
        guard let brushJson = data["brushJson"] as? String,
              let labelId = data["trackingId"] as? Int else {
            reject("error", "One or more of the fields required for setBrushForLabel not set", nil)
            return
        }

        let brushForLabel = BrushForLabelField(brushJson: brushJson,
                                               labelTrackingId: labelId)

        labelModule.setBrushForLabel(brushForLabel: brushForLabel,  result: .create(resolve, reject))
    }

    @objc(setViewForCapturedLabel:resolver:rejecter:)
    func setViewForCapturedLabel(_ data: [String: Any],
                                 resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {

        guard let labelId = data["trackingId"] as? Int else {
            reject("error", "labelId not found", nil)
            return
        }
        let result = ReactNativeResult.create(resolve, reject)
        let viewJson = data["jsonView"] as? String

         do {
             if let viewJson = viewJson {
                 let config = try JSONSerialization.jsonObject(with: viewJson.data(using: .utf8)!,
                                                               options: []) as! [String: Any]
                 let jsView = try JSView(with: config)
                 try dispatchMainSync {
                     let rootView = rootViewWith(jsView: jsView)
                     let label = try labelModule.label(for: labelId)
                     trackedLabelViewCache[rootView] = (label, nil)
                     let viewForLabel = ViewForLabel(view: rootView,
                                                     trackingId: label.trackingId)
                     labelModule.setViewForCapturedLabel(viewForLabel: viewForLabel, result: result)
                     return
                 }
             }
         } catch {
             result.reject(error: error)
             return
         }
         let viewForLabel = ViewForLabel(view: nil,
                                         trackingId: labelId)
         labelModule.setViewForCapturedLabel(viewForLabel: viewForLabel, result: result)
    }

    @objc(setViewForCapturedLabelField:resolver:rejecter:)
    func setViewForCapturedLabelField(_ data: [String: Any],
                                      resolve: @escaping RCTPromiseResolveBlock,
                                      reject: @escaping RCTPromiseRejectBlock) {

        guard let labelFieldIdentifier = data["identifier"] as? String else {
            reject("error", "labelId field not found", nil)
            return
        }
        let result = ReactNativeResult.create(resolve, reject)
        let viewJson = data["view"] as? String

        do {
            let labelAndField = try labelModule.labelAndField(for: labelFieldIdentifier)

            if let viewJson = viewJson {
                let config = try JSONSerialization.jsonObject(with: viewJson.data(using: .utf8)!,
                                                              options: []) as! [String: Any]

                let jsView = try JSView(with: config)

                dispatchMain {
                    let rootView = self.rootViewWith(jsView: jsView)
                    self.trackedLabelViewCache[rootView] = (labelAndField.0, labelAndField.1)
                    self.labelModule.setViewForCapturedLabelField(
                        for: labelAndField.0,
                        and: labelAndField.1,
                        view: rootView,
                        result: result
                    )
                }
            } else {
                 labelModule.setViewForCapturedLabelField(
                    for: labelAndField.0,
                    and: labelAndField.1,
                    view: nil,
                    result: result
                 )
             }

            result.success(result: nil)
         } catch {
             result.reject(error: error)
             return
         }
    }

    @objc(setAnchorForCapturedLabel:resolver:rejecter:)
    func setAnchorForCapturedLabel(_ data: [String: Any],
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        guard let anchor = data["anchor"] as? String,
              let labelId = data["trackingId"] as? Int else {
            reject("error", "One or more required fields are missing or invalid", nil)
            return
        }

        let anchorForFieldOfLabel = AnchorForLabel(anchorString: anchor,
                                                  trackingId: labelId)

        labelModule.setAnchorForCapturedLabel(anchorForLabel: anchorForFieldOfLabel,
                                            result: .create(resolve, reject))
    }

    @objc(setAnchorForCapturedLabelField:resolver:rejecter:)
    func setAnchorForCapturedLabelField(_ data: [String: Any],
                                        resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        guard let anchor = data["anchor"] as? String,
              let labelFieldId = data["identifier"] as? String else {
            reject("error", "One or more required fields are missing or invalid", nil)
            return
        }

        let components = labelFieldId.components(separatedBy: String(FrameworksLabelCaptureSession.separator))
        let trackingId = Int(components[0])!
        let fieldName = components[1]
        let anchorForLabelField = AnchorForLabel(
            anchorString: anchor,
            trackingId: trackingId,
            fieldName: fieldName
        )

        labelModule.setAnchorForFieldOfLabel(
            anchorForFieldOfLabel: anchorForLabelField, result: .create(resolve,reject)
        )
    }

    @objc(setOffsetForCapturedLabel:resolver:rejecter:)
    func setOffsetForCapturedLabel(_ data: [String: Any],
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        guard let offsetJson = data["offsetJson"] as? String,
              let labelId = data["trackingId"] as? Int else {
            reject("error", "One or more required fields are missing or invalid", nil)
            return
        }

        let offsetForCapturedLabel = OffsetForLabel(offsetJson: offsetJson,
                                                   trackingId: labelId)

        labelModule.setOffsetForCapturedLabel(offsetForLabel: offsetForCapturedLabel,
                                            result: .create(resolve, reject))
    }

    @objc(setOffsetForCapturedLabelField:resolver:rejecter:)
    func setOffsetForCapturedLabelField(_ data: [String: Any],
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        guard let offsetJson = data["offsetJson"] as? String,
              let fieldLabelId = data["trackingId"] as? String else {
            reject("error", "One or more required fields are missing or invalid", nil)
            return
        }

        let components = fieldLabelId.components(separatedBy: String(FrameworksLabelCaptureSession.separator))
        let trackingId = Int(components[0])!
        let fieldName = components[1]
        let offsetForLabelField = OffsetForLabel(
            offsetJson: offsetJson,
            trackingId: trackingId,
            fieldName: fieldName
        )

        labelModule.setOffsetForCapturedLabel(offsetForLabel: offsetForLabelField,
                                            result: .create(resolve, reject))
    }

    @objc(clearCapturedLabelViews:rejecter:)
    func clearCapturedLabelViews(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        labelModule.clearTrackedCapturedLabelViews()
        dispatchMain {
            self.trackedLabelViewCache.removeAll()
            resolve(nil)
        }
    }

    @objc func registerListenerForEvents() {
        labelModule.addListener()
    }

    @objc func unregisterListenerForEvents() {
        labelModule.removeListener()
    }

    @objc func registerListenerForBasicOverlayEvents() {
        labelModule.addBasicOverlayListener()
    }

    @objc func unregisterListenerForBasicOverlayEvents() {
        labelModule.removeBasicOverlayListener()
    }

    @objc func registerListenerForAdvancedOverlayEvents() {
        labelModule.addAdvancedOverlayListener()
    }

    @objc func unregisterListenerForAdvancedOverlayEvents() {
        labelModule.removeAdvancedOverlayListener()
    }

    @objc(updateLabelCaptureBasicOverlay:resolve:reject:)
    func updateLabelCaptureBasicOverlay(_ data: [String: Any],
                                        resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        if let overlayJson = data["basicOverlayJson"] as? String {
            labelModule.updateBasicOverlay(overlayJson: overlayJson, result: .create(resolve, reject))
        }
    }

    @objc(updateLabelCaptureAdvancedOverlay:resolve:reject:)
    func updateLabelCaptureAdvancedOverlay(_ data: [String: Any],
                                          resolve: @escaping RCTPromiseResolveBlock,
                                          reject: @escaping RCTPromiseRejectBlock) {
        guard let overlayJson = data["advancedOverlayJson"] as? String else {
            reject("error", "Overlay JSON is missing or invalid", nil)
            return
        }

        labelModule.updateAdvancedOverlay(overlayJson: overlayJson,
                                        result: .create(resolve, reject))
    }

    @objc(updateLabelCaptureSettings:resolve:reject:)
    func updateLabelCaptureSettings(_ data: [String: Any],
                                      resolve: @escaping RCTPromiseResolveBlock,
                                      reject: @escaping RCTPromiseRejectBlock) {
        guard let settingsJson = data["settingsJson"] as? String else {
            reject("error", "Settings JSON is missing or invalid", nil)
            return
        }

        labelModule.applyModeSettings(modeSettingsJson: settingsJson,
                                    result: .create(resolve, reject))
    }

    private func rootViewWith(jsView: JSView) -> ScanditRootView {
        // To support self sizing js views we need to leverage the RCTRootViewDelegate
        // see https://reactnative.dev/docs/communication-ios
        let view = ScanditRootView(bridge: bridge,
                                   moduleName: jsView.moduleName,
                                   initialProperties: jsView.initialProperties)
        view.sizeFlexibility = .widthAndHeight
        view.delegate = self
        view.backgroundColor = .clear
        view.isUserInteractionEnabled = true
        view.addGestureRecognizer(TapGestureRecognizerWithClosure { [weak view] in
            guard let view = view else { return }
            view.didTap?()
        })
        return view
    }
}

extension ScanditDataCaptureLabel: RCTRootViewDelegate {
    func rootViewDidChangeIntrinsicSize(_ rootView: RCTRootView!) {
        guard let view = rootView as? ScanditRootView else { return }
        rootView.bounds.size = rootView.intrinsicContentSize
        guard let (label, field) = trackedLabelViewCache[view] else {
            // Barcode was lost before the view updated its size.
            return
        }
        let viewForLabel = ViewForLabel(view: view, trackingId: label.trackingId, fieldName: field?.name)
        if field != nil {
            labelModule.setViewForFieldOfLabel(viewForFieldOfLabel: viewForLabel, result: NoopFrameworksResult())
        } else {
            labelModule.setViewForCapturedLabel(viewForLabel: viewForLabel, result: NoopFrameworksResult())
        }
    }
}
