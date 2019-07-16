//TODO:
//clean things up, const/let things that are used throughout, improve readability
//implement 2 player mode
//fine tune speeds, paddle size, canvas size, colors...
//make the W and S keys actually work
//start new game

let canvas;
let context;
const WINNING_SCORE = 3;

let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

class Paddle {
    constructor(side) {
        this.width = 15;
        this.height = 65;
        this.x = side === 'left' ? 150 : canvas.width - 150;
        this.y = canvas.height/2;
        this.score = 0;
        this.move = DIRECTION.STOPPED;
        this.speed = 11;
    }
}

class Ball {
    constructor(speed) {
        this.width = 15;
        this.height = 15;
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.moveX = DIRECTION.STOPPED;
        this.moveY = DIRECTION.STOPPED;
        this.speed = speed;
    }
}

let player;
let aiPlayer;
let ball;
let running = false;
let gameOver = false;
let delayRound;
let startTarget;
let hitSound, laughtrack, winSound, startSound;

document.addEventListener('DOMContentLoaded', SetupCanvas);

//setup
function SetupCanvas() {
    gameOver = false;
    canvas = document.getElementById('game-canvas');
    context = canvas.getContext('2d');
    
    canvas.width = 1600;
    canvas.height = 800;

    player = new Paddle('left');
    aiPlayer = new Paddle('poop');
    aiPlayer.speed = 5.6;
    
    ball = new Ball(7);
    startTarget = player;
    delayRound = (new Date()).getTime();
    
    hitSound = document.getElementById('hit-sound');
    hitSound.src = 'click.mp3';
    winSound = document.getElementById('win-sound');
    winSound.src = 'wow_2.mp3';
    loseSound = document.getElementById('lose-sound');
    loseSound.src = 'laughtrack.mp3';
    startSound = document.getElementById('start-sound');
    startSound.src = 'quickFart.mp3';

    document.addEventListener('keydown', MovePlayerPaddle);
    document.addEventListener('keyup', StopPlayerPaddle);
    
    // startSound.play();
    Draw();
}

//draw
function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = 'green';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = 'white';
    context.fillRect(player.x, player.y, player.width, player.height);
    context.fillRect(aiPlayer.x, aiPlayer.y, aiPlayer.width, aiPlayer.height);
    
    context.font = '80px Arial';
    context.textAlign = 'center';
    context.fillText(player.score.toString(), (canvas.width/2) - 300, 100);
    context.fillText(aiPlayer.score.toString(), (canvas.width/2) + 300, 100);

    context.fillStyle = 'red';
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    context.fillStyle = 'pink';
    if (player.score == WINNING_SCORE) {
        context.fillText("Player 1 wins!", canvas.width/2, 300);
        winSound.play();
        gameOver = true;
    } else if (aiPlayer.score == WINNING_SCORE) {
        context.fillText("AI wins!", canvas.width/2, 300);
        loseSound.play();
        gameOver = true;
    }
}

//update
function Update() {
    if (!gameOver) {
        if (ball.x <= 0) {
            ResetBall(aiPlayer);
        } else if (ball.x >= canvas.width - ball.width) {
            ResetBall(player);
        }

        if (ball.y <= 0) {
            ball.moveY = DIRECTION.DOWN;
        } else if (ball.y >= canvas.height - ball.height) {
            ball.moveY = DIRECTION.UP;
        }

        if (player.move == DIRECTION.DOWN)  {
            player.y = player.y > (canvas.height - player.height) ? (canvas.height - player.height) : player.y + player.speed;
        } else if (player.move == DIRECTION.UP) {
            player.y = player.y < 0 ? 0 : player.y - player.speed;           
        }

        if (AddADelay() && startTarget) {
            ball.moveX = startTarget === player ? DIRECTION.LEFT : DIRECTION.RIGHT;
            ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];

            ball.y = canvas.height / 2;
            // ball.x = canvas.width / 2;

            startTarget = null;
        }

        if (ball.moveY == DIRECTION.UP) {
            ball.y -= ball.speed;
        } else if (ball.moveY == DIRECTION.DOWN) {
            ball.y += ball.speed;
        }

        if (ball.moveX == DIRECTION.LEFT) {
            ball.x -= ball.speed;
        } else if (ball.moveX == DIRECTION.RIGHT) {
            ball.x += ball.speed;
        }

        if (ball.moveX == DIRECTION.RIGHT) {
            if (aiPlayer.y > ball.y - (aiPlayer.height / 2)) {
                aiPlayer.y -= aiPlayer.speed;
            }

            if (aiPlayer.y < ball.y - (aiPlayer.height / 2)) {
                aiPlayer.y += aiPlayer.speed;
            }
        }

        if (aiPlayer.y < 0) {
            aiPlayer.y = 0;
        } else if (aiPlayer.y >= (canvas.height - aiPlayer.height)) {
            aiPlayer.y = canvas.height - aiPlayer.height;
        }

        //ball collision
        if (ball.x - ball.width <= player.x && ball.x >= player.x - player.width) {
            if (ball.y <= player.y +player.height && ball.y + ball.height >= player.y) {
                ball.moveX = DIRECTION.RIGHT;
                hitSound.play();
            }
        
        }

        if (ball.x - ball.width <= aiPlayer.x && ball.x >= aiPlayer.x - aiPlayer.width) {
            if (ball.y <= aiPlayer.y + aiPlayer.height && ball.y + ball.height >= aiPlayer.y) {
                ball.moveX = DIRECTION.LEFT;
                hitSound.play();
            }
        }
    }
}

//player movement
function MovePlayerPaddle(key) {
    if (running == false) {
        running = true;
        window.requestAnimationFrame(GameLoop);
    }

    if (key.keyCode == 38 || key.keyCode == 87) player.move = DIRECTION.UP;
    if (key.keyCode == 40 || key.keyCode == 83) player.move = DIRECTION.DOWN;

    if (key.keyCode == 13 && gameOver) SetupCanvas();
}

//stop player
function StopPlayerPaddle(event) {
    player.move = DIRECTION.STOPPED;
}

//game loop
function GameLoop() { 
    Update();
    Draw();
    if(!gameOver) requestAnimationFrame(GameLoop);
}

//reset ball
function ResetBall(scoringPlayer) {
    scoringPlayer.score++;
    let newBallSpeed = ball.speed + 3;
    ball = new Ball(newBallSpeed);
    startTarget = scoringPlayer == player ? aiPlayer : player;
    delayRound = (new Date()).getTime();
}

//add delay
function AddADelay() {
    return ((new Date()).getTime() - delayRound >= 1000);
}