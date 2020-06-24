define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CiteTree = /** @class */ (function () {
        function CiteTree(svg, option) {
            var def = this.getDefs();
            this.option = Object.assign({}, def, option);
            var box_dom = this.box_dom = document.getElementById(option.id);
            this.width = box_dom.offsetWidth;
            this.height = box_dom.offsetHeight;
            this.hw = this.width / 2;
            this.hh = this.height / 2;
            var draw = svg('svgBox').size(this.width, this.height);
            this.draw = draw;
            this.rootGroup = draw.group();
            this.bindEvent();
        }
        CiteTree.prototype.getDefs = function () {
            return {
                //动画时长
                anTime: 200,
                //初始渲染层级数量
                renderLevel: 2,
                scale: 1,
                //line hover 样式名称
                lineHoverCls: "line-hover"
            };
        };
        CiteTree.prototype.bindEvent = function () {
            var draw = this.draw;
            var isDown = false, x1, y1, x, y;
            var self = this, box_dom = this.box_dom;
            //拖动事件
            $(window).on("mousedown.relation", function (e) {
                if (box_dom.contains(e.target)) {
                    isDown = true;
                    x1 = e.pageX;
                    y1 = e.pageY;
                    x = self.rootGroup.x();
                    y = self.rootGroup.y();
                    $(box_dom).addClass("svg-move");
                    //window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                    window.getSelection && window.getSelection().removeAllRanges();
                }
            }).on("click", function () {
                $(".info-box").hide();
                $(this).removeClass("svg-move");
            });
            $(window).on("mousemove.relation", function (e) {
                if (isDown) {
                    self.rootGroup.translate(x + e.pageX - x1, y + e.pageY - y1);
                }
                return false;
            }).on("mouseup", function () {
                isDown = false;
                $(box_dom).removeClass("svg-move");
            }).on("resize", function () {
                draw.width($(window).width());
                draw.height($(window).height());
            });
            this.scale = this.option.scale || 1;
            // 缩放事件
            function drag(e) {
                var direct = null;
                var scale = self.scale;
                if (e.wheelDelta) {
                    direct = e.wheelDelta;
                }
                else {
                    direct = -e.detail * 40;
                }
                var isUp = direct > 0;
                if (isUp) {
                    scale += 0.1;
                    if (scale > 3) {
                        scale = 3;
                    }
                }
                else {
                    scale -= 0.1;
                    if (scale < 0.1) {
                        scale = 0.1;
                    }
                }
                self.rootGroup.scale(scale);
                self.scale = scale;
            }
            draw.on("mousewheel", function (e) {
                drag(e);
                self.option.mousewheel && self.option.mousewheel.call(self, self.scale);
            });
        };
        return CiteTree;
    }());
    exports.CiteTree = CiteTree;
    function a() {
    }
    exports.default = a;
});
