import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
export interface StarConfig extends ShapeConfig {
    numPoints: number;
    innerRadius: number;
    outerRadius: number;
}
/**
 * Star constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Integer} config.numPoints
 * @param {Number} config.innerRadius
 * @param {Number} config.outerRadius
 * @@shapeParams
 * @@nodeParams
 * @example
 * var star = new Konva.Star({
 *   x: 100,
 *   y: 200,
 *   numPoints: 5,
 *   innerRadius: 70,
 *   outerRadius: 70,
 *   fill: 'red',
 *   stroke: 'black',
 *   strokeWidth: 4
 * });
 */
export declare class Star extends Shape<StarConfig> {
    _sceneFunc(context: any): void;
    getWidth(): number;
    getHeight(): number;
    setWidth(width: any): void;
    setHeight(height: any): void;
    outerRadius: GetSet<number, this>;
    innerRadius: GetSet<number, this>;
    numPoints: GetSet<number, this>;
}
