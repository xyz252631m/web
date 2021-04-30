define(["require", "exports", "../Factory", "../Node", "../Validators"], function (require, exports, Factory_1, Node_1, Validators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RGBA = void 0;
    /**
     * RGBA Filter
     * @function
     * @name RGBA
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author codefo
     * @example
     * node.cache();
     * node.filters([Konva.Filters.RGBA]);
     * node.blue(120);
     * node.green(200);
     * node.alpha(0.3);
     */
    const RGBA = function (imageData) {
        var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), alpha = this.alpha(), i, ia;
        for (i = 0; i < nPixels; i += 4) {
            ia = 1 - alpha;
            data[i] = red * alpha + data[i] * ia; // r
            data[i + 1] = green * alpha + data[i + 1] * ia; // g
            data[i + 2] = blue * alpha + data[i + 2] * ia; // b
        }
    };
    exports.RGBA = RGBA;
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
        this._filterUpToDate = false;
        if (val > 255) {
            return 255;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return Math.round(val);
        }
    });
    /**
     * get/set filter red value. Use with {@link Konva.Filters.RGBA} filter.
     * @name red
     * @method
     * @memberof Konva.Node.prototype
     * @param {Integer} red value between 0 and 255
     * @returns {Integer}
     */
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
        this._filterUpToDate = false;
        if (val > 255) {
            return 255;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return Math.round(val);
        }
    });
    /**
     * get/set filter green value. Use with {@link Konva.Filters.RGBA} filter.
     * @name green
     * @method
     * @memberof Konva.Node.prototype
     * @param {Integer} green value between 0 and 255
     * @returns {Integer}
     */
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators_1.RGBComponent, Factory_1.Factory.afterSetFilter);
    /**
     * get/set filter blue value. Use with {@link Konva.Filters.RGBA} filter.
     * @name blue
     * @method
     * @memberof Konva.Node.prototype
     * @param {Integer} blue value between 0 and 255
     * @returns {Integer}
     */
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'alpha', 1, function (val) {
        this._filterUpToDate = false;
        if (val > 1) {
            return 1;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return val;
        }
    });
});
/**
 * get/set filter alpha value. Use with {@link Konva.Filters.RGBA} filter.
 * @name alpha
 * @method
 * @memberof Konva.Node.prototype
 * @param {Float} alpha value between 0 and 1
 * @returns {Float}
 */
