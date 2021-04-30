import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
export interface RegularPolygonConfig extends ShapeConfig {
    sides: number;
    radius: number;
}
/**
 * RegularPolygon constructor. Examples include triangles, squares, pentagons, hexagons, etc.
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Number} config.sides
 * @param {Number} config.radius
 * @@shapeParams
 * @@nodeParams
 * @example
 * var hexagon = new Konva.RegularPolygon({
 *   x: 100,
 *   y: 200,
 *   sides: 6,
 *   radius: 70,
 *   fill: 'red',
 *   stroke: 'black',
 *   strokeWidth: 4
 * });
 */
export declare class RegularPolygon extends Shape<RegularPolygonConfig> {
    _sceneFunc(context: any): void;
    _getPoints(): any[];
    getSelfRect(): {
        x: any;
        y: any;
        width: number;
        height: number;
    };
    getWidth(): number;
    getHeight(): number;
    setWidth(width: any): void;
    setHeight(height: any): void;
    radius: GetSet<number, this>;
    sides: GetSet<number, this>;
}
