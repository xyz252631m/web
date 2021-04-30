import { Filter } from '../Node';
/**
 * Brighten Filter.
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Brighten]);
 * node.brightness(0.8);
 */
export declare const Brighten: Filter;
/**
 * get/set filter brightness.  The brightness is a number between -1 and 1.&nbsp; Positive values
 *  brighten the pixels and negative values darken them. Use with {@link Konva.Filters.Brighten} filter.
 * @name Konva.Node#brightness
 * @method

 * @param {Number} brightness value between -1 and 1
 * @returns {Number}
 */
