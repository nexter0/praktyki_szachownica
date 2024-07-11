export {Knight};

class Piece {
    /**
    * Create a chess piece.
    * @param {int} id
    * @param {string} colour
    * @param {int} x
    * @param {int} y
    * @param {int[][]} possibleMoves
    * @param {any} context
    * @param {HTMLImageElement} img
    */
    constructor(id, colour, x, y, context, bImg = null, wImg = null) {
        this.colour = colour;
        this.context = context;
        this.id = id;
        this.bImg = bImg;
        this.wImg = wImg;
        this.x = x;
        this.y = y;
        this.possibleMoves = null;
        this.img = this.getPieceImg()
 
    } 

    getPieceImg() {
        // (HTMLImageElement) Returns a HTMLImageElement with set src

        if (this.wImg == null || this.bImg == null)
            throw new Error("'Piece cannot be instantiated on its own. Create a child class eg. 'Knight'")

        let KnightImg = new Image();
    
        if (this.colour == "white")
            KnightImg.src = this.wImg;
        else
            KnightImg.src = this.bImg

        return KnightImg
    }

    place(checkboardDims, col = this.x, row = this.y) {
        // (void) Draws the knight image in the clicked square

        const x = col * checkboardDims.cellWidth + checkboardDims.margin;
        const y = row * checkboardDims.cellHeight + checkboardDims.margin;

        this.img.onload = () => {
            this.context.drawImage(this.img, x, y, checkboardDims.cellWidth, checkboardDims.cellHeight);
        };

        if (this.img.complete) {
            this.context.drawImage(this.img, x, y, checkboardDims.cellWidth, checkboardDims.cellHeight);
        }
    }

    drawEmptySquare(checkboardDims, col = this.x, row = this.y) {
        // (void) Draws an empty square at selected coords

        this.context.fillStyle = (row % 2 === col % 2) ? '#fff' : '#808080';
        this.context.fillRect(col * checkboardDims.cellWidth + checkboardDims.margin, row * checkboardDims.cellHeight +
             checkboardDims.margin, checkboardDims.cellWidth, checkboardDims.cellHeight);

        // redraw checkboard border if necessary
        if (col == 0 || row == 0 || col == 7 || row == 7) {
            this.context.strokeStyle = '#000';
            this.context.lineWidth = 4;
            this.context.strokeRect(checkboardDims.margin, checkboardDims.margin, checkboardDims.size, checkboardDims.size);
        }
    }

    isLegalMove(targetX, targetY) {
        // (bool) Returns if the move is legal for the piece

        const dx = targetX - this.x;
        const dy = targetY - this.y;

        for (var move of this.possibleMoves) {
            if (dx === move[0] && dy === move[1]) {
                return true;
            }
        }

        return false;
    }

    move(destX, destY, checkboardDims) {
        // (bool) Returns if a move was successful and redraws a square and piece

        if (!this.isLegalMove(destX, destY)) {
            alert("Illegal move.");
            return false;
        }
        
        this.drawEmptySquare(checkboardDims);
        this.place(checkboardDims, destX, destY);
        return true;
    }

};

class Knight extends Piece {
    constructor(id, colour, x, y, context){
        const bImg = './res/bKnight.png';
        const wImg = './res/wKnight.png';
        super(id, colour, x, y, context, bImg, wImg)
        this.possibleMoves = [[-1, 2], [1, 2], [1, -2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]]
    }
};