/**
 * Preloads all graphics
 * @param {Object} obj Objects of images with paths
 * @param {Function} callback
 */
function loadImages(obj, callback) {
    let imagesToLoad = Object.keys(obj).length;
    if (imagesToLoad == 0 && typeof callback == "function") {
        callback();
    }

    let loaded = 0;
    for (let imgSrc in obj) {
        (function (imgSrc) {
            let image = new Image();
            image.onload = function () {
                obj[imgSrc] = image;
                loaded++;
                if (loaded == imagesToLoad && typeof callback == "function") {
                    console.info("Images loaded correctly");
                    callback();
                }
            }
            image.src = obj[imgSrc];
        }(imgSrc))
    }
}

class Vector2 {
    /**
     * Creates Vector object
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x = 0, y = 0) {
        if (typeof x != "number" || typeof y != "number") {
            console.error("It's dangerous to assign diffrent type of values in Vector2 than number");
        }

        this.x = x;
        this.y = y;
    }

    /**
     * Calculates vector's lenght
     * @returns {Number}
     */
    length() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Let's the length of vector to 1
     */
    normalize() {
        let len = this.length();
        this.x /= len;
        this.y /= len;
    }

    /**
     * Add to Vector other Vector
     * @param {Vector2} vect
     */
    add(vect) {
        if (!(vect instanceof Vector2)) {
            console.error("Argument must be instance of Vector2 class");
            return;
        }

        this.x += vect.x;
        this.y += vect.y;
    }

    /**
     * Substracts two Vectors
     * @param {Vector2} vect
     */
    substract(vect) {
        if (!(vect instanceof Vector2)) {
            console.error("Argument must be instance of Vector2 class");
            return;
        }

        this.x -= vect.x;
        this.y -= vect.y;
    }

    /**
     * Multiplies each component of Vector by given value
     * @param {Number} value
     */
    multiplyScalar(value) {
        if (typeof value != "number") {
            console.error("Srgument must be number");
            return;
        }

        this.x *= value;
        this.y *= value;
    }

    /**
     * Clones all componets of vector
     * @returns {Vector2}
     */
    clone() {
        return new Vector2(this.x, this.y);
    }

    /**
     * Copies all components from given vector
     * @param {Vector2} vect
     */
    copy(vect) {
        if (!(vect instanceof Vector2)) {
            console.error("Argument must be instance of Vector2 class");
            return;
        }

        this.x = vect.x;
        this.y = vect.y;
    }

    /**
     * Calculates distance beetwen two Vectors
     * @param {Vector2} vect
     * @returns {Number}
     */
    distanceTo(vect) {
        if (!(vect instanceof Vector2)) {
            console.error("Argument must be instance of Vector2 class");
            return;
        }

        return Math.sqrt(Math.pow((this.x - vect.x), 2) + Math.pow((this.y - vect.y), 2))
    }

    /**
     * Rotating clockwise vector by given angle
     * @param {Number} ang Angle in degrees
     */
    rotate(ang) {
        ang = -ang * (Math.PI / 180);
        let cos = Math.cos(ang);
        let sin = Math.sin(ang);
        let newCoords = new Array(Math.round(10000 * (this.x * cos - this.y * sin)) / 10000, Math.round(10000 * (this.x * sin + this.y * cos)) / 10000);
        this.x = newCoords[0];
        this.y = newCoords[1];
    }

    /**
     * Checks if Vector belongs to polygon
     * @param {Array} poly Array of Vector2
     */
    belongsToPolygon(poly) {
        //Data validation
        if (!Array.isArray(poly)) {
            console.error("Argument must be array");
            return;
        }
        for (let i = 0; i < poly.length; i++) {
            if (!(poly[i] instanceof Vector2)) {
                console.error("Array must contain Vector2 objects");
                return;
            }
        }

        //Checking
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= this.y && this.y < poly[j].y) || (poly[j].y <= this.y && this.y < poly[i].y))
            && (this.x < (poly[j].x - poly[i].x) * (this.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            && (c = !c);
        return c;
    }
}

