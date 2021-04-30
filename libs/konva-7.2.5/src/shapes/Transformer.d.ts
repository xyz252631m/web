import { Transform } from '../Util';
import { Node } from '../Node';
import { Rect } from './Rect';
import { Group } from '../Group';
import { ContainerConfig } from '../Container';
import { GetSet, IRect, Vector2d } from '../types';
export interface Box extends IRect {
    rotation: number;
}
export interface TransformerConfig extends ContainerConfig {
    resizeEnabled?: boolean;
    rotateEnabled?: boolean;
    rotationSnaps?: Array<number>;
    rotationSnapTolerance?: number;
    rotateAnchorOffset?: number;
    borderEnabled?: boolean;
    borderStroke?: string;
    borderStrokeWidth?: number;
    borderDash?: Array<number>;
    anchorFill?: string;
    anchorStroke?: string;
    anchorStrokeWidth?: number;
    anchorSize?: number;
    anchorCornerRadius?: number;
    keepRatio?: boolean;
    centeredScaling?: boolean;
    enabledAnchors?: Array<string>;
    node?: Rect;
    ignoreStroke?: boolean;
    boundBoxFunc?: (oldBox: Box, newBox: Box) => Box;
}
/**
 * Transformer constructor.  Transformer is a special type of group that allow you transform Konva
 * primitives and shapes. Transforming tool is not changing `width` and `height` properties of nodes
 * when you resize them. Instead it changes `scaleX` and `scaleY` properties.
 * @constructor
 * @memberof Konva
 * @param {Object} config
 * @param {Boolean} [config.resizeEnabled] Default is true
 * @param {Boolean} [config.rotateEnabled] Default is true
 * @param {Array} [config.rotationSnaps] Array of angles for rotation snaps. Default is []
 * @param {Number} [config.rotationSnapTolerance] Snapping tolerance. If closer than this it will snap. Default is 5
 * @param {Number} [config.rotateAnchorOffset] Default is 50
 * @param {Number} [config.padding] Default is 0
 * @param {Boolean} [config.borderEnabled] Should we draw border? Default is true
 * @param {String} [config.borderStroke] Border stroke color
 * @param {Number} [config.borderStrokeWidth] Border stroke size
 * @param {Array} [config.borderDash] Array for border dash.
 * @param {String} [config.anchorFill] Anchor fill color
 * @param {String} [config.anchorStroke] Anchor stroke color
 * @param {String} [config.anchorCornerRadius] Anchor corner radius
 * @param {Number} [config.anchorStrokeWidth] Anchor stroke size
 * @param {Number} [config.anchorSize] Default is 10
 * @param {Boolean} [config.keepRatio] Should we keep ratio when we are moving edges? Default is true
 * @param {Boolean} [config.centeredScaling] Should we resize relative to node's center? Default is false
 * @param {Array} [config.enabledAnchors] Array of names of enabled handles
 * @param {Function} [config.boundBoxFunc] Bounding box function
 * @param {Function} [config.ignoreStroke] Should we ignore stroke size? Default is false
 *
 * @example
 * var transformer = new Konva.Transformer({
 *   nodes: [rectangle],
 *   rotateAnchorOffset: 60,
 *   enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
 * });
 * layer.add(transformer);
 */
export declare class Transformer extends Group {
    _nodes: Array<Node>;
    _movingAnchorName: string;
    _transforming: boolean;
    _anchorDragOffset: Vector2d;
    sin: number;
    cos: number;
    _cursorChange: boolean;
    constructor(config?: TransformerConfig);
    /**
     * alias to `tr.nodes([shape])`/ This method is deprecated and will be removed soon.
     * @method
     * @name Konva.Transformer#attachTo
     * @returns {Konva.Transformer}
     * @example
     * transformer.attachTo(shape);
     */
    attachTo(node: any): this;
    setNode(node: any): this;
    getNode(): Node<import("../Node").NodeConfig>;
    setNodes(nodes?: Array<Node>): this;
    _proxyDrag(node: Node): void;
    getNodes(): Node<import("../Node").NodeConfig>[];
    /**
     * return the name of current active anchor
     * @method
     * @name Konva.Transformer#getActiveAnchor
     * @returns {String | Null}
     * @example
     * transformer.getActiveAnchor();
     */
    getActiveAnchor(): string;
    /**
     * detach transformer from an attached node
     * @method
     * @name Konva.Transformer#detach
     * @returns {Konva.Transformer}
     * @example
     * transformer.detach();
     */
    detach(): void;
    _resetTransformCache(): void;
    _getNodeRect(): any;
    __getNodeShape(node: Node, rot?: number, relative?: Node): {
        rotation: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };
    __getNodeRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: any;
    };
    getX(): any;
    getY(): any;
    getWidth(): any;
    getHeight(): any;
    _createElements(): void;
    _createAnchor(name: any): void;
    _createBack(): void;
    _handleMouseDown(e: any): void;
    _handleMouseMove(e: any): void;
    _handleMouseUp(e: any): void;
    getAbsoluteTransform(): Transform;
    _removeEvents(e?: any): void;
    _fitNodesInto(newAttrs: any, evt: any): void;
    /**
     * force update of Konva.Transformer.
     * Use it when you updated attached Konva.Group and now you need to reset transformer size
     * @method
     * @name Konva.Transformer#forceUpdate
     */
    forceUpdate(): void;
    _batchChangeChild(selector: string, attrs: any): void;
    update(): void;
    /**
     * determine if transformer is in active transform
     * @method
     * @name Konva.Transformer#isTransforming
     * @returns {Boolean}
     */
    isTransforming(): boolean;
    /**
     * Stop active transform action
     * @method
     * @name Konva.Transformer#stopTransform
     * @returns {Boolean}
     */
    stopTransform(): void;
    destroy(): this;
    toObject(): any;
    nodes: GetSet<Node[], this>;
    enabledAnchors: GetSet<string[], this>;
    rotationSnaps: GetSet<number[], this>;
    anchorSize: GetSet<number, this>;
    resizeEnabled: GetSet<boolean, this>;
    rotateEnabled: GetSet<boolean, this>;
    rotateAnchorOffset: GetSet<number, this>;
    rotationSnapTolerance: GetSet<number, this>;
    padding: GetSet<number, this>;
    borderEnabled: GetSet<boolean, this>;
    borderStroke: GetSet<string, this>;
    borderStrokeWidth: GetSet<number, this>;
    borderDash: GetSet<number[], this>;
    anchorFill: GetSet<string, this>;
    anchorStroke: GetSet<string, this>;
    anchorCornerRadius: GetSet<number, this>;
    anchorStrokeWidth: GetSet<number, this>;
    keepRatio: GetSet<boolean, this>;
    centeredScaling: GetSet<boolean, this>;
    ignoreStroke: GetSet<boolean, this>;
    boundBoxFunc: GetSet<(oldBox: Box, newBox: Box) => Box, this>;
    shouldOverdrawWholeArea: GetSet<boolean, this>;
}
