System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, AudioUtils, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, GridView;

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
      Node = _cc.Node;
    }, function (_unresolved_2) {
      AudioUtils = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d0d1fDj9rlDx5QUtP+2toQV", "GridView", undefined);
      /**
      * 根据cell的model返回对应的view
      */


      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GridView", GridView = (_dec = ccclass('GridView'), _dec2 = property([cc.Prefab]), _dec3 = property(Node), _dec4 = property(_crd && AudioUtils === void 0 ? (_reportPossibleCrUseOfAudioUtils({
        error: Error()
      }), AudioUtils) : AudioUtils), _dec(_class = (_class2 = class GridView extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "aniPre", _descriptor, this);

          _initializerDefineProperty(this, "effectLayer", _descriptor2, this);

          _initializerDefineProperty(this, "audioUtils", _descriptor3, this);
        }

        onLoad() {// this.setListener(); 
          // this.lastTouchPos = cc.Vec2(-1, -1); 
          // this.isCanMove = true; 
          // this.isInPlayAni = false; // 是否在播放中 
        }

        setController(controller) {// this.controller = controller; 
        }

        initWithCellModels(cellsModels) {// this.cellViews = []; 
          // for(var i = 1;i<=9;i++){ 
          // this.cellViews[i] = []; 
          // for(var j = 1;j<=9;j++){ 
          // var type = cellsModels[i][j].type; 
          // var aniView = cc.instantiate(this.aniPre[type]); 
          // aniView.parent = this.node; 
          // var cellViewScript = aniView.getComponent("CellView"); 
          // cellViewScript.initWithModel(cellsModels[i][j]); 
          // this.cellViews[i][j] = aniView; 
          // } 
          // } 
        }

        setListener() {// this.node.on(cc.Node.EventType.TOUCH_START, function(eventTouch){ 
          // if(this.isInPlayAni){//播放动画中，不允许点击 
          // return true; 
          // } 
          // var touchPos = eventTouch.getLocation(); 
          // var cellPos = this.convertTouchPosToCell(touchPos); 
          // if(cellPos){ 
          // var changeModels = this.selectCell(cellPos); 
          // this.isCanMove = changeModels.length < 3; 
          // } 
          // else{ 
          // this.isCanMove = false; 
          // } 
          // return true; 
          // }, this); 
          // this.node.on(cc.Node.EventType.TOUCH_MOVE, function(eventTouch){ 
          // if(this.isCanMove){ 
          // var startTouchPos = eventTouch.getStartLocation (); 
          // var startCellPos = this.convertTouchPosToCell(startTouchPos); 
          // var touchPos = eventTouch.getLocation(); 
          // var cellPos = this.convertTouchPosToCell(touchPos); 
          // if(startCellPos.x != cellPos.x || startCellPos.y != cellPos.y){ 
          // this.isCanMove = false; 
          // var changeModels = this.selectCell(cellPos);  
          // } 
          // } 
          // }, this); 
          // this.node.on(cc.Node.EventType.TOUCH_END, function(eventTouch){ 
          // }, this); 
          // this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(eventTouch){ 
          // }, this); 
        }

        convertTouchPosToCell(pos) {// pos = this.node.convertToNodeSpace(pos); 
          // if(pos.x < 0 || pos.x >= GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= GRID_PIXEL_HEIGHT){ 
          // return false; 
          // } 
          // var x = Math.floor(pos.x / CELL_WIDTH) + 1; 
          // var y = Math.floor(pos.y / CELL_HEIGHT) + 1; 
          // return cc.v2(x, y); 
        }

        updateView(changeModels) {// let newCellViewInfo = []; 
          // for(var i in changeModels){ 
          // var model = changeModels[i]; 
          // var viewInfo = this.findViewByModel(model); 
          // var view = null; 
          // if(!viewInfo){ 
          // var type = model.type; 
          // var aniView = cc.instantiate(this.aniPre[type]); 
          // aniView.parent = this.node; 
          // var cellViewScript = aniView.getComponent("CellView"); 
          // cellViewScript.initWithModel(model); 
          // view = aniView; 
          // } 
          // else{ 
          // view = viewInfo.view; 
          // this.cellViews[viewInfo.y][viewInfo.x] = null; 
          // } 
          // var cellScript = view.getComponent("CellView"); 
          // cellScript.updateView();// 执行移动动作 
          // if (!model.isDeath) { 
          // newCellViewInfo.push({ 
          // model: model, 
          // view: view 
          // }); 
          // }  
          // } 
          // newCellViewInfo.forEach(function(ele){ 
          // let model = ele.model; 
          // this.cellViews[model.y][model.x] = ele.view; 
          // },this); 
        }

        updateSelect(pos) {// for(var i = 1;i <=9 ;i++){ 
          // for(var j = 1 ;j <=9 ;j ++){ 
          // if(this.cellViews[i][j]){ 
          // var cellScript = this.cellViews[i][j].getComponent("CellView"); 
          // if(pos.x == j && pos.y ==i){ 
          // cellScript.setSelect(true); 
          // } 
          // else{ 
          // cellScript.setSelect(false); 
          // } 
          // } 
          // } 
          // } 
        }

        findViewByModel(model) {// for(var i = 1;i <=9 ;i++){ 
          // for(var j = 1 ;j <=9 ;j ++){ 
          // if(this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model){ 
          // return {view:this.cellViews[i][j],x:j, y:i}; 
          // } 
          // } 
          // } 
          // return null; 
        }

        getPlayAniTime(changeModels) {// if(!changeModels){ 
          // return 0; 
          // } 
          // var maxTime = 0; 
          // changeModels.forEach(function(ele){ 
          // ele.cmd.forEach(function(cmd){ 
          // if(maxTime < cmd.playTime + cmd.keepTime){ 
          // maxTime = cmd.playTime + cmd.keepTime; 
          // } 
          // },this) 
          // },this); 
          // return maxTime; 
        }

        getStep(effectsQueue) {// if(!effectsQueue){ 
          // return 0; 
          // } 
          // return effectsQueue.reduce(function(maxValue, efffectCmd){ 
          // return Math.max(maxValue, efffectCmd.step || 0); 
          // }, 0); 
        }

        disableTouch(time, step) {// if(time <= 0){ 
          // return ; 
          // } 
          // this.isInPlayAni = true; 
          // this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){ 
          // this.isInPlayAni = false; 
          // this.audioUtils.playContinuousMatch(step); 
          // }, this))); 
        }

        selectCell(cellPos) {// var result = this.controller.selectCell(cellPos); // 直接先丢给model处理数据逻辑 
          // var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子 
          // var effectsQueue = result[1]; //各种特效 
          // this.playEffect(effectsQueue); 
          // this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue)); 
          // this.updateView(changeModels); 
          // this.controller.cleanCmd();  
          // if(changeModels.length >= 2){ 
          // this.updateSelect(cc.v2(-1,-1)); 
          // this.audioUtils.playSwap(); 
          // } 
          // else{ 
          // this.updateSelect(cellPos); 
          // this.audioUtils.playClick(); 
          // } 
          // return changeModels; 
        }

        playEffect(effectsQueue) {// this.effectLayer.getComponent("EffectLayer").playEffects(effectsQueue); 
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "aniPre", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "effectLayer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "audioUtils", [_dec4], {
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
      // import {CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT, ANITIME} from '../Model/ConstValue';
      // 
      // import AudioUtils from "../Utils/AudioUtils";
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
      //         aniPre: {
      //             default: [],
      //             type: [cc.Prefab]
      //         },
      //         effectLayer: {
      //             default: null,
      //             type: cc.Node
      //         },
      //         audioUtils:{
      //             type: AudioUtils,
      //             default: null
      //         }
      //         
      //     },
      // 
      // 
      //     // use this for initialization
      //     onLoad: function () {
      //         this.setListener();
      //         this.lastTouchPos = cc.Vec2(-1, -1);
      //         this.isCanMove = true;
      //         this.isInPlayAni = false; // 是否在播放中
      //     },
      //     setController: function(controller){
      //         this.controller = controller;
      //     },
      // 
      //     initWithCellModels: function(cellsModels){
      //         this.cellViews = [];
      //         for(var i = 1;i<=9;i++){
      //             this.cellViews[i] = [];
      //             for(var j = 1;j<=9;j++){
      //                 var type = cellsModels[i][j].type;
      //                 var aniView = cc.instantiate(this.aniPre[type]);
      //                 aniView.parent = this.node;
      //                 var cellViewScript = aniView.getComponent("CellView");
      //                 cellViewScript.initWithModel(cellsModels[i][j]);
      //                 this.cellViews[i][j] = aniView;
      //             }
      //         }
      //     },
      //     setListener: function(){
      //         this.node.on(cc.Node.EventType.TOUCH_START, function(eventTouch){
      //             if(this.isInPlayAni){//播放动画中，不允许点击
      //                 return true;
      //             }
      //             var touchPos = eventTouch.getLocation();
      //             var cellPos = this.convertTouchPosToCell(touchPos);
      //             if(cellPos){
      //                 var changeModels = this.selectCell(cellPos);
      //                 this.isCanMove = changeModels.length < 3;
      //             }
      //             else{
      //                 this.isCanMove = false;
      //             }
      //            return true;
      //         }, this);
      //         // 滑动操作逻辑
      //         this.node.on(cc.Node.EventType.TOUCH_MOVE, function(eventTouch){
      //            if(this.isCanMove){
      //                var startTouchPos = eventTouch.getStartLocation ();
      //                var startCellPos = this.convertTouchPosToCell(startTouchPos);
      //                var touchPos = eventTouch.getLocation();
      //                var cellPos = this.convertTouchPosToCell(touchPos);
      //                if(startCellPos.x != cellPos.x || startCellPos.y != cellPos.y){
      //                    this.isCanMove = false;
      //                    var changeModels = this.selectCell(cellPos); 
      //                }
      //            }
      //         }, this);
      //         this.node.on(cc.Node.EventType.TOUCH_END, function(eventTouch){
      //           // console.log("1111");
      //         }, this);
      //         this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(eventTouch){
      //           // console.log("1111");
      //         }, this);
      //     },
      //     // 根据点击的像素位置，转换成网格中的位置
      //     convertTouchPosToCell: function(pos){
      //         pos = this.node.convertToNodeSpace(pos);
      //         if(pos.x < 0 || pos.x >= GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= GRID_PIXEL_HEIGHT){
      //             return false;
      //         }
      //         var x = Math.floor(pos.x / CELL_WIDTH) + 1;
      //         var y = Math.floor(pos.y / CELL_HEIGHT) + 1;
      //         return cc.v2(x, y);
      //     },
      //     // 移动格子
      //     updateView: function(changeModels){
      //         let newCellViewInfo = [];
      //         for(var i in changeModels){
      //             var model = changeModels[i];
      //             var viewInfo = this.findViewByModel(model);
      //             var view = null;
      //             // 如果原来的cell不存在，则新建
      //             if(!viewInfo){
      //                 var type = model.type;
      //                 var aniView = cc.instantiate(this.aniPre[type]);
      //                 aniView.parent = this.node;
      //                 var cellViewScript = aniView.getComponent("CellView");
      //                 cellViewScript.initWithModel(model);
      //                 view = aniView;
      //             }
      //             // 如果已经存在
      //             else{
      //                 view = viewInfo.view;
      //                 this.cellViews[viewInfo.y][viewInfo.x] = null;
      //             }
      //             var cellScript = view.getComponent("CellView");
      //             cellScript.updateView();// 执行移动动作
      //             if (!model.isDeath) {
      //                 newCellViewInfo.push({
      //                     model: model,
      //                     view: view
      //                 });
      //             } 
      //         }
      //         // 重新标记this.cellviews的信息
      //         newCellViewInfo.forEach(function(ele){
      //             let model = ele.model;
      //             this.cellViews[model.y][model.x] = ele.view;
      //         },this);
      //     },
      //     // 显示选中的格子背景
      //     updateSelect: function(pos){
      //          for(var i = 1;i <=9 ;i++){
      //             for(var j = 1 ;j <=9 ;j ++){
      //                 if(this.cellViews[i][j]){
      //                     var cellScript = this.cellViews[i][j].getComponent("CellView");
      //                     if(pos.x == j && pos.y ==i){
      //                         cellScript.setSelect(true);
      //                     }
      //                     else{
      //                         cellScript.setSelect(false);
      //                     }
      // 
      //                 }
      //             }
      //         }
      //         
      //     },
      //     /**
      //      * 根据cell的model返回对应的view
      //      */
      //     findViewByModel: function(model){
      //         for(var i = 1;i <=9 ;i++){
      //             for(var j = 1 ;j <=9 ;j ++){
      //                 if(this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model){
      //                     return {view:this.cellViews[i][j],x:j, y:i};
      //                 }
      //             }
      //         }
      //         return null;
      //     },
      //     getPlayAniTime: function(changeModels){
      //         if(!changeModels){
      //             return 0;
      //         }
      //         var maxTime = 0;
      //         changeModels.forEach(function(ele){
      //             ele.cmd.forEach(function(cmd){
      //                 if(maxTime < cmd.playTime + cmd.keepTime){
      //                     maxTime = cmd.playTime + cmd.keepTime;
      //                 }
      //             },this)
      //         },this);
      //         return maxTime;
      //     },
      //     // 获得爆炸次数， 同一个时间算一个
      //     getStep: function(effectsQueue){
      //         if(!effectsQueue){
      //             return 0;
      //         }
      //         return effectsQueue.reduce(function(maxValue, efffectCmd){
      //             return Math.max(maxValue, efffectCmd.step || 0);
      //         }, 0);
      //     },
      //     //一段时间内禁止操作
      //     disableTouch: function(time, step){
      //         if(time <= 0){
      //             return ;
      //         }
      //         this.isInPlayAni = true;
      //         this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
      //             this.isInPlayAni = false;
      //             this.audioUtils.playContinuousMatch(step);
      //         }, this)));
      //     },
      //     // 正常击中格子后的操作
      //     selectCell: function(cellPos){
      //         var result = this.controller.selectCell(cellPos); // 直接先丢给model处理数据逻辑
      //         var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
      //         var effectsQueue = result[1]; //各种特效
      //         this.playEffect(effectsQueue);
      //         this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
      //         this.updateView(changeModels);
      //         this.controller.cleanCmd(); 
      //         if(changeModels.length >= 2){
      //             this.updateSelect(cc.v2(-1,-1));
      //             this.audioUtils.playSwap();
      //         }
      //         else{
      //             this.updateSelect(cellPos);
      //             this.audioUtils.playClick();
      //         }
      //         return changeModels;
      //     },
      //     playEffect: function(effectsQueue){
      //         this.effectLayer.getComponent("EffectLayer").playEffects(effectsQueue);
      //     }
      // 
      // 
      // 
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
//# sourceMappingURL=4fbc570e3318d308dbc211995f3cc64e5212a1cc.js.map