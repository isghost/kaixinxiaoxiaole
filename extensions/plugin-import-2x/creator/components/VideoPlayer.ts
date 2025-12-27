'use strict';
export const VIDEOPLAYER = {
    "__type__": "cc.VideoPlayer",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_resourceType": 1,
    "_remoteURL": "",
    "_clip": null,
    "_playOnAwake": true,
    "_volume": 1,
    "_mute": false,
    "_playbackRate": 1,
    "_loop": false,
    "_fullScreenOnAwake": false,
    "_stayOnBottom": false,
    "_keepAspectRatio": true,
    "videoPlayerEvent": [],
};

export class VideoPlayer {

    static create() {
        return JSON.parse(JSON.stringify(VIDEOPLAYER));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(VIDEOPLAYER));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_N$isFullscreen') {
                source._fullScreenOnAwake = value;
            }
            else if (key === '_N$keepAspectRatio') {
                source._keepAspectRatio = value;
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await VideoPlayer.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
