'use strict';
import { setColor } from "../common/utlis";

export const LABELSHADOW = {
    "__type__": "cc.LabelShadow",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_color": {
        "__type__": "cc.Color",
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 255,
    },
    "_offset": {
        "__type__": "cc.Vec2",
        "x": 2,
        "y": 2,
    },
    "_blur": 2,
};

export class LabelShadow {

    static create() {
        return JSON.parse(JSON.stringify(LABELSHADOW));
    }

    static async migrate(json2D: any, json3D: any) {
        const source = JSON.parse(JSON.stringify(LABELSHADOW));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'node') {
                source.node = value;
                setColor(source, value.__id__, json2D);
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await LabelShadow.migrate(json2D[index], json3D);
        json3D.splice(index, 1, source);
        return source;
    }
}
