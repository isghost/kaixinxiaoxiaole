'use strict';
export const SCROLLBAR = {
    "__type__": "cc.ScrollBar",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_scrollView": null,
    "_handle": null,
    "_direction": 0,
    "_enableAutoHide": false,
    "_autoHideTime": 1,
};

export class Scrollbar {

    static create() {
        return JSON.parse(JSON.stringify(SCROLLBAR));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SCROLLBAR));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            switch (key) {
                case '_N$handle':
                    source._handle = value;
                    break;
                case '_N$direction':
                    source._direction = value;
                    break;
                case 'enableAutoHide':
                    source._enableAutoHide = value;
                    break;
                case 'autoHideTime':
                    source._autoHideTime = value;
                    break;
                default:
                    source[key] = value;
                    break;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Scrollbar.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
