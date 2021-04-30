import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
export interface WedgeConfig extends ShapeConfig {
    angle: number;
    radius: number;
    clockwise?: boolean;
}
/**
 * Wedge constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Number} config.angle in degrees
 * @param {Number} config.radius
 * @param {Boolean} [config.clockwise]
 * @@shapeParams
 * @@nodeParams
 * @example
 * // draw a wedge that's pointing downwards
 * var wedge = new Konva.Wedge({
 *   radius: 40,
 *   fill: 'red',
 *   stroke: 'black'
 *   strokeWidth: 5,
 *   angleDeg: 60,
 *   rotationDeg: -120
 * });
 */
export declare class Wedge extends Shape<WedgeConfig> {
    _sceneFunc(context: any): void;
    getWidth(): number;
    getHeight(): number;
    setWidth(width: any): void;
    setHeight(height: any): void;
    radius: GetSet<number, this>;
    angle: GetSet<number, this>;
    clockwise: GetSet<boolean, this>;
}
