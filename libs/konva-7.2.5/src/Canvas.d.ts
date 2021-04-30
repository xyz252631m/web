import { Context } from './Context';
interface ICanvasConfig {
    width?: number;
    height?: number;
    pixelRatio?: number;
}
/**
 * Canvas Renderer constructor. It is a wrapper around native canvas element.
 * Usually you don't need to use it manually.
 * @constructor
 * @abstract
 * @memberof Konva
 * @param {Object} config
 * @param {Number} config.width
 * @param {Number} config.height
 * @param {Number} config.pixelRatio
 */
export declare class Canvas {
    pixelRatio: number;
    _canvas: HTMLCanvasElement;
    context: Context;
    width: number;
    height: number;
    isCache: boolean;
    constructor(config: ICanvasConfig);
    /**
     * get canvas context
     * @method
     * @name Konva.Canvas#getContext
     * @returns {CanvasContext} context
     */
    getContext(): Context;
    getPixelRatio(): number;
    setPixelRatio(pixelRatio: any): void;
    setWidth(width: any): void;
    setHeight(height: any): void;
    getWidth(): number;
    getHeight(): number;
    setSize(width: any, height: any): void;
    /**
     * to data url
     * @method
     * @name Konva.Canvas#toDataURL
     * @param {String} mimeType
     * @param {Number} quality between 0 and 1 for jpg mime types
     * @returns {String} data url string
     */
    toDataURL(mimeType: any, quality: any): string;
}
export declare class SceneCanvas extends Canvas {
    constructor(config?: ICanvasConfig);
}
export declare class HitCanvas extends Canvas {
    hitCanvas: boolean;
    constructor(config?: ICanvasConfig);
}
export {};
