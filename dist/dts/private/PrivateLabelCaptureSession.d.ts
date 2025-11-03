import { BarcodeJSON } from 'scandit-datacapture-frameworks-barcode';
import { QuadrilateralJSON } from 'scandit-datacapture-frameworks-core';
import { CapturedLabel, LabelCaptureSession, LabelField } from '../LabelCaptureSession';
export interface CapturedLabelJSON {
    name: string;
    predictedBounds: QuadrilateralJSON;
    fields: LabelFieldJSON[];
    trackingId: number;
    deltaTimeToPrediction: number;
    canShowLocation: boolean;
    isComplete: boolean;
}
export interface PrivateCapturedLabel {
    frameSequenceID: number | null;
    fromJSON(json: CapturedLabelJSON): CapturedLabel;
}
export interface LabelFieldJSON {
    name: string;
    state: string;
    type: string;
    location: QuadrilateralJSON;
    barcode: BarcodeJSON | null;
    text: string | null;
    isRequired: boolean;
    canShowLocation: boolean;
}
export interface PrivateLabelField {
    fromJSON(json: LabelFieldJSON): LabelField;
}
export interface LabelCaptureSessionJSON {
    labels: CapturedLabelJSON[];
    frameSequenceId: number;
    lastFrameId: number;
    canShowLocations: boolean;
}
export interface PrivateLabelCaptureSession {
    fromJSON(json: LabelCaptureSessionJSON): LabelCaptureSession;
}
