System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, SpriteFrame, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, CellView;

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
      SpriteFrame = _cc.SpriteFrame;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fbf19Cx4ptFV62UZ7+qJJpQ", "CellView", undefined);
      /**
      * 智障的引擎设计，一群SB
      */


      __checkObsolete__(['_decorator', 'Component', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CellView", CellView = (_dec = ccclass('CellView'), _dec2 = property(SpriteFrame), _dec(_class = (_class2 = class CellView extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "defaultFrame", _descriptor, this);
        }

        onLoad() {// this.isSelect = false; 
        }

        initWithModel(model) {// this.model = model; 
          // var x = model.startX; 
          // var y = model.startY; 
          // this.node.x = CELL_WIDTH * (x - 0.5); 
          // this.node.y = CELL_HEIGHT * (y - 0.5); 
          // var animation  = this.node.getComponent(cc.Animation); 
          // if (model.status == CELL_STATUS.COMMON){ 
          // animation.stop(); 
          // }  
          // else{ 
          // animation.play(model.status); 
          // } 
        }

        updateView() {// var cmd = this.model.cmd; 
          // if(cmd.length <= 0){ 
          // return ; 
          // } 
          // var actionArray = []; 
          // var curTime = 0; 
          // for(var i in cmd){ 
          // if( cmd[i].playTime > curTime){ 
          // var delay = cc.delayTime(cmd[i].playTime - curTime); 
          // actionArray.push(delay); 
          // } 
          // if(cmd[i].action == "moveTo"){ 
          // var x = (cmd[i].pos.x - 0.5) * CELL_WIDTH; 
          // var y = (cmd[i].pos.y - 0.5) * CELL_HEIGHT; 
          // var move = cc.moveTo(ANITIME.TOUCH_MOVE, cc.v2(x,y)); 
          // actionArray.push(move); 
          // } 
          // else if(cmd[i].action == "toDie"){ 
          // if(this.status == CELL_STATUS.BIRD){ 
          // let animation = this.node.getComponent(cc.Animation); 
          // animation.play("effect"); 
          // actionArray.push(cc.delayTime(ANITIME.BOMB_BIRD_DELAY)); 
          // } 
          // var callFunc = cc.callFunc(function(){ 
          // this.node.destroy(); 
          // },this); 
          // actionArray.push(callFunc); 
          // } 
          // else if(cmd[i].action == "setVisible"){ 
          // let isVisible = cmd[i].isVisible; 
          // actionArray.push(cc.callFunc(function(){ 
          // if(isVisible){ 
          // this.node.opacity = 255; 
          // } 
          // else{ 
          // this.node.opacity = 0; 
          // } 
          // },this)); 
          // } 
          // else if(cmd[i].action == "toShake"){ 
          // let rotateRight = cc.rotateBy(0.06,30); 
          // let rotateLeft = cc.rotateBy(0.12, -60); 
          // actionArray.push(cc.repeat(cc.sequence(rotateRight, rotateLeft, rotateRight), 2)); 
          // } 
          // curTime = cmd[i].playTime + cmd[i].keepTime; 
          // } 
          // if(actionArray.length == 1){ 
          // this.node.runAction(actionArray[0]); 
          // } 
          // else{ 
          // this.node.runAction(cc.sequence(...actionArray)); 
          // } 
        }

        setSelect(flag) {// var animation = this.node.getComponent(cc.Animation); 
          // var bg = this.node.getChildByName("select"); 
          // if(flag == false && this.isSelect && this.model.status == CELL_STATUS.COMMON){ 
          // animation.stop(); 
          // this.node.getComponent(cc.Sprite).spriteFrame = this.defaultFrame; 
          // } 
          // else if(flag && this.model.status == CELL_STATUS.COMMON){ 
          // animation.play(CELL_STATUS.CLICK); 
          // } 
          // else if(flag && this.model.status == CELL_STATUS.BIRD){ 
          // animation.play(CELL_STATUS.CLICK); 
          // } 
          // bg.active = flag;  
          // this.isSelect = flag; 
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "defaultFrame", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      /**
       * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
       */
      // import {CELL_STATUS, CELL_WIDTH, CELL_HEIGHT, ANITIME} from '../Model/ConstValue';
      // 
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
      //         defaultFrame:{
      //             default: null,
      //             type: cc.SpriteFrame
      //         }
      //     },
      // 
      //     // use this for initialization
      //     onLoad: function () {
      //         //this.model = null;
      //         this.isSelect = false;
      //     },
      //     initWithModel: function(model){
      //         this.model = model;
      //         var x = model.startX;
      //         var y = model.startY;
      //         this.node.x = CELL_WIDTH * (x - 0.5);
      //         this.node.y = CELL_HEIGHT * (y - 0.5);
      //         var animation  = this.node.getComponent(cc.Animation);
      //         if (model.status == CELL_STATUS.COMMON){
      //             animation.stop();
      //         } 
      //         else{
      //             animation.play(model.status);
      //         }
      //     },
      //     // 执行移动动作
      //     updateView: function(){
      //         var cmd = this.model.cmd;
      //         if(cmd.length <= 0){
      //             return ;
      //         }
      //         var actionArray = [];
      //         var curTime = 0;
      //         for(var i in cmd){
      //             if( cmd[i].playTime > curTime){
      //                 var delay = cc.delayTime(cmd[i].playTime - curTime);
      //                 actionArray.push(delay);
      //             }
      //             if(cmd[i].action == "moveTo"){
      //                 var x = (cmd[i].pos.x - 0.5) * CELL_WIDTH;
      //                 var y = (cmd[i].pos.y - 0.5) * CELL_HEIGHT;
      //                 var move = cc.moveTo(ANITIME.TOUCH_MOVE, cc.v2(x,y));
      //                 actionArray.push(move);
      //             }
      //             else if(cmd[i].action == "toDie"){
      //                 if(this.status == CELL_STATUS.BIRD){
      //                     let animation = this.node.getComponent(cc.Animation);
      //                     animation.play("effect");
      //                     actionArray.push(cc.delayTime(ANITIME.BOMB_BIRD_DELAY));
      //                 }
      //                 var callFunc = cc.callFunc(function(){
      //                     this.node.destroy();
      //                 },this);
      //                 actionArray.push(callFunc);
      //             }
      //             else if(cmd[i].action == "setVisible"){
      //                 let isVisible = cmd[i].isVisible;
      //                 actionArray.push(cc.callFunc(function(){
      //                     if(isVisible){
      //                         this.node.opacity = 255;
      //                     }
      //                     else{
      //                         this.node.opacity = 0;
      //                     }
      //                 },this));
      //             }
      //             else if(cmd[i].action == "toShake"){
      //                 let rotateRight = cc.rotateBy(0.06,30);
      //                 let rotateLeft = cc.rotateBy(0.12, -60);
      //                 actionArray.push(cc.repeat(cc.sequence(rotateRight, rotateLeft, rotateRight), 2));
      //             }
      //             curTime = cmd[i].playTime + cmd[i].keepTime;
      //         }
      //         /**
      //          * 智障的引擎设计，一群SB
      //          */
      //         if(actionArray.length == 1){
      //             this.node.runAction(actionArray[0]);
      //         }
      //         else{
      //             this.node.runAction(cc.sequence(...actionArray));
      //         }
      // 
      //     },
      //     // called every frame, uncomment this function to activate update callback
      //     // update: function (dt) {
      // 
      //     // },
      //     setSelect: function(flag){
      //         var animation = this.node.getComponent(cc.Animation);
      //         var bg = this.node.getChildByName("select");
      //         if(flag == false && this.isSelect && this.model.status == CELL_STATUS.COMMON){
      //             animation.stop();
      //             this.node.getComponent(cc.Sprite).spriteFrame = this.defaultFrame;
      //         }
      //         else if(flag && this.model.status == CELL_STATUS.COMMON){
      //             animation.play(CELL_STATUS.CLICK);
      //         }
      //         else if(flag && this.model.status == CELL_STATUS.BIRD){
      //             animation.play(CELL_STATUS.CLICK);
      //         }
      //         bg.active = flag; 
      //         this.isSelect = flag;
      //     }
      // });


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=756db37d58ee7cd986b65950ed9352e2e4c9ba44.js.map