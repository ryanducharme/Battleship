// let canvas = document.querySelector('#playerOneCanvas');
// let context = canvas.getContext('2d');
let debugOne = document.getElementById('debugP1');
let debugOneGuesses  = document.getElementById('debugP1Guesses');
let debugTwo = document.getElementById('debugP2');

let playerOneAddShip = document.getElementById('playerOneAddShip');
let checkHitButton = document.getElementById('checkHitButton');

// let playerOneBoard = createBoard(10);
// let playerTwoBoard = createBoard(10);

function Game(player1, player2) {
    this.playerOne = player1;
    this.playerTwo = player2;
    this.checkHit = function (senderGuessBoard, receiverGameBoard, x, y) {
        //todo: check if you killed the ship somehow        
        if (receiverGameBoard.gameBoard[y][x] === 1) {
            receiverGameBoard.gameBoard[y][x]++;
            senderGuessBoard.guessBoard[y][x] = 'X';
            console.log('hit');
        } else {
            senderGuessBoard.guessBoard[y][x] = '-';
            console.log('miss');
        }
    }
}

function Player() {
    this.gameBoard = createBoard(10);
    this.guessBoard = createBoard(10);
    this.ships =
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
                    this.gameBoard[chosenY + shipY][chosenX + shipX] = 1;
                }
            }
        }
        
    };
}

function Ship(name, layout) {
    this.name = name;
    this.layout = layout;
    this.health = layout[0].length;
    this.x = null;
    this.y = null;
    this.calcShipBaseAxis = function() {
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


let game = new Game(new Player(), new Player());


//add player one ships
game.playerOne.placeShip(game.playerOne.ships[1], 2, 0);

//add player two ships
game.playerTwo.placeShip(game.playerTwo.ships[0], 2, 0);
game.playerTwo.placeShip(game.playerTwo.ships[1], 2, 4);
game.playerTwo.placeShip(game.playerTwo.ships[2], 2, 6);

//player one takes a guess at player twos board
game.checkHit(game.playerOne, game.playerTwo, 2, 0);
game.checkHit(game.playerOne, game.playerTwo, 0, 0);
game.checkHit(game.playerOne, game.playerTwo, 3, 0);
game.checkHit(game.playerOne, game.playerTwo, 0, 0);
game.checkHit(game.playerOne, game.playerTwo, 3, 2);
game.checkHit(game.playerOne, game.playerTwo, 4, 4);
game.checkHit(game.playerOne, game.playerTwo, 4, 6);
game.checkHit(game.playerOne, game.playerTwo, 4, 7);

//player two takes a guess at player ones board
// game.checkHit(game.playerTwo.gameBoard, 3, 0);

//draw
debugOne.value = game.playerOne.gameBoard.join('\n').replace(/0/g, ' ');
debugTwo.value = game.playerTwo.gameBoard.join('\n').replace(/0/g, ' ');

debugOneGuesses.value = game.playerOne.guessBoard.join('\n').replace(/0/g, ' ');