interface CiteData {
    _id: any,
    id: any,
    x: number,
    y: number,
    right_vLine?: svgjs.Line,
    left_vLine?: svgjs.Line,
    children: Array<CiteData>[];
}


class NodeReader {
    private mapLevel: {};
    private mapId: {};
    private infoList: any[];
    private maxInfo: any[];
    private lineWidth: number;
    private option: any;
    private isRight: any;
    private data: CiteData;
    private rootGroup: svgjs.G;
    private halfGroup: svgjs.G;
    private lineGroup: svgjs.G;
    private nodeGroup: svgjs.G;
    hw: number;
    hh: any;
    rootRect: any;

    constructor(isRight: boolean, data: CiteData, option) {
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


    init(data) {
        data._id = data.id || "root";
        data.open = true;
        this.data = data;
        this.renderRoot(data);
        this.createGroup();
        let firstList = data.children;
        if (firstList && firstList.length) {
            let half = Math.ceil(firstList.length / 2);
            let leftList = [], rightList = [];
            $.each(firstList, function (idx, item) {
                //  if (idx < half) {
                rightList.push(item);
                // } else {
                //     leftList.push(item);
                // }
            });
            if (this.isRight) {
                this.conventData(rightList);
            } else {
                this.conventData(leftList);
            }
            this.mapId[data._id] = data;
            this.calcItemPos(this.isRight);
            this.render(this.isRight, true);
        }
    }

    createGroup() {
        let halfGroup = this.rootGroup.group();
        let nodeGroup = halfGroup.group();
        let lineGroup = halfGroup.group();
        this.halfGroup = halfGroup;
        this.lineGroup = lineGroup;
        this.nodeGroup = nodeGroup;
    }

    getItemById(_id) {
        if (this.mapId[_id]) {
            return this.mapId[_id];
        } else {
            return null;
        }
    }

    //寻找到上一个展开的iten ,用来获取y位置
    getPrevItem(list, idx) {
        let item = list[idx - 1];
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
    }

    //寻找到下一个展开的iten ,用来重置y位置
    getNextItem(list, idx) {
        if (idx >= list.length - 1) {
            return null;
        }
        let item = list[idx + 1];
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
    }

    //获取间隔 最小间隔为40
    getSpace(list, prevItem, item) {
        let pi = list.indexOf(prevItem);
        let idx = list.indexOf(item);
        let num = idx - pi - 1;
        let p = num * 50 + 10 + 40;           //50 :h+10 40:原最小间隔
        let space = p - (prevItem.children.length * 50 - 10) / 2 - (item.children.length * 50 - 10) / 2;
        return space < 40 ? 40 : space;
    }

    //鼠标移入事件
    mouseenter(e, item, self) {
        let rect = item.g.rbox();
        let left = rect.x - 340 + 25;
        if (!this.isRight) {
            left = rect.x + rect.width - 25;
        }
        let top = rect.y;
        if (this.option.hasDetailInfo) {
            if (this.option.detailInfoShowBefore) {
                let t_falg = this.option.detailInfoShowBefore.call(this, item, $(".info-box"));
                //排除undefined
                if (t_falg === false) {

                } else {
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
                        [self.x + self.w, self.y + 20]])
                        .fill("transparent")
                        .addClass(self.option.lineHoverCls);
                } else {
                    this.hover_polyline = self.lineGroup.polyline([
                        [this.x + this.w, this.y + 20],
                        [this.x + this.w + 35, this.y + 20],
                        [this.x + this.w + 35, self.y + 20],
                        [self.x, self.y + 20]])
                        .fill("transparent")
                        .addClass(self.option.lineHoverCls);

                }
                this.hLine.hide();
            });
            item.vLine && item.vLine.hide();
            item.rightLine && item.rightLine.hide();
        }
        if (self.mapId[item.pid]) {
            let pItem = self.mapId[item.pid];
            if (self.isRight) {
                if (item.level == 1) {
                    let m = self.halfGroup.matrixify();
                    pItem = {
                        x: pItem.x,
                        w: pItem.w,
                        y: pItem.y - m.f
                    }
                }
                item.hover_polyline = self.lineGroup.polyline([
                    [item.x, item.y + 20],
                    [item.x - 35, item.y + 20],
                    [item.x - 35, pItem.y + 20],
                    [pItem.x + pItem.w, pItem.y + 20]])
                    .fill("transparent")

                    .addClass(self.option.lineHoverCls)
                    .addClass("left-link-hover");
            } else {
                if (item.level == 1) {
                    let m = self.halfGroup.matrixify();
                    pItem = {
                        x: pItem.x,
                        w: pItem.w,
                        y: pItem.y - m.f
                    }
                }
                item.hover_polyline = self.lineGroup.polyline([
                    [item.x + item.w, item.y + 20],
                    [item.x + item.w + 35, item.y + 20],
                    [item.x + item.w + 35, pItem.y + 20],
                    [pItem.x, pItem.y + 20]])
                    .fill("transparent")
                    .addClass(self.option.lineHoverCls)
                    .addClass("left-link-hover");
            }
        }
    }

    //鼠标移出事件
    mouseleave(e, item, self) {
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
    }

    //单击事件
    openClick(e, item, self) {
        let node = e.target.parentNode;
        if ((node.getAttribute("class") || "").indexOf("svg-node") === -1) {
            node = node.parentNode;
        }
        let _id = node.getAttribute("data-id");
        // let item = self.mapId[_id];

        let mapId = self.mapId;
        let mapLevel = self.mapLevel;
        let isRight = self.isRight;
        let option = self.option;

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
        } else {
            item.open = true;
            let temList = [];
            let pid = item._id;
            let fn = function (list) {
                $.each(list, function (idx, d) {
                    if (idx < 10) {
                        d.idx = idx;
                        d._id = d.id;
                        d.hide = false;
                        d.open = false;
                        d.pid = pid;
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

                        temList.push(d);
                    }

                });
            };
            fn(item.childrenList);
            if (item.childrenList.length > 10) {
                let mItem = this.moreItemObj(item);
                item.moreOpen = false;
                mapId[mItem._id] = mItem;
                temList.push(mItem);
            }
            item.children = temList;
            let list = mapLevel[item.level];
            let idx = list.indexOf(item);
            if (idx > 0) {
                let upItem = this.getPrevItem(list, idx);
                if (upItem) {
                    let lastItem = upItem.children[upItem.children.length - 1];
                    let lastIdx = mapLevel[upItem.level + 1].indexOf(lastItem);
                    Array.prototype.splice.apply(mapLevel[item.level + 1], [lastIdx + 1, 0].concat(temList));

                } else {
                    Array.prototype.splice.apply(mapLevel[item.level + 1], [0, 0].concat(temList));
                }
            } else {
                Array.prototype.splice.apply(mapLevel[item.level + 1], [0, 0].concat(temList));
            }

            temList.forEach(function (d) {
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


    }

    //更多点击事件
    moreClick(e, _item, self) {
        let node = e.target.parentNode;
        if (node.getAttribute("class") !== "svg-more") {
            node = node.parentNode;
        }
        let mapId = self.mapId;
        let mapLevel = self.mapLevel;
        let isRight = self.isRight;
        let option = self.option;

        let pid = node.getAttribute("data-pid");

        function celHover() {
            let _id = node.getAttribute("data-id");
            let item = mapId[_id];
            if (item && item.hover_polyline) {
                item.hover_polyline.remove();
                item.hover_polyline = null;
            }
        }

        celHover();
        let item = mapId[pid];
        if (!item) {
            return;
        }
        if (item.childrenList.length < 10) {
            return;
        }
        //收起
        if (item.moreOpen) {
            item.moreOpen = false;
            let temList = [];
            let len = item.children.length;
            let removeList = [];
            $.each(item.children, function (i, d) {
                if (i > 9 && i < len - 1) {
                    d.hide = true;
                    let idx = mapLevel[item.level + 1].indexOf(d);
                    if (idx >= 0) {
                        mapLevel[item.level + 1].splice(idx, 1);
                    }
                    removeList.push(d);
                } else {
                    temList.push(d);
                }
            });
            item.children = temList;
            let lastItem = item.children[item.children.length - 1];
            lastItem.name = "展开";
            lastItem.g.select("text").get(0).text(lastItem.name);
            lastItem.moreOpen = false;
            self.calcItemPos(isRight);
            let tem = temList[9];
            removeList.forEach(function (d, idx) {
                d.g.animate(option.anTime).opacity(0).y(tem.y + 40).after(function () {
                    this.remove();
                });
                //d.hLine.animate(option.anTime).x(0);
                if (d.open) {
                    self.closeItemChildren(d, tem, false)
                }
            });
            self.render(isRight);
        } else {
            item.moreOpen = true;
            let temList = [];
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
                    temList.push(d);
                }
            });
            Array.prototype.splice.apply(item.children, [10, 0].concat(temList));
            let lastItem = item.children[item.children.length - 1];
            let idx = mapLevel[item.level + 1].indexOf(lastItem);
            Array.prototype.splice.apply(mapLevel[item.level + 1], [idx, 0].concat(temList));
            lastItem.name = "收缩";
            lastItem.g.select("text").get(0).text(lastItem.name);
            lastItem.moreOpen = true;
            self.calcItemPos(isRight);
            let temItem = item.children[9];
            temList.forEach(function (d) {
                d.py = temItem.y;
            });
            self.render(isRight);
        }
    }

    //渲染
    render(isRight, isInit) {
        let mapId = this.mapId;
        let mapLevel = this.mapLevel;
        let option = this.option;

        let keys = [];
        for (let key in mapLevel) {
            keys.push(Number(key));
        }
        let max = Math.max.apply(Math, keys);
        let idx = max, temList;
        let self = this;
        while (idx > 0) {
            temList = mapLevel[idx];
            $.each(temList, function (i, d) {
                if (d.hide) {

                } else {
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
        let list = mapLevel[1];
        let r_frist = list[0];
        let r_last = list[list.length - 1];
        let r_centerX;
        if (isRight) {
            r_centerX = r_frist.x - 35;
        } else {
            r_centerX = r_frist.x + r_frist.w + 35;
        }

        // --height -> cy
        if (isRight) {
            if (this.data.right_vLine) {
                this.data.right_vLine.animate(option.anTime).y(r_frist.y + 20).height(r_last.y - r_frist.y);
            } else {
                this.data.right_vLine = this.lineGroup.line(r_centerX, r_frist.y + 20, r_centerX, r_last.y + 20).attr("data-id", this.data._id);
            }

        } else {
            if (this.data.left_vLine) {
                this.data.left_vLine.animate(option.anTime).y(r_frist.y + 20).height(r_last.y - r_frist.y);
            } else {
                this.data.left_vLine = this.lineGroup.line(r_centerX, r_frist.y + 20, r_centerX, r_last.y + 20).attr("data-id", this.data._id);
            }
        }
        let r_centerY = r_frist.y + (r_last.y + 40 - r_frist.y) / 2;
        if (isInit) {
            this.halfGroup.y(-(r_centerY - this.hh))
        } else {
            this.halfGroup.animate(option.anTime).y(-(r_centerY - this.hh));
        }
    }

    //计算位置
    calcItemPos(isRight) {
        let mapId = this.mapId;
        let mapLevel = this.mapLevel;
        let option = this.option;
        let maxInfo = this.maxInfo;

        let self = this;
        let keys = [];
        for (let key in mapLevel) {
            keys.push(Number(key));
        }
        let max = Math.max.apply(Math, keys);
        let idx = max, list;

        function getSpace(item) {
            if (item.idx) {
                return 10;
            } else {
                if (mapLevel[item.level].indexOf(item) === 0) {
                    return 0;
                } else {
                    return 40;
                }
            }
        }

        function getH(item) {
            let frist = item.children[0];
            let last = item.children[item.children.length - 1];
            let centerY;
            if (item.hasMore) {
                if (!item.moreOpen) {
                    last = item.children[8];
                } else {
                    last = item.children[item.children.length - 2];
                }
                centerY = frist.y + (last.y + 50 + 40 - frist.y) / 2;
                item.vLineH = last.y + 50 - frist.y;
            } else {
                centerY = frist.y + (last.y + 40 - frist.y) / 2;
                item.vLineH = last.y - frist.y;
            }
            item.centerY = centerY;
        }

        let i = 1;
        //默认排列位置
        while (i <= max) {
            list = mapLevel[i];
            let max_w = 0;
            $.each(list, function (di, d) {
                let w = self.getLength(d.name) * 14 / 2 + 20;//20 padding
                if (d.children.length || d.isMoreItem) {
                    w += 20;  //展开收缩按钮
                }
                d.w = w;
                max_w = Math.max(max_w, w);
                let off_x = 0;
                $.each(maxInfo, function (mi, m) {
                    if (mi < d.level) {
                        off_x += m;
                    }
                });
                if (isRight) {
                    d.x = self.hw + off_x + d.level * 70;
                } else {
                    d.x = self.hw - d.w - off_x - d.level * 70;
                }
            });

            maxInfo[i] = max_w;
            i++;
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
                        } else {
                            if (i) {
                                d.y = list[i - 1].y + 40 + d.space;
                            } else {
                                d.y = 0
                            }
                        }
                    } else {
                        if (i) {
                            d.y = list[i - 1].y + 40 + d.space;
                        } else {
                            d.y = 0
                        }
                    }
                    d.h = 40;
                });

                idx--;
            }
        }

        calcParentItem();
        let hasRepeat = true;
        let count = 1;
        while (hasRepeat && count < 10) {
            hasRepeat = false;
            i = 1;
            count++;
            while (i <= max) {
                list = mapLevel[i];
                let fn = function (list, t) {
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
                        let num = d.y - list[idx - 1].y;
                        let top = 50;
                        if (d.pid !== list[idx - 1].pid) {
                            top = 80;
                        }
                        if (num < top) {
                            hasRepeat = true;
                            let t = top - num;
                            d.y += t;
                            if (d.children.length) {
                                fn(d.children, t);
                            }
                        }
                    }
                });
                i++;
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
        while (i <= max) {
            list = mapLevel[i];
            let len = list.length;
            if (list.length > 1) {
                list.forEach(function (d, idx) {
                    if (idx) {
                        if (idx < len - 1) {
                            let nextOpen = list[idx + 1].open && list[idx + 1].children.length;
                            let currOpen = d.open && d.children.length;
                            if (!currOpen && nextOpen) {
                                let tem_idx = idx;
                                let temList = [];
                                while (tem_idx >= 0) {
                                    if (list[tem_idx].pid === d.pid) {
                                        if (!list[tem_idx].open || !list[tem_idx].children.length) {
                                            temList.unshift(list[tem_idx]);
                                        } else {
                                            break;
                                        }
                                    } else {
                                        break;
                                    }
                                    tem_idx--;
                                }
                                if (temList.length) {
                                    let upItem = list[idx - temList.length];
                                    let downItem = list[idx + 1];
                                    if (upItem && upItem.pid === downItem.pid) {
                                        let num = (downItem.y - upItem.y) / (temList.length + 1);
                                        temList.forEach(function (tem, tem_i) {
                                            tem.y = upItem.y + num * (tem_i + 1);
                                        })
                                    }
                                }
                            }
                        }
                    } else {
                        if (!d.open || !d.children.length) {
                            if (list[idx + 1].pid === d.pid) {
                                if (list[idx + 1].y - d.y > 50) {
                                    let top_num = parseInt(((list[idx + 1].y - 50 - d.y) / 2) + '');
                                    d.y = list[idx + 1].y - 50;
                                    let pItem = mapId[d.pid];
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
        }
    }

    getLength(str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    }

    moreItemObj(d) {
        let id = "more_" + d.id + "_01";
        let tem = {
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
    }

    //渲染根节点
    renderRoot(rootItem) {
        let mapId = this.mapId;
        let mapLevel = this.mapLevel;
        let option = this.option;
        let maxInfo = this.maxInfo;
        let isRight = this.isRight;
        let self = this;

        let group = this.rootGroup.group().attr("class", "svg-root-node");
        rootItem.g = group;
        let w = rootItem.name.length * 14 + 32;
        let rect = group.rect(w, 40);
        rootItem.x = this.hw - w / 2;
        rootItem.y = this.hh - 20;
        group.transform({x: rootItem.x, y: rootItem.y});
        let text = group.text(rootItem.name);
        text.font({
            size: 14
        });
        text.x(15);
        text.y(12);
        if (!isRight) {
            group.line(-35, 20, 0, 20);
        }
        let r_w = rect.width();
        rootItem.w = r_w;
        maxInfo[0] = r_w / 2;
        if (isRight) {
            group.line(r_w, 20, r_w + 35, 20);
        }
        this.rootRect = rect;
        let fn = function (g, tool, rootItem, $box) {
            let rect = g.rbox();
            let left = rect.x - 340 + 25;
            if (!isRight) {
                left = rect.x + rect.width - 25;
            }
            let top = rect.y;
            if (option.detailInfoShowBefore) {
                let t_falg = option.detailInfoShowBefore.call(tool, rootItem, $box);
                //排除undefined
                if (t_falg === false) {

                } else {
                    $(".info-box").css({
                        left: left + "px",
                        top: top + "px"
                    }).show();
                }


            }


        }
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
    }

    //渲染子节点
    childNode(isRight, item) {
        let mapId = this.mapId;
        let mapLevel = this.mapLevel;
        let option = this.option;
        let maxInfo = this.maxInfo;

        let self = this;
        if (item.g) {
            let g = item.g;
            g.animate(this.option.anTime).transform({x: item.x, y: item.y});
            this.updateState(item);
            return;
        }
        let g = this.nodeGroup.group();
        item.g = g;
        let rect = g.rect(item.w, 40);


        if (item.animateAdd) {
            if (isRight) {
                g.transform({x: item.px + item.pw, y: item.py}).animate(this.option.anTime).transform({
                    x: item.x,
                    y: item.y
                });
            } else {
                g.transform({x: item.px - item.w, y: item.py}).animate(this.option.anTime).transform({
                    x: item.x,
                    y: item.y
                });
            }
        } else if (item.animateMoreAdd) {
            g.opacity(0).transform({x: item.x, y: item.py}).animate(this.option.anTime).opacity(1).transform({
                x: item.x,
                y: item.y
            });
        } else {
            g.transform({x: item.x, y: item.y});
        }
        let text = g.text(item.name);
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
        let text_rbox = text.rbox();
        let tr = this.rootGroup.matrixify();
        if (isRight) {
            //计算缩放 width
            item.op_x = (text_rbox.width / tr.d) + 5 + 10;
        } else {
            item.op_x = 8;
        }

        item.op_y = text_rbox.y;
        if (item.children && item.children.length) {
            if (!isRight) {
                text.x(30);
            }
            let stateG = this.renderState(g, item);
            g.attr("class", "svg-csp").attr("data-id", item._id);
            stateG.on("click", this.openClick, this);
        }
        //nodeClick
        item.rect = rect;
        if (isRight) {
            if (item.animateAdd) {
                item.hLine = g.line(0, 20, 0, 20);
                item.hLine.animate(this.option.anTime).plot(-35, 20, 0, 20);
            } else {
                item.hLine = g.line(-35, 20, 0, 20);
            }
        } else {
            if (item.animateAdd) {
                item.hLine = g.line(item.w, 20, item.w, 20);
                item.hLine.animate(this.option.anTime).plot(item.w, 20, item.w + 35, 20);
            } else {
                item.hLine = g.line(item.w, 20, item.w + 35, 20).stroke({
                    width: this.lineWidth
                });
            }
        }

        if (item.isMoreItem) {
            if (!isRight) {
                text.x(30);
            }
            let state_g = this.renderState(g, item);
            text.font({
                size: 14
            });
            g.attr("class", "svg-more").attr("data-id", item._id).attr("data-pid", item.pid);
            state_g.on("click", function (e) {
                self.moreClick(e, item, self);
            });
        } else {
            g.attr("class", "svg-node").addClass("level-" + item.level);

        }
        g.on("mouseenter", function (e) {
            self.mouseenter(e, item, self);
        });
        g.on("mouseleave", function (e) {
            self.mouseleave(e, item, self)
        });
    }

    //更新状态 + -
    updateState(item) {
        let g = item.op_g;
        if (g) {
            let line = g.select("line").get(1);
            line && line.remove();
            if (item.isMoreItem) {
                if (!item.moreOpen) {
                    g.line(7.5, 4, 7.5, 11).stroke({width: 1});
                }
            } else {
                if (!item.open) {
                    g.line(7.5, 4, 7.5, 11).stroke({width: 1});
                }
            }
        }
    }

    //关闭item子节点 item 要关闭的item posItem 动画定位到的item 默认为item
    closeItemChildren(item, posItem, isResetPos) {
        let mapId = this.mapId;
        let mapLevel = this.mapLevel;
        let option = this.option;
        let maxInfo = this.maxInfo;
        let infoList = this.infoList;

        if (!posItem) {
            posItem = item;
        }
        let queue = [];
        let fn = function (list) {
            $.each(list, function (idx, d) {
                let info_i = infoList.indexOf(d);
                if (info_i >= 0) {
                    infoList.splice(info_i, 1);
                }
                let map_i = mapLevel[d.level].indexOf(d);
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
            })
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
        } else {
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
    }

    //渲染+ - 按钮状态
    renderState(group, item) {
        let g = group.group().attr("class", "node-op-state");
        item.op_g = g;
        g.transform({x: item.op_x, y: 13});
        g.circle(15).stroke({width: 1});
        g.line(4, 7.5, 11, 7.5).stroke({width: 1});
        if (item.isMoreItem) {
            if (!item.moreOpen) {
                g.line(7.5, 4, 7.5, 11).stroke({width: 1});
            }
        } else {
            if (!item.open) {
                g.line(7.5, 4, 7.5, 11).stroke({width: 1});
            }
        }
        return g;

    }

    //渲染线条
    renderLine(isRight, item) {
        let g = item.g;
        if (item.open && item.children.length) {
            let frist = item.children[0];
            let last = item.children[item.children.length - 1];
            let centerX;
            if (isRight) {
                centerX = frist.x - item.x - 35;
                if (item.rightLine) {
                    item.rightLine.animate(this.option.anTime).width(centerX - item.w)
                } else {
                    if (item.animateAdd) {
                        item.rightLine = g.line(item.w, 20, item.w, 20);
                        // item.hLine.animate(option.anTime).plot(-35, 20, 0, 20);
                        item.rightLine.animate(this.option.anTime).plot(item.w, 20, centerX, 20)
                    } else {
                        item.rightLine = g.line(item.w, 20, centerX, 20);
                    }
                }
                //  let centerY = frist.y + (last.y + 40 - frist.y) / 2;
                if (item.children.length > 1) {
                    if (item.vLine) {
                        item.vLine.animate(this.option.anTime).x(item.x + centerX).y(frist.y + 20).height(last.y - frist.y)
                    } else {
                        if (item.animateAdd) {
                            item.vLine = this.lineGroup.line(item.x + item.w, item.y + 20, item.x + item.w, item.y + 20).attr("data-id", item._id);
                            item.vLine.animate(this.option.anTime).plot(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20)
                        } else {
                            item.vLine = this.lineGroup.line(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20).attr("data-id", item._id);
                        }
                    }
                }
            } else {
                centerX = item.x - frist.x - frist.w - 35;
                if (item.rightLine) {

                } else {
                    if (item.animateAdd) {
                        //item.w, 20, item.w, 20
                        item.rightLine = g.line(0, 20, 0, 20);
                        item.rightLine.animate(this.option.anTime).plot(0, 20, -centerX, 20)
                    } else {
                        item.rightLine = g.line(0, 20, -centerX, 20);
                    }


                }
                if (item.children.length > 1) {
                    if (item.vLine) {
                        // item.vLine.animate(option.anTime).y(frist.y + 20)
                        item.vLine.animate(this.option.anTime).x(item.x - centerX).y(frist.y + 20).height(last.y - frist.y)
                    } else {
                        if (item.animateAdd) {
                            //item.x + item.w, item.y + 20, item.x + item.w, item.y + 20
                            item.vLine = this.lineGroup.line(item.x, item.y + 20, item.x, item.y + 20).attr("data-id", item._id);
                            item.vLine.animate(this.option.anTime).plot(item.x - centerX, frist.y + 20, item.x - centerX, last.y + 20)
                        } else {
                            item.vLine = this.lineGroup.line(item.x - centerX, frist.y + 20, item.x - centerX, last.y + 20).attr("data-id", item._id);
                        }

                    }
                }
            }
        }
    }

    //处理数据
    conventData(list) {
        this.mapLevel = {};
        this.mapId = {};
        this.infoList = [];
        let self = this;
        let fn = function (list, mapLevel, mapId, infoList, level, pid) {
            list.forEach(function (d, idx) {
                if (level > self.option.renderLevel) {
                    return
                }
                d.level = level;
                d.idx = idx;
                d.pid = pid;
                d._id = d.id;
                d.childrenList = d.children || [];
                if (idx >= 10) {
                    return
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
                } else {
                    d.children = [];
                }
            })
        };
        fn(list, this.mapLevel, this.mapId, this.infoList, 1, this.data._id);

        this.infoList.forEach(function (d, i) {
            if (d.children.length > 10) {
                let child = [], moreList = [];
                d.children.forEach(function (k, idx) {
                    if (idx < 10) {
                        child.push(k);
                    } else if (idx === 10) {
                        let tem = {
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
                        let upItem = d.children[9];
                        let upIdx = self.mapLevel[tem.level].indexOf(upItem);
                        self.mapLevel[tem.level].splice(upIdx + 1, 0, tem);
                        child.push(tem);
                    } else {
                        k.hide = true;
                        moreList.push(k);
                    }
                });
                d.moreOpen = false;
                d.children = child;
                d.moreList = moreList;
                d.hasMore = true;
            }
        });
    }
}


class CiteTree {
    private option: any;
    private width: number;
    private height: number;
    private hw: number;
    private hh: number;
    private draw: any;
    rootGroup;
    private readonly box_dom: HTMLElement;
    private scale: any;
    private _jData: any;
    private rightGroup: NodeReader;

    getDefs() {
        return {
            //动画时长
            anTime: 200,
            //初始渲染层级数量
            renderLevel: 2,
            scale: 1,
            //line hover 样式名称
            lineHoverCls: "line-hover"
        }
    }

    constructor(svg, option) {
        let def = this.getDefs();
        this.option = Object.assign({}, def, option);
        let box_dom = this.box_dom = document.getElementById(option.id);
        this.width = box_dom.offsetWidth;
        this.height = box_dom.offsetHeight;
        this.hw = this.width / 2;
        this.hh = this.height / 2;
        let draw = svg('svgBox').size(this.width, this.height);
        this.draw = draw;
        this.rootGroup = draw.group();
        this.bindEvent();
    }


    init(obj) {
        let opt = $.extend({
            hw: this.hw,
            hh: this.hh,
            rootGroup: this.rootGroup
        }, this.option);

        this._jData = JSON.parse(JSON.stringify(obj));
        this.rightGroup = new NodeReader(true, obj, opt);
        // this.leftGroup = new NodeReader(false, obj, opt);
        this.rootGroup.scale(this.option.scale || 1);
    }

    //转为tree型 list
    convertTreeData(list: Array<CiteData>) {
        let repMap = {};
        let temList = [];

        //去除重复
        list.forEach(d => {
            if (!repMap[d.id]) {
                repMap[d.id] = d;
                let a = $.extend(d)
                temList.push($.extend(d, {isOpen: false, children: []}));
            }
        });
        let map = {}, treeData = [];
        temList.forEach(d => {
            map[d.id] = d;
        });
        temList.forEach(d => {
            if (d.pid) {
                if (map[d.pid]) {
                    map[d.pid].children.push(d);
                }
            }
        });
        for (let key in map) {
            if (!map[key].pid) {
                treeData.push(map[key]);
            }
        }
        return treeData;
    }

    bindEvent() {

        $(".div-1").on("click", "p", function () {

            console.log(1, this.innerText)
        })

        $(".div-2").on("click", "p", function () {

            console.log(2, this.innerText)
        })

        $(".div-1").on("click", "p", function () {

            console.log(4, this.innerText)
        })
        $(".div-1").on("click", function () {

            console.log(5, this.innerText)
        })


        let draw = this.draw;
        let isDown = false, x1, y1, x, y;
        let self = this, box_dom = this.box_dom;
        //拖动事件
        $(window).on("mousedown.relation", function (e) {
            console.log(234)
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
            return false
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
            let direct = null;
            let scale = self.scale;
            if (e.wheelDelta) {
                direct = e.wheelDelta;
            } else {
                direct = -e.detail * 40;
            }
            let isUp = direct > 0;
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
            self.rootGroup.scale(scale);
            self.scale = scale;
        }

        draw.on("mousewheel", function (e) {
            drag(e);

            self.option.mousewheel && self.option.mousewheel.call(self, self.scale);
        });


    }


}

export default function a() {

}


export {
    CiteTree
}















