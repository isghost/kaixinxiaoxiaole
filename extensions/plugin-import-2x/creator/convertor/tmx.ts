'use strict';
import { ImporterBase } from '../common/base';
import { importProjectAssets, searchTmxDependImages } from "../common/utlis";
// @ts-ignore
import { writeJSONSync } from "fs-extra";

const IMAGE_EXNAME = ['.png', '.jpg', '.jpeg', '.webp'];

export class TmxImporter extends ImporterBase {
    type: string = 'tmx';
    async import(): Promise<boolean> {
        this._3dMeta.ver = '1.0.0';
        this._3dMeta.importer = 'tiled-map';
        const tmxFileData = this.readFileSync();
        if (tmxFileData) {
            const imageFullPaths = await searchTmxDependImages(this.sourceFsPath, tmxFileData) || [];
            const images: any[] = [];
            imageFullPaths.forEach((imagePath: string) => {
                importProjectAssets.forEach((value) => {
                    if (IMAGE_EXNAME.includes(value.type)) {
                        if (value.basePath === imagePath) {
                            images.push(value);
                            return;
                        }
                    }
                });
            });
            images.forEach(info => {
                const meta = this.readJSONSync(info.outPath);
                if (meta) {
                    if (meta.userData.type !== 'sprite-frame') {
                        meta.userData.type = 'sprite-frame';
                        writeJSONSync(info.outPath, meta, {spaces: 2});
                    }
                }
            });
        }
        return true;
    }
}
