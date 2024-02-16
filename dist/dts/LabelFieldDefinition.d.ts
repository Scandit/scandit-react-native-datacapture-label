import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
export declare class LabelFieldDefinition extends DefaultSerializeable {
    private _name;
    private _optional;
    private _patterns;
    private _hiddenPropertiesJSON;
    get name(): string;
    get optional(): boolean;
    set optional(values: boolean);
    get patterns(): string[];
    set patterns(values: string[]);
    get hiddenProperties(): {
        [key: string]: object;
    };
    set hiddenProperties(newValue: {
        [key: string]: object;
    });
    private static fromJSON;
    constructor(name: string);
    setPattern(pattern: string): void;
}
