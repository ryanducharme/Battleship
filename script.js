//#region Canvas Elements
let playerOneGameBoard = document.getElementById('playerOneGameBoard');
let playerOneGameBoardCtx = playerOneGameBoard.getContext('2d');

let playerOneGuessBoard = document.getElementById('playerOneGuessBoard');
let playerOneGuessBoardCtx = playerOneGuessBoard.getContext('2d');

let playerTwoGameBoard = document.getElementById('playerTwoGameBoard');
let playerTwoGameBoardCtx = playerTwoGameBoard.getContext('2d');

let playerTwoGuessBoard = document.getElementById('playerTwoGuessBoard');
let playerTwoGuessBoardCtx = playerTwoGuessBoard.getContext('2d');

let mouseCoordElem  = document.getElementById('mouse');

//#endregion

//#region Debug elements
let debugOne = document.getElementById('debugP1');
let debugOneGuesses = document.getElementById('debugP1Guesses');

let debugTwo = document.getElementById('debugP2');
let debugTwoGuesses = document.getElementById('debugP2Guesses');

let p1GuessInput = document.getElementById('p1GuessInput');
let p2GuessInput = document.getElementById('p2GuessInput');

let p1GuessBtn = document.getElementById('p1GuessBtn');
let p2GuessBtn = document.getElementById('p2GuessBtn');

//#endregion

function Guess(x, y) {
    this.x = x;
    this.y = y;
    this.hit = false;
}

let GameState = {
    shipPlacement: true,
    p1Turn: false,
    p2Turn: false
}

function Game() {
    this.playerOne = new Player('p1', playerOneGameBoardCtx, playerOneGuessBoardCtx);
    this.playerTwo = new Player('p2', playerTwoGameBoardCtx, playerTwoGuessBoardCtx);
    this.running = false;

    this.currentPlayer = this.playerOne;
    this.turnCount = 1;
    this.checkWinCondition = function () {
        return false;
    }
    this.takeTurn = function (player, guess) {
        if (this.checkWinCondition() === false) {

            if (this.turnCount % 2 === 0) {
                // game.takeTurn(game.playerTwo);
                this.currentPlayer = this.playerTwo;
            } else {
                // game.takeTurn(game.playerOne);
                this.currentPlayer = this.playerOne;
            }
            console.log(this.currentPlayer.name);
            console.log(this.turnCount);
            this.turnCount++;
        }
    }
    this.checkHit = function (initiator, playerToHit, x, y) {
        //return name of ship on given x, y gameboard coords
        var hitShip;
        let isHit = false;
        playerToHit.fleet.forEach(
            function (ship) {

                if ((x >= ship.x && x < ship.x + ship.layout[0].length) && (y === ship.y)) {
                    ship.layout[0][x - ship.x + ship.layout[0].length - 1] = 2;
                    isHit = true;
                    hitShip = ship;
                }
            });

        //CHANGE THIS T NOT CHANGE THE BOARD, MAKE FUNCTION TO REWRITE THE BOARD BY READING ALL BOAT ARRAYS
        if (isHit && playerToHit.gameBoard[y][x] == 1) {
          
            playerToHit.gameBoard[y][x] = 2;
            initiator.guessBoard[y][x] = 'X';
            console.log('hit');

        } else {
            initiator.guessBoard[y][x] = '-';
            console.log('miss');
        }
    }
}

