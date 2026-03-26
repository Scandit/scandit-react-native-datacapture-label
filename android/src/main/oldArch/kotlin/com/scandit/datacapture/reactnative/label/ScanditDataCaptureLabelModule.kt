/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator
import com.scandit.datacapture.frameworks.label.LabelCaptureModule
import com.scandit.datacapture.reactnative.core.utils.ReactNativeEventEmitter

@ReactModule(name = ScanditDataCaptureLabelModuleBase.NAME)
class ScanditDataCaptureLabelModule(
    reactContext: ReactApplicationContext,
    serviceLocator: ServiceLocator<FrameworkModule>,
) : ReactContextBaseJavaModule(reactContext) {

    private val moduleBase: ScanditDataCaptureLabelModuleBase

    init {
        // Create emitter with bridge-based RCTDeviceEventEmitter and set up LabelCaptureModule
        val emitter = ReactNativeEventEmitter(reactContext)
        val labelCaptureModule = LabelCaptureModule.create(emitter).also {
            it.onCreate(reactContext)
        }
        moduleBase = ScanditDataCaptureLabelModuleBase(labelCaptureModule, serviceLocator)
    }

    companion object {
        const val NAME = ScanditDataCaptureLabelModuleBase.NAME
    }

    override fun getName(): String = NAME

    override fun getConstants(): MutableMap<String, Any> = moduleBase.getDefaults()

    override fun invalidate() {
        moduleBase.onInvalidate()
        super.invalidate()
    }

    @ReactMethod
    fun executeLabel(data: ReadableMap, promise: Promise) =
        moduleBase.executeLabel(data, promise)

    @ReactMethod
    fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }
}
