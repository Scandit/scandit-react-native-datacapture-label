import { CameraSettings } from 'scandit-react-native-datacapture-core/js/Camera+Related';
import { DataCaptureContext, DataCaptureMode } from 'scandit-react-native-datacapture-core/js/DataCaptureContext';
import { DefaultSerializeable } from 'scandit-react-native-datacapture-core/js/private/Serializeable';
import { LabelCaptureListener } from './LabelCaptureListener';
import { LabelCaptureSettings } from './LabelCaptureSettings';
export declare class LabelCapture extends DefaultSerializeable implements DataCaptureMode {
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    get context(): DataCaptureContext | null;
    static get recommendedCameraSettings(): CameraSettings;
    private type;
    private _isEnabled;
    private settings;
    private privateContext;
    private get _context();
    private set _context(value);
    private listeners;
    private listenerProxy;
    private isInListenerCallback;
    static forContext(context: DataCaptureContext | null, settings: LabelCaptureSettings): LabelCapture;
    private constructor();
    applySettings(settings: LabelCaptureSettings): Promise<void>;
    addListener(listener: LabelCaptureListener): void;
    removeListener(listener: LabelCaptureListener): void;
    private didChange;
}
