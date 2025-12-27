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
exports.nameToId = exports.getDesignResolution = exports.getComponentByType = exports.compareVersion = exports.sizeSorting = exports.scriptName = exports.fromEuler = exports.getColor = exports.parseTilesetImages = exports.searchTmxDependImages = exports.readWriteFileByLineWithProcess = exports.getFBXSubMetaNewName = exports.setColor = exports.hasCanvasComponent = exports.hasUIRenderComponent = exports.hasComponent = exports.getBlendFactor2DTo3D = exports.migratePlatformSettings = exports.import2DChunks = exports.init2DChunks = exports.chunksCacheBy2D = exports.addImportProjectAssets = exports.isFbxMultKey = exports.scanningDefaultAssets2D = exports.getDefaultAssets2D = exports.clear = exports.getNewUuid = exports.saveUuid = exports.updateReplaceScriptList = exports.replaceScriptList = exports.scriptList = exports.uuidList = exports.importSubAssets = exports.importProjectAssets = exports.replaceFbxUuidMap = exports.setGroupLayerByIndex = exports.getGroupLayerByIndex = exports.initGroupList = exports.layerToGroupMap = exports.collator = exports.SKIPS_SCRIPT = void 0;
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const base_1 = require("./base");
const fs_1 = require("fs");
const readline_1 = require("readline");
// @ts-ignore
const xmldom_1 = require("xmldom");
const crypto_1 = require("crypto");
const lodash = require('lodash');
exports.SKIPS_SCRIPT = [
    'use_reversed_rotateBy.js',
    'use_reversed_rotateTo.js',
    'use_v2.0.x_cc.Toggle_event.js',
    'use_v2.1-2.2.1_cc.Toggle_event.js',
];
// 优化原本的 localeCompare 方法，性能提升：1000 空节点 1103ms -> 31ms
exports.collator = new Intl.Collator('en', {
    numeric: true,
    sensitivity: 'base',
});
// 2d 的分组
exports.layerToGroupMap = new Map();
let groupList = [];
function initGroupList(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = (0, fs_extra_1.readJSONSync)((0, path_1.join)(path, '../settings/project.json'));
            groupList = project['group-list'] || [];
            for (let i = 0; i < groupList.length; ++i) {
                let group = groupList[i];
                yield setGroupLayerByIndex(i, group);
            }
        }
        catch (e) {
            groupList = [];
            // console.log(e);
        }
    });
}
exports.initGroupList = initGroupList;
function getGroupLayerByIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        if (groupList.length === 0) {
            return 1 << 25; // 默认为 UI_2D
        }
        const group = groupList[index];
        if (group) {
            return yield setGroupLayerByIndex(index, group);
        }
        else {
            return null;
        }
    });
}
exports.getGroupLayerByIndex = getGroupLayerByIndex;
function setGroupLayerByIndex(index, group) {
    return __awaiter(this, void 0, void 0, function* () {
        let userLayers = yield Editor.Profile.getProject('project', 'layer');
        let layer;
        if (!userLayers) {
            userLayers = [];
        }
        else {
            if (group === 'default') {
                group = 'Default';
            }
            layer = userLayers.find((layer) => layer.name === group);
        }
        if (!layer) {
            const length = userLayers.length;
            layer = {
                name: group,
                value: (1 << length),
            };
            userLayers.push(layer);
            // console.log('layer: ' + layer.name + '  ' + layer.value);
            let key = 1 << index;
            exports.layerToGroupMap.set(key, layer.value);
            yield Editor.Profile.setProject('project', 'layer', userLayers);
        }
        return layer.value;
    });
}
exports.setGroupLayerByIndex = setGroupLayerByIndex;
// 替换 fbx sub meta 中的 uuid
exports.replaceFbxUuidMap = new Map();
// 存储导入项目所有资源
exports.importProjectAssets = new Map();
exports.importSubAssets = new Map();
// 存储 uuid 列表，处理 uuid 冲突，确保 uuid 都是唯一的
exports.uuidList = new Map();
// 脚本名
exports.scriptList = new Map();
exports.replaceScriptList = [];
function updateReplaceScriptList(list) {
    exports.replaceScriptList = list;
}
exports.updateReplaceScriptList = updateReplaceScriptList;
function saveUuid(oldUuid, newUuid) {
    exports.uuidList.set(oldUuid, newUuid);
}
exports.saveUuid = saveUuid;
function getNewUuid(oldUuid) {
    let uuid = exports.uuidList.get(oldUuid);
    if (!uuid) {
        let info = exports.importProjectAssets.get(oldUuid);
        if (info && info.outUuid) {
            uuid = info.outUuid;
        }
        if (!uuid) {
            info = exports.importSubAssets.get(oldUuid);
            if (info && info.uuid) {
                uuid = info.uuid;
            }
        }
    }
    return uuid || oldUuid;
}
exports.getNewUuid = getNewUuid;
function clear() {
    exports.scriptList.clear();
    exports.replaceScriptList.length = 0;
    exports.replaceFbxUuidMap.clear();
}
exports.clear = clear;
const defaultAssets2DList = new Map();
function getDefaultAssets2D(uuid) {
    return defaultAssets2DList.get(uuid);
}
exports.getDefaultAssets2D = getDefaultAssets2D;
function scanningDefaultAssets2D() {
    const default_asset_root = (0, path_1.join)(__dirname, '../../static');
    const rootPath = (0, path_1.join)(__dirname, '../../static/migrate-resources/default-assets-2d');
    defaultAssets2DList.clear();
    function step(path) {
        try {
            if (path.endsWith('.DS_Store')) {
                return;
            }
            const stat = (0, fs_extra_1.statSync)(path);
            if (stat.isDirectory()) {
                const names = (0, fs_extra_1.readdirSync)(path);
                names.forEach((name) => {
                    const tempPath = (0, path_1.join)(path, name);
                    if (name.endsWith('.meta')) {
                        addImportProjectAssets(default_asset_root, tempPath, true);
                        return;
                    }
                    step(tempPath);
                });
            }
            else {
                const metaPath = (0, path_1.join)((0, path_1.dirname)(path), (0, path_1.basename)(path) + '.meta');
                const meta = (0, fs_extra_1.readJSONSync)(metaPath);
                defaultAssets2DList.set(meta.uuid, {
                    path: path,
                    type: meta.type,
                    baseUuid: meta.uuid,
                });
                for (const key in meta.subMetas) {
                    const subMeta = meta.subMetas[key];
                    if (subMeta) {
                        defaultAssets2DList.set(subMeta.uuid, {
                            path: path,
                            type: meta.type,
                            baseUuid: meta.uuid,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    step(rootPath);
}
exports.scanningDefaultAssets2D = scanningDefaultAssets2D;
function isFbxMultKey(subMetas, key) {
    if (key.includes('-')) {
        const elements = key.split('-');
        const modeName = elements[0];
        const keys = Object.keys(subMetas).map((key) => {
            return key.includes(modeName + '-');
        }).filter(Boolean);
        return keys.length > 1;
    }
    return false;
}
exports.isFbxMultKey = isFbxMultKey;
function addImportProjectAssets(root, path, isDefaultAssets = false) {
    try {
        let base = path.replace('.meta', '');
        if (base.endsWith('.fire')) {
            base = base.replace(/.fire+$/g, '.scene');
        }
        else if (base.endsWith('.js')) {
            base = base.replace(/.js+$/g, '.ts');
        }
        const meta = (0, fs_extra_1.readJSONSync)(path);
        let outPath;
        if (isDefaultAssets) {
            outPath = (0, path_1.join)(Editor.Project.path, 'assets', (0, path_1.relative)(root, base + '.meta'));
        }
        else {
            outPath = (0, path_1.join)(Editor.Project.path, (0, path_1.relative)(root, base + '.meta'));
        }
        if ((0, fs_extra_1.existsSync)(outPath)) {
            const type = (0, path_1.extname)(base);
            if (type === '.fbx' || type === '.FBX') {
                for (let key in meta.subMetas) {
                    const subMeta = meta.subMetas[key];
                    if (subMeta) {
                        const isMult = isFbxMultKey(meta.subMetas, key);
                        // console.log('修改前：' + key + ' ' + isMult);
                        key = getFBXSubMetaNewName(path.replace('.meta', ''), key, isMult);
                        // console.log('修改后：' + key + '  ' + ImporterBase.getNameByID(key));
                        exports.importSubAssets.set(subMeta.uuid, {
                            baseUuid: meta.uuid,
                            uuid: `${meta.uuid}@${base_1.ImporterBase.getNameByID(key)}`,
                        });
                    }
                }
            }
            else if (meta.type === 'Texture Packer') {
                for (let key in meta.subMetas) {
                    const subMeta = meta.subMetas[key];
                    if (subMeta) {
                        key = (0, path_1.basename)(key, (0, path_1.extname)(key));
                        exports.importSubAssets.set(subMeta.uuid, {
                            baseUuid: meta.uuid,
                            uuid: `${meta.uuid}@${base_1.ImporterBase.getNameByID(key)}`,
                        });
                    }
                }
            }
            else if (meta.type === 'sprite') {
                for (const key in meta.subMetas) {
                    const subMeta = meta.subMetas[key];
                    if (subMeta) {
                        exports.importSubAssets.set(subMeta.uuid, {
                            baseUuid: meta.uuid,
                            uuid: `${meta.uuid}@${base_1.ImporterBase.getNameByID('spriteFrame')}`,
                        });
                    }
                }
            }
            else if (meta.type === 'raw') {
                exports.importSubAssets.set(meta.uuid, {
                    baseUuid: meta.uuid,
                    uuid: `${meta.uuid}@${base_1.ImporterBase.getNameByID('texture')}`,
                });
            }
            exports.importProjectAssets.set(meta.uuid, {
                type: type,
                basePath: path,
                outPath: outPath,
                outUuid: meta.uuid,
                meta: meta,
            });
        }
    }
    catch (e) { }
}
exports.addImportProjectAssets = addImportProjectAssets;
exports.chunksCacheBy2D = new Map();
const getChunks = (path, regexp, extname) => {
    const chunksMap = new Map();
    function step(dir) {
        const names = (0, fs_extra_1.readdirSync)(dir);
        names.forEach((name) => {
            const file = (0, path_1.join)(dir, name);
            if (regexp.test(name)) {
                const name = (0, path_1.basename)(file, extname);
                const content = (0, fs_extra_1.readFileSync)(file, { encoding: 'utf8' });
                chunksMap.set(name, {
                    from: file,
                    to: (0, path_1.join)(Editor.Project.path, 'assets', 'migrate-resources', 'chunks', name + '.chunk'),
                    content: content,
                    getIncludePath(effectPath) {
                        return (0, path_1.relative)(effectPath, this.to);
                    },
                });
            }
            else if ((0, fs_extra_1.statSync)(file).isDirectory()) {
                step(file);
            }
        });
    }
    step(path);
    return chunksMap;
};
function init2DChunks() {
    exports.chunksCacheBy2D = getChunks((0, path_1.join)(__dirname, '../../static/migrate-resources/chunks'), /\.inc$/, '.inc');
}
exports.init2DChunks = init2DChunks;
function import2DChunks(noRefres) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let idx = 0;
        let open = false;
        for (const [key, value] of exports.chunksCacheBy2D) {
            if (!(0, fs_extra_1.existsSync)(value.to)) {
                // console.log('导入：' + value.to);
                (0, fs_extra_1.ensureDirSync)((0, path_1.dirname)(value.to));
                (0, fs_extra_1.copyFileSync)(value.from, value.to);
                open = true;
            }
            idx++;
            if (idx >= exports.chunksCacheBy2D.size) {
                if (open && !noRefres) {
                    yield Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                }
                resolve(true);
            }
        }
    }));
}
exports.import2DChunks = import2DChunks;
/* comporess texture */
const migrateMap = {
    pvrtc_4bits: 'pvrtc_4bits_rgba',
    pvrtc_2bits: 'pvrtc_2bits_rgba',
    etc2: 'etc2_rgba',
    etc1: 'etc1_rgb_a',
};
const PLATFORMS = ['miniGame', 'web', 'android', 'ios', 'pc'];
function migratePlatformSettings(platformSettings) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!platformSettings || Object.keys(platformSettings).length === 0) {
            return;
        }
        const result = {
            useCompressTexture: true,
            presetId: '',
        };
        if (platformSettings.default && Object.keys(platformSettings).length === 1) {
            // 只有默认配置需要全部平台都配一遍
            PLATFORMS.forEach((platformType) => {
                const config = {};
                platformSettings.default.formats.forEach((format) => {
                    // @ts-ignore
                    config[format.name] = format.quality;
                });
                platformSettings[platformType] = config;
            });
        }
        else {
            Object.keys(platformSettings).forEach((platformType) => {
                if (platformType === 'default') {
                    return;
                }
                if (platformType !== 'default') {
                    const defaultConfig = {};
                    if (platformSettings.default) {
                        const defaultData = JSON.parse(JSON.stringify(platformSettings.default));
                        if (defaultData.formats) {
                            defaultData.formats.forEach((format) => {
                                defaultConfig[format.name] = format.quality;
                            });
                        }
                    }
                    const otherConfig = {};
                    platformSettings[platformType].formats.forEach((format) => {
                        otherConfig[format.name] = format.quality;
                    });
                    platformSettings[platformType] = Object.assign(defaultConfig, otherConfig);
                }
                migrateCompressTextureType(platformSettings[platformType]);
                if (platformType === 'minigame') {
                    platformSettings.miniGame = platformSettings.minigame;
                    delete platformSettings.minigame;
                }
            });
        }
        delete platformSettings.default;
        if (Object.keys(platformSettings).length === 0) {
            return;
        }
        result.presetId = yield getPresetId(platformSettings);
        return result;
    });
}
exports.migratePlatformSettings = migratePlatformSettings;
function migrateCompressTextureType(config) {
    if (!config) {
        return;
    }
    Object.keys(config).forEach((name) => {
        if (!migrateMap[name]) {
            return;
        }
        config[migrateMap[name]] = config[name];
        delete config[name];
    });
}
function getPresetId(platformSettings) {
    return __awaiter(this, void 0, void 0, function* () {
        const presetId = 'presetId' + Date.now();
        // @ts-ignore
        let userPreset = yield Editor.Profile.getProject('builder', 'textureCompressConfig.userPreset');
        if (!userPreset) {
            userPreset = {
                [presetId]: {
                    name: presetId,
                    options: platformSettings,
                },
            };
            // @ts-ignore
            yield Editor.Profile.setProject('builder', `textureCompressConfig.userPreset`, userPreset);
            return presetId;
        }
        for (const Id of Object.keys(userPreset)) {
            if (lodash.isEqual(userPreset[Id].options, platformSettings)) {
                return Id;
            }
        }
        // @ts-ignore
        yield Editor.Profile.setProject('builder', `textureCompressConfig.userPreset.${presetId}`, {
            name: presetId,
            options: platformSettings,
        });
        return presetId;
    });
}
function getBlendFactor2DTo3D(value) {
    switch (value) {
        case 0: // ZERO
            return 0;
        case 1: // ONE
            return 1;
        case 0x302: // SRC_ALPHA
            return 2;
        case 0x304: // DST_ALPHA
            return 3;
        case 0x303: // ONE_MINUS_SRC_ALPHA
            return 4;
        case 0x305: // ONE_MINUS_DST_ALPHA
            return 5;
        case 0x300: // SRC_COLOR
            return 6;
        case 0x306: // DST_COLOR
            return 7;
        case 0x301: // ONE_MINUS_SRC_COLOR
            return 8;
        case 0x307: // ONE_MINUS_DST_COLOR
            return 9;
    }
    return value;
}
exports.getBlendFactor2DTo3D = getBlendFactor2DTo3D;
function hasComponent(target, json3D, type) {
    for (const component of target._components) {
        const id = component.__id__;
        if (json3D[id].__type__ === type) {
            return true;
        }
    }
    return false;
}
exports.hasComponent = hasComponent;
const UI_COMPONENT = [
    'cc.Canvas',
    'cc.Widget',
    'cc.Sprite',
    'cc.Label',
    'cc.LabelOutline',
    'cc.LabelShadow',
    'cc.RichText',
    'cc.ParticleSystem',
    'cc.TiledMap',
    'cc.TiledTile',
    'cc.TiledLayer',
    'cc.TiledObjectGroup',
    'cc.Layout',
    'cc.Button',
    'cc.ScrollView',
    'cc.Slider',
    'cc.PageView',
    'cc.ProgressBar',
    'cc.Toggle',
    'cc.ToggleContainer',
    'cc.ToggleGroup',
    'cc.EditBox',
    'cc.VideoPlayer',
    'cc.WebView',
    'cc.UITransform',
    'cc.UIOpacity',
    'sp.Skeleton',
    'dragonBones.ArmatureDisplay',
];
function hasUIRenderComponent(target, json) {
    if (!target._is3DNode) {
        return true;
    }
    // 如果是自动同步的 prefab 是没有 _components 的
    if (!target._components) {
        return false;
    }
    for (const componentData of target._components) {
        const id = componentData.__id__;
        const component = json[id];
        if (component) {
            const __type__ = component.__type__;
            if (UI_COMPONENT.includes(__type__)) {
                return true;
            }
        }
    }
    for (const childData of target._children) {
        const id = childData.__id__;
        const child = json[id];
        if (hasUIRenderComponent(child, json)) {
            return true;
        }
    }
    return false;
}
exports.hasUIRenderComponent = hasUIRenderComponent;
function hasCanvasComponent(node, json2D) {
    for (const componentData of node._components) {
        const id = componentData.__id__;
        const component = json2D[id];
        if (component) {
            const __type__ = component.__type__;
            if (__type__ === 'cc.Canvas') {
                return true;
            }
        }
    }
    return false;
}
exports.hasCanvasComponent = hasCanvasComponent;
function setColor(uiComponent, nodeID, json2D) {
    if (nodeID) {
        const node = json2D[nodeID];
        if (node && node._color) {
            uiComponent._color.r = node._color.r;
            uiComponent._color.g = node._color.g;
            uiComponent._color.b = node._color.b;
        }
    }
}
exports.setColor = setColor;
function getFBXSubMetaNewName(fsPath, baseName, isMult) {
    let ext = (0, path_1.extname)(baseName);
    const elements = baseName.split('-');
    let name = elements && elements[0];
    const modelName = (0, path_1.basename)(fsPath, (0, path_1.extname)(fsPath));
    if (name && (modelName === name)) {
        switch (ext) {
            case '.sac':
                name = `UnnamedAnimation`;
                break;
            case '.image':
                name = `UnnamedImage`;
                break;
            case '.mesh':
                name = `UnnamedMesh`;
                break;
            case '.mtl':
                name = `UnnamedMaterial`;
                break;
            case '.skeleton':
                name = `UnnamedSkeleton`;
                break;
            case '.texture':
                name = `UnnamedTexture`;
                break;
            default:
                name = `Unnamed`;
        }
        if (isMult) {
            name = name + '-' + elements[1];
        }
    }
    name = name.replace(ext, '');
    switch (ext) {
        case '.sac':
            ext = '.animation';
            break;
        case '.mtl':
            ext = '.material';
            break;
    }
    return name + ext;
}
exports.getFBXSubMetaNewName = getFBXSubMetaNewName;
function readWriteFileByLineWithProcess(readName, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            const readStream = (0, fs_1.createReadStream)(readName);
            const readLine = (0, readline_1.createInterface)({
                input: readStream,
            });
            readLine.on('line', (line) => {
                callback(line);
            });
            readLine.on('close', () => {
                resolve(true);
            });
        });
    });
}
exports.readWriteFileByLineWithProcess = readWriteFileByLineWithProcess;
/**
 * 读取 tmx 文件内容，查找依赖的 texture 文件信息
 * @param tmxFile tmx 文件路径
 * @param tmxFileData tmx 文件内容
 * @returns imageFullPaths
 */
