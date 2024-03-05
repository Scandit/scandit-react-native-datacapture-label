import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
export declare class LabelCaptureSettings extends DefaultSerializeable {
    static fromJSON(json: {
        [key: string]: any;
    }): LabelCaptureSettings | null;
    private constructor();
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}
