import { LabelNativeCallerProvider, LabelProxyType } from 'scandit-datacapture-frameworks-label';
import { NativeCaller } from 'scandit-datacapture-frameworks-core';
export declare class RNLabelNativeCallerProvider implements LabelNativeCallerProvider {
    getNativeCaller(_proxyType: LabelProxyType): NativeCaller;
}
