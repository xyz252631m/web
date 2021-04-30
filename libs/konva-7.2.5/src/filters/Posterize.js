define(["require", "exports", "../Factory", "../Node", "../Validators"], function (require, exports, Factory_1, Node_1, Validators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Posterize = void 0;
    /**
     * Posterize Filter. Adjusts the channels so that there are no more
     *  than n different values for that channel. This is also applied
     *  to the alpha channel.
     * @function
     * @name Posterize
     * @author ippo615
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Posterize]);
     * node.levels(0.8); // between 0 and 1
     */
    const Posterize = function (imageData) {
        // level must be between 1 and 255
        var levels = Math.round(this.levels() * 254) + 1, data = imageData.data, len = data.length, scale = 255 / levels, i;
        for (i = 0; i < len; i += 1) {
            data[i] = Math.floor(data[i] / scale) * scale;
        }
    };
    exports.Posterize = Posterize;
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'levels', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
});
/**
 * get/set levels.  Must be a number between 0 and 1.  Use with {@link Konva.Filters.Posterize} filter.
 * @name Konva.Node#levels
 * @method
 * @param {Number} level between 0 and 1
 * @returns {Number}
 */
