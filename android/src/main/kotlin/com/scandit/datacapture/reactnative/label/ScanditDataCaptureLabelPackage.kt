/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.scandit.datacapture.frameworks.label.LabelCaptureModule
import com.scandit.datacapture.reactnative.core.utils.ReactNativeEventEmitter

class ScanditDataCaptureLabelPackage : ReactPackage {
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> = mutableListOf(
        ScanditDataCaptureLabelModule(
            reactContext,
            getLabelCaptureModule(reactContext)
        )
    )

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<*, *>> = mutableListOf()

    private fun getLabelCaptureModule(reactContext: ReactApplicationContext): LabelCaptureModule {
        val emitter = ReactNativeEventEmitter(reactContext)
        return LabelCaptureModule(emitter).also {
            it.onCreate(reactContext)
        }
    }
}
