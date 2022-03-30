let debugOne = document.getElementById('debugP1');
let debugOneGuesses = document.getElementById('debugP1Guesses');

let debugTwo = document.getElementById('debugP2');
let debugTwoGuesses = document.getElementById('debugP2Guesses');

let p1GuessInput  = document.getElementById('p1GuessInput');
let p2GuessInput  = document.getElementById('p2GuessInput');

let p1GuessBtn = document.getElementById('p1GuessBtn');
let p2GuessBtn = document.getElementById('p2GuessBtn');

p1GuessBtn.onclick = p1Submit;
p2GuessBtn.onclick = p2Submit;


function Guess(x, y) {
    this.x = x;
    this.y = y;
    this.hit = false;
}

function Game() {
    this.playerOne = new Player('p1');
    this.playerTwo = new Player('p2');
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
        console.log(`X:${x} Y:${y}`);
        console.log(`${playerToHit.name}`);
        playerToHit.fleet.every(function (ship) {
            
            // console.log(`${ship.name} ${ship.x}, ${ship.y}`);    
            if((x >= ship.x && x <= ship.layout[0].length) && (y === ship.y)) {
                console.log(`${initiator.name} hit ${playerToHit.name}'s ${ship.name} at ${x},${y}`);
                console.log(ship.layout[y - ship.y][x - ship.x]++);
                console.log(ship.layout);
                playerToHit.gameBoard[y][x]++;
                initiator.guessBoard[y][x] = 'X';
            } else {
                initiator.guessBoard[y][x] = '-';
                console.log('miss');
            }
        });
    }
}

function Player(name) {
    this.name = name;
    this.gameBoard = createBoard(10);
    this.guessBoard = createBoard(10);
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
    draw();
}

function p2Submit() {
    //check hit and update
    let coords = p2GuessInput.value.split(',');
    game.checkHit(game.playerTwo, game.playerOne, parseInt(coords[0]), parseInt(coords[1]));
    draw();
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

//player one takes a guess at player twos board
// game.checkHit(game.playerOne, game.playerTwo, 2, 0);
// game.checkHit(game.playerOne, game.playerTwo, 0, 0);
// game.checkHit(game.playerOne, game.playerTwo, 3, 0);
// game.checkHit(game.playerOne, game.playerTwo, 0, 0);
// game.checkHit(game.playerOne, game.playerTwo, 3, 2);
// game.checkHit(game.playerOne, game.playerTwo, 4, 4);
// game.checkHit(game.playerOne, game.playerTwo, 4, 6);
// game.checkHit(game.playerOne, game.playerTwo, 4, 7);

//player two takes a guess at player ones board
// game.checkHit(game.playerTwo.gameBoard, 3, 0);

//draw
function draw() {
    debugOne.value = game.playerOne.gameBoard.join('\n').replace(/0/g, ' ');
    debugOneGuesses.value = game.playerOne.guessBoard.join('\n').replace(/0/g, ' ');


    debugTwo.value = game.playerTwo.gameBoard.join('\n').replace(/0/g, ' ');
    debugTwoGuesses.value = game.playerTwo.guessBoard.join('\n').replace(/0/g, ' ');
}

draw();

//game loop
game.running = true;
let count = 0

// while(game.running) {
    
//     game.takeTurn(game.currentPlayer, new Guess(2,2));
//     count++;

//     if(count === 10) {
//         game.running = false;
//     }
    
// }


// function checkBoundingBox(x, y) {
//     //return name of ship on given x, y gameboard coords
//     console.log(`X:${x} Y:${y}`);
    
//     game.playerOne.ships.forEach(function (ship) {
//         // console.log(`${ship.name} ${ship.x}, ${ship.y}`);
        
//        if((x >= ship.x && x <= ship.layout[0].length) && (y === ship.y)) {
//            console.log(`you hit the a ${ship.name} at ${x},${y}`);
//        }
//     });
// }

    // if(game.playerOne.gameBoard[y][x] === 1) {
    //     // console.log('in bounds');
    //     //look through the players ship list


