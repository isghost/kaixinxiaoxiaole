'use strict';
export const SLIDER = {
    "__type__": "cc.Slider",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "slideEvents": [],
    "_handle": null,
    "_direction": 0,
    "_progress": 0.1,
};

export class Slider {

    static create() {
        return JSON.parse(JSON.stringify(SLIDER));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SLIDER));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_N$handle') {
                source._handle = value;
            }
            else if (key === '_N$progress') {
                source._progress = value;
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
        const source = await Slider.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
