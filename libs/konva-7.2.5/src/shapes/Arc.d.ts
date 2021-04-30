import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
export interface ArcConfig extends ShapeConfig {
    angle: number;
    innerRadius: number;
    outerRadius: number;
    clockwise?: boolean;
}
/**
 * Arc constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Number} config.angle in degrees
 * @param {Number} config.innerRadius
 * @param {Number} config.outerRadius
 * @param {Boolean} [config.clockwise]
 * @@shapeParams
 * @@nodeParams
 * @example
 * // draw a Arc that's pointing downwards
 * var arc = new Konva.Arc({
 *   innerRadius: 40,
 *   outerRadius: 80,
 *   fill: 'red',
 *   stroke: 'black'
 *   strokeWidth: 5,
 *   angle: 60,
 *   rotationDeg: -120
 * });
 */
export declare class Arc extends Shape<ArcConfig> {
    _sceneFunc(context: any): void;
    getWidth(): number;
    getHeight(): number;
    setWidth(width: any): void;
    setHeight(height: any): void;
    innerRadius: GetSet<number, this>;
    outerRadius: GetSet<number, this>;
    angle: GetSet<number, this>;
    clockwise: GetSet<boolean, this>;
}
