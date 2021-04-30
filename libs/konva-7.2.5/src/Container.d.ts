import { Collection } from './Util';
import { Node, NodeConfig } from './Node';
import { GetSet, IRect } from './types';
import { HitCanvas, SceneCanvas } from './Canvas';
export interface ContainerConfig extends NodeConfig {
    clearBeforeDraw?: boolean;
    clipFunc?: (ctx: CanvasRenderingContext2D) => void;
    clipX?: number;
    clipY?: number;
    clipWidth?: number;
    clipHeight?: number;
}
/**
 * Container constructor.&nbsp; Containers are used to contain nodes or other containers
 * @constructor
 * @memberof Konva
 * @augments Konva.Node
 * @abstract
 * @param {Object} config
 * @@nodeParams
 * @@containerParams
 */
export declare abstract class Container<ChildType extends Node> extends Node<ContainerConfig> {
    children: Collection<ChildType>;
    /**
     * returns a {@link Konva.Collection} of direct descendant nodes
     * @method
     * @name Konva.Container#getChildren
     * @param {Function} [filterFunc] filter function
     * @returns {Konva.Collection}
     * @example
     * // get all children
     * var children = layer.getChildren();
     *
     * // get only circles
     * var circles = layer.getChildren(function(node){
     *    return node.getClassName() === 'Circle';
     * });
     */
    getChildren(filterFunc?: (item: Node) => boolean): Collection<Node<NodeConfig>>;
    /**
     * determine if node has children
     * @method
     * @name Konva.Container#hasChildren
     * @returns {Boolean}
     */
    hasChildren(): boolean;
    /**
     * remove all children. Children will be still in memory.
     * If you want to completely destroy all children please use "destroyChildren" method instead
     * @method
     * @name Konva.Container#removeChildren
     */
    removeChildren(): this;
    /**
     * destroy all children nodes.
     * @method
     * @name Konva.Container#destroyChildren
     */
    destroyChildren(): this;
    abstract _validateAdd(node: Node): void;
    /**
     * add a child and children into container
     * @name Konva.Container#add
     * @method
     * @param {...Konva.Node} child
     * @returns {Container}
     * @example
     * layer.add(rect);
     * layer.add(shape1, shape2, shape3);
     * // remember to redraw layer if you changed something
     * layer.draw();
     */
    add(...children: ChildType[]): this;
    destroy(): this;
    /**
     * return a {@link Konva.Collection} of nodes that match the selector.
     * You can provide a string with '#' for id selections and '.' for name selections.
     * Or a function that will return true/false when a node is passed through.  See example below.
     * With strings you can also select by type or class name. Pass multiple selectors
     * separated by a comma.
     * @method
     * @name Konva.Container#find
     * @param {String | Function} selector
     * @returns {Collection}
     * @example
     *
     * Passing a string as a selector
     * // select node with id foo
     * var node = stage.find('#foo');
     *
     * // select nodes with name bar inside layer
     * var nodes = layer.find('.bar');
     *
     * // select all groups inside layer
     * var nodes = layer.find('Group');
     *
     * // select all rectangles inside layer
     * var nodes = layer.find('Rect');
     *
     * // select node with an id of foo or a name of bar inside layer
     * var nodes = layer.find('#foo, .bar');
     *
     * Passing a function as a selector
     *
     * // get all groups with a function
     * var groups = stage.find(node => {
     *  return node.getType() === 'Group';
     * });
     *
     * // get only Nodes with partial opacity
     * var alphaNodes = layer.find(node => {
     *  return node.getType() === 'Node' && node.getAbsoluteOpacity() < 1;
     * });
     */
    find<ChildNode extends Node = Node>(selector: any): Collection<ChildNode>;
    get(selector: any): Collection<Node<NodeConfig>>;
    /**
     * return a first node from `find` method
     * @method
     * @name Konva.Container#findOne
     * @param {String | Function} selector
     * @returns {Konva.Node | Undefined}
     * @example
     * // select node with id foo
     * var node = stage.findOne('#foo');
     *
     * // select node with name bar inside layer
     * var nodes = layer.findOne('.bar');
     *
     * // select the first node to return true in a function
     * var node = stage.findOne(node => {
     *  return node.getType() === 'Shape'
     * })
     */
    findOne<ChildNode extends Node = Node>(selector: string | Function): ChildNode;
    _generalFind<ChildNode extends Node = Node>(selector: string | Function, findOne: boolean): Collection<ChildNode>;
    private _descendants;
    toObject(): any;
    /**
     * determine if node is an ancestor
     * of descendant
     * @method
     * @name Konva.Container#isAncestorOf
     * @param {Konva.Node} node
     */
    isAncestorOf(node: Node): boolean;
    clone(obj?: any): any;
    /**
     * get all shapes that intersect a point.  Note: because this method must clear a temporary
     * canvas and redraw every shape inside the container, it should only be used for special situations
     * because it performs very poorly.  Please use the {@link Konva.Stage#getIntersection} method if at all possible
     * because it performs much better
     * @method
     * @name Konva.Container#getAllIntersections
     * @param {Object} pos
     * @param {Number} pos.x
     * @param {Number} pos.y
     * @returns {Array} array of shapes
     */
    getAllIntersections(pos: any): any[];
    _setChildrenIndices(): void;
    drawScene(can?: SceneCanvas, top?: Node): this;
    drawHit(can?: HitCanvas, top?: Node): this;
    _drawChildren(drawMethod: any, canvas: any, top: any): void;
    getClientRect(config?: {
        skipTransform?: boolean;
        skipShadow?: boolean;
        skipStroke?: boolean;
        relativeTo?: Container<Node>;
    }): IRect;
    clip: GetSet<IRect, this>;
    clipX: GetSet<number, this>;
    clipY: GetSet<number, this>;
    clipWidth: GetSet<number, this>;
    clipHeight: GetSet<number, this>;
    clipFunc: GetSet<(ctx: CanvasRenderingContext2D, shape: Container<ChildType>) => void, this>;
}
