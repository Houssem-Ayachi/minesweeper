export enum SquareTypes {
    NUMBER,
    BOMB,
}

export enum SquareState {
    HIDDEN,
    VISIBLE,
    QUESTIONED,
    SCOUTED,
}

export default class Square{
    public _x: number;
    public _y: number;
    public _value: number = 0;
    public _type: SquareTypes;
    public _state: SquareState;//the square is rendered differently depending on it's state;

    constructor(x: number, y: number, type: SquareTypes){
        this._x = x;
        this._y = y;
        this._type = type;
        this._state = SquareState.HIDDEN;
    }

    toggleQuestioned(){
        if(this._state !== SquareState.VISIBLE)
            this._state = this._state === SquareState.HIDDEN ? SquareState.QUESTIONED : SquareState.HIDDEN;
    }

    
    showSquare(){
        this._state = SquareState.VISIBLE;
    }
    
    markAsScouted(){
        if(this._state === SquareState.HIDDEN){
            this._state = SquareState.SCOUTED;
        }
    }

    markAsQuestioned(){
        this._state = SquareState.QUESTIONED;
    }

    markAsHidden(){
        this._state = SquareState.HIDDEN;
    }

    markAsBomb(){
        this._type = SquareTypes.BOMB;
    }
    
    incrementSquareValue(){
        if(this._type !== SquareTypes.BOMB)
            this._value++;
    }

}