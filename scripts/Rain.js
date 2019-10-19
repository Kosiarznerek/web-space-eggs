class Rain {
    /**
     * Creates Rain object
     * @param {Number} amount Amount of particles
     */
    constructor(amount) {
        //Settings
        this.width = 4; //width of one particle
        this.height = 2; //height of one particle
        this.colorPalette = [
            "#86dad4",
            "#da868c",
            "#68a0ff",
            "#f8c02c",
        ];
        this.amount = amount; //amount of particles on canvas
        this.gravityForce = new Vector2(0, 1);

        //Creating particles at random position on screen
        this.particles = [];
        for (let i = 0; i < this.amount; i++) {
            //Random color from palette
            let color = randomInt(0, this.colorPalette.length - 1);
            color = this.colorPalette[color];

            //Random position on canvas
            let x = randomInt(0, CANVAS_WIDTH - this.width);
            let y = randomInt(0, CANVAS_HEIGHT - this.height);
            let position = new Vector2(x, y);

            //Creating particle
            let particle = new Particle(position, color, this.width, this.height);
            particle.enableFlickering(this.colorPalette, 500, randomInt(10, 100) * i);
            this.particles.push(particle);
        }
    }

    /**
     * Draws rain on canvas context
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            particle.draw(ctx);
        }
    }

    /**
     * Updates all particles position
     */
    update() {
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            particle.position.add(this.gravityForce);
            if (particle.isOffCanvas()) { // New location
                let x = randomInt(0, CANVAS_WIDTH - this.width);
                let y = -this.height;
                let newPosition = new Vector2(x, y);
                particle.position.copy(newPosition);
            }
        }
    }
}
