import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
export interface RingConfig extends ShapeConfig {
    innerRadius: number;
    outerRadius: number;
    clockwise?: boolean;
}
/**
 * Ring constructor
 * @constructor
 * @augments Konva.Shape
 * @memberof Konva
 * @param {Object} config
 * @param {Number} config.innerRadius
 * @param {Number} config.outerRadius
 * @param {Boolean} [config.clockwise]
 * @@shapeParams
 * @@nodeParams
 * @example
 * var ring = new Konva.Ring({
 *   innerRadius: 40,
 *   outerRadius: 80,
 *   fill: 'red',
 *   stroke: 'black',
 *   strokeWidth: 5
 * });
 */
export declare class Ring extends Shape<RingConfig> {
    _sceneFunc(context: any): void;
    getWidth(): number;
    getHeight(): number;
    setWidth(width: any): void;
    setHeight(height: any): void;
    outerRadius: GetSet<number, this>;
    innerRadius: GetSet<number, this>;
}
