/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator
import com.scandit.datacapture.frameworks.label.LabelCaptureModule
import com.scandit.datacapture.reactnative.core.utils.ReactNativeMethodCall
import com.scandit.datacapture.reactnative.core.utils.ReactNativeResult

/**
 * Base implementation for the Scandit Data Capture Label module.
 * Contains all shared business logic used by both old and new architecture modules.
 */
class ScanditDataCaptureLabelModuleBase(
    private val labelCaptureModule: LabelCaptureModule,
    private val serviceLocator: ServiceLocator<FrameworkModule>,
) {
    companion object {
        const val NAME = "ScanditDataCaptureLabel"
        private const val DEFAULTS_KEY = "Defaults"
        private const val LABEL_CAPTURE_KEY = "LabelCapture"
    }

    fun getDefaults(): MutableMap<String, Any> = mutableMapOf(
        DEFAULTS_KEY to mapOf(
            LABEL_CAPTURE_KEY to labelCaptureModule.getDefaults()
        )
    )

    fun onInvalidate() {
        labelCaptureModule.onDestroy()
    }

    fun executeLabel(data: ReadableMap, promise: Promise) {
        val coreModule = serviceLocator.resolve(
            CoreModule::class.java.simpleName
        ) as? CoreModule ?: return run {
            promise.reject("-1", "Unable to retrieve the CoreModule from the locator.")
        }

        val result = coreModule.execute(
            ReactNativeMethodCall(data),
            ReactNativeResult(promise),
            labelCaptureModule
        )

        if (!result) {
            val methodName = data.getString("methodName") ?: "unknown"
            promise.reject(
                "METHOD_NOT_FOUND",
                "Unknown Core method: $methodName"
            )
        }
    }
}
