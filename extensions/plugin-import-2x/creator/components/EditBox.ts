'use strict';
export const EDITBOX = {
    "__type__": "cc.EditBox",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "editingDidBegan": [],
    "textChanged": [],
    "editingDidEnded": [],
    "editingReturn": [],
    "_textLabel": null,
    "_placeholderLabel": null,
    "_returnType": 0,
    "_useOriginalSize": true,
    "_string": "",
    "_tabIndex": 0,
    "_backgroundImage": null,
    "_inputFlag": 5,
    "_inputMode": 0,
    "_maxLength": 20,
};

export class EditBox {

    static create() {
        return JSON.parse(JSON.stringify(EDITBOX));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(EDITBOX));
        for (let key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key.startsWith('_N$')) {
                key = key.replace(/N\$/, '');
            }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await EditBox.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
