var companyInfo = {}, mapLevel = {}, mapId = {}, infoList = [];

function Relation(SVG, option) {
    var box_dom = document.getElementById(option.id);
    this.width = box_dom.offsetWidth;
    this.height = box_dom.offsetHeight;
    this.hw = this.width / 2;
    this.hh = this.height / 2;
    var draw = SVG('svgBox').size(this.width, this.height);

    this.rootGroup = draw.group();
    this.rootGroup.draggable();
    var scale = 1;

    // 缩放
    function drag(e) {
        var driect = null;
        if (e.wheelDelta) {
            driect = e.wheelDelta;
        } else {
            driect = -e.detail * 40;
        }
        var isUp = driect > 0;
        if (isUp) {
            scale += 0.1;
            if (scale > 3) {
                scale = 3;
            }
        } else {
            scale -= 0.1;
            if (scale < 0.1) {
                scale = 0.1;
            }
        }
        this.rootGroup.scale(scale)
    }

    var self = this;
    draw.on("mousewheel", function (e) {
        drag.call(self, e)
    });


}

Relation.prototype = {
    renderRoot: function (rootItem) {
        var group = this.rootGroup.group();

        var w = rootItem.name.length * 14 + 32;
        var rect = group.rect(w, 40);
        group.transform({x: this.hw - w / 2, y: this.hh - 20});
        rect.fill("#128BED");

        // rect.x();
        console.log(rect);
        var text = group.text(rootItem.name);
        text.font({
            // anchor: "middle",
            style: "fill:#fff",
            size: 14
        });
        text.x(15);
        text.y(12);
        console.log(text, text.width());
        // text.variant("")
        console.log("roodNode", rect)

        this.rootRect = rect;

        // group.rect(100, 100)
    },
    init: function (data) {

        this.renderRoot(data);

        var rightGroup = this.rootGroup.group();
        var rightLineG = rightGroup.group();
        var rightNodeG = rightGroup.group();
        var firstList = data.children;
        if (firstList && firstList.length) {
            var half = Math.ceil(firstList.length / 2);
            var leftList = [], rightList = [];
            $.each(firstList, (idx, item) => {
                if (idx < half) {
                    rightList.push(item);

                } else {
                    leftList.push(item);
                }
            });
            conventData(rightList);
            var rlen = rightList.length;
            var rbox = this.rootRect.rbox();
            var x = rbox.x2;
            rightList.forEach((d, idx) => {
                if (idx) {
                    d.space = 10;
                } else {
                    d.space = 0;
                }
                d.h = 40;
                d.w = d.name.length * 14 + 22 + 14 + 5;
                d.x = x + 70;
                d.y = this.hh + this.getY(rightList,d);
            });

            var offsetY = (rightList[rightList.length - 1].y + 40 - rightList[0].y) / 2;
            rightList.forEach(d => {
                d.y -= offsetY;
                 this.childNode(rightNodeG, true, d);
                if (d.children) {

                    var x = this.getX(d.level);
                    var y = this.getY( d.level);
                    d.children.forEach((k, ki) => {
                        if (ki < 10) {
                            if (ki) {
                                k.space = 10;
                            } else {
                                k.space = 0;
                            }
                            k.h = 40;
                            k.w = k.name.length * 14 + 22 + 14 + 5;

                            k.x = d.x + x + 70;
                            k.y = this.hh + this.getY( d.children,k);
                           this.childNode(rightNodeG, true, k);
                        }
                    });
                    if (d.children.length > 10) {


                    }
                }
            })
            //rightNodeG
        }
    },
    getX(level) {
        var list = mapLevel[level];
        return Math.max(...list.map(d => d.w));
    },
    getY(list,item) {
        var idx = list.indexOf(item);
        var tem = null, y = item.space;
        for (var i = 0; i < idx; i++) {
            tem = list[i];
            y += tem.h + tem.space;
        }

        return y;

    },
    //渲染子节点
    childNode: function (group, isRight, item) {
        var g = group.group();
        var rbox = this.rootRect.rbox();
        var rect = g.rect(item.w, 40);
        g.transform({x: item.x, y: item.y});
        rect.fill("#128BED");

        // rect.x();
        console.log(rect);
        var text = g.text(item.name);
        text.font({
            // anchor: "middle",
            style: "fill:#fff",
            size: 14
        });
        text.x(10);
        text.y(12);
        var text_rbox = text.rbox();
        item.w = text_rbox.width + 20 + 20;
        rect.width(item.w);
        item.op_x = text_rbox.width + 5 + 10;
        item.op_y = text_rbox.y;
        console.log(text, text.width(), text.rbox());
        this.renderState(g, item);
        item.rect = rect;
        // text.variant("")


    },
    renderState(group, item) {
        var g = group.group();
        g.transform({x: item.op_x, y: 13});
        //stroke: rgb(102, 102, 102); fill: rgb(255, 255, 255); stroke-width: 1;
        g.circle(15).fill('#fff').stroke({width: 1, color: "rgb(102, 102, 102)"});
        g.line(4, 7.5, 11, 7.5).stroke({width: 1, color: "rgb(102, 102, 102)"});
        if (!item.open) {
            g.line(7.5, 4, 7.5, 11).stroke({width: 1, color: "rgb(102, 102, 102)"});
        }
    }
};


//处理数据
function conventData(list) {
    mapLevel = {};
    mapId = {};
    infoList = [];
    let fn = function (list, mapLevel, mapId, infoList, level) {
        list.forEach(d => {
            if (!mapLevel[level.toString()]) {
                mapLevel[level.toString()] = [];
            }
            mapLevel[level.toString()].push(d);
            d.level = level;
            if (d.id) {
                mapId[d.id] = d;
            } else {
                console.log(d)
            }
            d.open = level === 1;
            infoList.push(d);
            if (d.children && d.children.length) {
                fn(d.children, mapLevel, mapId, infoList, level + 1);
            }
        })
    };
    fn(list, mapLevel, mapId, infoList, 1);
}


