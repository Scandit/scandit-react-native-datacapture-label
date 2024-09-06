import { PointWithUnit } from 'scandit-react-native-datacapture-core';
import { CapturedLabel } from '../LabelCaptureSession';
import { Anchor } from 'scandit-react-native-datacapture-core';
import { LabelCaptureAdvancedOverlayView } from 'LabelCaptureAdvancedOverlayView';
import { LabelCaptureAdvancedOverlay } from 'LabelCaptureAdvancedOverlay';
export declare class LabelCaptureAdvancedOverlayProxy {
    private overlay;
    private nativeListeners;
    static forOverlay(overlay: LabelCaptureAdvancedOverlay): LabelCaptureAdvancedOverlayProxy;
    setViewForCapturedLabel(label: CapturedLabel, view: LabelCaptureAdvancedOverlayView | null): Promise<void>;
    setAnchorForCapturedLabel(label: CapturedLabel, anchor: Anchor): Promise<void>;
    setOffsetForCapturedLabel(label: CapturedLabel, offset: PointWithUnit): Promise<void>;
    clearCapturedLabelViews(): Promise<void>;
    subscribeListener(): void;
    unsubscribeListener(): void;
    updateAdvancedOverlay(advancedOverlayJson: string): Promise<void>;
    private getJSONStringForView;
    private isSerializeable;
}
export interface LabelCaptureAdvancedOverlayEventPayload {
    label: string;
}
