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
        console.log("roodNode", rect);
        group.line(-35, 20, 0, 20).stroke({width: 0.5, color: "#666"});
        var r_w = rect.width();
        group.line(r_w, 20, r_w + 35, 20).stroke({width: 0.5, color: "#666"});

        // this.rootGroup = group;
        this.rootRect = rect;
        // group.rect(100, 100)
    },
    init: function (data) {

        this.renderRoot(data);

        var rightGroup = this.rootGroup.group();
        var rightLineG = rightGroup.group();
        var rightNodeG = rightGroup.group();
        this.rightGroup = rightGroup;
        this.rightLineG = rightLineG;
        this.rightNodeG = rightNodeG;
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
                d.y = this.getY(rightList, d); // this.hh +
                console.log("1y", d.y)
            });

            var offsetY = (rightList[rightList.length - 1].y + 40 - rightList[0].y) / 2;
            rightList.forEach(d => {
                //  d.y -= offsetY;

                this.childNode(rightNodeG, true, d);
                if (d.children) {

                    var x = this.getX(d.level);
                    //  var y = this.getY(d.level);
                    var off_y = this.getOffsetY(d);
                    console.log("offy", off_y)
                    //绘制子节点
                    d.children.forEach((k, ki) => {
                        //   if (ki < 10) {
                        if (ki) {
                            k.space = 10;
                        } else {
                            k.space = 0;
                        }
                        k.h = 40;
                        k.w = k.name.length * 14 + 22 + 14 + 5;

                        k.x = d.x + x + 70;
                        //console.log("y",this.getY(d.children, k))
                        k.y = this.getY(d.children, k) + off_y;
                        console.log("y", k.y)
                        this.childNode(rightNodeG, true, k);
                        //  }
                    });
                    if (d.children.length > 10) {


                    }
                    //画线

                    this.line(rightLineG, d)
                }
            })
            // this.line(rightLineG,data)
            //rightNodeG

            var list = rightList;
            var r_frist = list[0];
            var r_last = list[list.length - 1];
            var r_centerX = r_frist.x - 35;

            rightLineG.line(r_centerX, r_frist.y + 20, r_centerX, r_last.y + 20).stroke({
                width: 0.5,
                color: "#666"
            }).attr("data-id", data.id);
            var r_centerY = (r_last.y + 40 - r_frist.y) / 2;
            rightGroup.y(-(r_centerY / 2 + this.hh))

        }
    },
    getX(level) {
        var list = mapLevel[level];
        return Math.max(...list.map(d => d.w));
    },
    //寻找到上一个展开的iten ,用来获取y位置
    getPrevItem(list, idx) {
        var item = list[idx - 1];
        while (!item.open || !item.children.length) {
            idx--;
            if (idx < 0) {
                break;
            }
            item = list[idx];
        }
        if (item.open) {
            return item;
        } else {
            return null;
        }


    },
    //寻找到下一个展开的iten ,用来重置y位置
    getNextItem(list, idx) {
        if (idx >= list.length - 1) {
            return null;
        }
        var item = list[idx + 1];
        while (!item.open || !item.children.length) {
            idx++;
            if (idx >= list.length - 1) {
                break;
            }
            item = list[idx];
        }
        if (item.open) {
            return item;
        } else {
            return null;
        }
    },
    //获取间隔 最小间隔为40
    getSpace(list, prevItem, item) {
        var pi = list.indexOf(prevItem);
        var idx = list.indexOf(item);
        var num = idx - pi - 1;
        var p = num * 50 + 10 + 40;           //50 :h+10 40:原最小间隔
        var space = p - (prevItem.children.length * 50 - 10) / 2 - (item.children.length * 50 - 10) / 2;
        console.log("space", space)
        return space < 40 ? 40 : space;

    },
    getOffsetY(item) {
        var list = mapLevel[item.level];
        var idx = list.indexOf(item);
        if (idx) {
            //上一个展开节点
            var prevItem = this.getPrevItem(list, idx);
            if (prevItem) {
                var space = this.getSpace(list, prevItem, item);
                var children = prevItem.children;
                if (children && children.length) {

                    return children[children.length - 1].y + 40 + space;//40 h  40: 上下间距
                } else {
                    return 0;
                }

            } else {
                return 0
            }


        } else {
            return 0
        }

    },
    //当前列表里item的位置 不含当前item space
    getY(list, item) {
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
        item.g = g;
        var rbox = this.rootRect.rbox();
        var rect = g.rect(item.w, 40);
        // rect.y(item.y)
        g.transform({x: item.x, y: item.y});
        rect.fill("#128BED");

        // rect.x();
        //console.log(rect);
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
        //console.log(text, text.width(), text.rbox());
        if (item.children && item.children.length) {
            this.renderState(g, item);
            g.attr("class", "svg-csp")
        } else {
            item.w -= 15;
            rect.width(item.w);
        }
        item.rect = rect;

        g.line(-35, 20, 0, 20).stroke({width: 0.5, color: "#666"});
        // if (item.open && item.children.length) {
        //
        //     g.line(item.w, 20, item.children[0].x - 35, 20).stroke({width: 0.5, color: "#666"});
        // }
        // text.variant("")
        if (item.isMoreItem) {
            item.w += 15;
            rect.width(item.w);
            this.renderState(g, item);
            rect.fill("#f1f1f1");
            text.font({
                // anchor: "middle",
                style: "fill:#333"
            });
            g.attr("class", "svg-more").attr("data-pid", item.pid);

            g.on("click", this.moreClick, this)
        }
        g.on("mouseenter",this.mouseenter)
        g.on("mouseleave",this.mouseleave)

    },
    mouseenter(e){
        var rect =this.rbox();
        var left = rect.x-340+25;
        var top = rect.y;
        $(".info-box").css({
            left:left+"px",
            top: top+"px"
        }).show()
    },
    mouseleave(){
        $(".info-box").hide()
    },
    moreClick(e, a) {
        console.log(this, e, a);

        var node = e.target.parentNode;
        if (node.getAttribute("class") !== "svg-more") {
            node = node.parentNode;
        }
        var pid = node.getAttribute("data-pid");

        //var pid = this.attr("data-pid");
        var item = mapId[pid];
        console.log(mapId[pid]);
        if (item.moreOpen) {

        } else {

            item.children.pop();
            node.remove();
            var off_y = this.getOffsetY(item);
            var x = this.getX(item.level);
            item.moreList.forEach(k => {
                item.children.push(k);
                k.space = 10;
                k.h = 40;
                k.w = k.name.length * 14 + 22 + 14 + 5;
                k.x = item.x + x + 70;
                //console.log("y",this.getY(d.children, k))
                k.y = this.getY(item.children, k) + off_y;
                console.log("y", k.y)
                this.childNode(this.rightNodeG, true, k)
            })
            this.line(this.rightLineG, item);
        }
    },
    //画线
    line(group, item) {

        var g = item.g;
        //  var polyline = draw.polyline('0,0 100,50 50,100').fill('none').stroke({width: 1})
        if (item.open && item.children.length) {
            var frist = item.children[0];
            var last = item.children[item.children.length - 1];
            console.log("x", item.children[0].x, item.x, item.w);
            var centerX = frist.x - item.x - 35;
            item.rightLine = g.line(item.w, 20, centerX, 20).stroke({width: 0.5, color: "#666"});
            var centerY = frist.y + (last.y + 40 - frist.y) / 2;
            if (item.children.length > 1) {
                group.line(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20).stroke({
                    width: 0.5,
                    color: "#666"
                }).attr("data-id", item.id);
            }
            //重置item y

            item.y = centerY - 20;
            item.g.y(item.y);


            var list = mapLevel[item.level];
            //排列上部分

            var idx = list.indexOf(item);
            if (idx > 1) {
                var prevItem = this.getPrevItem(list, idx);
                if (prevItem) {
                    var p_idx = list.indexOf(prevItem);
                    var p_num = idx - p_idx;
                    if (p_num > 1) {
                        var p_space = (item.y - prevItem.y) / p_num;
                        for (var i = 1; i < p_num; i++) {
                            list[p_idx + i].g.y(prevItem.y + p_space * i);
                        }
                    }


                }
            }
            if (idx < list.length - 2) {
                //排列下部分
                var nextItem = this.getNextItem(list, idx);
                if (nextItem) {

                }
            }
            //

        }

    },

    renderState(group, item) {

        var g = group.group();
        g.transform({x: item.op_x, y: 13});
        //stroke: rgb(102, 102, 102); fill: rgb(255, 255, 255); stroke-width: 1;
        g.circle(15).fill('#fff').stroke({width: 1, color: "rgb(102, 102, 102)"});
        g.line(4, 7.5, 11, 7.5).stroke({width: 1, color: "rgb(102, 102, 102)"});
        if (item.isMoreItem) {
            if (!item.moreOpen) {
                g.line(7.5, 4, 7.5, 11).stroke({width: 1, color: "rgb(102, 102, 102)"});
            }
        } else {
            if (!item.open) {
                g.line(7.5, 4, 7.5, 11).stroke({width: 1, color: "rgb(102, 102, 102)"});
            }
        }


    }
};


