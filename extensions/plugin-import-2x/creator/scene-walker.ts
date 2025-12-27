// @ts-ignore
import { writeFileSync, existsSync, ensureDirSync } from 'fs-extra';
import { join } from "path";

const out_path = join(Editor.App.path, 'builtin/importer/creator/components');

exports.ready = function() {};
exports.close = function() {};

const RENAME_COMPONENT = {
    'cc.BoxCollider': 'cc.BoxCollider2D',
    'cc.BoxCollider3D': 'cc.BoxCollider',
    'cc.CircleCollider': 'cc.CircleCollider2D',
    'cc.Collider': 'cc.Collider2D',
    'cc.Collider3D': 'cc.Collider',
    'cc.DistanceJoint': 'cc.DistanceJoint2D',
    'cc.ClickEvent': 'cc.EventHandler',
    'cc.MouseJoint': 'cc.MouseJoint2D',
    'cc.WheelJoint': 'cc.WheelJoint2D',
    'cc.PolygonCollider': 'cc.PolygonCollider2D',
    'cc.ParticleSystem': 'cc.ParticleSystem2D',
    'cc.ParticleSystem3D': 'cc.ParticleSystem',
    'cc.Joint': 'cc.Joint2D',
    'cc.RenderComponent': 'cc.RenderableComponent',
    'cc.RigidBody': 'cc.RigidBody2D',
    'cc.RigidBody3D': 'cc.RigidBody',
    'cc.SphereCollider3D': 'cc.SphereCollider',
};


const CLASS = [`AnimationCurve`, 'Keyframe', 'GradientRange', 'Gradient',
               'Burst', 'ShapeModule', 'ColorOvertimeModule', 'SizeOvertimeModule', 'TrailMode',
               'VelocityOvertimeModule', 'ForceOvertimeModule', 'LimitVelocityOvertimeModule',
               'RotationOvertimeModule', 'TextureAnimationModule', 'TrailModule', 'ColorKey', 'AlphaKey'];

exports.methods = {
    onSerializeComponent() {
        const totalClassElements: Map<string, any> = new Map<string, any>();
        const classElements: any[] = [];
        const cccc = require('cc');
        for (const key in cccc) {
            const element = cccc[key];
            if (cccc.CCClass._isCCClass(element) && !classElements.includes(element.name)) {
                totalClassElements.set(element.name, element);
                classElements.push(element.name);
            }
        }
        for (const name of CLASS) {
            const element = cccc.js.getClassByName(name);
            if (cccc.CCClass._isCCClass(element) && !classElements.includes(element.name)) {
                totalClassElements.set(element.name, element);
                classElements.push(element.name);
            }
            else {
                console.log(name);
            }
        }
        classElements.sort();
        for (let i = 0; i < classElements.length; ++i) {
            const name = classElements[i];
            const Class = totalClassElements.get(name);
            try {
                // @ts-ignoret
                const serialize = EditorExtends.serialize(new Class());
                const json = JSON.parse(serialize);
                delete json._id;
                if (Array.isArray(json)) {
                    json.forEach((obj) => {
                        delete obj._id;
                    });
                }
                let jsonStr = `'use strict';\n`;
                const baseClassName = Class.name.toUpperCase();
                jsonStr += `export const ${baseClassName} = ${JSON.stringify(json, null, 4)};\n\n`;
                jsonStr += `export class ${Class.name} {\n\n`;
                jsonStr += `    static create() {\n`;
                jsonStr += `        return JSON.parse(JSON.stringify(${baseClassName}));\n`;
                jsonStr += `    }\n\n`;
                jsonStr += `    static async migrate(json2D: any) {\n`;
                jsonStr += `        const source = JSON.parse(JSON.stringify(${baseClassName}));\n`;
                jsonStr += `        for (const key in json2D) {\n`;
                jsonStr += `            let value = json2D[key];\n`;
                jsonStr += `            if (value === undefined || value === null) { continue; }\n`;
                jsonStr += `            source[key] = value;\n`;
                jsonStr += `        }\n`;
                jsonStr += `        return source;\n`;
                jsonStr += `    }\n\n`;
                jsonStr += `    static async apply(index: number, json2D: any, json3D: any) {\n`;
                jsonStr += `        let source = await ${Class.name}.migrate(json2D[index]);\n`;
                jsonStr += `        json3D.splice(index, 1, source);\n`;
                jsonStr += `        return source;\n`;
                jsonStr += `    }\n`;
                jsonStr += `}\n`;
                const path = join(out_path, Class.name + '.ts');
                if (!existsSync(path)) {
                    ensureDirSync(out_path);
                    writeFileSync(path, jsonStr);
                }
            }
            catch (e) {
                console.error(e);
            }

        }

        // let jsonStr = '';
        // classElements.forEach((name) => {
        //     jsonStr += `import { ${name} } from "./${name}";\n`;
        // });
        // jsonStr += `\n`;
        // jsonStr += `const CCCLASS_LIST = {\n`;
        // classElements.forEach((name) => {
        //     jsonStr += `    'cc.${name}': ${name},\n`;
        // });
        // jsonStr += `};\n\n`;
        // jsonStr += `const RENAME_COMPONENT = {\n`;
        // for (let key in RENAME_COMPONENT) {
        //     // @ts-ignore
        //     jsonStr += `    '${key}': '${RENAME_COMPONENT[key]}',\n`;
        // }
        // jsonStr += `};\n\n`;
        // jsonStr += `export class MigrateManager {\n\n`;
        // jsonStr += `    static async add(index: number, json2D: any, json3D: any) {\n`;
        // jsonStr += `        let element2D = json2D[index];\n`;
        // jsonStr += `        let type = element2D.__type__ || element2D[0].__type__;// 粒子存的是数组\n`;
        // jsonStr += `        // @ts-ignore\n`;
        // jsonStr += `        type = RENAME_COMPONENT[type];\n`;
        // jsonStr += `        // @ts-ignore\n`;
        // jsonStr += `        const CCClass = CCCLASS_LIST[type];\n`;
        // jsonStr += `        if (CCClass) {\n`;
        // jsonStr += `            return await CCClass.apply(index, json2D, json3D);\n`;
        // jsonStr += `        }\n`;
        // jsonStr += `        else {\n`;
        // jsonStr += `            console.log('未适配类型：' + type + ' ' + index);\n`;
        // jsonStr += `            let source = {};\n`;
        // jsonStr += `            for (let key in element2D) {\n`;
        // jsonStr += `                // @ts-ignore\n`;
        // jsonStr += `                source[key] = element2D[key];\n`;
        // jsonStr += `            }\n`;
        // jsonStr += `            json3D.splice(index, 1, source);\n`;
        // jsonStr += `            return source;\n`;
        // jsonStr += `        }\n`;
        // jsonStr += `    }\n`;
        // jsonStr += `}\n`;
        // let path = join(out_path, 'MigrateManager.ts');
        // if (!existsSync(path)) {
        //     writeFileSync(path, jsonStr);
        // }
    },
};
