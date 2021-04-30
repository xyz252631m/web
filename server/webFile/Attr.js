define(["require", "exports", "./Observe.js"], function (require, exports, Observe_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Attr = void 0;
    class Attr extends Observe_js_1.Observe {
        constructor() {
            super();
        }
        getPositionInfo(el) {
            let style = el.getComputedStyle();
        }
    }
    exports.Attr = Attr;
});
