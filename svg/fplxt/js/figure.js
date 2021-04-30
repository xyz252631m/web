//v:2.1.0
function Figure(SVG, option) {
    var defs = {
        $box: null,
        draw: null,
        nodes: [],
        links: [],
        //是否可以缩放
        isScale: false,
        //一级节点和根节点之间的距离
        oneLevelSpace: 500,
        //二级节点和一级节点之间的距离
        twoLevelSpace: 300,
        // //根节点圆大小
        // rootLevelCircle: 67,
        // //一级节点圆大小
        // oneLevelCircle: 42,
        // //二级节点圆大小
        // twoLevelCircle: 26,
        //节点点击事件
        nodeClick: null,
        celNodeClick: null,
        //进入根节点事件
        enterRoot: null,
        //离开根节点事件
        leaveRoot: null,
        //进入子节点事件
        enter: null,
        //离开子节点事件
        leave: null,
        anTime: 300
    };
    var opt = this.opt = $.extend(defs, option);

    var box_dom = opt.$box[0];
    this.width = box_dom.offsetWidth;
    this.height = box_dom.offsetHeight;
    this.hw = this.width / 2;
    this.hh = this.height / 2;
    //类型map
    this.typeMap = {};
    //node id map
    this.nodeMap = {};
    //内部node id map
    this._nodeMap = {};
    //内部类型
    this._map = {
        //根节点
        root: null,
        //一级 流入
        level1_in: [],
        //一级 流出
        level1_out: [],
        //流入
        level2_in: [],
        //流出
        level2_out: []
    };
    var tem = this.conventData(opt.nodes, opt.links);

    //名称向上偏移量
    this.nameTextY = -16;
    this._nodes = tem.nodes;
    this._links = tem.links;

    this.rootItem = tem.root;
    //中心点
    this.center = [0, 0];
    this.$box = opt.$box;
    this.center[0] = Math.floor(this.$box.width() / 2);
    this.center[1] = Math.floor(this.$box.height() / 2);
    this.draw = SVG(opt.$box.find("svg")[0]);
    this.root = this.draw.group();
    //是否为信息面板里的事件
    this.infoPanelEvent = false;
    this.init();
    // this.renderCenter(this.rootItem);
    var self = this;
    // SVG.on(window, 'resize.svg', this.resize, this);
    var isDown = false, x1, y1, x, y, isMove = false;
    //双击事件时间记录
    var t1 = 0, t2 = 0;
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
    $(window)
        .on("mousemove.relation", function (e) {
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
                    if (t1) {
                        clearTimeout(t1);
                        t1 = 0;
                        opt.nodeDbClick && opt.nodeDbClick.call(self, self.dragNode.item);
                    } else {
                        t1 = setTimeout(function () {
                            opt.nodeClick && opt.nodeClick.call(self, self.dragNode.item);
                            t1 = 0;
                        }, 300);
                    }
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
        item: null
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

    this.scale = 1;

    // 缩放事件
    function drag(e) {
        var direct = null;
        var scale = this.scale;
        if (e.wheelDelta) {
            direct = e.wheelDelta;
        } else {
            direct = -e.detail * 40;
        }
        var isUp = direct > 0;
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
        if (hypotenuse === 0) {
            return 0;
        }
        var cos = x / hypotenuse;
        var radian = Math.acos(cos);//求出弧度
        var angle = radian * 180 / Math.PI;//用弧度算出角度
        if (y < 0) {
            angle = -angle;
        } else if ((y === 0) && (x < 0)) {
            angle = 180;
        }
        return angle;
    }
};

$.extend(Figure.prototype, {
    init: function () {
        var self = this;
        this.linksStyle();
        //legend by type
        this.typeMap = {};
        this.linkTypeMap = {};
        var opt = this.opt;
        var _map = this._map;
        this.createGroup();
        this.calcItemPos();

        this.renderLegend(this._nodes, this._links);
        //渲染node
        this.renderRootItem(_map.root);
        //渲染 连接线
        $.each(this._links, function () {
            self.renderLink(this);
        });

        _map.level1_in.forEach(function (d) {
            self.renderNode(d, self.leftNodeGroup, 1);
            d.in.concat(d.out).forEach(function (p) {
                self.renderNode(p, self.leftNodeGroup, 2);
            })
        })

        _map.level1_out.forEach(function (d) {
            self.renderNode(d, self.rightNodeGroup, 1);
            d.in.concat(d.out).forEach(function (p) {
                self.renderNode(p, self.rightNodeGroup, 2);
            })
        })
    },
    renderRootItem: function (item) {
        var self = this;
        var g = this.root.group();
        item.g = g;
        var r = 67;
        item.r = r;
        var bg = this.typeMap[item.data.typeId].color;
        var circle = g.circle(r).fill(bg);
        circle.stroke({color: bg, width: 3, opacity: .6})
        var text = g.text((item.name || item.properties.name) + '').font({size: 12}).fill("#333").x(r / 2).y(self.nameTextY);
        text.attr("text-anchor", "middle");
        g.transform({x: item.x - r / 2, y: item.y - r / 2});
        g.on("mousedown", this.mousedown, {self: self, item: item});
        g.on("mouseenter", this.mouseenterNode, {self: self, item: item});
        g.on("mouseleave", this.mouseleaveNode, {self: self, item: item});
    },
    createGroup: function () {
        this.leftGroup = this.root.group();
        this.leftLinkGroup = this.leftGroup.group();
        this.leftNodeGroup = this.leftGroup.group();
        this.rightGroup = this.root.group();
        this.rightLinkGroup = this.rightGroup.group();
        this.rightNodeGroup = this.rightGroup.group();
    },
    //处理数据
    conventData: function (nodes, links) {
        var self = this;
        this.nodeMap = {};
        var map = this.nodeMap;
        var _map = this._map;
        var _nodeMap = this._nodeMap
        var _nodes = [], _links = [], root = null;
        nodes.forEach(function (d, i) {
            var tem = {
                id: d.id + "_" + i,
                x: 0,
                y: 0,
                in: [],
                out: [],
                //位置 left or right
                pos: "",
                //圆大小，直径
                r: 26,
                name: d.name || d.properties.name,
                data: d,
                typeId: d.typeId
            }
            if (d.isRoot) {
                tem.r = 67;
                root = tem;
                _map.root = tem;
            }
            map[d.id] = tem;
            _nodeMap[tem.id] = tem;
            _nodes.push(tem);
        });
        var typeEqualLinks = [];
        links.forEach(function (d, i) {
            var tem = {
                id: d.id + "_" + i,
                source: map[d.source],
                target: map[d.target],
                typeId: d.typeId,
                data: d,
                level: 1
            }

            if (d.source === root.data.id) {
                //1 out
                tem.target.r = 42;
                if (self.opt.isTypeEqual.call(self, tem.target)) {
                    typeEqualLinks.push(tem);
                } else {
                    tem.target.pos = "right";
                    root.out.push(tem.target);
                    _map.level1_out.push(tem.target);
                }
            } else if (d.target === root.data.id) {
                //1 in
                tem.source.r = 42;
                if (self.opt.isTypeEqual.call(self, tem.source)) {
                    typeEqualLinks.push(tem);
                } else {
                    tem.source.pos = "left";
                    root.in.push(tem.source);
                    _map.level1_in.push(tem.source);
                }
            } else {
                //2
                tem.level = 2;
                tem.target.in.push(tem.source);
                tem.source.out.push(tem.target);
            }
            _links.push(tem);
        });

        //团伙节点 -- 比较左右两侧一级节点数，添加到少的一侧
        var isEqualRight = false
        if (_map.level1_out.length <= _map.level1_in.length) {
            isEqualRight = true;
        }
        typeEqualLinks.forEach(function (d) {
            if (isEqualRight) {
                if (d.target === _map.root) {
                    var tem = d.target;
                    d.target = d.source;
                    d.source = tem;
                }
                d.target.pos = "right";
                root.out.push(d.target);
                _map.level1_out.push(d.target);
            } else {
                if (d.target === _map.root) {
                    var tem = d.target;
                    d.target = d.source;
                    d.source = tem;
                }
                d.target.pos = "left";
                root.in.push(d.target);
                _map.level1_in.push(d.target);
            }
        })

        return {
            root: root,
            nodes: _nodes,
            links: _links
        }
    },
    //计算位置
    calcItemPos: function () {
        var self = this;
        var nodes = this._nodes;
        var _links = this._links;
        var _map = this._map;
        var root = this.rootItem;
        var hw = this.hw, hh = this.hh;
        //x
        root.x = hw;
        root.y = hh;
        var itemH = 60;
        var space1 = this.opt.oneLevelSpace;
        var space2 = this.opt.twoLevelSpace;

        function getH(item, list) {
            var frist = list[0];
            var last = list[list.length - 1];
            var centerY = frist.y + (last.y - frist.y) / 2;
            // item.vLineH = last.y - frist.y;
            item.centerY = centerY;
        }

        var nodeMap = this._nodeMap;

        function calc(leftList, centerList, rigthList, itemH) {
            leftList.forEach(function (d, i) {
                d.h = itemH;
                if (i) {
                    d.y = leftList[i - 1].y + itemH + (d.space || 0);
                } else {
                    d.y = 0;
                }
            });
            centerList.forEach(function (d, i) {
                d.h = itemH;
                if (i) {
                    d.y = centerList[i - 1].y + itemH + (d.space || 0);
                } else {
                    d.y = 0;
                }
                if (d.in.length) {
                    getH(d, d.in);
                    d.y = d.centerY;
                }
                if (d.out.length) {
                    orderRightList(d.y, d.out)
                }
            });

            function orderRightList(y, list) {
                var half = (list.length * itemH - itemH) / 2;
                list.forEach(function (d, i) {
                    d.y = y + i * itemH - half;
                })
            }

            var hasRepeat = true;
            var count = 1;
            var moveCenterItem = function (centerItem, t) {
                centerItem.y += t;
                centerItem.in.forEach(function (d) {
                    d.y += t;
                })
                centerItem.out.forEach(function (d) {
                    d.y += t;
                })
            };

            while (hasRepeat && count < 10) {
                hasRepeat = false;
                count++;
                centerList.forEach(function (d, i) {
                    if (i) {
                        var num = d.y - centerList[i - 1].y;
                        if (num < itemH) {
                            hasRepeat = true;
                            var t = itemH - num;
                            moveCenterItem(d, t);
                        }
                    }
                });
                rigthList.forEach(function (d, i) {
                    if (i) {
                        var num = d.y - rigthList[i - 1].y;
                        if (num < itemH) {
                            hasRepeat = true;
                            var t = itemH - num + d.space;
                            moveCenterItem(nodeMap[d.centerId], t);
                        }
                    }
                })
            }

            //美化节点 -- 均等分高度
            var r_len = centerList.length;
            centerList.forEach(function (d, i) {
                if (i) {
                    if (i < r_len - 1) {
                        var nextOpen = centerList[i + 1].in.length || centerList[i + 1].out.length;
                        var currOpen = d.in.length && d.out.length;
                        if (!currOpen && nextOpen) {
                            var tem_idx = i;
                            var temList = [];
                            while (tem_idx >= 0) {
                                if (!centerList[tem_idx].in.length && !centerList[tem_idx].out.length) {
                                    temList.unshift(centerList[tem_idx]);
                                } else {
                                    break;
                                }
                                tem_idx--;
                            }
                            if (temList.length) {
                                var upItem = centerList[i - temList.length];
                                var downItem = centerList[i + 1];
                                if (upItem) {
                                    var num = (downItem.y - upItem.y) / (temList.length + 1);
                                    temList.forEach(function (tem, tem_i) {
                                        tem.y = upItem.y + num * (tem_i + 1);
                                    })
                                }
                            }
                        }
                    }
                }
            });
        }

        var space = 10;

        var left_in = [], left_out = [];
        _map.level1_in.forEach(function (d) {
            d.x = hw - space1;
            //d.space = space;
            d.in.forEach(function (p, i) {
                p.x = d.x - space2;
                if (i === 0) {
                    if (left_in.length) {
                        p.space = space;
                    }
                }
                left_in.push(p);
            })
            d.out.forEach(function (p, i) {
                p.x = d.x + space2;
                p.centerId = d.id;
                if (i === 0) {
                    if (left_out.length) {
                        p.space = space;
                    }
                }
                left_out.push(p);
            })
        })
        calc(left_in, _map.level1_in, left_out, itemH);
        //居中
        var l_frist = _map.level1_in[0];
        var l_last = _map.level1_in[_map.level1_in.length - 1];
        var l_centerY = l_frist.y + (l_last.y + l_last.h - l_frist.y) / 2;
        //减掉字体距离
        var lc = -(l_centerY - this.hh) - self.nameTextY;
        _map.level1_in.forEach(function (d) {
            d.y += lc;
            d.in.concat(d.out).forEach(function (p) {
                p.y += lc;
            })
        })
        //
        var right_in = [], right_out = [];
        _map.level1_out.forEach(function (d) {
            d.x = hw + space1;
            d.in.forEach(function (p, i) {
                p.x = d.x - space2;
                if (i === 0) {
                    if (right_in.length) {
                        p.space = space;
                    }
                }
                right_in.push(p);
            })
            d.out.forEach(function (p, i) {
                p.x = d.x + space2;
                p.centerId = d.id;
                if (i === 0) {
                    if (right_out.length) {
                        p.space = space;
                    }
                }
                right_out.push(p);
            })
        })
        calc(right_in, _map.level1_out, right_out, itemH);
        //居中
        var r_frist = _map.level1_out[0];
        var r_last = _map.level1_out[_map.level1_out.length - 1];
        var r_centerY = r_frist.y + (r_last.y + r_last.h - r_frist.y) / 2;
        //减掉字体距离
        var rc = -(r_centerY - this.hh) + self.nameTextY;
        _map.level1_out.forEach(function (d) {
            d.y += rc;
            d.in.concat(d.out).forEach(function (p) {
                p.y += rc;
            })
        })
    },

    linksStyle: function () {
        this.linksStyleMap = {};
        var self = this;
        this.opt.linksStyle.forEach(function (d) {
            self.linksStyleMap[d.typeId] = d;
        })
    },
    //渲染图例
    renderLegend: function (nodes, links) {
        var self = this;
        var $ul = $(".legend-box");
        var typeMap = this.typeMap, typeList = [], equalTypeList = [];
        //类型
        nodes.forEach(function (p) {
            var d = p.data;
            if (!typeMap[d.typeId]) {
                typeMap[d.typeId] = {
                    typeId: d.typeId,
                    typeName: d.typeName,
                    color: self.opt.nodeColorByTypeId(d.typeId, d),
                    list: []
                };
                typeList.push(typeMap[d.typeId]);
            }
            typeMap[d.typeId].list.push(p);
        });

        var linksStyleMap = this.linksStyleMap;
        var linkTypeMap = this.linkTypeMap;
        //线
        links.forEach(function (p) {
            var d = p.data;
            var t = d.typeId;
            var style = linkTypeMap[t] || {};
            if (!linkTypeMap[t]) {
                linkTypeMap[t] = {
                    typeId: t,
                    name: style.name || "",
                    list: []
                };
            }
            linkTypeMap[t].list.push(p);
        });

        var h = [];
        typeList.forEach(function (d) {
            if (!self.opt.isTypeEqual(d)) {
                h.push('<li data-type-id="' + d.typeId + '"><i class="i-icon" data-color="' + d.color + '" style="background-color: ' + d.color + '"></i><span>' + d.typeName + '</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
            }
        })

        var isOne = true;
        self.opt.linksStyle.forEach(function (d) {
            if (d.legendShow && linkTypeMap[d.typeId] && linkTypeMap[d.typeId].list.length) {
                if (isOne) {
                    h.push('<li class="li-line"></li>');
                    isOne = false;
                }
                h.push('<li data-type-id="' + d.typeId + '" class="li-two-type ' + ("li_" + d.cls) + '"><i class="i-icon"></i><span>' + d.name + '</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
            }
        });

        $ul.html(h.join(""));

        //图例点击事件
        $ul.off("click");
        $ul.on("click", "li", function () {
            var cls = "active", tcls = "li-two-type";
            var $el = $(this);
            if ($el.hasClass(cls)) {
                $el.removeClass(cls);
            } else {
                //公司 or 个人
                if ($el.hasClass(tcls)) {
                    $ul.find("li").not("." + tcls).removeClass(cls);
                } else {
                    $ul.find("." + tcls).removeClass(cls);
                }
                $el.addClass(cls);
            }

            //是否存在激活项
            if ($ul.find(".active").length === 0) {
                $ul.removeClass("legend-box-dis");
                self.opt.$box.removeClass("svg-node-legend");
                $ul.find("li").each(function () {
                    var $ti = $(this).find(".i-icon");
                    $ti.css("background-color", $ti.attr("data-color"));
                })
            } else {
                $ul.addClass("legend-box-dis");
                self.opt.$box.addClass("svg-node-legend");
                var typeIdList = [], linkTypeIdList = [];
                $ul.find("li").each(function () {
                    var $li = $(this);
                    var $ti = $li.find(".i-icon");
                    if ($li.hasClass(cls)) {
                        if ($li.hasClass(tcls)) {
                            linkTypeIdList.push($li.attr("data-type-id"))
                        } else {
                            typeIdList.push($li.attr("data-type-id"))
                            $ti.css("background-color", $ti.attr("data-color"));
                        }
                    } else {
                        $ti.css("background-color", "");
                    }
                })
                self.hoverItemByType(typeIdList, linkTypeIdList);
            }
        })
        $ul.on("click", ".i-btn-colse", function () {
            $ul.find("li").removeClass('active');
            $ul.removeClass("legend-box-dis");
            self.opt.$box.removeClass("svg-node-legend");
            $ul.find("li").each(function () {
                var $ti = $(this).find(".i-icon");
                $ti.css("background-color", $ti.attr("data-color"));
            })
            return false;
        })
    },


    hoverItemByType: function (typeIdList, linkTypeIdList) {
        var typeMap = this.typeMap;
        var linkTypeMap = this.linkTypeMap;
        for (var key in linkTypeMap) {
            if (linkTypeMap.hasOwnProperty(key)) {
                linkTypeMap[key].list.forEach(function (d) {
                    d.g.removeClass("link-show")
                })
            }
        }
        for (var key in typeMap) {
            if (typeMap.hasOwnProperty(key)) {
                typeMap[key].list.forEach(function (d) {
                    d.g.removeClass("node-show");
                })
            }
        }
        if (typeIdList.length) {
            typeIdList.forEach(function (p) {
                typeMap[p].list.forEach(function (d) {
                    d.g.addClass("node-show")
                })
            })
        }
        if (linkTypeIdList.length) {
            linkTypeIdList.forEach(function (p) {
                linkTypeMap[p].list.forEach(function (d) {
                    d.g.addClass("link-show")
                    d.source.g.addClass("node-show");
                    d.target.g.addClass("node-show");
                })
            })
        }
    },


    renderNode: function (item, nodeGroup, level) {
        var self = this;
        var r = item.r;
        var g = nodeGroup.group().addClass("node-company");
        item.g = g;
        var bg = this.typeMap[item.data.typeId].color;
        var circle = g.circle(r).fill(bg);
        circle.stroke({color: bg, width: 3, opacity: .6})
        var text = g.text((item.name || item.properties.name) + '').font({size: 12}).fill("#333").x(r / 2).y(self.nameTextY);
        text.attr("data-id", item.data.id).attr("text-anchor", "middle");
        g.transform({x: item.x - r / 2, y: item.y - r / 2});
        if (item.isRoot) {
            g.addClass("root-node")
            rect.addClass("root-rect");
            rect.stroke({color: bg, opacity: 1, width: 5});
        }
        g.on("mousedown", this.mousedown, {self: self, item: item});
        g.on("mouseenter", this.mouseenterNode, {self: self, item: item});
        g.on("mouseleave", this.mouseleaveNode, {self: self, item: item});
    },
    renderLink: function (item) {
        var self = this;
        var cls = "node-link-company";
        var group = this.rightLinkGroup;
        var pos = item.source.pos || item.target.pos;
        if (pos === "left") {
            group = this.leftLinkGroup;
        }

        var g = group.group().addClass(cls);
        item.g = g;

        var points = self.convertStartEndPoint(item.source, item.target);
        var x = item.source.x;
        var y = item.source.y;
        var x1 = item.target.x;
        var y1 = item.target.y;
        var ty = 0;
        var line = g.line(points.x, points.y, points.x1, points.y1).attr("data-id", item.source.x);
        var deg = tool.getAngle(x, y, x1, y1);
        item.line = line;
        var txt = self.opt.lineText(item.data) || "";
        var textColor = self.opt.lineTextColor(txt, item);
        if (deg > 90 && deg < 270) {
            deg -= 180;
        }
        if (deg > -270 && deg < -90) {
            deg += 180;
        }
        var offsetX = 0, offsetY = 0, textOffset = self.opt.textOffset;
        if (item.level === 1) {
            var _deg = 0;
            if (item.source === self._map.root) {
                _deg = tool.getAngle(item.source.x, item.source.y, item.target.x, item.target.y);
            } else {
                _deg = tool.getAngle(item.target.x, item.target.y, item.source.x, item.source.y);
            }
            offsetX = -Math.cos((_deg) * Math.PI / 180) * textOffset;
            offsetY = -Math.sin((_deg) * Math.PI / 180) * textOffset;
        }
        var text = g.text(txt).x(x + offsetX + (x1 - x) / 2).y(y + offsetY + (y1 - y) / 2 - 6).rotate(deg);
        if (textColor) {
            text.addClass('cus-text-color').style({fill: textColor});
        }
        item.textNode = text;
        var arrow_marker;
        var hasArrow = true;
        var styleCls = "node-link-02";
        var linkStyle = self.linksStyleMap[item.typeId];
        if (linkStyle) {
            hasArrow = linkStyle.arrow;
            styleCls = linkStyle.cls;
        }
        g.addClass(styleCls)
        if (hasArrow) {
            arrow_marker = this.draw.defs().select("#arrowCompany").first();
            line.marker("end", arrow_marker);
        }
        item.hasArrow = hasArrow;
        g.on("click", this.linkClick, {self: self, item: item});
    },
    linkClick: function (e) {
        var self = this.self, item = this.item;
        var opt = self.opt;
        opt.lineClick && opt.lineClick.call(self, item);
    },
    //获取一级文字，偏移x,y距离
    getOneLevelOffsetX: function (link) {

    },
    //转换坐标点
    convertStartEndPoint: function (source, target) {
        var obj = {
            x: source.x,
            y: source.y,
            x1: target.x,
            y1: target.y
        }

        var h2 = 17;
        var x2 = target.r / 2;
        var deg = tool.getAngle(obj.x, obj.y, obj.x1, obj.y1);

        obj.x1 -= Math.cos((deg) * Math.PI / 180) * x2;
        obj.y1 -= Math.sin((deg) * Math.PI / 180) * x2;
        return obj
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
        e.stopPropagation();
    },
    //高亮
    hoverItem: function (item) {
        var self = this;
        var linksNodes = self.getLinkNodes(item);
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {
            this.source.g.addClass("node-company-hover");
            this.target.g.addClass("node-company-hover");
            if (this.hasArrow) {
                this.g.addClass("node-link-company-hover");
                this.line.marker("end", self.draw.defs().select("#arrowCompanyHover").first());
            } else {
                this.g.addClass("node-link-person-hover");
            }
        });
    },
    //取消高亮
    celHoverItem: function (item) {
        var self = this;
        var linksNodes = self.getLinkNodes(item);
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {
            this.source.g.removeClass("node-company-hover");
            this.target.g.removeClass("node-company-hover");
            if (this.hasArrow) {
                this.g.removeClass("node-link-company-hover");
                this.line.marker("end", self.draw.defs().select("#arrowCompany").first());
            } else {
                this.g.removeClass("node-link-person-hover");
            }
        });
    },
    //nodes mouseenter
    mouseenterNode: function () {
        var self = this.self, item = this.item;
        if (!self.hoverParam.isActive) {
            self.hoverItem(item);
        }

    },
    //nodes mouseleave
    mouseleaveNode: function () {
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
        var opt = self.opt, links = this._links;
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
        var r = (item.r || 0) / 2;
        item.x = drag.x + moveX + r;
        item.y = drag.y + moveY + r;
        item.g.translate(item.x - r, item.y - r);
        //line
        var linksNodes = self.getLinkNodes(item);
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {
            var points = self.convertStartEndPoint(this.source, this.target);
            var x = this.source.x;
            var y = this.source.y;
            var x1 = this.target.x;
            var y1 = this.target.y;
            var ty = 0;
            this.line.plot(points.x, points.y, points.x1, points.y1);
            var pos = this.source.pos || this.target.pos;

            var deg = tool.getAngle(x, y, x1, y1);

            if (deg > 90 && deg < 270) {
                deg -= 180;
            }
            if (deg > -270 && deg < -90) {
                deg += 180;
            }

            var offsetX = 0, offsetY = 0, textOffset = self.opt.textOffset;
            if (this.level === 1) {
                var _deg = 0;
                if (this.source === self._map.root) {
                    _deg = tool.getAngle(this.source.x, this.source.y, this.target.x, this.target.y);
                } else {
                    _deg = tool.getAngle(this.target.x, this.target.y, this.source.x, this.source.y);
                }

                offsetX = -Math.cos((_deg) * Math.PI / 180) * textOffset;
                offsetY = -Math.sin((_deg) * Math.PI / 180) * textOffset;
                //
            }
            this.textNode.rotate(0).x(x + offsetX + (x1 - x) / 2).y(y + offsetY + (y1 - y) / 2 - 6).rotate(deg);
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
        var $li = $(".legend-box .active");
        if ($li.length) {
            $li.trigger("click");
        }

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

