System.register(["__unresolved_0", "cc", "__unresolved_1", "cc/env"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, assert, Component, BuiltinPipelineSettings, EDITOR, _dec, _dec2, _dec3, _class, _crd, ccclass, disallowMultiple, executeInEditMode, menu, requireComponent, BuiltinPipelinePassBuilder;

  function _reportPossibleCrUseOfBuiltinPipelineSettings(extras) {
    _reporterNs.report("BuiltinPipelineSettings", "./builtin-pipeline-settings", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPipelineSettings(extras) {
    _reporterNs.report("PipelineSettings2", "./builtin-pipeline", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      assert = _cc.assert;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      BuiltinPipelineSettings = _unresolved_2.BuiltinPipelineSettings;
    }, function (_ccEnv) {
      EDITOR = _ccEnv.EDITOR;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6f940g8/JJDi6Fbog7GFmbH", "builtin-pipeline-pass", undefined);
      /*
       Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.
      
       https://www.cocos.com/
      
       Permission is hereby granted, free of charge, to any person obtaining a copy
       of this software and associated documentation files (the "Software"), to deal
       in the Software without restriction, including without limitation the rights to
       use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
       of the Software, and to permit persons to whom the Software is furnished to do so,
       subject to the following conditions:
      
       The above copyright notice and this permission notice shall be included in
       all copies or substantial portions of the Software.
      
       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
       IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
       FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
       AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
       LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
       OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
       THE SOFTWARE.
      */


      __checkObsolete__(['_decorator', 'assert', 'Component', 'rendering']);

      ({
        ccclass,
        disallowMultiple,
        executeInEditMode,
        menu,
        requireComponent
      } = _decorator);

      _export("BuiltinPipelinePassBuilder", BuiltinPipelinePassBuilder = (_dec = ccclass('BuiltinPipelinePassBuilder'), _dec2 = menu('Rendering/BuiltinPipelinePassBuilder'), _dec3 = requireComponent(_crd && BuiltinPipelineSettings === void 0 ? (_reportPossibleCrUseOfBuiltinPipelineSettings({
        error: Error()
      }), BuiltinPipelineSettings) : BuiltinPipelineSettings), _dec(_class = _dec2(_class = _dec3(_class = disallowMultiple(_class = executeInEditMode(_class = class BuiltinPipelinePassBuilder extends Component {
        constructor() {
          super(...arguments);
          this._parent = void 0;
          this._settings = void 0;
        }

        getConfigOrder() {
          return 0;
        }

        getRenderOrder() {
          return 200;
        }

        onEnable() {
          this._parent = this.getComponent(_crd && BuiltinPipelineSettings === void 0 ? (_reportPossibleCrUseOfBuiltinPipelineSettings({
            error: Error()
          }), BuiltinPipelineSettings) : BuiltinPipelineSettings);
          this._settings = this._parent.getPipelineSettings();

          if (!Object.prototype.hasOwnProperty.call(this._settings, '_passes')) {
            Object.defineProperty(this._settings, '_passes', {
              value: [],
              configurable: false,
              enumerable: false,
              writable: true
            });
          }

          assert(this._settings._passes !== undefined);

          this._settings._passes.push(this);

          if (EDITOR) {
            this._parent._tryEnableEditorPreview();
          }
        }

        onDisable() {
          assert(Object.prototype.hasOwnProperty.call(this._settings, '_passes'));
          var passes = this._settings._passes;
          assert(passes !== undefined);
          var idx = passes.indexOf(this);
          assert(idx >= 0);
          passes.splice(idx, 1);
        }

      }) || _class) || _class) || _class) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b37de22ab9dff6e9f979ab9e517f60b5b4ae4ba5.js.map