import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
import { LabelFieldDefinition } from './LabelFieldDefinition';
export declare class LabelDefinition extends DefaultSerializeable {
    private _name;
    private _fields;
    private _hiddenPropertiesJSON;
    get name(): string;
    get fields(): LabelFieldDefinition[];
    set fields(values: LabelFieldDefinition[]);
    get hiddenProperties(): {
        [key: string]: object;
    };
    set hiddenProperties(newValue: {
        [key: string]: object;
    });
    private static fromJSON;
    constructor(name: string);
}
