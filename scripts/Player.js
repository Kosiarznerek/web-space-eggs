class Player {
    /**
     * Creates Player object
     * @param {Vector2} position
     */
    constructor(position) {
        //State
        this.currentState = "normal"; // ['normal'] , ['destroyed']

        //Position
        this.position = position.clone();

        //Movements
        this.movementsSpeed = 3;
        this.move = {
            left: false,
            right: false,
            up: false,
            down: false,
        }

        //Animation
        this.currentImage = IMAGES.PLAYER_NOR_01;
        this._animations = {
            normal: {
                images: [IMAGES.PLAYER_NOR_01, IMAGES.PLAYER_NOR_02, IMAGES.PLAYER_NOR_03],
                counter: 0, currentFrame: 0
            },
            destroyed: {
                images: [IMAGES.PLAYER_DEST_01, IMAGES.PLAYER_DEST_02, IMAGES.PLAYER_DEST_03],
                counter: 0, currentFrame: 0
            },
        }

        //Shooting
        this._bullets = [];

        //Scores
        this.scores = 0;
        this._showAndUpdateScores();

        //Dead
        this.dead = false;
    }

    /**
     * Draws Player on canvas context
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this.currentImage, this.position.x, this.position.y);
    }

    /**
     * Updates player movements
     */
    updateMovements() {
        let force = new Vector2();
        if (this.move.left) {
            force.x = -1;
        }
        if (this.move.right) {
            force.x = 1;
        }
        if (this.move.up) {
            force.y = -1;
        }
        if (this.move.down) {
            force.y = 1;
        }

        if (this._canMove(force)) {
            force.multiplyScalar(this.movementsSpeed);
            this.position.add(force);
        }
    }

    /**
     * Checks if player can move in given direction
     * @param {Vector2} direction
     * @returns {boolean}
     */
    _canMove(direction) {
        if (this.currentState == "destroyed") {
            return false
        }

        //Canlculating new position
        let newPosition = this.position.clone();
        let dir = direction.clone();
        dir.multiplyScalar(this.movementsSpeed);
        newPosition.add(dir);

        //Checking
        if (newPosition.x + 60 >= CANVAS_WIDTH) {
            return false
        }
        if (newPosition.x <= 0) {
            return false
        }
        if (newPosition.y > 300) {
            return false
        }
        if (newPosition.y <= 0) {
            return false
        }
        return true;
    }

    /**
     * Updates animations for current state
     */
    updateAnimations() {
        let state = this.currentState;

        //Increasing counter
        this._animations[state].counter++;
        if (this._animations[state].counter + 1 >= Number.MAX_SAFE_INTEGER) {
            this._animations[state].counter = 0;
        }

        //If next frame needed
        if (this._animations[state].counter % 12 === 0) {
            this._animations[state].currentFrame++;
            if (this._animations[state].currentFrame >= this._animations[state].images.length) {
                if (this.currentState != "destroyed") {
                    this._animations[state].currentFrame = 0;
                } else {
                    this._animations[state].currentFrame = this._animations[state].images.length - 1;
                    this.dead = true;
                }
            }
        }

        //Image update
        let index = this._animations[state].currentFrame;
        this.currentImage = this._animations[state].images[index];
    }

    /**
     * Player shoots
     */
    shoot() {
        if (
            this._bullets.length == 0 ||
            this.position.distanceTo(this._bullets[this._bullets.length - 1].position) > 100
        ) {
            let bPosition = this.position.clone();
            bPosition.x += 24;
            let bullet = new Bullet(bPosition, 3);
            this._bullets.push(bullet);

            //Sound
            SOUNDS.shoot.currentTime = 0;
            SOUNDS.shoot.play();
        }
    }

    /**
     * Updates player's bullets
     * @param {CanvasRenderingContext2D} ctx
     */
    bulletsUpdate(ctx) {
        for (let i = 0; i < this._bullets.length; i++) {
            let bullet = this._bullets[i];
            bullet.draw(ctx);
            bullet.update();

            //When bullet hit opponent
            let hittedOpponent = bullet.hitsOpponent();
            if (hittedOpponent) {
                this._bullets.splice(i, 1);
                i--;
                this._hitedOpponent(hittedOpponent);
            }
        }
    }

    /**
     * When Player hits opponent
     * @param {Opponent} opponent Hitted opponet
     */
    _hitedOpponent(opponent) {
        this.scores += opponent.getPointsValue();
        opponent.gotHitted();
        this._showAndUpdateScores();
    }

    /**
     * Checks collision with opponents based on global OPPONENTS array
     */
    checkCollisionWithOpponents() {
        for (let i = 0; i < OPPONENTS.length; i++) {
            let opponent = OPPONENTS[i];
            let opponentCoords = [
                new Vector2(opponent.position.x, opponent.position.y),
                new Vector2(opponent.position.x + 40, opponent.position.y),
                new Vector2(opponent.position.x + 40, opponent.position.y + 24),
                new Vector2(opponent.position.x, opponent.position.y + 24)
            ]

            let myCoords = [
                new Vector2(this.position.x, this.position.y),
                new Vector2(this.position.x + 60, this.position.y),
                new Vector2(this.position.x + 60, this.position.y + 42),
                new Vector2(this.position.x, this.position.y + 42),
            ]

            for (let j = 0; j < myCoords.length; j++) {
                if (myCoords[j].belongsToPolygon(opponentCoords)) {//Collision with opponent
                    opponent.shoudBeRemoved = true;
                    this.currentState = "destroyed";

                    //Sound
                    SOUNDS.destroyed.currentTime = 0;
                    SOUNDS.destroyed.play();
                }
            }
        }
    }

    /**
     * Shows and updates player scores
     */
    _showAndUpdateScores() {
        //Updating current scores
        let currentScores = padWith(this.scores, 4);
        document.getElementById("currScore").innerHTML = "SCORE: " + currentScores;

        //Updating hi scores
        let currentHi = COOKIES.getByName("hiScore");
        if (currentHi == "" || currentHi < this.scores) {//need update
            currentHi = this.scores;
            COOKIES.set("hiScore", currentHi);
        }
        currentHi = padWith(currentHi, 4);
        document.getElementById("hiScore").innerHTML = "HI: " + currentHi;
    }
}
