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
exports.PlistImporter = void 0;
const base_1 = require("../common/base");
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const utlis_1 = require("../common/utlis");
const plist = require('plist');
class PlistImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'plist';
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._2dMeta) {
                return true;
            }
            if (this._2dMeta.type === 'Texture Packer') {
                this._3dMeta.ver = '1.0.6';
                this._3dMeta.importer = 'sprite-atlas';
                return this.importTexturePacker();
            }
            else {
                this._3dMeta.ver = '1.0.2';
                this._3dMeta.importer = 'particle';
                return this.importParticle();
            }
        });
    }
    importTexturePacker() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = this._3dMeta.userData;
                const file = yield (0, fs_extra_1.readFile)(this.sourceFsPath, 'utf8');
                const data = plist.parse(file);
                userData.atlasTextureName = data.metadata.realTextureFileName;
                userData.format = data.metadata.format;
                userData.textureUuid = `${this._2dMeta.rawTextureUuid}@${base_1.ImporterBase.getNameByID('texture')}`;
                userData = this._3dMeta.userData;
                //
                for (const key in data.frames) {
                    const _2dSubMeta = this._2dMeta.subMetas[key];
                    const id = base_1.ImporterBase.getNameByID((0, path_1.parse)(key).name);
                    const subMeta = this.createNewMeta();
                    subMeta.importer = "sprite-frame";
                    for (const key in _2dSubMeta) {
                        switch (key) {
                            case 'ver':
                            case 'uuid':
                            case 'subMetas':
                            case 'spriteType':
                                // continue
                                break;
                            case 'rawTextureUuid':
                                // @ts-ignore
                                subMeta.userData.atlasUuid = _2dSubMeta[key];
                                break;
                            default:
                                // @ts-ignore
                                subMeta.userData[key] = _2dSubMeta[key];
                                break;
                        }
                    }
                    // @ts-ignore
                    subMeta.imageUuidOrDatabaseUri = userData.textureUuid;
                    this._3dMeta.subMetas[id] = subMeta;
                    // 存储
                    for (let key in this._2dMeta.subMetas) {
                        const subMeta = this._2dMeta.subMetas[key];
                        if (subMeta) {
                            key = (0, path_1.basename)(key, (0, path_1.extname)(key));
                            utlis_1.importSubAssets.set(subMeta.uuid, {
                                baseUuid: this._2dMeta.uuid,
                                uuid: `${this._2dMeta.uuid}@${base_1.ImporterBase.getNameByID(key)}`,
                            });
                        }
                    }
                    // 修改 plist 依赖图片类型设置为 texture
                    const image = utlis_1.importProjectAssets.get(this._2dMeta.rawTextureUuid);
                    if (image) {
                        const meta = this.readJSONSync(image.outPath);
                        if (meta.userData.type !== 'texture') {
                            meta.userData.type = 'texture';
                            (0, fs_extra_1.writeJSONSync)(image.outPath, meta, { spaces: 2 });
                        }
                    }
                }
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    importParticle() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield (0, fs_extra_1.readFile)(this.sourceFsPath, 'utf8');
                const data = plist.parse(file);
                if (data.spriteFrameUuid) {
                    data.spriteFrameUuid = yield base_1.ImporterBase.getUuid(data.spriteFrameUuid, 'spriteFrame');
                }
                else if (data.textureUuid) {
                    // textureUuid 转成 spriteFrameUuid
                    data.spriteFrameUuid = yield base_1.ImporterBase.getUuid(data.textureUuid, 'spriteFrame');
                    delete data.textureUuid;
                }
                if (data.blendFuncSource) {
                    data.blendFuncSource = (0, utlis_1.getBlendFactor2DTo3D)(data.blendFuncSource);
                }
                if (data.blendFuncDestination) {
                    data.blendFuncDestination = (0, utlis_1.getBlendFactor2DTo3D)(data.blendFuncDestination);
                }
                this._2dTo3dSource = plist.build(data);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
}
exports.PlistImporter = PlistImporter;
