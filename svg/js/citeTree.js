define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NodeReader = /** @class */ (function () {
        function NodeReader(isRight, data, option) {
            this.mapLevel = {};
            this.mapId = {};
            this.infoList = [];
            this.maxInfo = [];
            this.lineWidth = 1;
            this.isRight = isRight;
            this.option = option;
            this.data = data;
            this.rootGroup = option.rootGroup;
            this.hw = option.hw;
            this.hh = option.hh;
            this.init(data);
        }
        NodeReader.prototype.init = function (data) {
            data._id = data.id || "root";
            data.open = true;
            this.data = data;
            this.renderRoot(data);
            this.createGroup();
            var firstList = data.children;
            if (firstList && firstList.length) {
                var half = Math.ceil(firstList.length / 2);
                var leftList = [], rightList_1 = [];
                $.each(firstList, function (idx, item) {
                    //  if (idx < half) {
                    rightList_1.push(item);
                    // } else {
                    //     leftList.push(item);
                    // }
                });
                if (this.isRight) {
                    this.conventData(rightList_1);
                }
                else {
                    this.conventData(leftList);
                }
                this.mapId[data._id] = data;
                this.calcItemPos(this.isRight);
                this.render(this.isRight, true);
            }
        };
        NodeReader.prototype.createGroup = function () {
            var halfGroup = this.rootGroup.group();
            var nodeGroup = halfGroup.group();
            var lineGroup = halfGroup.group();
            this.halfGroup = halfGroup;
            this.lineGroup = lineGroup;
            this.nodeGroup = nodeGroup;
        };
        NodeReader.prototype.getItemById = function (_id) {
            if (this.mapId[_id]) {
                return this.mapId[_id];
            }
            else {
                return null;
            }
        };
        //寻找到上一个展开的iten ,用来获取y位置
        NodeReader.prototype.getPrevItem = function (list, idx) {
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
            }
            else {
                return null;
            }
        };
        //寻找到下一个展开的iten ,用来重置y位置
        NodeReader.prototype.getNextItem = function (list, idx) {
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
            }
            else {
                return null;
            }
        };
        //获取间隔 最小间隔为40
        NodeReader.prototype.getSpace = function (list, prevItem, item) {
            var pi = list.indexOf(prevItem);
            var idx = list.indexOf(item);
            var num = idx - pi - 1;
            var p = num * 50 + 10 + 40; //50 :h+10 40:原最小间隔
            var space = p - (prevItem.children.length * 50 - 10) / 2 - (item.children.length * 50 - 10) / 2;
            return space < 40 ? 40 : space;
        };
        //鼠标移入事件
        NodeReader.prototype.mouseenter = function (e, item, self) {
            var rect = item.g.rbox();
            var left = rect.x - 340 + 25;
            if (!this.isRight) {
                left = rect.x + rect.width - 25;
            }
            var top = rect.y;
            if (this.option.hasDetailInfo) {
                if (this.option.detailInfoShowBefore) {
                    var t_falg = this.option.detailInfoShowBefore.call(this, item, $(".info-box"));
                    //排除undefined
                    if (t_falg === false) {
                    }
                    else {
                        $(".info-box").css({
                            left: left + "px",
                            top: top + "px"
                        }).show();
                    }
                }
            }
            if (item.children.length && item.open) {
                $.each(item.children, function (idx) {
                    if (self.isRight) {
                        this.hover_polyline = self.lineGroup.polyline([
                            [this.x, this.y + 20],
                            [this.x - 35, this.y + 20],
                            [this.x - 35, self.y + 20],
                            [self.x + self.w, self.y + 20]
                        ])
                            .fill("transparent")
                            .addClass(self.option.lineHoverCls);
                    }
                    else {
                        this.hover_polyline = self.lineGroup.polyline([
                            [this.x + this.w, this.y + 20],
                            [this.x + this.w + 35, this.y + 20],
                            [this.x + this.w + 35, self.y + 20],
                            [self.x, self.y + 20]
                        ])
                            .fill("transparent")
                            .addClass(self.option.lineHoverCls);
                    }
                    this.hLine.hide();
                });
                item.vLine && item.vLine.hide();
                item.rightLine && item.rightLine.hide();
            }
            if (self.mapId[item.pid]) {
                var pItem = self.mapId[item.pid];
                if (self.isRight) {
                    if (item.level == 1) {
                        var m = self.halfGroup.matrixify();
                        pItem = {
                            x: pItem.x,
                            w: pItem.w,
                            y: pItem.y - m.f
                        };
                    }
                    item.hover_polyline = self.lineGroup.polyline([
                        [item.x, item.y + 20],
                        [item.x - 35, item.y + 20],
                        [item.x - 35, pItem.y + 20],
                        [pItem.x + pItem.w, pItem.y + 20]
                    ])
                        .fill("transparent")
                        .addClass(self.option.lineHoverCls)
                        .addClass("left-link-hover");
                }
                else {
                    if (item.level == 1) {
                        var m = self.halfGroup.matrixify();
                        pItem = {
                            x: pItem.x,
                            w: pItem.w,
                            y: pItem.y - m.f
                        };
                    }
                    item.hover_polyline = self.lineGroup.polyline([
                        [item.x + item.w, item.y + 20],
                        [item.x + item.w + 35, item.y + 20],
                        [item.x + item.w + 35, pItem.y + 20],
                        [pItem.x, pItem.y + 20]
                    ])
                        .fill("transparent")
                        .addClass(self.option.lineHoverCls)
                        .addClass("left-link-hover");
                }
            }
        };
        //鼠标移出事件
        NodeReader.prototype.mouseleave = function (e, item, self) {
            if (self.option.hasDetailInfo) {
                $(".info-box").hide();
            }
            if (item.children.length && item.open) {
                $.each(item.children, function (idx) {
                    this.hLine.show();
                    if (this.hover_polyline) {
                        this.hover_polyline.remove();
                        this.hover_polyline = null;
                    }
                });
                item.vLine && item.vLine.show();
                item.rightLine && item.rightLine.show();
            }
            if (self.mapId[item.pid]) {
                if (item.hover_polyline) {
                    item.hover_polyline.remove();
                    item.hover_polyline = null;
                }
            }
        };
        //单击事件
        NodeReader.prototype.openClick = function (e, item, self) {
            var node = e.target.parentNode;
            if ((node.getAttribute("class") || "").indexOf("svg-node") === -1) {
                node = node.parentNode;
            }
            var _id = node.getAttribute("data-id");
            // let item = self.mapId[_id];
            var mapId = self.mapId;
            var mapLevel = self.mapLevel;
            var isRight = self.isRight;
            var option = self.option;
            if (item.children.length && item.open) {
                $.each(item.children, function (idx) {
                    this.hLine.show();
                    if (this.hover_polyline) {
                        this.hover_polyline.remove();
                        this.hover_polyline = null;
                    }
                });
                item.vLine && item.vLine.show();
                item.rightLine && item.rightLine.show();
            }
            if (item.hover_polyline) {
                item.hover_polyline.remove();
                item.hover_polyline = null;
            }
            if (!item.children.length) {
                return;
            }
            //收起
            if (item.open) {
                item.open = false;
                self.closeItemChildren(item, item, true);
                self.render(self.isRight);
            }
            else {
                item.open = true;
                var temList_1 = [];
                var pid_1 = item._id;
                var fn = function (list) {
                    $.each(list, function (idx, d) {
                        if (idx < 10) {
                            d.idx = idx;
                            d._id = d.id;
                            d.hide = false;
                            d.open = false;
                            d.pid = pid_1;
                            d.g = null;
                            d.animateMoreAdd = true;
                            d.level = item.level + 1;
                            if (!d.childrenList) {
                                d.childrenList = d.children || [];
                            }
                            if (!d.children) {
                                d.children = [];
                            }
                            if (mapId[d._id]) {
                                d._id = "node_" + d.id + "_" + idx + "_" + new Date().getTime();
                            }
                            mapId[d._id] = d;
                            if (!mapLevel[d.level]) {
                                mapLevel[d.level] = [];
                            }
                            temList_1.push(d);
                        }
                    });
                };
                fn(item.childrenList);
                if (item.childrenList.length > 10) {
                    var mItem = this.moreItemObj(item);
                    item.moreOpen = false;
                    mapId[mItem._id] = mItem;
                    temList_1.push(mItem);
                }
                item.children = temList_1;
                var list = mapLevel[item.level];
                var idx = list.indexOf(item);
                if (idx > 0) {
                    var upItem = this.getPrevItem(list, idx);
                    if (upItem) {
                        var lastItem = upItem.children[upItem.children.length - 1];
                        var lastIdx = mapLevel[upItem.level + 1].indexOf(lastItem);
                        Array.prototype.splice.apply(mapLevel[item.level + 1], [lastIdx + 1, 0].concat(temList_1));
                    }
                    else {
                        Array.prototype.splice.apply(mapLevel[item.level + 1], [0, 0].concat(temList_1));
                    }
                }
                else {
                    Array.prototype.splice.apply(mapLevel[item.level + 1], [0, 0].concat(temList_1));
                }
                temList_1.forEach(function (d) {
                    d.animateAdd = true;
                    d.animateMoreAdd = false;
                    d.py = item.y;
                    d.px = item.x;
                    d.pw = item.w;
                });
                self.calcItemPos(self.isRight);
                item.animateAdd = true;
                self.render(self.isRight);
            }
        };
        //更多点击事件
        NodeReader.prototype.moreClick = function (e, _item, self) {
            var node = e.target.parentNode;
            if (node.getAttribute("class") !== "svg-more") {
                node = node.parentNode;
            }
            var mapId = self.mapId;
            var mapLevel = self.mapLevel;
            var isRight = self.isRight;
            var option = self.option;
            var pid = node.getAttribute("data-pid");
            function celHover() {
                var _id = node.getAttribute("data-id");
                var item = mapId[_id];
                if (item && item.hover_polyline) {
                    item.hover_polyline.remove();
                    item.hover_polyline = null;
                }
            }
            celHover();
            var item = mapId[pid];
            if (!item) {
                return;
            }
            if (item.childrenList.length < 10) {
                return;
            }
            //收起
            if (item.moreOpen) {
                item.moreOpen = false;
                var temList_2 = [];
                var len_1 = item.children.length;
                var removeList_1 = [];
                $.each(item.children, function (i, d) {
                    if (i > 9 && i < len_1 - 1) {
                        d.hide = true;
                        var idx = mapLevel[item.level + 1].indexOf(d);
                        if (idx >= 0) {
                            mapLevel[item.level + 1].splice(idx, 1);
                        }
                        removeList_1.push(d);
                    }
                    else {
                        temList_2.push(d);
                    }
                });
                item.children = temList_2;
                var lastItem = item.children[item.children.length - 1];
                lastItem.name = "展开";
                lastItem.g.select("text").get(0).text(lastItem.name);
                lastItem.moreOpen = false;
                self.calcItemPos(isRight);
                var tem_1 = temList_2[9];
                removeList_1.forEach(function (d, idx) {
                    d.g.animate(option.anTime).opacity(0).y(tem_1.y + 40).after(function () {
                        this.remove();
                    });
                    //d.hLine.animate(option.anTime).x(0);
                    if (d.open) {
                        self.closeItemChildren(d, tem_1, false);
                    }
                });
                self.render(isRight);
            }
            else {
                item.moreOpen = true;
                var temList_3 = [];
                $.each(item.childrenList, function (i, d) {
                    if (i > 9) {
                        d.idx = i;
                        d._id = d.id;
                        d.hide = false;
                        d.pid = pid;
                        d.open = false;
                        d.g = null;
                        d.animateAdd = false;
                        d.animateMoreAdd = true;
                        d.level = item.level + 1;
                        if (!d.children) {
                            d.children = [];
                        }
                        d.childrenList = d.children || [];
                        if (!mapLevel[d.level + 1]) {
                            mapLevel[d.level + 1] = [];
                        }
                        if (mapId[d._id]) {
                            d._id = "node_" + d.id + "_" + i + "_" + new Date().getTime();
                        }
                        mapId[d._id] = d;
                        temList_3.push(d);
                    }
                });
                Array.prototype.splice.apply(item.children, [10, 0].concat(temList_3));
                var lastItem = item.children[item.children.length - 1];
                var idx = mapLevel[item.level + 1].indexOf(lastItem);
                Array.prototype.splice.apply(mapLevel[item.level + 1], [idx, 0].concat(temList_3));
                lastItem.name = "收缩";
                lastItem.g.select("text").get(0).text(lastItem.name);
                lastItem.moreOpen = true;
                self.calcItemPos(isRight);
                var temItem_1 = item.children[9];
                temList_3.forEach(function (d) {
                    d.py = temItem_1.y;
                });
                self.render(isRight);
            }
        };
        //渲染
        NodeReader.prototype.render = function (isRight, isInit) {
            var mapId = this.mapId;
            var mapLevel = this.mapLevel;
            var option = this.option;
            var keys = [];
            for (var key in mapLevel) {
                keys.push(Number(key));
            }
            var max = Math.max.apply(Math, keys);
            var idx = max, temList;
            var self = this;
            while (idx > 0) {
                temList = mapLevel[idx];
                $.each(temList, function (i, d) {
                    if (d.hide) {
                    }
                    else {
                        if (mapId[d.pid]) {
                            if (mapId[d.pid].open) {
                                self.childNode(isRight, d);
                                self.renderLine(isRight, d);
                            }
                        }
                    }
                });
                idx--;
            }
            var list = mapLevel[1];
            var r_frist = list[0];
            var r_last = list[list.length - 1];
            var r_centerX;
            if (isRight) {
                r_centerX = r_frist.x - 35;
            }
            else {
                r_centerX = r_frist.x + r_frist.w + 35;
            }
            // --height -> cy
            if (isRight) {
                if (this.data.right_vLine) {
                    this.data.right_vLine.animate(option.anTime).y(r_frist.y + 20).height(r_last.y - r_frist.y);
                }
                else {
                    this.data.right_vLine = this.lineGroup.line(r_centerX, r_frist.y + 20, r_centerX, r_last.y + 20).attr("data-id", this.data._id);
                }
            }
            else {
                if (this.data.left_vLine) {
                    this.data.left_vLine.animate(option.anTime).y(r_frist.y + 20).height(r_last.y - r_frist.y);
                }
                else {
                    this.data.left_vLine = this.lineGroup.line(r_centerX, r_frist.y + 20, r_centerX, r_last.y + 20).attr("data-id", this.data._id);
                }
            }
            var r_centerY = r_frist.y + (r_last.y + 40 - r_frist.y) / 2;
            if (isInit) {
                this.halfGroup.y(-(r_centerY - this.hh));
            }
            else {
                this.halfGroup.animate(option.anTime).y(-(r_centerY - this.hh));
            }
        };
        //计算位置
        NodeReader.prototype.calcItemPos = function (isRight) {
            var mapId = this.mapId;
            var mapLevel = this.mapLevel;
            var option = this.option;
            var maxInfo = this.maxInfo;
            var self = this;
            var keys = [];
            for (var key in mapLevel) {
                keys.push(Number(key));
            }
            var max = Math.max.apply(Math, keys);
            var idx = max, list;
            function getSpace(item) {
                if (item.idx) {
                    return 10;
                }
                else {
                    if (mapLevel[item.level].indexOf(item) === 0) {
                        return 0;
                    }
                    else {
                        return 40;
                    }
                }
            }
            function getH(item) {
                var frist = item.children[0];
                var last = item.children[item.children.length - 1];
                var centerY;
                if (item.hasMore) {
                    if (!item.moreOpen) {
                        last = item.children[8];
                    }
                    else {
                        last = item.children[item.children.length - 2];
                    }
                    centerY = frist.y + (last.y + 50 + 40 - frist.y) / 2;
                    item.vLineH = last.y + 50 - frist.y;
                }
                else {
                    centerY = frist.y + (last.y + 40 - frist.y) / 2;
                    item.vLineH = last.y - frist.y;
                }
                item.centerY = centerY;
            }
            var i = 1;
            var _loop_1 = function () {
                list = mapLevel[i];
                var max_w = 0;
                $.each(list, function (di, d) {
                    var w = self.getLength(d.name) * 14 / 2 + 20; //20 padding
                    if (d.children.length || d.isMoreItem) {
                        w += 20; //展开收缩按钮
                    }
                    d.w = w;
                    max_w = Math.max(max_w, w);
                    var off_x = 0;
                    $.each(maxInfo, function (mi, m) {
                        if (mi < d.level) {
                            off_x += m;
                        }
                    });
                    if (isRight) {
                        d.x = self.hw + off_x + d.level * 70;
                    }
                    else {
                        d.x = self.hw - d.w - off_x - d.level * 70;
                    }
                });
                maxInfo[i] = max_w;
                i++;
            };
            //默认排列位置
            while (i <= max) {
                _loop_1();
            }
            //根据子节点计算父级位置
            function calcParentItem() {
                idx = max;
                while (idx > 0) {
                    list = mapLevel[idx];
                    $.each(list, function (i, d) {
                        d.space = getSpace(d);
                        if (d.children.length) {
                            // w += 20;  //展开收缩按钮
                            if (d.open) {
                                getH(d);
                                d.y = d.centerY - 20;
                            }
                            else {
                                if (i) {
                                    d.y = list[i - 1].y + 40 + d.space;
                                }
                                else {
                                    d.y = 0;
                                }
                            }
                        }
                        else {
                            if (i) {
                                d.y = list[i - 1].y + 40 + d.space;
                            }
                            else {
                                d.y = 0;
                            }
                        }
                        d.h = 40;
                    });
                    idx--;
                }
            }
            calcParentItem();
            var hasRepeat = true;
            var count = 1;
            while (hasRepeat && count < 10) {
                hasRepeat = false;
                i = 1;
                count++;
                var _loop_2 = function () {
                    list = mapLevel[i];
                    var fn = function (list, t) {
                        $.each(list, function (idx, d) {
                            d.y += t;
                            if (d.children) {
                                if (d.children.length) {
                                    fn(d.children, t);
                                }
                            }
                        });
                    };
                    //从上层到下层 计算位置
                    $.each(list, function (idx, d) {
                        if (idx) {
                            var num = d.y - list[idx - 1].y;
                            var top_1 = 50;
                            if (d.pid !== list[idx - 1].pid) {
                                top_1 = 80;
                            }
                            if (num < top_1) {
                                hasRepeat = true;
                                var t = top_1 - num;
                                d.y += t;
                                if (d.children.length) {
                                    fn(d.children, t);
                                }
                            }
                        }
                    });
                    i++;
                };
                while (i <= max) {
                    _loop_2();
                }
                if (hasRepeat) {
                    idx = max;
                    //根据子节点计算父级位置
                    while (idx > 0) {
                        list = mapLevel[idx];
                        $.each(list, function (i, d) {
                            d.space = getSpace(d);
                            if (d.children.length) {
                                if (d.open) {
                                    getH(d);
                                    d.y = d.centerY - 20;
                                }
                            }
                        });
                        idx--;
                    }
                }
            }
            //美化未展开节点 -- 均等分高度
            i = 1;
            var _loop_3 = function () {
                list = mapLevel[i];
                var len = list.length;
                if (list.length > 1) {
                    list.forEach(function (d, idx) {
                        if (idx) {
                            if (idx < len - 1) {
                                var nextOpen = list[idx + 1].open && list[idx + 1].children.length;
                                var currOpen = d.open && d.children.length;
                                if (!currOpen && nextOpen) {
                                    var tem_idx = idx;
                                    var temList = [];
                                    while (tem_idx >= 0) {
                                        if (list[tem_idx].pid === d.pid) {
                                            if (!list[tem_idx].open || !list[tem_idx].children.length) {
                                                temList.unshift(list[tem_idx]);
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                        else {
                                            break;
                                        }
                                        tem_idx--;
                                    }
                                    if (temList.length) {
                                        var upItem_1 = list[idx - temList.length];
                                        var downItem = list[idx + 1];
                                        if (upItem_1 && upItem_1.pid === downItem.pid) {
                                            var num_1 = (downItem.y - upItem_1.y) / (temList.length + 1);
                                            temList.forEach(function (tem, tem_i) {
                                                tem.y = upItem_1.y + num_1 * (tem_i + 1);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (!d.open || !d.children.length) {
                                if (list[idx + 1].pid === d.pid) {
                                    if (list[idx + 1].y - d.y > 50) {
                                        var top_num = parseInt(((list[idx + 1].y - 50 - d.y) / 2) + '');
                                        d.y = list[idx + 1].y - 50;
                                        var pItem = mapId[d.pid];
                                        while (pItem) {
                                            pItem.y += top_num;
                                            pItem = mapId[pItem.pid];
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                i++;
            };
            while (i <= max) {
                _loop_3();
            }
        };
        NodeReader.prototype.getLength = function (str) {
            return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
        };
        NodeReader.prototype.moreItemObj = function (d) {
            var id = "more_" + d.id + "_01";
            var tem = {
                id: id,
                _id: id,
                name: "展开",
                isMoreItem: true,
                pid: d._id,
                idx: 10,
                level: d.level + 1,
                moreOpen: false,
                children: []
            };
            return tem;
        };
        //渲染根节点
        NodeReader.prototype.renderRoot = function (rootItem) {
            var mapId = this.mapId;
            var mapLevel = this.mapLevel;
            var option = this.option;
            var maxInfo = this.maxInfo;
            var isRight = this.isRight;
            var self = this;
            var group = this.rootGroup.group().attr("class", "svg-root-node");
            rootItem.g = group;
            var w = rootItem.name.length * 14 + 32;
            var rect = group.rect(w, 40);
            rootItem.x = this.hw - w / 2;
            rootItem.y = this.hh - 20;
            group.transform({ x: rootItem.x, y: rootItem.y });
            var text = group.text(rootItem.name);
            text.font({
                size: 14
            });
            text.x(15);
            text.y(12);
            if (!isRight) {
                group.line(-35, 20, 0, 20);
            }
            var r_w = rect.width();
            rootItem.w = r_w;
            maxInfo[0] = r_w / 2;
            if (isRight) {
                group.line(r_w, 20, r_w + 35, 20);
            }
            this.rootRect = rect;
            var fn = function (g, tool, rootItem, $box) {
                var rect = g.rbox();
                var left = rect.x - 340 + 25;
                if (!isRight) {
                    left = rect.x + rect.width - 25;
                }
                var top = rect.y;
                if (option.detailInfoShowBefore) {
                    var t_falg = option.detailInfoShowBefore.call(tool, rootItem, $box);
                    //排除undefined
                    if (t_falg === false) {
                    }
                    else {
                        $(".info-box").css({
                            left: left + "px",
                            top: top + "px"
                        }).show();
                    }
                }
            };
            if (this.option.hasDetailInfo) {
                rect.on("mouseenter", function (e) {
                    fn(group, self, rootItem, $(".info-box"));
                });
                rect.on("mouseleave", function () {
                    if (option.hasDetailInfo) {
                        $(".info-box").hide();
                    }
                });
                text.on("mouseenter", function (e) {
                    fn(group, self, rootItem, $(".info-box"));
                });
                text.on("mouseleave", function () {
                    if (option.hasDetailInfo) {
                        $(".info-box").hide();
                    }
                });
            }
        };
        //渲染子节点
        NodeReader.prototype.childNode = function (isRight, item) {
            var mapId = this.mapId;
            var mapLevel = this.mapLevel;
            var option = this.option;
            var maxInfo = this.maxInfo;
            var self = this;
            if (item.g) {
                var g_1 = item.g;
                g_1.animate(this.option.anTime).transform({ x: item.x, y: item.y });
                this.updateState(item);
                return;
            }
            var g = this.nodeGroup.group();
            item.g = g;
            var rect = g.rect(item.w, 40);
            if (item.animateAdd) {
                if (isRight) {
                    g.transform({ x: item.px + item.pw, y: item.py }).animate(this.option.anTime).transform({
                        x: item.x,
                        y: item.y
                    });
                }
                else {
                    g.transform({ x: item.px - item.w, y: item.py }).animate(this.option.anTime).transform({
                        x: item.x,
                        y: item.y
                    });
                }
            }
            else if (item.animateMoreAdd) {
                g.opacity(0).transform({ x: item.x, y: item.py }).animate(this.option.anTime).opacity(1).transform({
                    x: item.x,
                    y: item.y
                });
            }
            else {
                g.transform({ x: item.x, y: item.y });
            }
            var text = g.text(item.name);
            text.font({
                size: 14
            });
            text.x(10);
            text.y(12);
            //点击事件
            if (this.option.nodeClick) {
                rect.on("click", function () {
                    option.nodeClick.call(this, item);
                });
                text.on("click", function () {
                    option.nodeClick.call(this, item);
                });
            }
            var text_rbox = text.rbox();
            var tr = this.rootGroup.matrixify();
            if (isRight) {
                //计算缩放 width
                item.op_x = (text_rbox.width / tr.d) + 5 + 10;
            }
            else {
                item.op_x = 8;
            }
            item.op_y = text_rbox.y;
            if (item.children && item.children.length) {
                if (!isRight) {
                    text.x(30);
                }
                var stateG = this.renderState(g, item);
                g.attr("class", "svg-csp").attr("data-id", item._id);
                stateG.on("click", this.openClick, this);
            }
            //nodeClick
            item.rect = rect;
            if (isRight) {
                if (item.animateAdd) {
                    item.hLine = g.line(0, 20, 0, 20);
                    item.hLine.animate(this.option.anTime).plot(-35, 20, 0, 20);
                }
                else {
                    item.hLine = g.line(-35, 20, 0, 20);
                }
            }
            else {
                if (item.animateAdd) {
                    item.hLine = g.line(item.w, 20, item.w, 20);
                    item.hLine.animate(this.option.anTime).plot(item.w, 20, item.w + 35, 20);
                }
                else {
                    item.hLine = g.line(item.w, 20, item.w + 35, 20).stroke({
                        width: this.lineWidth
                    });
                }
            }
            if (item.isMoreItem) {
                if (!isRight) {
                    text.x(30);
                }
                var state_g = this.renderState(g, item);
                text.font({
                    size: 14
                });
                g.attr("class", "svg-more").attr("data-id", item._id).attr("data-pid", item.pid);
                state_g.on("click", function (e) {
                    self.moreClick(e, item, self);
                });
            }
            else {
                g.attr("class", "svg-node").addClass("level-" + item.level);
            }
            g.on("mouseenter", function (e) {
                self.mouseenter(e, item, self);
            });
            g.on("mouseleave", function (e) {
                self.mouseleave(e, item, self);
            });
        };
        //更新状态 + -
        NodeReader.prototype.updateState = function (item) {
            var g = item.op_g;
            if (g) {
                var line = g.select("line").get(1);
                line && line.remove();
                if (item.isMoreItem) {
                    if (!item.moreOpen) {
                        g.line(7.5, 4, 7.5, 11).stroke({ width: 1 });
                    }
                }
                else {
                    if (!item.open) {
                        g.line(7.5, 4, 7.5, 11).stroke({ width: 1 });
                    }
                }
            }
        };
        //关闭item子节点 item 要关闭的item posItem 动画定位到的item 默认为item
        NodeReader.prototype.closeItemChildren = function (item, posItem, isResetPos) {
            var mapId = this.mapId;
            var mapLevel = this.mapLevel;
            var option = this.option;
            var maxInfo = this.maxInfo;
            var infoList = this.infoList;
            if (!posItem) {
                posItem = item;
            }
            var queue = [];
            var fn = function (list) {
                $.each(list, function (idx, d) {
                    var info_i = infoList.indexOf(d);
                    if (info_i >= 0) {
                        infoList.splice(info_i, 1);
                    }
                    var map_i = mapLevel[d.level].indexOf(d);
                    if (map_i >= 0) {
                        mapLevel[d.level].splice(map_i, 1);
                    }
                    if (mapId[d._id]) {
                        queue.push(mapId[d._id]);
                        delete mapId[d._id];
                    }
                    if (d.children) {
                        if (d.children.length && d.open) {
                            fn(d.children);
                        }
                    }
                });
            };
            fn(item.children);
            isResetPos && this.calcItemPos(this.isRight);
            if (this.isRight) {
                queue.forEach(function (d, idx) {
                    d.g.animate(option.anTime).opacity(0).translate(posItem.x + posItem.w, posItem.y).after(function () {
                        this.remove();
                    });
                    d.hLine.animate(option.anTime).x(0);
                    d.rightLine && d.rightLine.animate(option.anTime).width(0).after(function () {
                        this.remove();
                        d.rightLine = null;
                    });
                    d.vLine && d.vLine.animate(option.anTime).x(posItem.x + posItem.w).y(posItem.y).height(40).after(function () {
                        this.remove();
                        d.vLine = null;
                    });
                });
                item.rightLine && item.rightLine.animate(this.option.anTime).width(0).after(function () {
                    this.remove();
                    item.rightLine = null;
                });
                item.vLine && item.vLine.animate(this.option.anTime).x(item.x + item.w).y(item.y).height(40).after(function () {
                    this.remove();
                    item.vLine = null;
                });
            }
            else {
                queue.forEach(function (d, idx) {
                    d.g.animate(this.option.anTime).opacity(0).translate(posItem.x - d.w, posItem.y).after(function () {
                        this.remove();
                    });
                    d.hLine.animate(this.option.anTime).x(0);
                    d.rightLine && d.rightLine.animate(this.option.anTime).plot(0, 20, 0, 20).after(function () {
                        this.remove();
                        d.rightLine = null;
                    });
                    d.vLine && d.vLine.animate(this.option.anTime).x(posItem.x).y(posItem.y).height(40).after(function () {
                        this.remove();
                        d.vLine = null;
                    });
                });
                item.rightLine && item.rightLine.animate(this.option.anTime).plot(0, 20, 0, 20).after(function () {
                    this.remove();
                    item.rightLine = null;
                });
                item.vLine && item.vLine.animate(this.option.anTime).x(item.x).y(item.y).height(40).after(function () {
                    this.remove();
                    item.vLine = null;
                });
            }
        };
        //渲染+ - 按钮状态
        NodeReader.prototype.renderState = function (group, item) {
            var g = group.group().attr("class", "node-op-state");
            item.op_g = g;
            g.transform({ x: item.op_x, y: 13 });
            g.circle(15).stroke({ width: 1 });
            g.line(4, 7.5, 11, 7.5).stroke({ width: 1 });
            if (item.isMoreItem) {
                if (!item.moreOpen) {
                    g.line(7.5, 4, 7.5, 11).stroke({ width: 1 });
                }
            }
            else {
                if (!item.open) {
                    g.line(7.5, 4, 7.5, 11).stroke({ width: 1 });
                }
            }
            return g;
        };
        //渲染线条
        NodeReader.prototype.renderLine = function (isRight, item) {
            var g = item.g;
            if (item.open && item.children.length) {
                var frist = item.children[0];
                var last = item.children[item.children.length - 1];
                var centerX = void 0;
                if (isRight) {
                    centerX = frist.x - item.x - 35;
                    if (item.rightLine) {
                        item.rightLine.animate(this.option.anTime).width(centerX - item.w);
                    }
                    else {
                        if (item.animateAdd) {
                            item.rightLine = g.line(item.w, 20, item.w, 20);
                            // item.hLine.animate(option.anTime).plot(-35, 20, 0, 20);
                            item.rightLine.animate(this.option.anTime).plot(item.w, 20, centerX, 20);
                        }
                        else {
                            item.rightLine = g.line(item.w, 20, centerX, 20);
                        }
                    }
                    //  let centerY = frist.y + (last.y + 40 - frist.y) / 2;
                    if (item.children.length > 1) {
                        if (item.vLine) {
                            item.vLine.animate(this.option.anTime).x(item.x + centerX).y(frist.y + 20).height(last.y - frist.y);
                        }
                        else {
                            if (item.animateAdd) {
                                item.vLine = this.lineGroup.line(item.x + item.w, item.y + 20, item.x + item.w, item.y + 20).attr("data-id", item._id);
                                item.vLine.animate(this.option.anTime).plot(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20);
                            }
                            else {
                                item.vLine = this.lineGroup.line(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20).attr("data-id", item._id);
                            }
                        }
                    }
                }
                else {
                    centerX = item.x - frist.x - frist.w - 35;
                    if (item.rightLine) {
                    }
                    else {
                        if (item.animateAdd) {
                            //item.w, 20, item.w, 20
                            item.rightLine = g.line(0, 20, 0, 20);
                            item.rightLine.animate(this.option.anTime).plot(0, 20, -centerX, 20);
                        }
                        else {
                            item.rightLine = g.line(0, 20, -centerX, 20);
                        }
                    }
                    if (item.children.length > 1) {
                        if (item.vLine) {
                            // item.vLine.animate(option.anTime).y(frist.y + 20)
                            item.vLine.animate(this.option.anTime).x(item.x - centerX).y(frist.y + 20).height(last.y - frist.y);
                        }
                        else {
                            if (item.animateAdd) {
                                //item.x + item.w, item.y + 20, item.x + item.w, item.y + 20
                                item.vLine = this.lineGroup.line(item.x, item.y + 20, item.x, item.y + 20).attr("data-id", item._id);
                                item.vLine.animate(this.option.anTime).plot(item.x - centerX, frist.y + 20, item.x - centerX, last.y + 20);
                            }
                            else {
                                item.vLine = this.lineGroup.line(item.x - centerX, frist.y + 20, item.x - centerX, last.y + 20).attr("data-id", item._id);
                            }
                        }
                    }
                }
            }
        };
        //处理数据
        NodeReader.prototype.conventData = function (list) {
            this.mapLevel = {};
            this.mapId = {};
            this.infoList = [];
            var self = this;
            var fn = function (list, mapLevel, mapId, infoList, level, pid) {
                list.forEach(function (d, idx) {
                    if (level > self.option.renderLevel) {
                        return;
                    }
                    d.level = level;
                    d.idx = idx;
                    d.pid = pid;
                    d._id = d.id;
                    d.childrenList = d.children || [];
                    if (idx >= 10) {
                        return;
                    }
                    if (!mapLevel[level.toString()]) {
                        mapLevel[level.toString()] = [];
                    }
                    mapLevel[level.toString()].push(d);
                    if (!d._id || mapId[d._id]) {
                        d._id = pid + "_" + new Date().getTime() + "_" + idx;
                    }
                    mapId[d._id] = d;
                    d.open = level < self.option.renderLevel;
                    infoList.push(d);
                    if (d.children) {
                        if (d.children.length) {
                            fn(d.children, mapLevel, mapId, infoList, level + 1, d._id);
                        }
                    }
                    else {
                        d.children = [];
                    }
                });
            };
            fn(list, this.mapLevel, this.mapId, this.infoList, 1, this.data._id);
            this.infoList.forEach(function (d, i) {
                if (d.children.length > 10) {
                    var child_1 = [], moreList_1 = [];
                    d.children.forEach(function (k, idx) {
                        if (idx < 10) {
                            child_1.push(k);
                        }
                        else if (idx === 10) {
                            var tem = {
                                id: "more_" + d._id + "_01",
                                _id: "more_" + d._id + "_01",
                                name: "展开",
                                isMoreItem: true,
                                pid: d._id,
                                idx: idx,
                                level: d.level + 1,
                                moreOpen: false,
                                children: []
                            };
                            self.mapId[tem._id] = tem;
                            self.infoList.push(tem);
                            var upItem = d.children[9];
                            var upIdx = self.mapLevel[tem.level].indexOf(upItem);
                            self.mapLevel[tem.level].splice(upIdx + 1, 0, tem);
                            child_1.push(tem);
                        }
                        else {
                            k.hide = true;
                            moreList_1.push(k);
                        }
                    });
                    d.moreOpen = false;
                    d.children = child_1;
                    d.moreList = moreList_1;
                    d.hasMore = true;
                }
            });
        };
        return NodeReader;
    }());
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
        CiteTree.prototype.init = function (obj) {
            var opt = $.extend({
                hw: this.hw,
                hh: this.hh,
                rootGroup: this.rootGroup
            }, this.option);
            this._jData = JSON.parse(JSON.stringify(obj));
            this.rightGroup = new NodeReader(true, obj, opt);
            // this.leftGroup = new NodeReader(false, obj, opt);
            this.rootGroup.scale(this.option.scale || 1);
        };
        //转为tree型 list
        CiteTree.prototype.convertTreeData = function (list) {
            var repMap = {};
            var temList = [];
            //去除重复
            list.forEach(function (d) {
                if (!repMap[d.id]) {
                    repMap[d.id] = d;
                    var a_1 = $.extend(d);
                    temList.push($.extend(d, { isOpen: false, children: [] }));
                }
            });
            var map = {}, treeData = [];
            temList.forEach(function (d) {
                map[d.id] = d;
            });
            temList.forEach(function (d) {
                if (d.pid) {
                    if (map[d.pid]) {
                        map[d.pid].children.push(d);
                    }
                }
            });
            for (var key in map) {
                if (!map[key].pid) {
                    treeData.push(map[key]);
                }
            }
            return treeData;
        };
        CiteTree.prototype.bindEvent = function () {
            var draw = this.draw;
            var isDown = false, x1, y1, x, y;
            var self = this, box_dom = this.box_dom;
            //拖动事件
            $(window).on("mousedown.relation", function (e) {
                console.log(234);
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
                $(box_dom).removeClass("svg-move");
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
