
export const CELL_TYPE = {
    EMPTY : 0,
    A : 1,
    B : 2,
    C : 3,
    D : 4,
    E : 5,
    F : 6,
    BIRD : 7
}
export const CELL_BASE_NUM = 6;
export const CELL_STATUS = {
    NORMAL: "normal" ,
    CLICK: "click",
    ROW: "row",
    COLUMN: "column",
    WRAP: "wrap",
    BIRD: "bird"
} 

export const GRID_WIDTH = 9;
export const GRID_HEIGHT = 9;

export const CELL_WIDTH = 70;
export const CELL_HEIGHT = 70;

export const GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
export const GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT;


// ********************   时间表  animation time **************************
export const ANITIME = {
    TOUCH_MOVE: 0.3,
    DIE: 0.2,
    DOWN: 0.5,
    DOWN_DELAY: 0.3,
    BOMB_DELAY: 0.3,
    BOMB_BIRD_DELAY: 0.7,
    DIE_SHAKE: 0.4 // 死前抖动
};

export const CELL_NAME_PREFIX = "cell_name_";
export const CELL_MIN_MOVE_NUM = 2; //cell发生移动时， 最小数量


