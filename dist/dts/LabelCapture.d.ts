import { CameraSettings } from 'scandit-react-native-datacapture-core';
import { DataCaptureContext, DataCaptureMode } from 'scandit-react-native-datacapture-core';
import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
import { LabelCaptureListener } from './LabelCaptureListener';
import { LabelCaptureSettings } from './LabelCaptureSettings';
export declare class LabelCapture extends DefaultSerializeable implements DataCaptureMode {
    get context(): DataCaptureContext | null;
    static get recommendedCameraSettings(): CameraSettings;
    private type;
    private _isEnabled;
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    private settings;
    private privateContext;
    private get _context();
    private set _context(value);
    private listeners;
    private listenerProxy;
    private isInListenerCallback;
    private modeProxy;
    static forContext(context: DataCaptureContext | null, settings: LabelCaptureSettings): LabelCapture;
    private constructor();
    applySettings(settings: LabelCaptureSettings): Promise<void>;
    addListener(listener: LabelCaptureListener): void;
    removeListener(listener: LabelCaptureListener): void;
}
