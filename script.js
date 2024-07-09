window.onload = function() {
    // (void) Executes on window load

    const canvas = document.getElementById('checkboardCanvas');
    const context = canvas.getContext('2d');

    const ROWS = 8;
    const COLS  = 8;
    const MARGIN = 30;
    const size = canvas.width - 40;
    const cellWidth = size / COLS;
    const cellHeight = size / ROWS;


    function drawCheckboard(size, rows, cols) {
        // (void) Draws a checkboard of gives size in the canvas

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // odd square - white, even square - black
                context.fillStyle = (row % 2 === col % 2) ? '#808080' : '#fff';
                context.fillRect(col * cellWidth + MARGIN, row * cellHeight + MARGIN, cellWidth, cellHeight);
            }
        }

        // checkboard border
        context.strokeStyle = '#000';
        context.lineWidth = 4;
        context.strokeRect(MARGIN, MARGIN, size, size);
    }

    function drawCoordinates(size, rows, cols) {
        // (void) Draws coordinates around the checkboard

        context.fillStyle = '#000';
        context.font = '20px Arial';
        const colsId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        // on top
        for (let col = 0; col < cols; col++) {
            context.fillText(colsId[col], col * cellWidth + cellWidth / 2 - 5 + MARGIN, 20);
        }

        // on the left
        for (let row = 0; row < rows; row++) {
            context.fillText(ROWS - row, 5, row * cellHeight + cellHeight / 2 + 5 + MARGIN);
        }
    }

    canvas.addEventListener('click', function(event) {
        const {x, y} = getMousePosition(event);
        const {row, col} = getSquareClicked(x, y);
        if (col >= 0 && row >= 0 && col < ROWS && row < ROWS) {
            const coordsArr = cellToString(col, row)
            alert(`(${coordsArr[0]}${coordsArr[1]})`);
        }
    })

    function cellToString(x, y) {
        // (arr[2]: str, int) Returns an array of chess coords of the square

        colsId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        return [colsId[x], ROWS - y];
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
    
        const col = Math.floor((x - MARGIN) / cellWidth);
        const row = Math.floor((y - MARGIN) / cellHeight);
    
        return {row, col};
    }

    drawCheckboard(size, ROWS, COLS);
    drawCoordinates(size, ROWS, COLS);
};

