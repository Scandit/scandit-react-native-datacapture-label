/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.label

import android.view.View
import androidx.annotation.UiThread
import androidx.annotation.VisibleForTesting
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.scandit.datacapture.core.capture.DataCaptureContext
import com.scandit.datacapture.core.common.geometry.Anchor
import com.scandit.datacapture.core.common.geometry.AnchorDeserializer
import com.scandit.datacapture.core.common.geometry.PointWithUnit
import com.scandit.datacapture.core.common.geometry.PointWithUnitDeserializer
import com.scandit.datacapture.core.data.FrameData
import com.scandit.datacapture.core.json.JsonValue
import com.scandit.datacapture.core.ui.DataCaptureView
import com.scandit.datacapture.core.ui.style.Brush
import com.scandit.datacapture.core.ui.style.BrushDeserializer
import com.scandit.datacapture.frameworks.core.deserialization.DeserializationLifecycleObserver
import com.scandit.datacapture.frameworks.core.deserialization.Deserializers
import com.scandit.datacapture.frameworks.core.utils.DefaultFrameworksLog
import com.scandit.datacapture.frameworks.core.utils.DefaultMainThread
import com.scandit.datacapture.frameworks.core.utils.FrameworksLog
import com.scandit.datacapture.frameworks.core.utils.MainThread
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
import com.scandit.datacapture.reactnative.core.utils.Error
import com.scandit.datacapture.reactnative.core.utils.EventWithResult
import com.scandit.datacapture.reactnative.core.utils.LazyEventEmitter
import com.scandit.datacapture.reactnative.core.utils.POINT_WITH_UNIT_ZERO
import com.scandit.datacapture.reactnative.core.utils.reject
import com.scandit.datacapture.reactnative.core.utils.writableMap
import com.scandit.datacapture.reactnative.label.data.defaults.SerializableLabelCaptureBasicOverlayDefaults
import com.scandit.datacapture.reactnative.label.data.defaults.SerializableLabelCaptureDefaults
import com.scandit.datacapture.reactnative.label.data.defaults.SerializableLabelDefaults
import java.lang.ref.WeakReference
import java.util.concurrent.atomic.AtomicBoolean

