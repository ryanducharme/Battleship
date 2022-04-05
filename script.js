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


//#endregion

function Guess(x, y) {
    this.x = x;
    this.y = y;
    this.hit = false;
}

function Game() {
    this.winner = undefined;
    this.playerOne = new Player('p1', playerOneGameBoardCtx, playerOneGuessBoardCtx);
    this.playerTwo = new Player('p2', playerTwoGameBoardCtx, playerTwoGuessBoardCtx);
    this.state = {
        shipPlacement: true,
        running: false,
        p1Turn: false,
        p2Turn: false,
        win: false
    }
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
            playerToHit.health--;
            

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
    this.health = 17;
    this.MousePos = [];
    this.currentShipIndex = 0;
    this.fleet =
        [
            new Ship(
                'Carrier', 5),
            new Ship(
                'Battleship', 4),
            new Ship(
                'Destroyer', 3),
            new Ship(
                'Submarine', 3),
            new Ship(
                'Patrol', 2)
        ];
       
    this.turnCount = 0;
    this.placeShip = function (ship, chosenX, chosenY) {
        let pieceConflict = false;
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
            if (ship.horizontal === true) {
                for (let shipX = 0; shipX < ship.length; shipX++) {
                    //check to make sure the piece will fit in desired location
                    if (chosenX + ship.layout[0].length > 10 || chosenY + ship.layout.length > 10) {
                        //check the piece isnt conflicting with another ship
                        pieceConflict = true;
                    } else if (this.gameBoard[chosenY + 0][chosenX + shipX] === 1) {
                        pieceConflict = true;
                    }
                }
            } else if (ship.vertical === true) {
                for (let shipX = 0; shipX < ship.length; shipX++) {
                    for (let shipY = 0; shipY < ship.layout.length; shipY++) {
                        if (chosenX + ship.layout[0].length > 10 || chosenY + ship.layout.length > 10) {
                            console.log(`The piece will be out of bounds if placed at X:${chosenX} Y:${chosenY}`);
                            pieceConflict = true;
                        } else if (this.gameBoard[chosenY + shipY][chosenX + 0] === 1) {
                            pieceConflict = true;
                        }
                    }
                }
            }
        } else {
            pieceConflict = true;
        }

        if (pieceConflict == false) {
            for (let shipX = 0; shipX < ship.layout[0].length; shipX++) {
                for (let shipY = 0; shipY < ship.layout.length; shipY++) {
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
function Ship(name, length) {
    this.name = name;
    this.layout = [[]];
    this.length = length;
    this.x = undefined;
    this.y = undefined;
    this.canPlace = false;
    this.isPlaced = false;
    this.vertical = false;
    this.horizontal = true;
    this.calcShipBaseAxis = function () {
      
        if (this.horizontal) {
            return 'horizontal';
        } else if (this.vertical) {
            return 'vertical';
        }
    }

    this.horizontalLayout = function() {
        let newLayout = [];
        let newLayoutX = [];
        for (let i = 0; i < this.length; i++) {
            let newItem = 1;
            newLayoutX.push(newItem);
        }
        newLayout.push(newLayoutX);
        // console.log(newLayout);
        this.horizontal = true;
        this.vertical = false;
        return this.layout = newLayout;
        
    }
    this.verticalLayout = function() {
        
        let newLayout = [];
        for (let i = 0; i < this.length; i++) {
            let newItem = [1];
            newLayout.push(newItem);
            
        }
        this.horizontal = false;
        this.vertical = true;
        // console.log(newLayout);
        return this.layout = newLayout;
    }
    this.layout = this.horizontalLayout();
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
    
    if (!game.state.win) {
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
    } else {
        player.gameBoardContext.fillStyle = 'white';
        player.gameBoardContext.fillRect(0,0, 500, 500);
        
        player.gameBoardContext.fillStyle = 'black';
        player.gameBoardContext.font = '50px serif';
        player.gameBoardContext.fillText(`${game.winner.name} won!`, 130, 250);
        console.log(game.winner);
        // player.gameBoardContext.fillText(`${game.winner.name} won!`, 250,250);
    }
    

}
function update() {
    if (game.state.shipPlacement === true) {
        if(game.playerOne.currentShipIndex <= 4) {
            game.playerOne.placeShip(game.playerOne.fleet[game.playerOne.currentShipIndex], game.playerOne.MousePos[0], game.playerOne.MousePos[1]);
            if(game.playerOne.fleet[game.playerOne.currentShipIndex].isPlaced === true ) {
                game.playerOne.currentShipIndex++;
            }
        } else {
            game.state.shipPlacement = false;
            game.state.running = true;
            game.state.p1Turn = true;
        }
    }
    if(game.state.running) {
        if(game.playerOne.health === 0) {
                game.winner = game.playerTwo;
                game.state.win = true;
        }   

        if(game.playerTwo.health === 0) {
            game.winner = game.playerOne;
            game.state.win = true;
        }   
    }

    if(game.state.win === true) {
        console.log('winner');
    }
    // game.state.win = true;
}
function draw() {
    drawBoard(game.playerOne, 50, 10, 10);
    drawBoard(game.playerTwo, 50, 10, 10);
    
    // drawText();
}
function gameLoop(timeStamp) {
    update();
    draw();
    // Keep requesting new frames    

    window.requestAnimationFrame(gameLoop);
}

playerOneGameBoard.addEventListener("mousedown", function (e) {
    if(game.state.shipPlacement) {
        getMousePosition(playerOneGameBoard, e);
        game.playerOne.fleet[game.playerOne.currentShipIndex].canPlace = true;
    }
});

playerOneGuessBoard.addEventListener("mousedown", function (e) {
    if(game.state.running) {
        let position = getMousePosition(playerOneGuessBoard, e);
        console.log(position);
        game.checkHit(game.playerOne, game.playerTwo, position[0], position[1]);
        // drawText();
    }
});

playerOneGameBoard.addEventListener("mousemove", function (e) {
    let position = getMousePosition(playerOneGameBoard, e);
    game.playerOne.MousePos = position;
    mouseCoordElem.textContent = position;
    // drawText();
});

window.addEventListener('keydown', function(e) {
    
    if(game.state.shipPlacement) {
        if(e.key == 'r') {
            if(game.playerOne.fleet[game.playerOne.currentShipIndex].horizontal === true) {
                game.playerOne.fleet[game.playerOne.currentShipIndex].verticalLayout();    
            } else {
                game.playerOne.fleet[game.playerOne.currentShipIndex].horizontalLayout()
            }
        }

        if(e.key == 'w') {
            game.state.win = true;
            game.winner = game.playerOne;
        }
    }
    
});


window.requestAnimationFrame(gameLoop);

let game = new Game();

game.playerTwo.fleet[0].canPlace = true;
game.playerTwo.placeShip(game.playerTwo.fleet[0], 0,2);
game.playerTwo.fleet[1].canPlace = true;
game.playerTwo.placeShip(game.playerTwo.fleet[1], 2,4);
game.playerTwo.fleet[2].canPlace = true;
game.playerTwo.placeShip(game.playerTwo.fleet[2], 4,3);
game.playerTwo.fleet[3].canPlace = true;
game.playerTwo.placeShip(game.playerTwo.fleet[3], 1,7);
game.playerTwo.fleet[4].canPlace = true;
game.playerTwo.placeShip(game.playerTwo.fleet[4], 7,1);
// game.playerTwo.placeShip(game.playerTwo.fleet[0], 4,6);
// game.playerTwo.placeShip(game.playerTwo.fleet[1], 5,7);
// game.playerTwo.placeShip(game.playerTwo.fleet[2], 7,1);
// game.playerTwo.placeShip(game.playerTwo.fleet[3], 3,3);
// game.playerTwo.placeShip(game.playerTwo.fleet[4], 5,7);