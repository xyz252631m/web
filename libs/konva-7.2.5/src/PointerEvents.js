define(["require", "exports", "./Global"], function (require, exports, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.releaseCapture = exports.setPointerCapture = exports.hasPointerCapture = exports.createEvent = exports.getCapturedShape = void 0;
    const Captures = new Map();
    // we may use this module for capturing touch events too
    // so make sure we don't do something super specific to pointer
    const SUPPORT_POINTER_EVENTS = Global_1.Konva._global['PointerEvent'] !== undefined;
    function getCapturedShape(pointerId) {
        return Captures.get(pointerId);
    }
    exports.getCapturedShape = getCapturedShape;
    function createEvent(evt) {
        return {
            evt,
            pointerId: evt.pointerId
        };
    }
    exports.createEvent = createEvent;
    function hasPointerCapture(pointerId, shape) {
        return Captures.get(pointerId) === shape;
    }
    exports.hasPointerCapture = hasPointerCapture;
    function setPointerCapture(pointerId, shape) {
        releaseCapture(pointerId);
        const stage = shape.getStage();
        if (!stage)
            return;
        Captures.set(pointerId, shape);
        if (SUPPORT_POINTER_EVENTS) {
            shape._fire('gotpointercapture', createEvent(new PointerEvent('gotpointercapture')));
        }
    }
    exports.setPointerCapture = setPointerCapture;
    function releaseCapture(pointerId, target) {
        const shape = Captures.get(pointerId);
        if (!shape)
            return;
        const stage = shape.getStage();
        if (stage && stage.content) {
            // stage.content.releasePointerCapture(pointerId);
        }
        Captures.delete(pointerId);
        if (SUPPORT_POINTER_EVENTS) {
            shape._fire('lostpointercapture', createEvent(new PointerEvent('lostpointercapture')));
        }
    }
    exports.releaseCapture = releaseCapture;
});
