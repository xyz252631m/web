import { Collection } from './Util';
import { Container, ContainerConfig } from './Container';
import { SceneCanvas, HitCanvas } from './Canvas';
import { GetSet, Vector2d } from './types';
import { Shape } from './Shape';
import { Layer } from './Layer';
export interface StageConfig extends ContainerConfig {
    container: HTMLDivElement | string;
}
export declare const stages: Stage[];
/**
 * Stage constructor.  A stage is used to contain multiple layers
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @param {String|Element} config.container Container selector or DOM element
 * @@nodeParams
 * @example
 * var stage = new Konva.Stage({
 *   width: 500,
 *   height: 800,
 *   container: 'containerId' // or "#containerId" or ".containerClass"
 * });
 */
export declare class Stage extends Container<Layer> {
    content: HTMLDivElement;
    pointerPos: Vector2d | null;
    _pointerPositions: (Vector2d & {
        id?: number;
    })[];
    _changedPointerPositions: (Vector2d & {
        id?: number;
    })[];
    bufferCanvas: SceneCanvas;
    bufferHitCanvas: HitCanvas;
    targetShape: Shape;
    clickStartShape: Shape;
    clickEndShape: Shape;
    tapStartShape: Shape;
    tapEndShape: Shape;
    dblTimeout: any;
    constructor(config: StageConfig);
    _validateAdd(child: any): void;
    _checkVisibility(): void;
    /**
     * set container dom element which contains the stage wrapper div element
     * @method
     * @name Konva.Stage#setContainer
     * @param {DomElement} container can pass in a dom element or id string
     */
    setContainer(container: any): this;
    shouldDrawHit(): boolean;
    /**
     * clear all layers
     * @method
     * @name Konva.Stage#clear
     */
    clear(): this;
    clone(obj: any): any;
    destroy(): this;
    /**
     * returns absolute pointer position which can be a touch position or mouse position
     * pointer position doesn't include any transforms (such as scale) of the stage
     * it is just a plain position of pointer relative to top-left corner of the stage container
     * @method
     * @name Konva.Stage#getPointerPosition
     * @returns {Vector2d|null}
     */
    getPointerPosition(): Vector2d | null;
    _getPointerById(id?: number): Vector2d & {
        id?: number;
    };
    getPointersPositions(): (Vector2d & {
        id?: number;
    })[];
    getStage(): this;
    getContent(): HTMLDivElement;
    _toKonvaCanvas(config: any): SceneCanvas;
    /**
     * get visible intersection shape. This is the preferred
     *  method for determining if a point intersects a shape or not
     * @method
     * @name Konva.Stage#getIntersection
     * @param {Object} pos
     * @param {Number} pos.x
     * @param {Number} pos.y
     * @param {String} [selector]
     * @returns {Konva.Node}
     * @example
     * var shape = stage.getIntersection({x: 50, y: 50});
     * // or if you interested in shape parent:
     * var group = stage.getIntersection({x: 50, y: 50}, 'Group');
     */
    getIntersection(pos: Vector2d | null, selector?: string): Shape | null;
    _resizeDOM(): void;
    add(layer: Layer): this;
    getParent(): any;
    getLayer(): any;
    hasPointerCapture(pointerId: number): boolean;
    setPointerCapture(pointerId: number): void;
    releaseCapture(pointerId: number): void;
    /**
     * returns a {@link Konva.Collection} of layers
     * @method
     * @name Konva.Stage#getLayers
     */
    getLayers(): Collection<import("./Node").Node<import("./Node").NodeConfig>>;
    _bindContentEvents(): void;
    _mouseenter(evt: any): void;
    _mouseover(evt: any): void;
    _mouseleave(evt: any): void;
    _mousemove(evt: any): void;
    _mousedown(evt: any): void;
    _mouseup(evt: any): void;
    _contextmenu(evt: any): void;
    _touchstart(evt: any): void;
    _touchmove(evt: any): void;
    _touchend(evt: any): void;
    _wheel(evt: any): void;
    _pointerdown(evt: PointerEvent): void;
    _pointermove(evt: PointerEvent): void;
    _pointerup(evt: PointerEvent): void;
    _pointercancel(evt: PointerEvent): void;
    _lostpointercapture(evt: PointerEvent): void;
    /**
     * manually register pointers positions (mouse/touch) in the stage.
     * So you can use stage.getPointerPosition(). Usually you don't need to use that method
     * because all internal events are automatically registered. It may be useful if event
     * is triggered outside of the stage, but you still want to use Konva methods to get pointers position.
     * @method
     * @name Konva.Stage#setPointersPositions
     * @param {Object} event Event object
     * @example
     *
     * window.addEventListener('mousemove', (e) => {
     *   stage.setPointersPositions(e);
     * });
     */
    setPointersPositions(evt: any): void;
    _setPointerPosition(evt: any): void;
    _getContentPosition(): {
        top: number;
        left: number;
        scaleX: number;
        scaleY: number;
    };
    _buildDOM(): void;
    cache(): this;
    clearCache(): this;
    /**
     * batch draw
     * @method
     * @name Konva.Stage#batchDraw
     * @return {Konva.Stage} this
     */
    batchDraw(): this;
    container: GetSet<HTMLDivElement, this>;
}
