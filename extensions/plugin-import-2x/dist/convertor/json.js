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
exports.JSONImporter = void 0;
const base_1 = require("../common/base");
class JSONImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'base';
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            const isSpine = this.validateSpine();
            if (isSpine) {
                this._3dMeta.ver = '1.2.3';
                this._3dMeta.importer = 'spine-data';
            }
            else if (this.validateDragonBones()) {
                this._3dMeta.ver = '1.0.0';
                this._3dMeta.importer = 'dragonbones';
            }
            else if (this.validateDragonBonesAtlasAsset()) {
                this._3dMeta.ver = '1.0.0';
                this._3dMeta.importer = 'dragonbones-atlas';
            }
            else {
                this._3dMeta.ver = '1.0.0';
                this._3dMeta.importer = 'json';
            }
            return true;
        });
    }
    validateDragonBonesAtlasAsset() {
        let json;
        const text = this.readFileSync(this.sourceFsPath);
        try {
            if (text) {
                json = JSON.parse(text);
            }
        }
        catch (e) {
            return false;
        }
        return typeof json.imagePath === 'string' && Array.isArray(json.SubTexture);
    }
    validateDragonBones() {
        var json;
        if (this.sourceFsPath.endsWith('.json')) {
            const text = this.readFileSync(this.sourceFsPath);
            try {
                if (text) {
                    json = JSON.parse(text);
                }
            }
            catch (e) {
                return false;
            }
        }
        else {
            const bin = this.readFileSync(this.sourceFsPath);
            try {
                // @ts-expect-error
                json = dragonBones.BinaryDataParser.getInstance().parseDragonBonesData(bin.buffer);
            }
            catch (e) {
                return false;
            }
        }
        return Array.isArray(json.armature) || !!json.armatures;
    }
    validateSpine() {
        if (this.sourceFsPath.endsWith('.skel')) {
            return true;
        }
        let json;
        const text = this.readFileSync(this.sourceFsPath);
        if (text) {
            const fastTest = text.slice(0, 30);
            const maybe = (fastTest.indexOf('slots') > 0 ||
                fastTest.indexOf('skins') > 0 ||
                fastTest.indexOf('events') > 0 ||
                fastTest.indexOf('animations') > 0 ||
                fastTest.indexOf('bones') > 0 ||
                fastTest.indexOf('skeleton') > 0 ||
                fastTest.indexOf('"ik"') > 0);
            if (maybe) {
                try {
                    json = JSON.parse(text);
                }
                catch (e) {
                    return false;
                }
                return Array.isArray(json.bones);
            }
        }
        return false;
    }
}
exports.JSONImporter = JSONImporter;
