import { Node } from './Node';
import { IRect, RGB, RGBA, Vector2d } from './types';
/**
 * Collection constructor. Collection extends Array.
 * This class is used in conjunction with {@link Konva.Container#find}
 * The good thing about collection is that it has ALL methods of all Konva nodes. Take a look into examples.
 * @constructor
 * @memberof Konva
 * @example
 *
 * // find all rectangles and return them as Collection
 * const shapes = layer.find('Rect');
 * // fill all rectangles with a single function
 * shapes.fill('red');
 */
export declare class Collection<Child extends Node> {
    [index: number]: Child;
    [Symbol.iterator](): Iterator<Child>;
    length: number;
    each: (f: (child: Child, index: number) => void) => void;
    toArray: () => Array<Child>;
    push: (item: Child) => void;
    unshift: (item: Child) => void;
    splice: (start: number, length: number, replace?: any) => void;
    /**
     * convert array into a collection
     * @method
     * @memberof Konva.Collection
     * @param {Array} arr
     */
    static toCollection<ChildNode extends Node = Node>(arr: Array<ChildNode>): Collection<ChildNode>;
    static _mapMethod(methodName: any): void;
    static mapMethods: (constructor: Function) => void;
}
/**
 * Transform constructor.
 * In most of the cases you don't need to use it in your app. Because it is for internal usage in Konva core.
 * But there is a documentation for that class in case you still want
 * to make some manual calculations.
 * @constructor
 * @param {Array} [m] Optional six-element matrix
 * @memberof Konva
 */
export declare class Transform {
    m: Array<number>;
    dirty: boolean;
    constructor(m?: number[]);
    reset(): void;
    /**
     * Copy Konva.Transform object
     * @method
     * @name Konva.Transform#copy
     * @returns {Konva.Transform}
     * @example
     * const tr = shape.getTransform().copy()
     */
    copy(): Transform;
    copyInto(tr: Transform): void;
    /**
     * Transform point
     * @method
     * @name Konva.Transform#point
     * @param {Object} point 2D point(x, y)
     * @returns {Object} 2D point(x, y)
     */
    point(point: Vector2d): {
        x: number;
        y: number;
    };
    /**
     * Apply translation
     * @method
     * @name Konva.Transform#translate
     * @param {Number} x
     * @param {Number} y
     * @returns {Konva.Transform}
     */
    translate(x: number, y: number): this;
    /**
     * Apply scale
     * @method
     * @name Konva.Transform#scale
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    scale(sx: number, sy: number): this;
    /**
     * Apply rotation
     * @method
     * @name Konva.Transform#rotate
     * @param {Number} rad  Angle in radians
     * @returns {Konva.Transform}
     */
    rotate(rad: number): this;
    /**
     * Returns the translation
     * @method
     * @name Konva.Transform#getTranslation
     * @returns {Object} 2D point(x, y)
     */
    getTranslation(): {
        x: number;
        y: number;
    };
    /**
     * Apply skew
     * @method
     * @name Konva.Transform#skew
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    skew(sx: number, sy: number): this;
    /**
     * Transform multiplication
     * @method
     * @name Konva.Transform#multiply
     * @param {Konva.Transform} matrix
     * @returns {Konva.Transform}
     */
    multiply(matrix: Transform): this;
    /**
     * Invert the matrix
     * @method
     * @name Konva.Transform#invert
     * @returns {Konva.Transform}
     */
    invert(): this;
    /**
     * return matrix
     * @method
     * @name Konva.Transform#getMatrix
     */
    getMatrix(): number[];
    /**
     * set to absolute position via translation
     * @method
     * @name Konva.Transform#setAbsolutePosition
     * @returns {Konva.Transform}
     * @author ericdrowell
     */
    setAbsolutePosition(x: number, y: number): this;
    /**
     * convert transformation matrix back into node's attributes
     * @method
     * @name Konva.Transform#decompose
     * @returns {Konva.Transform}
     */
    decompose(): {
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        skewX: number;
        skewY: number;
    };
}
/**
 * @namespace Util
 * @memberof Konva
 */
export declare const Util: {
    _isElement(obj: any): obj is Element;
    _isFunction(obj: any): boolean;
    _isPlainObject(obj: any): boolean;
    _isArray(obj: any): obj is any[];
    _isNumber(obj: any): obj is number;
    _isString(obj: any): obj is string;
    _isBoolean(obj: any): obj is boolean;
    isObject(val: any): val is Object;
    isValidSelector(selector: any): boolean;
    _sign(number: number): 1 | -1;
    requestAnimFrame(callback: Function): void;
    createCanvasElement(): HTMLCanvasElement;
    createImageElement(): HTMLImageElement;
    _isInDocument(el: any): boolean;
    _simplifyArray(arr: Array<any>): any[];
    _urlToImage(url: string, callback: Function): void;
    _rgbToHex(r: number, g: number, b: number): string;
    _hexToRgb(hex: string): RGB;
    /**
     * return random hex color
     * @method
     * @memberof Konva.Util
     * @example
     * shape.fill(Konva.Util.getRandomColor());
     */
    getRandomColor(): string;
    get(val: any, def: any): any;
    /**
     * get RGB components of a color
     * @method
     * @memberof Konva.Util
     * @param {String} color
     * @example
     * // each of the following examples return {r:0, g:0, b:255}
     * var rgb = Konva.Util.getRGB('blue');
     * var rgb = Konva.Util.getRGB('#0000ff');
     * var rgb = Konva.Util.getRGB('rgb(0,0,255)');
     */
    getRGB(color: string): RGB;
    colorToRGBA(str: string): RGBA;
    _namedColorToRBA(str: string): {
        r: any;
        g: any;
        b: any;
        a: number;
    };
    _rgbColorToRGBA(str: string): RGBA;
    _rgbaColorToRGBA(str: string): RGBA;
    _hex6ColorToRGBA(str: string): RGBA;
    _hex3ColorToRGBA(str: string): RGBA;
    _hslColorToRGBA(str: string): RGBA;
    /**
     * check intersection of two client rectangles
     * @method
     * @memberof Konva.Util
     * @param {Object} r1 - { x, y, width, height } client rectangle
     * @param {Object} r2 - { x, y, width, height } client rectangle
     * @example
     * const overlapping = Konva.Util.haveIntersection(shape1.getClientRect(), shape2.getClientRect());
     */
    haveIntersection(r1: IRect, r2: IRect): boolean;
    cloneObject<Any>(obj: Any): Any;
    cloneArray(arr: Array<any>): any[];
    _degToRad(deg: number): number;
    _radToDeg(rad: number): number;
    _getRotation(radians: any): any;
    _capitalize(str: string): string;
    throw(str: string): never;
    error(str: string): void;
    warn(str: string): void;
    extend(child: any, parent: any): void;
    _getControlPoints(x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, t: any): any[];
    _expandPoints(p: any, tension: any): any[];
    each(obj: any, func: any): void;
    _inRange(val: any, left: any, right: any): boolean;
    _getProjectionToSegment(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any): any[];
    _getProjectionToLine(pt: Vector2d, line: any, isClosed: any): Vector2d;
    _prepareArrayForTween(startArray: any, endArray: any, isClosed: any): any[];
    _prepareToStringify(obj: any): any;
    _assign<T, U>(target: T, source: U): T & U;
    _getFirstPointerId(evt: any): any;
};
