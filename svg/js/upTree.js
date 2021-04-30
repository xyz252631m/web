function UpTree(SVG, option) {
    var defs = {
        $box: null,
        draw: null,
        upList: [],
        downList: [],
        //是否可以缩放
        isDrag: false,
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

    SVG.on(window, 'resize.svg', this.resize, this);
    var isDown = false, x1, y1, x, y;
    //拖动事件
    $(window).on("mousedown.relation", function (e) {
        isDown = true;
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
            self.root.translate(x + e.pageX - x1, y + e.pageY - y1);
        }
    }).on("mouseup", function () {
        isDown = false;
    });


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

$.extend(UpTree.prototype, {
    init: function () {
        var self = this;
        var opt = this.opt;
        this._upData = JSON.parse(JSON.stringify(opt.upList));
        this._downData = JSON.parse(JSON.stringify(opt.downList));
        this.up_root = this.root.group();
        this.up_node = this.up_root.group();
        this.up_line = this.up_root.group();
        this.down_root = this.root.group();
        this.down_node = this.down_root.group();
        this.down_line = this.down_root.group();
        this.data_up = this.conventData(opt.upList, "_up001", true);
        this.data_down = this.conventData(opt.downList, "_down001", false);
        this.calcItemPos(opt.upList, this.data_up, true);
        this.calcItemPos(opt.downList, this.data_down);
        //渲染上部分
        this.initData(this.data_up, true, true);
        this.up_line.y(this.center[1] + 175)
        //渲染下部分
        this.initData(this.data_down, false, true);
        this.down_line.y(this.center[1] - 20);
        //渲染根节点
        this.renderCenter(this.rootItem);
    },
    initData: function (dataObj, isUp, isInit) {
        var mapLevel = dataObj.mapLevel, mapId = dataObj.mapId, infoList = dataObj.infoList;
        var keys = [];
        for (var key in mapLevel) {
            keys.push(Number(key));
        }
        var max = Math.max.apply(Math, keys);
        var idx = max, list;
        var self = this;
        while (idx > 0) {
            list = mapLevel[idx];
            $.each(list, function (i, d) {
                if (mapId[d.pid]) {
                    if (mapId[d.pid].open) {
                        if (isUp) {
                            self.renderUp(d);
                            self.renderUpLine(d);
                        } else {
                            self.renderDown(d);
                            self.renderDownLine(d);
                        }

                    }
                }
            });
            idx--;
        }
        var list = mapLevel[1] || [];
        if (list.length === 0) {
            return;
        }
        var r_frist = list[0];
        var r_last = list[list.length - 1];
        var r_centerX = r_frist.x + (r_last.x + 164 - r_frist.x) / 2;
        if (isInit) {
            if (isUp) {
                this.up_root.x(-(r_centerX - this.center[0]))
            } else {
                this.down_root.x(-(r_centerX - this.center[0]))
            }
        } else {
            if (isUp) {
                this.up_root.animate(this.opt.anTime).x(-(r_centerX - this.center[0]))
            } else {
                this.down_root.animate(this.opt.anTime).x(-(r_centerX - this.center[0]))
            }
        }
    },
    //resize 事件
    resize: function (e) {
        //  this.center[0] = parseInt(this.$box.width() / 2);
        //  this.center[1] = parseInt(this.$box.height() / 2);
    },
    conventData: function (treeList, rootId) {

        var mapLevel = {};
        var mapId = {};
        mapId[rootId] = {
            text: "",
            _id: rootId,
            id: rootId,
            open: true,
            w: 164,
            x: this.center[0],
            y: this.center[1],
            children: treeList
        };
        var infoList = [];
        var fn = function (list, mapLevel, mapId, infoList, level, pid) {
            list.forEach(function (d, idx) {
                if (level > 1) {
                    return
                }
                d.level = level;
                d.idx = idx;
                d.pid = pid;
                d.w = 164;
                d.h = 64;
                d._id = d.id;
                d.childrenList = d.children || [];
                if (!mapLevel[level.toString()]) {
                    mapLevel[level.toString()] = [];
                }
                mapLevel[level.toString()].push(d);
                if (!d._id || mapId[d._id]) {
                    d._id = pid + "_" + new Date().getTime() + "_" + idx;
                }
                mapId[d._id] = d;
                d.hasOpen = true;
                d.open = !!d.open;
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
        fn(treeList, mapLevel, mapId, infoList, 1, rootId);

        return {
            mapLevel: mapLevel,
            mapId: mapId,
            infoList: infoList
        }
    },
    //计算位置
    calcItemPos: function (treeList, dataObj, isUp) {
        var self = this;
        var mapLevel = dataObj.mapLevel, mapId = dataObj.mapId, infoList = dataObj.infoList;
        var maxInfo = [0];
        var keys = [];
        for (var key in mapLevel) {
            keys.push(Number(key));
        }
        var max = Math.max.apply(Math, keys);
        var idx = max, list;

        function getSpace(item) {
            if (item.idx) {
                return 16;
            } else {
                if (mapLevel[item.level].indexOf(item) === 0) {
                    return 0;
                } else {
                    return 36;
                }
            }
        }

        function getX(item) {
            var frist = item.children[0];
            var last = item.children[item.children.length - 1];
            item.centerX = frist.x + (last.x + 164 - frist.x) / 2;
        }

        var i = 1;
        //默认排列位置
        var yList = [20, 144, 370];
        while (i <= max) {
            list = mapLevel[i];
            $.each(list, function (di, d) {
                if (isUp) {
                    d.y = self.center[1] - yList[d.level] - 104 + 22;//上方item高度为104
                } else {
                    d.y = self.center[1] + yList[d.level] + 20;
                }
            });
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
                        if (d.open) {
                            getX(d);
                            d.x = d.centerX - 164 / 2;
                        } else {
                            if (i) {
                                d.x = list[i - 1].x + 164 + d.space;
                            } else {
                                d.x = 0;
                            }
                        }
                    } else {
                        if (i) {
                            d.x = list[i - 1].x + 164 + d.space;
                        } else {
                            d.x = 0
                        }
                    }
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
            while (i <= max) {
                list = mapLevel[i];
                var fn = function (list, t) {
                    $.each(list, function (idx, d) {
                        d.x += t;
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
                        var num = d.x - list[idx - 1].x;
                        var top = 180;
                        if (d.pid !== list[idx - 1].pid) {
                            top = 200;
                        }
                        if (num < top) {
                            hasRepeat = true;
                            var t = top - num;

                            d.x += t;
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
                                getX(d);
                                d.x = d.centerX - 164 / 2;
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
                                        } else {
                                            break;
                                        }
                                    } else {
                                        break;
                                    }
                                    tem_idx--;
                                }
                                if (temList.length) {
                                    var upItem = list[idx - temList.length];
                                    var downItem = list[idx + 1];
                                    if (upItem && upItem.pid === downItem.pid) {
                                        var num = (downItem.x - upItem.x) / (temList.length + 1);
                                        temList.forEach(function (tem, tem_i) {
                                            tem.x = upItem.x + num * (tem_i + 1);
                                        })
                                    }
                                }
                            }
                        }
                    } else {
                        if (!d.open || !d.children.length) {
                            if (list[idx + 1].pid === d.pid) {
                                if (list[idx + 1].x - d.x > 180) {
                                    var top_num = parseInt((list[idx + 1].x - 180 - d.x) / 2);
                                    d.x = list[idx + 1].x - 180;
                                    var pItem = mapId[d.pid];
                                    while (pItem) {
                                        pItem.x += top_num;
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
    },
    //渲染中心节点
    renderCenter: function (rootItem) {
        var self = this;
        if (rootItem.g) {
            rootItem.x = this.center[0] - rootItem.w / 2;
            rootItem.y = this.center[1] - 20;
            rootItem.g.transform({x: rootItem.x, y: rootItem.y});
            return;
        }
        var g = this.root.group().attr("class", "center-node");
        rootItem.g = g;
        var rect = g.rect(200, 40);
        var text = g.text(rootItem.name).x(15).dy(5);
        var text_rbox = text.rbox();
        rootItem.w = text_rbox.width + 32;


        rect.width(rootItem.w);
        rootItem.x = this.center[0] - rootItem.w / 2;
        rootItem.y = this.center[1] - 20;

        if (self.opt.leftImgPath) {
            var kaiju_image = g.image(self.opt.leftImgPath).addClass('node-op-add');
            kaiju_image.size(180, 40).move(-180 + 20, 0);
            kaiju_image.on("click", function () {
                self.opt.leftImgClick && self.opt.leftImgClick.call(self, rootItem)
            })
        }
        if (self.opt.rightImgPath) {
            var jieshou_image = g.image(self.opt.rightImgPath).addClass('node-op-add');
            jieshou_image.size(180, 40).move(rootItem.w - 20, 0);
            jieshou_image.on("click", function () {
                self.opt.rightImgClick && self.opt.rightImgClick.call(self, rootItem)
            })
        }


        g.transform({x: rootItem.x, y: rootItem.y});

        rect.on("mouseenter", function (e) {
            self.opt.enterRoot && self.opt.enterRoot.call(self, rootItem)
        });
        rect.on("mouseleave", function () {
            self.opt.leaveRoot && self.opt.leaveRoot.call(self, rootItem)
        });
        text.on("mouseenter", function (e) {
            self.opt.enterRoot && self.opt.enterRoot.call(self, rootItem)
        });
        text.on("mouseleave", function () {
            self.opt.leaveRoot && self.opt.leaveRoot.call(self, rootItem)
        });


    },
    //渲染上方item
    renderUp: function (item) {
        var self = this;
        if (item.g) {
            item.g.animate(this.opt.anTime).transform({x: item.x, y: item.y});
            self.updateChildState(item);
            return;
        }
        var g = this.up_node.group(), x = 9;
        item.g = g;
        var rect_g = g.group().addClass("up-item");
        if (item.animateAdd) {
            g.transform({x: item.px, y: item.py}).animate(this.opt.anTime).transform({
                x: item.x,
                y: item.y
            }).after(function () {
                rect_g.on("mouseenter", self.mouseenter, {self: self, item: item, isUp: true});
                rect_g.on("mouseleave", self.mouseleave, {self: self, item: item, isUp: true});
            });
        } else {
            g.transform({x: item.x, y: item.y});
            rect_g.on("mouseenter", this.mouseenter, {self: self, item: item, isUp: true});
            rect_g.on("mouseleave", this.mouseleave, {self: self, item: item, isUp: true});
        }
        item.rectUp = rect_g.rect(item.w, item.h).rx(2).ry(2).addClass("svg-up-rect");
        rect_g.off("click").on("click", function () {
            self.opt.upClick && self.opt.upClick(item);
        });
        rect_g.rect(item.w + 1, 4).x(-0.5).y(63).addClass("two-rect");
        var title = this.setCusNameLines(item.name, 20, 2);
        var text = rect_g.text(title[0]).font({size: 14}).fill("#333").x(x).y(8);
        if (title.length > 1) {
            text.build(true);
            text.tspan(title[1]).x(x).dy(19);
            text.build(false);
        }
        if (item.stockRightNum !== "") {
            rect_g.text(this.setCusName("持股数：" + item.stockRightNum, 23)).font({size: 12}).fill("#333").x(x).y(46);
        } else {
            rect_g.text(this.setCusName("认缴金额：" + item.amount, 23)).font({size: 12}).fill("#333").x(x).y(46);
        }

        // g.text("持股").font({size: 12}).fill("#65A1EA").x(40).y(70);
        g.text(this.setCusName(item.percent, 12)).font({size: 12}).fill("#65A1EA").x(100).y(70);
        var arrow = g.group().move(item.w / 2, item.h + 4);
        item.arrowUp = arrow.path("M0,0L0,20").stroke({
            color: "#ccc",
            width: 1
        }).marker("end", this.draw.defs().select("#arrow").first());
        if (item.children && item.children.length) {
            var add_g = g.group().move(item.w / 2 - 7, -16).addClass("node-op-add").addClass("op-add-up");
            add_g.circle(14).stroke({width: 1}).addClass("node-add");
            add_g.circle(14).addClass("node-add-loading").hide();
            add_g.line(3, 7, 11, 7).stroke({width: 1});
            if (!item.open) {
                add_g.line(7, 3, 7, 11).stroke({width: 1});
            }
            add_g.on("click", this.openClick, {item: item, self: self, isUp: true});
            item.add_g = add_g;
        }

    },
    //渲染下方item
    renderDown: function (item) {
        var self = this;
        if (item.g) {
            item.g.animate(this.opt.anTime).transform({x: item.x, y: item.y});
            self.updateChildState(item);
            return;
        }

        var g = this.down_node.group().addClass("down-item"), x = 9;
        item.g = g;
        var rect_g = g.group();
        if (item.animateAdd) {
            g.transform({x: item.px, y: item.py}).animate(this.opt.anTime).transform({
                x: item.x,
                y: item.y
            }).after(function () {
                rect_g.on("mouseenter", self.mouseenter, {self: self, item: item, isUp: false});
                rect_g.on("mouseleave", self.mouseleave, {self: self, item: item, isUp: false});
            });
        } else {
            g.transform({x: item.x, y: item.y});
            rect_g.on("mouseenter", this.mouseenter, {self: self, item: item, isUp: false});
            rect_g.on("mouseleave", this.mouseleave, {self: self, item: item, isUp: false});
        }


        item.rectDown = rect_g.rect(item.w, item.h).rx(2).ry(2).addClass("svg-down-rect");
        rect_g.rect(item.w + 1, 4).x(-0.5).y(63).addClass("two-rect");
        rect_g.off("click").on("click", function () {
            self.opt.downClick && self.opt.downClick(item);
        });
        var title = this.setCusNameLines(item.name, 20, 2);
        var text = rect_g.text(title[0]).font({size: 14}).fill("#333").x(x).y(8);
        if (title.length > 1) {
            text.build(true);
            text.tspan(title[1]).x(x).dy(19);
            text.build(false);
        }

        rect_g.text(this.setCusName("认缴金额：" + item.amount, 23)).font({size: 12}).fill("#333").x(x).y(46);
        g.text("持股").font({size: 12}).fill("#65A1EA").x(40).y(-15);
        g.text(this.setCusName(item.percent, 12)).font({size: 12}).fill("#65A1EA").x(100).y(-15);

        var arrow = g.group().move(item.w / 2, -20);
        //箭头
        item.arrowDown = arrow.path("M0,0L0,20").stroke({
            color: "#ccc",
            width: 1
        }).marker("end", this.draw.defs().select("#arrow").first());
        // if (item.hasOpen) {
        if (item.children && item.children.length) {
            var add_g = g.group().move(item.w / 2 - 7, item.h + 4).addClass("node-op-add");
            add_g.circle(14).stroke({width: 1}).addClass("node-add");
            add_g.circle(14).addClass("node-add-loading").hide();
            add_g.line(3, 7, 11, 7).stroke({width: 1});
            if (!item.open) {
                add_g.line(7, 3, 7, 11).stroke({width: 1});
            }
            add_g.on("click", this.openClick, {item: item, self: self, isUp: false})
            item.add_g = add_g;
        }
    },
    //显示添加loading
    showAddLoading: function (item) {
        if (item.add_g) {
            item.add_g.select("circle").get(0).hide();
            item.add_g.select("circle").get(1).show();
        }
    },
    //隐藏添加loading
    hideAddLoading: function (item) {
        item.timer = 0;
        if (item.add_g) {
            item.add_g.select("circle").get(0).show();
            item.add_g.select("circle").get(1).hide();
        }
    },
    //更新是否展开状态
    updateChildState: function (item) {
        if (item.add_g) {
            var line = item.add_g.select("line").get(1);
            if (item.open) {
                line && line.remove();
            } else {
                if (!line) {
                    item.add_g.line(7, 3, 7, 11).stroke({width: 1});
                }
            }
        }
    },
    //单击事件
    openClick: function (e) {
        var item = this.item, self = this.self, isUp = this.isUp;
        var dataObj = isUp ? self.data_up : self.data_down;
        var mapLevel = dataObj.mapLevel, mapId = dataObj.mapId, infoList = dataObj.infoList;
        // if (!item.children.length) {
        //     return;
        // }
        if (item.timer) {
            return;
        }
        //收起
        if (item.open) {
            item.open = false;
            self.closeItemChildren(item, item, true, dataObj, isUp);
            if (isUp) {
                self.initData(self.data_up, true);
            } else {
                self.initData(self.data_down);
            }
        } else {
            item.open = true;
            var temList = [];
            var pid = item._id;
            //处理数据
            var fn = function (list) {
                $.each(list, function (idx, d) {
                    d.hasOpen = !!d.hasOpen;
                    d.open = false;
                    d.idx = idx;
                    d._id = d.id;
                    d.pid = pid;
                    d.w = 164;
                    d.h = 64;
                    d.g = null;
                    d.lineDown = null;
                    d.lineUp = null;
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
                });
            };
            var callback = function () {
                item.children = temList;
                var list = mapLevel[item.level];
                var idx = list.indexOf(item);
                if (mapLevel[item.level + 1] === undefined) {
                    mapLevel[item.level + 1] = [];
                }
                if (idx > 0) {
                    var upItem = self.getPrevItem(list, idx);
                    if (upItem) {
                        var lastItem = upItem.children[upItem.children.length - 1];
                        var lastIdx = mapLevel[upItem.level + 1].indexOf(lastItem);
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

                if (isUp) {
                    self.calcItemPos(self.opt.upList, self.data_up, true);
                    item.animateAdd = true;
                    self.initData(self.data_up, true);
                } else {
                    self.calcItemPos(self.opt.downList, self.data_down);
                    item.animateAdd = true;
                    self.initData(self.data_down);
                }
            };
            //隐藏加号
            var hideAdd_g = function (item) {
                item.hasOpen = false;
                item.add_g && item.add_g.remove();
                item.add_g = null;
                callback();
            }
            if (item.childrenList.length) {
                fn(item.childrenList);
                callback();
            } else {
                if (self.opt.getNextItem) {
                    item.timer = setTimeout(function () {
                        self.showAddLoading(item);
                    }, 400);

                    self.opt.getNextItem(item).then(function (res) {
                        clearTimeout(item.timer);
                        self.hideAddLoading(item);
                        if (res && res.length) {
                            item.children = res;
                            item.childrenList = item.children;
                            fn(res);
                            callback();
                        } else {
                            hideAdd_g(item);
                        }
                    }, function () {
                        clearTimeout(item.timer);
                        self.hideAddLoading(item);
                        hideAdd_g(item);
                    })
                } else {
                    hideAdd_g(item);
                }
            }
        }
    },
    //寻找到上一个展开的iten ,用来获取y位置
    getPrevItem: function (list, idx) {
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
    //关闭item子节点 item 要关闭的item posItem 动画定位到的item 默认为item
    closeItemChildren: function (item, posItem, isResetPos, dataObj, isUp) {
        var self = this;
        var option = this.opt;
        if (!posItem) {
            posItem = item;
        }
        var mapLevel = dataObj.mapLevel, mapId = dataObj.mapId, infoList = dataObj.infoList;
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
            })
        };
        fn(item.children);
        var x1 = posItem.x, y1 = posItem.y;
        if (isUp) {
            self.calcItemPos(self.opt.upList, self.data_up, true);
        } else {
            self.calcItemPos(self.opt.downList, self.data_down);
        }
        if (isUp) {
            queue.forEach(function (d, idx) {
                d.g.select("g").get(0).off("mouseenter").off("mouseleave");
                d.g.animate(option.anTime).opacity(0).translate(posItem.x, posItem.y).after(function () {
                    this.remove();
                });
                var p = self.data_up.mapId[d.pid];
                var sx = p.x + 164 / 2;
                var y = d.y - self.center[1] - 124;
                var path = "M" + sx + "," + (y + 160) + "C" + sx + "," + (y + 160) + "," + sx + "," + (y + 160) + "," + sx + "," + (y + 160); // var d = "M0,180C0,118," + w + ",118," + w + ",56";
                d.lineUp.animate(option.anTime).opacity(0).plot(path).after(function () {
                    this.remove();
                });
            });

        } else {
            queue.forEach(function (d, idx) {
                d.g.select("g").get(0).off("mouseenter").off("mouseleave");
                d.g.animate(option.anTime).opacity(0).translate(posItem.x, posItem.y).after(function () {
                    this.remove();
                });
                var p = self.data_down.mapId[d.pid];
                var sx = p.x + 164 / 2;
                var y = d.y - self.center[1] - 124;
                var path = "M" + sx + "," + y + "C" + sx + "," + y + "," + sx + "," + y + "," + sx + "," + y;
                d.lineDown.animate(option.anTime).opacity(0).plot(path).after(function () {
                    this.remove();
                });
            });
        }
    },
    //渲染上方连接线
    renderUpLine: function (item) {
        var g = this.up_line;
        var p = this.data_up.mapId[item.pid];
        var frist = p.children[0];
        var last = p.children[p.children.length - 1];
        var sx = (last.x - frist.x + 164) / 2 + frist.x;
        var y = item.y - this.center[1] - 124;
        var w = item.x + 164 / 2;
        var d = "M" + sx + "," + (y + 160) + "C" + sx + "," + (y + 98) + "," + w + "," + (y + 98) + "," + w + "," + (y + 36);
        if (item.lineUp) {
            item.lineUp.animate(this.opt.anTime).plot(d);
        } else {
            if (item.animateAdd) {
                sx = item.px + 164 / 2;
                var path = "M" + sx + "," + (y + 160) + "C" + sx + "," + (y + 160) + "," + sx + "," + (y + 160) + "," + sx + "," + (y + 160); // var d = "M0,180C0,118," + w + ",118," + w + ",56";
                item.lineUp = g.path(path).stroke({color: "#ccc", width: 1}).fill("none");
                item.lineUp.animate(this.opt.anTime).plot(d);
            } else {
                item.lineUp = g.path(d).stroke({color: "#ccc", width: 1}).fill("none");
            }
        }
    },
    //渲染下方连接线
    renderDownLine: function (item) {
        var g = this.down_line;
        var p = this.data_down.mapId[item.pid];
        var frist = p.children[0];
        var last = p.children[p.children.length - 1];
        var sx = (last.x - frist.x + 164) / 2 + frist.x;
        var w = item.x + 164 / 2;
        var y = item.y - this.center[1] - 124;
        var d = "M" + sx + "," + y + "C" + sx + "," + (y + 64) + "," + w + "," + (y + 64) + "," + w + "," + (y + 124);
        if (item.lineDown) {
            item.lineDown.animate(this.opt.anTime).plot(d);
        } else {
            if (item.animateAdd) {
                sx = item.px + 164 / 2;
                var path = "M" + sx + "," + y + "C" + sx + "," + y + "," + sx + "," + y + "," + sx + "," + y;
                item.lineDown = g.path(path).stroke({color: "#ccc", width: 1}).fill("none");
                item.lineDown.animate(this.opt.anTime).plot(d);
            } else {
                item.lineDown = g.path(d).stroke({color: "#ccc", width: 1}).fill("none");
            }
        }
    },
    //鼠标移入事件
    mouseenter: function (e) {
        var self = this.self, item = this.item, isUp = this.isUp;
        item.rectUp && item.rectUp.addClass("hover-up-rect");
        item.lineUp && item.lineUp.stroke("#f0a23a");
        item.arrowUp && item.arrowUp.stroke("#f0a23a").attr("marker-end", "url(#arrowPerson)");
        item.rectDown && item.rectDown.addClass("hover-down-rect");
        item.lineDown && item.lineDown.stroke("#65a1ea");
        item.arrowDown && item.arrowDown.stroke("#65a1ea").attr("marker-end", "url(#arrowCompany)");
        self.opt.enter && self.opt.enter.call(self, item, e, isUp)
    },
    //鼠标移出事件
    mouseleave: function (e) {
        var self = this.self, item = this.item, isUp = this.isUp;
        item.rectUp && item.rectUp.removeClass("hover-up-rect");
        item.lineUp && item.lineUp.stroke("#ccc");
        item.arrowUp && item.arrowUp.stroke("#ccc").attr("marker-end", "url(#arrow)");
        item.rectDown && item.rectDown.removeClass("hover-down-rect");
        item.lineDown && item.lineDown.stroke("#ccc");
        item.arrowDown && item.arrowDown.stroke("#ccc").attr("marker-end", "url(#arrow)");
        self.opt.leave && self.opt.leave.call(self, item, e, isUp)
    },
    getLength: function (str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    },
    //单行截取字符串 setCusName(el.tableName, 22)
    setCusName: function (str, strLen) {
        var len = this.getLength(str);
        var tem = str;
        if (len > strLen) {
            for (var i = 1; i < str.length; i++) {
                tem = str.substring(0, i);
                if (this.getLength(tem) >= strLen) {
                    tem = str.substring(0, i - 1) + "...";
                    break;
                } else {
                    tem = str;
                }
            }
        }
        return tem;
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
        this.rootItem.g = null;
        this.root.clear();
        this.root = this.draw.group();
        this.opt.upList = JSON.parse(JSON.stringify(this._upData));
        this.opt.downList = JSON.parse(JSON.stringify(this._downData));
        this.scale = 1;
        // this.root.scale(1);
        this.init();
    }
});

