/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label

import android.view.View
import androidx.annotation.UiThread
import androidx.annotation.VisibleForTesting
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.scandit.datacapture.core.capture.DataCaptureContext
import com.scandit.datacapture.core.capture.DataCaptureContextListener
import com.scandit.datacapture.core.capture.DataCaptureMode
import com.scandit.datacapture.core.common.geometry.Anchor
import com.scandit.datacapture.core.common.geometry.AnchorDeserializer
import com.scandit.datacapture.core.common.geometry.PointWithUnit
import com.scandit.datacapture.core.common.geometry.PointWithUnitDeserializer
import com.scandit.datacapture.core.data.FrameData
import com.scandit.datacapture.core.json.JsonValue
import com.scandit.datacapture.core.ui.style.Brush
import com.scandit.datacapture.core.ui.style.BrushDeserializer
import com.scandit.datacapture.frameworks.core.deserialization.DeserializationLifecycleObserver
import com.scandit.datacapture.frameworks.core.deserialization.Deserializers
import com.scandit.datacapture.label.capture.LabelCapture
import com.scandit.datacapture.label.capture.LabelCaptureListener
import com.scandit.datacapture.label.capture.LabelCaptureSession
import com.scandit.datacapture.label.capture.serialization.LabelCaptureDeserializer
import com.scandit.datacapture.label.capture.serialization.LabelCaptureDeserializerListener
import com.scandit.datacapture.label.data.CapturedLabel
import com.scandit.datacapture.label.data.LabelField
import com.scandit.datacapture.label.ui.overlay.LabelCaptureAdvancedOverlay
import com.scandit.datacapture.label.ui.overlay.LabelCaptureAdvancedOverlayListener
import com.scandit.datacapture.label.ui.overlay.LabelCaptureBasicOverlay
import com.scandit.datacapture.label.ui.overlay.LabelCaptureBasicOverlayListener
import com.scandit.datacapture.reactnative.barcode.tracking.nativeViewFromJson
import com.scandit.datacapture.reactnative.core.utils.*
import com.scandit.datacapture.reactnative.label.data.defaults.SerializableLabelCaptureBasicOverlayDefaults
import com.scandit.datacapture.reactnative.label.data.defaults.SerializableLabelCaptureDefaults
import com.scandit.datacapture.reactnative.label.data.defaults.SerializableLabelDefaults
import java.util.concurrent.atomic.AtomicBoolean

