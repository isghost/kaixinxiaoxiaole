System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, AudioUtils, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, EffectLayer;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfAudioUtils(extras) {
    _reporterNs.report("AudioUtils", "../Utils/AudioUtils", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      AudioUtils = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0e925myn0dIjqdao1TpipF9", "EffectLayer", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EffectLayer", EffectLayer = (_dec = ccclass('EffectLayer'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property(_crd && AudioUtils === void 0 ? (_reportPossibleCrUseOfAudioUtils({
        error: Error()
      }), AudioUtils) : AudioUtils), _dec(_class = (_class2 = class EffectLayer extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "bombWhite", _descriptor, this);

          _initializerDefineProperty(this, "crushEffect", _descriptor2, this);

          _initializerDefineProperty(this, "audioUtils", _descriptor3, this);
        }

        onLoad() {}

        playEffects(effectQueue) {// if(!effectQueue || effectQueue.length <= 0){ 
          // return ; 
          // } 
          // let soundMap = {}; //某一时刻，某一种声音是否播放过的标记，防止重复播放 
          // effectQueue.forEach(function(cmd){ 
          // let delayTime = cc.delayTime(cmd.playTime); 
          // let callFunc = cc.callFunc(function(){ 
          // let instantEffect = null; 
          // let animation = null; 
          // if(cmd.action == "crush"){ 
          // instantEffect = cc.instantiate(this.crushEffect); 
          // animation  = instantEffect.getComponent(cc.Animation); 
          // animation.play("effect"); 
          // !soundMap["crush" + cmd.playTime] && this.audioUtils.playEliminate(cmd.step); 
          // soundMap["crush" + cmd.playTime] = true; 
          // } 
          // else if(cmd.action == "rowBomb"){ 
          // instantEffect = cc.instantiate(this.bombWhite); 
          // animation  = instantEffect.getComponent(cc.Animation); 
          // animation.play("effect_line"); 
          // } 
          // else if(cmd.action == "colBomb"){ 
          // instantEffect = cc.instantiate(this.bombWhite); 
          // animation  = instantEffect.getComponent(cc.Animation); 
          // animation.play("effect_col"); 
          // } 
          // instantEffect.x = CELL_WIDTH * (cmd.pos.x - 0.5); 
          // instantEffect.y = CELL_WIDTH * (cmd.pos.y - 0.5); 
          // instantEffect.parent = this.node; 
          // animation.on("finished",function(){ 
          // instantEffect.destroy(); 
          // },this); 
          // },this); 
          // this.node.runAction(cc.sequence(delayTime, callFunc)); 
          // },this); 
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bombWhite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "crushEffect", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "audioUtils", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      /**
       * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
       */
      // import {CELL_WIDTH} from '../Model/ConstValue';
      // 
      // import AudioUtils from "../Utils/AudioUtils";
      // cc.Class({
      //     extends: cc.Component,
      // 
      //     properties: {
      //         // foo: {
      //         //    default: null,      // The default value will be used only when the component attaching
      //         //                           to a node for the first time
      //         //    url: cc.Texture2D,  // optional, default is typeof default
      //         //    serializable: true, // optional, default is true
      //         //    visible: true,      // optional, default is true
      //         //    displayName: 'Foo', // optional
      //         //    readonly: false,    // optional, default is false
      //         // },
      //         // ...
      //         bombWhite:{
      //             default: null,
      //             type: cc.Prefab
      //         },
      //         crushEffect:{
      //             default: null,
      //             type: cc.Prefab
      //         },
      //         audioUtils:{
      //             type: AudioUtils,
      //             default: null
      //         }
      //     },
      // 
      //     // use this for initialization
      //     onLoad: function () {
      // 
      //     },
      //     playEffects: function(effectQueue){
      //         if(!effectQueue || effectQueue.length <= 0){
      //             return ;
      //         }
      //         let soundMap = {}; //某一时刻，某一种声音是否播放过的标记，防止重复播放
      //         effectQueue.forEach(function(cmd){
      //             let delayTime = cc.delayTime(cmd.playTime);
      //             let callFunc = cc.callFunc(function(){
      //                 let instantEffect = null;
      //                 let animation = null;
      //                 if(cmd.action == "crush"){
      //                     instantEffect = cc.instantiate(this.crushEffect);
      //                     animation  = instantEffect.getComponent(cc.Animation);
      //                     animation.play("effect");
      //                     !soundMap["crush" + cmd.playTime] && this.audioUtils.playEliminate(cmd.step);
      //                     soundMap["crush" + cmd.playTime] = true;
      //                 }
      //                 else if(cmd.action == "rowBomb"){
      //                     instantEffect = cc.instantiate(this.bombWhite);
      //                     animation  = instantEffect.getComponent(cc.Animation);
      //                     animation.play("effect_line");
      //                 }
      //                 else if(cmd.action == "colBomb"){
      //                     instantEffect = cc.instantiate(this.bombWhite);
      //                     animation  = instantEffect.getComponent(cc.Animation);
      //                     animation.play("effect_col");
      //                 }
      // 
      //                 instantEffect.x = CELL_WIDTH * (cmd.pos.x - 0.5);
      //                 instantEffect.y = CELL_WIDTH * (cmd.pos.y - 0.5);
      //                 instantEffect.parent = this.node;
      //                 animation.on("finished",function(){
      //                     instantEffect.destroy();
      //                 },this);
      //                
      //             },this);
      //             this.node.runAction(cc.sequence(delayTime, callFunc));
      //         },this);
      //     },
      // 
      //     // called every frame, uncomment this function to activate update callback
      //     // update: function (dt) {
      // 
      //     // },
      // });


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0da7869749d4735eb69e821779e8ee4b9bcb1e3d.js.map