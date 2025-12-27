'use strict';
export const UICOMPONENT = {
    "__type__": "cc.UIComponent",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
};

export class UIComponent {

    static create() {
        return JSON.parse(JSON.stringify(UICOMPONENT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(UICOMPONENT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await UIComponent.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
