export var SquareTypes;
(function (SquareTypes) {
    SquareTypes[SquareTypes["NUMBER"] = 0] = "NUMBER";
    SquareTypes[SquareTypes["BOMB"] = 1] = "BOMB";
})(SquareTypes || (SquareTypes = {}));
export var SquareState;
(function (SquareState) {
    SquareState[SquareState["HIDDEN"] = 0] = "HIDDEN";
    SquareState[SquareState["VISIBLE"] = 1] = "VISIBLE";
    SquareState[SquareState["QUESTIONED"] = 2] = "QUESTIONED";
    SquareState[SquareState["SCOUTED"] = 3] = "SCOUTED";
})(SquareState || (SquareState = {}));
export default class Square {
    constructor(x, y, type) {
        this._value = 0;
        this._x = x;
        this._y = y;
        this._type = type;
        this._state = SquareState.HIDDEN;
    }
    toggleQuestioned() {
        if (this._state !== SquareState.VISIBLE)
            this._state = this._state === SquareState.HIDDEN ? SquareState.QUESTIONED : SquareState.HIDDEN;
    }
    showSquare() {
        this._state = SquareState.VISIBLE;
    }
    markAsScouted() {
        if (this._state === SquareState.HIDDEN) {
            this._state = SquareState.SCOUTED;
        }
    }
    markAsQuestioned() {
        this._state = SquareState.QUESTIONED;
    }
    markAsHidden() {
        this._state = SquareState.HIDDEN;
    }
    markAsBomb() {
        this._type = SquareTypes.BOMB;
    }
    incrementSquareValue() {
        if (this._type !== SquareTypes.BOMB)
            this._value++;
    }
}
