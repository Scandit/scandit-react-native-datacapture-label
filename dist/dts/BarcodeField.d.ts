import { SymbologySettings } from 'scandit-datacapture-frameworks-barcode';
import { LabelFieldDefinition } from './LabelFieldDefinition';
export declare class BarcodeField extends LabelFieldDefinition {
    private _symbologies;
    private _symbologySettings;
    get symbologySettings(): SymbologySettings[];
    protected constructor(name: string, symbologies: SymbologySettings[]);
}
