import { Symbology, SymbologySettings } from 'scandit-datacapture-frameworks-barcode';
import { BarcodeField } from './BarcodeField';
export declare class ImeiTwoBarcode extends BarcodeField {
    private _fieldType;
    static initWithNameAndSymbologySettings(name: string, symbologySettings: SymbologySettings[]): ImeiTwoBarcode;
    static initWithNameAndSymbologies(name: string, symbologies: Symbology[]): ImeiTwoBarcode;
    static initWithNameAndSymbology(name: string, symbology: Symbology): ImeiTwoBarcode;
    private static get barcodeDefaults();
    private constructor();
}
