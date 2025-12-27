'use strict';
export const MESH = {
    "__type__": "cc.Mesh",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "_struct": {
        "vertexBundles": [],
        "primitives": [],
    },
    "_dataLength": 0,
    "_hash": 0,
};

export class Mesh {

    static create() {
        return JSON.parse(JSON.stringify(MESH));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(MESH));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Mesh.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
