'use strict';
export const STATICLIGHTSETTINGS = {
    "__type__": "cc.StaticLightSettings",
    "_editorOnly": false,
    "_bakeable": false,
    "_castShadow": false,
};

export class StaticLightSettings {

    static create() {
        return JSON.parse(JSON.stringify(STATICLIGHTSETTINGS));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(STATICLIGHTSETTINGS));
        const light = source[0];
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            light[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await StaticLightSettings.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
