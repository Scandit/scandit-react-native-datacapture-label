import { Brush } from 'scandit-react-native-datacapture-core';
import { LabelCaptureBasicOverlay } from '../LabelCaptureBasicOverlay';
import { CapturedLabel, LabelField } from '../LabelCaptureSession';
export declare class LabelCaptureBasicOverlayProxy {
    private overlay;
    private nativeListeners;
    static forOverlay(overlay: LabelCaptureBasicOverlay): LabelCaptureBasicOverlayProxy;
    setBrushForFieldOfLabel(brush: Brush, field: LabelField, label: CapturedLabel): Promise<void>;
    setBrushForLabel(brush: Brush, label: CapturedLabel): Promise<void>;
    subscribeListener(): void;
    unsubscribeListener(): void;
}
