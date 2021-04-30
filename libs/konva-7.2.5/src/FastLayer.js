define(["require", "exports", "./Util", "./Layer", "./Global"], function (require, exports, Util_1, Layer_1, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FastLayer = void 0;
    /**
     * FastLayer constructor. **DEPRECATED!** Please use `Konva.Layer({ listening: false})` instead. Layers are tied to their own canvas element and are used
     * to contain shapes only.  If you don't need node nesting, mouse and touch interactions,
     * or event pub/sub, you should use FastLayer instead of Layer to create your layers.
     * It renders about 2x faster than normal layers.
     *
     * @constructor
     * @memberof Konva
     * @augments Konva.Layer
     * @@containerParams
     * @example
     * var layer = new Konva.FastLayer();
     */
    class FastLayer extends Layer_1.Layer {
        constructor(attrs) {
            super(attrs);
            this.listening(false);
            Util_1.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
        }
    }
    exports.FastLayer = FastLayer;
    FastLayer.prototype.nodeType = 'FastLayer';
    Global_1._registerNode(FastLayer);
    Util_1.Collection.mapMethods(FastLayer);
});
