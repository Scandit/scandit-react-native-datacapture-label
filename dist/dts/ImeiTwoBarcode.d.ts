import { SymbologySettings } from 'scandit-react-native-datacapture-barcode';
import { BarcodeField } from './BarcodeField';
export declare class ImeiTwoBarcode extends BarcodeField {
    get symbologies(): SymbologySettings[];
    get isOptional(): boolean;
    get patterns(): string[];
    get name(): string;
}
