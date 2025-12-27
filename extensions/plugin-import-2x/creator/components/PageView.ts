'use strict';
export const PAGEVIEW = {
    "__type__": "cc.PageView",
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
    "autoPageTurningThreshold": 100,
    "pageTurningSpeed": 0.3,
    "pageEvents": [],
    "_sizeMode": 0,
    "_direction": 0,
    "_scrollThreshold": 0.5,
    "_pageTurningEventTiming": 0.1,
    "_indicator": null,
};

export class PageView {

    static create() {
        return JSON.parse(JSON.stringify(PAGEVIEW));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(PAGEVIEW));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            switch (key) {
                case '_N$content':
                case 'content':
                    source._content = value;
                    break;
                case 'scrollThreshold':
                    source._scrollThreshold = value;
                    break;
                case 'pageTurningEventTiming':
                    source._pageTurningEventTiming = value;
                    break;
                case '_N$sizeMode':
                case 'sizeMode':
                    source._sizeMode = value;
                    break;
                case '_N$direction':
                case 'direction':
                    source._direction = value;
                    break;
                case '_N$indicator':
                case 'indicator':
                    source._indicator = value;
                    break;
                default:
                    source[key] = value;
                    break;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await PageView.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
