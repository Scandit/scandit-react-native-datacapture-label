import { DefaultSerializeable } from 'scandit-react-native-datacapture-core/js/private/Serializeable';
import { Rect } from 'scandit-react-native-datacapture-core';
export declare class LabelFieldLocation extends DefaultSerializeable {
    private _rect;
    private _type;
    static forRect(rect: Rect): LabelFieldLocation;
    static topLeft(): LabelFieldLocation;
    static topRight(): LabelFieldLocation;
    static bottomLeft(): LabelFieldLocation;
    static bottomRight(): LabelFieldLocation;
    static top(): LabelFieldLocation;
    static bottom(): LabelFieldLocation;
    static left(): LabelFieldLocation;
    static right(): LabelFieldLocation;
    static center(): LabelFieldLocation;
    static wholeLabel(): LabelFieldLocation;
}
