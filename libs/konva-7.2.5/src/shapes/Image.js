define(["require", "exports", "../Util", "../Factory", "../Shape", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Shape_1, Validators_1, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Image = void 0;
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
    class Image extends Shape_1.Shape {
        _useBufferCanvas() {
            return super._useBufferCanvas(true);
        }
        _sceneFunc(context) {
            const width = this.getWidth();
            const height = this.getHeight();
            const image = this.attrs.image;
            let params;
            if (image) {
                const cropWidth = this.attrs.cropWidth;
                const cropHeight = this.attrs.cropHeight;
                if (cropWidth && cropHeight) {
                    params = [
                        image,
                        this.cropX(),
                        this.cropY(),
                        cropWidth,
                        cropHeight,
                        0,
                        0,
                        width,
                        height,
                    ];
                }
                else {
                    params = [image, 0, 0, width, height];
                }
            }
            if (this.hasFill() || this.hasStroke()) {
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                context.fillStrokeShape(this);
            }
            if (image) {
                context.drawImage.apply(context, params);
            }
        }
        _hitFunc(context) {
            var width = this.width(), height = this.height();
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        }
        getWidth() {
            return this.attrs.width ?? (this.image()?.width || 0);
        }
        getHeight() {
            return this.attrs.height ?? (this.image()?.height || 0);
        }
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
        static fromURL(url, callback) {
            var img = Util_1.Util.createImageElement();
            img.onload = function () {
                var image = new Image({
                    image: img,
                });
                callback(image);
            };
            img.crossOrigin = 'Anonymous';
            img.src = url;
        }
    }
    exports.Image = Image;
    Image.prototype.className = 'Image';
    Global_1._registerNode(Image);
    /**
     * get/set image source. It can be image, canvas or video element
     * @name Konva.Image#image
     * @method
     * @param {Object} image source
     * @returns {Object}
     * @example
     * // get value
     * var image = shape.image();
     *
     * // set value
     * shape.image(img);
     */
    Factory_1.Factory.addGetterSetter(Image, 'image');
    Factory_1.Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
    /**
     * get/set crop
     * @method
     * @name Konva.Image#crop
     * @param {Object} crop
     * @param {Number} crop.x
     * @param {Number} crop.y
     * @param {Number} crop.width
     * @param {Number} crop.height
     * @returns {Object}
     * @example
     * // get crop
     * var crop = image.crop();
     *
     * // set crop
     * image.crop({
     *   x: 20,
     *   y: 20,
     *   width: 20,
     *   height: 20
     * });
     */
    Factory_1.Factory.addGetterSetter(Image, 'cropX', 0, Validators_1.getNumberValidator());
    /**
     * get/set crop x
     * @method
     * @name Konva.Image#cropX
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get crop x
     * var cropX = image.cropX();
     *
     * // set crop x
     * image.cropX(20);
     */
    Factory_1.Factory.addGetterSetter(Image, 'cropY', 0, Validators_1.getNumberValidator());
    /**
     * get/set crop y
     * @name Konva.Image#cropY
     * @method
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get crop y
     * var cropY = image.cropY();
     *
     * // set crop y
     * image.cropY(20);
     */
    Factory_1.Factory.addGetterSetter(Image, 'cropWidth', 0, Validators_1.getNumberValidator());
    /**
     * get/set crop width
     * @name Konva.Image#cropWidth
     * @method
     * @param {Number} width
     * @returns {Number}
     * @example
     * // get crop width
     * var cropWidth = image.cropWidth();
     *
     * // set crop width
     * image.cropWidth(20);
     */
    Factory_1.Factory.addGetterSetter(Image, 'cropHeight', 0, Validators_1.getNumberValidator());
    /**
     * get/set crop height
     * @name Konva.Image#cropHeight
     * @method
     * @param {Number} height
     * @returns {Number}
     * @example
     * // get crop height
     * var cropHeight = image.cropHeight();
     *
     * // set crop height
     * image.cropHeight(20);
     */
    Util_1.Collection.mapMethods(Image);
});