function searchTmxDependImages(tmxFile, tmxFileData) {
    return __awaiter(this, void 0, void 0, function* () {
        // 读取 xml 数据
        const doc = new xmldom_1.DOMParser().parseFromString(tmxFileData);
        if (!doc) {
            console.error(`TiledMap import failed: failed to parser ${tmxFile}`);
            return;
        }
        let imgFullPaths = [];
        const rootElement = doc.documentElement;
        const tilesetElements = rootElement.getElementsByTagName('tileset');
        // 读取内部的 source 数据
        for (let i = 0; i < tilesetElements.length; i++) {
            const tileset = tilesetElements[i];
            const sourceTSXAttr = tileset.getAttribute('source');
            if (sourceTSXAttr) {
                // 获取 texture 路径
                const tsxAbsPath = (0, path_1.join)((0, path_1.dirname)(tmxFile), sourceTSXAttr);
                if ((0, fs_extra_1.existsSync)(tsxAbsPath)) {
                    const tsxContent = (0, fs_extra_1.readFileSync)(tsxAbsPath, 'utf-8');
                    const tsxDoc = new xmldom_1.DOMParser().parseFromString(tsxContent);
                    if (tsxDoc) {
                        const imageFullPath = yield parseTilesetImages(tsxDoc, tsxAbsPath);
                        imgFullPaths = imgFullPaths.concat(imageFullPath);
                    }
                    else {
                        console.warn('Parse %s failed.', tsxAbsPath);
                    }
                }
            }
            // import images
            const imageFullPath = yield parseTilesetImages(tileset, tmxFile);
            imgFullPaths = imgFullPaths.concat(imageFullPath);
        }
        const imageLayerTextures = [];
        const imageLayerElements = rootElement.getElementsByTagName('imagelayer');
        for (let ii = 0, nn = imageLayerElements.length; ii < nn; ii++) {
            const imageLayer = imageLayerElements[ii];
            const imageInfos = imageLayer.getElementsByTagName('image');
            if (imageInfos && imageInfos.length > 0) {
                const imageInfo = imageInfos[0];
                const imageSource = imageInfo.getAttribute('source');
                const imgPath = (0, path_1.join)((0, path_1.dirname)(tmxFile), imageSource);
                if ((0, fs_extra_1.existsSync)(imgPath)) {
                    imageLayerTextures.push(imgPath);
                }
                else {
                    console.warn('Parse %s failed.', imgPath);
                }
            }
        }
        return imgFullPaths.concat(imageLayerTextures);
    });
}
exports.searchTmxDependImages = searchTmxDependImages;
/**
 * 读取文件路径下 image 的 source 路径信息以及对应的文件名
 * @param tsxDoc
 * @param tsxPath
 * @returns imageFullPath
 */
