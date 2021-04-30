define(["require", "exports", "./Global"], function (require, exports, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Util = exports.Transform = exports.Collection = void 0;
    /**
     * Collection constructor. Collection extends Array.
     * This class is used in conjunction with {@link Konva.Container#find}
     * The good thing about collection is that it has ALL methods of all Konva nodes. Take a look into examples.
     * @constructor
     * @memberof Konva
     * @example
     *
     * // find all rectangles and return them as Collection
     * const shapes = layer.find('Rect');
     * // fill all rectangles with a single function
     * shapes.fill('red');
     */
    class Collection {
        /**
         * convert array into a collection
         * @method
         * @memberof Konva.Collection
         * @param {Array} arr
         */
        static toCollection(arr) {
            var collection = new Collection(), len = arr.length, n;
            for (n = 0; n < len; n++) {
                collection.push(arr[n]);
            }
            return collection;
        }
        static _mapMethod(methodName) {
            Collection.prototype[methodName] = function () {
                var len = this.length, i;
                var args = [].slice.call(arguments);
                for (i = 0; i < len; i++) {
                    this[i][methodName].apply(this[i], args);
                }
                return this;
            };
        }
    }
    exports.Collection = Collection;
    Collection.mapMethods = function (constructor) {
        var prot = constructor.prototype;
        for (var methodName in prot) {
            Collection._mapMethod(methodName);
        }
    };
    Collection.prototype = [];
    /**
     * iterate through node array and run a function for each node.
     *  The node and index is passed into the function
     * @method
     * @name Konva.Collection#each
     * @param {Function} func
     * @example
     * // get all nodes with name foo inside layer, and set x to 10 for each
     * layer.find('.foo').each(function(shape, n) {
     *   shape.setX(10);
     * });
     */
    Collection.prototype.each = function (func) {
        for (var n = 0; n < this.length; n++) {
            func(this[n], n);
        }
    };
    /**
     * convert collection into an array
     * @method
     * @name Konva.Collection#toArray
     */
    Collection.prototype.toArray = function () {
        var arr = [], len = this.length, n;
        for (n = 0; n < len; n++) {
            arr.push(this[n]);
        }
        return arr;
    };
    /*
     * Last updated November 2011
     * By Simon Sarris
     * www.simonsarris.com
     * sarris@acm.org
     *
     * Free to use and distribute at will
     * So long as you are nice to people, etc
     */
    /*
     * The usage of this class was inspired by some of the work done by a forked
     * project, KineticJS-Ext by Wappworks, which is based on Simon's Transform
     * class.  Modified by Eric Rowell
     */
    /**
     * Transform constructor.
     * In most of the cases you don't need to use it in your app. Because it is for internal usage in Konva core.
     * But there is a documentation for that class in case you still want
     * to make some manual calculations.
     * @constructor
     * @param {Array} [m] Optional six-element matrix
     * @memberof Konva
     */
    class Transform {
        constructor(m = [1, 0, 0, 1, 0, 0]) {
            this.dirty = false;
            this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
        }
        reset() {
            this.m[0] = 1;
            this.m[1] = 0;
            this.m[2] = 0;
            this.m[3] = 1;
            this.m[4] = 0;
            this.m[5] = 0;
        }
        /**
         * Copy Konva.Transform object
         * @method
         * @name Konva.Transform#copy
         * @returns {Konva.Transform}
         * @example
         * const tr = shape.getTransform().copy()
         */
        copy() {
            return new Transform(this.m);
        }
        copyInto(tr) {
            tr.m[0] = this.m[0];
            tr.m[1] = this.m[1];
            tr.m[2] = this.m[2];
            tr.m[3] = this.m[3];
            tr.m[4] = this.m[4];
            tr.m[5] = this.m[5];
        }
        /**
         * Transform point
         * @method
         * @name Konva.Transform#point
         * @param {Object} point 2D point(x, y)
         * @returns {Object} 2D point(x, y)
         */
        point(point) {
            var m = this.m;
            return {
                x: m[0] * point.x + m[2] * point.y + m[4],
                y: m[1] * point.x + m[3] * point.y + m[5],
            };
        }
        /**
         * Apply translation
         * @method
         * @name Konva.Transform#translate
         * @param {Number} x
         * @param {Number} y
         * @returns {Konva.Transform}
         */
        translate(x, y) {
            this.m[4] += this.m[0] * x + this.m[2] * y;
            this.m[5] += this.m[1] * x + this.m[3] * y;
            return this;
        }
        /**
         * Apply scale
         * @method
         * @name Konva.Transform#scale
         * @param {Number} sx
         * @param {Number} sy
         * @returns {Konva.Transform}
         */
        scale(sx, sy) {
            this.m[0] *= sx;
            this.m[1] *= sx;
            this.m[2] *= sy;
            this.m[3] *= sy;
            return this;
        }
        /**
         * Apply rotation
         * @method
         * @name Konva.Transform#rotate
         * @param {Number} rad  Angle in radians
         * @returns {Konva.Transform}
         */
        rotate(rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            var m11 = this.m[0] * c + this.m[2] * s;
            var m12 = this.m[1] * c + this.m[3] * s;
            var m21 = this.m[0] * -s + this.m[2] * c;
            var m22 = this.m[1] * -s + this.m[3] * c;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            return this;
        }
        /**
         * Returns the translation
         * @method
         * @name Konva.Transform#getTranslation
         * @returns {Object} 2D point(x, y)
         */
        getTranslation() {
            return {
                x: this.m[4],
                y: this.m[5],
            };
        }
        /**
         * Apply skew
         * @method
         * @name Konva.Transform#skew
         * @param {Number} sx
         * @param {Number} sy
         * @returns {Konva.Transform}
         */
        skew(sx, sy) {
            var m11 = this.m[0] + this.m[2] * sy;
            var m12 = this.m[1] + this.m[3] * sy;
            var m21 = this.m[2] + this.m[0] * sx;
            var m22 = this.m[3] + this.m[1] * sx;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            return this;
        }
        /**
         * Transform multiplication
         * @method
         * @name Konva.Transform#multiply
         * @param {Konva.Transform} matrix
         * @returns {Konva.Transform}
         */
        multiply(matrix) {
            var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
            var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
            var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
            var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
            var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
            var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            this.m[4] = dx;
            this.m[5] = dy;
            return this;
        }
        /**
         * Invert the matrix
         * @method
         * @name Konva.Transform#invert
         * @returns {Konva.Transform}
         */
        invert() {
            var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
            var m0 = this.m[3] * d;
            var m1 = -this.m[1] * d;
            var m2 = -this.m[2] * d;
            var m3 = this.m[0] * d;
            var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
            var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = m0;
            this.m[1] = m1;
            this.m[2] = m2;
            this.m[3] = m3;
            this.m[4] = m4;
            this.m[5] = m5;
            return this;
        }
        /**
         * return matrix
         * @method
         * @name Konva.Transform#getMatrix
         */
        getMatrix() {
            return this.m;
        }
        /**
         * set to absolute position via translation
         * @method
         * @name Konva.Transform#setAbsolutePosition
         * @returns {Konva.Transform}
         * @author ericdrowell
         */
        setAbsolutePosition(x, y) {
            var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3], m4 = this.m[4], m5 = this.m[5], yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2), xt = (x - m4 - m2 * yt) / m0;
            return this.translate(xt, yt);
        }
        /**
         * convert transformation matrix back into node's attributes
         * @method
         * @name Konva.Transform#decompose
         * @returns {Konva.Transform}
         */
        decompose() {
            var a = this.m[0];
            var b = this.m[1];
            var c = this.m[2];
            var d = this.m[3];
            var e = this.m[4];
            var f = this.m[5];
            var delta = a * d - b * c;
            let result = {
                x: e,
                y: f,
                rotation: 0,
                scaleX: 0,
                scaleY: 0,
                skewX: 0,
                skewY: 0,
            };
            // Apply the QR-like decomposition.
            if (a != 0 || b != 0) {
                var r = Math.sqrt(a * a + b * b);
                result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
                result.scaleX = r;
                result.scaleY = delta / r;
                result.skewX = (a * c + b * d) / delta;
                result.skewY = 0;
            }
            else if (c != 0 || d != 0) {
                var s = Math.sqrt(c * c + d * d);
                result.rotation =
                    Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
                result.scaleX = delta / s;
                result.scaleY = s;
                result.skewX = 0;
                result.skewY = (a * c + b * d) / delta;
            }
            else {
                // a = b = c = d = 0
            }
            result.rotation = exports.Util._getRotation(result.rotation);
            return result;
        }
    }
    exports.Transform = Transform;
    // CONSTANTS
    var OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', OBJECT_BOOLEAN = '[object Boolean]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KONVA_WARNING = 'Konva warning: ', KONVA_ERROR = 'Konva error: ', RGB_PAREN = 'rgb(', COLORS = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 132, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 255, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 203],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [119, 128, 144],
        slategrey: [119, 128, 144],
        snow: [255, 255, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        transparent: [255, 255, 255, 0],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 5],
    }, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/, animQueue = [];
    /**
     * @namespace Util
     * @memberof Konva
     */
    exports.Util = {
        /*
         * cherry-picked utilities from underscore.js
         */
        _isElement(obj) {
            return !!(obj && obj.nodeType == 1);
        },
        _isFunction(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },
        _isPlainObject(obj) {
            return !!obj && obj.constructor === Object;
        },
        _isArray(obj) {
            return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
        },
        _isNumber(obj) {
            return (Object.prototype.toString.call(obj) === OBJECT_NUMBER &&
                !isNaN(obj) &&
                isFinite(obj));
        },
        _isString(obj) {
            return Object.prototype.toString.call(obj) === OBJECT_STRING;
        },
        _isBoolean(obj) {
            return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
        },
        // arrays are objects too
        isObject(val) {
            return val instanceof Object;
        },
        isValidSelector(selector) {
            if (typeof selector !== 'string') {
                return false;
            }
            var firstChar = selector[0];
            return (firstChar === '#' ||
                firstChar === '.' ||
                firstChar === firstChar.toUpperCase());
        },
        _sign(number) {
            if (number === 0) {
                // that is not what sign usually returns
                // but that is what we need
                return 1;
            }
            if (number > 0) {
                return 1;
            }
            else {
                return -1;
            }
        },
        requestAnimFrame(callback) {
            animQueue.push(callback);
            if (animQueue.length === 1) {
                requestAnimationFrame(function () {
                    const queue = animQueue;
                    animQueue = [];
                    queue.forEach(function (cb) {
                        cb();
                    });
                });
            }
        },
        createCanvasElement() {
            var canvas = document.createElement('canvas');
            // on some environments canvas.style is readonly
            try {
                canvas.style = canvas.style || {};
            }
            catch (e) { }
            return canvas;
        },
        createImageElement() {
            return document.createElement('img');
        },
        _isInDocument(el) {
            while ((el = el.parentNode)) {
                if (el == document) {
                    return true;
                }
            }
            return false;
        },
        _simplifyArray(arr) {
            var retArr = [], len = arr.length, util = exports.Util, n, val;
            for (n = 0; n < len; n++) {
                val = arr[n];
                if (util._isNumber(val)) {
                    val = Math.round(val * 1000) / 1000;
                }
                else if (!util._isString(val)) {
                    val = val.toString();
                }
                retArr.push(val);
            }
            return retArr;
        },
        /*
         * arg can be an image object or image data
         */
        _urlToImage(url, callback) {
            // if arg is a string, then it's a data url
            var imageObj = new Global_1.glob.Image();
            imageObj.onload = function () {
                callback(imageObj);
            };
            imageObj.src = url;
        },
        _rgbToHex(r, g, b) {
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        _hexToRgb(hex) {
            hex = hex.replace(HASH, EMPTY_STRING);
            var bigint = parseInt(hex, 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255,
            };
        },
        /**
         * return random hex color
         * @method
         * @memberof Konva.Util
         * @example
         * shape.fill(Konva.Util.getRandomColor());
         */
        getRandomColor() {
            var randColor = ((Math.random() * 0xffffff) << 0).toString(16);
            while (randColor.length < 6) {
                randColor = ZERO + randColor;
            }
            return HASH + randColor;
        },
        get(val, def) {
            if (val === undefined) {
                return def;
            }
            else {
                return val;
            }
        },
        /**
         * get RGB components of a color
         * @method
         * @memberof Konva.Util
         * @param {String} color
         * @example
         * // each of the following examples return {r:0, g:0, b:255}
         * var rgb = Konva.Util.getRGB('blue');
         * var rgb = Konva.Util.getRGB('#0000ff');
         * var rgb = Konva.Util.getRGB('rgb(0,0,255)');
         */
        getRGB(color) {
            var rgb;
            // color string
            if (color in COLORS) {
                rgb = COLORS[color];
                return {
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2],
                };
            }
            else if (color[0] === HASH) {
                // hex
                return this._hexToRgb(color.substring(1));
            }
            else if (color.substr(0, 4) === RGB_PAREN) {
                // rgb string
                rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
                return {
                    r: parseInt(rgb[1], 10),
                    g: parseInt(rgb[2], 10),
                    b: parseInt(rgb[3], 10),
                };
            }
            else {
                // default
                return {
                    r: 0,
                    g: 0,
                    b: 0,
                };
            }
        },
        // convert any color string to RGBA object
        // from https://github.com/component/color-parser
        colorToRGBA(str) {
            str = str || 'black';
            return (exports.Util._namedColorToRBA(str) ||
                exports.Util._hex3ColorToRGBA(str) ||
                exports.Util._hex6ColorToRGBA(str) ||
                exports.Util._rgbColorToRGBA(str) ||
                exports.Util._rgbaColorToRGBA(str) ||
                exports.Util._hslColorToRGBA(str));
        },
        // Parse named css color. Like "green"
        _namedColorToRBA(str) {
            var c = COLORS[str.toLowerCase()];
            if (!c) {
                return null;
            }
            return {
                r: c[0],
                g: c[1],
                b: c[2],
                a: 1,
            };
        },
        // Parse rgb(n, n, n)
        _rgbColorToRGBA(str) {
            if (str.indexOf('rgb(') === 0) {
                str = str.match(/rgb\(([^)]+)\)/)[1];
                var parts = str.split(/ *, */).map(Number);
                return {
                    r: parts[0],
                    g: parts[1],
                    b: parts[2],
                    a: 1,
                };
            }
        },
        // Parse rgba(n, n, n, n)
        _rgbaColorToRGBA(str) {
            if (str.indexOf('rgba(') === 0) {
                str = str.match(/rgba\(([^)]+)\)/)[1];
                var parts = str.split(/ *, */).map(Number);
                return {
                    r: parts[0],
                    g: parts[1],
                    b: parts[2],
                    a: parts[3],
                };
            }
        },
        // Parse #nnnnnn
        _hex6ColorToRGBA(str) {
            if (str[0] === '#' && str.length === 7) {
                return {
                    r: parseInt(str.slice(1, 3), 16),
                    g: parseInt(str.slice(3, 5), 16),
                    b: parseInt(str.slice(5, 7), 16),
                    a: 1,
                };
            }
        },
        // Parse #nnn
        _hex3ColorToRGBA(str) {
            if (str[0] === '#' && str.length === 4) {
                return {
                    r: parseInt(str[1] + str[1], 16),
                    g: parseInt(str[2] + str[2], 16),
                    b: parseInt(str[3] + str[3], 16),
                    a: 1,
                };
            }
        },
        // Code adapted from https://github.com/Qix-/color-convert/blob/master/conversions.js#L244
        _hslColorToRGBA(str) {
            // Check hsl() format
            if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
                // Extract h, s, l
                const [_, ...hsl] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str);
                const h = Number(hsl[0]) / 360;
                const s = Number(hsl[1]) / 100;
                const l = Number(hsl[2]) / 100;
                let t2;
                let t3;
                let val;
                if (s === 0) {
                    val = l * 255;
                    return {
                        r: Math.round(val),
                        g: Math.round(val),
                        b: Math.round(val),
                        a: 1,
                    };
                }
                if (l < 0.5) {
                    t2 = l * (1 + s);
                }
                else {
                    t2 = l + s - l * s;
                }
                const t1 = 2 * l - t2;
                const rgb = [0, 0, 0];
                for (let i = 0; i < 3; i++) {
                    t3 = h + (1 / 3) * -(i - 1);
                    if (t3 < 0) {
                        t3++;
                    }
                    if (t3 > 1) {
                        t3--;
                    }
                    if (6 * t3 < 1) {
                        val = t1 + (t2 - t1) * 6 * t3;
                    }
                    else if (2 * t3 < 1) {
                        val = t2;
                    }
                    else if (3 * t3 < 2) {
                        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                    }
                    else {
                        val = t1;
                    }
                    rgb[i] = val * 255;
                }
                return {
                    r: Math.round(rgb[0]),
                    g: Math.round(rgb[1]),
                    b: Math.round(rgb[2]),
                    a: 1,
                };
            }
        },
        /**
         * check intersection of two client rectangles
         * @method
         * @memberof Konva.Util
         * @param {Object} r1 - { x, y, width, height } client rectangle
         * @param {Object} r2 - { x, y, width, height } client rectangle
         * @example
         * const overlapping = Konva.Util.haveIntersection(shape1.getClientRect(), shape2.getClientRect());
         */
        haveIntersection(r1, r2) {
            return !(r2.x > r1.x + r1.width ||
                r2.x + r2.width < r1.x ||
                r2.y > r1.y + r1.height ||
                r2.y + r2.height < r1.y);
        },
        cloneObject(obj) {
            var retObj = {};
            for (var key in obj) {
                if (this._isPlainObject(obj[key])) {
                    retObj[key] = this.cloneObject(obj[key]);
                }
                else if (this._isArray(obj[key])) {
                    retObj[key] = this.cloneArray(obj[key]);
                }
                else {
                    retObj[key] = obj[key];
                }
            }
            return retObj;
        },
        cloneArray(arr) {
            return arr.slice(0);
        },
        _degToRad(deg) {
            return deg * PI_OVER_DEG180;
        },
        _radToDeg(rad) {
            return rad * DEG180_OVER_PI;
        },
        _getRotation(radians) {
            return Global_1.Konva.angleDeg ? exports.Util._radToDeg(radians) : radians;
        },
        _capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        throw(str) {
            throw new Error(KONVA_ERROR + str);
        },
        error(str) {
            console.error(KONVA_ERROR + str);
        },
        warn(str) {
            if (!Global_1.Konva.showWarnings) {
                return;
            }
            console.warn(KONVA_WARNING + str);
        },
        extend(child, parent) {
            function Ctor() {
                this.constructor = child;
            }
            Ctor.prototype = parent.prototype;
            var oldProto = child.prototype;
            child.prototype = new Ctor();
            for (var key in oldProto) {
                if (oldProto.hasOwnProperty(key)) {
                    child.prototype[key] = oldProto[key];
                }
            }
            child.__super__ = parent.prototype;
            // create reference to parent
            child.super = parent;
        },
        _getControlPoints(x0, y0, x1, y1, x2, y2, t) {
            var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)), d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), fa = (t * d01) / (d01 + d12), fb = (t * d12) / (d01 + d12), p1x = x1 - fa * (x2 - x0), p1y = y1 - fa * (y2 - y0), p2x = x1 + fb * (x2 - x0), p2y = y1 + fb * (y2 - y0);
            return [p1x, p1y, p2x, p2y];
        },
        _expandPoints(p, tension) {
            var len = p.length, allPoints = [], n, cp;
            for (n = 2; n < len - 2; n += 2) {
                cp = exports.Util._getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
                if (isNaN(cp[0])) {
                    continue;
                }
                allPoints.push(cp[0]);
                allPoints.push(cp[1]);
                allPoints.push(p[n]);
                allPoints.push(p[n + 1]);
                allPoints.push(cp[2]);
                allPoints.push(cp[3]);
            }
            return allPoints;
        },
        each(obj, func) {
            for (var key in obj) {
                func(key, obj[key]);
            }
        },
        _inRange(val, left, right) {
            return left <= val && val < right;
        },
        _getProjectionToSegment(x1, y1, x2, y2, x3, y3) {
            var x, y, dist;
            var pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
            if (pd2 == 0) {
                x = x1;
                y = y1;
                dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
            }
            else {
                var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
                if (u < 0) {
                    x = x1;
                    y = y1;
                    dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
                }
                else if (u > 1.0) {
                    x = x2;
                    y = y2;
                    dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
                }
                else {
                    x = x1 + u * (x2 - x1);
                    y = y1 + u * (y2 - y1);
                    dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
                }
            }
            return [x, y, dist];
        },
        // line as array of points.
        // line might be closed
        _getProjectionToLine(pt, line, isClosed) {
            var pc = exports.Util.cloneObject(pt);
            var dist = Number.MAX_VALUE;
            line.forEach(function (p1, i) {
                if (!isClosed && i === line.length - 1) {
                    return;
                }
                var p2 = line[(i + 1) % line.length];
                var proj = exports.Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
                var px = proj[0], py = proj[1], pdist = proj[2];
                if (pdist < dist) {
                    pc.x = px;
                    pc.y = py;
                    dist = pdist;
                }
            });
            return pc;
        },
        _prepareArrayForTween(startArray, endArray, isClosed) {
            var n, start = [], end = [];
            if (startArray.length > endArray.length) {
                var temp = endArray;
                endArray = startArray;
                startArray = temp;
            }
            for (n = 0; n < startArray.length; n += 2) {
                start.push({
                    x: startArray[n],
                    y: startArray[n + 1],
                });
            }
            for (n = 0; n < endArray.length; n += 2) {
                end.push({
                    x: endArray[n],
                    y: endArray[n + 1],
                });
            }
            var newStart = [];
            end.forEach(function (point) {
                var pr = exports.Util._getProjectionToLine(point, start, isClosed);
                newStart.push(pr.x);
                newStart.push(pr.y);
            });
            return newStart;
        },
        _prepareToStringify(obj) {
            var desc;
            obj.visitedByCircularReferenceRemoval = true;
            for (var key in obj) {
                if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == 'object')) {
                    continue;
                }
                desc = Object.getOwnPropertyDescriptor(obj, key);
                if (obj[key].visitedByCircularReferenceRemoval ||
                    exports.Util._isElement(obj[key])) {
                    if (desc.configurable) {
                        delete obj[key];
                    }
                    else {
                        return null;
                    }
                }
                else if (exports.Util._prepareToStringify(obj[key]) === null) {
                    if (desc.configurable) {
                        delete obj[key];
                    }
                    else {
                        return null;
                    }
                }
            }
            delete obj.visitedByCircularReferenceRemoval;
            return obj;
        },
        // very simplified version of Object.assign
        _assign(target, source) {
            for (var key in source) {
                target[key] = source[key];
            }
            return target;
        },
        _getFirstPointerId(evt) {
            if (!evt.touches) {
                // fake id for mouse
                return 999;
            }
            else {
                return evt.changedTouches[0].identifier;
            }
        },
    };
});
