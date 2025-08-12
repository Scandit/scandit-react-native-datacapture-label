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
    
    var labelModule: LabelModule!
    
    var trackedLabelViewCache: [ScanditRootView: TrackedLabelViewData] = [:]
    
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
        FrameworksLabelCaptureEvent.allCases.map { $0.rawValue } + FrameworksLabelCaptureValidationFlowEvents.allCases.map{ $0.rawValue }
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
        let modeId = data["modeId"] as? Int ?? -1
        if let enabled = data["isEnabled"] as? Bool {
            labelModule.setModeEnabled(modeId: modeId, enabled: enabled)
        }
    }
    
    @objc(setBrushForFieldOfLabel:resolver:rejecter:)
    func setBrushForFieldOfLabel(_ data: [String: Any],
                                 resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        guard let brushJson = data["brushJson"] as? String,
              let labelId = data["trackingId"] as? Int,
              let fieldName = data["fieldName"] as? String,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "One or more of the fields required for setBrushForFieldOfLabel not set", nil)
            return
        }
        let brushForFieldOfLabel = BrushForLabelField(dataCaptureViewId: dataCaptureViewId,
                                                      brushJson: brushJson,
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
              let labelId = data["trackingId"] as? Int,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "One or more of the fields required for setBrushForLabel not set", nil)
            return
        }
        
        let brushForLabel = BrushForLabelField(dataCaptureViewId: dataCaptureViewId,
                                               brushJson: brushJson,
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
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "dataCaptureViewId not found", nil)
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
                    trackedLabelViewCache[rootView] = TrackedLabelViewData(capturedLabel: label, dataCaptureViewId: dataCaptureViewId)
                    let viewForLabel = ViewForLabel(dataCaptureViewId: dataCaptureViewId,
                                                    view: rootView,
                                                    trackingId: label.trackingId)
                    labelModule.setViewForCapturedLabel(viewForLabel: viewForLabel, result: result)
                }
                return
            }
        } catch {
            result.reject(error: error)
            return
        }
        let viewForLabel = ViewForLabel(dataCaptureViewId: dataCaptureViewId,
                                        view: nil,
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
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "dataCaptureViewId not found", nil)
            return
        }
        let result = ReactNativeResult.create(resolve, reject)
        let viewJson = data["view"] as? String
        
        do {
            guard let labelAndField = labelModule.labelAndField(for: labelFieldIdentifier) else {
                result.success()
                return
            }
            
            if let viewJson = viewJson {
                let config = try JSONSerialization.jsonObject(with: viewJson.data(using: .utf8)!,
                                                              options: []) as! [String: Any]
                
                let jsView = try JSView(with: config)
                
                dispatchMain {
                    let rootView = self.rootViewWith(jsView: jsView)
                    self.trackedLabelViewCache[rootView] = TrackedLabelViewData(capturedLabel: labelAndField.0, labelField: labelAndField.1, dataCaptureViewId: dataCaptureViewId)
                    self.labelModule.setViewForCapturedLabelField(
                        dataCaptureViewId,
                        for: labelAndField.0,
                        and: labelAndField.1,
                        view: rootView,
                        result: result
                    )
                }
            } else {
                labelModule.setViewForCapturedLabelField(
                    dataCaptureViewId,
                    for: labelAndField.0,
                    and: labelAndField.1,
                    view: nil,
                    result: result
                )
            }
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
              let labelId = data["trackingId"] as? Int,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "One or more required fields are missing or invalid", nil)
            return
        }
        
        let anchorForFieldOfLabel = AnchorForLabel(dataCaptureViewId: dataCaptureViewId,
                                                   anchorString: anchor,
                                                   trackingId: labelId)
        
        labelModule.setAnchorForCapturedLabel(anchorForLabel: anchorForFieldOfLabel,
                                              result: .create(resolve, reject))
    }
    
    @objc(setAnchorForCapturedLabelField:resolver:rejecter:)
    func setAnchorForCapturedLabelField(_ data: [String: Any],
                                        resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        guard let anchor = data["anchor"] as? String,
              let labelFieldId = data["identifier"] as? String,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "One or more required fields are missing or invalid", nil)
            return
        }
        
        let components = labelFieldId.components(separatedBy: String(FrameworksLabelCaptureSession.separator))
        let trackingId = Int(components[0])!
        let fieldName = components[1]
        let anchorForLabelField = AnchorForLabel(
            dataCaptureViewId: dataCaptureViewId,
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
              let labelId = data["trackingId"] as? Int,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "One or more required fields are missing or invalid", nil)
            return
        }
        
        let offsetForCapturedLabel = OffsetForLabel(dataCaptureViewId:  dataCaptureViewId,
                                                    offsetJson: offsetJson,
                                                    trackingId: labelId)
        
        labelModule.setOffsetForCapturedLabel(offsetForLabel: offsetForCapturedLabel,
                                              result: .create(resolve, reject))
    }
    
    @objc(setOffsetForCapturedLabelField:resolver:rejecter:)
    func setOffsetForCapturedLabelField(_ data: [String: Any],
                                        resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        guard let offsetJson = data["offset"] as? String,
              let fieldLabelId = data["identifier"] as? String,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "One or more required fields are missing or invalid", nil)
            return
        }
        
        let components = fieldLabelId.components(separatedBy: String(FrameworksLabelCaptureSession.separator))
        let trackingId = Int(components[0])!
        let fieldName = components[1]
        let offsetForLabelField = OffsetForLabel(
            dataCaptureViewId: dataCaptureViewId,
            offsetJson: offsetJson,
            trackingId: trackingId,
            fieldName: fieldName
        )
        
        labelModule.setOffsetForCapturedLabel(offsetForLabel: offsetForLabelField,
                                              result: .create(resolve, reject))
    }
    
    @objc(clearCapturedLabelViews:resolver:rejecter:)
    func clearCapturedLabelViews(_ data: [String: Any],
                                 resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("error", "dataCaptureViewId field is missing or invalid", nil)
            return
        }
        
        labelModule.clearTrackedCapturedLabelViews(dataCaptureViewId)
        dispatchMain {
            self.trackedLabelViewCache.removeAll()
            resolve(nil)
        }
    }
    
    @objc func registerListenerForEvents(_ data: [String: Any]) {
        labelModule.addListener(data["modeId"] as? Int ?? -1)
    }
    
    @objc func unregisterListenerForEvents(_ data: [String: Any]) {
        labelModule.removeListener(data["modeId"] as? Int ?? -1)
    }
    
    @objc func registerListenerForBasicOverlayEvents(_ data: [String: Any]) {
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            return
        }
        labelModule.addBasicOverlayListener(dataCaptureViewId)
    }
    
    @objc func unregisterListenerForBasicOverlayEvents(_ data: [String: Any]) {
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            return
        }
        labelModule.removeBasicOverlayListener(dataCaptureViewId)
    }
    
    @objc func registerListenerForAdvancedOverlayEvents(_ data: [String: Any]) {
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            return
        }
        labelModule.addAdvancedOverlayListener(dataCaptureViewId)
    }
    
    @objc func unregisterListenerForAdvancedOverlayEvents(_ data: [String: Any]) {
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            return
        }
        labelModule.removeAdvancedOverlayListener(dataCaptureViewId)
    }
    
    @objc func registerListenerForValidationFlowEvents(_ data: [String: Any]) {
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            return
        }
        labelModule.addValidationFlowOverlayListener(dataCaptureViewId)
    }
    
    @objc func unregisterListenerForValidationFlowEvents(_ data: [String: Any]) {
        guard let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            return
        }
        labelModule.removeValidationFlowOverlayListener(dataCaptureViewId)
    }
    
    @objc(updateLabelCaptureBasicOverlay:resolve:reject:)
    func updateLabelCaptureBasicOverlay(_ data: [String: Any],
                                        resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        guard let overlayJson = data["basicOverlayJson"] as? String,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("-1", "One or more missing fields", nil)
            return
        }
        
        labelModule.updateBasicOverlay(dataCaptureViewId, overlayJson: overlayJson, result: .create(resolve, reject))
    }
    
    @objc(updateLabelCaptureAdvancedOverlay:resolve:reject:)
    func updateLabelCaptureAdvancedOverlay(_ data: [String: Any],
                                           resolve: @escaping RCTPromiseResolveBlock,
                                           reject: @escaping RCTPromiseRejectBlock) {
        guard let overlayJson = data["advancedOverlayJson"] as? String,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("-1", "One or more missing fields", nil)
            return
        }
        
        labelModule.updateAdvancedOverlay(dataCaptureViewId,
                                          overlayJson: overlayJson,
                                          result: .create(resolve, reject))
    }
    
    @objc(updateLabelCaptureValidationFlowOverlay:resolve:reject:)
    func updateLabelCaptureValidationFlowOverlay(_ data: [String: Any],
                                                 resolve: @escaping RCTPromiseResolveBlock,
                                                 reject: @escaping RCTPromiseRejectBlock) {
        guard let overlayJson = data["overlayJson"] as? String,
              let dataCaptureViewId = data["dataCaptureViewId"] as? Int else {
            reject("-1", "One or more missing fields", nil)
            return
        }
        
        labelModule.updateValidationFlowOverlay(dataCaptureViewId,
                                                overlayJson: overlayJson,
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
        
        let modeId = data["modeId"] as? Int ?? -1
        
        labelModule.applyModeSettings(modeId: modeId, modeSettingsJson: settingsJson,
                                      result: .create(resolve, reject))
    }
}
