define(["require", "exports", "../Util", "../Factory", "../Shape", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Shape_1, Validators_1, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ring = void 0;
    var PIx2 = Math.PI * 2;
    /**
     * Ring constructor
     * @constructor
     * @augments Konva.Shape
     * @memberof Konva
     * @param {Object} config
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {Boolean} [config.clockwise]
     * @@shapeParams
     * @@nodeParams
     * @example
     * var ring = new Konva.Ring({
     *   innerRadius: 40,
     *   outerRadius: 80,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 5
     * });
     */
    class Ring extends Shape_1.Shape {
        _sceneFunc(context) {
            context.beginPath();
            context.arc(0, 0, this.innerRadius(), 0, PIx2, false);
            context.moveTo(this.outerRadius(), 0);
            context.arc(0, 0, this.outerRadius(), PIx2, 0, true);
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
    exports.Ring = Ring;
    Ring.prototype.className = 'Ring';
    Ring.prototype._centroid = true;
    Ring.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
    Global_1._registerNode(Ring);
    /**
     * get/set innerRadius
     * @method
     * @name Konva.Ring#innerRadius
     * @param {Number} innerRadius
     * @returns {Number}
     * @example
     * // get inner radius
     * var innerRadius = ring.innerRadius();
     *
     * // set inner radius
     * ring.innerRadius(20);
     */
    Factory_1.Factory.addGetterSetter(Ring, 'innerRadius', 0, Validators_1.getNumberValidator());
    /**
     * get/set outerRadius
     * @name Konva.Ring#outerRadius
     * @method
     * @param {Number} outerRadius
     * @returns {Number}
     * @example
     * // get outer radius
     * var outerRadius = ring.outerRadius();
     *
     * // set outer radius
     * ring.outerRadius(20);
     */
    Factory_1.Factory.addGetterSetter(Ring, 'outerRadius', 0, Validators_1.getNumberValidator());
    Util_1.Collection.mapMethods(Ring);
});
