define(["require", "exports", "./Global", "./Util", "./Node", "./Container", "./Stage", "./Layer", "./FastLayer", "./Group", "./DragAndDrop", "./Shape", "./Animation", "./Tween", "./Context", "./Canvas"], function (require, exports, Global_1, Util_1, Node_1, Container_1, Stage_1, Layer_1, FastLayer_1, Group_1, DragAndDrop_1, Shape_1, Animation_1, Tween_1, Context_1, Canvas_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Konva = void 0;
    exports.Konva = Util_1.Util._assign(Global_1.Konva, {
        Collection: Util_1.Collection,
        Util: Util_1.Util,
        Transform: Util_1.Transform,
        Node: Node_1.Node,
        ids: Node_1.ids,
        names: Node_1.names,
        Container: Container_1.Container,
        Stage: Stage_1.Stage,
        stages: Stage_1.stages,
        Layer: Layer_1.Layer,
        FastLayer: FastLayer_1.FastLayer,
        Group: Group_1.Group,
        DD: DragAndDrop_1.DD,
        Shape: Shape_1.Shape,
        shapes: Shape_1.shapes,
        Animation: Animation_1.Animation,
        Tween: Tween_1.Tween,
        Easings: Tween_1.Easings,
        Context: Context_1.Context,
        Canvas: Canvas_1.Canvas
    });
});
