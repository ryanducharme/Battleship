//#region Canvas Elements
let playerOneGameBoard  = document.getElementById('playerOneGameBoard');
let playerOneGameBoardCtx = playerOneGameBoard.getContext('2d');

let playerOneGuessBoard  = document.getElementById('playerOneGuessBoard');
let playerOneGuessCtx = playerOneGuessBoard.getContext('2d');

let playerTwoGameBoard  = document.getElementById('playerTwoGameBoard');
let playerTwoGameBoardCtx = playerTwoGameBoard.getContext('2d');

let playerTwoGuessBoard  = document.getElementById('playerTwoGuessBoard');
let playerTwoGuessCtx = playerTwoGuessBoard.getContext('2d');

//#endregion

//#region Debug elements
let debugOne = document.getElementById('debugP1');
let debugOneGuesses = document.getElementById('debugP1Guesses');

let debugTwo = document.getElementById('debugP2');
let debugTwoGuesses = document.getElementById('debugP2Guesses');

let p1GuessInput  = document.getElementById('p1GuessInput');
let p2GuessInput  = document.getElementById('p2GuessInput');

let p1GuessBtn = document.getElementById('p1GuessBtn');
let p2GuessBtn = document.getElementById('p2GuessBtn');

//#endregion

p1GuessBtn.onclick = p1Submit;
p2GuessBtn.onclick = p2Submit;
window.requestAnimationFrame(gameLoop);

function Guess(x, y) {
    this.x = x;
    this.y = y;
    this.hit = false;
}

