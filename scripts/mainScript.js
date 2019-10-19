//Onload
window.onload = function () {
    enableKeyPressEvent();
    loadImages(IMAGES, function () {
        setup();
    })
}

//Global variables
const CANVAS_WIDTH = 632;
const CANVAS_HEIGHT = 367;
let RAIN = null;
let PLAYER = null;
let OPPONENTS = [];
const AMOUNT_OF_OPPONENTS = 8;
let CURRENT_LEVEL = 1;
const COOKIES = new CookiesHelper();

/**
 * Setup function called alfter whole needed data has been loaded
 */
function setup() {
    //Creating canvas
    let canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    let ctx = canvas.getContext('2d');
    document.getElementById("gameCanvas").appendChild(canvas);

    //Creating game components
    RAIN = new Rain(100);
    PLAYER = new Player(new Vector2(CANVAS_WIDTH / 2 - 60 / 2, 300));
    CreateOpponets(AMOUNT_OF_OPPONENTS, CURRENT_LEVEL);

    //Starting loop
    setInterval(function () {
        draw(ctx);
    }, 1000 / 60);
}

/**
 * Animation loop 60 frames per seconds
 * @param {CanvasRenderingContext2D} ctx
 */
function draw(ctx) {
    //Background color
    ctx.beginPath();
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.closePath();


    //Player movements
    if (KEYPRESSED["A"]) {
        PLAYER.move.left = true;
    } else {
        PLAYER.move.left = false;
    }
    if (KEYPRESSED["D"]) {
        PLAYER.move.right = true;
    } else {
        PLAYER.move.right = false;
    }
    //if (KEYPRESSED["W"]) { PLAYER.move.up = true; } else { PLAYER.move.up = false; }
    //if (KEYPRESSED["S"]) { PLAYER.move.down = true; } else { PLAYER.move.down = false; }
    PLAYER.updateMovements();

    //Player shooting
    if (KEYPRESSED[" "]) {
        PLAYER.shoot();
    }
    PLAYER.bulletsUpdate(ctx);

    //Player animations
    PLAYER.updateAnimations();

    //Player collision with opponents
    PLAYER.checkCollisionWithOpponents();

    //Player got killed
    if (PLAYER.dead) {
        CURRENT_LEVEL = 1;
        CreateOpponets(AMOUNT_OF_OPPONENTS, CURRENT_LEVEL);
        PLAYER = new Player(new Vector2(CANVAS_WIDTH / 2 - 60 / 2, 300));
    }

    //Player draw
    PLAYER.draw(ctx);


    //Opponents
    for (let i = 0; i < OPPONENTS.length; i++) {
        let opponent = OPPONENTS[i];
        opponent.updateMovements();
        opponent.checkEdges();
        opponent.draw(ctx);
        if (opponent.shoudBeRemoved) { //It should be when it's dead
            OPPONENTS.splice(i, 1);
            i--;
        }
    }

    //Next level when all opponents are dead
    if (OPPONENTS.length == 0) {
        CURRENT_LEVEL++;
        if (CURRENT_LEVEL > 4) {
            CURRENT_LEVEL = 4;
        }
        CreateOpponets(AMOUNT_OF_OPPONENTS, CURRENT_LEVEL);
    }


    //Rain
    RAIN.update();
    RAIN.draw(ctx);
}
