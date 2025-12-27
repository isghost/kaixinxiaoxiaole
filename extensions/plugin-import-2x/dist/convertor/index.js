'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConverter = exports.getConverter = exports.bubbleSort = exports.converterMap = void 0;
const utlis_1 = require("../common/utlis");
const diff_1 = require("../common/diff");
const image_1 = require("./image");
const fnt_1 = require("./fnt");
const text_1 = require("./text");
const audio_1 = require("./audio");
const plist_1 = require("./plist");
const json_1 = require("./json");
const tmx_1 = require("./tmx");
const mtl_1 = require("./mtl");
const fbx_1 = require("./fbx");
const ttf_1 = require("./ttf");
const pac_1 = require("./pac");
const anim_1 = require("./anim");
const fire_1 = require("./fire");
const prefab_1 = require("./prefab");
const js_1 = require("./js");
const ts_1 = require("./ts");
const tsx_1 = require("./tsx");
const bin_1 = require("./bin");
const dbbin_1 = require("./dbbin");
const effect_1 = require("./effect");
const gltf_1 = require("./gltf");
const label_atlas_1 = require("./label-atlas");
const atlas_1 = require("./atlas");
const sac_1 = require("./sac");
const pmtl_1 = require("./pmtl");
const skel_1 = require("./skel");
const skeleton_1 = require("./skeleton");
const video_1 = require("./video");
const path_1 = require("path");
// 存储需要转换的列表
const keys = [];
exports.converterMap = new Map();
function register(Importer, extnames) {
    extnames.forEach(extname => {
        if (!keys.includes(extname)) {
            keys.push(extname);
        }
        exports.converterMap.set(extname, new Importer());
    });
}
function initConvert() {
    keys.length = 0;
    exports.converterMap.clear();
}
/**
 * 排序
 * @param {object} tree
 */
function bubbleSort(tree) {
    let i, j, stop;
    const len = tree.length;
    for (i = 0; i < len; i++) {
        for (j = 0, stop = len - i; j < stop - 1; j++) {
            const a = tree[j], b = tree[j + 1];
            const aIndex = keys.indexOf((0, path_1.extname)(a.detail.value));
            const bIndex = keys.indexOf((0, path_1.extname)(b.detail.value));
            if (aIndex > bIndex) {
                const temp = tree[j];
                tree[j] = tree[j + 1];
                tree[j + 1] = temp;
            }
        }
    }
    return tree;
}
exports.bubbleSort = bubbleSort;
function getConverter(exatname) {
    return exports.converterMap.get(exatname);
}
exports.getConverter = getConverter;
function registerConverter() {
    initConvert();
    (0, diff_1.initDiff)();
    (0, utlis_1.init2DChunks)();
    register(image_1.ImageImporter, ['.png', '.jpg', '.jpeg', '.webp']); // 完成
    register(text_1.TextImporter, ['.pem', '.txt', '.html', '.htm', '.xml', '.css', '.less', '.scss', '.styl', '.stylus', '.yaml', '.ini', '.csv', '.proto', '.md', '.markdown']); // 完成
    register(audio_1.AudioImporter, ['.mp3', '.wav', '.ogg', '.aac', '.pcm', '.m4a']); // 完成
    register(video_1.VideoImporter, ['.mp4']); // 完成
    register(ttf_1.TTFFontImporter, ['.ttf']); // 完成
    register(fnt_1.BitmapImporter, ['.fnt']); // 完成
    register(bin_1.BinImporter, ['.bin']); // 完成
    register(dbbin_1.DbbinImporter, ['.dbbin']); // 完成
    register(sac_1.SacImporter, ['.sac']); // 完成
    register(json_1.JSONImporter, ['.json']); // 完成
    register(atlas_1.AtlasImporter, ['.atlas']); // 完成
    register(pmtl_1.PhysicsMaterialImporter, ['.pmtl']);
    register(gltf_1.GltfImporter, ['.gltf']); // 完成
    register(skel_1.SkelImporter, ['.skel']);
    register(skeleton_1.SkeletonImporter, ['.skeleton']);
    register(tsx_1.TsxImporter, ['.tsx']); // 完成
    register(tmx_1.TmxImporter, ['.tmx']); // 完成
    register(fbx_1.FbxImporter, ['.fbx', '.FBX']); // 完成
    register(plist_1.PlistImporter, ['.plist']); // 完成
    register(pac_1.AutoAtlasImporter, ['.pac']); // 完成
    register(label_atlas_1.LabelAtlasImporter, ['.labelatlas']); // 完成
    register(effect_1.EffectImporter, ['.effect']);
    register(mtl_1.MaterialImporter, ['.mtl']);
    register(anim_1.AnimImporter, ['.anim']);
    register(prefab_1.PrefabImporter, ['.prefab']);
    register(fire_1.FireImporter, ['.fire']);
    // 代码最后导入
    register(js_1.JSImporter, ['.js']); // 完成
    register(ts_1.TSImporter, ['.ts']); // 完成
}
exports.registerConverter = registerConverter;
