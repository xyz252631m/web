define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Invert = void 0;
    /**
     * Invert Filter
     * @function
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Invert]);
     */
    const Invert = function (imageData) {
        var data = imageData.data, len = data.length, i;
        for (i = 0; i < len; i += 4) {
            // red
            data[i] = 255 - data[i];
            // green
            data[i + 1] = 255 - data[i + 1];
            // blue
            data[i + 2] = 255 - data[i + 2];
        }
    };
    exports.Invert = Invert;
});
