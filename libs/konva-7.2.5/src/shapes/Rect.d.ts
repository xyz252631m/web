import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
export interface RectConfig extends ShapeConfig {
    cornerRadius?: number | number[];
}
/**
 * Rect constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Number} [config.cornerRadius]
 * @@shapeParams
 * @@nodeParams
 * @example
 * var rect = new Konva.Rect({
 *   width: 100,
 *   height: 50,
 *   fill: 'red',
 *   stroke: 'black',
 *   strokeWidth: 5
 * });
 */
export declare class Rect extends Shape<RectConfig> {
    _sceneFunc(context: any): void;
    cornerRadius: GetSet<number | number[], this>;
}
