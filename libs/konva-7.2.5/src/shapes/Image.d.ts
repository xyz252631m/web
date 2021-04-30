import { Shape, ShapeConfig } from '../Shape';
import { GetSet, IRect } from '../types';
import { Context } from '../Context';
export interface ImageConfig extends ShapeConfig {
    image: CanvasImageSource | undefined;
    crop?: IRect;
}
/**
 * Image constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Image} config.image
 * @param {Object} [config.crop]
 * @@shapeParams
 * @@nodeParams
 * @example
 * var imageObj = new Image();
 * imageObj.onload = function() {
 *   var image = new Konva.Image({
 *     x: 200,
 *     y: 50,
 *     image: imageObj,
 *     width: 100,
 *     height: 100
 *   });
 * };
 * imageObj.src = '/path/to/image.jpg'
 */
export declare class Image extends Shape<ImageConfig> {
    _useBufferCanvas(): boolean;
    _sceneFunc(context: Context): void;
    _hitFunc(context: any): void;
    getWidth(): any;
    getHeight(): any;
    /**
     * load image from given url and create `Konva.Image` instance
     * @method
     * @memberof Konva.Image
     * @param {String} url image source
     * @param {Function} callback with Konva.Image instance as first argument
     * @example
     *  Konva.Image.fromURL(imageURL, function(image){
     *    // image is Konva.Image instance
     *    layer.add(image);
     *    layer.draw();
     *  });
     */
    static fromURL(url: any, callback: any): void;
    image: GetSet<CanvasImageSource | undefined, this>;
    crop: GetSet<IRect, this>;
    cropX: GetSet<number, this>;
    cropY: GetSet<number, this>;
    cropWidth: GetSet<number, this>;
    cropHeight: GetSet<number, this>;
}
