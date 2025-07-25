import { BarcodeField } from './BarcodeField';
import { LabelFieldLocation } from './LabelFieldLocation';
import { Symbology, SymbologySettings } from 'scandit-datacapture-frameworks-barcode';
export declare class CustomBarcode extends BarcodeField {
    location: LabelFieldLocation | null;
    private _dataTypePatterns;
    private _fieldType;
    static initWithNameAndSymbologySettings(name: string, symbologySettings: SymbologySettings[]): CustomBarcode;
    static initWithNameAndSymbologies(name: string, symbologies: Symbology[]): CustomBarcode;
    static initWithNameAndSymbology(name: string, symbology: Symbology): CustomBarcode;
    private constructor();
    get dataTypePatterns(): string[];
    set dataTypePatterns(value: string[]);
    private static get barcodeDefaults();
}
