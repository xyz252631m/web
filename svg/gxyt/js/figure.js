//v2.1.0 图形为矩形
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
        this.up_line = this.root.group();
        this.up_node = this.root.group();


        this.renderLegend(opt.nodes);

        //渲染node
        $.each(opt.nodes, function () {
            self.renderNode(this);
        });
        this.linksNumber(opt.links);
        //渲染 连接线
        $.each(opt.links, function () {
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
        //预置两种类型
        typeMap["company"] = {
            typeId: "company",
            typeName: "公司",
            color: "",
            list: []
        }
        typeMap["person"] = {
            typeId: "person",
            typeName: "个人",
            color: "",
            list: []
        }
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
            typeMap[d.nodeType].list.push(d);
        });

        var h = [];
        typeList.forEach(function (d) {
            h.push('<li data-type-id="' + d.typeId + '"><i class="i-icon" data-color="' + d.color + '" style="background-color: ' + d.color + '"></i><span>' + d.typeName + '</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
        })
        //其他类型
        h.push('<li class="li-line"></li>')
        h.push('<li class="li-two-type li-person" data-type-id="person"><i class="i-icon"></i><span>个人</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
        h.push('<li class="li-two-type li-company" data-type-id="company"><i class="i-icon"></i><span>公司</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
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
        var typeMap = this.typeMap, links = this.opt.links, nodes = this.opt.nodes;
        var showLinks = [], hasPersonType = false, personLine = [];
        //显示连接线到根节点
        var types = this.opt.allLinkType || [], isPerson = false;
        // person类型  和 typeId类型互斥
        if (typeIdList.indexOf("person") >= 0) {
            isPerson = true;
        }
        var tem = nodes.filter(function (d) {
            return d.isRoot;
        });
        for (var key in typeMap) {
            if (typeMap.hasOwnProperty(key)) {
                typeMap[key].list.forEach(function (d) {
                    d.g.removeClass("node-show");
                    d.legendShow = false;
                })
            }
        }
        typeIdList.forEach(function (d) {
            if (isPerson) {
                if (d === "person") {
                    hasPersonType = true;
                }
            } else {
                if (types.indexOf(d) >= 0) {
                    hasPersonType = true;
                }
            }
            typeMap[d].list.forEach(function (d) {
                d.g.addClass("node-show")
                d.legendShow = true;
                tem.push(d);
            })
        })


        //links
        links.forEach(function (d) {
            if (tem.indexOf(d.source) >= 0 && tem.indexOf(d.target) >= 0) {
                showLinks.push(d);
                d.g.addClass("node-link-" + d.source.nodeType + "-active");
            } else {
                d.g.removeClass("node-link-" + d.source.nodeType + "-active")
            }
            // person类型  和 typeId类型互斥
            if (hasPersonType) {
                if (isPerson) {
                    if (d.source.nodeType === "person") {
                        personLine.push(d);
                    }
                } else {
                    if (types.indexOf(d.source.typeId) >= 0&&typeIdList.indexOf(d.source.typeId) >= 0) {
                        personLine.push(d);
                    }
                }
            }
        })
        //个人连线
        var temPersonLines = [];
        if (personLine.length) {
            personLine.forEach(function (d) {
                temPersonLines.push([d.source, d.target])
            })
            temPersonLines.forEach(function (list) {
                while (!list[list.length - 1].isRoot) {
                    var item = links.find(function (d) {
                        return d.source === list[list.length - 1]
                    });
                    if (item) {
                        if (list.indexOf(item) >= 0) {
                            break;
                        } else {
                            list.push(item.target);
                        }
                    } else {
                        break;
                    }
                }
            })
            var p_lists = [];
            temPersonLines.forEach(function (list) {
                if (list[list.length - 1].isRoot) {
                    list.forEach(function (d, i) {
                        if (i) {
                            links.forEach(function (p) {
                                if (p.source === list[i - 1] && p.target === d) {
                                    p_lists.push(p);
                                }
                            })
                        }
                    })
                }
            });
            p_lists.forEach(function (d) {
                d.target.g.addClass("node-show");
                d.g.addClass("node-link-" + d.source.nodeType + "-active");
            })
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
        var g = self.up_node.group().addClass("node-" + item.nodeType);
        item.g = g;
        var bg = self.opt.nodeColorByTypeId(item.typeId, item);
        var list;
        var text;
        if (item.nodeType === "person") {
            g.transform({x: item.x - 33.5, y: item.y - 33.5});
            var circle = g.circle(67);
            circle.radius(22.5);
            circle.fill(bg);
            list = tool.getStrList(item.name || item.properties.name);
            text = g.text(list[0] + '').font({size: 12}).fill("#333").x(10).y(11);
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

        } else {
            var rect = g.rect(150, 50);
            rect.rx(5).ry(5).fill(bg);

            var icon = this.draw.defs().select("#companyIcon").first();
            icon.width(20).height(20).fill("#fff");
            var icon_g = g.group().x(-48).y(14).use(icon);
            list = tool.getStrTwoList(item.name || item.properties.name);
            text = g.text(list[0] + '').font({size: 12}).fill("#333").x(10).y(11);
            if (list.length === 1) {
                text.x(35).y(18)
            } else {
                text.x(35).y(11);
                text.build(true);
                text.tspan(list[1] + '').x(35).dy(15);
                text.build(false);
            }


            var text_box = text.rbox();
            item.bor_rect_w = text_box.width + 35 + 12;


            rect.width(item.bor_rect_w);
            g.transform({x: item.x - item.bor_rect_w / 2, y: item.y - 25});
            if (item.isRoot) {
                g.addClass("root-node")
                rect.addClass("root-rect");
                rect.stroke({color: bg, opacity: 1, width: 5});
            }
            // var text = status_g.text(item.properties.status).font({size: 12}).fill("#333").x(5).dy(0);

            var status_g = g.group().addClass("node-status");
            status_g.transform({x: item.bor_rect_w - 15, y: -10})
            var rect_s = status_g.rect(100, 22);
            var b_color = self.opt.statusColor(item);
            rect_s.rx(5).ry(5).fill(b_color);
            var s_text = status_g.text(item.properties.status).font({size: 12}).fill("#333").x(5).dy(0);
            var s_text_box = s_text.rbox();
            item.status_w = s_text_box.width + 10;
            rect_s.width(item.status_w);
        }

        g.on("mousedown", this.mousedown, {self: self, item: item});
        g.on("mouseenter", this.mouseenterNode, {self: self, item: item});
        g.on("mouseleave", this.mouseleaveNode, {self: self, item: item});
    },
    renderLink: function (item) {
        var self = this;
        var g = self.up_line.group().addClass("node-link-" + item.source.nodeType);
        item.g = g;

        var points = self.convertStartEndPoint(item.source, item.target);
        var x = item.source.x;
        var y = item.source.y;
        var x1 = item.target.x;
        var y1 = item.target.y;
        var ty = 0;
        var line = g.line(points.x, points.y, points.x1, points.y1).attr("data-id", item.source.x);
        var space = 26;

        if (item.ox_size === 1) {

        } else {
            var flag = 1;
            if (item.ox_size % 2 === 0) {
                space = 14;
                //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                flag = item.ox_index % 2 === 0 ? -1 : 1;
                ty = flag * space * Math.floor(item.ox_index / 2) + (flag * space * 0.5);
            } else {
                //0 0, 1 -7 , 2 7,
                //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                if (item.ox_index > 0) {
                    flag = (item.ox_index - 1) % 2 === 0 ? -1 : 1;
                    ty = flag * space * Math.floor((item.ox_index - 1) / 2) + (flag * space * 0.5);
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
        var textColor = self.opt.lineTextColor(txt, item);
        var text = g.text(txt).x(x + _x + (x1 - x) / 2).y(y - _y + (y1 - y) / 2 - 6).rotate(deg);

        if (textColor) {
            text.fill(textColor);
        }

        item.textNode = text;

        var arrow_marker;
        if (item.source.nodeType === "person") {
            arrow_marker = this.draw.defs().select("#arrowPerson").first();
        } else {
            arrow_marker = this.draw.defs().select("#arrowCompany").first();
        }
        line.marker("end", arrow_marker);
    },
    //转换坐标点
    convertStartEndPoint: function (source, target) {
        var obj = {
            x: source.x,
            y: source.y,
            x1: target.x,
            y1: target.y
        }

        if (target.nodeType === "company") {
            var x2 = target.bor_rect_w / 2;
            var deg = tool.getAngle(obj.x, obj.y, obj.x1, obj.y1);
            var tem = 25 / Math.tan((180 - deg) * Math.PI / 180);
            if (-x2 < tem && tem < x2) {
                if (deg < -90) {
                    obj.x1 -= tem;
                    obj.y1 += 25;
                } else {
                    if (deg < 0) {
                        obj.x1 -= tem;
                    } else {
                        obj.x1 += tem;
                    }
                    if (deg < 0) {
                        obj.y1 += 25;
                    } else {
                        obj.y1 -= 25;
                    }
                }
            } else {
                if (deg > 90 || deg < -90) {
                    obj.x1 += x2
                    obj.y1 -= Math.tan((180 - deg) * Math.PI / 180) * x2;
                } else {
                    obj.x1 -= x2
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
        if (_tem_x === 0 && _tem_y === 0) {
            return;
        }
        drag.isMove = true;
        var moveX = (e.pageX - drag.x1) * (1 / scale);
        var moveY = (e.pageY - drag.y1) * (1 / scale);
        //node
        var tx = 33.5, ty = 33.5;
        if (item.nodeType === "company") {
            tx = item.bor_rect_w / 2;
            ty = 25;
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

            if (this.ox_size === 1) {

            } else {
                var flag = 1;
                if (this.ox_size % 2 === 0) {
                    space = 14;
                    //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                    flag = this.ox_index % 2 === 0 ? -1 : 1;
                    ty = flag * space * Math.floor(this.ox_index / 2) + (flag * space * 0.5);

                } else {
                    space = 26;
                    //0 0, 1 -7 , 2 7,
                    //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                    if (this.ox_index > 0) {
                        flag = (this.ox_index - 1) % 2 === 0 ? -1 : 1;
                        ty = flag * space * Math.floor((this.ox_index - 1) / 2) + (flag * space * 0.5);

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

