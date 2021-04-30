define(["require", "exports", "../Factory", "../Node", "../Validators"], function (require, exports, Factory_1, Node_1, Validators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Threshold = void 0;
    /**
     * Threshold Filter. Pushes any value above the mid point to
     *  the max and any value below the mid point to the min.
     *  This affects the alpha channel.
     * @function
     * @name Threshold
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Threshold]);
     * node.threshold(0.1);
     */
    const Threshold = function (imageData) {
        var level = this.threshold() * 255, data = imageData.data, len = data.length, i;
        for (i = 0; i < len; i += 1) {
            data[i] = data[i] < level ? 0 : 255;
        }
    };
    exports.Threshold = Threshold;
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'threshold', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
});
/**
 * get/set threshold.  Must be a value between 0 and 1. Use with {@link Konva.Filters.Threshold} or {@link Konva.Filters.Mask} filter.
 * @name threshold
 * @method
 * @memberof Konva.Node.prototype
 * @param {Number} threshold
 * @returns {Number}
 */