function parseTilesetImages(tsxDoc, tsxPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const images = tsxDoc.getElementsByTagName('image');
        const imageFullPath = [];
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const imageCfg = image.getAttribute('source');
            if (imageCfg) {
                const imgPath = (0, path_1.join)((0, path_1.dirname)(tsxPath), imageCfg);
                imageFullPath.push(imgPath);
            }
        }
        return imageFullPath;
    });
}
exports.parseTilesetImages = parseTilesetImages;
function getColor(node) {
    if (node && node._color) {
        return {
            "__type__": "cc.Color",
            "r": node._color.r,
            "g": node._color.g,
            "b": node._color.b,
            "a": node._color.a,
        };
    }
}
exports.getColor = getColor;
const halfToRad = 0.5 * Math.PI / 180.0;
function fromEuler(out, x, y, z) {
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    const sx = Math.sin(x);
    const cx = Math.cos(x);
    const sy = Math.sin(y);
    const cy = Math.cos(y);
    const sz = Math.sin(z);
    const cz = Math.cos(z);
    out.x = sx * cy * cz + cx * sy * sz;
    out.y = cx * sy * cz + sx * cy * sz;
    out.z = cx * cy * sz - sx * sy * cz;
    out.w = cx * cy * cz - sx * sy * sz;
    return out;
}
exports.fromEuler = fromEuler;
/**
 * 项目内的脚本文件名称不能重复
 */
