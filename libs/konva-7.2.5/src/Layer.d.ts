import { Container, ContainerConfig } from './Container';
import { Node } from './Node';
import { SceneCanvas, HitCanvas } from './Canvas';
import { Stage } from './Stage';
import { GetSet, Vector2d } from './types';
import { Group } from './Group';
import { Shape } from './Shape';
export interface LayerConfig extends ContainerConfig {
    clearBeforeDraw?: boolean;
    hitGraphEnabled?: boolean;
    imageSmoothingEnabled?: boolean;
}
/**
 * Layer constructor.  Layers are tied to their own canvas element and are used
 * to contain groups or shapes.
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
 * to clear the canvas before each layer draw.  The default value is true.
 * @@nodeParams
 * @@containerParams
 * @example
 * var layer = new Konva.Layer();
 * stage.add(layer);
 * // now you can add shapes, groups into the layer
 */
export declare class Layer extends Container<Group | Shape> {
    canvas: SceneCanvas;
    hitCanvas: HitCanvas;
    _waitingForDraw: boolean;
    constructor(config?: LayerConfig);
    createPNGStream(): any;
    /**
     * get layer canvas wrapper
     * @method
     * @name Konva.Layer#getCanvas
     */
    getCanvas(): SceneCanvas;
    /**
     * get layer hit canvas
     * @method
     * @name Konva.Layer#getHitCanvas
     */
    getHitCanvas(): HitCanvas;
    /**
     * get layer canvas context
     * @method
     * @name Konva.Layer#getContext
     */
    getContext(): import("./Context").Context;
    /**
     * clear scene and hit canvas contexts tied to the layer.
     * This function doesn't remove any nodes. It just clear canvas element.
     * @method
     * @name Konva.Layer#clear
     * @param {Object} [bounds]
     * @param {Number} [bounds.x]
     * @param {Number} [bounds.y]
     * @param {Number} [bounds.width]
     * @param {Number} [bounds.height]
     * @example
     * layer.clear();
     * layer.clear({
     *   x : 0,
     *   y : 0,
     *   width : 100,
     *   height : 100
     * });
     */
    clear(bounds?: any): this;
    setZIndex(index: any): this;
    moveToTop(): boolean;
    moveUp(): boolean;
    moveDown(): boolean;
    moveToBottom(): boolean;
    getLayer(): this;
    remove(): this;
    getStage(): Stage;
    setSize({ width, height }: {
        width: any;
        height: any;
    }): this;
    _validateAdd(child: any): void;
    _toKonvaCanvas(config: any): any;
    _checkVisibility(): void;
    _setSmoothEnabled(): void;
    /**
     * get/set width of layer. getter return width of stage. setter doing nothing.
     * if you want change width use `stage.width(value);`
     * @name Konva.Layer#width
     * @method
     * @returns {Number}
     * @example
     * var width = layer.width();
     */
    getWidth(): number;
    setWidth(): void;
    /**
     * get/set height of layer.getter return height of stage. setter doing nothing.
     * if you want change height use `stage.height(value);`
     * @name Konva.Layer#height
     * @method
     * @returns {Number}
     * @example
     * var height = layer.height();
     */
    getHeight(): number;
    setHeight(): void;
    /**
     * batch draw. this function will not do immediate draw
     * but it will schedule drawing to next tick (requestAnimFrame)
     * @method
     * @name Konva.Layer#batchDraw
     * @return {Konva.Layer} this
     */
    batchDraw(): this;
    /**
     * get visible intersection shape. This is the preferred
     * method for determining if a point intersects a shape or not
     * also you may pass optional selector parameter to return ancestor of intersected shape
     * @method
     * @name Konva.Layer#getIntersection
     * @param {Object} pos
     * @param {Number} pos.x
     * @param {Number} pos.y
     * @param {String} [selector]
     * @returns {Konva.Node}
     * @example
     * var shape = layer.getIntersection({x: 50, y: 50});
     * // or if you interested in shape parent:
     * var group = layer.getIntersection({x: 50, y: 50}, 'Group');
     */
    getIntersection(pos: Vector2d, selector?: string): Node | null;
    _getIntersection(pos: Vector2d): {
        shape?: Shape;
        antialiased?: boolean;
    };
    drawScene(can: any, top: any): this;
    drawHit(can: any, top: any): this;
    /**
     * enable hit graph. **DEPRECATED!** Use `layer.listening(true)` instead.
     * @name Konva.Layer#enableHitGraph
     * @method
     * @returns {Layer}
     */
    enableHitGraph(): this;
    /**
     * disable hit graph. **DEPRECATED!** Use `layer.listening(false)` instead.
     * @name Konva.Layer#disableHitGraph
     * @method
     * @returns {Layer}
     */
    disableHitGraph(): this;
    setHitGraphEnabled(val: any): void;
    getHitGraphEnabled(val: any): boolean;
    /**
     * Show or hide hit canvas over the stage. May be useful for debugging custom hitFunc
     * @name Konva.Layer#toggleHitCanvas
     * @method
     */
    toggleHitCanvas(): void;
    hitGraphEnabled: GetSet<boolean, this>;
    clearBeforeDraw: GetSet<boolean, this>;
    imageSmoothingEnabled: GetSet<boolean, this>;
}
