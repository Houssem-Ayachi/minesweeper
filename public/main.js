import Grid from "./grid.js";
import UI from "./ui.js";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const uiContainer = document.querySelector("#uiContainer");
const options = { rows: 14, cols: 18, numberBombs: 40, squareWidth: 40 };
const playground = new Grid(ctx, options);
const initCanvas = () => {
    canvas.width = options.cols * options.squareWidth;
    canvas.height = options.rows * options.squareWidth;
};
const init = () => {
    UI.addUIContainer(uiContainer);
    UI.flushElements();
    initCanvas();
    playground.fillGrid();
    playground.generateBombs();
    playground.drawGrid();
    UI.addUiElement("bombs", "bombs", options.numberBombs.toString());
};
//main game loop
const update = () => {
    setInterval(() => {
        playground.updateGrid();
        const numberOfVisibleSquares = playground.numberOfVisibleSquares();
        UI.updateElement("bombs", (options.numberBombs - playground.numberOfQuestionedSquares()).toString());
        if (numberOfVisibleSquares === playground._numberOfSafeSquares) {
            //PLAYER WON!!
            gameAlert("You WON!!!");
        }
    }, 50);
};
const gameAlert = (message) => {
    setTimeout(() => {
        alert(message);
        restart();
    }, 100);
};
const restart = () => {
    init();
};
//get the square on which the mouse just pressed
const getMouseGridPos = (x, y) => {
    let _y = Math.floor(x / options.squareWidth);
    let _x = Math.floor(y / options.squareWidth);
    if (_y === options.cols)
        _y--;
    return { x: _x, y: _y };
};
// handling left click
//reveal squares
canvas.addEventListener("click", e => {
    const { x, y } = getMouseGridPos(e.clientX, e.clientY);
    if (playground.isEmptySquare(x, y)) {
        playground.showAllEmptySquares(x, y);
    }
    else {
        const isBomb = playground.showSquareContent(x, y);
        if (isBomb) {
            gameAlert("You LOST!");
        }
    }
});
// handling left click
canvas.addEventListener("mousedown", e => {
    //middle mouse button pressed
    if (e.buttons === 4) {
        const { x, y } = getMouseGridPos(e.clientX, e.clientY);
        const bombFound = playground.scoutNeighbors(x, y);
        if (bombFound)
            gameAlert("You LOST!");
    }
});
//I'm using this to handle middle mouse button release
//It might seem weird caus iss not checking whether iss the middle button released or not but everything works this way hehe
canvas.addEventListener("mouseup", e => {
    playground.releaseScoutedSquares();
});
// handling right click
// -> to mark squares with a question mark
canvas.addEventListener("contextmenu", e => {
    e.preventDefault();
    const { x, y } = getMouseGridPos(e.clientX, e.clientY);
    playground.toggleQuestioned(x, y);
});
init();
update();
