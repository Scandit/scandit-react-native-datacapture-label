/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.scandit.datacapture.frameworks.core.locator.DefaultServiceLocator
import com.scandit.datacapture.reactnative.core.ScanditReactPackageBase

class ScanditDataCaptureLabelPackage : ScanditReactPackageBase() {
    private val serviceLocator = DefaultServiceLocator.getInstance()

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> {
        // Module sets up its own LabelCaptureModule in init
        return mutableListOf(
            ScanditDataCaptureLabelModule(reactContext, serviceLocator)
        )
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<*, *>> = mutableListOf()

    override fun getModuleClasses(): List<Class<out NativeModule>> =
        listOf(ScanditDataCaptureLabelModule::class.java)
}
