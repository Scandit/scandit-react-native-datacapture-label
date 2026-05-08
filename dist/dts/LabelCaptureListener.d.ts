import { LabelCapture } from './LabelCapture';
import { LabelCaptureSession } from './LabelCaptureSession';
export interface LabelCaptureListener {
    didUpdateSession?(labelCapture: LabelCapture, session: LabelCaptureSession): void;
}
