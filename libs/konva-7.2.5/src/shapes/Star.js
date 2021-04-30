define(["require", "exports", "../Util", "../Factory", "../Shape", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Shape_1, Validators_1, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Star = void 0;
    /**
     * Star constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Integer} config.numPoints
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @@shapeParams
     * @@nodeParams
     * @example
     * var star = new Konva.Star({
     *   x: 100,
     *   y: 200,
     *   numPoints: 5,
     *   innerRadius: 70,
     *   outerRadius: 70,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 4
     * });
     */
    class Star extends Shape_1.Shape {
        _sceneFunc(context) {
            var innerRadius = this.innerRadius(), outerRadius = this.outerRadius(), numPoints = this.numPoints();
            context.beginPath();
            context.moveTo(0, 0 - outerRadius);
            for (var n = 1; n < numPoints * 2; n++) {
                var radius = n % 2 === 0 ? outerRadius : innerRadius;
                var x = radius * Math.sin((n * Math.PI) / numPoints);
                var y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
                context.lineTo(x, y);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
        getWidth() {
            return this.outerRadius() * 2;
        }
        getHeight() {
            return this.outerRadius() * 2;
        }
        setWidth(width) {
            this.outerRadius(width / 2);
        }
        setHeight(height) {
            this.outerRadius(height / 2);
        }
    }
    exports.Star = Star;
    Star.prototype.className = 'Star';
    Star.prototype._centroid = true;
    Star.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
    Global_1._registerNode(Star);
    /**
     * get/set number of points
     * @name Konva.Star#numPoints
     * @method
     * @param {Number} numPoints
     * @returns {Number}
     * @example
     * // get inner radius
     * var numPoints = star.numPoints();
     *
     * // set inner radius
     * star.numPoints(20);
     */
    Factory_1.Factory.addGetterSetter(Star, 'numPoints', 5, Validators_1.getNumberValidator());
    /**
     * get/set innerRadius
     * @name Konva.Star#innerRadius
     * @method
     * @param {Number} innerRadius
     * @returns {Number}
     * @example
     * // get inner radius
     * var innerRadius = star.innerRadius();
     *
     * // set inner radius
     * star.innerRadius(20);
     */
    Factory_1.Factory.addGetterSetter(Star, 'innerRadius', 0, Validators_1.getNumberValidator());
    /**
     * get/set outerRadius
     * @name Konva.Star#outerRadius
     * @method
     * @param {Number} outerRadius
     * @returns {Number}
     * @example
     * // get inner radius
     * var outerRadius = star.outerRadius();
     *
     * // set inner radius
     * star.outerRadius(20);
     */
    Factory_1.Factory.addGetterSetter(Star, 'outerRadius', 0, Validators_1.getNumberValidator());
    Util_1.Collection.mapMethods(Star);
});
