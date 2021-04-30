import { Filter } from '../Node';
/**
 * RGB Filter
 * @function
 * @name RGB
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * node.cache();
 * node.filters([Konva.Filters.RGB]);
 * node.blue(120);
 * node.green(200);
 */
export declare const RGB: Filter;
/**
 * get/set filter blue value. Use with {@link Konva.Filters.RGB} filter.
 * @name blue
 * @method
 * @memberof Konva.Node.prototype
 * @param {Integer} blue value between 0 and 255
 * @returns {Integer}
 */
