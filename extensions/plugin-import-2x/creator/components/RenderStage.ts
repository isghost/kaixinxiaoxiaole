'use strict';
export const RENDERSTAGE = {
    "__type__": "RenderStage",
    "_name": "",
    "_priority": 0,
    "_tag": 0,
};

export class RenderStage {

    static create() {
        return JSON.parse(JSON.stringify(RENDERSTAGE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(RENDERSTAGE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await RenderStage.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
