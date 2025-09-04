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
import com.facebook.react.bridge.ReadableMap
import com.scandit.datacapture.frameworks.core.extensions.DATA_CAPTURE_VIEW_ID_KEY
import com.scandit.datacapture.frameworks.core.extensions.MODE_ID_KEY
import com.scandit.datacapture.frameworks.core.ui.ViewFromJsonResolver
import com.scandit.datacapture.frameworks.label.LabelCaptureModule
import com.scandit.datacapture.reactnative.barcode.batch.nativeViewFromJson
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
    fun registerListenerForEvents(readableMap: ReadableMap) {
        labelCaptureModule.addListener(readableMap.getInt(MODE_ID_KEY))
    }

    @ReactMethod
    fun unregisterListenerForEvents(readableMap: ReadableMap) {
        labelCaptureModule.removeListener(readableMap.getInt(MODE_ID_KEY))
    }

    @ReactMethod
    fun registerListenerForBasicOverlayEvents(readableMap: ReadableMap) {
        labelCaptureModule.addBasicOverlayListener(readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY))
    }

    @ReactMethod
    fun unregisterListenerForBasicOverlayEvents(readableMap: ReadableMap) {
        labelCaptureModule.removeBasicOverlayListener(readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY))
    }

    @ReactMethod
    fun registerListenerForAdvancedOverlayEvents(readableMap: ReadableMap) {
        labelCaptureModule.addAdvancedOverlayListener(readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY))
    }

    @ReactMethod
    fun unregisterListenerForAdvancedOverlayEvents(readableMap: ReadableMap) {
        labelCaptureModule.removeAdvancedOverlayListener(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY)
        )
    }

    @ReactMethod
    fun finishDidUpdateSessionCallback(readableMap: ReadableMap) {
        val enabled = readableMap.getBoolean("isEnabled")
        labelCaptureModule.finishDidUpdateSession(enabled)
    }

    @ReactMethod
    fun setBrushForLabel(
        readableMap: ReadableMap,
        promise: Promise
    ) {
        val brushJson = readableMap.getString("brushJson")
        val labelId = readableMap.getInt("trackingId")
        labelCaptureModule.setBrushForLabel(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            brushJson,
            labelId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setBrushForFieldOfLabel(
        readableMap: ReadableMap,
        promise: Promise
    ) {
        val brushJson = readableMap.getString("brushJson")
        val fieldName = readableMap.getString("fieldName") ?: ""
        val labelId = readableMap.getInt("trackingId")

        labelCaptureModule.setBrushForFieldOfLabel(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            brushJson,
            fieldName,
            labelId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setViewForCapturedLabel(
        readableMap: ReadableMap,
        promise: Promise
    ) {
        val viewJson = readableMap.getString("jsonView")
        val labelId = readableMap.getInt("trackingId")
        labelCaptureModule.setViewForCapturedLabel(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
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
    fun setViewForCapturedLabelField(
        readableMap: ReadableMap,
        promise: Promise
    ) {
        labelCaptureModule.setViewForLabelField(
            readableMap.toHashMap(),
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
        readableMap: ReadableMap,
        promise: Promise
    ) {
        val anchor = readableMap.getString("anchor") ?: return run {
            promise.reject(IllegalArgumentException("anchor"))
        }
        val labelId = readableMap.getInt("trackingId")
        labelCaptureModule.setAnchorForCapturedLabel(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            anchor,
            labelId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setAnchorForCapturedLabelField(
        readableMap: ReadableMap,
        promise: Promise
    ) {
        val anchor = readableMap.getString("anchor") ?: run {
            promise.reject(IllegalArgumentException("anchor"))
            return
        }
        val labelFieldId = readableMap.getString("identifier") ?: run {
            promise.reject(IllegalArgumentException("identifier"))
            return
        }
        labelCaptureModule.setAnchorForLabelField(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            anchor,
            labelFieldId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setOffsetForCapturedLabel(
        readableMap: ReadableMap,
        promise: Promise
    ) {
        val offsetJson = readableMap.getString("offsetJson") ?: return run {
            promise.reject(IllegalArgumentException("offsetJson"))
        }
        val labelId = readableMap.getInt("trackingId")
        labelCaptureModule.setOffsetForCapturedLabel(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            offsetJson,
            labelId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setOffsetForCapturedLabelField(
        readableMap: ReadableMap,
        promise: Promise
    ) {
        val offset = readableMap.getString("offset") ?: run {
            promise.reject(IllegalArgumentException("offset"))
            return
        }
        val labelFieldId = readableMap.getString("identifier") ?: run {
            promise.reject(IllegalArgumentException("identifier"))
            return
        }
        labelCaptureModule.setOffsetForLabelField(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            offset,
            labelFieldId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun clearCapturedLabelViews(readableMap: ReadableMap, promise: Promise) {
        labelCaptureModule.clearCapturedLabelViews(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun setModeEnabledState(readableMap: ReadableMap) {
        val modeId = readableMap.getInt(MODE_ID_KEY)
        val enabled = readableMap.getBoolean("isEnabled")
        labelCaptureModule.setModeEnabled(modeId, enabled)
    }

    @ReactMethod
    fun updateLabelCaptureBasicOverlay(readableMap: ReadableMap, promise: Promise) {
        val overlayJson = readableMap.getString("basicOverlayJson") ?: ""
        labelCaptureModule.updateBasicOverlay(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            overlayJson,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun updateLabelCaptureAdvancedOverlay(readableMap: ReadableMap, promise: Promise) {
        val overlayJson = readableMap.getString("advancedOverlayJson") ?: return run {
            promise.reject(IllegalArgumentException("advancedOverlayJson"))
        }
        labelCaptureModule.updateAdvancedOverlay(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            overlayJson,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun updateLabelCaptureSettings(readableMap: ReadableMap, promise: Promise) {
        val modeId = readableMap.getInt(MODE_ID_KEY)
        val settingsJson = readableMap.getString("settingsJson") ?: ""
        labelCaptureModule.applyModeSettings(modeId, settingsJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun registerListenerForValidationFlowEvents(readableMap: ReadableMap) {
        labelCaptureModule.addValidationFlowOverlayListener(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY)
        )
    }

    @ReactMethod
    fun unregisterListenerForValidationFlowEvents(readableMap: ReadableMap) {
        labelCaptureModule.removeValidationFlowOverlayListener(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY)
        )
    }

    @ReactMethod
    fun updateLabelCaptureOverlay(readableMap: ReadableMap, promise: Promise) {
        val overlayJson = readableMap.getString("overlayJson") ?: ""
        labelCaptureModule.updateValidationFlowOverlay(
            readableMap.getInt(DATA_CAPTURE_VIEW_ID_KEY),
            overlayJson,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    companion object {
        private const val DEFAULTS_KEY = "Defaults"
    }
}
