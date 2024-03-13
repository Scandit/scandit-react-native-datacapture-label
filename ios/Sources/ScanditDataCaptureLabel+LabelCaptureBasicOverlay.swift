/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditLabelCapture

extension ScanditDataCaptureLabel {
    @objc(setBrushForLabel:frameSequenceId:labelId:resolver:rejecter:)
    func setBrushForLabel(brushJSON: String,
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

        guard let brush = Brush(jsonString: brushJSON) else {
            let error = ScanditDataCaptureLabelError.brushInvalid
            reject(String(error.code), error.message, error)
            return
        }

        guard let overlay = basicOverlay else {
            let error = ScanditDataCaptureLabelError.basicOverlayNil
            reject(String(error.code), error.message, error)
            return
        }

        overlay.setBrush(brush, for: label)
        resolve(nil)
    }

    @objc(setBrushForFieldOfLabel:frameSequenceId:fieldName:labelId:resolver:rejecter:)
    // swiftlint:disable:next function_parameter_count
    func setBrushForLabel(brushJSON: String,
                          frameSequenceId: Int,
                          fieldName: String,
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

        guard let field = label.fields.first(where: {$0.name == fieldName}) else {
            let error = ScanditDataCaptureLabelError.fieldNotFound
            reject(String(error.code), error.message, error)
            return
        }

        guard let brush = Brush(jsonString: brushJSON) else {
            let error = ScanditDataCaptureLabelError.brushInvalid
            reject(String(error.code), error.message, error)
            return
        }

        guard let overlay = basicOverlay else {
            let error = ScanditDataCaptureLabelError.basicOverlayNil
            reject(String(error.code), error.message, error)
            return
        }

        overlay.setBrush(brush, for: field, of: label)
        resolve(nil)
    }
    
    @objc(updateLabelCaptureBasicOverlay:resolve:reject:)
    func updateLabelCaptureBasicOverlay(overlayJson: String,
                                        resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        do {
            removeCurrentBasicaOverlay()
            try dataCaptureView(addOverlay: overlayJson)
            resolve(nil)
        } catch {
            reject("Something wrong happened while updating the label capture basic overlay", error.localizedDescription, error)
        }
    }
}
