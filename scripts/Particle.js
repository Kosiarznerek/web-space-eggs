class Particle {
    /**
     * Creates Particle object
     * @param {Vector2} position
     * @param {String} color
     * @param {Number} width
     * @param {Number} height
     */
    constructor(position, color, width, height) {
        this.position = position.clone();
        this.currentColor = color;
        this.width = width;
        this.height = height;
        this.visible = true;

        this._setsOfCollors = [];
    }

    /**
     * Draws particle on screen
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.visible) {
            return
        }
        ;

        ctx.beginPath();
        ctx.fillStyle = this.currentColor;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.closePath();
    }

    /**
     * Causes that particle is changing color from time to time
     * @param {Array} setsOfCollors
     * @param {Number} time The time difference
     * @param {Number} _delay Start's delay
     */
    enableFlickering(setsOfCollors, time, _delay = 0) {
        this._setsOfCollors = cloneByStringify(setsOfCollors);
        let that = this;
        setTimeout(function () {
            //Changing color from time to time
            setInterval(function () {
                let randomIndex = randomInt(0, that._setsOfCollors.length - 1);
                that.currentColor = that._setsOfCollors[randomIndex];
            }, time);

            //Changing visibility from time to time
            setInterval(function () {
                if (that.visible) {
                    that.visible = false;
                } else {
                    that.visible = true;
                }
            }, time)
        }, _delay)
    }

    /**
     * Function checks if particle is still visible on canvas
     * @returns {boolean}
     */
    isOffCanvas() {
        //Y
        if (this.position.y > CANVAS_HEIGHT) {
            return true
        }
        if (this.position.y + this.height < 0) {
            return true
        }

        //X
        if (this.position.x > CANVAS_WIDTH) {
            return true
        }
        if (this.position.x + this.width < 0) {
            return true
        }

        return false
    }
}
