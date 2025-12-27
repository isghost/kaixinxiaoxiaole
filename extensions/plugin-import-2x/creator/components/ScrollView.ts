'use strict';
export const SCROLLVIEW = {
    "__type__": "cc.ScrollView",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "bounceDuration": 1,
    "brake": 0.5,
    "elastic": true,
    "inertia": true,
    "horizontal": true,
    "vertical": true,
    "cancelInnerEvents": true,
    "scrollEvents": [],
    "_content": null,
    "_horizontalScrollBar": null,
    "_verticalScrollBar": null,
};

export class ScrollView {

    static create() {
        return JSON.parse(JSON.stringify(SCROLLVIEW));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SCROLLVIEW));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'content' || key === '_N$content') {
                source._content = value;
            } else if (key === '_N$horizontalScrollBar') {
                source._horizontalScrollBar = value;
            } else if (key === '_N$verticalScrollBar') {
                source._verticalScrollBar = value;
            } else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ScrollView.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