/**
 * Maps value beetwen range
 * @param {Number} value Value to map
 * @param {Number} in_min Input min value
 * @param {Number} in_max Input max value
 * @param {Number} out_min Output min value
 * @param {Number} out_max Output min value
 * @returns {boolean}
 */
function mapValue(value, in_min, in_max, out_min, out_max) {
    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] != "number") {
            console.error("All argument must be numbers");
            return;
        }
    }

    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/**
 * Pads number with given symbol
 * @param {Number} n Number to pad
 * @param {Number} width Need with of number
 * @param {String} _z Symbol to pad with. Default is '0'
 * @returns {String} Paded number
 */
function padWith(n, width, _z) {
    z = _z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/**
 * Selects random integer (including min and max)
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function randomInt(min, max) {
    if (typeof min != "number" || typeof max != "number") {
        console.error("All argument must be numbers");
        return;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * The returned value is no lower than (and may possibly equal) min, and is less than (but not equal to) max.
 * @param {Number} min
 * @param {Number} max
 */
function randomFloat(min, max) {
    if (typeof min != "number" || typeof max != "number") {
        console.error("All argument must be numbers");
        return;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}

const KEYPRESSED = {};

/**
 * Enables keypress event and stores each pressed key in global KEYPRESSED object
 */
function enableKeyPressEvent() {
    try {
        document.body.onkeydown = function (e) {
            let key = e.key.toUpperCase();
            KEYPRESSED[key] = true;
        }
        document.body.onkeyup = function (e) {
            let key = e.key.toUpperCase();
            KEYPRESSED[key] = false;
        }
    } catch (e) {
        console.error(e);
    }
}

class CookiesHelper {
    /**
     * Helps to work with cookies on page
     */
    constructor() {
    }

    /**
     * Sets cookie on page
     * @param {String} name Cookie's id
     * @param {any} value Value to save
     * @param {Number} _expires Life expectancy of cookie (in days) from current date. Default is 2 years
     * @param {String} _path Default is '/'
     */
    set(name, value, _expires, _path) {
        let cName = name;

        //Setting value
        let cValue = null;
        if (typeof value == "object") {
            cValue = JSON.stringify(value);
        } else {
            cValue = value;
        }

        //Setting expires date
        let exDate = new Date();
        if (_expires) {
            exDate.setDate(exDate.getDate() + _expires);
        } else {
            exDate.setFullYear(exDate.getFullYear() + 2);
        }
        exDate = exDate.toUTCString();

        //Setting path
        let cPath = "/" || _path;

        //Setting cookie
        document.cookie = cName + "=" + cValue + "; expires=" + exDate + "; path=" + cPath;
    }

    /**
     * Downloading cookie value with specyfied name
     * @param {String} name
     * @returns {any}
     */
    getByName(name) {
        //Getting cookies data
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        let toRetun = parts.pop().split(";").shift();

        //Trying to parse
        try {
            toRetun = JSON.parse(toRetun);
            return toRetun;
        } catch (e) {
            return toRetun;
        }
    }

    /**
     * Deletes cookie with specyfied name
     * @param {String} name
     */
    remove(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    /**
     * Delets all cookies on page
     */
    removeAll() {
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let spcook = cookies[i].split("=");
            this.remove(spcook[0]);
        }
    }
}

/**
 * To make an object constant, recursively freezes each property which is of type object
 * @param {Object} obj Object to freeze
 */
function deepFreeze(obj) {
    if (typeof obj != "object") {
        console.error("You can only freeze objects");
        return undefined;
    }
    var propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(function (name) {
        var prop = obj[name];
        if (typeof prop == 'object' && prop !== null)
            deepFreeze(prop);
    });
    return Object.freeze(obj);
}

/**
 * Function clones object by JSON method
 * @param {Object | Array} obj Object to clone
 * @returns {Object | Array} Object's clone
 */
function cloneByStringify(obj) {
    let clone = JSON.stringify(obj);
    clone = JSON.parse(clone);
    return clone;
}