function Game() {
    this.playerOne = new Player('p1', playerOneGameBoard, playerOneGuessBoard);
    this.playerTwo = new Player('p2', playerTwoGameBoard, playerOneGuessBoard);
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
    this.checkHit = function(initiator, playerToHit, x, y) {
        //return name of ship on given x, y gameboard coords
        var hitShip;
        let isHit = false;
        console.log(`X:${x} Y:${y}`);
        playerToHit.fleet.forEach(
            function (ship) {
                if((x >= ship.x && x <= ship.layout[0].length) && (y === ship.y)) {
                    isHit = true;
                    hitShip = ship;
                }
            });

        if(isHit) {
            console.log(`${initiator.name} hit ${playerToHit.name}'s ${hitShip.name} at ${x},${y}`);
            console.log(hitShip.layout[y - hitShip.y][x - hitShip.x]++);
            console.log(hitShip.layout);
            playerToHit.gameBoard[y][x]++;
            initiator.guessBoard[y][x] = 'X';
            
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
    this.gameBoardContext = gameBoardContext;
    this.guessBoardContext = guessBoardContext;
    this.context = '2d';
    this.hitCount = 0;
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
        if ((chosenX < 10 && chosenY < 10)) {
            if (ship.calcShipBaseAxis() === 'horizontal') {
                for (let shipX = 0; shipX < shipLayout[0].length; shipX++) {
                    //check to make sure the piece will fit in desired location
                    if (chosenX + shipLayout[0].length > 10 || chosenY + shipLayout.length > 10) {
                        //check the piece isnt conflicting with another ship
                        //          X               Y
                        console.log(`The piece will be out of bounds if placed at X:${chosenX} Y:${chosenY}`);
                        pieceConflict = true;
                    } else if (this.gameBoard[chosenY + 0][chosenX + shipX] === 1) {
                        console.log(`Overlapping pieces at X:${chosenX} Y:${chosenY}`);
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
            for (let shipX = 0; shipX < shipLayout[0].length; shipX++) {
                for (let shipY = 0; shipY < shipLayout.length; shipY++) {
                    ship.x = chosenX;
                    ship.y = chosenY;
                    // this.gameBoard[chosenY + shipY][chosenX + shipX] = 1;
                    this.gameBoard[chosenY + shipY][chosenX + shipX] = ship.layout[shipY][shipX];
                }
            }
        }

    };
}

function Ship(name, layout) {
    this.name = name;
    this.layout = layout;
    this.health = layout[0].length;
    this.x = undefined;
    this.y = undefined;
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

let game = new Game();


//add player one ships
game.playerOne.placeShip(game.playerOne.fleet[0], 1, 0);
game.playerOne.placeShip(game.playerOne.fleet[1], 4, 2);
game.playerOne.placeShip(game.playerOne.fleet[2], 6, 3);
game.playerOne.placeShip(game.playerOne.fleet[3], 2, 7);
game.playerOne.placeShip(game.playerOne.fleet[4], 8, 9);

//add player two ships
game.playerTwo.placeShip(game.playerTwo.fleet[0], 2, 0);
game.playerTwo.placeShip(game.playerTwo.fleet[1], 2, 4);
game.playerTwo.placeShip(game.playerTwo.fleet[2], 2, 6);

//draw
function drawText() {
    debugOne.value = game.playerOne.gameBoard.join('\n').replace(/0/g, ' ');
    debugOneGuesses.value = game.playerOne.guessBoard.join('\n').replace(/0/g, ' ');


    debugTwo.value = game.playerTwo.gameBoard.join('\n').replace(/0/g, ' ');
    debugTwoGuesses.value = game.playerTwo.guessBoard.join('\n').replace(/0/g, ' ');
}

drawText();


function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x, 
                "Coordinate y: " + y);
    

    x = Math.floor(x / 50);
    y = Math.floor(y / 50);
    console.log(`${x}, ${y}`);
    game.playerTwo.gameBoard[y][x] = 5;
    // ctx.fillStyle = 'lime'
    // ctx.fillRect(x * 50, y * 50, 50, 50);
}

playerOneGameBoard.addEventListener("mousedown", function(e)
{
    getMousePosition(playerOneGameBoard, e);
});

playerOneGuessBoard.addEventListener("mousedown", function(e)
{
    getMousePosition(playerOneGuessCanvas, e);
});


function update() {
    //check input {
    // mouse move
    // mouse click
    // }
}

function gameLoop(timeStamp){
    draw();
    
    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}




function drawBoard(player, cellSize, rows, cols) {
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = i * cellSize;
            let y = j * cellSize

            playerOneGameBoardCtx.fillStyle = 'white';
            playerOneGuessCtx.fillStyle = 'white';
            if ((i + j) % 2 === 0) {
                playerOneGameBoardCtx.fillStyle = '#527bde';
                playerOneGuessCtx.fillStyle = "gray";
            }

            playerOneGameBoardCtx.fillRect(x,y, cellSize, cellSize);    
            playerOneGuessCtx.fillRect(x,y, cellSize, cellSize);    
                        
            playerOneGameBoardCtx.fillStyle = "black";
            playerOneGameBoardCtx.font = "12px Arial";
            playerOneGameBoardCtx.fillText(`${i},${j}`, x + 15, y + 30);


            playerOneGuessCtx.fillStyle = "black";
            playerOneGuessCtx.font = "12px Arial";
            playerOneGuessCtx.fillText(`${i},${j}`, x + 15, y + 30);

            if(game.playerOne.gameBoard[j][i] >= 1) {
                playerOneGameBoardCtx.fillRect(x,y, cellSize, cellSize);
                
            }
            if(game.playerOne.gameBoard[j][i] === 2) {
                playerOneGameBoardCtx.beginPath();
                playerOneGameBoardCtx.arc(x + 25, y + 25, 10, 0, 2 * Math.PI, false);
                playerOneGameBoardCtx.fillStyle = 'red';
                playerOneGameBoardCtx.fill();
            }

            if(game.playerOne.gameBoard[j][i] === 5) {
                playerOneGameBoardCtx.fillStyle = "lime";
                playerOneGameBoardCtx.fillRect(x,y, cellSize, cellSize);    
            }
            
        }    
    }
    
}

function draw(){
    drawBoard(playerOneGuessCtx, 50,10,10);
    drawBoard(playerTwoGuessCtx, 50,10,10);
    // let randomColor = Math.random() > 0.5? '#ff8080' : '#0099b0';
    // ctx.fillStyle = randomColor;
    // ctx.fillRect(100, 50, 200, 175);
}