function Player(name, gameBoardContext, guessBoardContext) {
    this.name = name;
    this.gameBoard = createBoard(10);
    this.guessBoard = createBoard(10);
    this.tempGameBoard = createBoard(10);
    this.gameBoardContext = gameBoardContext;
    this.guessBoardContext = guessBoardContext;
    // this.context = '2d';
    this.hitCount = 0;
    this.MousePos = [];
    this.currentShipIndex = 0;
    this.fleet =
        [
            new Ship(
                'Carrier',
                [[1, 1, 1, 1, 1]]),
            new Ship(
                'Battleship',
                [[1, 1, 1, 1]]),
            new Ship(
                'Destroyer',
                [[1, 1, 1]]),
            new Ship(
                'Submarine',
                [[1, 1, 1]]),
            new Ship(
                'Patrol',
                [[1, 1]])
        ];
    this.turnCount = 0;
    this.placeShip = function (ship, chosenX, chosenY) {
        let pieceConflict = false;
        
        let shipLayout = ship.layout;
        //check valid placement
        //check if the desired coords are in bounds

        // clear out temp board
        for (let i = 0; i < this.tempGameBoard.length; i++) {
            for (let j = 0; j < this.tempGameBoard.length; j++) {
                if (this.gameBoard[j][i] === -1) {
                    this.gameBoard[j][i] = 0
                }

            }
        }

        if ((chosenX < 10 && chosenY < 10)) {
            if (ship.calcShipBaseAxis() === 'horizontal') {
                for (let shipX = 0; shipX < shipLayout[0].length; shipX++) {
                    //check to make sure the piece will fit in desired location
                    if (chosenX + shipLayout[0].length > 10 || chosenY + shipLayout.length > 10) {
                        //check the piece isnt conflicting with another ship
                        
                        
                        pieceConflict = true;
                    } else if (this.gameBoard[chosenY + 0][chosenX + shipX] === 1) {
                        pieceConflict = true;
                    }
                }
            } else if (calcShipBaseAxis(ship) === 'vertical') {
                for (let shipX = 0; shipX < shipLayout[0].length; shipX++) {
                    for (let shipY = 0; shipY < shipLayout.length; shipY++) {
                        if (chosenX + shipLayout[0].length > 10 || chosenY + shipLayout.length > 10) {
                            console.log(`The piece will be out of bounds if placed at X:${chosenX} Y:${chosenY}`);
                            pieceConflict = true;
                        } else if (this.gameBoard[chosenY + shipY][chosenX + 0] === 1) {
                            pieceConflict = true;
                        }
                    }
                }
            } else if (calcShipBaseAxis(ship) === 'combo') {
                //todo
            }
        } else {
            pieceConflict = true;
        }


        if (pieceConflict == false) {
            for (let shipX = 0; shipX < shipLayout[0].length; shipX++) {
                for (let shipY = 0; shipY < shipLayout.length; shipY++) {
                    ship.x = chosenX;
                    ship.y = chosenY;
                    if (ship.canPlace === true) {
                        this.gameBoard[chosenY + shipY][chosenX + shipX] = ship.layout[shipY][shipX];
                        ship.isPlaced = true;
                        
                    } else {
                        this.gameBoard[chosenY + shipY][chosenX + shipX] = -1;
                    }
                }
            }
            ship.canPlace = false;
        }
    };
}

function Ship(name, layout) {
    this.name = name;
    this.layout = layout;
    this.health = layout[0].length;
    this.x = undefined;
    this.y = undefined;
    this.canPlace = false;
    this.isPlaced = false;
    this.calcShipBaseAxis = function () {
        let horizontal = false;
        let vertical = false;
        let combo = false;

        if (this.layout.length === 1) {
            horizontal = true;
        }
        if (this.layout[0].length === 1) {
            vertical = true;
        }
        if (this.layout.length > 1 && this.layout[0].length > 1) {
            combo = true;
            return 'combo';
        } else if (horizontal) {
            return 'horizontal';
        } else if (vertical) {
            return 'vertical';
        }
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
function p1Submit() {
    //check hit and update
    let coords = p1GuessInput.value.split(',');
    game.checkHit(game.playerOne, game.playerTwo, parseInt(coords[0]), parseInt(coords[1]));
    drawText();
}
function p2Submit() {
    //check hit and update
    let coords = p2GuessInput.value.split(',');
    game.checkHit(game.playerTwo, game.playerOne, parseInt(coords[0]), parseInt(coords[1]));
    drawText();
}
//draw
function drawText() {
    debugOne.value = game.playerOne.gameBoard.join('\n').replace(/0/g, ' ');
    debugOneGuesses.value = game.playerOne.guessBoard.join('\n').replace(/0/g, ' ');


    debugTwo.value = game.playerTwo.gameBoard.join('\n').replace(/0/g, ' ');
    debugTwoGuesses.value = game.playerTwo.guessBoard.join('\n').replace(/0/g, ' ');
}
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    x = Math.floor(x / 50);
    y = Math.floor(y / 50);

    let position = [x, y];
    return position;
    
}
function drawBoard(player, cellSize, rows, cols) {
    // player.gameBoardContext.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = i * cellSize;
            let y = j * cellSize

            player.gameBoardContext.fillStyle = 'blue';
            player.guessBoardContext.fillStyle = 'lightgray';

            if ((i + j) % 2 === 0) {

                player.gameBoardContext.fillStyle = '#527bde';
                player.guessBoardContext.fillStyle = 'gray';
            }

            player.gameBoardContext.fillRect(x, y, cellSize, cellSize);
            player.guessBoardContext.fillRect(x, y, cellSize, cellSize);



            player.gameBoardContext.fillStyle = "black";
            if (player.gameBoard[j][i] == -1) {
                player.gameBoardContext.fillStyle = "lime";
                player.gameBoardContext.fillRect(x, y, cellSize, cellSize);

            }
            if (player.gameBoard[j][i] >= 1) {
                player.guessBoardContext.fillStyle = "black";
                player.gameBoardContext.fillRect(x, y, cellSize, cellSize);

            }
            if (player.guessBoard[j][i] == '-') {
                player.guessBoardContext.beginPath();
                player.guessBoardContext.arc(x + 25, y + 25, 10, 0, 2 * Math.PI, false);
                player.guessBoardContext.fillStyle = 'black';
                player.guessBoardContext.fill();
            }
            if (player.guessBoard[j][i] == 'X') {
                player.guessBoardContext.beginPath();
                player.guessBoardContext.arc(x + 25, y + 25, 10, 0, 2 * Math.PI, false);
                player.guessBoardContext.fillStyle = 'red';
                player.guessBoardContext.fill();
            }
            if (player.gameBoard[j][i] === 2) {
                player.gameBoardContext.beginPath();
                player.gameBoardContext.arc(x + 25, y + 25, 10, 0, 2 * Math.PI, false);
                player.gameBoardContext.fillStyle = 'red';
                player.gameBoardContext.fill();
            }

            if (player.gameBoard[j][i] === 5) {
                player.gameBoardContext.fillStyle = "lime";
                player.gameBoardContext.fillRect(x, y, cellSize, cellSize);
            }

            player.gameBoardContext.fillStyle = "white";
            player.gameBoardContext.font = "16px Arial";
            player.gameBoardContext.fillText(`${i},${j}`, x + 15, y + 30);

            player.guessBoardContext.fillStyle = "white";
            player.guessBoardContext.font = "16px Arial";
            player.guessBoardContext.fillText(`${i},${j}`, x + 15, y + 30);
        }
    }

}


