import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
export declare function stringToArray(string: string): string[];
export interface TextConfig extends ShapeConfig {
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
    fontVariant?: string;
    textDecoration?: string;
    align?: string;
    verticalAlign?: string;
    padding?: number;
    lineHeight?: number;
    letterSpacing?: number;
    wrap?: string;
    ellipsis?: boolean;
}
/**
 * Text constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {String} [config.fontFamily] default is Arial
 * @param {Number} [config.fontSize] in pixels.  Default is 12
 * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
 * @param {String} [config.fontVariant] can be normal or small-caps.  Default is normal
 * @param {String} [config.textDecoration] can be line-through, underline or empty string. Default is empty string.
 * @param {String} config.text
 * @param {String} [config.align] can be left, center, or right
 * @param {String} [config.verticalAlign] can be top, middle or bottom
 * @param {Number} [config.padding]
 * @param {Number} [config.lineHeight] default is 1
 * @param {String} [config.wrap] can be "word", "char", or "none". Default is word
 * @param {Boolean} [config.ellipsis] can be true or false. Default is false. if Konva.Text config is set to wrap="none" and ellipsis=true, then it will add "..." to the end
 * @@shapeParams
 * @@nodeParams
 * @example
 * var text = new Konva.Text({
 *   x: 10,
 *   y: 15,
 *   text: 'Simple Text',
 *   fontSize: 30,
 *   fontFamily: 'Calibri',
 *   fill: 'green'
 * });
 */
export declare class Text extends Shape<TextConfig> {
    textArr: Array<{
        text: string;
        width: number;
    }>;
    _partialText: string;
    _partialTextX: number;
    _partialTextY: number;
    textWidth: number;
    textHeight: number;
    constructor(config?: TextConfig);
    _sceneFunc(context: any): void;
    _hitFunc(context: any): void;
    setText(text: any): this;
    getWidth(): any;
    getHeight(): any;
    /**
     * get pure text width without padding
     * @method
     * @name Konva.Text#getTextWidth
     * @returns {Number}
     */
    getTextWidth(): number;
    getTextHeight(): number;
    /**
     * measure string with the font of current text shape.
     * That method can't handle multiline text.
     * @method
     * @name Konva.Text#measureSize
     * @param {String} [text] text to measure
     * @returns {Object} { width , height} of measured text
     */
    measureSize(text: any): {
        width: any;
        height: number;
    };
    _getContextFont(): string;
    _addTextLine(line: any): number;
    _getTextWidth(text: any): any;
    _setTextData(): void;
    getStrokeScaleEnabled(): boolean;
    fontFamily: GetSet<string, this>;
    fontSize: GetSet<number, this>;
    fontStyle: GetSet<string, this>;
    fontVariant: GetSet<string, this>;
    align: GetSet<string, this>;
    letterSpacing: GetSet<number, this>;
    verticalAlign: GetSet<string, this>;
    padding: GetSet<number, this>;
    lineHeight: GetSet<number, this>;
    textDecoration: GetSet<string, this>;
    text: GetSet<string, this>;
    wrap: GetSet<string, this>;
    ellipsis: GetSet<boolean, this>;
}
