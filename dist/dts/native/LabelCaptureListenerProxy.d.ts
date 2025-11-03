import { LabelCapture } from '../LabelCapture';
export declare class LabelCaptureListenerProxy {
    private mode;
    private nativeListeners;
    static forLabelCapture(labelCapture: LabelCapture): LabelCaptureListenerProxy;
    subscribeListener(): void;
    unsubscribeListener(): void;
    private notifyListenersOfDidUpdateSession;
}
export interface LabelCaptureSessionEventPayload {
    session: string;
}