class ScanditDataCaptureLabelModule(
    private val reactContext: ReactApplicationContext,
    @get:VisibleForTesting val labelCaptureDeserializer: LabelCaptureDeserializer =
        LabelCaptureDeserializer(),
    private val eventEmitter: RCTDeviceEventEmitter = LazyEventEmitter(reactContext),
    sessionProvider: (() -> LabelCaptureSession?)? = null,
    private val mainThread: MainThread = DefaultMainThread.getInstance(),
    private val logger: FrameworksLog = DefaultFrameworksLog.getInstance()
) : ReactContextBaseJavaModule(reactContext),
    DeserializationLifecycleObserver.Observer,
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

        private const val MODE_TYPE = "labelCapture"
        private const val ADVANCED_OVERLAY_TYPE = "labelCaptureAdvanced"
        private const val BASIC_OVERLAY_TYPE = "labelCaptureBasic"

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

    private var dataCaptureContextRef: WeakReference<DataCaptureContext?> = WeakReference(null)

    private var dataCaptureViewRef: WeakReference<DataCaptureView?> = WeakReference(null)

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
        brushJson: String?,
        labelId: Int,
        promise: Promise
    ) {
        val label = session?.getLabelById(labelId) ?: run {
            promise.reject(ERROR_LABEL_NOT_FOUND)

            return
        }

        val brush = if (brushJson != null) BrushDeserializer.fromJson(brushJson) else null

        labelCaptureBasicOverlay?.setBrushForLabel(brush, label)
        promise.resolve(null)
    }

    @ReactMethod
    fun setBrushForFieldOfLabel(
        brushJson: String?,
        fieldName: String,
        labelId: Int,
        promise: Promise
    ) {
        val label = session?.getLabelById(labelId) ?: run {
            promise.reject(ERROR_LABEL_NOT_FOUND)

            return
        }

        val field = label.getFieldNamed(fieldName) ?: run {
            promise.reject(ERROR_FIELD_NOT_FOUND)

            return
        }

        val brush = if (brushJson != null) BrushDeserializer.fromJson(brushJson) else null

        labelCaptureBasicOverlay?.setBrushForField(brush, field, label)
        promise.resolve(null)
    }

    private fun LabelCaptureSession.getLabelById(id: Int): CapturedLabel? =
        capturedLabels.find { it.trackingId == id }

    private fun CapturedLabel.getFieldNamed(name: String): LabelField? =
        fields.find { it.name == name }

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
        viewJson: String?,
        labelId: Int,
        promise: Promise
    ) {
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
        labelId: Int,
        promise: Promise
    ) {
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
        labelId: Int,
        promise: Promise
    ) {
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

    override fun onDataCaptureContextDisposed() {
        dataCaptureContextRef = WeakReference(null)
    }

    override fun onDataCaptureContextDeserialized(dataCaptureContext: DataCaptureContext) {
        dataCaptureContextRef = WeakReference(dataCaptureContext)
    }

    override fun onAddModeToContext(modeJson: String) {
        if (modeJson.getJsonValueTypeAttribute() != MODE_TYPE) return

        val dcContext = dataCaptureContextRef.get() ?: run {
            logger.error(
                "Unable to add the LabelCaptureMode to the DataCaptureContext, " +
                    "the context is null."
            )
            return
        }

        val mode = labelCaptureDeserializer.modeFromJson(dcContext, modeJson)
        dcContext.addMode(mode)
    }

    override fun onRemoveModeFromContext(modeJson: String) {
        if (modeJson.getJsonValueTypeAttribute() != MODE_TYPE) return

        val dcContext = dataCaptureContextRef.get() ?: run {
            logger.error(
                "Unable to remove the LabelCaptureMode from the DataCaptureContext, " +
                    "the context is null."
            )
            return
        }
        val mode = labelCapture ?: run {
            logger.error(
                "Unable to add the LabelCaptureMode from the DataCaptureContext, " +
                    "the mode is null."
            )
            return
        }
        dcContext.removeMode(mode)
        onModeRemovedFromContext()
    }

    override fun onAllModesRemovedFromContext() {
        onModeRemovedFromContext()
    }

    override fun onAddOverlayToView(overlayJson: String) {
        val overlayType = overlayJson.getJsonValueTypeAttribute()
        if (overlayType != ADVANCED_OVERLAY_TYPE && overlayType != BASIC_OVERLAY_TYPE) return

        val mode = labelCapture
        if (mode == null) {
            logger.error(
                "Unable to add the $overlayType to the DataCaptureContext, " +
                    "the mode is null."
            )
            return
        }

        if (overlayType == ADVANCED_OVERLAY_TYPE) {
            labelCaptureDeserializer.advancedOverlayFromJson(mode, overlayJson).also {
                mainThread.runOnMainThread {
                    dataCaptureViewRef.get()?.addOverlay(it)
                }
            }
        } else {
            labelCaptureDeserializer.basicOverlayFromJson(mode, overlayJson).also {
                mainThread.runOnMainThread {
                    dataCaptureViewRef.get()?.addOverlay(it)
                }
            }
        }
    }

    override fun onRemoveOverlayFromView(overlayJson: String) {
        val overlayType = overlayJson.getJsonValueTypeAttribute()
        if (overlayType != ADVANCED_OVERLAY_TYPE && overlayType != BASIC_OVERLAY_TYPE) return

        if (overlayType == ADVANCED_OVERLAY_TYPE) {
            removeCurrentAdvancedOverlay()
        } else {
            removeCurrentBasicOverlay()
        }
    }

    override fun onRemoveAllOverlays() {
        removeCurrentBasicOverlay()
        removeCurrentAdvancedOverlay()
    }

    override fun onDataCaptureViewDeserialized(dataCaptureView: DataCaptureView?) {
        this.dataCaptureViewRef = WeakReference(dataCaptureView)
        if (dataCaptureView == null) {
            onRemoveAllOverlays()
            return
        }

        labelCaptureBasicOverlay?.let {
            dataCaptureView.addOverlay(it)
        }

        labelCaptureAdvancedOverlay?.let {
            dataCaptureView.addOverlay(it)
        }
    }

    private fun removeCurrentBasicOverlay() {
        labelCaptureBasicOverlay?.let {
            mainThread.runOnMainThread {
                dataCaptureViewRef.get()?.removeOverlay(it)
            }
            it.listener = null
        }
        labelCaptureBasicOverlay = null
    }

    private fun removeCurrentAdvancedOverlay() {
        labelCaptureAdvancedOverlay?.let {
            mainThread.runOnMainThread {
                dataCaptureViewRef.get()?.removeOverlay(it)
            }
            it.listener = null
        }
        labelCaptureAdvancedOverlay = null
    }

    private fun onModeRemovedFromContext() {
        labelCapture = null
        onRemoveAllOverlays()
    }

    private fun String.getJsonValueTypeAttribute(): String =
        JsonValue(this).getByKeyAsString("type", "")
}
