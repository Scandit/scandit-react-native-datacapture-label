/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label

import android.view.View
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.scandit.datacapture.frameworks.core.ui.ViewFromJsonResolver
import com.scandit.datacapture.frameworks.label.LabelCaptureModule
import com.scandit.datacapture.reactnative.barcode.tracking.nativeViewFromJson
import com.scandit.datacapture.reactnative.core.utils.ReactNativeResult

class ScanditDataCaptureLabelModule(
    reactContext: ReactApplicationContext,
    private val labelCaptureModule: LabelCaptureModule,
) : ReactContextBaseJavaModule(reactContext) {

    override fun invalidate() {
        labelCaptureModule.onDestroy()
        super.invalidate()
    }

    override fun getName(): String = "ScanditDataCaptureLabel"

    override fun getConstants(): MutableMap<String, Any> = mutableMapOf(
        DEFAULTS_KEY to mapOf<String, Any?>(
            "LabelCapture" to labelCaptureModule.getDefaults()
        )
    )

    @ReactMethod
    fun registerListenerForEvents() {
        labelCaptureModule.addListener()
    }

    @ReactMethod
    fun unregisterListenerForEvents() {
        labelCaptureModule.removeListener()
    }

    @ReactMethod
    fun registerListenerForBasicOverlayEvents() {
        labelCaptureModule.addBasicOverlayListener()
    }

    @ReactMethod
    fun unregisterListenerForBasicOverlayEvents() {
        labelCaptureModule.removeBasicOverlayListener()
    }

    @ReactMethod
    fun registerListenerForAdvancedOverlayEvents() {
        labelCaptureModule.addAdvancedOverlayListener()
    }

    @ReactMethod
    fun unregisterListenerForAdvancedOverlayEvents() {
        labelCaptureModule.removeAdvancedOverlayListener()
    }

    @ReactMethod
    fun finishDidUpdateSessionCallback(enabled: Boolean) {
        labelCaptureModule.finishDidUpdateSession(enabled)
    }

    @ReactMethod
    fun setBrushForLabel(
        brushJson: String?,
        labelId: Int,
        promise: Promise
    ) {
        labelCaptureModule.setBrushForLabel(
            brushJson,
            labelId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setBrushForFieldOfLabel(
        brushJson: String?,
        fieldName: String,
        labelId: Int,
        promise: Promise
    ) {
        labelCaptureModule.setBrushForFieldOfLabel(
            brushJson,
            fieldName,
            labelId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setViewForCapturedLabel(
        viewJson: String?,
        labelId: Int,
        promise: Promise
    ) {
        labelCaptureModule.setViewForCapturedLabel(
            viewJson,
            labelId,
            object : ViewFromJsonResolver {
                override fun getView(viewJson: String): View? {
                    return currentActivity?.let {
                        nativeViewFromJson(it, viewJson)
                    }
                }
            },
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setAnchorForCapturedLabel(
        anchorJson: String,
        labelId: Int,
        promise: Promise
    ) {
        labelCaptureModule.setAnchorForCapturedLabel(
            anchorJson,
            labelId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setOffsetForCapturedLabel(
        offsetJson: String,
        labelId: Int,
        promise: Promise
    ) {
        labelCaptureModule.setOffsetForCapturedLabel(
            offsetJson,
            labelId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun clearCapturedLabelViews(promise: Promise) {
        labelCaptureModule.clearCapturedLabelViews(ReactNativeResult(promise))
    }

    @ReactMethod
    fun setModeEnabledState(enabled: Boolean) {
        labelCaptureModule.setModeEnabled(enabled)
    }

    @ReactMethod
    fun updateLabelCaptureBasicOverlay(overlayJson: String, promise: Promise) {
        labelCaptureModule.updateBasicOverlay(overlayJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun updateLabelCaptureAdvancedOverlay(overlayJson: String, promise: Promise) {
        labelCaptureModule.updateAdvancedOverlay(overlayJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun applyLabelCaptureModeSettings(settingsJson: String, promise: Promise) {
        labelCaptureModule.applyModeSettings(settingsJson, ReactNativeResult(promise))
    }

    companion object {
        private const val DEFAULTS_KEY = "Defaults"
    }
}
