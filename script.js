/////////////////
// either randomply place each piece and then have the user move them in the 
// cardinal directions directly, or have an input box next to each ship wiht x,y coords to place the ship at
////////
let canvas = document.querySelector('#playerOneCanvas');
let context = canvas.getContext('2d');
let debugOne = document.getElementById('debugP1');
let debugTwo = document.getElementById('debugP2');

let playerOneAddShip = document.getElementById('playerOneAddShip');
let checkHitButton = document.getElementById('checkHitButton');

let playerOneBoard = createBoard(10);
let playerTwoBoard = createBoard(10);
let count = 0;

let player = {
    ships: [],
    board: [],
    guessBoard: [],
    id: 1,
    score: 0
}

let gameBoard = {
    players: [],

}

let verticalShip = new Ship(
    [
        [1],
        [1],
        [1]
    ]
);

let horizontalShip = new Ship(
    [
        [1, 1, 1]
    ]
);

let comboShip = new Ship(
    [
        [1, 1, 1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ]
);

let carrier = [
    [1,1,1,1,1],
];

// let carrier = [
//     [1],
//     [1],
//     [1],
//     [1],
//     [1]
// ];

let battleship = [
    [1,1,1,1]
];

let destroyer = [
    [1,1,1]
];

let submarine = [
    [1,1,1]
];

let patrol = [
    [1,1]
];

// playerOneAddShip.onclick = placeShip(playerOneBoard, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
playerOneAddShip.addEventListener('click', placeRandomShip);
checkHitButton.addEventListener('click', detectHit);
console.log(battleship);
console.log(rotateShip(battleship));

placeShip(playerOneBoard, carrier, 0, 5);
placeShip(playerOneBoard, battleship, 0, 0);
placeShip(playerOneBoard, destroyer, 5, 3);
placeShip(playerOneBoard, submarine, 7, 6);
placeShip(playerOneBoard, patrol, 8, 9);


// debugOne.innerHTML = playerOneBoard.join('\n');
function Ship(layout) {
    this.layout = layout;
}

function placeShip(board, ship, chosenX, chosenY) {

    let pieceConflict = false;

    //check valid placement
    //check if the desired coords are in bounds
    if ((chosenX < 10 && chosenY < 10)) {
        if (calcShipBaseAxis(ship) === 'horizontal') {
            for (let shipX = 0; shipX < ship[0].length; shipX++) {
                //check to make sure the piece will fit in desired location
                if (chosenX + ship[0].length > 10 || chosenY + ship.length > 10) {
                    //check the piece isnt conflicting with another ship
                    //          X               Y
                    console.log(`The piece will be out of bounds if placed at X:${chosenX} Y:${chosenY}`);
                    pieceConflict = true;
                } else if (board[chosenY + 0][chosenX + shipX] === 1) {
                    console.log(`Overlapping pieces at X:${chosenX} Y:${chosenY}`);
                    pieceConflict = true;
                }
            }
        } else if (calcShipBaseAxis(ship) === 'vertical') {
            for (let shipX = 0; shipX < ship[0].length; shipX++) {
                for (let shipY = 0; shipY < ship.length; shipY++) {
                    if (chosenX + ship[0].length > 10 || chosenY + ship.length > 10) {
                        console.log(`The piece will be out of bounds if placed at X:${chosenX} Y:${chosenY}`);
                        pieceConflict = true;
                    } else if (board[chosenY + shipY][chosenX + 0] === 1) {
                        console.log(`Overlapping pieces at X:${chosenX} Y:${chosenY}`);
                        pieceConflict = true;
                    }
                }
            }
        } else if (calcShipBaseAxis(ship) === 'combo') {
            //todo
            console.log('combo');
        }
    } else {
        console.log(`Desired location X:${chosenX} Y: ${chosenY} is out of bounds`);
        pieceConflict = true;
    }


    if (pieceConflict == false) {
        for (let shipX = 0; shipX < ship[0].length; shipX++) {
            for (let shipY = 0; shipY < ship.length; shipY++) {
                board[chosenY + shipY][chosenX + shipX] = 1;
            }
        }
    }
    debugOne.innerHTML = playerOneBoard.join('\n');
}


function detectHit(board, boardX, boardY) {
    let checkHit = document.getElementById('checkHit').value;
    let parsed = checkHit.split(',');
    if (playerOneBoard[parsed[1]][parsed[0]] === 1) {
        console.log('hit');
        playerOneBoard[parsed[1]][parsed[0]]++;
    }
    debugOne.innerHTML = playerOneBoard.join('\n');
}

function rotateShip(ship) {
    const N = ship;
    // Consider all squares one by one
    for (let x = 0; x < N / 2; x++) {

        // Consider elements in group
        // of 4 in current square
        for (let y = x; y < N - x - 1; y++) {

            // Store current cell in
            // temp variable
            let temp = ship[x][y];

            // Move values from right to top
            ship[x][y] = ship[y][N - 1 - x];

            // Move values from bottom to right
            ship[y][N - 1 - x]
                = ship[N - 1 - x][N - 1 - y];

            // Move values from left to bottom
            ship[N - 1 - x][N - 1 - y] = ship[N - 1 - y][x];

            // Assign temp to left
            ship[N - 1 - y][x] = temp;
        }
    }
    return ship;
}

function placeRandomShip() {
    placeShip(playerOneBoard, horizontalShip.layout, 0, 0);
}

function calcShipBaseAxis(shipLayout) {
    let horizontal = false;
    let vertical = false;
    let combo = false;

    // console.log(shipLayout.length);
    // console.log(shipLayout[0].length);

    if (shipLayout.length === 1) {
        horizontal = true;
    }
    if (shipLayout[0].length === 1) {
        vertical = true;
    }
    if (shipLayout.length > 1 && shipLayout[0].length > 1) {
        combo = true;
        return 'combo';
    } else if (horizontal) {
        return 'horizontal';
    } else if (vertical) {
        return 'vertical';
    }
}

function createBoard(boardSize) {
    let board = [];
    for (let i = 0; i < boardSize; i++) {
        let temp = [];
        for (let j = 0; j < boardSize; j++) {
            temp.push(0);
        }
        board[i] = temp;
    }
    return board;
}


