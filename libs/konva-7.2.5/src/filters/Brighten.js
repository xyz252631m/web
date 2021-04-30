define(["require", "exports", "../Factory", "../Node", "../Validators"], function (require, exports, Factory_1, Node_1, Validators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Brighten = void 0;
    /**
     * Brighten Filter.
     * @function
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Brighten]);
     * node.brightness(0.8);
     */
    const Brighten = function (imageData) {
        var brightness = this.brightness() * 255, data = imageData.data, len = data.length, i;
        for (i = 0; i < len; i += 4) {
            // red
            data[i] += brightness;
            // green
            data[i + 1] += brightness;
            // blue
            data[i + 2] += brightness;
        }
    };
    exports.Brighten = Brighten;
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'brightness', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
});
/**
 * get/set filter brightness.  The brightness is a number between -1 and 1.&nbsp; Positive values
 *  brighten the pixels and negative values darken them. Use with {@link Konva.Filters.Brighten} filter.
 * @name Konva.Node#brightness
 * @method

 * @param {Number} brightness value between -1 and 1
 * @returns {Number}
 */
