global.CELL_TYPE = {
    EMPTY : 0,
    A : 1,
    B : 2,
    C : 3,
    D : 4,
    E : 5,
    F : 6,
    G : 7
}
global.CELL_BASENUM = 6;
global.CELL_STATUS = {
    COMMON: 0 ,
    CLICK: "click",
    LINE: "line",
    COLUMN: "column",
    WRAP: "wrap",
    BIRD: "brid"
} 

global.GRID_WIDTH = 9;
global.GRID_HEIGHT = 9;

global.CELL_WIDTH = 70;
global.CELL_HEIGHT = 70;

global.GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
global.GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT;


// ********************   时间表  animation time **************************
global.ANITIME = {
    TOUCH_MOVE: 0.3,
    DIE: 0.2,
    DOWN: 0.5,
    BOMB_DELAY: 0.3
}

global.isInArray = function(array, object){
    for(var i in array){
        if(array[i] == object){
            return true;
        }
    }
    return false;
}

global.mergeArray = function(arrayA, arrayB){
    var result = arrayA.concat();
    arrayB.forEach(function(element) {
        if(result.indexOf(element) == -1){
            result.push(element);
        }
    }, this);
     arrayB.forEach(function(element) {
        if(result.indexOf(element) == -1){
            result.push(element);
        }
    }, this);
    return result;
}
