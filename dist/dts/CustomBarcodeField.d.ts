import { BarcodeField } from './BarcodeField';
import { LabelFieldLocation } from './LabelFieldLocation';
import { SymbologySettings } from 'scandit-react-native-datacapture-barcode';
export declare class CustomBarcode extends BarcodeField {
    private _dataTypePatterns;
    private _location;
    get location(): LabelFieldLocation;
    get isOptional(): boolean;
    get name(): string;
    get symbologies(): SymbologySettings[];
    get patterns(): string[];
}
