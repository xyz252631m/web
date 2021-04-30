define(["require", "exports", "../Util", "../Factory", "../Shape", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Shape_1, Validators_1, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RegularPolygon = void 0;
    /**
     * RegularPolygon constructor. Examples include triangles, squares, pentagons, hexagons, etc.
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.sides
     * @param {Number} config.radius
     * @@shapeParams
     * @@nodeParams
     * @example
     * var hexagon = new Konva.RegularPolygon({
     *   x: 100,
     *   y: 200,
     *   sides: 6,
     *   radius: 70,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 4
     * });
     */
    class RegularPolygon extends Shape_1.Shape {
        _sceneFunc(context) {
            const points = this._getPoints();
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (var n = 1; n < points.length; n++) {
                context.lineTo(points[n].x, points[n].y);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
        _getPoints() {
            const sides = this.attrs.sides;
            const radius = this.attrs.radius || 0;
            const points = [];
            for (var n = 0; n < sides; n++) {
                points.push({
                    x: radius * Math.sin((n * 2 * Math.PI) / sides),
                    y: -1 * radius * Math.cos((n * 2 * Math.PI) / sides),
                });
            }
            return points;
        }
        getSelfRect() {
            const points = this._getPoints();
            var minX = points[0].x;
            var maxX = points[0].y;
            var minY = points[0].x;
            var maxY = points[0].y;
            points.forEach((point) => {
                minX = Math.min(minX, point.x);
                maxX = Math.max(maxX, point.x);
                minY = Math.min(minY, point.y);
                maxY = Math.max(maxY, point.y);
            });
            return {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
            };
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
    exports.RegularPolygon = RegularPolygon;
    RegularPolygon.prototype.className = 'RegularPolygon';
    RegularPolygon.prototype._centroid = true;
    RegularPolygon.prototype._attrsAffectingSize = ['radius'];
    Global_1._registerNode(RegularPolygon);
    /**
     * get/set radius
     * @method
     * @name Konva.RegularPolygon#radius
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radius
     * var radius = shape.radius();
     *
     * // set radius
     * shape.radius(10);
     */
    Factory_1.Factory.addGetterSetter(RegularPolygon, 'radius', 0, Validators_1.getNumberValidator());
    /**
     * get/set sides
     * @method
     * @name Konva.RegularPolygon#sides
     * @param {Number} sides
     * @returns {Number}
     * @example
     * // get sides
     * var sides = shape.sides();
     *
     * // set sides
     * shape.sides(10);
     */
    Factory_1.Factory.addGetterSetter(RegularPolygon, 'sides', 0, Validators_1.getNumberValidator());
    Util_1.Collection.mapMethods(RegularPolygon);
});
