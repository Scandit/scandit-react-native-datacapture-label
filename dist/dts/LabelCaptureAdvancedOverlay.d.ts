import { CapturedLabel } from 'LabelCaptureSession';
import { PointWithUnit } from 'scandit-react-native-datacapture-core';
import { Anchor } from 'scandit-react-native-datacapture-core';
import { DataCaptureOverlay, DataCaptureView } from 'scandit-react-native-datacapture-core';
import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
import { LabelCapture } from './LabelCapture';
import { LabelCaptureAdvancedOverlayView } from 'LabelCaptureAdvancedOverlayView';
export interface LabelCaptureAdvancedOverlayListener {
    viewForCapturedLabel?(overlay: LabelCaptureAdvancedOverlay, label: CapturedLabel): LabelCaptureAdvancedOverlayView | null;
    anchorForCapturedLabel?(overlay: LabelCaptureAdvancedOverlay, label: CapturedLabel): Anchor;
    offsetForCapturedLabel?(overlay: LabelCaptureAdvancedOverlay, label: CapturedLabel): PointWithUnit;
}
export declare class LabelCaptureAdvancedOverlay extends DefaultSerializeable implements DataCaptureOverlay {
    private set view(value);
    private get view();
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    private type;
    private proxy;
    private mode;
    private _view;
    listener: LabelCaptureAdvancedOverlayListener | null;
    private _shouldShowScanAreaGuides;
    static withLabelCaptureForView(labelCapture: LabelCapture, view: DataCaptureView | null): LabelCaptureAdvancedOverlay;
    private constructor();
    setViewForCapturedLabel(capturedLabel: CapturedLabel, view: LabelCaptureAdvancedOverlayView | null): Promise<void>;
    setAnchorForCapturedLabel(capturedLabel: CapturedLabel, anchor: Anchor): Promise<void>;
    setOffsetForCapturedLabel(capturedLabel: CapturedLabel, offset: PointWithUnit): Promise<void>;
    clearCapturedLabelViews(): Promise<void>;
}
