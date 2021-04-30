import { Layer } from './Layer';
import { IFrame, AnimationFn } from './types';
/**
 * Animation constructor.
 * @constructor
 * @memberof Konva
 * @param {AnimationFn} func function executed on each animation frame.  The function is passed a frame object, which contains
 *  timeDiff, lastTime, time, and frameRate properties.  The timeDiff property is the number of milliseconds that have passed
 *  since the last animation frame. The time property is the time in milliseconds that elapsed from the moment the animation started
 *  to the current animation frame. The lastTime property is a `time` value from the previous frame.  The frameRate property is the current frame rate in frames / second.
 *  Return false from function, if you don't need to redraw layer/layers on some frames.
 * @param {Konva.Layer|Array} [layers] layer(s) to be redrawn on each animation frame. Can be a layer, an array of layers, or null.
 *  Not specifying a node will result in no redraw.
 * @example
 * // move a node to the right at 50 pixels / second
 * var velocity = 50;
 *
 * var anim = new Konva.Animation(function(frame) {
 *   var dist = velocity * (frame.timeDiff / 1000);
 *   node.move({x: dist, y: 0});
 * }, layer);
 *
 * anim.start();
 */
export declare class Animation {
    func: AnimationFn;
    id: number;
    layers: Layer[];
    frame: IFrame;
    constructor(func: AnimationFn, layers?: any);
    /**
     * set layers to be redrawn on each animation frame
     * @method
     * @name Konva.Animation#setLayers
     * @param {Konva.Layer|Array} [layers] layer(s) to be redrawn. Can be a layer, an array of layers, or null.  Not specifying a node will result in no redraw.
     * @return {Konva.Animation} this
     */
    setLayers(layers: any): this;
    /**
     * get layers
     * @method
     * @name Konva.Animation#getLayers
     * @return {Array} Array of Konva.Layer
     */
    getLayers(): Layer[];
    /**
     * add layer.  Returns true if the layer was added, and false if it was not
     * @method
     * @name Konva.Animation#addLayer
     * @param {Konva.Layer} layer to add
     * @return {Bool} true if layer is added to animation, otherwise false
     */
    addLayer(layer: any): boolean;
    /**
     * determine if animation is running or not.  returns true or false
     * @method
     * @name Konva.Animation#isRunning
     * @return {Bool} is animation running?
     */
    isRunning(): boolean;
    /**
     * start animation
     * @method
     * @name Konva.Animation#start
     * @return {Konva.Animation} this
     */
    start(): this;
    /**
     * stop animation
     * @method
     * @name Konva.Animation#stop
     * @return {Konva.Animation} this
     */
    stop(): this;
    _updateFrameObject(time: any): void;
    static animations: any[];
    static animIdCounter: number;
    static animRunning: boolean;
    static _addAnimation(anim: any): void;
    static _removeAnimation(anim: any): void;
    static _runFrames(): void;
    static _animationLoop(): void;
    static _handleAnimation(): void;
}
