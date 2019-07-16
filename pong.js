let canvas;
let context;

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
        this.x = side === left ? 150 : canvas.width - 150;
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

document.addEventListener('DOMContentLoaded', SetupCanvas());

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

//update

//player movement

//stop player

//game loop

//reset ball

//add delay