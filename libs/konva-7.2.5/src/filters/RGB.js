define(["require", "exports", "../Factory", "../Node", "../Validators"], function (require, exports, Factory_1, Node_1, Validators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RGB = void 0;
    /**
     * RGB Filter
     * @function
     * @name RGB
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Konva.Filters.RGB]);
     * node.blue(120);
     * node.green(200);
     */
    const RGB = function (imageData) {
        var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), i, brightness;
        for (i = 0; i < nPixels; i += 4) {
            brightness =
                (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
            data[i] = brightness * red; // r
            data[i + 1] = brightness * green; // g
            data[i + 2] = brightness * blue; // b
            data[i + 3] = data[i + 3]; // alpha
        }
    };
    exports.RGB = RGB;
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
     * get/set filter red value. Use with {@link Konva.Filters.RGB} filter.
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
     * get/set filter green value. Use with {@link Konva.Filters.RGB} filter.
     * @name green
     * @method
     * @memberof Konva.Node.prototype
     * @param {Integer} green value between 0 and 255
     * @returns {Integer}
     */
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators_1.RGBComponent, Factory_1.Factory.afterSetFilter);
});
/**
 * get/set filter blue value. Use with {@link Konva.Filters.RGB} filter.
 * @name blue
 * @method
 * @memberof Konva.Node.prototype
 * @param {Integer} blue value between 0 and 255
 * @returns {Integer}
 */
