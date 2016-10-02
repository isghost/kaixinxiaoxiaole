function CellModel(){
    this.type = null;
    this.status = CELL_STATUS.COMMON;
    this.x = 1;
    this.y = 1;
    this.startX = 1;
    this.startY = 1;
    this.cmd = [];
    this.isDeath = false;
    this.objecCount = Math.floor(Math.random() * 1000);
}

CellModel.prototype.init= function(){
    this.type = Math.floor(Math.random() * 4 + 1);
}

CellModel.prototype.isEmpty = function(){
    return this.type == CELL_TYPE.EMPTY; 
}

CellModel.prototype.setEmpty = function(){
    this.type = CELL_TYPE.EMPTY;
}
CellModel.prototype.setXY = function(x,y){
    this.x = x;
    this.y = y;
}

CellModel.prototype.setStartXY = function(x,y){
    this.startX = x;
    this.startY = y;
}

CellModel.prototype.setStatus = function(status){
    this.status = status;
}

CellModel.prototype.moveToAndBack = function(pos){
    var srcPos = cc.p(this.x,this.y);
    this.cmd.push({
        action: "moveTo",
        keepTime: ANITIME.TOUCH_MOVE,
        playTime: 0,
        pos: pos
    });
    this.cmd.push({
        action: "moveTo",
        keepTime: ANITIME.TOUCH_MOVE,
        playTime: ANITIME.TOUCH_MOVE,
        pos: srcPos
    });
}

CellModel.prototype.moveTo = function(pos, playTime){
    var srcPos = cc.p(this.x,this.y);
    this.cmd.push({
        action: "moveTo",
        keepTime: ANITIME.TOUCH_MOVE,
        playTime: playTime,
        pos: pos
    });
    this.x = pos.x;
    this.y = pos.y;
}

CellModel.prototype.toDie = function(playTime){
    this.cmd.push({
        action: "toDie",
        playTime: playTime,
        keepTime: ANITIME.DIE
    });
    this.isDeath = true;
}

CellModel.prototype.moveToAndDie = function(pos){

}

global.CellModel = CellModel;