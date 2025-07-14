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
        val anchor = readableMap.getString("anchor")!!
        val labelId = readableMap.getInt("trackingId")
        labelCaptureModule.setAnchorForCapturedLabel(
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
        val offsetJson = readableMap.getString("offsetJson")!!
        val labelId = readableMap.getInt("trackingId")
        labelCaptureModule.setOffsetForCapturedLabel(
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
            offset,
            labelFieldId,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun clearCapturedLabelViews(promise: Promise) {
        labelCaptureModule.clearCapturedLabelViews(ReactNativeResult(promise))
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
        labelCaptureModule.updateBasicOverlay(overlayJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun updateLabelCaptureAdvancedOverlay(readableMap: ReadableMap, promise: Promise) {
        val overlayJson = readableMap.getString("advancedOverlayJson")!!
        labelCaptureModule.updateAdvancedOverlay(overlayJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun updateLabelCaptureSettings(readableMap: ReadableMap, promise: Promise) {
        val modeId = readableMap.getInt(MODE_ID_KEY)
        val settingsJson = readableMap.getString("settingsJson") ?: ""
        labelCaptureModule.applyModeSettings(modeId, settingsJson, ReactNativeResult(promise))
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
