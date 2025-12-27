'use strict';
export const UIREORDERCOMPONENT = {
    "__type__": "cc.UIReorderComponent",
};

export class UIReorderComponent {

    static create() {
        return JSON.parse(JSON.stringify(UIREORDERCOMPONENT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(UIREORDERCOMPONENT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await UIReorderComponent.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
