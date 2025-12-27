'use strict';
export const PHYSICSMATERIAL = {
    "__type__": "cc.PhysicsMaterial",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "_friction": 0.5,
    "_rollingFriction": 0.1,
    "_spinningFriction": 0.1,
    "_restitution": 0.1,
};

export class PhysicsMaterial {

    static create() {
        return JSON.parse(JSON.stringify(PHYSICSMATERIAL));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(PHYSICSMATERIAL));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await PhysicsMaterial.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
