import { Filter } from '../Node';
/**
 * Threshold Filter. Pushes any value above the mid point to
 *  the max and any value below the mid point to the min.
 *  This affects the alpha channel.
 * @function
 * @name Threshold
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Threshold]);
 * node.threshold(0.1);
 */
export declare const Threshold: Filter;
/**
 * get/set threshold.  Must be a value between 0 and 1. Use with {@link Konva.Filters.Threshold} or {@link Konva.Filters.Mask} filter.
 * @name threshold
 * @method
 * @memberof Konva.Node.prototype
 * @param {Number} threshold
 * @returns {Number}
 */
