import { Shape, ShapeConfig } from '../Shape';
import { GetSet, Vector2d } from '../types';
export interface TextPathConfig extends ShapeConfig {
    text?: string;
    data?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
}
/**
 * Path constructor.
 * @author Jason Follas
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {String} [config.fontFamily] default is Calibri
 * @param {Number} [config.fontSize] default is 12
 * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
 * @param {String} [config.fontVariant] can be normal or small-caps.  Default is normal
 * @param {String} [config.textBaseline] Can be 'top', 'bottom', 'middle', 'alphabetic', 'hanging'. Default is middle
 * @param {String} config.text
 * @param {String} config.data SVG data string
 * @param {Function} config.getKerning a getter for kerning values for the specified characters
 * @param {Function} config.kerningFunc a getter for kerning values for the specified characters
 * @@shapeParams
 * @@nodeParams
 * @example
 * var kerningPairs = {
 *   'A': {
 *     ' ': -0.05517578125,
 *     'T': -0.07421875,
 *     'V': -0.07421875
 *   }
 *   'V': {
 *     ',': -0.091796875,
 *     ":": -0.037109375,
 *     ";": -0.037109375,
 *     "A": -0.07421875
 *   }
 * }
 * var textpath = new Konva.TextPath({
 *   x: 100,
 *   y: 50,
 *   fill: '#333',
 *   fontSize: '24',
 *   fontFamily: 'Arial',
 *   text: 'All the world\'s a stage, and all the men and women merely players.',
 *   data: 'M10,10 C0,0 10,150 100,100 S300,150 400,50',
 *   kerningFunc(leftChar, rightChar) {
 *     return kerningPairs.hasOwnProperty(leftChar) ? pairs[leftChar][rightChar] || 0 : 0
 *   }
 * });
 */
export declare class TextPath extends Shape<TextPathConfig> {
    dummyCanvas: HTMLCanvasElement;
    dataArray: any[];
    glyphInfo: Array<{
        transposeX: number;
        transposeY: number;
        text: string;
        rotation: number;
        p0: Vector2d;
        p1: Vector2d;
    }>;
    partialText: string;
    textWidth: number;
    textHeight: number;
    constructor(config?: TextPathConfig);
    _sceneFunc(context: any): void;
    _hitFunc(context: any): void;
    /**
     * get text width in pixels
     * @method
     * @name Konva.TextPath#getTextWidth
     */
    getTextWidth(): number;
    getTextHeight(): number;
    setText(text: any): any;
    _getContextFont(): any;
    _getTextSize(text: any): {
        width: number;
        height: number;
    };
    _setTextData(): void;
    getSelfRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    fontFamily: GetSet<string, this>;
    fontSize: GetSet<number, this>;
    fontStyle: GetSet<string, this>;
    fontVariant: GetSet<string, this>;
    align: GetSet<string, this>;
    letterSpacing: GetSet<number, this>;
    text: GetSet<string, this>;
    data: GetSet<string, this>;
    kerningFunc: GetSet<(leftChar: string, rightChar: string) => number, this>;
    textBaseline: GetSet<string, this>;
    textDecoration: GetSet<string, this>;
}
