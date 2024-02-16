import { SymbologySettings } from 'scandit-react-native-datacapture-barcode';
import { BarcodeField } from './BarcodeField';
export declare class SerialNumberBarcode extends BarcodeField {
    get symbologies(): SymbologySettings[];
    get name(): string;
    get patterns(): string[];
    get isOptional(): boolean;
}
