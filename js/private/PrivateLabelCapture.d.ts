import { DataCaptureContext } from 'scandit-react-native-datacapture-core/ts/DataCaptureContext';
import { PrivateDataCaptureMode } from 'scandit-react-native-datacapture-core/ts/private/PrivateDataCaptureContext';
import { LabelCaptureListener } from '../LabelCaptureListener';
export interface PrivateLabelCapture extends PrivateDataCaptureMode {
    _context: DataCaptureContext | null;
    listeners: LabelCaptureListener[];
    isInListenerCallback: boolean;
    didChange: () => Promise<void>;
}
