define(["require", "exports", "../Util", "../Factory", "../Shape", "../Global", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Shape_1, Global_1, Validators_1, Global_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Arc = void 0;
    /**
     * Arc constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.angle in degrees
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {Boolean} [config.clockwise]
     * @@shapeParams
     * @@nodeParams
     * @example
     * // draw a Arc that's pointing downwards
     * var arc = new Konva.Arc({
     *   innerRadius: 40,
     *   outerRadius: 80,
     *   fill: 'red',
     *   stroke: 'black'
     *   strokeWidth: 5,
     *   angle: 60,
     *   rotationDeg: -120
     * });
     */
    class Arc extends Shape_1.Shape {
        _sceneFunc(context) {
            var angle = Global_1.Konva.getAngle(this.angle()), clockwise = this.clockwise();
            context.beginPath();
            context.arc(0, 0, this.outerRadius(), 0, angle, clockwise);
            context.arc(0, 0, this.innerRadius(), angle, 0, !clockwise);
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
    exports.Arc = Arc;
    Arc.prototype._centroid = true;
    Arc.prototype.className = 'Arc';
    Arc.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
    Global_2._registerNode(Arc);
    // add getters setters
    Factory_1.Factory.addGetterSetter(Arc, 'innerRadius', 0, Validators_1.getNumberValidator());
    /**
     * get/set innerRadius
     * @name Konva.Arc#innerRadius
     * @method
     * @param {Number} innerRadius
     * @returns {Number}
     * @example
     * // get inner radius
     * var innerRadius = arc.innerRadius();
     *
     * // set inner radius
     * arc.innerRadius(20);
     */
    Factory_1.Factory.addGetterSetter(Arc, 'outerRadius', 0, Validators_1.getNumberValidator());
    /**
     * get/set outerRadius
     * @name Konva.Arc#outerRadius
     * @method
     * @param {Number} outerRadius
     * @returns {Number}
     * @example
     * // get outer radius
     * var outerRadius = arc.outerRadius();
     *
     * // set outer radius
     * arc.outerRadius(20);
     */
    Factory_1.Factory.addGetterSetter(Arc, 'angle', 0, Validators_1.getNumberValidator());
    /**
     * get/set angle in degrees
     * @name Konva.Arc#angle
     * @method
     * @param {Number} angle
     * @returns {Number}
     * @example
     * // get angle
     * var angle = arc.angle();
     *
     * // set angle
     * arc.angle(20);
     */
    Factory_1.Factory.addGetterSetter(Arc, 'clockwise', false, Validators_1.getBooleanValidator());
    /**
     * get/set clockwise flag
     * @name Konva.Arc#clockwise
     * @method
     * @param {Boolean} clockwise
     * @returns {Boolean}
     * @example
     * // get clockwise flag
     * var clockwise = arc.clockwise();
     *
     * // draw arc counter-clockwise
     * arc.clockwise(false);
     *
     * // draw arc clockwise
     * arc.clockwise(true);
     */
    Util_1.Collection.mapMethods(Arc);
});
