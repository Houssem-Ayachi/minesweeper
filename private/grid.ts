import Square, {SquareState, SquareTypes} from "./square.js";

export type GridOptions = {
    rows: number,
    cols: number,
    numberBombs: number,
    squareWidth: number,
}

export default class Grid{
    private _ctx: CanvasRenderingContext2D;
    private _options: GridOptions;
    private _squareValueSideOffset: number = 9;
    private _squareSideOffset: number = 2;

    public _numberOfSafeSquares: number;
    public _grid: Square[][] = []; 

    constructor(ctx: CanvasRenderingContext2D, options: GridOptions){
        this._ctx = ctx;
        this._options = options;
        this._numberOfSafeSquares = (options.cols*options.rows) - options.numberBombs;
    }

    private drawSquareBackground(j: number, i: number, color: string){
        this._ctx.fillStyle = color;
        this._ctx.fillRect(j*this._options.squareWidth, (i)*this._options.squareWidth, this._options.squareWidth - this._squareSideOffset, this._options.squareWidth - this._squareSideOffset);
    }

    drawGrid(){
        for(let i=0;i<this._options.rows;i++){
            for(let j=0;j<this._options.cols;j++){
                this.drawSquareBackground(j, i, "green");
                const square = this._grid[i][j];
                this._ctx.font = "30px Arial";                
                if(square._state === SquareState.QUESTIONED){
                    this.drawSquareBackground(j, i, "white");
                    this._ctx.fillStyle = "green";
                    this._ctx.fillText("?", j*this._options.squareWidth + this._squareValueSideOffset, (i+1)*this._options.squareWidth - this._squareValueSideOffset);
                }
                else if(square._state === SquareState.VISIBLE){
                    if(square._type === SquareTypes.BOMB){
                        this.drawSquareBackground(j, i, "red");
                        this._ctx.fillStyle = "white";
                        this._ctx.fillText("X", j*this._options.squareWidth + this._squareValueSideOffset, (i+1)*this._options.squareWidth - this._squareValueSideOffset);
                    }else{
                        this.drawSquareBackground(j, i, "grey");
                        this._ctx.fillStyle = "white";
                        if(square._value > 0)
                            this._ctx.fillText(square._value.toString(), j*this._options.squareWidth + 9, (i+1)*this._options.squareWidth - 9);
                    }
                }else if(square._state === SquareState.SCOUTED){
                    this.drawSquareBackground(j, i, "grey");
                }
            }
        }
    }

    updateGrid(){
        this.drawGrid();
    }

    fillGrid(){
        const grid: Square[][] = [];
        for(let i=0;i<this._options.rows;i++){
            let row:Square[] = [];
            for(let j=0;j<this._options.cols;j++){
                const square = new Square(i, j, SquareTypes.NUMBER);
                row.push(square);
            }
            grid.push(row);
        }
        this._grid = grid;
    }

    incrementNeighbors(x: number, y: number){
        for(let square of this.getNeighbors(x, y)){
            if(square._type !== SquareTypes.BOMB)
                square.incrementSquareValue();
        }
    }

    generateBombs(){
        let numberGeneratedBombs = 0;   
        while(numberGeneratedBombs < this._options.numberBombs){
            const x = Math.floor(Math.random() * this._options.rows);
            const y = Math.floor(Math.random() * this._options.cols);
            if(this._grid[x][y]._type === SquareTypes.NUMBER){
                this._grid[x][y].markAsBomb();
                this.incrementNeighbors(x, y);
                numberGeneratedBombs++;
            }
        }
    }

    isEmptySquare(x: number, y: number){
        const square = this._grid[x][y];
        if(square._state === SquareState.QUESTIONED){
            return false;
        }
        if(square._type === SquareTypes.NUMBER){
            return square._value === 0;
        }
        return false;
    }

    //if the square is a bomb return true
    showSquareContent(x: number, y: number): boolean{
        const square = this._grid[x][y];
        if(square._state !== SquareState.QUESTIONED){
            square.showSquare();
            return square._type === SquareTypes.BOMB;
        }
        return false;
    }
    
