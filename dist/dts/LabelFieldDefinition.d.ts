import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
export declare class LabelFieldDefinition extends DefaultSerializeable {
    private _name;
    private _patterns;
    private _optional;
    private _hiddenProperties;
    get name(): string;
    get patterns(): string[];
    set patterns(value: string[]);
    get optional(): boolean;
    set optional(value: boolean);
    get hiddenProperties(): {
        [key: string]: object;
    };
    set hiddenProperties(newValue: {
        [key: string]: object;
    });
    protected constructor(name: string);
}
