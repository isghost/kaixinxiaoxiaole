'use strict';
import { ImporterBase } from "../common/base";

export const PAGEVIEWINDICATOR = {
    "__type__": "cc.PageViewIndicator",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "spacing": 0,
    "_spriteFrame": null,
    "_direction": 0,
    "_cellSize": {
        "__type__": "cc.Size",
        "width": 20,
        "height": 20,
    },
};

export class PageViewIndicator {

    static create() {
        return JSON.parse(JSON.stringify(PAGEVIEWINDICATOR));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(PAGEVIEWINDICATOR));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'spriteFrame') {
                source._spriteFrame = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                };
            }
            else if (key === 'cellSize') {
                source._cellSize = value;
            }
            else if (key === 'direction') {
                source._direction = value;
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await PageViewIndicator.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
