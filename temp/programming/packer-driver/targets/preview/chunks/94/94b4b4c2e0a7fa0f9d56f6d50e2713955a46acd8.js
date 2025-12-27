System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, AudioClip, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, AudioUtils;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      AudioClip = _cc.AudioClip;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fe151y+R2lFvas76dyah2Uf", "AudioUtils", undefined);

      __checkObsolete__(['_decorator', 'Component', 'AudioClip']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AudioUtils", AudioUtils = (_dec = ccclass('AudioUtils'), _dec2 = property(AudioClip), _dec3 = property(AudioClip), _dec4 = property([cc.AudioClip]), _dec5 = property([cc.AudioClip]), _dec(_class = (_class2 = class AudioUtils extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "swap", _descriptor, this);

          _initializerDefineProperty(this, "click", _descriptor2, this);

          _initializerDefineProperty(this, "eliminate", _descriptor3, this);

          _initializerDefineProperty(this, "continuousMatch", _descriptor4, this);
        }

        onLoad() {}

        start() {}

        playClick() {// cc.audioEngine.play(this.click, false, 1); 
        }

        playSwap() {// cc.audioEngine.play(this.swap, false, 1); 
        }

        playEliminate(step) {// step = Math.min(this.eliminate.length - 1, step); 
          // cc.audioEngine.play(this.eliminate[step], false, 1); 
        }

        playContinuousMatch(step) {// console.log("step = ", step); 
          // step = Math.min(step, 11); 
          // if(step < 2){ 
          // return  
          // } 
          // cc.audioEngine.play(this.continuousMatch[Math.floor(step/2) - 1], false, 1); 
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "swap", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "click", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "eliminate", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "continuousMatch", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));
      /**
       * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
       */
      // cc.Class({
      //     extends: cc.Component,
      // 
      //     properties: {
      //         swap: {
      //             type: cc.AudioClip,
      //             default: null
      //         },
      //         click: {
      //             type: cc.AudioClip,
      //             default: null
      //         },
      //         eliminate:{
      //             type: [cc.AudioClip],
      //             default: [],
      //         },
      //         continuousMatch:{
      //             type: [cc.AudioClip],
      //             default: []
      //         }
      //     },
      // 
      //     // LIFE-CYCLE CALLBACKS:
      // 
      //     onLoad () {
      //       
      //     },
      // 
      //     start () {
      // 
      //     },
      //     playClick: function(){
      //         cc.audioEngine.play(this.click, false, 1);
      //     },
      //     playSwap: function(){
      //         cc.audioEngine.play(this.swap, false, 1);
      //     },
      //     playEliminate: function(step){
      //         step = Math.min(this.eliminate.length - 1, step);
      //         cc.audioEngine.play(this.eliminate[step], false, 1);
      //     },
      //     playContinuousMatch: function(step){
      //         console.log("step = ", step);
      //         step = Math.min(step, 11);
      //         if(step < 2){
      //             return 
      //         }
      //         cc.audioEngine.play(this.continuousMatch[Math.floor(step/2) - 1], false, 1);
      //     }
      // 
      //     // update (dt) {},
      // });


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=94b4b4c2e0a7fa0f9d56f6d50e2713955a46acd8.js.map