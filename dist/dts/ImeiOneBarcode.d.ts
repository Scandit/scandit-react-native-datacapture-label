import { SymbologySettings } from 'scandit-react-native-datacapture-barcode';
import { BarcodeField } from './BarcodeField';
export declare class ImeiOneBarcode extends BarcodeField {
    get isOptional(): boolean;
    get symbologies(): SymbologySettings[];
    get patterns(): string[];
    get name(): string;
}
