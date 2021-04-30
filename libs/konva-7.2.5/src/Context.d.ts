import { Canvas } from './Canvas';
import { Shape } from './Shape';
/**
 * Konva wrapper around native 2d canvas context. It has almost the same API of 2d context with some additional functions.
 * With core Konva shapes you don't need to use this object. But you will use it if you want to create
 * a [custom shape](/docs/react/Custom_Shape.html) or a [custom hit regions](/docs/events/Custom_Hit_Region.html).
 * For full information about each 2d context API use [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 * @constructor
 * @memberof Konva
 * @example
 * const rect = new Konva.Shape({
 *    fill: 'red',
 *    width: 100,
 *    height: 100,
 *    sceneFunc: (ctx, shape) => {
 *      // ctx - is context wrapper
 *      // shape - is instance of Konva.Shape, so it equals to "rect" variable
 *      ctx.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
 *
 *      // automatically fill shape from props and draw hit region
 *      ctx.fillStrokeShape(shape);
 *    }
 * })
 */
export declare class Context {
    canvas: Canvas;
    _context: CanvasRenderingContext2D;
    traceArr: Array<String>;
    constructor(canvas: Canvas);
    /**
     * fill shape
     * @method
     * @name Konva.Context#fillShape
     * @param {Konva.Shape} shape
     */
    fillShape(shape: Shape): void;
    _fill(shape: any): void;
    /**
     * stroke shape
     * @method
     * @name Konva.Context#strokeShape
     * @param {Konva.Shape} shape
     */
    strokeShape(shape: Shape): void;
    _stroke(shape: any): void;
    /**
     * fill then stroke
     * @method
     * @name Konva.Context#fillStrokeShape
     * @param {Konva.Shape} shape
     */
    fillStrokeShape(shape: Shape): void;
    getTrace(relaxed: any): string;
    clearTrace(): void;
    _trace(str: any): void;
    /**
     * reset canvas context transform
     * @method
     * @name Konva.Context#reset
     */
    reset(): void;
    /**
     * get canvas wrapper
     * @method
     * @name Konva.Context#getCanvas
     * @returns {Konva.Canvas}
     */
    getCanvas(): Canvas;
    /**
     * clear canvas
     * @method
     * @name Konva.Context#clear
     * @param {Object} [bounds]
     * @param {Number} [bounds.x]
     * @param {Number} [bounds.y]
     * @param {Number} [bounds.width]
     * @param {Number} [bounds.height]
     */
    clear(bounds?: any): void;
    _applyLineCap(shape: any): void;
    _applyOpacity(shape: any): void;
    _applyLineJoin(shape: Shape): void;
    setAttr(attr: any, val: any): void;
    /**
     * arc function.
     * @method
     * @name Konva.Context#arc
     */
    arc(a0: any, a1: any, a2: any, a3: any, a4: any, a5: any): void;
    /**
     * arcTo function.
     * @method
     * @name Konva.Context#arcTo
     */
    arcTo(a0: any, a1: any, a2: any, a3: any, a4: any): void;
    /**
     * beginPath function.
     * @method
     * @name Konva.Context#beginPath
     */
    beginPath(): void;
    /**
     * bezierCurveTo function.
     * @method
     * @name Konva.Context#bezierCurveTo
     */
    bezierCurveTo(a0: any, a1: any, a2: any, a3: any, a4: any, a5: any): void;
    /**
     * clearRect function.
     * @method
     * @name Konva.Context#clearRect
     */
    clearRect(a0: any, a1: any, a2: any, a3: any): void;
    /**
     * clip function.
     * @method
     * @name Konva.Context#clip
     */
    clip(): void;
    /**
     * closePath function.
     * @method
     * @name Konva.Context#closePath
     */
    closePath(): void;
    /**
     * createImageData function.
     * @method
     * @name Konva.Context#createImageData
     */
    createImageData(a0: any, a1: any): ImageData;
    /**
     * createLinearGradient function.
     * @method
     * @name Konva.Context#createLinearGradient
     */
    createLinearGradient(a0: any, a1: any, a2: any, a3: any): CanvasGradient;
    /**
     * createPattern function.
     * @method
     * @name Konva.Context#createPattern
     */
    createPattern(a0: any, a1: any): CanvasPattern;
    /**
     * createRadialGradient function.
     * @method
     * @name Konva.Context#createRadialGradient
     */
    createRadialGradient(a0: any, a1: any, a2: any, a3: any, a4: any, a5: any): CanvasGradient;
    /**
     * drawImage function.
     * @method
     * @name Konva.Context#drawImage
     */
    drawImage(a0: CanvasImageSource, a1: number, a2: number, a3?: number, a4?: number, a5?: number, a6?: number, a7?: number, a8?: number): void;
    /**
     * ellipse function.
     * @method
     * @name Konva.Context#ellipse
     */
    ellipse(a0: number, a1: number, a2: number, a3: number, a4: number, a5: number, a6: number, a7?: boolean): void;
    /**
     * isPointInPath function.
     * @method
     * @name Konva.Context#isPointInPath
     */
    isPointInPath(x: any, y: any): boolean;
    /**
     * fill function.
     * @method
     * @name Konva.Context#fill
     */
    fill(): void;
    /**
     * fillRect function.
     * @method
     * @name Konva.Context#fillRect
     */
    fillRect(x: any, y: any, width: any, height: any): void;
    /**
     * strokeRect function.
     * @method
     * @name Konva.Context#strokeRect
     */
    strokeRect(x: any, y: any, width: any, height: any): void;
    /**
     * fillText function.
     * @method
     * @name Konva.Context#fillText
     */
    fillText(a0: any, a1: any, a2: any): void;
    /**
     * measureText function.
     * @method
     * @name Konva.Context#measureText
     */
    measureText(text: any): TextMetrics;
    /**
     * getImageData function.
     * @method
     * @name Konva.Context#getImageData
     */
    getImageData(a0: any, a1: any, a2: any, a3: any): ImageData;
    /**
     * lineTo function.
     * @method
     * @name Konva.Context#lineTo
     */
    lineTo(a0: any, a1: any): void;
    /**
     * moveTo function.
     * @method
     * @name Konva.Context#moveTo
     */
    moveTo(a0: any, a1: any): void;
    /**
     * rect function.
     * @method
     * @name Konva.Context#rect
     */
    rect(a0: any, a1: any, a2: any, a3: any): void;
    /**
     * putImageData function.
     * @method
     * @name Konva.Context#putImageData
     */
    putImageData(a0: any, a1: any, a2: any): void;
    /**
     * quadraticCurveTo function.
     * @method
     * @name Konva.Context#quadraticCurveTo
     */
    quadraticCurveTo(a0: any, a1: any, a2: any, a3: any): void;
    /**
     * restore function.
     * @method
     * @name Konva.Context#restore
     */
    restore(): void;
    /**
     * rotate function.
     * @method
     * @name Konva.Context#rotate
     */
    rotate(a0: any): void;
    /**
     * save function.
     * @method
     * @name Konva.Context#save
     */
    save(): void;
    /**
     * scale function.
     * @method
     * @name Konva.Context#scale
     */
    scale(a0: any, a1: any): void;
    /**
     * setLineDash function.
     * @method
     * @name Konva.Context#setLineDash
     */
    setLineDash(a0: any): void;
    /**
     * getLineDash function.
     * @method
     * @name Konva.Context#getLineDash
     */
    getLineDash(): number[];
    /**
     * setTransform function.
     * @method
     * @name Konva.Context#setTransform
     */
    setTransform(a0: any, a1: any, a2: any, a3: any, a4: any, a5: any): void;
    /**
     * stroke function.
     * @method
     * @name Konva.Context#stroke
     */
    stroke(): void;
    /**
     * strokeText function.
     * @method
     * @name Konva.Context#strokeText
     */
    strokeText(a0: any, a1: any, a2: any, a3: any): void;
    /**
     * transform function.
     * @method
     * @name Konva.Context#transform
     */
    transform(a0: any, a1: any, a2: any, a3: any, a4: any, a5: any): void;
    /**
     * translate function.
     * @method
     * @name Konva.Context#translate
     */
    translate(a0: any, a1: any): void;
    _enableTrace(): void;
    _applyGlobalCompositeOperation(node: any): void;
}
export declare class SceneContext extends Context {
    _fillColor(shape: any): void;
    _fillPattern(shape: any): void;
    _fillLinearGradient(shape: any): void;
    _fillRadialGradient(shape: any): void;
    _fill(shape: any): void;
    _strokeLinearGradient(shape: any): void;
    _stroke(shape: any): void;
    _applyShadow(shape: any): void;
}
export declare class HitContext extends Context {
    _fill(shape: any): void;
    strokeShape(shape: Shape): void;
    _stroke(shape: any): void;
}
