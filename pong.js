let canvas;
let context;
let WINNING_SCORE = 3;

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
    }
}

let player;
let aiPlayer;
let ball;
let running = false;
let gameOver = false;
let delayRounds;
let startTarget;
let hitSound;

document.addEventListener('DOMContentLoaded', SetupCanvas);

//setup
function SetupCanvas() {
    canvas = document.getElementById('game-canvas');
    context = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 1000;
    player = new Paddle('left');
    aiPlayer = new Paddle('poop');
    ball = new Ball(7);
    aiPlayer.speed = 6.5;
    startTarget = player;
    delayRounds = (new Date()).getTime();
    hitSound = document.getElementById('sound');
    hitSound.src = 'click.mp3';
    document.addEventListener('keydown', MovePlayerPaddle);
    document.addEventListener('keyup', StopPlayerPaddle);
    Draw();
}

//draw
function Draw() {
    context.clearRect(0,0,canvas.width,canvas.height);
    
    context.fillStyle = 'black';
    context.fillRect(0,0,canvas.width,canvas.height);
    
    context.fillStyle = 'white';
    context.fillRect(player.x, player.y, player.width, player.height);
    context.fillRect(aiPlayer.x, aiPlayer.y, aiPlayer.width, aiPlayer.height);
    
    context.font = '80px Arial';
    context.textAlign = 'center';
    context.fillText(player.score.toString(), (canvas.width/2) - 300, 100);
    context.fillText(aiPlayer.score.toString(), (canvas.width/2) + 300, 100);
    
    context.fillStyle = 'red';
    context.fillRect(ball.x, ball.y, ball.width, ball.height);


    if (player.score == WINNING_SCORE) {
        context.fillText("Player 1 wins!", canvas.width/2, 300);
        gameOver = true;
    } else if (aiPlayer.score == WINNING_SCORE) {
        context.fillText("AI wins!", canvas.width/2, 300);
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
            player.y += player.speed;
        } else if (player.move == DIRECTION.UP) {
            player.y -= player.speed;
        }
//maybe use max in above conditionals instead of these conditionals below
        if (player.y < 0) {
            player.y = 0;
        } else if (player.y >= (canvas.height - player.height)) {
            player.y = canvas.height - player.height;
        }
    }
}

//player movement
function MovePlayerPaddle(key) {
    if (running == false) {
        running = true;
        window.requestAnimationFrame(GameLoop);
    }

    if (key.keyCode == 38 || key.keycode == 87) player.move = DIRECTION.UP;
    if (key.keyCode == 40 || key.keycode == 83) player.move = DIRECTION.DOWN;

}

//stop player
function StopPlayerPaddle(event) {
    player.move = DIRECTION.STOPPED;
}

//game loop
function GameLoop() {

}

//reset ball
function ResetBall(scoringPlayer) {
    scoringPlayer.score++;
    // let newBallSpeed = ball.speed + .2;
    ball = new Ball(7);
    startTarget = scoringPlayer == player ? aiPlayer : player;
    delayAmount = (new Date()).getTime();
}

//add delay