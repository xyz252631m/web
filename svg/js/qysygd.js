function UpFigure(SVG, option) {
    var defs = {
        $box: null,
        draw: null,
        nodes: [],
        data: {},
        links: [],
        //是否可以缩放
        isDrag: false,
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

    //中心点
    this.center = [0, 0];
    this.$box = opt.$box;
    this.center[0] = parseInt(this.$box.width() / 2);
    this.center[1] = parseInt(this.$box.height() / 2);
    this.draw = SVG(opt.$box.find("svg")[0]);
    this.root = this.draw.group();
    this.init();
    // this.renderCenter(this.rootItem);
    var self = this;

    // SVG.on(window, 'resize.svg', this.resize, this);
    var isDown = false, x1, y1, x, y, isMove = false;
    //拖动事件
    $(window).on("mousedown.relation", function (e) {
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

    if (opt.isDrag) {
        this.draw.on("mousewheel", function (e) {
            drag.call(self, e);
            self.opt.mousewheel && self.opt.mousewheel.call(self, self.scale);
        });
    }
}

var tool = {

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

$.extend(UpFigure.prototype, {
    init: function () {
        var self = this;
        var opt = this.opt;
        this.clcaPos(opt.data);
        this.line_g = this.root.group();
        this.node_g = this.root.group();
        this.topNodeMap = {};
        this.topNodeMap[opt.data.id] = opt.data;
        opt.data.isRoot = true;
        //渲染 node
        $.each(opt.data.paths, function () {
            this.isTopNode = true;
            self.topNodeMap[this.id] = this;
            self.renderNode(this);
        });
        var len = opt.data.paths.length;
        //获取最长路径
        var maxPathLen = 1;
        $.each(opt.data.paths, function () {
            $.each(this.paths, function () {
                maxPathLen = Math.max(maxPathLen, this.length);
            })
        });
        //180
        this.rootNode = {
            x: 0,
            y: 0
        };
        //顶部节点高度
        var topNodeH = 81.5;
        if (maxPathLen <= 4) {
            this.rootNode.y = 660 + topNodeH;
        } else {
            this.rootNode.y = 180 * maxPathLen + topNodeH;
        }
        this.links = [];
        //渲染其他节点
        var otherMap = {}, temX = 20;//和父节点的间距
        this.otherMap = otherMap;
        $.each(opt.data.paths, function (i) {
            var id = this.id;
            var firstItem = this;
            $.each(this.paths, function () {
                var temList = this;
                var t = (self.rootNode.y - topNodeH) / temList.length;
                $.each(temList, function (idx) {

                    this.topNode = firstItem;
                    if (self.links.length === 0) {
                        self.links.push({
                            startId: this.id,
                            endId: opt.data.id,
                            isMax: i === 0,
                            text:this.Percent
                        });
                    } else {
                        if (idx) {
                            self.links.push({
                                startId: this.id,
                                endId: temList[idx - 1].id,
                                text:this.Percent
                            });
                        } else {
                            self.links.push({
                                startId: this.id,
                                endId: opt.data.id,
                                isMax: false,
                                text:this.Percent
                            });
                        }

                    }


                    if (this.id !== id) {
                        this.y = self.rootNode.y - t * (idx + 1);
                        if (otherMap[this.id]) {
                            otherMap[this.id].minX = Math.min(otherMap[this.id].minX, firstItem.x);
                            otherMap[this.id].x = otherMap[this.id].minX + (firstItem.x - otherMap[this.id].minX) / 2 + temX;
                            self.updateOtherNode(otherMap[this.id]);
                        } else {
                            otherMap[this.id] = this;

                            this.x = firstItem.x + temX;
                            this.minX = this.x;
                            self.renderOtherNode(this);
                        }
                    }
                });

            })
        });


        if (len) {
            //x 居中
            var end_x = opt.data.paths[len - 1].x;
            this.rootNode.x = (end_x + 166) / 2;
            this.node_g.x((this.center[0] - (end_x + 166) / 2))
        }
        //渲染根节点
        opt.data.x = this.rootNode.x;
        opt.data.y = this.rootNode.y;
        this.renderRootNode(opt.data);


        //渲染 连接线
        $.each(this.links, function (idx) {
            self.renderLink(this);
        });
        this.line_g.x((this.center[0] - (end_x + 166) / 2))

        // this.halfGroup.y(-(r_centerY - this.hh))
        //  this.up_line.y(this.center[1] + 175);

    },
    clcaPos: function (data) {
        var list = data.paths;
        //min h 620;
        $.each(list, function (i) {
            this.x = (166 + 10) * i;
            this.y = 100;
        });

    },
    renderRootNode: function (item) {
        var self = this;
        var w = this.getLength(item.name) * 7 + 20;
        var g = self.node_g.group().transform({x: item.x - w / 2, y: item.y}).addClass("node-root-item");
        item.g = g;
        item.w = w;
        item.offsetX = 0;
        item.offsetY = 0;
        var rect = g.rect(w, 40);
        g.text(item.name).x(9).y(11);
        g.on("mousedown", this.mousedown, {self: self, item: item});
        g.on("mouseenter", this.mouseenterNode, {self: self, item: item});
        g.on("mouseleave", this.mouseleaveNode, {self: self, item: item});
    },
    renderNode: function (item) {
        var self = this;
        var g = self.node_g.group().transform({x: item.x, y: item.y}).addClass("node-item");
        item.g = g;
        item.w = 166;
        item.offsetX = 166 / 2;
        //总高度
        item.offsetY =63;
        g.rect(item.w, 60).rx(2).ry(2).addClass("top-rect");
        g.rect(item.w + 1, 3).x(-0.5).y(60).addClass("two-rect");
        g.text(item.name).x(5).y(11);
       // var rect = g.rect(166, 23).addClass("top-rect");
        g.text('最终受益股份：' + item.percentTotal).x(5).y(38);
       // var circle = g.circle(55).cx(166 / 2).cy(23 + 31);

        g.on("mousedown", this.mousedown, {self: self, item: item});
        g.on("mouseenter", this.mouseenterNode, {self: self, item: item});
        g.on("mouseleave", this.mouseleaveNode, {self: self, item: item});
    },
    renderOtherNode: function (item) {
        var self = this;
        var g = self.node_g.group().transform({x: item.x, y: item.y}).addClass("node-other-item");
        item.g = g;
        item.w = 100;
        item.offsetX = 100 / 2;
        item.offsetY = 50;
        var rect = g.rect(100, 50);

        var title = this.setCusNameLines(item.name, 14, 2);
        var text = g.text(title[0]).font({size: 14}).x(50).y(8);
        if (title.length > 1) {
            text.build(true);
            text.tspan(title[1]).x(50).dy(19);
            text.build(false);
        }
        g.on("mousedown", this.mousedown, {self: self, item: item});
        g.on("mouseenter", this.mouseenterNode, {self: self, item: item});
        g.on("mouseleave", this.mouseleaveNode, {self: self, item: item});
    },
    updateOtherNode: function (item) {
        item.g.transform({x: item.x, y: item.y});
    },
    getLength: function (str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    },
    //多行截取字符串
    setCusNameLines: function (str, strLen, line) {
        var len = this.getLength(str);
        var tem = str;
        var res = [];
        var lineIdx = 0, lineCount = 1;
        if (len > strLen) {
            for (var i = 1; i < str.length; i++) {
                tem = str.substring(lineIdx, i);
                if (this.getLength(tem) >= strLen) {
                    if (lineCount >= (line || 0)) {
                        tem = str.substring(lineIdx, i - 1) + "...";
                        res.push(tem);
                        break;
                    } else {
                        lineIdx = i;
                        lineCount++;
                        res.push(tem);
                    }
                } else {
                    if (i === str.length - 1) {
                        res.push(str.substring(lineIdx, str.length));
                    }
                }
            }
        } else {
            res.push(tem);
        }
        return res;
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
        if (item.isRoot) {
            return;
        }
        var linksNodes = self.getPathLinks(item);
        // item.g.addClass("node-hover");
        if (self.topNodeMap[item.id]) {
            item.g.addClass("node-hover");
        } else {
            item.g.addClass("node-other-hover");
        }
        // item.g.addClass("node-" + item.nodeType + "-hover");
        // $.each(linksNodes, function () {
        //     this.g.addClass("node-link-" + this.source.nodeType + '-hover');
        //
        //     this.source.g.addClass("node-" + this.source.nodeType + "-hover");
        //     this.target.g.addClass("node-" + this.target.nodeType + "-hover");
        //     if (this.source.nodeType === "person") {
        //         this.line.marker("end", self.draw.defs().select("#arrowHover").first());
        //     } else {
        //         this.line.marker("end", self.draw.defs().select("#arrowMaxHover").first());
        //     }
        // });
    },
    //取消高亮
    celHoverItem: function (item) {
        var self = this;
        if (item.isRoot) {
            return;
        }
        var linksNodes = self.getPathLinks(item);
        if (self.topNodeMap[item.id]) {
            item.g.removeClass("node-hover");
        } else {
            item.g.removeClass("node-other-hover");
        }

        // item.g.removeClass("node-" + item.nodeType + "-hover");
        // $.each(linksNodes, function () {
        //     this.g.removeClass("node-link-" + this.source.nodeType + '-hover');
        //     this.source.g.removeClass("node-" + this.source.nodeType + "-hover");
        //     this.target.g.removeClass("node-" + this.target.nodeType + "-hover");
        //     if (this.source.nodeType === "person") {
        //         this.line.marker("end", self.draw.defs().select("#arrow").first());
        //     } else {
        //         this.line.marker("end", self.draw.defs().select("#arrowMax").first());
        //     }
        // });
    },
    //nodes mouseenter
    mouseenterNode: function (e) {
        // var self = this.self, item = this.item;
        // if (!self.hoverParam.isActive) {
        //     self.hoverItem(item);
        // }

    },
    //nodes mouseleave
    mouseleaveNode: function (e) {
        // var self = this.self, item = this.item;
        // if (!self.hoverParam.isActive) {
        //     self.celHoverItem(item);
        // }
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
        var opt = self.opt, links = self.links;
        var sourceList = [], targetList = [];
        var temId = item.id;
        var isRoot = true;
        $.each(links, function () {
            if (this.startId === item.id) {
                sourceList.push(this);
            }
            if (this.endId === item.id) {
                targetList.push(this);
            }
        });


        return {
            sourceList: sourceList,
            targetList: targetList
        }
    },
    getPathLinks: function (item) {
        var self = this;
        var opt = self.opt, links = self.links;
        var list = [];
        var temId = item.id;
        var isRoot = true;
        while (isRoot) {
            $.each(links, function () {
                if (this.startId === temId) {
                    list.push(this);
                    if (opt.data.id === this.endId) {
                        isRoot = false;
                    } else {
                        temId = this.endId;
                    }
                }

            });
        }

        return list
    },
    nodeMouseMove: function (self, e) {
        var drag = self.dragNode;
        drag.isMove = true;
        var scale = self.scale;
        var item = drag.item;
        var moveX = (e.pageX - drag.x1) * (1 / scale);
        var moveY = (e.pageY - drag.y1) * (1 / scale);
        //node
        var t = 0;
        if (item.isRoot) {
            t = item.w / 2;
        }
        item.x = drag.x + moveX + t;
        item.y = drag.y + moveY;
        item.g.translate(item.x - t, item.y);
        //line
        var linksNodes = self.getLinkNodes(item);
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {

            var source = self.topNodeMap[this.startId] || self.otherMap[this.startId];
            var target = self.topNodeMap[this.endId] || self.otherMap[this.endId];
            var x = source.x + source.offsetX;
            var y = source.y + source.offsetY;
            var x1 = target.x + target.offsetX;
            var y1 =  target.y;
            this.line.plot(source.x + source.offsetX, source.y + source.offsetY, target.x + target.offsetX, target.y);
            this.textNode.x(x+(x1-x)/2).y(y+(y1-y)/2);
        });

        return false;
    },
    renderLink: function (item) {
        var self = this;
        var g = self.line_g.group().addClass(item.isMax ? "node-link-max" : "node-link");
        item.g = g;
        var source = this.topNodeMap[item.startId] || this.otherMap[item.startId];
        var target = this.topNodeMap[item.endId] || this.otherMap[item.endId];

        var x = source.x + source.offsetX;
        var y = source.y + source.offsetY;
        var x1 = target.x + target.offsetX;
        var y1 =  target.y;

        var line = g.line(x, y, x1, y1).attr("data-id", source.x);
        item.line = line;



        var text = g.text(item.text).x(x+(x1-x)/2).y(y+(y1-y)/2);
        item.textNode = text;
        if (item.isMax) {
            line.marker("end", self.draw.defs().select("#arrowMax").first());
        } else {
            line.marker("end", this.draw.defs().select("#arrow").first());
        }


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
    scaleMap: function(scale){
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
        //this.opt.nodes = JSON.parse(JSON.stringify(this._nodes));
        // this.opt.links = JSON.parse(JSON.stringify(this._links));
        this.scale = 1;
        // this.root.scale(1);
        this.init();
    }
});

