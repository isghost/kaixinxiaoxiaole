'use strict';
export const LAYOUT = {
    "__type__": "cc.Layout",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_resizeMode": 0,
    "_N$layoutType": 0,
    "_N$padding": 0,
    "_cellSize": {
        "__type__": "cc.Size",
        "width": 40,
        "height": 40,
    },
    "_startAxis": 0,
    "_paddingLeft": 0,
    "_paddingRight": 0,
    "_paddingTop": 0,
    "_paddingBottom": 0,
    "_spacingX": 0,
    "_spacingY": 0,
    "_verticalDirection": 1,
    "_horizontalDirection": 0,
    "_affectedByScale": false,
};

export class Layout {

    static create() {
        return JSON.parse(JSON.stringify(LAYOUT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(LAYOUT));
        for (let key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key.startsWith('_N$')) {
                key = key.replace(/N\$/, '');
            }
            if (key === '_padding') {
                source._paddingLeft = source._paddingRight = source._paddingTop = source._paddingBottom = value;
            } else if (key === '_resize') {
                source._resizeMode = value;
            } else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Layout.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
