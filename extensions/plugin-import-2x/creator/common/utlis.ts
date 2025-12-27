'use strict';
// @ts-ignore
import { readdirSync, statSync, readJSONSync, readFileSync, ensureDirSync, copyFileSync, existsSync } from 'fs-extra';
import { join, dirname, basename, relative, extname } from 'path';
import { ImporterBase } from "./base";
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
// @ts-ignore
import { DOMParser } from "xmldom";
import { createHash } from 'crypto';
const lodash = require('lodash');

export const SKIPS_SCRIPT = [
    'use_reversed_rotateBy.js',
    'use_reversed_rotateTo.js',
    'use_v2.0.x_cc.Toggle_event.js',
    'use_v2.1-2.2.1_cc.Toggle_event.js',
];

// 优化原本的 localeCompare 方法，性能提升：1000 空节点 1103ms -> 31ms
export const collator = new Intl.Collator('en', {
    numeric: true,
    sensitivity: 'base',
});

// 2d 的分组
export let layerToGroupMap: Map<number, number> = new Map();
let groupList: string[] = [];
export async function initGroupList(path: string) {
    try {
        const project = readJSONSync(join(path, '../settings/project.json'));
        groupList = project['group-list'] || [];
        for (let i = 0; i < groupList.length; ++i) {
            let group = groupList[i];
            await setGroupLayerByIndex(i, group);
        }
    }
    catch (e) {
        groupList = [];
        // console.log(e);
    }
}

export async function getGroupLayerByIndex(index: number) {
    if (groupList.length === 0) {
        return 1 << 25; // 默认为 UI_2D
    }
    const group = groupList[index];
    if (group) {
        return await setGroupLayerByIndex(index, group);
    }
    else {
        return null;
    }
}

export async function setGroupLayerByIndex(index: number, group: string) {
    let userLayers = await Editor.Profile.getProject('project', 'layer');
    let layer;
    if (!userLayers) {
        userLayers = [];
    } else {
        if (group === 'default') {
            group = 'Default';
        }
        layer = userLayers.find((layer: any) => layer.name === group);
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
        layerToGroupMap.set(key, layer.value);
        await Editor.Profile.setProject('project', 'layer', userLayers);
    }
    return layer.value;
}

// 替换 fbx sub meta 中的 uuid
export const replaceFbxUuidMap: Map<string, any> = new Map<string, any>();
// 存储导入项目所有资源
export const importProjectAssets: Map<string, any> = new Map<string, any>();
export const importSubAssets: Map<string, any> = new Map<string, any>();
// 存储 uuid 列表，处理 uuid 冲突，确保 uuid 都是唯一的
export const uuidList: Map<string, string> = new Map<string, string>();
// 脚本名
export const scriptList: Map<string, string> = new Map<string, string>();
export let replaceScriptList = [];
export function updateReplaceScriptList(list: []) {
    replaceScriptList = list;
}

export function saveUuid(oldUuid: string, newUuid: string) {
    uuidList.set(oldUuid, newUuid);
}
export function getNewUuid(oldUuid: string) {
    let uuid = uuidList.get(oldUuid);
    if (!uuid) {
        let info = importProjectAssets.get(oldUuid);
        if (info && info.outUuid) {
            uuid = info.outUuid;
        }
        if (!uuid) {
            info = importSubAssets.get(oldUuid);
            if (info && info.uuid) {
                uuid = info.uuid;
            }
        }
    }
    return uuid || oldUuid;
}

export function clear() {
    scriptList.clear();
    replaceScriptList.length = 0;
    replaceFbxUuidMap.clear();
}


// 存储 2D 默认资源的信息列表
interface DefaultAssets2D {
    type: string,
    path: string,
    baseUuid: string,
}

const defaultAssets2DList: Map<string, DefaultAssets2D> = new Map<string, DefaultAssets2D>();
export function getDefaultAssets2D(uuid: string) {
    return defaultAssets2DList.get(uuid);
}