exports.scriptName = {
    allScripts: null,
    allClassNames: [],
    timer: 0,
    fileName: '',
    className: '',
    isValid(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const className = this.getValidClassName(fileName);
            if (!className) {
                return { state: 'errorScriptClassName' };
            }
            const exist = yield Editor.Message.request('scene', 'query-component-has-script', className);
            if (!exist) {
                return { state: '' };
            }
            return { state: 'errorScriptClassNameExist', message: className };
        });
    },
    getValidFileName(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            fileName = fileName.trim().replace(/[^a-zA-Z0-9_-]/g, '');
            const baseName = fileName;
            let index = 0;
            while ((yield this.isValid(fileName)).state) {
                index++;
                const padString = `-${index.toString().padStart(3, '0')}`;
                fileName = `${baseName}${padString}`;
            }
            return fileName;
        });
    },
    getValidClassName(fileName) {
        /**
         * 类名转为大驼峰格式:
         * 头部不能有数字
         * 不含特殊字符
         * 符号和空格作为间隔，每个间隔后的首字母大写，如：
         * 0my class_name-for#demo! 转后为 MyClassNameForDemo
         */
        fileName = fileName.trim().replace(/^[^a-zA-Z]+/g, '');
        const parts = fileName.match(/[a-zA-Z0-9]+/g);
        if (parts) {
            return parts
                .filter(Boolean)
                .map((part) => part[0].toLocaleUpperCase() + part.substr(1))
                .join('');
        }
        return '';
    },
};
// 排序
function sizeSorting(a, b) {
    const aID = a.__id__;
    const bID = b.__id__;
    return bID - aID;
}
exports.sizeSorting = sizeSorting;
// 比对版本号
function compareVersion(versionA, versionB) {
    const a = versionA.split('.');
    const b = versionB.split('.');
    const length = Math.max(a.length, b.length);
    for (let i = 0; i < length; i++) {
        const an = a[i] || 0;
        const bn = b[i] || 0;
        if (Number(an) < Number(bn)) {
            return -1;
        }
        if (Number(an) > Number(bn)) {
            return 1;
        }
    }
    return 0;
}
exports.compareVersion = compareVersion;
function getComponentByType(nodeID, componentType, json) {
    const node = json[nodeID];
    const components = node._components.map((component) => json[component.__id__]);
    return components.find((component) => component.__type__ === componentType);
}
exports.getComponentByType = getComponentByType;
function getDesignResolution() {
    return __awaiter(this, void 0, void 0, function* () {
        const width = yield Editor.Profile.getProject('project', 'general.designResolution.width');
        const height = yield Editor.Profile.getProject('project', 'general.designResolution.height');
        return {
            width: width || 960,
            height: height || 640,
        };
    });
}
exports.getDesignResolution = getDesignResolution;
const _extendIndex = [
    1, 2, 3, 4, 5,
    7, 8, 9, 10, 11, 12, 13, 14, 15,
    17, 18, 19, 20, 21, 22, 23, 24,
    26, 27, 28, 29, 30
];
function nameToId(name, extend) {
    if (!extend) {
        extend = 0;
    }
    const md5 = (0, crypto_1.createHash)('md5').update(name).digest('hex');
    let id = md5[0] + md5[6] + md5[16] + md5[25] + md5[31];
    for (let i = 0; i < extend; i++) {
        id += md5[_extendIndex[i]];
    }
    return id;
}
exports.nameToId = nameToId;
