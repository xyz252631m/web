/*
* 修改版  连线没有规律，以节点为主要渲染对象
* */
function Figure(SVG, option) {
    var defs = {
        $box: null,
        draw: null,
        nodes: [],
        links: [],
        //是否可以缩放
        isScale: false,
        //是否显示多条线
        isMoreLine: false,
        //类型文本格式化
        legendNodeTypeFormatter: null,
        //一级节点和根节点之间的距离
        oneLevelSpace: 500,
        //二级节点和一级节点之间的距离
        twoLevelSpace: 300,

        //一级节点 高度
        oneLevelHeight: 90,
        //二级节点 高度
        twoLevelHeight: 60,
        //一级连线上文字，x偏移量
        textOffset: 100,

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
        left_level2_in: [],
        right_level2_in: [],
        //流出
        left_level2_out: [],
        right_level2_out: [],
        //团伙节点
        equal: []
    };
    var tem = this.conventData(opt.nodes, opt.links);


    console.log(this._map)
    //名称向上偏移量
    this.nameTextY = -16;
    this._nodes = tem.nodes;
    //基础连线
    this._links = tem.links;
    //同列连线
    this._sameLinks = tem.sameLinks;
    //跨列连线
    this._otherLinks = tem.otherLinks;

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
    },

    //根据旋转度数返回圆环坐标  x0,y0 圆心坐标 r 半径  angle 角度数
    setPos: function (x0, y0, r, angle) {
        var x1 = x0 + r * Math.cos(angle * Math.PI / 180);
        var y1 = y0 + r * Math.sin(angle * Math.PI / 180);
        return [x1, y1];
    },
    /**
     * @desc 二阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp 控制点
     */
    twoBezier: function (t, p1, cp, p2) {
        var x1 = p1[0], y1 = p1[1];
        var cx = cp[0], cy = cp[1];
        var x2 = p2[0], y2 = p2[1];
        var x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        var y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [x, y];
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
        this.linksNumber(this._links);


        this.linksNumber2(this._sameLinks, function (d, num, i) {
            d.ox_size2 = num;
            d.ox_index2 = i;
        })
        this.linksNumber2(this._otherLinks, function (d, num, i) {
            d.ox_size3 = num;
            d.ox_index3 = i;
        })

        this.calcItemPos();
        this.renderLegend(this._nodes, this._links);
        //渲染node
        this.renderRootItem(_map.root);
        //渲染 连接线
        $.each(this._links, function () {
            self.renderLink(this);
        });
        //渲染 连接线
        $.each(this._sameLinks, function () {
            self.renderSameLink(this);
        });
        //渲染 连接线
        $.each(this._otherLinks, function () {
            self.renderOtherLink(this);
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


        // this.rightNodeGroup.y(100);
        // this.rightLinkGroup.y(100);
    },
    //连接线分配编号
    linksNumber: function (links) {
        var linkGroup = {};
        links.forEach(function (d) {
            var key = d.source.idx < d.target.idx ? d.source.idx + ':' + d.target.idx : d.target.idx + ':' + d.source.idx;
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
    //连接线分配编号2
    linksNumber2: function (links, callback) {
        var linkGroup = {};
        links.forEach(function (d) {
            var key = d.source.idx < d.target.idx ? d.source.idx + ':' + d.target.idx : d.target.idx + ':' + d.source.idx;
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
                callback(d, num, i)
                // d.ox_size2 = num;
                // d.ox_index2 = i;
            });
        }
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
        // this.leftGroup = this.root.group();
        this.leftLinkGroup = this.root.group();

        // this.rightGroup = this.root.group();
        this.rightLinkGroup = this.root.group();


        this.leftNodeGroup = this.root.group();
        this.rightNodeGroup = this.root.group();
    },
    //处理数据
    conventData: function (nodes, links) {
        var self = this;
        this.nodeMap = {};
        var map = this.nodeMap;
        var _map = this._map;
        var _nodeMap = this._nodeMap;
        var typeList = this.opt.typeList;
        var _sameLinks = [];
        var _nodes = [], _links = [], _otherLinks = [], root = null;
        nodes.forEach(function (d, i) {
            var tem = {
                id: d.id + "_" + i,
                idx: i,
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
                //是否已计算位置信息
                hasPos: false,
                typeId: d.typeId,
                //path 数量
                pathNum: 0,
                //path 数量 -- 同列连线(竖向)
                pathNum2: 0,
                //等级类型 左到右 c1,c2,c3 [root] c4,c5,c6
                levelType: ""
            }
            if (d.isRoot) {
                tem.r = 67;
                tem.levelType = "root";
                root = tem;
                _map.root = tem;
            }
            if (map[d.id]) {
                console.error("id 重复", d.id);
                return;
            }
            map[d.id] = tem;
            _nodeMap[tem.id] = tem;
            _nodes.push(tem);
            if (d.typeId === typeList[0]) {
                tem.r = 42;
                tem.pos = "left";
                //  _map.level1_in.push(tem);
            } else if (d.typeId === typeList[1]) {
                tem.r = 42;
                tem.pos = "right";
                //_map.level1_out.push(tem);
            } else if (d.typeId === typeList[2]) {
                // _map.level2_in.push(tem);
            } else if (d.typeId === typeList[3]) {
                // _map.level2_out.push(tem);
            } else if (d.typeId === typeList[4]) {
                // _map.equal.push(tem);
            }
            // tem.target.r = 42;
        });
        var typeEqualLinks = [];

        var addList = function (list, item) {
            if (list.indexOf(item) === -1) {
                list.push(item);
            }
        }
        var linkGroup = {};
        var join = function (t1, t2) {
            return [t1, t2].join("_");
        }

        //基础连线布局
        links.forEach(function (d, i) {
            var tem = {
                id: d.id + "_" + i,
                source: map[d.source],
                target: map[d.target],
                typeId: d.typeId,
                data: d,
                //线上的文本
                text: "",
                //括号里的文本, 可能有多个, 存为数组
                moreText: [],
                level: 1
            }
            var text = self.opt.lineText(d) || "";
            var key = tem.source.idx + ':' + tem.target.idx;
            if (!linkGroup[key]) {
                tem.text = text;
                linkGroup[key] = {
                    item: tem
                }
                if (d.source === root.data.id) {
                    //1 out

                    if (self.opt.isTypeEqual.call(self, tem.target)) {
                        typeEqualLinks.push(tem);
                    } else {
                        if (tem.target.typeId === typeList[1]) {
                            //基础连线
                            tem.target.pos = "right";
                            tem.target.hasPos = true;
                            addList(root.out, tem.target);
                            addList(_map.level1_out, tem.target);
                            tem.target.levelType = "c5";
                            _links.push(tem);
                        } else if (tem.target.typeId === typeList[0]) {
                            //反向连线
                            _links.push(tem);
                        } else {
                            _otherLinks.push(tem);
                        }
                    }
                } else if (d.target === root.data.id) {
                    //1 in
                    if (self.opt.isTypeEqual.call(self, tem.source)) {
                        typeEqualLinks.push(tem);
                    } else {
                        if (tem.source.typeId === typeList[0]) {
                            //基础连线
                            tem.source.pos = "left";
                            tem.target.hasPos = true;
                            addList(root.in, tem.source);
                            addList(_map.level1_in, tem.source);
                            tem.source.levelType = "c2";
                            _links.push(tem);
                        } else if (tem.source.typeId === typeList[1]) {
                            //反向连线
                            _links.push(tem);
                        } else {
                            _otherLinks.push(tem);
                        }

                    }
                } else {
                    //2
                    tem.level = 2;
                    //[1,1,2,2]

                    if (tem.source.typeId === typeList[2]) {
                        if (tem.target.typeId === typeList[0] || tem.target.typeId === typeList[1]) {
                            //   tem.target.hasPos = true;

                            addList(tem.target.in, tem.source);
                            // left in
                            if (tem.target.typeId === typeList[0]) {
                                addList(_map.left_level2_in, tem.target);
                                // tem.target.levelType = "c1";
                                tem.source.levelType = "c1";
                            } else {
                                addList(_map.right_level2_in, tem.target);
                                tem.source.levelType = "c4"
                            }
                            _links.push(tem);
                        } else {
                            _otherLinks.push(tem);
                        }
                    } else if (tem.source.typeId === typeList[0] || tem.source.typeId === typeList[1]) {
                        if (tem.target.typeId === typeList[3]) {
                            addList(tem.source.out, tem.target);
                            //left out
                            if (tem.source.typeId === typeList[0]) {
                                addList(_map.left_level2_out, tem.source);
                                tem.target.levelType = "c3";
                            } else {
                                addList(_map.right_level2_out, tem.source);
                                tem.target.levelType = "c6";
                            }
                            _links.push(tem);
                        } else if (tem.target.typeId === typeList[2]) {
                            //反向连线
                            _links.push(tem);
                        } else {
                            _otherLinks.push(tem);
                        }
                    } else {
                        _otherLinks.push(tem);
                    }
                }
            } else {
                linkGroup[key].item.moreText.push(text);
            }
        });

        console.log(9999, links, _otherLinks, _links, typeEqualLinks)

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
                d.target.levelType = "c4";
                root.out.push(d.target);
                _map.level1_out.push(d.target);
            } else {
                if (d.target === _map.root) {
                    var tem = d.target;
                    d.target = d.source;
                    d.source = tem;
                }
                d.target.pos = "left";
                d.target.levelType = "c2";
                root.in.push(d.target);
                _map.level1_in.push(d.target);
            }
        })
        //同列连线
        var tem1 = [], tem2 = [];
        _otherLinks.forEach(function (d) {
            var source = d.source, target = d.target;
            if (source.levelType === target.levelType) {
                tem1.push(d)
            } else {
                tem2.push(d)
            }
        })
        _otherLinks = tem2;
        _sameLinks = tem1;
        return {
            root: root,
            nodes: _nodes,
            links: _links,
            otherLinks: _otherLinks,
            sameLinks: _sameLinks
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

        var item_h1 = this.opt.oneLevelHeight;
        var item_h2 = this.opt.twoLevelHeight;

        var space1 = this.opt.oneLevelSpace;
        var space2 = this.opt.twoLevelSpace;

        function getH(item, list) {
            var first = list[0];
            var last = list[list.length - 1];
            // item.vLineH = last.y - first.y;
            item.centerY = first.y + (last.y - first.y) / 2;
        }

        var nodeMap = this._nodeMap;

        function calc(leftList, centerList, rightList, item_h1, item_h2) {
            leftList.forEach(function (d, i) {
                d.h = item_h2;
                if (i) {
                    d.y = leftList[i - 1].y + item_h2 + (d.space || 0);
                } else {
                    d.y = 0;
                }
            });
            centerList.forEach(function (d, i) {
                d.h = item_h1;
                if (i) {
                    d.y = centerList[i - 1].y + item_h1 + (d.space || 0);
                } else {
                    d.y = 0;
                }
                if (d.in.length) {
                    getH(d, d.in);
                    // d.in.forEach(function (p, i) {
                    //     p.y = y + i * item_h2 - half;
                    // })
                    d.y = d.centerY;
                }
                if (d.out.length) {
                    orderRightList(d.y, d.out)
                }
            });

            // rightList.forEach(function (d, i) {
            //     d.h = item_h2;
            //     if (i) {
            //         d.y = rightList[i - 1].y + item_h2 + (d.space || 0);
            //     } else {
            //         d.y = 0;
            //     }
            // });

            function orderRightList(y, list) {
                var half = (list.length * item_h2 - item_h2) / 2;
                list.forEach(function (d, i) {
                    d.y = y + i * item_h2 - half;
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
                        if (num < item_h1 + d.space) {
                            hasRepeat = true;
                            var t = item_h1 + d.space - num;
                            moveCenterItem(d, t);
                        }
                    }
                });


                rightList.forEach(function (d, i) {
                    if (i) {
                        var num = d.y - rightList[i - 1].y;
                        if (num < item_h2) {
                            hasRepeat = true;
                            var t = item_h2 - num + d.space;
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

        //获取y轴, 一级 item 之间的间距
        function getSpace(currItem, upItem, defSpace, isIn) {
            if (upItem) {
                if (isIn) {
                    return currItem.out.length * item_h2 / 2 + defSpace
                } else {
                    return currItem.in.length * item_h2 / 2 + defSpace
                }
            }
            return defSpace
        }


        var left_in = [], left_out = [];
        _map.level1_in.forEach(function (d, di) {
            d.x = hw - space1;
            //d.space = space;
            d.space = getSpace(d, _map.level1_in[di - 1], space, true);
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
        calc(left_in, _map.level1_in, left_out, item_h1, item_h2);
        //居中
        var l_first = _map.level1_in[0];
        var l_last = _map.level1_in[_map.level1_in.length - 1];
        var l_centerY = l_first.y + (l_last.y + l_last.h - l_first.y) / 2;
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
        _map.level1_out.forEach(function (d, di) {
            d.x = hw + space1;
            d.space = getSpace(d, _map.level1_out[di - 1], space, false);
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
        calc(right_in, _map.level1_out, right_out, item_h1, item_h2);
        //居中
        var r_frist = _map.level1_out[0];
        var r_last = _map.level1_out[_map.level1_out.length - 1];
        var r_centerY = r_frist.y + (r_last.y + r_last.h - r_frist.y) / 2;
        //减掉字体距离
        var rc = -(r_centerY - this.hh) - self.nameTextY;

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
                var txt = d.typeName;
                if (typeof self.opt.legendNodeTypeFormatter === "function") {
                    txt = self.opt.legendNodeTypeFormatter(d);//.typeName;
                }
                h.push('<li data-type-id="' + d.typeId + '"><i class="i-icon" data-color="' + d.color + '" style="background-color: ' + d.color + '"></i><span>' + txt + '</span><i class="i-btn-colse fa fa-crosshairs"></i></li>');
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
        var bl = 1;
        //判断是否为反方向线条 默认从左到右
        if (x > x1) {
            bl = -1;
        }

        var line = g.line(points.x, points.y, points.x1, points.y1).attr("data-id", item.source.x);


        if (item.ox_size === 1) {

        } else {

            var sp = 5;
            if (item.ox_size % 2 === 0) {
                //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                var flag = (item.ox_index % 2 === 0 ? -1 : 1) * bl;
                ty = flag * 14 * parseInt(item.ox_index / 2) + (flag * sp);
            } else {
                //0 0, 1 -7 , 2 7,
                //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                if (item.ox_index > 0) {
                    var flag = (item.ox_index - 1) % 2 === 0 ? -1 : 1;
                    ty = flag * 14 * parseInt((item.ox_index - 1) / 2) + (flag * sp);
                }
            }

        }

        var deg = tool.getAngle(x, y, x1, y1);
        var _y = ty * (Math.sin((90 - deg) * Math.PI / 180));
        var _x = ty * (Math.cos((90 - deg) * Math.PI / 180));
        _y = -_y;
        line.translate(_x, _y);
        // var deg = tool.getAngle(x, y, x1, y1);
        item.line = line;
        var txt = item.text;
        if (item.moreText.length) {
            txt += ("（" + item.moreText.join("、") + "）")
        }

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
        // var text = g.text(txt).x(x + offsetX + (x1 - x) / 2).y(y + offsetY + (y1 - y) / 2 - 6).rotate(deg);

        var text = g.text(txt).x(x + offsetX + _x + (x1 - x) / 2).y(y + offsetY + _y + (y1 - y) / 2 - 6).rotate(deg);
        if (textColor) {
            text.addClass('cus-text-color').style({fill: textColor});
        }
        item.textNode = text;
        var arrow_marker;
        var hasArrow = true;
        var styleCls = "node-link-02";
        var linkStyle = self.linksStyleMap[item.typeId];
        var arrowId = "";
        if (linkStyle) {
            hasArrow = linkStyle.arrow;
            styleCls = linkStyle.cls;
            arrowId = linkStyle.arrowId;
        }
        g.addClass(styleCls)
        if (hasArrow) {
            if (arrowId) {
                arrow_marker = this.draw.defs().select(arrowId).first();
            } else {
                arrow_marker = this.draw.defs().select("#arrowCompany").first();
            }
            line.marker("end", arrow_marker);
        }
        item.hasArrow = hasArrow;
        g.on("click", this.linkClick, {self: self, item: item});
    },


    _sameRenderLink: function (item) {
        var g = item.g;
        var x = item.source.x;
        var y = item.source.y;
        var x1 = item.target.x;
        var y1 = item.target.y;
        var ox_index = item.ox_index2 || item.ox_index3 || 0;
        var deg = tool.getAngle(x, y, x1, y1);

        //贝塞尔曲线 y控制点间隔
        var bx = 40;

        var hx = x + (x1 - x) / 2;
        var hy = y + (y1 - y) / 2;

        //二次贝塞尔曲线
        var qx = 0, qy = 0;
        var qh = (ox_index + 1) * bx;

        var deg2 = deg + 90;
        //方向 根据坐标系判断
        var leftPos = ["c1", "c2", "c3"];
        var rightPos = ["c4", "c5", "c6"];

        if (leftPos.indexOf(item.source.levelType) >= 0) {
            if (deg <= 0) {
                deg2 = deg - 90;
            }

        } else if (rightPos.indexOf(item.source.levelType) >= 0) {
            if (deg >= 0) {
                deg2 = deg - 90;
            }
        }

        var q_point = tool.setPos(hx, hy, qh, deg2)
        qx = q_point[0];
        qy = q_point[1];
        var points = this.convertStartEndPoint2(item.source, item.target, q_point, qh);
        x = points[0];
        y = points[1];
        x1 = points[2];
        y1 = points[3];
        var q_point2 = tool.twoBezier(0.5, [x, y], q_point, [x1, y1])

        var d = "M" + x + "," + y + "Q" + ((qx)) + "," + ((qy)) + "," + x1 + "," + (y1);

        if (item.path) {
            item.path.plot(d);
        } else {
            item.path = g.path(d).fill("none").attr("data-id", item.source.x);
        }

        var txt = item.text;
        if (item.moreText.length) {
            txt += ("（" + item.moreText.join("、") + "）")
        }

        var textColor = this.opt.lineTextColor(txt, item);
        if (deg >= 90 && deg < 270) {
            deg -= 180;
        }
        if (deg > -270 && deg < -90) {
            deg += 180;
        }

        if (item.textNode) {
            item.textNode.rotate(0).x(q_point2[0]).y(q_point2[1] - 6).rotate(deg);
        } else {
            var text = g.text(txt).x(q_point2[0]).y(q_point2[1] - 6).rotate(deg);
            if (textColor) {
                text.addClass('cus-text-color').style({fill: textColor});
            }
            item.textNode = text;
        }
    },

    renderSameLink: function (item) {
        var self = this;
        var cls = "node-link-company";
        var group = this.rightLinkGroup;
        var pos = item.source.pos || item.target.pos;
        if (pos === "left") {
            group = this.leftLinkGroup;
        }

        var g = group.group().addClass(cls);
        item.g = g;

        this._sameRenderLink(item);

        var path = item.path;
        var arrow_marker;
        var hasArrow = true;
        var styleCls = "node-link-02";
        var linkStyle = self.linksStyleMap[item.typeId];
        var arrowId = "";
        if (linkStyle) {
            hasArrow = linkStyle.arrow;
            styleCls = linkStyle.cls;
            arrowId = linkStyle.arrowId;
        }
        g.addClass(styleCls)
        if (hasArrow) {
            if (arrowId) {
                arrow_marker = this.draw.defs().select(arrowId).first();
            } else {
                arrow_marker = this.draw.defs().select("#arrowCompany").first();
            }
            path.marker("end", arrow_marker);
        }
        item.hasArrow = hasArrow;
        g.on("click", this.linkClick, {self: self, item: item});
    },

    _otherRenderLink: function (item) {
        var g = item.g;
        var x = item.source.x;
        var y = item.source.y;
        var x1 = item.target.x;
        var y1 = item.target.y;
        var ox_index = item.ox_index2 || item.ox_index3 || 0;
        var deg = tool.getAngle(x, y, x1, y1);

        //贝塞尔曲线 y控制点间隔
        var bx = 40;
        var hx = x + (x1 - x) / 2;
        var hy = y + (y1 - y) / 2;
        //二次贝塞尔曲线
        var qx = 0, qy = 0;
        var qh = (ox_index + 1) * bx;

        var deg2 = deg + 90;
        //方向 根据坐标系判断
        var leftPos = ["c1", "c2", "c3"];
        var rightPos = ["c4", "c5", "c6"];

        if (leftPos.indexOf(item.source.levelType) >= 0) {
            if (deg > 0) {
                deg2 = deg - 90;
            }

        } else if (rightPos.indexOf(item.source.levelType) >= 0) {
            if (deg < 0) {
                deg2 = deg - 90;
            }
        } else {
            if (rightPos.indexOf(item.target.levelType) >= 0) {
                if (deg < 0) {
                    deg2 = deg - 90;
                }
            }
            if (leftPos.indexOf(item.target.levelType) >= 0) {
                if (deg > 0) {
                    deg2 = deg - 90;
                }
            }
        }

        var q_point = tool.setPos(hx, hy, qh, deg2)
        qx = q_point[0];
        qy = q_point[1];
        var points = this.convertStartEndPoint2(item.source, item.target, q_point, qh);
        x = points[0];
        y = points[1];
        x1 = points[2];
        y1 = points[3];
        var q_point2 = tool.twoBezier(0.5, [x, y], q_point, [x1, y1])
        var d = "M" + x + "," + y + "Q" + ((qx)) + "," + ((qy)) + "," + x1 + "," + (y1);
        if (item.path) {
            item.path.plot(d);
        } else {
            item.path = g.path(d).fill("none").attr("data-id", item.source.x);
        }
        var txt = item.text;
        if (item.moreText.length) {
            txt += ("（" + item.moreText.join("、") + "）")
        }
        var textColor = this.opt.lineTextColor(txt, item);
        if (deg >= 90 && deg < 270) {
            deg -= 180;
        }
        if (deg > -270 && deg < -90) {
            deg += 180;
        }
        if (item.textNode) {
            item.textNode.rotate(0).x(q_point2[0]).y(q_point2[1] - 6).rotate(deg);
        } else {
            var text = g.text(txt).x(q_point2[0]).y(q_point2[1] - 6).rotate(deg);
            if (textColor) {
                text.addClass('cus-text-color').style({fill: textColor});
            }
            item.textNode = text;
        }
    },

    renderOtherLink: function (item) {
        var self = this;
        var cls = "node-link-company";
        var group = this.rightLinkGroup;
        var pos = item.source.pos || item.target.pos;
        if (pos === "left") {
            group = this.leftLinkGroup;
        }
        var g = group.group().addClass(cls);
        item.g = g;
        self._otherRenderLink(item);
        var path = item.path;
        var arrow_marker;
        var hasArrow = true;
        var styleCls = "node-link-02";
        var linkStyle = self.linksStyleMap[item.typeId];
        var arrowId = "";
        if (linkStyle) {
            hasArrow = linkStyle.arrow;
            styleCls = linkStyle.cls;
            arrowId = linkStyle.arrowId;
        }
        g.addClass(styleCls)
        if (hasArrow) {
            if (arrowId) {
                arrow_marker = this.draw.defs().select(arrowId).first();
            } else {
                arrow_marker = this.draw.defs().select("#arrowCompany").first();
            }
            path.marker("end", arrow_marker);
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
    //转换坐标点
    convertStartEndPoint2: function (source, target, bezArr, h) {
        var x = source.x,
            y = source.y,
            x1 = target.x,
            y1 = target.y;
        var a = Math.abs(x1 - x);
        var b = Math.abs(y1 - y);
        var c = Math.sqrt((a * a + b * b) / 4 + h * h);
        //2 ===> 4
        var t1 = tool.twoBezier(source.r / 4 / c, [x, y], bezArr, [x1, y1]);
        var t2 = tool.twoBezier(1 - target.r / 4 / c, [x, y], bezArr, [x1, y1]);
        return [t1[0], t1[1], t2[0], t2[1]]
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
        var linksNodes2 = self.getSameLinkNodes(item);
        var linksNodes3 = self.getOtherLinkNodes(item);
        $.each(linksNodes.sourceList.concat(linksNodes.targetList, linksNodes2.sourceList, linksNodes2.targetList,
            linksNodes3.sourceList, linksNodes3.targetList), function () {
            this.source.g.addClass("node-company-hover");
            this.target.g.addClass("node-company-hover");
            if (this.hasArrow) {
                this.g.addClass("node-link-company-hover");
                if (this.line) {
                    this.line.marker("end", self.draw.defs().select("#arrowCompanyHover").first());
                }
                if (this.path) {
                    this.path.marker("end", self.draw.defs().select("#arrowCompanyHover").first());
                }

            } else {
                this.g.addClass("node-link-person-hover");
            }
        });
    },
    //取消高亮
    celHoverItem: function (item) {
        var self = this;
        var linksNodes = self.getLinkNodes(item);
        var linksNodes2 = self.getSameLinkNodes(item);
        var linksNodes3 = self.getOtherLinkNodes(item);
        $.each(linksNodes.sourceList.concat(linksNodes.targetList, linksNodes2.sourceList, linksNodes2.targetList,
            linksNodes3.sourceList, linksNodes3.targetList), function () {
            this.source.g.removeClass("node-company-hover");
            this.target.g.removeClass("node-company-hover");
            if (this.hasArrow) {
                this.g.removeClass("node-link-company-hover");
                var linkStyle = self.linksStyleMap[this.typeId];
                var arrowId = "";
                if (linkStyle) {
                    arrowId = linkStyle.arrowId;
                }
                if (arrowId) {


                    if (this.line) {
                        this.line.marker("end", self.draw.defs().select(arrowId).first());
                    }
                    if (this.path) {
                        this.path.marker("end", self.draw.defs().select(arrowId).first());
                    }
                } else {


                    if (this.line) {
                        this.line.marker("end", self.draw.defs().select("#arrowCompany").first());
                    }
                    if (this.path) {
                        this.path.marker("end", self.draw.defs().select("#arrowCompany").first());
                    }
                }


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

    getSameLinkNodes: function (item) {
        var self = this;
        var opt = self.opt, links = this._sameLinks;
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
    getOtherLinkNodes: function (item) {
        var self = this;
        var opt = self.opt, links = this._otherLinks;
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
    //节点移动事件
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
            var bl = 1;

            //判断是否为反方向线条 默认从左到右
            if (x > x1) {
                bl = -1;
            }
            var ty = 0;
            this.line.plot(points.x, points.y, points.x1, points.y1);
            var pos = this.source.pos || this.target.pos;
            if (this.ox_size === 1) {

            } else {
                var sp = 5;
                if (this.ox_size % 2 === 0) {
                    //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                    var flag = (this.ox_index % 2 === 0 ? -1 : 1) * bl;
                    ty = flag * 14 * parseInt(this.ox_index / 2) + (flag * sp);

                } else {
                    //0 0, 1 -7 , 2 7,
                    //0 -7,  1 7 , 2 -21 , 3  21 ,4 -35
                    if (this.ox_index > 0) {
                        var flag = (this.ox_index - 1) % 2 === 0 ? -1 : 1;
                        ty = flag * 14 * parseInt((this.ox_index - 1) / 2) + (flag * sp);
                    }
                }
            }

            var deg = tool.getAngle(x, y, x1, y1);
            var _y = ty * (Math.sin((90 - deg) * Math.PI / 180));
            var _x = ty * (Math.cos((90 - deg) * Math.PI / 180));
            _y = -_y;
            this.line.translate(_x, _y);
            //
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
            this.textNode.rotate(0).x(x + offsetX + _x + (x1 - x) / 2).y(y + offsetY + _y + (y1 - y) / 2 - 6).rotate(deg);
        });

        //path
        var rootY = self._map.root.y;
        var linksNodes2 = self.getSameLinkNodes(item);

        $.each(linksNodes2.sourceList.concat(linksNodes2.targetList), function () {
            self._sameRenderLink(this);
        });
        //path
        var linksNodes3 = self.getOtherLinkNodes(item);
        $.each(linksNodes3.sourceList.concat(linksNodes3.targetList), function () {
            self._otherRenderLink(this);
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

