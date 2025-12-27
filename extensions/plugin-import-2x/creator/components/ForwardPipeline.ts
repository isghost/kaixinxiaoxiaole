'use strict';
export const FORWARDPIPELINE = {
    "__type__": "ForwardPipeline",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "_tag": 0,
    "_flows": [],
    "renderTextures": [],
    "materials": [],
};

export class ForwardPipeline {

    static create() {
        return JSON.parse(JSON.stringify(FORWARDPIPELINE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(FORWARDPIPELINE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ForwardPipeline.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
