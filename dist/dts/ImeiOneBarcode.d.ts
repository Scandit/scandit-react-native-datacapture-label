import { Symbology, SymbologySettings } from 'scandit-datacapture-frameworks-barcode';
import { BarcodeField } from './BarcodeField';
export declare class ImeiOneBarcode extends BarcodeField {
    private _fieldType;
    static initWithNameAndSymbologySettings(name: string, symbologySettings: SymbologySettings[]): ImeiOneBarcode;
    static initWithNameAndSymbologies(name: string, symbologies: Symbology[]): ImeiOneBarcode;
    static initWithNameAndSymbology(name: string, symbology: Symbology): ImeiOneBarcode;
    private static get barcodeDefaults();
    private constructor();
}