function update() {
    if (GameState.shipPlacement === true) {
        if(game.playerOne.currentShipIndex <= 4) {
            game.playerOne.placeShip(game.playerOne.fleet[game.playerOne.currentShipIndex], game.playerOne.MousePos[0], game.playerOne.MousePos[1]);
            if(game.playerOne.fleet[game.playerOne.currentShipIndex].isPlaced === true ) {
                game.playerOne.currentShipIndex++;
            }
        }
    }
}

function draw() {
    drawBoard(game.playerOne, 50, 10, 10);
    drawBoard(game.playerTwo, 50, 10, 10);
}

function gameLoop(timeStamp) {
    update();
    draw();
    // Keep requesting new frames    

    window.requestAnimationFrame(gameLoop);
}

playerOneGameBoard.addEventListener("mousedown", function (e) {
    getMousePosition(playerOneGameBoard, e);
    game.playerOne.fleet[game.playerOne.currentShipIndex].canPlace = true;
    
});

playerOneGuessBoard.addEventListener("mousedown", function (e) {
    let position = getMousePosition(playerOneGuessBoard, e);
    console.log(position);
    game.checkHit(game.playerOne, game.playerTwo, position[0], position[1]);
    drawText();
});

playerOneGameBoard.addEventListener("mousemove", function (e) {
    let position = getMousePosition(playerOneGameBoard, e);
    game.playerOne.MousePos = position;
    mouseCoordElem.textContent = position;
    drawText();
});

p1GuessBtn.onclick = p1Submit;
p2GuessBtn.onclick = p2Submit;
window.requestAnimationFrame(gameLoop);

let game = new Game();

// //add player one ships
// game.playerOne.placeShip(game.playerOne.fleet[0], 0, 0);
// game.playerOne.placeShip(game.playerOne.fleet[1], 4, 2);
// game.playerOne.placeShip(game.playerOne.fleet[2], 6, 3);
// game.playerOne.placeShip(game.playerOne.fleet[3], 2, 7);
// game.playerOne.placeShip(game.playerOne.fleet[4], 8, 9);

// //add player two ships
game.playerTwo.placeShip(game.playerTwo.fleet[0], 0, 0);
game.playerTwo.placeShip(game.playerTwo.fleet[1], 6, 4);
game.playerTwo.placeShip(game.playerTwo.fleet[2], 2, 6);
drawText();