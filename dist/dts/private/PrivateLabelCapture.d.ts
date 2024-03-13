import { DataCaptureContext } from 'scandit-react-native-datacapture-core';
import { PrivateDataCaptureMode } from 'scandit-datacapture-frameworks-core';
import { LabelCaptureListener } from '../LabelCaptureListener';
export interface PrivateLabelCapture extends PrivateDataCaptureMode {
    _context: DataCaptureContext | null;
    listeners: LabelCaptureListener[];
    isInListenerCallback: boolean;
}