//处理数据
function conventData(list) {
    mapLevel = {};
    mapId = {};
    infoList = [];
    let fn = function (list, mapLevel, mapId, infoList, level, pid) {
        list.forEach(d => {
            if (!mapLevel[level.toString()]) {
                mapLevel[level.toString()] = [];
            }
            mapLevel[level.toString()].push(d);
            d.level = level;

            d.pid = pid;
            if (d.id) {
                mapId[d.id] = d;
            } else {
                console.log(d)
            }
            d.open = level === 1;
            infoList.push(d);
            if (d.children) {
                if (d.children.length) {
                    fn(d.children, mapLevel, mapId, infoList, level + 1, d.id);
                }
            } else {
                d.children = [];
            }

        })
    };
    fn(list, mapLevel, mapId, infoList, 1, "root");

    infoList.forEach((d, i) => {
        if (d.children.length > 10) {
            var child = [], moreList = [];
            d.children.forEach((k, idx) => {
                if (idx < 10) {
                    child.push(k);
                } else {
                    moreList.push(k);
                }
            });
            child.push({
                id: "more_" + d.id + "_" + i,
                name: "更多",
                isMoreItem: true,
                pid: d.id

            })
            d.children = child;
            d.moreList = moreList;
            d.hasMore = true;
            d.moreOpen = false;

        }
    });
}


