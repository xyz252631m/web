// we need to import core of the Konva and then extend it with all additional objects
define(["require", "exports", "./_CoreInternals", "./shapes/Arc", "./shapes/Arrow", "./shapes/Circle", "./shapes/Ellipse", "./shapes/Image", "./shapes/Label", "./shapes/Line", "./shapes/Path", "./shapes/Rect", "./shapes/RegularPolygon", "./shapes/Ring", "./shapes/Sprite", "./shapes/Star", "./shapes/Text", "./shapes/TextPath", "./shapes/Transformer", "./shapes/Wedge", "./filters/Blur", "./filters/Brighten", "./filters/Contrast", "./filters/Emboss", "./filters/Enhance", "./filters/Grayscale", "./filters/HSL", "./filters/HSV", "./filters/Invert", "./filters/Kaleidoscope", "./filters/Mask", "./filters/Noise", "./filters/Pixelate", "./filters/Posterize", "./filters/RGB", "./filters/RGBA", "./filters/Sepia", "./filters/Solarize", "./filters/Threshold"], function (require, exports, _CoreInternals_1, Arc_1, Arrow_1, Circle_1, Ellipse_1, Image_1, Label_1, Line_1, Path_1, Rect_1, RegularPolygon_1, Ring_1, Sprite_1, Star_1, Text_1, TextPath_1, Transformer_1, Wedge_1, Blur_1, Brighten_1, Contrast_1, Emboss_1, Enhance_1, Grayscale_1, HSL_1, HSV_1, Invert_1, Kaleidoscope_1, Mask_1, Noise_1, Pixelate_1, Posterize_1, RGB_1, RGBA_1, Sepia_1, Solarize_1, Threshold_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Konva = void 0;
    exports.Konva = _CoreInternals_1.Konva.Util._assign(_CoreInternals_1.Konva, {
        Arc: Arc_1.Arc,
        Arrow: Arrow_1.Arrow,
        Circle: Circle_1.Circle,
        Ellipse: Ellipse_1.Ellipse,
        Image: Image_1.Image,
        Label: Label_1.Label,
        Tag: Label_1.Tag,
        Line: Line_1.Line,
        Path: Path_1.Path,
        Rect: Rect_1.Rect,
        RegularPolygon: RegularPolygon_1.RegularPolygon,
        Ring: Ring_1.Ring,
        Sprite: Sprite_1.Sprite,
        Star: Star_1.Star,
        Text: Text_1.Text,
        TextPath: TextPath_1.TextPath,
        Transformer: Transformer_1.Transformer,
        Wedge: Wedge_1.Wedge,
        /**
         * @namespace Filters
         * @memberof Konva
         */
        Filters: {
            Blur: Blur_1.Blur,
            Brighten: Brighten_1.Brighten,
            Contrast: Contrast_1.Contrast,
            Emboss: Emboss_1.Emboss,
            Enhance: Enhance_1.Enhance,
            Grayscale: Grayscale_1.Grayscale,
            HSL: HSL_1.HSL,
            HSV: HSV_1.HSV,
            Invert: Invert_1.Invert,
            Kaleidoscope: Kaleidoscope_1.Kaleidoscope,
            Mask: Mask_1.Mask,
            Noise: Noise_1.Noise,
            Pixelate: Pixelate_1.Pixelate,
            Posterize: Posterize_1.Posterize,
            RGB: RGB_1.RGB,
            RGBA: RGBA_1.RGBA,
            Sepia: Sepia_1.Sepia,
            Solarize: Solarize_1.Solarize,
            Threshold: Threshold_1.Threshold,
        },
    });
});
