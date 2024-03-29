define(["require", "exports", "../Util", "../Factory", "./Line", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Line_1, Validators_1, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Arrow = void 0;
    /**
     * Arrow constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Line
     * @param {Object} config
     * @param {Array} config.points Flat array of points coordinates. You should define them as [x1, y1, x2, y2, x3, y3].
     * @param {Number} [config.tension] Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     *   The default is 0
     * @param {Number} config.pointerLength Arrow pointer length. Default value is 10.
     * @param {Number} config.pointerWidth Arrow pointer width. Default value is 10.
     * @param {Boolean} config.pointerAtBeginning Do we need to draw pointer on both sides?. Default false.
     * @@shapeParams
     * @@nodeParams
     * @example
     * var line = new Konva.Line({
     *   points: [73, 70, 340, 23, 450, 60, 500, 20],
     *   stroke: 'red',
     *   tension: 1,
     *   pointerLength : 10,
     *   pointerWidth : 12
     * });
     */
    class Arrow extends Line_1.Line {
        _sceneFunc(ctx) {
            super._sceneFunc(ctx);
            var PI2 = Math.PI * 2;
            var points = this.points();
            var tp = points;
            var fromTension = this.tension() !== 0 && points.length > 4;
            if (fromTension) {
                tp = this.getTensionPoints();
            }
            var n = points.length;
            var dx, dy;
            if (fromTension) {
                dx = points[n - 2] - (tp[tp.length - 2] + tp[tp.length - 4]) / 2;
                dy = points[n - 1] - (tp[tp.length - 1] + tp[tp.length - 3]) / 2;
            }
            else {
                dx = points[n - 2] - points[n - 4];
                dy = points[n - 1] - points[n - 3];
            }
            var radians = (Math.atan2(dy, dx) + PI2) % PI2;
            var length = this.pointerLength();
            var width = this.pointerWidth();
            ctx.save();
            ctx.beginPath();
            ctx.translate(points[n - 2], points[n - 1]);
            ctx.rotate(radians);
            ctx.moveTo(0, 0);
            ctx.lineTo(-length, width / 2);
            ctx.lineTo(-length, -width / 2);
            ctx.closePath();
            ctx.restore();
            if (this.pointerAtBeginning()) {
                ctx.save();
                ctx.translate(points[0], points[1]);
                if (fromTension) {
                    dx = (tp[0] + tp[2]) / 2 - points[0];
                    dy = (tp[1] + tp[3]) / 2 - points[1];
                }
                else {
                    dx = points[2] - points[0];
                    dy = points[3] - points[1];
                }
                ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
                ctx.moveTo(0, 0);
                ctx.lineTo(-length, width / 2);
                ctx.lineTo(-length, -width / 2);
                ctx.closePath();
                ctx.restore();
            }
            // here is a tricky part
            // we need to disable dash for arrow pointers
            var isDashEnabled = this.dashEnabled();
            if (isDashEnabled) {
                // manually disable dash for head
                // it is better not to use setter here,
                // because it will trigger attr change event
                this.attrs.dashEnabled = false;
                ctx.setLineDash([]);
            }
            ctx.fillStrokeShape(this);
            // restore old value
            if (isDashEnabled) {
                this.attrs.dashEnabled = true;
            }
        }
        getSelfRect() {
            const lineRect = super.getSelfRect();
            const offset = this.pointerWidth() / 2;
            return {
                x: lineRect.x - offset,
                y: lineRect.y - offset,
                width: lineRect.width + offset * 2,
                height: lineRect.height + offset * 2
            };
        }
    }
    exports.Arrow = Arrow;
    Arrow.prototype.className = 'Arrow';
    Global_1._registerNode(Arrow);
    /**
     * get/set pointerLength
     * @name Konva.Arrow#pointerLength
     * @method
     * @param {Number} Length of pointer of arrow. The default is 10.
     * @returns {Number}
     * @example
     * // get length
     * var pointerLength = line.pointerLength();
     *
     * // set length
     * line.pointerLength(15);
     */
    Factory_1.Factory.addGetterSetter(Arrow, 'pointerLength', 10, Validators_1.getNumberValidator());
    /**
     * get/set pointerWidth
     * @name Konva.Arrow#pointerWidth
     * @method
     * @param {Number} Width of pointer of arrow.
     *   The default is 10.
     * @returns {Number}
     * @example
     * // get width
     * var pointerWidth = line.pointerWidth();
     *
     * // set width
     * line.pointerWidth(15);
     */
    Factory_1.Factory.addGetterSetter(Arrow, 'pointerWidth', 10, Validators_1.getNumberValidator());
    /**
     * get/set pointerAtBeginning
     * @name Konva.Arrow#pointerAtBeginning
     * @method
     * @param {Number} Should pointer displayed at beginning of arrow. The default is false.
     * @returns {Boolean}
     * @example
     * // get value
     * var pointerAtBeginning = line.pointerAtBeginning();
     *
     * // set value
     * line.pointerAtBeginning(true);
     */
    Factory_1.Factory.addGetterSetter(Arrow, 'pointerAtBeginning', false);
    Util_1.Collection.mapMethods(Arrow);
});
