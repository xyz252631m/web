//v2.0.0 图形为圆形
function Figure(SVG, option) {
    var defs = {
        $box: null,
        draw: null,
        nodes: [],
        links: [],
        //是否可以缩放
        isScale: false,
        //节点点击事件
        nodeClick: null,
        celNodeClick: null,
        //根节点name
        rootName: "",
        //左边图片路径
        leftImgPath: "",
        //右边图片路径
        rightImgPath: "",
        //上部点击事件
        upClick: null,
        //下部点击事件
        downClick: null,
        //获取下级数据 必须返回一个Promise类型
        getNextItem: null,
        //进入根节点事件
        enterRoot: null,
        //离开根节点事件
        leaveRoot: null,
        //左边图片click事件
        leftImgClick: null,
        //右边图片click事件
        rightImgClick: null,
        //进入子节点事件
        enter: null,
        //离开子节点事件
        leave: null,
        anTime: 300
    };
    var opt = this.opt = $.extend(defs, option);

    this._nodes = JSON.parse(JSON.stringify(opt.nodes));
    this._links = JSON.parse(JSON.stringify(opt.links));
    this.rootItem = {
        name: opt.rootName,
        h: 40
    };

    //legend by type
    this.typeMap = {};
    //中心点
    this.center = [0, 0];
    this.$box = opt.$box;
    this.center[0] = parseInt(this.$box.width() / 2);
    this.center[1] = parseInt(this.$box.height() / 2);
    this.draw = SVG(opt.$box.find("svg")[0]);
    this.root = this.draw.group();

    //是否为信息面板里的事件
    this.infoPanelEvent = false;

    this.init();
    // this.renderCenter(this.rootItem);
    var self = this;

    // SVG.on(window, 'resize.svg', this.resize, this);
    var isDown = false, x1, y1, x, y, isMove = false;
    //拖动事件
    $(window).on("mousedown.relation", function (e) {

        if ($(".left-tip-panel")[0].contains(e.target)) {
            return;
        }


        isDown = true;
        isMove = false;
        x1 = e.pageX;
        y1 = e.pageY;
        x = self.root.x();
        y = self.root.y();
        try {
            //ie 下双击选中报错，故catch掉
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        } catch (e) {

        }
    });
    $(window).on("mousemove.relation", function (e) {
        if (isDown) {
            isMove = true;
            self.root.translate(x + e.pageX - x1, y + e.pageY - y1);
        }
        if (self.dragNode.isDown) {
            self.nodeMouseMove(self, e);
        }
    })
        .on("mouseup", function () {
            if (self.infoPanelEvent) {
                self.infoPanelEvent = false;
                return;
            }

            if (self.dragNode.isDown) {
                if (!self.dragNode.isMove) {
                    if (self.hoverParam.isActive) {
                        self.hoverParam.isActive = false;
                        if (self.hoverParam.item) {
                            self.celClickHover(self.hoverParam.item);
                        }
                    }
                    self.hoverParam.isActive = true;
                    self.hoverParam.item = self.dragNode.item;
                    self.clickItemHover(self.dragNode.item);
                    opt.nodeClick && opt.nodeClick.call(self, self.dragNode.item);
                } else {
                    if (self.hoverParam.isActive) {
                        self.hoverParam.isActive = false;
                        self.celClickHover(self.hoverParam.item);
                    }
                }
            }
            if (isDown) {
                if (!isMove) {
                    if (self.hoverParam.isActive) {
                        self.hoverParam.isActive = false;
                        self.celClickHover(self.hoverParam.item);
                    }
                }
            }
            isDown = false;
            self.dragNode.isDown = false;
        });
    //高亮激活（点击）参数
    this.hoverParam = {
        isActive: false,
        item: null,
    };
    //拖拽参数
    this.dragNode = {
        isDown: false,
        //判断是否移动 ，移动则不触发click事件
        isMove: false,
        item: null,
        x: 0,
        y: 0,
        x1: 0,
        y1: 0
    };

    var scale = 1;

    this.scale = scale;

    // 缩放事件
    function drag(e) {
        var driect = null;
        var scale = this.scale;
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
        this.root.scale(scale);
        this.scale = scale;
    }

    if (opt.isScale) {
        this.draw.on("mousewheel", function (e) {
            drag.call(self, e)
            self.opt.mousewheel && self.opt.mousewheel.call(self, self.scale);
        });
    }
}

