/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2023- Scandit AG. All rights reserved.
*/

import Foundation
import React
import ScanditLabelCapture
import ScanditDataCaptureCore

extension ScanditDataCaptureLabel {
    @objc(setViewForCapturedLabel:frameSequenceId:labelId:resolver:rejecter:)
    func setViewForCapturedLabel(viewJSON: String?,
                          frameSequenceId: Int,
                          labelId: Int,
                          resolve: RCTPromiseResolveBlock,
                          reject: RCTPromiseRejectBlock) {
        guard let lastFrameSequenceId = lastFrameSequenceId,
            lastFrameSequenceId == frameSequenceId else {
                let error = ScanditDataCaptureLabelError.invalidSequenceId
                reject(String(error.code), error.message, error)
                return
        }

        guard let lastCapturedLabels = lastCapturedLabels,
            let label = lastCapturedLabels.first(where: {$0.trackingId == labelId}) else {
                let error = ScanditDataCaptureLabelError.labelNotFound
                reject(String(error.code), error.message, error)
                return
        }
        
        guard let advancedOverlay = advancedOverlay else {
            let error = ScanditDataCaptureLabelError.advancedOverlayNil
            reject(String(error.code), error.message, error)
            return
        }
        
        guard let viewJSON = viewJSON else {
            advancedOverlay.setView(nil, for: label)
            resolve(nil)
            return
        }
        
        guard
            let configuration = try? JSONSerialization.jsonObject(with: viewJSON.data(using: .utf8)!,
                                                                  options: []) as? [String: Any],
            let jsView = try? JSView(with: configuration) else {
                let error = ScanditDataCaptureLabelError.viewInvalid
                reject(String(error.code), error.message, error)
                return
        }

        DispatchQueue.main.async {
            let view = self.rootViewWith(jsView: jsView, label: label)
            advancedOverlay.setView(view, for: label)
        }
    }

    @objc(setAnchorForCapturedLabel:frameSequenceId:labelId:resolver:rejecter:)
    // swiftlint:disable:next function_parameter_count
    func setAnchorForCapturedLabel(anchorJSON: String,
                          frameSequenceId: Int,
                          labelId: Int,
                          resolve: RCTPromiseResolveBlock,
                          reject: RCTPromiseRejectBlock) {
        guard let lastFrameSequenceId = lastFrameSequenceId,
            lastFrameSequenceId == frameSequenceId else {
                let error = ScanditDataCaptureLabelError.invalidSequenceId
                reject(String(error.code), error.message, error)
                return
        }

        guard let lastCapturedLabels = lastCapturedLabels,
            let label = lastCapturedLabels.first(where: {$0.trackingId == labelId}) else {
                let error = ScanditDataCaptureLabelError.labelNotFound
                reject(String(error.code), error.message, error)
                return
        }

        guard let advancedOverlay = advancedOverlay else {
            let error = ScanditDataCaptureLabelError.advancedOverlayNil
            reject(String(error.code), error.message, error)
            return
        }

        var anchor = Anchor.center

        guard SDCAnchorFromJSONString(anchorJSON, &anchor) else {
            let error = ScanditDataCaptureLabelError.deserializationError
            reject(String(error.code), error.message, error)
            return
        }

        advancedOverlay.setAnchor(anchor, for: label)
    }
    
    @objc(setOffsetForCapturedLabel:frameSequenceId:labelId:resolver:rejecter:)
    // swiftlint:disable:next function_parameter_count
    func setOffsetForCapturedLabel(offsetJSON: String,
                          frameSequenceId: Int,
                          labelId: Int,
                          resolve: RCTPromiseResolveBlock,
                          reject: RCTPromiseRejectBlock) {
        guard let lastFrameSequenceId = lastFrameSequenceId,
            lastFrameSequenceId == frameSequenceId else {
                let error = ScanditDataCaptureLabelError.invalidSequenceId
                reject(String(error.code), error.message, error)
                return
        }

        guard let lastCapturedLabels = lastCapturedLabels,
            let label = lastCapturedLabels.first(where: {$0.trackingId == labelId}) else {
                let error = ScanditDataCaptureLabelError.labelNotFound
                reject(String(error.code), error.message, error)
                return
        }

        guard let advancedOverlay = advancedOverlay else {
            let error = ScanditDataCaptureLabelError.advancedOverlayNil
            reject(String(error.code), error.message, error)
            return
        }

        var offset = PointWithUnit.zero

        guard SDCPointWithUnitFromJSONString(offsetJSON, &offset) else {
            let error = ScanditDataCaptureLabelError.deserializationError
            reject(String(error.code), error.message, error)
            self.offset[labelId] = nil
            return
        }

        self.offset[labelId] = offset
        advancedOverlay.setOffset(offset, for: label)
    }
    
    @objc(clearCapturedLabelViews:rejecter:)
    // swiftlint:disable:next function_parameter_count
    func clearCapturedLabelViews(resolve: RCTPromiseResolveBlock,
                          reject: RCTPromiseRejectBlock) {
        guard let advancedOverlay = advancedOverlay else {
            let error = ScanditDataCaptureLabelError.advancedOverlayNil
            reject(String(error.code), error.message, error)
            return
        }

        advancedOverlay.clearTrackedCapturedLabelViews()
    }
}

extension ScanditDataCaptureLabel: RCTRootViewDelegate {
    func rootViewWith(jsView: JSView, label: CapturedLabel) -> RCTRootView {
        // To support self sizing js views we need to leverage the RCTRootViewDelegate
        // see https://reactnative.dev/docs/communication-ios
        let view = RCTRootView(bridge: bridge,
                               moduleName: jsView.moduleName,
                               initialProperties: jsView.initialProperties)
        view.sizeFlexibility = .widthAndHeight
        view.delegate = self
        view.backgroundColor = .clear
        capturedLabelViewCache[view] = label
        return view
    }

    func rootViewDidChangeIntrinsicSize(_ rootView: RCTRootView!) {
        rootView.bounds.size = rootView.intrinsicContentSize
        guard let capturedLabel = capturedLabelViewCache[rootView] else {
            // Label was lost before the view updated its size.
            return
        }
        advancedOverlay?.setView(rootView, for: capturedLabel)
    }
}
