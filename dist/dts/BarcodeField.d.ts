import { SymbologySettings } from 'scandit-react-native-datacapture-barcode';
import { LabelFieldDefinition } from './LabelFieldDefinition';
export declare class BarcodeField extends LabelFieldDefinition {
    private _symbologies;
    get symbologySettings(): SymbologySettings[];
}