export function scanningDefaultAssets2D() {
    const default_asset_root = join(__dirname, '../../static');
    const rootPath = join(__dirname, '../../static/migrate-resources/default-assets-2d');
    defaultAssets2DList.clear();
    function step(path: string) {
        try {
            if (path.endsWith('.DS_Store')) {
                return;
            }
            const stat = statSync(path);
            if (stat.isDirectory()) {
                const names = readdirSync(path);
                names.forEach((name: string) => {
                    const tempPath = join(path, name);
                    if (name.endsWith('.meta')) {
                        addImportProjectAssets(default_asset_root, tempPath, true);
                        return;
                    }
                    step(tempPath);
                });
            }
            else {
                const metaPath = join(dirname(path), basename(path) + '.meta');
                const meta = readJSONSync(metaPath);
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
        } catch(error) {
            console.error(error);
        }
    }
    step(rootPath);
}

export function isFbxMultKey(subMetas: any, key: string) {
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

export function addImportProjectAssets(root: string, path: string, isDefaultAssets: boolean = false) {
    try {
        let base = path.replace('.meta', '');
        if (base.endsWith('.fire')) {
            base = base.replace(/.fire+$/g, '.scene');
        } else if (base.endsWith('.js')) {
            base = base.replace(/.js+$/g, '.ts');
        }
        const meta = readJSONSync(path);
        let outPath;
        if (isDefaultAssets) {
            outPath = join(Editor.Project.path, 'assets', relative(root, base + '.meta'));
        }
        else {
            outPath = join(Editor.Project.path, relative(root, base + '.meta'));
        }
        if (existsSync(outPath)) {
            const type = extname(base);
            if (type === '.fbx' || type === '.FBX') {
                for (let key in meta.subMetas) {
                    const subMeta = meta.subMetas[key];
                    if (subMeta) {
                        const isMult = isFbxMultKey(meta.subMetas, key);
                        // console.log('修改前：' + key + ' ' + isMult);
                        key = getFBXSubMetaNewName(path.replace('.meta', ''), key, isMult);
                        // console.log('修改后：' + key + '  ' + ImporterBase.getNameByID(key));
                        importSubAssets.set(subMeta.uuid, {
                            baseUuid: meta.uuid,
                            uuid: `${meta.uuid}@${ImporterBase.getNameByID(key)}`,
                        });
                    }
                }
            }
            else if (meta.type === 'Texture Packer') {
                for (let key in meta.subMetas) {
                    const subMeta = meta.subMetas[key];
                    if (subMeta) {
                        key = basename(key, extname(key));
                        importSubAssets.set(subMeta.uuid, {
                            baseUuid: meta.uuid,
                            uuid: `${meta.uuid}@${ImporterBase.getNameByID(key)}`,
                        });
                    }
                }
            }
            else if (meta.type === 'sprite') {
                for (const key in meta.subMetas) {
                    const subMeta = meta.subMetas[key];
                    if (subMeta) {
                        importSubAssets.set(subMeta.uuid, {
                            baseUuid: meta.uuid,
                            uuid: `${meta.uuid}@${ImporterBase.getNameByID('spriteFrame')}`,
                        });
                    }
                }
            }
            else if (meta.type === 'raw') {
                importSubAssets.set(meta.uuid, {
                    baseUuid: meta.uuid,
                    uuid: `${meta.uuid}@${ImporterBase.getNameByID('texture')}`,
                });
            }
            importProjectAssets.set(meta.uuid, {
                type: type,
                basePath: path,
                outPath: outPath,
                outUuid: meta.uuid,
                meta: meta,
            });
        }
    }
    catch (e) {}
}

export let chunksCacheBy2D: Map<string, any> = new Map<string, any>();

const getChunks = (path: string, regexp: RegExp, extname: string) => {
    const chunksMap: Map<string, any> = new Map<string, any>();
    function step(dir: string) {
        const names = readdirSync(dir);
        names.forEach((name: string) => {
            const file = join(dir, name);
            if (regexp.test(name)) {
                const name = basename(file, extname);
                const content = readFileSync(file, { encoding: 'utf8' });
                chunksMap.set(name, {
                    from: file, // 源文件
                    to: join(Editor.Project.path, 'assets', 'migrate-resources', 'chunks', name + '.chunk'), // 导入到项目到
                    content: content,
                    getIncludePath(effectPath: string) {
                        return relative(effectPath, this.to);
                    },
                });
            } else if (statSync(file).isDirectory()) {
                step(file);
            }
        });
    }
    step(path);
    return chunksMap;
};

export function init2DChunks() {
    chunksCacheBy2D = getChunks(join(__dirname, '../../static/migrate-resources/chunks'), /\.inc$/, '.inc');
}
export function import2DChunks(noRefres?: boolean): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        let idx = 0;
        let open = false;
        for (const [key, value] of chunksCacheBy2D) {
            if (!existsSync(value.to)) {
                // console.log('导入：' + value.to);
                ensureDirSync(dirname(value.to));
                copyFileSync(value.from, value.to);
                open = true;
            }
            idx++;
            if (idx >= chunksCacheBy2D.size) {
                if (open && !noRefres) {
                    await Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                }
                resolve(true);
            }
        }
    });
}

/* comporess texture */
const migrateMap: Record<string, string> = {
    pvrtc_4bits: 'pvrtc_4bits_rgba',
    pvrtc_2bits: 'pvrtc_2bits_rgba',
    etc2: 'etc2_rgba',
    etc1: 'etc1_rgb_a',
};

const PLATFORMS = ['miniGame', 'web', 'android', 'ios', 'pc'];