class ScanditDataCaptureLabelModule(
    private val reactContext: ReactApplicationContext,
    @get:VisibleForTesting val labelCaptureDeserializer: LabelCaptureDeserializer =
        LabelCaptureDeserializer(),
    private val eventEmitter: RCTDeviceEventEmitter = LazyEventEmitter(reactContext),
    sessionProvider: (() -> LabelCaptureSession?)? = null
) : ReactContextBaseJavaModule(reactContext),
    DeserializationLifecycleObserver.Observer,
    DataCaptureContextListener,
    LabelCaptureDeserializerListener,
    LabelCaptureListener,
    LabelCaptureBasicOverlayListener,
    LabelCaptureAdvancedOverlayListener {

    companion object {
        private const val DEFAULTS_KEY = "Defaults"

        private val DEFAULTS: SerializableLabelDefaults by lazy {
            SerializableLabelDefaults(
                SerializableLabelCaptureDefaults(
                    LabelCapture.createRecommendedCameraSettings(),
                    SerializableLabelCaptureBasicOverlayDefaults(
                        defaultLabelBrush =
                        LabelCaptureBasicOverlay.defaultLabelBrush(),
                        defaultCapturedFieldBrush =
                        LabelCaptureBasicOverlay.defaultCapturedFieldBrush(),
                        defaultPredictedFieldBrush =
                        LabelCaptureBasicOverlay.defaultPredictedFieldBrush()
                    )
                )
            )
        }

        private const val ON_SESSION_UPDATED_EVENT_NAME = "labelCaptureListener-didUpdateSession"
        private const val BRUSH_FOR_LABEL_EVENT_NAME =
            "labelCaptureBasicOverlayListener-brushForLabel"
        private const val BRUSH_FOR_FIELD_OF_LABEL_EVENT_NAME =
            "labelCaptureBasicOverlayListener-brushForFieldOfLabel"
        private const val ON_LABEL_TAPPED_EVENT_NAME =
            "labelCaptureBasicOverlayListener-didTapLabel"

        private const val VIEW_FOR_LABEL_EVENT_NAME =
            "labelCaptureAdvancedOverlayListener-viewForLabel"
        private const val ANCHOR_FOR_LABEL_EVENT_NAME =
            "labelCaptureAdvancedOverlayListener-anchorForLabel"
        private const val OFFSET_FOR_LABEL_EVENT_NAME =
            "labelCaptureAdvancedOverlayListener-offsetForLabel"

        private const val FIELD_SESSION = "session"
        private const val FIELD_LABEL = "label"
        private const val FIELD_FIELD = "field"

        private val ERROR_INVALID_SEQUENCE_ID =
            Error(1, "The sequence id does not match the current sequence id.")
        private val ERROR_LABEL_NOT_FOUND = Error(2, "Label not found.")
        private val ERROR_FIELD_NOT_FOUND = Error(3, "Field not found.")
        private val ERROR_NULL_ADVANCED_OVERLAY =
            Error(4, "Advanced overlay is null.")
        private val ERROR_ANCHOR_DESERIALIZATION_FAILED =
            Error(5, "Anchor deserialization for advanced overlays failed.")
    }

    private val onSessionUpdated =
        EventWithResult<Boolean>(ON_SESSION_UPDATED_EVENT_NAME, eventEmitter)
    private val brushForLabel =
        EventWithResult<Brush?>(BRUSH_FOR_LABEL_EVENT_NAME, eventEmitter)
    private val brushForFieldOfLabel =
        EventWithResult<Brush?>(BRUSH_FOR_FIELD_OF_LABEL_EVENT_NAME, eventEmitter)

    private val viewForLabel =
        EventWithResult<String?>(VIEW_FOR_LABEL_EVENT_NAME, eventEmitter)
    private val anchorForLabel =
        EventWithResult<Anchor>(ANCHOR_FOR_LABEL_EVENT_NAME, eventEmitter)
    private val offsetForLabel =
        EventWithResult<PointWithUnit>(OFFSET_FOR_LABEL_EVENT_NAME, eventEmitter)

    private val modeLock = Object()

    private var lastSession: LabelCaptureSession? = null
    private val sessionProvider = sessionProvider ?: { lastSession }

    private var hasNativeListeners: AtomicBoolean = AtomicBoolean(false)
    private var hasNativeBasicOverlayListeners: AtomicBoolean = AtomicBoolean(false)
    private var hasNativeAdvancedOverlayListeners: AtomicBoolean = AtomicBoolean(false)

    private fun setHasNativeListeners(hasListeners: Boolean) {
        if (hasNativeListeners.getAndSet(hasListeners) && !hasListeners) {
            onSessionUpdated.onCancel()
        }
    }

    private fun setHasNativeBasicOverlayListeners(hasListeners: Boolean) {
        if (hasNativeBasicOverlayListeners.getAndSet(hasListeners) && !hasListeners) {
            brushForFieldOfLabel.onCancel()
            brushForLabel.onCancel()
        }
    }

    private fun setHasNativeAdvancedOverlayListeners(hasListeners: Boolean) {
        if (hasNativeAdvancedOverlayListeners.getAndSet(hasListeners) && !hasListeners) {
            viewForLabel.onCancel()
            anchorForLabel.onCancel()
            offsetForLabel.onCancel()
        }
    }

    private var dataCaptureContext: DataCaptureContext? = null
        private set(value) {
            field?.removeListener(this)
            field = value?.also { it.addListener(this) }
        }

    @get:VisibleForTesting
    var labelCapture: LabelCapture? = null
        private set(value) {
            synchronized(modeLock) {
                if (value != field) {
                    lastSession = null

                    field?.removeListener(this)
                    field = value?.also { it.addListener(this) }
                }
            }
        }

    @get:VisibleForTesting
    var session: LabelCaptureSession? = null
        get() = sessionProvider()
        private set

    @get:VisibleForTesting
    var labelCaptureBasicOverlay: LabelCaptureBasicOverlay? = null
        private set(value) {
            field?.listener = null
            field = value?.also { it.listener = this }
        }

    @get:VisibleForTesting
    var labelCaptureAdvancedOverlay: LabelCaptureAdvancedOverlay? = null
        private set(value) {
            field?.listener = null
            field = value?.also { it.listener = this }
        }

    init {
        labelCaptureDeserializer.listener = this
        Deserializers.Factory.addModeDeserializer(labelCaptureDeserializer)

        DeserializationLifecycleObserver.attach(this)
    }

    override fun invalidate() {
        onDataCaptureContextDisposed()

        labelCaptureDeserializer.listener = null
        Deserializers.Factory.removeModeDeserializer(labelCaptureDeserializer)

        DeserializationLifecycleObserver.detach(this)
        super.invalidate()
    }

    override fun getName(): String = "ScanditDataCaptureLabel"

    override fun getConstants(): MutableMap<String, Any> = mutableMapOf(
        DEFAULTS_KEY to DEFAULTS.toWritableMap()
    )

    override fun onSessionUpdated(
        mode: LabelCapture,
        session: LabelCaptureSession,
        data: FrameData
    ) {
        synchronized(modeLock) {
            if (lastSession == null && labelCapture == mode) {
                lastSession = session
            }
        }

        val params = writableMap {
            putString(FIELD_SESSION, session.toJson())
        }

        if (!hasNativeListeners.get()) return
        val enabled = onSessionUpdated.emitForResult(params, mode.isEnabled)
        mode.isEnabled = enabled
    }

    @ReactMethod
    fun registerListenerForEvents() {
        setHasNativeListeners(true)
    }

    @ReactMethod
    fun unregisterListenerForEvents() {
        setHasNativeListeners(false)
    }

    @ReactMethod
    fun registerListenerForBasicOverlayEvents() {
        setHasNativeBasicOverlayListeners(true)
    }

    @ReactMethod
    fun unregisterListenerForBasicOverlayEvents() {
        setHasNativeBasicOverlayListeners(false)
    }

    @ReactMethod
    fun registerListenerForAdvancedOverlayEvents() {
        setHasNativeAdvancedOverlayListeners(true)
    }

    @ReactMethod
    fun unregisterListenerForAdvancedOverlayEvents() {
        setHasNativeAdvancedOverlayListeners(false)
    }

    @ReactMethod
    fun finishDidUpdateSessionCallback(enabled: Boolean) {
        if (!hasNativeListeners.get()) return
        onSessionUpdated.onResult(enabled)
    }

    override fun brushForField(
        overlay: LabelCaptureBasicOverlay,
        field: LabelField,
        label: CapturedLabel
    ): Brush? {
        val params = writableMap {
            putString(FIELD_FIELD, field.toJson())
            putString(FIELD_LABEL, label.toJson())
        }

        if (!hasNativeBasicOverlayListeners.get()) return null
        return brushForFieldOfLabel.emitForResult(params, timeoutResult = null)
    }

    @ReactMethod
    fun finishBrushForFieldOfLabelCallback(brushJson: String?) {
        brushForFieldOfLabel.onResult(
            if (brushJson != null) BrushDeserializer.fromJson(brushJson) else null
        )
    }

    override fun brushForLabel(overlay: LabelCaptureBasicOverlay, label: CapturedLabel): Brush? {
        val params = writableMap {
            putString(FIELD_LABEL, label.toJson())
        }

        if (!hasNativeBasicOverlayListeners.get()) return null
        return brushForLabel.emitForResult(params, timeoutResult = null)
    }

    override fun onLabelTapped(overlay: LabelCaptureBasicOverlay, label: CapturedLabel) {
        val params = writableMap {
            putString(FIELD_LABEL, label.toJson())
        }

        if (!hasNativeBasicOverlayListeners.get()) return
        eventEmitter.emit(ON_LABEL_TAPPED_EVENT_NAME, params)
    }

    @ReactMethod
    fun finishBrushForLabelCallback(brushJson: String?) {
        brushForLabel.onResult(
            if (brushJson != null) BrushDeserializer.fromJson(brushJson) else null
        )
    }

    @ReactMethod
    fun setBrushForLabel(
        brushJson: String,
        sequenceId: Int,
        labelId: Int,
        promise: Promise
    ) {
        if (!isCurrentSequenceId(sequenceId)) {
            promise.reject(ERROR_INVALID_SEQUENCE_ID)

            return
        }

        val label = session?.getLabelById(labelId) ?: run {
            promise.reject(ERROR_LABEL_NOT_FOUND)

            return
        }

        val brush = BrushDeserializer.fromJson(brushJson)

        labelCaptureBasicOverlay?.setBrushForLabel(brush, label)
        promise.resolve(null)
    }

    @ReactMethod
    fun setBrushForFieldOfLabel(
        brushJson: String,
        sequenceId: Int,
        fieldName: String,
        labelId: Int,
        promise: Promise
    ) {
        if (!isCurrentSequenceId(sequenceId)) {
            promise.reject(ERROR_INVALID_SEQUENCE_ID)

            return
        }

        val label = session?.getLabelById(labelId) ?: run {
            promise.reject(ERROR_LABEL_NOT_FOUND)

            return
        }

        val field = label.getFieldNamed(fieldName) ?: run {
            promise.reject(ERROR_FIELD_NOT_FOUND)

            return
        }

        val brush = BrushDeserializer.fromJson(brushJson)

        labelCaptureBasicOverlay?.setBrushForField(brush, field, label)
        promise.resolve(null)
    }

    private fun isCurrentSequenceId(sequenceId: Int): Boolean {
        return session?.let {
            val currentSequenceId = it.frameSequenceId.toInt()

            currentSequenceId == sequenceId
        } ?: false
    }

    private fun LabelCaptureSession.getLabelById(id: Int): CapturedLabel? =
        capturedLabels.find { it.trackingId == id }

    private fun CapturedLabel.getFieldNamed(name: String): LabelField? =
        fields.find { it.name == name }

    override fun onDataCaptureContextDisposed() {
        dataCaptureContext = null
        labelCapture = null
        labelCaptureBasicOverlay = null
    }

    override fun onDataCaptureContextDeserialized(dataCaptureContext: DataCaptureContext) {
        this.dataCaptureContext = dataCaptureContext
    }

    override fun onModeRemoved(
        dataCaptureContext: DataCaptureContext,
        dataCaptureMode: DataCaptureMode
    ) {
        reactContext.runOnNativeModulesQueueThread {
            if (dataCaptureContext == this.dataCaptureContext && dataCaptureMode == labelCapture) {
                labelCapture = null
            }
        }
    }

    override fun onModeDeserializationFinished(
        deserializer: LabelCaptureDeserializer,
        mode: LabelCapture,
        json: JsonValue
    ) {
        labelCapture = mode.also {
            if (json.contains("enabled")) {
                it.isEnabled = json.requireByKeyAsBoolean("enabled")
            }
        }
    }

    override fun onBasicOverlayDeserializationFinished(
        deserializer: LabelCaptureDeserializer,
        overlay: LabelCaptureBasicOverlay,
        json: JsonValue
    ) {
        labelCaptureBasicOverlay = overlay
    }

    override fun onAdvancedOverlayDeserializationFinished(
        deserializer: LabelCaptureDeserializer,
        overlay: LabelCaptureAdvancedOverlay,
        json: JsonValue
    ) {
        labelCaptureAdvancedOverlay = overlay
    }

    @UiThread
    override fun anchorForCapturedLabel(
        overlay: LabelCaptureAdvancedOverlay,
        capturedLabel: CapturedLabel
    ): Anchor {
        val params = writableMap {
            putString(FIELD_LABEL, capturedLabel.toJson())
        }

        if (!hasNativeAdvancedOverlayListeners.get()) return Anchor.CENTER
        return anchorForLabel.emitForResult(params, timeoutResult = Anchor.CENTER)
    }

    @UiThread
    override fun anchorForCapturedLabelField(
        overlay: LabelCaptureAdvancedOverlay,
        labelField: LabelField
    ): Anchor {
        val params = writableMap {
            putString(FIELD_FIELD, labelField.toJson())
        }

        if (!hasNativeAdvancedOverlayListeners.get()) return Anchor.CENTER
        return anchorForLabel.emitForResult(params, timeoutResult = Anchor.CENTER)
    }

    @UiThread
    override fun offsetForCapturedLabel(
        overlay: LabelCaptureAdvancedOverlay,
        capturedLabel: CapturedLabel,
        view: View
    ): PointWithUnit {
        val params = writableMap {
            putString(FIELD_LABEL, capturedLabel.toJson())
        }

        if (!hasNativeAdvancedOverlayListeners.get()) return POINT_WITH_UNIT_ZERO
        return offsetForLabel.emitForResult(params, timeoutResult = POINT_WITH_UNIT_ZERO)
    }

    @UiThread
    override fun offsetForCapturedLabelField(
        overlay: LabelCaptureAdvancedOverlay,
        labelField: LabelField,
        view: View
    ): PointWithUnit {
        val params = writableMap {
            putString(FIELD_FIELD, labelField.toJson())
        }

        if (!hasNativeAdvancedOverlayListeners.get()) return POINT_WITH_UNIT_ZERO
        return offsetForLabel.emitForResult(params, timeoutResult = POINT_WITH_UNIT_ZERO)
    }

    @UiThread
    override fun viewForCapturedLabel(
        overlay: LabelCaptureAdvancedOverlay,
        capturedLabel: CapturedLabel
    ): View? {
        val params = writableMap {
            putString(FIELD_LABEL, capturedLabel.toJson())
        }

        if (!hasNativeAdvancedOverlayListeners.get()) return null
        val viewJson = viewForLabel.emitForResult(params, timeoutResult = null)
        return viewJson?.let {
            nativeViewFromJson(reactContext.currentActivity!!, it)
        }
    }

    @UiThread
    override fun viewForCapturedLabelField(
        overlay: LabelCaptureAdvancedOverlay,
        labelField: LabelField
    ): View? {
        val params = writableMap {
            putString(FIELD_FIELD, labelField.toJson())
        }

        if (!hasNativeAdvancedOverlayListeners.get()) return null
        val viewJson = viewForLabel.emitForResult(params, timeoutResult = null)
        return viewJson?.let {
            nativeViewFromJson(reactContext.currentActivity!!, it)
        }
    }

    @ReactMethod
    fun setViewForCapturedLabel(
        viewJson: String,
        sequenceId: Int,
        labelId: Int,
        promise: Promise
    ) {
        if (!isCurrentSequenceId(sequenceId)) {
            promise.reject(ERROR_INVALID_SEQUENCE_ID)

            return
        }

        val label = session?.getLabelById(labelId) ?: run {
            promise.reject(ERROR_LABEL_NOT_FOUND)

            return
        }

        val overlay = labelCaptureAdvancedOverlay ?: run {
            promise.reject(ERROR_NULL_ADVANCED_OVERLAY)
            return
        }

        UiThreadUtil.runOnUiThread {
            overlay.setViewForCapturedLabel(
                label,
                nativeViewFromJson(currentActivity!!, viewJson)
            )
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun setAnchorForCapturedLabel(
        anchorJson: String,
        sequenceId: Int,
        labelId: Int,
        promise: Promise
    ) {
        if (!isCurrentSequenceId(sequenceId)) {
            promise.reject(ERROR_INVALID_SEQUENCE_ID)

            return
        }

        val label = session?.getLabelById(labelId) ?: run {
            promise.reject(ERROR_LABEL_NOT_FOUND)

            return
        }

        val overlay = labelCaptureAdvancedOverlay ?: run {
            promise.reject(ERROR_NULL_ADVANCED_OVERLAY)
            return
        }

        try {
            overlay.setAnchorForCapturedLabel(label, AnchorDeserializer.fromJson(anchorJson))
            promise.resolve(null)
        } catch (e: RuntimeException) {
            println(e)
            promise.reject(ERROR_ANCHOR_DESERIALIZATION_FAILED)
        }
    }

    @ReactMethod
    fun setOffsetForCapturedLabel(
        offsetJson: String,
        sequenceId: Int,
        labelId: Int,
        promise: Promise
    ) {
        if (!isCurrentSequenceId(sequenceId)) {
            promise.reject(ERROR_INVALID_SEQUENCE_ID)

            return
        }

        val label = session?.getLabelById(labelId) ?: run {
            promise.reject(ERROR_LABEL_NOT_FOUND)

            return
        }

        val overlay = labelCaptureAdvancedOverlay ?: run {
            promise.reject(ERROR_NULL_ADVANCED_OVERLAY)
            return
        }

        try {
            overlay.setOffsetForCapturedLabel(label, PointWithUnitDeserializer.fromJson(offsetJson))
            promise.resolve(null)
        } catch (e: RuntimeException) {
            println(e)
            promise.reject(ERROR_ANCHOR_DESERIALIZATION_FAILED)
        }
    }

    @ReactMethod
    fun clearCapturedLabelViews(promise: Promise) {
        val overlay = labelCaptureAdvancedOverlay ?: run {
            promise.reject(ERROR_NULL_ADVANCED_OVERLAY)
            return
        }

        overlay.clearCapturedLabelViews()
        promise.resolve(null)
    }

    @ReactMethod
    fun finishViewForLabelCallback(viewJson: String?) {
        viewForLabel.onResult(viewJson)
    }

    @ReactMethod
    fun finishAnchorForLabelCallback(anchorJson: String) {
        anchorForLabel.onResult(AnchorDeserializer.fromJson(anchorJson))
    }

    @ReactMethod
    fun finishOffsetForLabelCallback(offsetJson: String) {
        offsetForLabel.onResult(PointWithUnitDeserializer.fromJson(offsetJson))
    }
}
