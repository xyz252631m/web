define(["require", "exports", "../Factory", "../Node", "../Validators"], function (require, exports, Factory_1, Node_1, Validators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Contrast = void 0;
    /**
     * Contrast Filter.
     * @function
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Contrast]);
     * node.contrast(10);
     */
    const Contrast = function (imageData) {
        var adjust = Math.pow((this.contrast() + 100) / 100, 2);
        var data = imageData.data, nPixels = data.length, red = 150, green = 150, blue = 150, i;
        for (i = 0; i < nPixels; i += 4) {
            red = data[i];
            green = data[i + 1];
            blue = data[i + 2];
            //Red channel
            red /= 255;
            red -= 0.5;
            red *= adjust;
            red += 0.5;
            red *= 255;
            //Green channel
            green /= 255;
            green -= 0.5;
            green *= adjust;
            green += 0.5;
            green *= 255;
            //Blue channel
            blue /= 255;
            blue -= 0.5;
            blue *= adjust;
            blue += 0.5;
            blue *= 255;
            red = red < 0 ? 0 : red > 255 ? 255 : red;
            green = green < 0 ? 0 : green > 255 ? 255 : green;
            blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
            data[i] = red;
            data[i + 1] = green;
            data[i + 2] = blue;
        }
    };
    exports.Contrast = Contrast;
    /**
     * get/set filter contrast.  The contrast is a number between -100 and 100.
     * Use with {@link Konva.Filters.Contrast} filter.
     * @name Konva.Node#contrast
     * @method
     * @param {Number} contrast value between -100 and 100
     * @returns {Number}
     */
    Factory_1.Factory.addGetterSetter(Node_1.Node, 'contrast', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
});
