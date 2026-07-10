import { LabelFieldLocation } from './LabelFieldLocation';
import { TextField } from './TextField';
export declare class CustomText extends TextField {
    location: LabelFieldLocation | null;
    private _dataTypePatterns;
    private _fieldType;
    constructor(name: string);
    get dataTypePatterns(): string[];
    set dataTypePatterns(value: string[]);
}
