import { Node, NodeConfig } from './Node';
import { Context } from './Context';
import { GetSet, Vector2d } from './types';
import { HitCanvas, SceneCanvas } from './Canvas';
export declare type ShapeConfigHandler<TTarget> = {
    bivarianceHack(ctx: Context, shape: TTarget): void;
}['bivarianceHack'];
export declare type LineJoin = 'round' | 'bevel' | 'miter';
export declare type LineCap = 'butt' | 'round' | 'square';
export interface ShapeConfig extends NodeConfig {
    fill?: string;
    fillPatternImage?: HTMLImageElement;
    fillPatternX?: number;
    fillPatternY?: number;
    fillPatternOffset?: Vector2d;
    fillPatternOffsetX?: number;
    fillPatternOffsetY?: number;
    fillPatternScale?: Vector2d;
    fillPatternScaleX?: number;
    fillPatternScaleY?: number;
    fillPatternRotation?: number;
    fillPatternRepeat?: string;
    fillLinearGradientStartPoint?: Vector2d;
    fillLinearGradientStartPointX?: number;
    fillLinearGradientStartPointY?: number;
    fillLinearGradientEndPoint?: Vector2d;
    fillLinearGradientEndPointX?: number;
    fillLinearGradientEndPointY?: number;
    fillLinearGradientColorStops?: Array<number | string>;
    fillRadialGradientStartPoint?: Vector2d;
    fillRadialGradientStartPointX?: number;
    fillRadialGradientStartPointY?: number;
    fillRadialGradientEndPoint?: Vector2d;
    fillRadialGradientEndPointX?: number;
    fillRadialGradientEndPointY?: number;
    fillRadialGradientStartRadius?: number;
    fillRadialGradientEndRadius?: number;
    fillRadialGradientColorStops?: Array<number | string>;
    fillEnabled?: boolean;
    fillPriority?: string;
    stroke?: string;
    strokeWidth?: number;
    fillAfterStrokeEnabled?: boolean;
    hitStrokeWidth?: number | string;
    strokeScaleEnabled?: boolean;
    strokeHitEnabled?: boolean;
    strokeEnabled?: boolean;
    lineJoin?: LineJoin;
    lineCap?: LineCap;
    sceneFunc?: (con: Context, shape: Shape) => void;
    hitFunc?: (con: Context, shape: Shape) => void;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffset?: Vector2d;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowOpacity?: number;
    shadowEnabled?: boolean;
    shadowForStrokeEnabled?: boolean;
    dash?: number[];
    dashOffset?: number;
    dashEnabled?: boolean;
    perfectDrawEnabled?: boolean;
}
export interface ShapeGetClientRectConfig {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Node;
}
export declare const shapes: {
    [key: string]: Shape;
};
/**
 * Shape constructor.  Shapes are primitive objects such as rectangles,
 *  circles, text, lines, etc.
 * @constructor
 * @memberof Konva
 * @augments Konva.Node
 * @param {Object} config
 * @@shapeParams
 * @@nodeParams
 * @example
 * var customShape = new Konva.Shape({
 *   x: 5,
 *   y: 10,
 *   fill: 'red',
 *   // a Konva.Canvas renderer is passed into the sceneFunc function
 *   sceneFunc (context, shape) {
 *     context.beginPath();
 *     context.moveTo(200, 50);
 *     context.lineTo(420, 80);
 *     context.quadraticCurveTo(300, 100, 260, 170);
 *     context.closePath();
 *     // Konva specific method
 *     context.fillStrokeShape(shape);
 *   }
 *});
 */
