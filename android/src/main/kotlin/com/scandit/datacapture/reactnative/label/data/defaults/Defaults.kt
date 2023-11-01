/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.core.source.CameraSettings
import com.scandit.datacapture.core.ui.style.Brush
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.data.defaults.SerializableBrushDefaults
import com.scandit.datacapture.reactnative.core.data.defaults.SerializableCameraSettingsDefaults
import com.scandit.datacapture.reactnative.core.utils.putData
import com.scandit.datacapture.reactnative.core.utils.writableMap

internal data class SerializableLabelDefaults(
    private val labelCapture: SerializableLabelCaptureDefaults
) : SerializableData {
    override fun toWritableMap(): WritableMap = writableMap {
        putData(FIELD_LABEL_CAPTURE, labelCapture)
    }

    companion object {
        private const val FIELD_LABEL_CAPTURE = "LabelCapture"
    }
}

internal data class SerializableLabelCaptureDefaults(
    private val recommendedCameraSettings: CameraSettings,
    private val basicOverlay: SerializableLabelCaptureBasicOverlayDefaults
) : SerializableData {
    override fun toWritableMap(): WritableMap = writableMap {
        putMap(FIELD_RECOMMENDED_CAMERA_SETTINGS, recommendedCameraSettings.toWritableMap())
        putData(FIELD_LABEL_CAPTURE_BASIC_OVERLAY, basicOverlay)
    }

    companion object {
        private const val FIELD_RECOMMENDED_CAMERA_SETTINGS = "RecommendedCameraSettings"
        private const val FIELD_LABEL_CAPTURE_BASIC_OVERLAY = "LabelCaptureBasicOverlay"
    }
}

internal data class SerializableLabelCaptureBasicOverlayDefaults(
    private val defaultLabelBrush: Brush,
    private val defaultCapturedFieldBrush: Brush,
    private val defaultPredictedFieldBrush: Brush
) : SerializableData {
    override fun toWritableMap(): WritableMap = writableMap {
        putMap(FIELD_DEFAULT_LABEL_BRUSH, defaultLabelBrush.toWritableMap())
        putMap(FIELD_DEFAULT_CAPTURED_FIELD_BRUSH, defaultCapturedFieldBrush.toWritableMap())
        putMap(FIELD_DEFAULT_PREDICTED_FIELD_BRUSH, defaultPredictedFieldBrush.toWritableMap())
    }

    companion object {
        private const val FIELD_DEFAULT_LABEL_BRUSH = "DefaultLabelBrush"
        private const val FIELD_DEFAULT_CAPTURED_FIELD_BRUSH = "DefaultCapturedFieldBrush"
        private const val FIELD_DEFAULT_PREDICTED_FIELD_BRUSH = "DefaultPredictedFieldBrush"
    }
}

internal fun Brush.toWritableMap(): WritableMap = SerializableBrushDefaults(this).toWritableMap()

internal fun CameraSettings.toWritableMap(): WritableMap =
    SerializableCameraSettingsDefaults(this).toWritableMap()
