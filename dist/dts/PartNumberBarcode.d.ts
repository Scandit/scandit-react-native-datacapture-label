import { SymbologySettings } from 'scandit-react-native-datacapture-barcode';
import { BarcodeField } from './BarcodeField';
export declare class PartNumberBarcode extends BarcodeField {
    get symbologies(): SymbologySettings[];
    get patterns(): string[];
    get isOptional(): boolean;
    get name(): string;
}
