import { Container } from './Container';
import { Node } from './Node';
import { Shape } from './Shape';
/**
 * Group constructor.  Groups are used to contain shapes or other groups.
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @@nodeParams
 * @@containerParams
 * @example
 * var group = new Konva.Group();
 */
export declare class Group extends Container<Group | Shape> {
    _validateAdd(child: Node): void;
}
