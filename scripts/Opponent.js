class Opponent {
    /**
     * Creates Opponent object
     * @param {Number} opClass Opponent class 1, 2, 3, 4
     */
    constructor(opClass) {
        //Class
        this.currentClass = 0; //0 - egg, 1,2,3,4
        this.class = opClass;

        //Setting based on class
        this.image = null;
        this._distanceFromBottom = null;
        this.movementsSpeed = null;
        this._updateClassSettings();

        //Random position
        let x = randomInt(15, CANVAS_WIDTH - 15 - 40); //40 -> img width
        let y = randomInt(15, CANVAS_HEIGHT - this._distanceFromBottom - 24);
        this.position = new Vector2(x, y);

        //Movements
        this._direction = new Vector2(1, 0);
        this._direction.rotate(randomFloat(0, 360));
        this._direction.normalize();

        //Removing flag
        this.shoudBeRemoved = false;
    }

    /**
     * Updates settings based on current class of oponent
     */
    _updateClassSettings() {
        switch (this.currentClass) {
            case 0:
                this.image = IMAGES.OPPONENT_EGG;
                this._distanceFromBottom = 90 + 24; // 24 image height
                this.movementsSpeed = 1;
                break;
            case 1:
                this.image = IMAGES.OPPONENT_01;
                this._distanceFromBottom = 24; // 24 image height
                this.movementsSpeed = 1.25;
                break;
            case 2:
                this.image = IMAGES.OPPONENT_02;
                this._distanceFromBottom = 24; // 24 image height
                this.movementsSpeed = 1.5;
                break;
            case 3:
                this.image = IMAGES.OPPONENT_03;
                this._distanceFromBottom = 24; // 24 image height
                this.movementsSpeed = 1.75;
                break;
            case 4:
                this.image = IMAGES.OPPONENT_04;
                this._distanceFromBottom = 24; // 24 image height
                this.movementsSpeed = 2;
                break;
        }
    }

    /**
     * Draws opponent on canvas context
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    /**
     * Applies movements to oponent
     */
    updateMovements() {
        let force = this._direction.clone();
        force.multiplyScalar(this.movementsSpeed);
        this.position.add(force);
    }

    /**
     * Changes opponent direction
     */
    movementsBehavior() {
        let that = this;
        setInterval(function () {
            that._direction.rotate(randomFloat(-45, 45));
        }, 100)
    }

    /**
     * Checks if opponent is it's own zone
     */
    checkEdges() {
        if (this.position.x + 15 + 40 >= CANVAS_WIDTH || this.position.x - 15 <= 0) {
            this._direction.x *= -1;
        }
        if (this.position.y - 15 <= 0 || this.position.y + this._distanceFromBottom + 24 >= CANVAS_HEIGHT) {
            this._direction.y *= -1;
        }
    }

    /**
     * Calculates how many points opponent is worth
     * @returns {Number} 0, 15, 30, 45, 80
     */
    getPointsValue() {
        switch (this.currentClass) {
            case 0:
                return 0
            case 1:
                return 15
            case 2:
                return 30
            case 3:
                return 45
            case 4:
                return 80
        }
    }

    /**
     * What happend if Opponents got hitted
     */
    gotHitted() {
        if (this.currentClass == this.class) {//Shoud be removed from global OPPONETS array, because it's dead
            this.shoudBeRemoved = true;
        } else {
            this.currentClass = this.class;
            this._updateClassSettings();
        }
    }
}

/**
 * Creates Opponent objects and stores it in a global OPPONENTS array
 * @param {Number} amount
 * @param {Number} level Level of opponents
 */
function CreateOpponets(amount, level) {
    OPPONENTS = [];
    for (let i = 0; i < amount; i++) {
        let opponent = new Opponent(level);
        opponent.movementsBehavior();
        OPPONENTS.push(opponent);
    }
}
