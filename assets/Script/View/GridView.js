cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        aniPre :{
            default: [],
            type: [cc.Prefab]
        },
        
    },


    // use this for initialization
    onLoad: function () {
        this.setListener();
        this.lastTouchPos = cc.Vec2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false; // 是否在播放中
    },
    setController: function(controller){
        this.controller = controller;
    },

    initWithCellModels: function(cellsModels){
        this.cellViews = [];
        for(var i = 1;i<=9;i++){
            this.cellViews[i] = [];
            for(var j = 1;j<=9;j++){
                var type = cellsModels[i][j].type;
                var aniView = cc.instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(cellsModels[i][j]);
                this.cellViews[i][j] = aniView;
            }
        }
    },
    setListener: function(){
        this.node.on(cc.Node.EventType.TOUCH_START, function(eventTouch){
            if(this.isInPlayAni){
                return true;
            }
            var touchPos = eventTouch.getLocation();
            var cellPos = this.convertTouchPosToCell(touchPos);
            if(cellPos){
                var changeModels = this.controller.selectCell(cellPos);
                this.disableTouch(this.getPlayAniTime(changeModels));
                this.updateView(changeModels);
                this.controller.cleanCmd(); 
                if(changeModels.length >= 3){
                    this.isCanMove = false;
                    this.updateSelect(cc.p(-1,-1));
                }
                else{
                    this.isCanMove = true;
                    this.updateSelect(cellPos);
                }
            }
            else{
                this.isCanMove = false;
            }
           return true;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(eventTouch){
           if(this.isCanMove){
               var startTouchPos = eventTouch.getStartLocation ();
               var startCellPos = this.convertTouchPosToCell(startTouchPos);
               var touchPos = eventTouch.getLocation();
               var cellPos = this.convertTouchPosToCell(touchPos);
               if(startCellPos.x != cellPos.x || startCellPos.y != cellPos.y){
                   this.isCanMove = false;
                   var changeModels = this.controller.selectCell(cellPos);
                    this.disableTouch(this.getPlayAniTime(changeModels));
                    if(changeModels.length >=3 ){
                        this.updateSelect(cc.p(-1,-1));
                    }
                    else{
                        this.updateSelect(cellPos);
                    }
                    this.updateView(changeModels);
                    this.controller.cleanCmd();    
               }
           }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(eventTouch){
          // console.log("1111");
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(eventTouch){
          // console.log("1111");
        }, this);
    },
    convertTouchPosToCell: function(pos){
        pos = this.node.convertToNodeSpace(pos);
        if(pos.x < 0 || pos.x >= GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= GRID_PIXEL_HEIGHT){
            return false;
        }
        var x = Math.floor(pos.x / CELL_WIDTH) + 1;
        var y = Math.floor(pos.y / CELL_HEIGHT) + 1;
        return cc.p(x, y);
    },
    updateView: function(changeModels){
        let newCellViewInfo = [];
        for(var i in changeModels){
            var model = changeModels[i];
            var viewInfo = this.findViewByModel(model);
            var view = null;
            if(!viewInfo){
                var type = model.type;
                var aniView = cc.instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(model);
                view = aniView;
            }
            else{
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }
            var cellScript = view.getComponent("CellView");
            cellScript.updateView();
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            } 
        }
        newCellViewInfo.forEach(function(ele){
            let model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        },this);
    },
    updateSelect: function(pos){
         for(var i = 1;i <=9 ;i++){
            for(var j = 1 ;j <=9 ;j ++){
                if(this.cellViews[i][j]){
                    var cellScript = this.cellViews[i][j].getComponent("CellView");
                    if(pos.x == j && pos.y ==i){
                        cellScript.setSelect(true);
                    }
                    else{
                        cellScript.setSelect(false);
                    }

                }
            }
        }
        
    },
    findViewByModel: function(model){
        for(var i = 1;i <=9 ;i++){
            for(var j = 1 ;j <=9 ;j ++){
                if(this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model){
                    return {view:this.cellViews[i][j],x:j, y:i};
                }
            }
        }
        return null;
    },
    getPlayAniTime: function(changeModels){
        if(!changeModels){
            return 0;
        }
        var maxTime = 0;
        changeModels.forEach(function(ele){
            ele.cmd.forEach(function(cmd){
                if(maxTime < cmd.playTime + cmd.keepTime){
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            },this)
        },this);
        console.log("getPlayAniTime = ", maxTime);
        return maxTime;
    },
    disableTouch: function(time){
        if(time <= 0){
            return ;
        }
        this.isInPlayAni = true;
        this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
            this.isInPlayAni = false;
        }, this)));
    }




    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
