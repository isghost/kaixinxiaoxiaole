'use strict';
export const FORWARDSTAGE = {
    "__type__": "ForwardStage",
    "_name": "",
    "_priority": 0,
    "_tag": 0,
    "renderQueues": [],
};

export class ForwardStage {

    static create() {
        return JSON.parse(JSON.stringify(FORWARDSTAGE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(FORWARDSTAGE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ForwardStage.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
