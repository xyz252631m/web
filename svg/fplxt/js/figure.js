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

    this._nodes = tem.nodes;
    this._links = tem.links;

    console.log(this._map)

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
                        opt.nodeDbclick && opt.nodeDbclick.call(self, self.dragNode.item);
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
    getStrTwoList: function (str) {
        var b = 0;
        var list = [], tem = "", splitIdx = 0, splitList = [20, 18];
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) {
                b++;
            } else {
                b += 2;
            }
            tem += c;

            if (b >= (splitList[splitIdx] || 20)) {
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


        if (list.length >= 3) {
            list[2] = list[2][0] + list[2][1] + "...";
            var temList = [];
            $.each(list, function (i) {
                if (i < 2) {
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
        //legend by type
        this.typeMap = {};
        var opt = this.opt;

        var _map = this._map;

        this.createGroup();


        this.renderLegend(this._nodes);
        this.calcItemPos();

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

        // this.linksNumber(this.links);

        // this.halfGroup.y(-(r_centerY - this.hh))

    },
    renderRootItem: function (item) {
        var g = this.root.group();
        item.g = g;
        var r = 67;
        item.r = r;
        var circle = g.circle(r).fill(this.typeMap[item.data.typeId].color);
        var text = g.text((item.name || item.properties.name) + '').font({size: 12}).fill("#333").x(r / 2).y(-14);
        text.attr("text-anchor", "middle");
        g.transform({x: item.x - r / 2, y: item.y - r / 2});
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
                name: d.name || d.properties.name,
                data: d
            }
            if (d.isRoot) {
                root = tem;
                _map.root = tem;
            }
            map[d.id] = tem;
            _nodeMap[tem.id] = tem;
            _nodes.push(tem);
        });
        links.forEach(function (d, i) {
            var tem = {
                id: d.id + "_" + i,
                source: map[d.source],
                target: map[d.target],
                data: d
            }

            if (d.source === root.data.id) {
                //1 out
                tem.target.pos = "right";
                root.out.push(tem.target);
                _map.level1_out.push(tem.target);

            } else if (d.target === root.data.id) {
                //1 in
                tem.source.pos = "left";
                root.in.push(tem.source);
                _map.level1_in.push(tem.source);
                // tem.isRight = false;
            } else {
                //2
                tem.target.in.push(tem.source);
                tem.source.out.push(tem.target);
            }
            _links.push(tem);
        });

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
                            console.log(d.centerId)
                            // console.log(nodeMap[d.centerId], d, nodeMap)
                            moveCenterItem(nodeMap[d.centerId], t);
                        }
                    }
                })
            }

            //美化节点 -- 均等分高度
            //
            // console.log(234, rigthList)
        }

        var space = 10;

        var left_in = [], left_out = [];
        _map.level1_in.forEach(function (d) {
            d.x = hw - 500;
            //d.space = space;
            d.in.forEach(function (p, i) {
                p.x = d.x - 300;
                if (i === 0) {
                    if (left_in.length) {
                        p.space = space;
                    }
                }
                left_in.push(p);
            })
            d.out.forEach(function (p, i) {
                p.x = d.x + 300;
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
        //
        var right_in = [], right_out = [];
        _map.level1_out.forEach(function (d) {
            d.x = hw + 500;
            d.in.forEach(function (p, i) {
                p.x = d.x - 300;
                if (i === 0) {
                    if (right_in.length) {
                        p.space = space;
                    }
                }
                right_in.push(p);
            })
            d.out.forEach(function (p, i) {
                p.x = d.x + 300;
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
    },
    //渲染图例
    renderLegend: function (nodes) {
        var self = this;
        var $ul = $(".legend-box");
        var typeMap = this.typeMap, typeList = [], equalTypeList = [];
        //预置类型


        // typeMap["company"] = {
        //     typeId: "company",
        //     typeName: "公司",
        //     color: "",
        //     list: []
        // }
        // typeMap["person"] = {
        //     typeId: "person",
        //     typeName: "个人",
        //     color: "",
        //     list: []
        // }
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
            if (d.equalType !== undefined) {


                if (!typeMap[d.equalType]) {
                    typeMap[d.equalType] = {
                        typeId: d.equalType,
                        typeName: d.equalTypeName,
                        color: "",
                        list: []
                    };
                    equalTypeList.push(typeMap[d.equalType]);
                }
                typeMap[d.equalType].list.push(p);
            }
        });


        var h = [];
        typeList.forEach(function (d) {
            h.push('<li data-type-id="' + d.typeId + '"><i class="i-icon" data-color="' + d.color + '" style="background-color: ' + d.color + '"></i><span>' + d.typeName + '</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
        })
        //其他类型
        if (equalTypeList.length) {
            h.push('<li class="li-line"></li>')
            equalTypeList.forEach(function (d) {

                h.push('<li class="li-two-type li-company" data-type-id="' + d.typeId + '"><i class="i-icon"></i><span>' + d.typeName + '</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');

            })
        }

        // h.push('<li class="li-line"></li>')
        // h.push('<li class="li-two-type li-person" data-type-id="person"><i class="i-icon"></i><span>个人</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
        // h.push('<li class="li-two-type li-company" data-type-id="company"><i class="i-icon"></i><span>公司</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
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
                var typeIdList = [];
                $ul.find("li").each(function () {
                    var $li = $(this);
                    var $ti = $li.find(".i-icon");
                    if ($li.hasClass(cls)) {
                        typeIdList.push($li.attr("data-type-id"))
                        if ($li.hasClass(tcls)) {

                        } else {
                            $ti.css("background-color", $ti.attr("data-color"));
                        }
                    } else {
                        $ti.css("background-color", "");
                    }
                })
                self.hoverItemByType(typeIdList);
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

    hoverItemByType: function (typeIdList) {
        var typeMap = this.typeMap;
        for (var key in typeMap) {
            if (typeMap.hasOwnProperty(key)) {
                typeMap[key].list.forEach(function (d) {
                    d.g.removeClass("node-show");
                    d.legendShow = false;
                })
            }
        }
        typeIdList.forEach(function (d) {
            typeMap[d].list.forEach(function (d) {
                d.g.addClass("node-show")
                d.legendShow = true;
            })
        })
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

    //渲染根节点
    renderRoot: function (root) {
        // var group = this.rootGroup.group().attr("class", "svg-root-node");
        // rootItem.g = group;
        // var w = rootItem.name.length * 14 + 32;
        // var rect = group.rect(w, 40);
        // rootItem.x = this.hw - w / 2;
        // rootItem.y = this.hh - 20;
        // group.transform({x: rootItem.x, y: rootItem.y});
        // var text = group.text(rootItem.name);
        // text.font({
        //     size: 14
        // });
        // text.x(15);
        // text.y(12);
        // group.line(-35, 20, 0, 20).stroke({width: lineWidth, color: option.lineColor});
        // var r_w = rect.width();
        // rootItem.w = r_w;
        // maxInfo[0] = r_w / 2;
        // group.line(r_w, 20, r_w + 35, 20).stroke({width: lineWidth, color: option.lineColor});
        // this.rootRect = rect;


    },

    renderNode: function (item, nodeGroup, level) {
        var self = this;
        var r = 42;
        if (level === 1) {
            r = 42;
        } else if (level === 2) {
            r = 26;
        }
        item.r = r;
        var g = nodeGroup.group().addClass("node-" + item.nodeType);
        item.g = g;
        // var bg = self.opt.nodeColorByTypeId(item.data.typeId, item.data);
        var bg = this.typeMap[item.data.typeId].color;


        var circle = g.circle(r).fill(bg);

        // var rect = g.rect(150, 35);
        // rect.rx(5).ry(5).fill(bg);

        var text = g.text((item.name || item.properties.name) + '').font({size: 12}).fill("#333").x(r / 2).y(-14);
        text.attr("data-id", item.data.id).attr("text-anchor", "middle");
        // rect.width(item.bor_rect_w);
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

        var cls = "node-link-" + item.source.nodeType;
        //  if (item.type === "equal") {
        cls = "node-link-person";
        //   }
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
        var space = 26;

        // if (item.ox_size === 1) {
        //
        // } else {
        //     var flag = 1;
        //     if (item.ox_size % 2 === 0) {
        //         space = 14;
        //         //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
        //         flag = item.ox_index % 2 === 0 ? -1 : 1;
        //         ty = flag * space * Math.floor(item.ox_index / 2) + (flag * space * 0.5);
        //     } else {
        //         //0 0, 1 -7 , 2 7,
        //         //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
        //         if (item.ox_index > 0) {
        //             flag = (item.ox_index - 1) % 2 === 0 ? -1 : 1;
        //             ty = flag * space * Math.floor((item.ox_index - 1) / 2) + (flag * space * 0.5);
        //         }
        //     }
        // }


        var deg = tool.getAngle(x, y, x1, y1);


//        var _y = ty * (Math.sin((90 - deg) * Math.PI / 180));
        //   var _x = ty * (Math.cos((90 - deg) * Math.PI / 180));
        //  line.translate(_x, -_y);
        item.line = line;


        if (deg > 90 && deg < 270) {
            deg -= 180;
        }
        if (deg > -270 && deg < -90) {
            deg += 180;
        }

        var txt = self.opt.lineText(item.data) || "";
        var textColor = self.opt.lineTextColor(txt, item);
        var text = g.text(txt).x(x + (x1 - x) / 2).y(y + (y1 - y) / 2 - 6).rotate(deg);

        if (textColor) {
            text.fill(textColor);
        }
        item.textNode = text;
        var arrow_marker;
        if (item.type !== "equal") {
            arrow_marker = this.draw.defs().select("#arrowCompany").first();
            line.marker("end", arrow_marker);
        } else {


            // arrow_marker = this.draw.defs().select("#arrowPerson").first();
            // line.marker("end", arrow_marker);
        }


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
        if (target.nodeType === "company") {
            var x2 = target.r / 2;
            var deg = tool.getAngle(obj.x, obj.y, obj.x1, obj.y1);
            var tem = 25 / Math.tan((180 - deg) * Math.PI / 180);
            if (-x2 < tem && tem < x2) {
                if (deg < -90) {
                    obj.x1 -= tem;
                    obj.y1 += h2;
                } else {
                    if (deg < 0) {
                        obj.x1 -= tem;
                    } else {
                        obj.x1 += tem;
                    }
                    if (deg < 0) {
                        obj.y1 += h2;
                    } else {
                        obj.y1 -= h2;
                    }
                }
            } else {
                if (deg > 90 || deg < -90) {
                    obj.x1 += x2;
                    obj.y1 -= Math.tan((180 - deg) * Math.PI / 180) * x2;
                } else {
                    obj.x1 -= x2;
                    obj.y1 += Math.tan((180 - deg) * Math.PI / 180) * x2;
                }
            }
        }


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

        console.log(linksNodes)
        // item.g.addClass("node-" + item.nodeType + "-hover");
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {

            this.source.g.addClass("node-" + this.source.nodeType + "-hover");
            this.target.g.addClass("node-" + this.target.nodeType + "-hover");
            if (this.type !== "equal") {
                this.g.addClass("node-link-" + this.source.nodeType + '-hover');
                this.line.marker("end", self.draw.defs().select("#arrowCompanyHover").first());

            } else {
                this.g.addClass("node-link-person-hover");
                //    this.line.marker("end", self.draw.defs().select("#arrowPersonHover").first());

            }
        });
    },
    //取消高亮
    celHoverItem: function (item) {
        var self = this;
        var linksNodes = self.getLinkNodes(item);
        // item.g.removeClass("node-" + item.nodeType + "-hover");
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {

            this.source.g.removeClass("node-" + this.source.nodeType + "-hover");
            this.target.g.removeClass("node-" + this.target.nodeType + "-hover");
            if (this.type !== "equal") {
                this.g.removeClass("node-link-" + this.source.nodeType + '-hover');
                this.line.marker("end", self.draw.defs().select("#arrowCompany").first());

            } else {
                this.g.removeClass("node-link-person-hover");
                //  this.line.marker("end", self.draw.defs().select("#arrowPerson").first());

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
        drag.isMove = true;
        var scale = self.scale;
        var item = drag.item;
        var moveX = (e.pageX - drag.x1) * (1 / scale);
        var moveY = (e.pageY - drag.y1) * (1 / scale);
        //node
        var tx = 33.5, ty = 33.5;
        if (item.nodeType === "company") {
            tx = item.bor_rect_w / 2;
            ty = 17;
        }
        item.x = drag.x + moveX + tx;
        item.y = drag.y + moveY + ty;
        item.g.translate(item.x - tx, item.y - ty);
        //line
        var linksNodes = self.getLinkNodes(item);
        var space = 26;
        $.each(linksNodes.sourceList.concat(linksNodes.targetList), function () {
            var points = self.convertStartEndPoint(this.source, this.target);
            var x = this.source.x;
            var y = this.source.y;
            var x1 = this.target.x;
            var y1 = this.target.y;
            var ty = 0;
            this.line.plot(points.x, points.y, points.x1, points.y1);

            // if (this.ox_size === 1) {
            //
            // } else {
            //     var flag = 1;
            //     if (this.ox_size % 2 === 0) {
            //         space = 14;
            //         //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
            //         flag = this.ox_index % 2 === 0 ? -1 : 1;
            //         ty = flag * space * Math.floor(this.ox_index / 2) + (flag * space * 0.5);
            //
            //     } else {
            //         space = 26;
            //         //0 0, 1 -7 , 2 7,
            //         //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
            //         if (this.ox_index > 0) {
            //             flag = (this.ox_index - 1) % 2 === 0 ? -1 : 1;
            //             ty = flag * space * Math.floor((this.ox_index - 1) / 2) + (flag * space * 0.5);
            //
            //         }
            //     }
            // }
            var deg = tool.getAngle(x, y, x1, y1);

            // var _y = ty * (Math.sin((90 - deg) * Math.PI / 180));
            // var _x = ty * (Math.cos((90 - deg) * Math.PI / 180));
            // this.line.translate(_x, -_y);
            if (deg > 90 && deg < 270) {
                deg -= 180;
            }
            if (deg > -270 && deg < -90) {
                deg += 180;
            }

            this.textNode.rotate(0).x(x + (x1 - x) / 2).y(y + (y1 - y) / 2 - 6).rotate(deg);
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

