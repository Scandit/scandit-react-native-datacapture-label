/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label

import com.facebook.fbreact.specs.NativeScanditDataCaptureLabelSpec
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
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
) : NativeScanditDataCaptureLabelSpec(reactContext) {

    private val moduleBase: ScanditDataCaptureLabelModuleBase

    init {
        // Create emitter with JSI-based emit handler and set up LabelCaptureModule
        val emitter = ReactNativeEventEmitter { payload ->
            emitOnScanditEvent(payload)
        }
        val labelCaptureModule = LabelCaptureModule.create(emitter).also {
            it.onCreate(reactContext)
        }
        moduleBase = ScanditDataCaptureLabelModuleBase(labelCaptureModule, serviceLocator)
    }

    companion object {
        const val NAME = ScanditDataCaptureLabelModuleBase.NAME
    }

    override fun getName(): String = NAME

    override fun getTypedExportedConstants(): MutableMap<String, Any> = moduleBase.getDefaults()

    override fun invalidate() {
        moduleBase.onInvalidate()
        super.invalidate()
    }

    override fun executeLabel(data: ReadableMap, promise: Promise) =
        moduleBase.executeLabel(data, promise)
}
