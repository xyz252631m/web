import { Shape, ShapeConfig } from '../Shape';
import { Group } from '../Group';
import { ContainerConfig } from '../Container';
import { GetSet } from '../types';
export interface LabelConfig extends ContainerConfig {
}
/**
 * Label constructor.&nbsp; Labels are groups that contain a Text and Tag shape
 * @constructor
 * @memberof Konva
 * @param {Object} config
 * @@nodeParams
 * @example
 * // create label
 * var label = new Konva.Label({
 *   x: 100,
 *   y: 100,
 *   draggable: true
 * });
 *
 * // add a tag to the label
 * label.add(new Konva.Tag({
 *   fill: '#bbb',
 *   stroke: '#333',
 *   shadowColor: 'black',
 *   shadowBlur: 10,
 *   shadowOffset: [10, 10],
 *   shadowOpacity: 0.2,
 *   lineJoin: 'round',
 *   pointerDirection: 'up',
 *   pointerWidth: 20,
 *   pointerHeight: 20,
 *   cornerRadius: 5
 * }));
 *
 * // add text to the label
 * label.add(new Konva.Text({
 *   text: 'Hello World!',
 *   fontSize: 50,
 *   lineHeight: 1.2,
 *   padding: 10,
 *   fill: 'green'
 *  }));
 */
export declare class Label extends Group {
    constructor(config: any);
    /**
     * get Text shape for the label.  You need to access the Text shape in order to update
     * the text properties
     * @name Konva.Label#getText
     * @method
     * @example
     * label.getText().fill('red')
     */
    getText(): import("../Node").Node<import("../Node").NodeConfig>;
    /**
     * get Tag shape for the label.  You need to access the Tag shape in order to update
     * the pointer properties and the corner radius
     * @name Konva.Label#getTag
     * @method
     */
    getTag(): Tag;
    _addListeners(text: any): void;
    getWidth(): number;
    getHeight(): number;
    _sync(): void;
}
export interface TagConfig extends ShapeConfig {
    pointerDirection?: string;
    pointerWidth?: number;
    pointerHeight?: number;
    cornerRadius?: number;
}
/**
 * Tag constructor.&nbsp; A Tag can be configured
 *  to have a pointer element that points up, right, down, or left
 * @constructor
 * @memberof Konva
 * @param {Object} config
 * @param {String} [config.pointerDirection] can be up, right, down, left, or none; the default
 *  is none.  When a pointer is present, the positioning of the label is relative to the tip of the pointer.
 * @param {Number} [config.pointerWidth]
 * @param {Number} [config.pointerHeight]
 * @param {Number} [config.cornerRadius]
 */
export declare class Tag extends Shape<TagConfig> {
    _sceneFunc(context: any): void;
    getSelfRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    pointerDirection: GetSet<'left' | 'top' | 'right' | 'bottom', this>;
    pointerWidth: GetSet<number, this>;
    pointerHeight: GetSet<number, this>;
    cornerRadius: GetSet<number, this>;
}
