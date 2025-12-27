'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TmxImporter = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const IMAGE_EXNAME = ['.png', '.jpg', '.jpeg', '.webp'];
class TmxImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'tmx';
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            this._3dMeta.ver = '1.0.0';
            this._3dMeta.importer = 'tiled-map';
            const tmxFileData = this.readFileSync();
            if (tmxFileData) {
                const imageFullPaths = (yield (0, utlis_1.searchTmxDependImages)(this.sourceFsPath, tmxFileData)) || [];
                const images = [];
                imageFullPaths.forEach((imagePath) => {
                    utlis_1.importProjectAssets.forEach((value) => {
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
                            (0, fs_extra_1.writeJSONSync)(info.outPath, meta, { spaces: 2 });
                        }
                    }
                });
            }
            return true;
        });
    }
}
exports.TmxImporter = TmxImporter;