export declare class Shape<Config extends ShapeConfig = ShapeConfig> extends Node<Config> {
    _centroid: boolean;
    colorKey: string;
    _fillFunc: (ctx: Context) => void;
    _strokeFunc: (ctx: Context) => void;
    _fillFuncHit: (ctx: Context) => void;
    _strokeFuncHit: (ctx: Context) => void;
    constructor(config?: Config);
    /**
     * get canvas context tied to the layer
     * @method
     * @name Konva.Shape#getContext
     * @returns {Konva.Context}
     */
    getContext(): Context;
    /**
     * get canvas renderer tied to the layer.  Note that this returns a canvas renderer, not a canvas element
     * @method
     * @name Konva.Shape#getCanvas
     * @returns {Konva.Canvas}
     */
    getCanvas(): SceneCanvas;
    getSceneFunc(): any;
    getHitFunc(): any;
    /**
     * returns whether or not a shadow will be rendered
     * @method
     * @name Konva.Shape#hasShadow
     * @returns {Boolean}
     */
    hasShadow(): any;
    _hasShadow(): boolean;
    _getFillPattern(): any;
    __getFillPattern(): CanvasPattern;
    _getLinearGradient(): any;
    __getLinearGradient(): CanvasGradient;
    _getRadialGradient(): any;
    __getRadialGradient(): CanvasGradient;
    getShadowRGBA(): any;
    _getShadowRGBA(): string;
    /**
     * returns whether or not the shape will be filled
     * @method
     * @name Konva.Shape#hasFill
     * @returns {Boolean}
     */
    hasFill(): any;
    /**
     * returns whether or not the shape will be stroked
     * @method
     * @name Konva.Shape#hasStroke
     * @returns {Boolean}
     */
    hasStroke(): any;
    hasHitStroke(): any;
    /**
     * determines if point is in the shape, regardless if other shapes are on top of it.  Note: because
     *  this method clears a temporary canvas and then redraws the shape, it performs very poorly if executed many times
     *  consecutively.  Please use the {@link Konva.Stage#getIntersection} method if at all possible
     *  because it performs much better
     * @method
     * @name Konva.Shape#intersects
     * @param {Object} point
     * @param {Number} point.x
     * @param {Number} point.y
     * @returns {Boolean}
     */
    intersects(point: any): boolean;
    destroy(): this;
    _useBufferCanvas(forceFill?: boolean): boolean;
    setStrokeHitEnabled(val: number): void;
    getStrokeHitEnabled(): boolean;
    /**
     * return self rectangle (x, y, width, height) of shape.
     * This method are not taken into account transformation and styles.
     * @method
     * @name Konva.Shape#getSelfRect
     * @returns {Object} rect with {x, y, width, height} properties
     * @example
     *
     * rect.getSelfRect();  // return {x:0, y:0, width:rect.width(), height:rect.height()}
     * circle.getSelfRect();  // return {x: - circle.width() / 2, y: - circle.height() / 2, width:circle.width(), height:circle.height()}
     *
     */
    getSelfRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    getClientRect(config?: ShapeGetClientRectConfig): {
        width: number;
        height: number;
        x: number;
        y: number;
    };
    drawScene(can?: SceneCanvas, top?: Node): this;
    drawHit(can?: HitCanvas, top?: Node, skipDragCheck?: boolean): this;
    /**
     * draw hit graph using the cached scene canvas
     * @method
     * @name Konva.Shape#drawHitFromCache
     * @param {Integer} alphaThreshold alpha channel threshold that determines whether or not
     *  a pixel should be drawn onto the hit graph.  Must be a value between 0 and 255.
     *  The default is 0
     * @returns {Konva.Shape}
     * @example
     * shape.cache();
     * shape.drawHitFromCache();
     */
    drawHitFromCache(alphaThreshold?: number): this;
    hasPointerCapture(pointerId: number): boolean;
    setPointerCapture(pointerId: number): void;
    releaseCapture(pointerId: number): void;
    draggable: GetSet<boolean, this>;
    embossBlend: GetSet<boolean, this>;
    dash: GetSet<number[], this>;
    dashEnabled: GetSet<boolean, this>;
    dashOffset: GetSet<number, this>;
    fill: GetSet<string, this>;
    fillEnabled: GetSet<boolean, this>;
    fillLinearGradientColorStops: GetSet<Array<number | string>, this>;
    fillLinearGradientStartPoint: GetSet<Vector2d, this>;
    fillLinearGradientStartPointX: GetSet<number, this>;
    fillLinearGradientStartPointY: GetSet<number, this>;
    fillLinearGradientEndPoint: GetSet<Vector2d, this>;
    fillLinearGradientEndPointX: GetSet<number, this>;
    fillLinearGradientEndPointY: GetSet<number, this>;
    fillLinearRadialStartPoint: GetSet<Vector2d, this>;
    fillLinearRadialStartPointX: GetSet<number, this>;
    fillLinearRadialStartPointY: GetSet<number, this>;
    fillLinearRadialEndPoint: GetSet<Vector2d, this>;
    fillLinearRadialEndPointX: GetSet<number, this>;
    fillLinearRadialEndPointY: GetSet<number, this>;
    fillPatternImage: GetSet<HTMLImageElement, this>;
    fillRadialGradientStartRadius: GetSet<number, this>;
    fillRadialGradientEndRadius: GetSet<number, this>;
    fillRadialGradientColorStops: GetSet<Array<number | string>, this>;
    fillRadialGradientStartPoint: GetSet<Vector2d, this>;
    fillRadialGradientStartPointX: GetSet<number, this>;
    fillRadialGradientStartPointY: GetSet<number, this>;
    fillRadialGradientEndPoint: GetSet<Vector2d, this>;
    fillRadialGradientEndPointX: GetSet<number, this>;
    fillRadialGradientEndPointY: GetSet<number, this>;
    fillPatternOffset: GetSet<Vector2d, this>;
    fillPatternOffsetX: GetSet<number, this>;
    fillPatternOffsetY: GetSet<number, this>;
    fillPatternRepeat: GetSet<string, this>;
    fillPatternRotation: GetSet<number, this>;
    fillPatternScale: GetSet<Vector2d, this>;
    fillPatternScaleX: GetSet<number, this>;
    fillPatternScaleY: GetSet<number, this>;
    fillPatternX: GetSet<number, this>;
    fillPatternY: GetSet<number, this>;
    fillPriority: GetSet<string, this>;
    hitFunc: GetSet<ShapeConfigHandler<this>, this>;
    lineCap: GetSet<LineCap, this>;
    lineJoin: GetSet<LineJoin, this>;
    perfectDrawEnabled: GetSet<boolean, this>;
    sceneFunc: GetSet<ShapeConfigHandler<this>, this>;
    shadowColor: GetSet<string, this>;
    shadowEnabled: GetSet<boolean, this>;
    shadowForStrokeEnabled: GetSet<boolean, this>;
    shadowOffset: GetSet<Vector2d, this>;
    shadowOffsetX: GetSet<number, this>;
    shadowOffsetY: GetSet<number, this>;
    shadowOpacity: GetSet<number, this>;
    shadowBlur: GetSet<number, this>;
    stroke: GetSet<string, this>;
    strokeEnabled: GetSet<boolean, this>;
    fillAfterStrokeEnabled: GetSet<boolean, this>;
    strokeScaleEnabled: GetSet<boolean, this>;
    strokeHitEnabled: GetSet<boolean, this>;
    strokeWidth: GetSet<number, this>;
    hitStrokeWidth: GetSet<number | 'auto', this>;
    strokeLinearGradientColorStops: GetSet<Array<number | string>, this>;
}
