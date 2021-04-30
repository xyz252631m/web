import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
import { Context } from '../Context';
export interface LineConfig extends ShapeConfig {
    points: number[];
    tension?: number;
    closed?: boolean;
    bezier?: boolean;
}
/**
 * Line constructor.&nbsp; Lines are defined by an array of points and
 *  a tension
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Array} config.points Flat array of points coordinates. You should define them as [x1, y1, x2, y2, x3, y3].
 * @param {Number} [config.tension] Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
 *   The default is 0
 * @param {Boolean} [config.closed] defines whether or not the line shape is closed, creating a polygon or blob
 * @param {Boolean} [config.bezier] if no tension is provided but bezier=true, we draw the line as a bezier using the passed points
 * @@shapeParams
 * @@nodeParams
 * @example
 * var line = new Konva.Line({
 *   x: 100,
 *   y: 50,
 *   points: [73, 70, 340, 23, 450, 60, 500, 20],
 *   stroke: 'red',
 *   tension: 1
 * });
 */
export declare class Line<Config extends LineConfig = LineConfig> extends Shape<Config> {
    constructor(config?: Config);
    _sceneFunc(context: Context): void;
    getTensionPoints(): any;
    _getTensionPoints(): any[];
    _getTensionPointsClosed(): any[];
    getWidth(): number;
    getHeight(): number;
    getSelfRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    closed: GetSet<boolean, this>;
    bezier: GetSet<boolean, this>;
    tension: GetSet<number, this>;
    points: GetSet<number[], this>;
}
