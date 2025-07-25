import { Symbology, SymbologySettings } from 'scandit-datacapture-frameworks-barcode';
import { BarcodeField } from './BarcodeField';
export declare class PartNumberBarcode extends BarcodeField {
    private _fieldType;
    static initWithNameAndSymbologySettings(name: string, symbologySettings: SymbologySettings[]): PartNumberBarcode;
    static initWithNameAndSymbologies(name: string, symbologies: Symbology[]): PartNumberBarcode;
    static initWithNameAndSymbology(name: string, symbology: Symbology): PartNumberBarcode;
    private static get barcodeDefaults();
    private constructor();
}
