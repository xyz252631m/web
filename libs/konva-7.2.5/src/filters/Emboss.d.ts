import { Filter } from '../Node';
/**
 * Emboss Filter.
 * Pixastic Lib - Emboss filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Emboss]);
 * node.embossStrength(0.8);
 * node.embossWhiteLevel(0.3);
 * node.embossDirection('right');
 * node.embossBlend(true);
 */
export declare const Emboss: Filter;
/**
 * get/set emboss blend. Use with {@link Konva.Filters.Emboss} filter.
 * @name Konva.Node#embossBlend
 * @method
 * @param {Boolean} embossBlend
 * @returns {Boolean}
 */
