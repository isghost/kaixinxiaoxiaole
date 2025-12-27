'use strict';
export const TOGGLECONTAINER = {
    "__type__": "cc.ToggleContainer",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_allowSwitchOff": false,
    "checkEvents": [],
};

export class ToggleContainer {

    static create() {
        return JSON.parse(JSON.stringify(TOGGLECONTAINER));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TOGGLECONTAINER));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'allowSwitchOff') {
                source._allowSwitchOff = value;
            } else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ToggleContainer.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