var tool = {
    //tool method 计算角度
    getAngle: function (px1, py1, px2, py2) {
        //两点的x、y值
        var x = px2 - px1;
        var y = py2 - py1;
        var hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));//斜边长度
        if (hypotenuse == 0) {
            return 0;
        }
        var cos = x / hypotenuse;
        var radian = Math.acos(cos);//求出弧度
        var angle = radian * 180 / Math.PI;//用弧度算出角度
        if (y < 0) {
            angle = -angle;
        } else if ((y == 0) && (x < 0)) {
            angle = 180;
        }
        return angle;
    },
    getStrList: function (str) {
        var b = 0;
        var list = [], tem = "", splitIdx = 0, splitList = [7, 9, 7];
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) {
                b++;
            } else {
                b += 2;
            }
            tem += c;
            if (b >= (splitList[splitIdx] || 7)) {
                splitIdx++;
                list.push(tem);
                tem = "";
                b = 0;
            } else {
                if (i === str.length - 1) {
                    list.push(tem);
                }
            }
        }

        if (list.length >= 4) {
            list[2] = list[2][0] + list[2][1] + list[2][2] + "...";
            var temList = [];
            $.each(list, function (i) {
                if (i < 3) {
                    temList.push(this);
                }
            });
            list = temList;
        }
        return list
    },

    temRender: function (d) {
        var list = tool.getStrList(d.name);
        var tspans = d3.select(this).selectAll("tspan").data(list).enter().append("tspan")
            .text(function (d) {
                return d
            });
        if (list.length === 3) {
            var dyList = [-0.5, 1.3, 1.3];
            tspans.attr("dy", function (d, i) {
                return dyList[i] + "em";
            })
        } else if (list.length === 2) {
            var dy2List = [-0.1, 1.1];
            tspans.attr("dy", function (d, i) {
                return dy2List[i] + "em";
            })
        }
    }
};

