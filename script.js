import {Knight} from './pieces.js'

window.onload = function() {
    // (void) Executes on window load

    const canvas = document.getElementById('checkboardCanvas');         // HTMLElement Canvas
    const context = canvas.getContext('2d');                            // HTMLElement Context
    const confirmButton = document.getElementById('confirmButton');     // HTMLElement Confirm Button
    const moveButton = document.getElementById('moveButton');           // HTMLElement Move Button
    const moveTextBox = document.getElementById('moveInput');           // HTMLElement Move Text Box

    const checkboardDims = {                                   // An object with checkboard dimentions and sizes data
        
        rows: 8,
        cols: 8,
        margin: 30,
        size: canvas.width - 40,
    };  
    checkboardDims.cellWidth = checkboardDims.size / checkboardDims.cols;
    checkboardDims.cellHeight = checkboardDims.size / checkboardDims.rows;

    let selectedColour = "white";                               // Selected colour of a Piece to be placed
    let isInMovingMode = false;                                 // Boolean determining placing or moving mode.
    let checkboardSlots = createTwoDimArr();                    // Two dim array representing whole checkboard. It should contain Piece objects
    let pieceId = 0;                                            // Piece Id counter
    let selectedPiece = null;                                   // Selected Piece object

    function createTwoDimArr(arrSize = 8) {
        // (any[][]) Returns a 2 dim array filled with null of given size
        let arr = [];

        for (let i = 0; i < arrSize * arrSize; i++) {
            let row = Math.floor(i / arrSize);
            let col = i % arrSize;

            if (!arr[row]) {
                arr[row] = [];
            }

            arr[row][col] = null;
        }

        return arr;
    }

    function drawCheckboard(size, rows, cols) {
        // (void) Draws a checkboard of given size in the canvas

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // odd square - white, even square - black
                context.fillStyle = (row % 2 === col % 2) ? '#fff' : '#808080';
                context.fillRect(col * checkboardDims.cellWidth + checkboardDims.margin, row * checkboardDims.cellHeight +
                     checkboardDims.margin, checkboardDims.cellWidth, checkboardDims.cellHeight);
            }
        }

        // checkboard border
        context.strokeStyle = '#000';
        context.lineWidth = 4;
        context.strokeRect(checkboardDims.margin, checkboardDims.margin, size, size);
    }

    function drawCoordinates(size, rows, cols) {
        // (void) Draws coordinates around the checkboard

        context.fillStyle = '#000';
        context.font = '20px Arial';
        const colsId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        // on top
        for (let col = 0; col < cols; col++) {
            context.fillText(colsId[col], col * checkboardDims.cellWidth + checkboardDims.cellWidth / 2 - 5 + checkboardDims.margin, 20);
        }

        // on the left
        for (let row = 0; row < rows; row++) {
            context.fillText(checkboardDims.rows - row, 5, row * checkboardDims.cellHeight + checkboardDims.cellHeight / 2 + 5 + checkboardDims.margin);
        }
    }

    function cellToString(x, y) {
        // (arr[2]: str, int) Returns an array of chess coords of the square

        const colsId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        return [colsId[x], checkboardDims.rows - y];
    }

    function getMousePosition(event) {
        // (int, int) Returns relative mouse coords to the canvas 
    
        // get the size of the canvas
        const rect_size = canvas.getBoundingClientRect();
        // calculate mouse coords
        const x = event.clientX - rect_size.left;
        const y = event.clientY - rect_size.top;
    
        return {x, y};
    }
    
    function getSquareClicked(x, y) {
        // (int, int) Returns coordinates of the square that was clicked
    
        const col = Math.floor((x - checkboardDims.margin) / checkboardDims.cellWidth);
        const row = Math.floor((y - checkboardDims.margin) / checkboardDims.cellHeight);
    
        return {row, col};
    }

    function updateSelectedColour() {
        // (void) Updates piece colour selection
        const selectedRadioButton = document.querySelector('input[name="colour"]:checked');
        selectedColour = selectedRadioButton.value.toLowerCase();
    }

    function placePiece(col, row) {
        // (bool) Returns if action was successful and places a piece
        // Square occupied guard

        if (checkboardSlots[row][col] != null) {
            alert("You can't place another piece here. This square is occupied.");
            return false;
        }

        let knight = new Knight(pieceId, selectedColour, col, row, context)
        console.log(knight);
        checkboardSlots[row][col] = knight;
        knight.place(checkboardDims);
        pieceId++;
        console.log(checkboardSlots);

        return true;
    }

    function selectPiece(col, row) {
        // (void) Selects the clicked piece
        const coordsArr = cellToString(col, row);
        selectedPiece = checkboardSlots[row][col];
        if (selectedPiece != null) {
            alert(`${selectedPiece.constructor.name}: (${coordsArr[0]}${coordsArr[1]})`);
        }
    }

    function movePiece() {
        // (bool) Returns if a move was successful and does the move logic

        // No piece selected guard
        if (selectedPiece == null) {
            alert("Select a piece to move.");
            return false;
        }

        // Extract raw quare coordinates from user input
        const colsId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        var moveStr = moveTextBox.value.toUpperCase();
        var destinationX = colsId.indexOf(moveStr[0]);
        var destinationY = 8 - moveStr[1];

        // Invalid coords guard
        if (destinationX < 0 || destinationX > 7 || destinationY < 0 || destinationY > 7 || destinationX == null) {
            alert("Illegal coordinates. Please use chess notation, for example: 'B3'.\nYou can use letters A-H and numbers 1-8");
            return false;
        }

        // Square occupied guard
        if (checkboardSlots[destinationY][destinationX] != null) {
            alert("Illegal move. This square is occupied.");
            return false;
        }
            
        // Move the piece
        if (selectedPiece.move(destinationX, destinationY, checkboardDims)) {
            console.log(`${selectedPiece.constructor.name} (${selectedPiece.colour}) moves from (${selectedPiece.x, selectedPiece.y})` + 
                 `to (${destinationX}, ${destinationY}).`);
            checkboardSlots[selectedPiece.y][selectedPiece.x] = null;
            checkboardSlots[destinationY][destinationX] = selectedPiece;
            selectedPiece.x = destinationX;
            selectedPiece.y = destinationY;
            selectedPiece = null;
        }
        console.log(checkboardSlots);
    }

    // Drawing
    drawCheckboard(checkboardDims.size, checkboardDims.rows, checkboardDims.cols);
    drawCoordinates(checkboardDims, checkboardDims.rows, checkboardDims.cols);

    // Listeners
    canvas.addEventListener('click', function(event) {
        // (void) Listen for checkboard clicks
        const {x, y} = getMousePosition(event);
        const {row, col} = getSquareClicked(x, y);
        if (col >= 0 && row >= 0 && col < checkboardDims.rows && row < checkboardDims.rows) {
            if (!isInMovingMode) {
                placePiece(col, row);
            }
            else {
                selectPiece(col, row);
            }
        }
    })

    const radioButtons = document.querySelectorAll('input[name="colour"]');
    radioButtons.forEach(radio => {
        // (void) Liten for colour radio buttons changes
        radio.addEventListener('change', updateSelectedColour);
    });

    confirmButton.addEventListener('click', function() {
        // (void) Listen for the 'Confirm' button
        isInMovingMode = true;
        moveButton.disabled = false;
        moveTextBox.disabled = false;
        alert('You can now move the pieces.');
    });

    moveButton.addEventListener('click', function() {
        // (void) Listen for the 'Move' button
        movePiece()
    });

};

