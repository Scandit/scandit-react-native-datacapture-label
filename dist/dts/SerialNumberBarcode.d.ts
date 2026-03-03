import { Symbology, SymbologySettings } from 'scandit-datacapture-frameworks-barcode';
import { BarcodeField } from './BarcodeField';
export declare class SerialNumberBarcode extends BarcodeField {
    private _fieldType;
    static initWithNameAndSymbologySettings(name: string, symbologySettings: SymbologySettings[]): SerialNumberBarcode;
    static initWithNameAndSymbologies(name: string, symbologies: Symbology[]): SerialNumberBarcode;
    static initWithNameAndSymbology(name: string, symbology: Symbology): SerialNumberBarcode;
    private static get barcodeDefaults();
    private constructor();
}
