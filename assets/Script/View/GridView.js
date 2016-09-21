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
            var touchPos = eventTouch.getLocation();
            var cellPos = this.convertTouchPosToCell(touchPos);
            if(cellPos){
                var changeModels = this.controller.selectCell(cellPos);
                this.updateSelect(cellPos);
                this.updateView(changeModels);
                this.controller.cleanCmd();    
            }
           
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(){
           //console.log("1111");
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(){
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
        for(var i in changeModels){
            var model = changeModels[i];
            var view = this.findViewByModel(model);
            if(!view){
                var type = model.type;
                var aniView = cc.instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(model);
            }
             var cellScript = view.getComponent("CellView");
            cellScript.updateView();
            if(!model.isDeath){
                this.cells[model.y][model.x];
            } 
        }
        for(var i = 1;i <=9 ;i++){
            for(var j = 1 ;j <=9 ;j ++){
                if(this.cellViews[i][j]){
                    var cellScript = this.cellViews[i][j].getComponent("CellView");
                    cellScript.updateView();
                }
            }
        }
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
                if(this.cellViews[i][j] && this.cellViews[i][j].model == model){
                    return view;
                }
            }
        }
        return null;
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
