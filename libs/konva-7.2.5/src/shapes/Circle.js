define(["require", "exports", "../Util", "../Factory", "../Shape", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Shape_1, Validators_1, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Circle = void 0;
    /**
     * Circle constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.radius
     * @@shapeParams
     * @@nodeParams
     * @example
     * // create circle
     * var circle = new Konva.Circle({
     *   radius: 40,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 5
     * });
     */
    class Circle extends Shape_1.Shape {
        _sceneFunc(context) {
            context.beginPath();
            context.arc(0, 0, this.attrs.radius || 0, 0, Math.PI * 2, false);
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
            if (this.radius() !== width / 2) {
                this.radius(width / 2);
            }
        }
        setHeight(height) {
            if (this.radius() !== height / 2) {
                this.radius(height / 2);
            }
        }
    }
    exports.Circle = Circle;
    Circle.prototype._centroid = true;
    Circle.prototype.className = 'Circle';
    Circle.prototype._attrsAffectingSize = ['radius'];
    Global_1._registerNode(Circle);
    /**
     * get/set radius
     * @name Konva.Circle#radius
     * @method
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radius
     * var radius = circle.radius();
     *
     * // set radius
     * circle.radius(10);
     */
    Factory_1.Factory.addGetterSetter(Circle, 'radius', 0, Validators_1.getNumberValidator());
    Util_1.Collection.mapMethods(Circle);
});
