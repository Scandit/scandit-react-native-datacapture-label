import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
import { LabelDefinition } from './LabelDefinition';
export declare class LabelCaptureSettings extends DefaultSerializeable {
    private _definitions;
    private properties;
    static fromJSON(json: {
        [key: string]: any;
    }): LabelCaptureSettings | null;
    static settingsFromLabelDefinitions(definitions: LabelDefinition[], properties: {
        [key: string]: string;
    } | null): LabelCaptureSettings;
    private constructor();
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}