$.extend(Figure.prototype, {
    init: function () {
        var self = this;
        var opt = this.opt;
        this.up_line = this.root.group();
        this.up_node = this.root.group();


        this.renderLegend(opt.nodes);

        //渲染node
        $.each(opt.nodes, function () {
            self.renderNode(this);
        });
        this.linksNumber(opt.links);
        //渲染 连接线
        $.each(opt.links, function (idx) {
            self.renderLink(this);
        });
        // this.halfGroup.y(-(r_centerY - this.hh))
        //  this.up_line.y(this.center[1] + 175);

    },
    //渲染图例
    renderLegend: function (nodes) {
        var self = this;
        var $ul = $(".legend-box");
        var typeMap = this.typeMap, typeList = [];
        nodes.forEach(function (d) {
            if (!typeMap[d.typeId]) {
                typeMap[d.typeId] = {
                    typeId: d.typeId,
                    typeName: d.typeName,
                    color: self.opt.nodeColorByTypeId(d.typeId, d),
                    list: []
                };
                typeList.push(typeMap[d.typeId]);
            }
            typeMap[d.typeId].list.push(d);
        });

        var h = [];
        typeList.forEach(function (d) {
            h.push('<li data-type-id="' + d.typeId + '"><i class="i-icon" data-color="' + d.color + '" style="background-color: ' + d.color + '"></i><span>' + d.typeName + '</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
        })
        $ul.html(h.join(""));

        //图例点击事件
        $ul.on("click", "li", function () {
            var cls = "active";
            var $el = $(this);
            var $i = $el.find(".i-icon");
            if ($el.hasClass(cls)) {
                $ul.removeClass("legend-box-dis");
                $el.removeClass(cls);
                self.opt.$box.removeClass("svg-node-legend");
                $ul.find("li").each(function () {
                    var $ti = $(this).find(".i-icon");
                    $ti.css("background-color", $ti.attr("data-color"));
                })
                self.hoverItemByType(typeId, true);

            } else {
                $ul.addClass("legend-box-dis");
                self.opt.$box.addClass("svg-node-legend");
                var typeId = $el.attr("data-type-id");
                $ul.find("li").removeClass(cls).find(".i-icon").css("background-color", "");
                $i.css("background-color", $i.attr("data-color"))
                $el.addClass(cls);
                self.hoverItemByType(typeId);
            }

        })

    },

    hoverItemByType: function (typeId, isCel) {
        var typeMap = this.typeMap;
        for (var key in typeMap) {
            if (isCel) {
                typeMap[key].list.forEach(function (d) {
                    d.g.removeClass("node-show")
                })
            } else {
                if (key === typeId) {
                    typeMap[key].list.forEach(function (d) {
                        d.g.addClass("node-show")
                    })
                } else {
                    typeMap[key].list.forEach(function (d) {
                        d.g.removeClass("node-show")
                    })
                }
            }
        }
    },
    //连接线分配编号
    linksNumber: function (links) {
        var linkGroup = {};
        links.forEach(function (d) {
            var key = d.source.id < d.target.id ? d.source.id + ':' + d.target.id : d.target.id + ':' + d.source.id;
            if (!linkGroup[key]) {
                linkGroup[key] = {
                    num: 0,
                    list: []
                }
            }
            linkGroup[key].num++;
            linkGroup[key].list.push(d);
        })

        for (var key in linkGroup) {
            var group = linkGroup[key];
            var num = group.num;
            group.list.forEach(function (d, i) {
                d.ox_size = num;
                d.ox_index = i;
            });
        }
    },

    renderNode: function (item) {
        var self = this;
        var g = self.up_node.group().transform({x: item.x - 33.5, y: item.y - 33.5}).addClass("node-" + item.nodeType);
        item.g = g;
        var circle = g.circle(67);
        if (item.nodeType === "person") {
            circle.radius(22.5);
        } else {

        }
        var list = tool.getStrList(item.name || item.properties.name);
        var text = g.text(list[0] + '').font({size: 12}).fill("#333").x(10).y(11);
        if (list.length === 2) {
            text.y(20);
            text.build(true);
            text.tspan(list[1] + '').x(10).dy(15);
            text.build(false);
        } else if (list.length === 3) {
            text.build(true);
            text.tspan(list[1] + '').x(5).dy(15);
            text.tspan(list[2] + '').x(10).dy(15);
            text.build(false);
        } else {
            text.x(33).y(27).attr("text-anchor", "middle");
        }
        var bg = self.opt.nodeColorByTypeId(item.typeId, item);
        circle.fill(bg)
        if (item.nodeType === "company") {
            var status_g = g.group().addClass("node-status");
            status_g.transform({x: 45, y: -10})
            var rect = status_g.rect(100, 22);
            var b_color = self.opt.statusColor(item);
            rect.rx(5).ry(5).fill(b_color);
            var text = status_g.text(item.properties.status).font({size: 12}).fill("#333").x(5).dy(0);
            var text_rbox = text.rbox();
            item.status_w = text_rbox.width + 10;
            rect.width(item.status_w);
        }
        g.on("mousedown", this.mousedown, {self: self, item: item});
        g.on("mouseenter", this.mouseenterNode, {self: self, item: item});
        g.on("mouseleave", this.mouseleaveNode, {self: self, item: item});
    },
    renderLink: function (item) {
        var self = this;
        var g = self.up_line.group().addClass("node-link-" + item.source.nodeType);
        item.g = g;
        var x = item.source.x;
        var y = item.source.y;
        var x1 = item.target.x;
        var y1 = item.target.y;
        var ty = 0;
        var line = g.line(item.source.x, item.source.y, item.target.x, item.target.y).attr("data-id", item.source.x);

        if (item.ox_size === 1) {

        } else {
            if (item.ox_size % 2 === 0) {
                //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                var flag = item.ox_index % 2 === 0 ? -1 : 1;
                ty = flag * 14 * parseInt(item.ox_index / 2) + (flag * 7);
            } else {
                //0 0, 1 -7 , 2 7,
                //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                if (itme.ox_index > 0) {
                    var flag = (item.ox_index - 1) % 2 === 0 ? -1 : 1;
                    ty = flag * 14 * parseInt((item.ox_index - 1) / 2) + (flag * 7);
                }
            }
        }


        var deg = tool.getAngle(x, y, x1, y1);


        var _y = ty * (Math.sin((90 - deg) * Math.PI / 180));
        var _x = ty * (Math.cos((90 - deg) * Math.PI / 180));
        line.translate(_x, -_y);
        item.line = line;


        if (deg > 90 && deg < 270) {
            deg -= 180;
        }
        if (deg > -270 && deg < -90) {
            deg += 180;
        }

        var txt = self.opt.lineText(item) || "";

        var text = g.text(txt).x(x + _x + (x1 - x) / 2).y(y - _y + (y1 - y) / 2 - 6).rotate(deg);
        item.textNode = text;

        if (item.source.nodeType === "person") {
            line.marker("end", this.draw.defs().select("#arrowPerson").first());
        } else {
            line.marker("end", this.draw.defs().select("#arrowCompany").first());
        }
    },
    //nodes mousedown
    mousedown: function (e) {
        var self = this.self, item = this.item;
        var drag = self.dragNode;
        drag.isMove = false;
        drag.isHover = false;
        drag.isDown = true;
        drag.x1 = e.pageX;
        drag.y1 = e.pageY;
        drag.x = item.g.x();
        drag.y = item.g.y();
        drag.item = item;
        try {
            //ie 下双击选中报错，故catch掉
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        } catch (e) {

        }
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
    },
    //高亮
    hoverItem: function (item) {
        var self = this;
        var linksNodes = self.getLinkNodes(item);
        // item.g.addClass("node-" + item.nodeType + "-hover");
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {
            this.g.addClass("node-link-" + this.source.nodeType + '-hover');

            this.source.g.addClass("node-" + this.source.nodeType + "-hover");
            this.target.g.addClass("node-" + this.target.nodeType + "-hover");
            if (this.source.nodeType === "person") {
                this.line.marker("end", self.draw.defs().select("#arrowPersonHover").first());
            } else {
                this.line.marker("end", self.draw.defs().select("#arrowCompanyHover").first());
            }
        });
    },
    //取消高亮
    celHoverItem: function (item) {
        var self = this;
        var linksNodes = self.getLinkNodes(item);
        // item.g.removeClass("node-" + item.nodeType + "-hover");
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {
            this.g.removeClass("node-link-" + this.source.nodeType + '-hover');
            this.source.g.removeClass("node-" + this.source.nodeType + "-hover");
            this.target.g.removeClass("node-" + this.target.nodeType + "-hover");
            if (this.source.nodeType === "person") {
                this.line.marker("end", self.draw.defs().select("#arrowPerson").first());
            } else {
                this.line.marker("end", self.draw.defs().select("#arrowCompany").first());
            }
        });
    },
    //nodes mouseenter
    mouseenterNode: function (e) {
        var self = this.self, item = this.item;
        if (!self.hoverParam.isActive) {
            self.hoverItem(item);
        }

    },
    //nodes mouseleave
    mouseleaveNode: function (e) {
        var self = this.self, item = this.item;
        if (!self.hoverParam.isActive) {
            self.celHoverItem(item);
        }
    },
    //点击高亮
    clickItemHover: function (item) {
        var self = this;
        this.opt.$box.addClass("svg-node-hover");
        self.hoverItem(item);

    },
    //取消点击高亮
    celClickHover: function (item) {
        var self = this;
        this.opt.$box.removeClass("svg-node-hover");
        self.celHoverItem(item);
        self.opt.celNodeClick && self.opt.celNodeClick.call(self, item);
    },
    //根据item.id 获取相连接的nodes
    getLinkNodes: function (item) {
        var self = this;
        var opt = self.opt, links = opt.links;
        var sourceList = [], targetList = [];
        $.each(links, function () {
            if (this.source.id === item.id) {
                sourceList.push(this);
            }
            if (this.target.id === item.id) {
                targetList.push(this);
            }
        });
        return {
            sourceList: sourceList,
            targetList: targetList
        }
    },
    nodeMouseMove: function (self, e) {
        var drag = self.dragNode;
        var scale = self.scale;
        var item = drag.item;
        var _tem_x = e.pageX - drag.x1;
        var _tem_y = e.pageY - drag.y1;
        if(_tem_x ===0&&_tem_y===0){
            return;
        }
        drag.isMove = true;


        var moveX = (e.pageX - drag.x1) * (1 / scale);
        var moveY = (e.pageY - drag.y1) * (1 / scale);
        //node
        var t = 33.5;
        item.x = drag.x + moveX + t;
        item.y = drag.y + moveY + t;
        item.g.translate(item.x - t, item.y - t);
        //line
        var linksNodes = self.getLinkNodes(item);
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {
            var x = this.source.x;
            var y = this.source.y;
            var x1 = this.target.x;
            var y1 = this.target.y;
            var ty = 0;
            this.line.plot(this.source.x, this.source.y, this.target.x, this.target.y);
            if (this.ox_size === 1) {

            } else {
                if (this.ox_size % 2 === 0) {
                    //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                    var flag = this.ox_index % 2 === 0 ? -1 : 1;
                    ty = flag * 14 * parseInt(this.ox_index / 2) + (flag * 7);

                } else {
                    //0 0, 1 -7 , 2 7,
                    //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                    if (itme.ox_index > 0) {
                        var flag = (this.ox_index - 1) % 2 === 0 ? -1 : 1;
                        ty = flag * 14 * parseInt((this.ox_index - 1) / 2) + (flag * 7);

                    }
                }
            }
            var deg = tool.getAngle(x, y, x1, y1);

            var _y = ty * (Math.sin((90 - deg) * Math.PI / 180));
            var _x = ty * (Math.cos((90 - deg) * Math.PI / 180));
            this.line.translate(_x, -_y);
            if (deg > 90 && deg < 270) {
                deg -= 180;
            }
            if (deg > -270 && deg < -90) {
                deg += 180;
            }

            this.textNode.rotate(0).x(x + _x + (x1 - x) / 2).y(y - _y + (y1 - y) / 2 - 6).rotate(deg);
        });

        return false;
    },

    plus: function () {
        var scale = this.scale;
        scale += 0.1;
        if (scale > 3) {
            scale = 3;
        }
        this.root.scale(scale);
        this.scale = scale;
        return scale;
    },
    minus: function () {
        var scale = this.scale;
        scale -= 0.1;
        if (scale < 0.1) {
            scale = 0.1;
        }
        this.root.scale(scale);
        this.scale = scale;
        return scale;
    },
    scaleMap: function (scale) {
        if (scale < 0.1) {
            scale = 0.1;
        }
        if (scale > 3) {
            scale = 3;
        }
        this.root.scale(scale);
        this.scale = scale;
    },
    reset: function () {
        this.root.clear();
        this.root = this.draw.group();
        $.each(this.opt.nodes, function () {
            this.x = this._x;
            this.y = this._y;
        });
        //this.opt.nodes = JSON.parse(JSON.stringify(this._nodes));
        // this.opt.links = JSON.parse(JSON.stringify(this._links));
        this.scale = 1;
        // this.root.scale(1);
        this.init();
    }
});

