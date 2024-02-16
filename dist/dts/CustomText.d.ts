import { LabelFieldLocation } from './LabelFieldLocation';
import { TextField } from './TextField';
export declare class CustomText extends TextField {
    private _dataTypePatterns;
    private _location;
    get isOptional(): boolean;
    get location(): LabelFieldLocation;
    get name(): string;
    get patterns(): string[];
}
