define(["require", "exports", "../Util", "../Factory", "../Shape", "../Global", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Shape_1, Global_1, Validators_1, Global_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Wedge = void 0;
    /**
     * Wedge constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.angle in degrees
     * @param {Number} config.radius
     * @param {Boolean} [config.clockwise]
     * @@shapeParams
     * @@nodeParams
     * @example
     * // draw a wedge that's pointing downwards
     * var wedge = new Konva.Wedge({
     *   radius: 40,
     *   fill: 'red',
     *   stroke: 'black'
     *   strokeWidth: 5,
     *   angleDeg: 60,
     *   rotationDeg: -120
     * });
     */
    class Wedge extends Shape_1.Shape {
        _sceneFunc(context) {
            context.beginPath();
            context.arc(0, 0, this.radius(), 0, Global_1.Konva.getAngle(this.angle()), this.clockwise());
            context.lineTo(0, 0);
            context.closePath();
            context.fillStrokeShape(this);
        }
        getWidth() {
            return this.radius() * 2;
        }
        getHeight() {
            return this.radius() * 2;
        }
        setWidth(width) {
            this.radius(width / 2);
        }
        setHeight(height) {
            this.radius(height / 2);
        }
    }
    exports.Wedge = Wedge;
    Wedge.prototype.className = 'Wedge';
    Wedge.prototype._centroid = true;
    Wedge.prototype._attrsAffectingSize = ['radius'];
    Global_2._registerNode(Wedge);
    /**
     * get/set radius
     * @name Konva.Wedge#radius
     * @method
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radius
     * var radius = wedge.radius();
     *
     * // set radius
     * wedge.radius(10);
     */
    Factory_1.Factory.addGetterSetter(Wedge, 'radius', 0, Validators_1.getNumberValidator());
    /**
     * get/set angle in degrees
     * @name Konva.Wedge#angle
     * @method
     * @param {Number} angle
     * @returns {Number}
     * @example
     * // get angle
     * var angle = wedge.angle();
     *
     * // set angle
     * wedge.angle(20);
     */
    Factory_1.Factory.addGetterSetter(Wedge, 'angle', 0, Validators_1.getNumberValidator());
    /**
     * get/set clockwise flag
     * @name Konva.Wedge#clockwise
     * @method
     * @param {Number} clockwise
     * @returns {Number}
     * @example
     * // get clockwise flag
     * var clockwise = wedge.clockwise();
     *
     * // draw wedge counter-clockwise
     * wedge.clockwise(false);
     *
     * // draw wedge clockwise
     * wedge.clockwise(true);
     */
    Factory_1.Factory.addGetterSetter(Wedge, 'clockwise', false);
    Factory_1.Factory.backCompat(Wedge, {
        angleDeg: 'angle',
        getAngleDeg: 'getAngle',
        setAngleDeg: 'setAngle'
    });
    Util_1.Collection.mapMethods(Wedge);
});
