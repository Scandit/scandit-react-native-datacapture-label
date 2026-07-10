import { CapturedLabel, LabelField } from 'LabelCaptureSession';
import { Brush } from 'scandit-react-native-datacapture-core';
import { DataCaptureOverlay, DataCaptureView } from 'scandit-react-native-datacapture-core';
import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
import { Viewfinder } from 'scandit-react-native-datacapture-core';
import { LabelCapture } from './LabelCapture';
export interface LabelCaptureBasicOverlayListener {
    brushForFieldOfLabel?(overlay: LabelCaptureBasicOverlay, field: LabelField, label: CapturedLabel): Brush | null;
    brushForLabel?(overlay: LabelCaptureBasicOverlay, label: CapturedLabel): Brush | null;
    didTapLabel?(overlay: LabelCaptureBasicOverlay, label: CapturedLabel): void;
}
export declare class LabelCaptureBasicOverlay extends DefaultSerializeable implements DataCaptureOverlay {
    static get defaultPredictedFieldBrush(): Brush;
    static get defaultCapturedFieldBrush(): Brush;
    static get defaultLabelBrush(): Brush;
    private type;
    private mode;
    private _view;
    private set view(value);
    private get view();
    private _predictedFieldBrush;
    get predictedFieldBrush(): Brush | null;
    set predictedFieldBrush(newBrush: Brush | null);
    private _capturedFieldBrush;
    get capturedFieldBrush(): Brush | null;
    set capturedFieldBrush(newBrush: Brush | null);
    private _labelBrush;
    get labelBrush(): Brush | null;
    set labelBrush(newBrush: Brush | null);
    private _shouldShowScanAreaGuides;
    listener: LabelCaptureBasicOverlayListener | null;
    private proxy;
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    private _viewfinder;
    get viewfinder(): Viewfinder | null;
    set viewfinder(newViewfinder: Viewfinder | null);
    static withLabelCapture(labelCapture: LabelCapture): LabelCaptureBasicOverlay;
    static withLabelCaptureForView(labelCapture: LabelCapture, view: DataCaptureView | null): LabelCaptureBasicOverlay;
    private constructor();
    setBrushForFieldOfLabel(brush: Brush, field: LabelField, label: CapturedLabel): Promise<void>;
    setBrushForLabel(brush: Brush, label: CapturedLabel): Promise<void>;
}
