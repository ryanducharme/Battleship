let canvas = document.querySelector('#playerOneCanvas');
let context = canvas.getContext('2d');
let debugOne = document.getElementById('debugP1');
let debugTwo = document.getElementById('debugP2');

let playerOneAddShip = document.getElementById('playerOneAddShip');
let checkHitButton = document.getElementById('checkHitButton');

let playerOneBoard = createBoard(10);
let playerTwoBoard = createBoard(10);
let count = 0;


let ship1 = new Ship(
    [
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ]
);


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
// playerOneAddShip.onclick = placeShip(playerOneBoard, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
playerOneAddShip.addEventListener('click', placeRandomShip);
checkHitButton.addEventListener('click', detectHit)

function Ship(layout){
    this.layout = layout;
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

function placeShip(board, ship, row, col) {

    
   
    let chosenY = row;
    let chosenX = col;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //CHECK THE SPACE YOU WANT TO PUT THE PIECE IN FULLY BEFORE ADDING THE PIECE. IF THERE ARE TWO OVERLAPPING PIECES THEY WILL STILL BE ADDED TO THE BOARD IN THIS IMPLEMENTATION
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //check the desired x y coords to see if there is already a ship there. if there is 
    let invalidPlacementCount = 0;
    if (chosenY <= board.length - ship.length && chosenX <= board.length - ship.length) {
        for (let shipX = 0; shipX < ship.length; shipX++) {
            for (let shipY = 0; shipY < ship.length; shipY++) {
                //check if the space where the ship is going to be placed is empty
                if (board[chosenY + shipX][chosenX + shipY] === 1) {
                    invalidPlacementCount++;
                    console.log(`capn.. theres a ship there\'s ${invalidPlacementCount} ship(s) there...` );
                }
            }
        }
    } else {
        console.log('cant fit.. phalice too large');
    }

    if (invalidPlacementCount === 0) {
        for (let shipX = 0; shipX < ship.length; shipX++) {
            for (let shipY = 0; shipY < ship.length; shipY++) {
                if (ship[shipX][shipY] === 1 && board[chosenY + shipX][chosenX + shipY] === 0) {
                    board[chosenY + shipX][chosenX + shipY] = 1;
                } else if (ship[shipX][shipY] === 0) {

                }
            }
        }
    }
    debugOne.innerHTML = playerOneBoard.join('\n');
    validPlacement = false;
}

function placeRandomShip() {
    placeShip(playerOneBoard, ship1.layout, 0, 0);
    
    // ship1.layout = rotateShip(ship1.layout);
    // console.log(ship1.layout);
}

function detectHit(board, row, col) {
    let checkHit = document.getElementById('checkHit').value;
    let parsed = checkHit.split(',');
    if (playerOneBoard[parsed[0]][parsed[1]] === 1) {
        console.log('hit');
        playerOneBoard[parsed[0]][parsed[1]]++;
    }
    debugOne.innerHTML = playerOneBoard.join('\n');
}

function update() {
    //check turn

    //do player logic

    //update player data
}

function draw(graphicsContext) {
    //draw the players board

}


function rotateShip(shipLayout)
    {
        const N = shipLayout.length;
        // Consider all squares one by one
        for (let x = 0; x < N / 2; x++)
        {
         
            // Consider elements in group
            // of 4 in current square
            for (let y = x; y < N - x - 1; y++)
            {
             
                // Store current cell in
                // temp variable
                let temp = shipLayout[x][y];
   
                // Move values from right to top
                shipLayout[x][y] = shipLayout[y][N - 1 - x];
   
                // Move values from bottom to right
                shipLayout[y][N - 1 - x]
                    = shipLayout[N - 1 - x][N - 1 - y];
   
                // Move values from left to bottom
                shipLayout[N - 1 - x][N - 1 - y] = shipLayout[N - 1 - y][x];
   
                // Assign temp to left
                shipLayout[N - 1 - y][x] = temp;
            }
        }
        return shipLayout;
}

placeShip(playerOneBoard, ship1.layout, 0, 0)
debugOne.innerHTML = playerOneBoard.join('\n');


