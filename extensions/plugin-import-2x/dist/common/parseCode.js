"use strict";
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
exports.parseTSCode = exports.parseJSCode = void 0;
const utlis_1 = require("./utlis");
function getType(val) {
    if (!isNaN(Number(val))) {
        return undefined;
    }
    if (val === 'false' || val === 'true') {
        return undefined;
    }
    if (val === 'null' || val === 'undefined') {
        return undefined;
    }
    // 数组
    if (val.startsWith('[') && val.endsWith(']')) {
        return [];
    }
    val = val.split('(')[0];
    if (!val.includes('cc')) {
        return undefined;
    }
    if (val.startsWith('cc.')) {
        const array = val.split('.');
        if (array.length > 3) {
            return array[1];
        }
    }
    return val;
}
function getInfo(line, skip = false) {
    let values = line.split(':');
    if (values.length <= 1) {
        // 函数
        values = line.split('(');
    }
    if (values.length <= 1) {
        return {
            key: line,
            value: line,
        };
    }
    let value = values[1].trim().split(',')[0];
    if (!skip) {
        value = value.replace(/'|"|,/g, '');
    }
    return {
        key: values[0].trim(),
        value: value,
    };
}
function syncIndex(line, index) {
    let result = line.match(/\{/g);
    if (result && result.length > 0) {
        index += result.length;
    }
    result = line.match(/\}/g);
    if (result && result.length > 0) {
        index -= result.length;
    }
    return index;
}
function createContent(name) {
    return {
        name: name,
        extends: '',
        mixins: '',
        editors: {},
        statics: {},
        properties: {},
        functions: {},
    };
}
function parseJSCode(path, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let otherIndex = 0;
        let classCodeIndex = 0;
        const classCodeMap = new Map();
        const importCodeMap = new Map();
        const otherCodeMap = new Map();
        const endCodeMap = new Map();
        const ccKeys = [];
        let openClass = false;
        let classIndex = 0;
        let openName = undefined;
        let openExtends = undefined;
        let openMixins = undefined;
        let openEditors = undefined;
        let propTotalIndex = 0;
        let subPropName = '';
        let subPropIndex = 0;
        let hasGet = undefined;
        let getIndex = 0;
        let hasSet = undefined;
        let setIndex = 0;
        let hasNotify = undefined;
        let notifyIndex = 0;
        let openSubProp = undefined;
        let openProperties = undefined;
        let staticIndex = 0;
        let subStaticIndex = 0;
        let subStaticName = undefined;
        let openStatics = undefined;
        let funcName = '';
        let funcIndex = 0;
        let openFunctions = undefined;
        let content;
        let isSkips = false;
        let topNote = '';
        yield (0, utlis_1.readWriteFileByLineWithProcess)(path, (line) => {
            try {
                // 剔除空格
                let noTrimLine = line;
                line = line.trim();
                if (line.startsWith('/*')) {
                    isSkips = true;
                    topNote += (line + '\n');
                    return;
                }
                if (isSkips) {
                    isSkips = !line.endsWith('*/');
                    topNote += (line + '\n');
                    return;
                }
                // 直接过滤注释文字
                if (line.startsWith('/') || line.startsWith('*') || !line) {
                    return;
                }
                if (!openClass) {
                    if (line.includes('cc.Class(')) {
                        openClass = true;
                        classIndex = 1;
                        classCodeIndex = classCodeMap.size;
                        content = createContent(name);
                        if (!classCodeMap.has(classCodeIndex)) {
                            classCodeMap.set(classCodeIndex, content);
                        }
                    }
                    else {
                        if (line.includes('require')) {
                            importCodeMap.set(importCodeMap.size, line);
                        }
                        else {
                            const ccKeyArr = line.match(/(?<=cc.)(.*?)(?=[.|,|;|)|}|(])/);
                            const ccKey = ccKeyArr && ccKeyArr[0];
                            if (ccKey) {
                                ccKeys.push(ccKey);
                            }
                            if (classCodeMap.size === 0) {
                                otherIndex = syncIndex(line, otherIndex);
                                if (line.includes('cc.runtime')) {
                                    otherIndex -= 1;
                                    noTrimLine = '//' + noTrimLine;
                                }
                                if (ccKey) {
                                    if (ccKey.includes('=') || ccKey.includes('function')) {
                                        noTrimLine = noTrimLine.replace(`cc.${ccKey}`, `const ${ccKey}`);
                                    }
                                    else {
                                        noTrimLine = noTrimLine.replace(`cc.${ccKey}`, ccKey);
                                    }
                                    const multiple = noTrimLine.match(new RegExp(ccKey, 'g'));
                                    if (multiple && multiple.length > 1) {
                                        noTrimLine = '//' + noTrimLine;
                                    }
                                }
                                otherCodeMap.set(otherCodeMap.size, noTrimLine);
                            }
                            else if (classCodeMap.size > 0) {
                                otherIndex = syncIndex(line, otherIndex);
                                if (otherIndex < 0) {
                                    noTrimLine = '//' + line;
                                }
                                endCodeMap.set(endCodeMap.size, noTrimLine);
                            }
                        }
                    }
                }
                else if (openClass) {
                    // --------------- 检测是否解析类完毕 ---------------
                    classIndex = syncIndex(line, classIndex);
                    if (classIndex === 0 &&
                        (line.endsWith('});') || line.endsWith('})') || line.endsWith(');') || line.endsWith(')') || line.endsWith(';'))) {
                        openClass = false;
                        classCodeMap.set(classCodeIndex, content);
                        return;
                    }
                    if (openProperties === undefined && openFunctions === undefined && openStatics === undefined) {
                        // --------------- 获取 name ---------------
                        if (openName === undefined && line.startsWith('name:')) {
                            openName = true;
                        }
                        if (openName) {
                            content.name = getInfo(line).value;
                            if (line.endsWith(',')) {
                                openName = false;
                            }
                            return;
                        }
                        // --------------- 获取继承 ---------------
                        if (openExtends === undefined && line.startsWith('extends:')) {
                            openExtends = true;
                        }
                        if (openExtends) {
                            content.extends = getInfo(line).value;
                            if (line.endsWith(',')) {
                                openExtends = false;
                            }
                            return;
                        }
                        // --------------- 获取 mixins ---------------
                        if (openMixins === undefined && line.startsWith('mixins:')) {
                            openMixins = true;
                        }
                        if (openMixins) {
                            content.mixins = getInfo(line).value;
                            if (line.endsWith(',')) {
                                openMixins = false;
                            }
                            return;
                        }
                        // --------------- 获取 editor ---------------
                        if (openEditors === undefined && line.startsWith('editor:')) {
                            openEditors = true;
                            return;
                        }
                        if (openEditors) {
                            if (line.endsWith('},')) {
                                openEditors = false;
                                return;
                            }
                            const info = getInfo(line);
                            content.editors[info.key] = info.value;
                            return;
                        }
                    }
                    // --------------- 获取 properties ---------------
                    if (openProperties === undefined && line.startsWith('properties:')) {
                        propTotalIndex = syncIndex(line, propTotalIndex);
                        if (propTotalIndex === 0) {
                            return;
                        }
                        openProperties = true;
                        return;
                    }
                    if (openProperties) {
                        if (openSubProp === undefined && line.includes('{')) {
                            subPropIndex = syncIndex(line, subPropIndex);
                            const info = getInfo(line);
                            subPropName = info.key;
                            content.properties[subPropName] = {
                                hasGet: undefined,
                                hasSet: undefined,
                                notify: undefined,
                                type: undefined,
                                default: undefined,
                                visible: undefined,
                                serializable: undefined,
                                content: '',
                            };
                            if (subPropIndex === 0) {
                                content.properties[subPropName].content = line;
                                return;
                            }
                            openSubProp = true;
                            return;
                        }
                        if (openSubProp) {
                            subPropIndex = syncIndex(line, subPropIndex);
                            if (subPropIndex === 0 && (line.endsWith('},') || line.endsWith('}'))) {
                                openSubProp = undefined;
                                return;
                            }
                            const subProp = content.properties[subPropName];
                            subProp.content += (line + '\n');
                            if (hasGet === undefined && line.includes('get:')) {
                                getIndex = syncIndex(line, getIndex);
                                if (getIndex === 0) {
                                    subProp.hasGet = noTrimLine + '\n';
                                    return;
                                }
                                subProp.hasGet = `    get ${subPropName} () {\n`;
                                hasGet = true;
                                return;
                            }
                            if (hasGet) {
                                getIndex = syncIndex(line, getIndex);
                                if (getIndex === 0 && (line.endsWith('},') || line.endsWith('}'))) {
                                    hasGet = undefined;
                                    subProp.hasGet += '    }';
                                    return;
                                }
                                else {
                                    subProp.hasGet += '        ' + noTrimLine.substring(noTrimLine.search(/\S/), noTrimLine.length) + '\n';
                                }
                                return;
                            }
                            if (hasSet === undefined && line.includes('set:')) {
                                setIndex = syncIndex(line, setIndex);
                                let params = line.match(/(?<=\()(.*)(?=\))/);
                                params = params ? params[0].split(',') : [];
                                let str = '';
                                for (let i = 0; i < params.length; ++i) {
                                    const param = params[i].trim();
                                    if (param === '') {
                                        continue;
                                    }
                                    if (i > 0) {
                                        str += ' ';
                                    }
                                    str += `${param}: any`;
                                    if (i < params.length - 1) {
                                        str += ',';
                                    }
                                }
                                if (setIndex === 0) {
                                    subProp.hasSet = noTrimLine + '\n';
                                    return;
                                }
                                subProp.hasSet = `    set ${subPropName} (${str}) {\n`;
                                hasSet = true;
                                return;
                            }
                            if (hasSet) {
                                setIndex = syncIndex(line, setIndex);
                                if (setIndex === 0 && (line.endsWith('},') || line.endsWith('}'))) {
                                    hasSet = undefined;
                                    subProp.hasSet += '    }';
                                    return;
                                }
                                else {
                                    subProp.hasSet += '        ' + noTrimLine.substring(noTrimLine.search(/\S/), noTrimLine.length) + '\n';
                                }
                                return;
                            }
                            if (hasNotify === undefined && line.includes('notify')) {
                                notifyIndex = syncIndex(line, notifyIndex);
                                if (notifyIndex === 0) {
                                    subProp.notify = noTrimLine + '\n';
                                    return;
                                }
                                hasNotify = true;
                                subProp.notify = line + '\n';
                                return;
                            }
                            if (hasNotify) {
                                notifyIndex = syncIndex(line, notifyIndex);
                                if (notifyIndex === 0 && (line.endsWith('},') || line.endsWith('}'))) {
                                    hasNotify = undefined;
                                    subProp.notify += '}';
                                }
                                else {
                                    subProp.notify += line + '\n';
                                }
                                return;
                            }
                            const info = getInfo(line);
                            if (subProp.default === undefined && line.includes('default:')) {
                                subProp.default = info.value;
                            }
                            if (subProp.type === undefined && line.includes('type:')) {
                                subProp.type = info.value;
                            }
                            if (subProp.visible === undefined && line.includes('visible:')) {
                                subProp.visible = info.value;
                            }
                            if (subProp.serializable === undefined && line.includes('serializable:')) {
                                subProp.serializable = info.value;
                            }
                        }
                        else {
                            propTotalIndex = syncIndex(line, propTotalIndex);
                            if (propTotalIndex === 0 && (line.endsWith('},') || line.endsWith('}'))) {
                                openProperties = undefined;
                                return;
                            }
                            const info = getInfo(line);
                            let type = getType(info.value);
                            if (Array.isArray(type)) {
                                if (info.value.length > 2) {
                                    type = 'array:' + info.value.substring(1, info.value.length - 1);
                                }
                                else {
                                    type = undefined;
                                }
                            }
                            const value = info.value;
                            content.properties[info.key] = {
                                hasGet: undefined,
                                hasSet: undefined,
                                notify: undefined,
                                type: type,
                                default: value,
                                visible: undefined,
                                serializable: undefined,
                                content: line,
                            };
                        }
                        return;
                    }
                    // --------------- 获取 statics ---------------
                    if (openStatics === undefined && line.startsWith('statics:')) {
                        staticIndex = syncIndex(line, staticIndex);
                        if (staticIndex === 0) {
                            return;
                        }
                        openStatics = true;
                        return;
                    }
                    if (openStatics) {
                        staticIndex = syncIndex(line, staticIndex);
                        if (staticIndex === 0 && (line.endsWith('},') || line.endsWith(','))) {
                            openStatics = false;
                            subStaticName = undefined;
                            return;
                        }
                        if (subStaticName === undefined && line.includes('function')) {
                            const info = getInfo(line);
                            subStaticIndex = syncIndex(line, subStaticIndex);
                            let params = line.match(/(?<=\()(.*)(?=\))/);
                            params = params ? params[0].split(',') : [];
                            let str = '';
                            for (let i = 0; i < params.length; ++i) {
                                const param = params[i].trim();
                                if (param === '') {
                                    continue;
                                }
                                if (i > 0) {
                                    str += ' ';
                                }
                                str += `${param}: any`;
                                if (i < params.length - 1) {
                                    str += ',';
                                }
                            }
                            if (subStaticIndex === 0) {
                                content.statics[info.key] = {
                                    parameter: '',
                                    content: noTrimLine + '\n',
                                };
                                return;
                            }
                            subStaticName = info.key;
                            content.statics[subStaticName] = {
                                parameter: params ? params[0] : '',
                                content: `    public static ${subPropName} (${str}) {\n`,
                            };
                            return;
                        }
                        if (subStaticName !== undefined) {
                            subStaticIndex = syncIndex(line, subStaticIndex);
                            if (subStaticIndex === 0 && (line.endsWith('},') || line.endsWith('}'))) {
                                content.statics[subStaticName].content += '    }';
                                return;
                            }
                            content.statics[subStaticName].content += ('    ' + noTrimLine.substring(noTrimLine.search(/\S/), noTrimLine.length) + '\n');
                        }
                        else {
                            const info = getInfo(line);
                            content.statics[info.key] = {
                                parameter: '',
                                content: `    public static ${info.key} = ${info.value};\n`,
                            };
                        }
                        return;
                    }
                    // --------------- 获取函数 ---------------
                    if (openFunctions === undefined) {
                        const info = getInfo(line);
                        funcName = info.key;
                        let params = line.match(/(?<=\()(.*)(?=\))/);
                        if (params) {
                            params = params[0].split(',');
                            let str = '';
                            for (let i = 0; i < params.length; ++i) {
                                const param = params[i].trim();
                                if (param === '') {
                                    continue;
                                }
                                if (i > 0) {
                                    str += ' ';
                                }
                                str += `${param}: any`;
                                if (i < params.length - 1) {
                                    str += ',';
                                }
                            }
                            content.functions[funcName] = {
                                parameter: params ? params[0] : '',
                                content: `    ${funcName} (${str}) {\n`,
                            };
                            funcIndex = syncIndex(line, funcIndex);
                            if (funcIndex === 0) {
                                content.functions[funcName].content += '    }\n\n';
                                return;
                            }
                            openFunctions = true;
                        }
                        else {
                            content.properties[info.key] = {
                                hasGet: undefined,
                                hasSet: undefined,
                                notify: undefined,
                                type: undefined,
                                default: info.value,
                                visible: undefined,
                                serializable: undefined,
                                content: line,
                            };
                            return;
                        }
                        return;
                    }
                    if (openFunctions) {
                        funcIndex = syncIndex(line, funcIndex);
                        if (funcIndex === 0 && (line.endsWith('},') || line.endsWith('}'))) {
                            openFunctions = undefined;
                            content.functions[funcName].content += '    }\n\n';
                            return;
                        }
                        const func = content.functions[funcName];
                        const len = noTrimLine.search(/\S/);
                        func.content += `${noTrimLine.substring(0, len)}// ${noTrimLine.substring(len, noTrimLine.length)} \n`;
                        return;
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
        });
        return {
            topNote,
            ccKeys,
            classCodeMap,
            importCodeMap,
            otherCodeMap,
            endCodeMap,
        };
    });
}
exports.parseJSCode = parseJSCode;
function match(line, regExpStr, global = '') {
    try {
        const regExp = new RegExp(`(?<=${regExpStr})([a-zA-Z0-9]+)`, global);
        const result = line.match(regExp);
        if (result) {
            if (!global) {
                return result[result.length - 1];
            }
            else {
                let arr = [];
                for (let element of result) {
                    arr.push(element);
                }
                return arr;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    return null;
}
function getRegExp(str, global = '') {
    return new RegExp(str, global);
}
function addCode(content, code, enter = true) {
    if (code) {
        content += code;
        if (enter) {
            content += '\n';
        }
    }
    return content;
}
const RENAME_COMPONENT = {
    'BoxCollider': 'BoxCollider2D',
    'BoxCollider3D': 'BoxCollider',
    'CircleCollider': 'CircleCollider2D',
    'Collider': 'Collider2D',
    'Collider3D': 'Collider',
    'DistanceJoint': 'DistanceJoint2D',
    'ClickEvent': 'EventHandler',
    'MouseJoint': 'MouseJoint2D',
    'WheelJoint': 'WheelJoint2D',
    'PolygonCollider': 'PolygonCollider2D',
    'ParticleSystem': 'ParticleSystem2D',
    'ParticleSystem3D': 'ParticleSystem',
    'Joint': 'Joint2D',
    'RigidBody': 'RigidBody2D',
    'RigidBody3D': 'RigidBody',
    'SphereCollider3D': 'SphereCollider',
    'RenderComponent': 'UIRenderable',
    'SkeletonAnimation': 'SkeletalAnimation',
    'Float': 'CCFloat',
    'string': 'CCString',
    'Boolean': 'CCBoolean',
    'Integer': 'CCInteger',
};
function parseTSCode(baseClassName, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let isTop = true;
        let isOther = false;
        let topCode = '';
        let imports = ['_decorator'];
        let decoratorCode = '';
        let otherImportCode = '';
        let otherDecoratorCode = '';
        let cccclassCode = '';
        let contentCode = '';
        let openClass = false;
        let waitOpenClass = false; // 需要检测到 { 才能开启 openClass
        let classIndex = 0;
        let openFunctions = undefined;
        let funcIndex = 0;
        let openConstructor = undefined;
        let constructorIndex = 0;
        function pushImports(name) {
            name = RENAME_COMPONENT[name] || name;
            if (!imports.includes(name)) {
                imports.push(name);
            }
            return name;
        }
        function replaceCodeByClassName(line, noTrimLine, isFunc) {
            let classNames;
            if (isFunc) {
                // 删除只需要判断是否是 cc.xx
                classNames = match(line, '\:? (cc\.)', 'g');
            }
            else {
                classNames = match(line, '\:? ?(cc\.)', 'g');
            }
            if (classNames) {
                let newline = noTrimLine;
                for (let className of classNames) {
                    let newClassName = pushImports(className);
                    let RegExp = getRegExp(`cc.${className}`, 'g');
                    if (noTrimLine.trim().replace(/ /g, '').includes(`${className}=null`)) {
                        newline = noTrimLine.replace(RegExp, `${newClassName} | null`);
                    }
                    else {
                        newline = noTrimLine.replace(RegExp, newClassName);
                    }
                }
                let matchArr = newline.match(/([a-zA-Z0-9]+)? =? ([a-zA-Z0-9]+)/);
                if (matchArr && matchArr[1] !== undefined && (matchArr[1] === matchArr[2])) {
                    return undefined;
                }
                return newline + '\n';
            }
            else if (noTrimLine) {
                return noTrimLine + '\n';
            }
        }
        yield (0, utlis_1.readWriteFileByLineWithProcess)(path, (line) => {
            try {
                // 剔除空格
                let noTrimLine = line;
                line = line.trim();
                if (!openClass) {
                    if (line.includes('export default class ') || line.includes('export class ') || waitOpenClass) {
                        // const name = match(line, 'class? ') as string;
                        // if (name) {
                        //     line = line.replace(name, baseClassName);
                        // }
                        let extend = match(line, 'extends ?(cc\.)');
                        if (extend) {
                            let newExtend = pushImports(extend);
                            contentCode += line.replace(`cc.${extend}`, newExtend);
                        }
                        else {
                            contentCode += line;
                        }
                        contentCode += '\n';
                        classIndex = syncIndex(line, classIndex);
                        if (classIndex === 0) {
                            waitOpenClass = true;
                            return;
                        }
                        waitOpenClass = false;
                        openClass = true;
                    }
                    else {
                        // 直接过滤注释文字
                        if (line.startsWith('/') || line.startsWith('*')) {
                            if (isTop) {
                                topCode += '// ' + noTrimLine + '\n';
                            }
                            else if (isOther) {
                                otherImportCode += '// ' + noTrimLine + '\n';
                            }
                        }
                        else if (line.includes('cc._decorator')) {
                            isTop = false;
                            decoratorCode += noTrimLine.replace(/cc._decorator/, '_decorator') + '\n';
                        }
                        else if (line.includes('@ccclass')) {
                            cccclassCode = noTrimLine;
                        }
                        else if (line.startsWith('@')) {
                            otherDecoratorCode += noTrimLine;
                        }
                        else {
                            isOther = true;
                            if (!line) {
                                return;
                            }
                            let newline = replaceCodeByClassName(line, noTrimLine);
                            if (newline === undefined) {
                                otherImportCode += `// ${noTrimLine}\n`;
                            }
                            else if (newline) {
                                otherImportCode += newline;
                            }
                        }
                    }
                }
                else {
                    // 直接过滤注释文字
                    if (line.startsWith('/') || line.startsWith('*')) {
                        contentCode += '//' + noTrimLine + '\n';
                        return;
                    }
                    // --------------- 检测是否解析类完毕 ---------------
                    classIndex = syncIndex(line, classIndex);
                    if (classIndex === 0 && (line.endsWith('}') || line.endsWith('};'))) {
                        contentCode += '}\n\n';
                        openClass = false;
                        return;
                    }
                    if (openFunctions === undefined) {
                        let newline = replaceCodeByClassName(line, noTrimLine);
                        if (newline !== undefined) {
                            if ((line.includes('constructor ()') || line.includes('constructor()'))) {
                                openConstructor = true;
                            }
                            contentCode += newline;
                        }
                    }
                    // 函数
                    if (openFunctions === undefined && line.match(/(?<=\()(.*)(?=\))/)) {
                        funcIndex = syncIndex(line, funcIndex);
                        if (funcIndex === 0) {
                            return;
                        }
                        openFunctions = true;
                        return;
                    }
                    if (openFunctions) {
                        funcIndex = syncIndex(line, funcIndex);
                        if (funcIndex === 0 && line.endsWith('}')) {
                            contentCode += noTrimLine;
                            contentCode += '\n';
                            openFunctions = undefined;
                            return;
                        }
                        if (line) {
                            if (openConstructor && line.startsWith('super();')) {
                                contentCode += '        ' + line;
                            }
                            else {
                                contentCode += '        // ' + line;
                            }
                        }
                        else {
                            contentCode += line;
                        }
                        contentCode += '\n';
                        return;
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
        });
        let content = '';
        content = addCode(content, topCode);
        let importCode = `import { `;
        for (let i = 0; i < imports.length; ++i) {
            importCode += imports[i];
            if (i < imports.length - 1) {
                importCode += ', ';
            }
        }
        importCode += ` } from 'cc';`;
        content = addCode(content, importCode);
        content = addCode(content, decoratorCode);
        content = addCode(content, otherImportCode);
        content = addCode(content, cccclassCode.replace(/@ccclass/, `@ccclass('${baseClassName}')`));
        content = addCode(content, otherDecoratorCode);
        // content = addCode(content, exportClassCode);
        content = addCode(content, contentCode);
        return {
            content: content,
        };
    });
}
exports.parseTSCode = parseTSCode;