export async function migratePlatformSettings(platformSettings: any) {
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
            platformSettings.default.formats.forEach((format: any) => {
                // @ts-ignore
                config[format.name] = format.quality;
            });

            platformSettings[platformType] = config;
        });
    } else {
        Object.keys(platformSettings).forEach((platformType) => {
            if (platformType === 'default') {
                return;
            }
            if (platformType !== 'default') {
                const defaultConfig: any = {};
                if (platformSettings.default) {
                    const defaultData = JSON.parse(JSON.stringify(platformSettings.default));

                    if (defaultData.formats) {
                        defaultData.formats.forEach((format: any) => {
                            defaultConfig[format.name] = format.quality;
                        });
                    }
                }

                const otherConfig: any = {};
                platformSettings[platformType].formats.forEach((format: any) => {
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

    result.presetId = await getPresetId(platformSettings);
    return result;
}

function migrateCompressTextureType(config: any) {
    if (!config) {
        return;
    }
    Object.keys(config).forEach((name: string) => {
        if (!migrateMap[name]) {
            return;
        }
        config[migrateMap[name]] = config[name];
        delete config[name];
    });
}

async function getPresetId(platformSettings: any) {
    const presetId = 'presetId' + Date.now();
    // @ts-ignore
    let userPreset = await Editor.Profile.getProject('builder', 'textureCompressConfig.userPreset');
    if (!userPreset) {
        userPreset = {
            [presetId]: {
                name: presetId,
                options: platformSettings,
            },
        };
        // @ts-ignore
        await Editor.Profile.setProject('builder', `textureCompressConfig.userPreset`, userPreset);
        return presetId;
    }

    for (const Id of Object.keys(userPreset)) {
        if (lodash.isEqual(userPreset[Id].options, platformSettings)) {
            return Id;
        }
    }
    // @ts-ignore
    await Editor.Profile.setProject('builder', `textureCompressConfig.userPreset.${presetId}`, {
        name: presetId,
        options: platformSettings,
    });
    return presetId;
}

export function getBlendFactor2DTo3D(value: number) {
    switch (value) {
        case 0: // ZERO
            return 0;
        case 1: // ONE
            return 1;
        case 0x302:// SRC_ALPHA
            return 2;
        case 0x304:// DST_ALPHA
            return 3;
        case 0x303:// ONE_MINUS_SRC_ALPHA
            return 4;
        case 0x305:// ONE_MINUS_DST_ALPHA
            return 5;
        case 0x300:// SRC_COLOR
            return 6;
        case 0x306:// DST_COLOR
            return 7;
        case 0x301:// ONE_MINUS_SRC_COLOR
            return 8;
        case 0x307:// ONE_MINUS_DST_COLOR
            return 9;
    }
    return value;
}

export function hasComponent(target: any, json3D: any, type: string) {
    for (const component of target._components) {
        const id = component.__id__;
        if (json3D[id].__type__ === type) {
            return true;
        }
    }
    return false;
}

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
export function hasUIRenderComponent(target: any, json: any) {
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

export function hasCanvasComponent(node: any, json2D: any) {
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

export function setColor(uiComponent: any, nodeID: any, json2D: any) {
    if (nodeID) {
        const node = json2D[nodeID];
        if (node && node._color) {
            uiComponent._color.r = node._color.r;
            uiComponent._color.g = node._color.g;
            uiComponent._color.b = node._color.b;
        }
    }
}

export function getFBXSubMetaNewName(fsPath: string, baseName: string, isMult: boolean) {
    let ext = extname(baseName);
    const elements = baseName.split('-');
    let name = elements && elements[0];
    const modelName = basename(fsPath, extname(fsPath));
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

export async function readWriteFileByLineWithProcess(readName: any, callback: any) {
    await new Promise((resolve) => {
        const readStream = createReadStream(readName);
        const readLine = createInterface({
            input: readStream,
        });
        readLine.on('line', (line: string) => {
            callback(line);
        });
        readLine.on('close', () => {
            resolve(true);
        });
    });
}


/**
 * 读取 tmx 文件内容，查找依赖的 texture 文件信息
 * @param tmxFile tmx 文件路径
 * @param tmxFileData tmx 文件内容
 * @returns imageFullPaths
 */
export async function searchTmxDependImages(tmxFile: string, tmxFileData: string) {
    // 读取 xml 数据
    const doc = new DOMParser().parseFromString(tmxFileData);
    if (!doc) {
        console.error(`TiledMap import failed: failed to parser ${tmxFile}`);
        return;
    }
    let imgFullPaths: string[] = [];
    const rootElement = doc.documentElement;
    const tilesetElements = rootElement.getElementsByTagName('tileset');
    // 读取内部的 source 数据
    for (let i = 0; i < tilesetElements.length; i++) {
        const tileset = tilesetElements[i];
        const sourceTSXAttr = tileset.getAttribute('source');
        if (sourceTSXAttr) {
            // 获取 texture 路径
            const tsxAbsPath = join(dirname(tmxFile), sourceTSXAttr);
            if (existsSync(tsxAbsPath)) {
                const tsxContent = readFileSync(tsxAbsPath, 'utf-8');
                const tsxDoc = new DOMParser().parseFromString(tsxContent);
                if (tsxDoc) {
                    const imageFullPath = await parseTilesetImages(tsxDoc, tsxAbsPath);
                    imgFullPaths = imgFullPaths.concat(imageFullPath);
                } else {
                    console.warn('Parse %s failed.', tsxAbsPath);
                }
            }
        }
        // import images
        const imageFullPath = await parseTilesetImages(tileset, tmxFile);
        imgFullPaths = imgFullPaths.concat(imageFullPath);
    }

    const imageLayerTextures: string[] = [];
    const imageLayerElements = rootElement.getElementsByTagName('imagelayer');
    for (let ii = 0, nn = imageLayerElements.length; ii < nn; ii++) {
        const imageLayer = imageLayerElements[ii];
        const imageInfos = imageLayer.getElementsByTagName('image');
        if (imageInfos && imageInfos.length > 0) {
            const imageInfo = imageInfos[0];
            const imageSource = imageInfo.getAttribute('source');
            const imgPath = join(dirname(tmxFile), imageSource!);
            if (existsSync(imgPath)) {
                imageLayerTextures.push(imgPath);
            } else {
                console.warn('Parse %s failed.', imgPath);
            }
        }
    }
    return imgFullPaths.concat(imageLayerTextures);
}

/**
 * 读取文件路径下 image 的 source 路径信息以及对应的文件名
 * @param tsxDoc
 * @param tsxPath
 * @returns imageFullPath
 */
export async function parseTilesetImages(tsxDoc: Element | Document, tsxPath: string) {
    const images = tsxDoc.getElementsByTagName('image');
    const imageFullPath: string[] = [];
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageCfg = image.getAttribute('source');
        if (imageCfg) {
            const imgPath = join(dirname(tsxPath), imageCfg);
            imageFullPath.push(imgPath);
        }
    }
    return imageFullPath;
}

export function getColor(node: any) {
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

const halfToRad = 0.5 * Math.PI / 180.0;
export function fromEuler(out: any, x: number, y: number, z: number) {
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


/**
 * 项目内的脚本文件名称不能重复
 */
export const scriptName = {
    allScripts: null,
    allClassNames: [],
    timer: 0,
    fileName: '',
    className: '',
    async isValid(fileName: string) {
        const className = this.getValidClassName(fileName);

        if (!className) {
            return { state: 'errorScriptClassName' };
        }

        const exist = await Editor.Message.request('scene', 'query-component-has-script', className);
        if (!exist) {
            return { state: '' };
        }

        return { state: 'errorScriptClassNameExist', message: className };
    },
    async getValidFileName(fileName: string) {
        fileName = fileName.trim().replace(/[^a-zA-Z0-9_-]/g, '');
        const baseName = fileName;
        let index = 0;
        while ((await this.isValid(fileName)).state) {
            index++;
            const padString = `-${index.toString().padStart(3, '0')}`;
            fileName = `${baseName}${padString}`;
        }

        return fileName;
    },
    getValidClassName(fileName: string) {
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
export function sizeSorting(a: any, b: any) {
    const aID = a.__id__;
    const bID = b.__id__;
    return bID - aID;
}

// 比对版本号
export function compareVersion(versionA: string, versionB: string) {
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

export function getComponentByType(nodeID: number, componentType: string, json: any) {
    const node = json[nodeID];
    const components = node._components.map((component: any) => json[component.__id__]);
    return components.find((component: any) => component.__type__ === componentType);
}

export async function getDesignResolution() {
    const width = await Editor.Profile.getProject('project', 'general.designResolution.width');
    const height = await Editor.Profile.getProject('project', 'general.designResolution.height');
    return {
        width: width || 960,
        height: height || 640,
    }
}

const _extendIndex = [
    1, 2, 3, 4, 5,
    7, 8, 9, 10, 11, 12, 13, 14, 15,
    17, 18, 19, 20, 21, 22, 23, 24,
    26, 27, 28, 29, 30
];
export function nameToId(name: string, extend?: number) {
    if (!extend) {
        extend = 0;
    }
    const md5 = createHash('md5').update(name).digest('hex');
    let id = md5[0] + md5[6] + md5[16] + md5[25] + md5[31];
    for (let i = 0; i < extend; i++) {
        id += md5[_extendIndex[i]];
    }
    return id;
}
