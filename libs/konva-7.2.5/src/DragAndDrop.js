define(["require", "exports", "./Global", "./Util"], function (require, exports, Global_1, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DD = void 0;
    exports.DD = {
        get isDragging() {
            var flag = false;
            exports.DD._dragElements.forEach((elem) => {
                if (elem.dragStatus === 'dragging') {
                    flag = true;
                }
            });
            return flag;
        },
        justDragged: false,
        get node() {
            // return first dragging node
            var node;
            exports.DD._dragElements.forEach((elem) => {
                node = elem.node;
            });
            return node;
        },
        _dragElements: new Map(),
        // methods
        _drag(evt) {
            const nodesToFireEvents = [];
            exports.DD._dragElements.forEach((elem, key) => {
                const { node } = elem;
                // we need to find pointer relative to that node
                const stage = node.getStage();
                stage.setPointersPositions(evt);
                // it is possible that user call startDrag without any event
                // it that case we need to detect first movable pointer and attach it into the node
                if (elem.pointerId === undefined) {
                    elem.pointerId = Util_1.Util._getFirstPointerId(evt);
                }
                const pos = stage._changedPointerPositions.find((pos) => pos.id === elem.pointerId);
                // not related pointer
                if (!pos) {
                    return;
                }
                if (elem.dragStatus !== 'dragging') {
                    var dragDistance = node.dragDistance();
                    var distance = Math.max(Math.abs(pos.x - elem.startPointerPos.x), Math.abs(pos.y - elem.startPointerPos.y));
                    if (distance < dragDistance) {
                        return;
                    }
                    node.startDrag({ evt });
                    // a user can stop dragging inside `dragstart`
                    if (!node.isDragging()) {
                        return;
                    }
                }
                node._setDragPosition(evt, elem);
                nodesToFireEvents.push(node);
            });
            // call dragmove only after ALL positions are changed
            nodesToFireEvents.forEach((node) => {
                node.fire('dragmove', {
                    type: 'dragmove',
                    target: node,
                    evt: evt,
                }, true);
            });
        },
        // dragBefore and dragAfter allows us to set correct order of events
        // setup all in dragbefore, and stop dragging only after pointerup triggered.
        _endDragBefore(evt) {
            exports.DD._dragElements.forEach((elem, key) => {
                const { node } = elem;
                // we need to find pointer relative to that node
                const stage = node.getStage();
                if (evt) {
                    stage.setPointersPositions(evt);
                }
                const pos = stage._changedPointerPositions.find((pos) => pos.id === elem.pointerId);
                // that pointer is not related
                if (!pos) {
                    return;
                }
                if (elem.dragStatus === 'dragging' || elem.dragStatus === 'stopped') {
                    // if a node is stopped manully we still need to reset events:
                    exports.DD.justDragged = true;
                    Global_1.Konva.listenClickTap = false;
                    elem.dragStatus = 'stopped';
                }
                const drawNode = elem.node.getLayer() ||
                    (elem.node instanceof Global_1.Konva['Stage'] && elem.node);
                if (drawNode) {
                    drawNode.batchDraw();
                }
            });
        },
        _endDragAfter(evt) {
            exports.DD._dragElements.forEach((elem, key) => {
                if (elem.dragStatus === 'stopped') {
                    elem.node.fire('dragend', {
                        type: 'dragend',
                        target: elem.node,
                        evt: evt,
                    }, true);
                }
                if (elem.dragStatus !== 'dragging') {
                    exports.DD._dragElements.delete(key);
                }
            });
        },
    };
    if (Global_1.Konva.isBrowser) {
        window.addEventListener('mouseup', exports.DD._endDragBefore, true);
        window.addEventListener('touchend', exports.DD._endDragBefore, true);
        window.addEventListener('mousemove', exports.DD._drag);
        window.addEventListener('touchmove', exports.DD._drag);
        window.addEventListener('mouseup', exports.DD._endDragAfter, false);
        window.addEventListener('touchend', exports.DD._endDragAfter, false);
    }
});
