'use strict';
export const CONSTRAINT = {
    "__type__": "cc.Constraint",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_enableCollision": true,
    "_connectedBody": null,
};

export class Constraint {

    static create() {
        return JSON.parse(JSON.stringify(CONSTRAINT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(CONSTRAINT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Constraint.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
