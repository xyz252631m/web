import { Shape, ShapeConfig } from '../Shape';
import { GetSet, Vector2d } from '../types';
export interface EllipseConfig extends ShapeConfig {
    radiusX: number;
    radiusY: number;
}
/**
 * Ellipse constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Object} config.radius defines x and y radius
 * @@shapeParams
 * @@nodeParams
 * @example
 * var ellipse = new Konva.Ellipse({
 *   radius : {
 *     x : 50,
 *     y : 50
 *   },
 *   fill: 'red'
 * });
 */
export declare class Ellipse extends Shape<EllipseConfig> {
    _sceneFunc(context: any): void;
    getWidth(): number;
    getHeight(): number;
    setWidth(width: any): void;
    setHeight(height: any): void;
    radius: GetSet<Vector2d, this>;
    radiusX: GetSet<number, this>;
    radiusY: GetSet<number, this>;
}