    toggleQuestioned(x: number, y: number){
        const square = this._grid[x][y];
        if(square._state !== SquareState.VISIBLE){
            if(square._state === SquareState.HIDDEN){
                square.markAsQuestioned();
            }else{
                square.markAsHidden();
            }
        }
    }

    getNeighbors(x: number, y: number){
        let neighbors: Square[] = [];
        for(let i=x-1;i<=x+1;i++){
            if(i < 0 || i === this._options.rows) continue; // out of bounds
            for(let j=y-1;j<=y+1;j++){
                if(j < 0 || j === this._options.cols || (j==y && i==x)) continue; // out of bounds or is center square
                neighbors.push(this._grid[i][j]);
            }
        }
        return neighbors;
    }
    
    // simple BFS
    showAllEmptySquares(x: number, y: number){
        let visited: Square[] = [this._grid[x][y]];
        const isVisited = (x: number, y:number) => {
            for(let square of visited){
                if(square._x === x && square._y === y) return true;
            }
            return false;
        }
        let path: Square[] = [this._grid[x][y]];
        while(path.length > 0){
            path[0].showSquare();
            if(path[0]._value === 0){
                const neighbors = this.getNeighbors(path[0]._x, path[0]._y);
                for(let square of neighbors){
                    if(square._type !== SquareTypes.BOMB && square._state !== SquareState.QUESTIONED && !isVisited(square._x, square._y) && square._state === SquareState.HIDDEN){
                        path.push(square);
                        visited.push(square);
                    }
                }
            }
            path.shift();
        }
    }

    numberOfVisibleSquares(){
        let count = 0;
        for(let row of this._grid){
            for(let square of row){
                if(square._state === SquareState.VISIBLE) count++;
            }
        }
        return count;
    }

    numberOfQuestionedSquares(){
        let count = 0;
        for(let row of this._grid){
            for(let square of row){
                if(square._state === SquareState.QUESTIONED) count++;
            }
        }
        return count;
    }

    scoutNeighbors(x: number, y: number){
        const square = this._grid[x][y];
        const neighbors = this.getNeighbors(square._x, square._y);
        if(square._state === SquareState.VISIBLE){
            const questionedNeighbors = neighbors.reduce((prvValue, square): number => {
                return square._state === SquareState.QUESTIONED ? prvValue + 1 : prvValue;
            }, 0);
            if(questionedNeighbors === square._value && square._type !== SquareTypes.BOMB){
                for(let neighbor of neighbors){
                    if(neighbor._state !== SquareState.QUESTIONED){
                        neighbor.showSquare();
                        if(neighbor._type === SquareTypes.BOMB){
                            return true;
                        }else if(neighbor._value === 0){
                            this.showAllEmptySquares(neighbor._x, neighbor._y);
                        }
                    }
                }
            }
        }
        for(let square of neighbors){
            square.markAsScouted();
        }
        return false;
    }

    releaseScoutedSquares(){
        for(let row of this._grid){
            for(let square of row){
                if(square._state === SquareState.SCOUTED){
                    square._state = SquareState.HIDDEN;
                }
            }
        }
    }

    // DEBUGGING FUNCTIONS
    printGrid(){
        let grid: any[][] = [];
        for(let row of this._grid){
            let customRow: any[] = []
            for(let square of row){
                customRow.push({value: square._value, isBomb: square._type === SquareTypes.BOMB});
            }
            grid.push(customRow);
        }
        for(let row of grid){
            console.log(row);
        }
    }

    printListOfSquares(list: Square[]){
        const l: any[] = [];
        for(let i of list){
            l.push({x: i._x, y: i._y, value: i._value});
        }
        console.log(l);
    }

    showNeighbors(x: number, y: number){
        const square = this._grid[x][y];
        const neighbors = this.getNeighbors(square._x, square._y);
        console.log(neighbors);
        for(let n of neighbors){
            n.showSquare();
        }
    }

}