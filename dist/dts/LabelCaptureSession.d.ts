import { Barcode } from 'scandit-react-native-datacapture-barcode';
import { Quadrilateral } from 'scandit-react-native-datacapture-core';
export declare enum LabelFieldType {
    Barcode = "barcode",
    Text = "text",
    Unknown = "unknown"
}
export declare enum LabelFieldState {
    Captured = "captured",
    Predicted = "predicted",
    Unknown = "unknown"
}
export declare class CapturedLabel {
    private _fields;
    private _name;
    private _predictedBounds;
    private _deltaTimeToPrediction;
    private _trackingID;
    private _isComplete;
    get fields(): LabelField[];
    get name(): string;
    get isComplete(): boolean;
    get predictedBounds(): Quadrilateral;
    get deltaTimeToPrediction(): number;
    get trackingID(): number;
    private frameSequenceID;
    private static fromJSON;
}
export declare class LabelField {
    private _name;
    private _type;
    private _predictedLocation;
    private _state;
    private _isRequired;
    private _barcode;
    private _text;
    get name(): string;
    get type(): LabelFieldType;
    get predictedLocation(): Quadrilateral;
    get state(): LabelFieldState;
    get isRequired(): boolean;
    get barcode(): Barcode | null;
    get text(): string | null;
    private static fromJSON;
}
export declare class LabelCaptureSession {
    private _capturedLabels;
    private _frameSequenceID;
    get capturedLabels(): CapturedLabel[];
    get frameSequenceID(): number;
    private static fromJSON;
}
