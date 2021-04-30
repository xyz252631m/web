//点类型
var PointType;
(function (PointType) {
    PointType["Collection"] = "collection";
    PointType["Record"] = "record";
})(PointType || (PointType = {}));
class ImgPoint {
    constructor(selector, option) {
        let def = {
            typeBoxSelector: "",
            pointBox: "",
            infoBox: "",
            pointList: []
        };
        // @ts-ignore
        this.opt = $.extend({}, def, option);
        this.elem = $(selector);
        this.typeBox = $(this.opt.typeBoxSelector);
        this.pointBox = $(this.opt.pointBox);
        this.infoBox = $(this.opt.infoBox);
        this.clickPoint = {
            x: 0,
            y: 0
        };
        this.bingEvent();
        this.init();
    }
    init() {
        if (this.opt.pointList) {
            this.pointData = this.opt.pointList;
            this.pointData.forEach(d => {
                this.addPoint(d.type, d.id, d.x, d.y);
            });
        }
        else {
            this.pointData = [];
        }
    }
    bingEvent() {
        let self = this;
        //选择类型
        this.elem.on("click", function (e) {
            let left = e.pageX, top = e.pageY;
            self.clickPoint.x = left;
            self.clickPoint.y = top;
            self.hideAll();
            self.typeBox.css({
                left: left + 'px',
                top: top + 'px'
            }).fadeIn(400);
            return false;
        });
        //添加点
        this.typeBox.on("click", "li", function (e) {
            let type = $(e.currentTarget).attr("data-type");
            let boxLeft = this.offsetLeft;
            let boxTop = this.offsetTop;
            let pos = self.elem[0].getBoundingClientRect();
            let x = self.clickPoint.x - pos.x;
            let y = self.clickPoint.y - pos.y;
            let point = {
                id: (+new Date()) + '',
                x,
                y,
                type
            };
            self.pointData.push(point);
            self.addPoint(type, point.id, x, y);
            self.typeBox.fadeOut(400);
            return false;
        });
        //点信息
        this.pointBox.on("click", "span", function (e) {
            let span = $(e.currentTarget);
            let id = span.attr("id");
            let item = self.pointData.find(d => d.id === id);
            if (item) {
                let box = self.infoBox;
                box.find("h3 span").text(id);
                box.find(".main").html(self.getInfoHtmlTmpl(item));
                let left = e.pageX, top = e.pageY;
                let x = left + 15;
                let y = top - 57;
                self.hideAll();
                box.css({
                    left: x + 'px',
                    top: y + 'px'
                }).fadeIn(400);
            }
            return false;
        });
        $(window).on("click", function () {
            self.hideAll();
        });
    }
    hideTypeBox() {
        this.typeBox.hide();
    }
    hideInfoBox() {
        this.infoBox.hide();
    }
    hideAll() {
        this.hideTypeBox();
        this.hideInfoBox();
    }
    //信息面板 模板
    getInfoHtmlTmpl(item) {
        let h = [];
        h.push('<p class="title">点坐标</p>');
        h.push(`<p class="p-pos"><span>X：${item.x}</span></p>`);
        h.push(`<p class="p-pos"><span>Y：${item.y}<span></p>`);
        return h.join("");
    }
    addPoint(type, id, x, y) {
        let icon = "";
        switch (type) {
            case PointType.Collection:
                icon = `<i class="iconfont icon-shoucang"></i>`;
                break;
            case PointType.Record:
                icon = `<i class="iconfont icon-youji"></i>`;
                break;
        }
        //icon width:8, height:8
        let style = `left:${x - 8}px;top:${y - 8}px`;
        this.pointBox.append(`<span id="${id}" style="${style}">${icon}</span>`);
    }
}
