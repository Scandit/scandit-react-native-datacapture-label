import { TextField } from './TextField';
export declare class WeightText extends TextField {
    get optional(): boolean;
    get patterns(): string[];
    get name(): string;
    constructor(name: string);
}
