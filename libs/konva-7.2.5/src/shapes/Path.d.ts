import { Shape, ShapeConfig } from '../Shape';
import { GetSet } from '../types';
export interface PathConfig extends ShapeConfig {
    data: string;
}
/**
 * Path constructor.
 * @author Jason Follas
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {String} config.data SVG data string
 * @@shapeParams
 * @@nodeParams
 * @example
 * var path = new Konva.Path({
 *   x: 240,
 *   y: 40,
 *   data: 'M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z',
 *   fill: 'green',
 *   scaleX: 2,
 *   scaleY: 2
 * });
 */
export declare class Path extends Shape<PathConfig> {
    dataArray: any[];
    pathLength: number;
    constructor(config?: PathConfig);
    _sceneFunc(context: any): void;
    getSelfRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Return length of the path.
     * @method
     * @name Konva.Path#getLength
     * @returns {Number} length
     * @example
     * var length = path.getLength();
     */
    getLength(): number;
    /**
     * Get point on path at specific length of the path
     * @method
     * @name Konva.Path#getPointAtLength
     * @param {Number} length length
     * @returns {Object} point {x,y} point
     * @example
     * var point = path.getPointAtLength(10);
     */
    getPointAtLength(length: any): any;
    data: GetSet<string, this>;
    static getLineLength(x1: any, y1: any, x2: any, y2: any): number;
    static getPointOnLine(dist: any, P1x: any, P1y: any, P2x: any, P2y: any, fromX?: any, fromY?: any): any;
    static getPointOnCubicBezier(pct: any, P1x: any, P1y: any, P2x: any, P2y: any, P3x: any, P3y: any, P4x: any, P4y: any): {
        x: number;
        y: number;
    };
    static getPointOnQuadraticBezier(pct: any, P1x: any, P1y: any, P2x: any, P2y: any, P3x: any, P3y: any): {
        x: number;
        y: number;
    };
    static getPointOnEllipticalArc(cx: any, cy: any, rx: any, ry: any, theta: any, psi: any): {
        x: any;
        y: any;
    };
    static parsePathData(data: any): any[];
    static calcLength(x: any, y: any, cmd: any, points: any): any;
    static convertEndpointToCenterParameterization(x1: any, y1: any, x2: any, y2: any, fa: any, fs: any, rx: any, ry: any, psiDeg: any): any[];
}
