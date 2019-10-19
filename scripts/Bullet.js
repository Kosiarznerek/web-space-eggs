class Bullet {
    /**
     * Creates Bullet object
     * @param {Vector2} position
     * @param {Number} speed Speed of bullet
     */
    constructor(position, speed) {
        this.position = position.clone();
        this._direction = new Vector2(0, -1);
        this.speed = speed;
        this.image = IMAGES.BULLET;
    }

    /**
     * Draws bullet on canvas context
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    /**
     * Updates bullet position
     */
    update() {
        let force = this._direction.clone();
        force.multiplyScalar(this.speed);
        this.position.add(force);
    }

    /**
     * Checks if bullet hit Opponent based on global OPPONENTS array
     * @returns {Opponent|boolean} Hitted opponent or false if noone has been hitted
     */
    hitsOpponent() {
        for (let i = 0; i < OPPONENTS.length; i++) {
            let opponent = OPPONENTS[i];
            let opponentCoords = [
                new Vector2(opponent.position.x, opponent.position.y),
                new Vector2(opponent.position.x + 40, opponent.position.y),
                new Vector2(opponent.position.x + 40, opponent.position.y + 24),
                new Vector2(opponent.position.x, opponent.position.y + 24)
            ]
            let bulletPosition = this.position.clone();
            bulletPosition.x += 6; // mid point of bullet
            bulletPosition.y += 6; // mid point of bullet
            if (bulletPosition.belongsToPolygon(opponentCoords)) {
                return OPPONENTS[i];
            }
        }
        return false
    }
}
