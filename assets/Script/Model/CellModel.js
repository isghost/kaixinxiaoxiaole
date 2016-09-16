var CELL_TYPE = {
    EMPTY : 0,
    A : 1,
    B : 2,
    C : 3,
    D : 4,
    E : 5,
    F : 6,
    G : 7
}
function CellModel(){
    this.type = 0;
}

CellModel.prototype.init= function(type){
    this.type = Math.floor(Math.random()*(Object.keys(CELL_TYPE).length - 1) + 1);
}

CellModel.prototype.isEmpty = function(){
    return this.type == CELL_TYPE.EMPTY; 
}

CellModel.prototype.setEmpty = function(){
    this.type = CELL_TYPE.EMPTY;
}

global.CellModel = CellModel;