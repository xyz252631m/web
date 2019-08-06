function NodeReader(isRight, data, option) {
    var companyInfo = {}, mapLevel = {}, mapId = {}, infoList = [];
    var maxInfo = [];
    var lineWidth = 1;
    var tool = {

        init: function (data) {
            this.data = data;
            this.renderRoot(data);
            this.createGroup();
            var firstList = data.children;
            if (firstList && firstList.length) {
                var half = Math.ceil(firstList.length / 2);
                var leftList = [], rightList = [];
                $.each(firstList, function (idx, item) {
                    if (idx < half) {
                        rightList.push(item);
                    } else {
                        leftList.push(item);
                    }
                });
                if (isRight) {
                    conventData(rightList);
                } else {
                    conventData(leftList);
                }
                mapId[data.id] = data;
                this.calcItemPos(isRight);
                this.render(isRight, true);
            }
        },
        createGroup() {
            var halfGroup = this.rootGroup.group();
            var nodeGroup = halfGroup.group();
            var lineGroup = halfGroup.group();
            this.halfGroup = halfGroup;
            this.lineGroup = lineGroup;
            this.nodeGroup = nodeGroup;
        },
        getItemById: function (id) {
            if (mapId[id]) {
                return mapId[id];
            } else {
                return null;
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
        loopLevelList(desc, fn) {
            var keys = [];
            for (var key in mapLevel) {
                keys.push(Number(key));
            }
            var max = Math.max.apply(Math, keys);
            var idx = max, list;
            //倒序
            if (desc) {
                while (idx > 0) {
                    list = mapLevel[idx];
                    fn(list, idx);
                    idx--;
                }
            } else {
                i = 1;
                while (i <= max) {
                    list = mapLevel[idx];
                    fn(list, idx);
                    i++;
                }
            }
        },
        //寻找到下一个展开的iten ,用来重置y位置
        getNextItem: function (list, idx) {
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
        getSpace: function (list, prevItem, item) {
            var pi = list.indexOf(prevItem);
            var idx = list.indexOf(item);
            var num = idx - pi - 1;
            var p = num * 50 + 10 + 40;           //50 :h+10 40:原最小间隔
            var space = p - (prevItem.children.length * 50 - 10) / 2 - (item.children.length * 50 - 10) / 2;
            return space < 40 ? 40 : space;
        },

        mouseenter: function (e) {
            var rect = this.g.rbox();
            var left = rect.x - 340 + 25;
            if (!isRight) {
                left = rect.x + rect.width - 25;
            }
            var top = rect.y;
            if (option.hasDetailInfo) {
                option.detailInfoShowBefore && option.detailInfoShowBefore.call(tool, this, $(".info-box"));
                $(".info-box").css({
                    left: left + "px",
                    top: top + "px"
                }).show();
            }

            if (this.children.length) {
                $.each(this.children, function (idx) {
                    this.hLine.stroke({color: option.hoverLineColor})
                });
                this.vLine && this.vLine.stroke({color: option.hoverLineColor})
                this.rightLine && this.rightLine.stroke({color: option.hoverLineColor})
            }
            if (mapId[this.pid]) {
                var pItem = mapId[this.pid];
                if (isRight) {
                    if (this.level == 1) {
                        var m = tool.halfGroup.matrixify();
                        pItem = {
                            x: pItem.x,
                            w: pItem.w,
                            y: pItem.y - m.f
                        }
                    }
                    this.hover_polyline = tool.lineGroup.polyline([
                        [this.x, this.y + 20],
                        [this.x - 35, this.y + 20],
                        [this.x - 35, pItem.y + 20],
                        [pItem.x + pItem.w, pItem.y + 20]])
                        .fill("transparent")
                        .stroke({width: lineWidth, color: option.hoverLineColor})
                        .style({zIndex: 999});
                } else {
                    if (this.level == 1) {
                        var m = tool.halfGroup.matrixify();
                        pItem = {
                            x: pItem.x,
                            w: pItem.w,
                            y: pItem.y - m.f
                        }
                    }
                    this.hover_polyline = tool.lineGroup.polyline([
                        [this.x + this.w, this.y + 20],
                        [this.x + this.w + 35, this.y + 20],
                        [this.x + this.w + 35, pItem.y + 20],
                        [pItem.x, pItem.y + 20]])
                        .fill("transparent")
                        .stroke({width: lineWidth, color: option.hoverLineColor})
                        .style({zIndex: 999});
                }
            }
        },

        mouseleave: function () {
            if (option.hasDetailInfo) {
                $(".info-box").hide();
            }
            if (this.children.length) {
                $.each(this.children, function (idx) {
                    this.hLine.stroke({color: option.lineColor})
                });
                this.vLine && this.vLine.stroke({color: option.lineColor})
                this.rightLine && this.rightLine.stroke({color: option.lineColor})
            }
            if (mapId[this.pid]) {
                if (this.hover_polyline) {
                    this.hover_polyline.remove();
                    this.hover_polyline = null;
                }
            }
        },
        //单击事件
        openClick: function (e) {
            var node = e.target.parentNode;
            if (node.getAttribute("class") !== "svg-node") {
                node = node.parentNode;
            }
            var id = node.getAttribute("data-id");
            var item = mapId[id];
            if (item.hover_polyline) {
                item.hover_polyline.remove();
                item.hover_polyline = null;
            }
            var y = item.y;
            if (item.open) {
                item.open = false;
                var queue = [];
                let fn = function (list) {
                    $.each(list, function (idx, d) {
                        var info_i = infoList.indexOf(d);
                        if (info_i >= 0) {
                            infoList.splice(info_i, 1);
                        }
                        var map_i = mapLevel[d.level].indexOf(d);
                        if (map_i >= 0) {
                            mapLevel[d.level].splice(map_i, 1);
                        }
                        if (mapId[d.id]) {
                            queue.push(mapId[d.id]);
                            delete mapId[d.id];
                        }
                        if (d.children) {
                            if (d.children.length) {
                                fn(d.children);
                            }
                        }
                    })
                };


                // this.halfGroup.remove();
                // var halfGroup = this.rootGroup.group();
                //
                // var nodeGroup = halfGroup.group();
                // var lineGroup = halfGroup.group();
                // this.halfGroup = halfGroup;
                // this.lineGroup = lineGroup;
                // this.nodeGroup = nodeGroup;

                // var list = mapLevel[item.level];
                // var h = list[list.length - 1].y - list[0].y;


                fn(item.children);
                this.calcItemPos(isRight);

                if (isRight) {
                    queue.forEach(function (d, idx) {
                        d.g.animate(option.anTime).opacity(0).translate(item.x + item.w, item.y).after(function () {
                            this.remove();
                        });
                        d.hLine.animate(option.anTime).x(0);

                    });
                    item.rightLine && item.rightLine.animate(option.anTime).width(0).after(function () {
                        this.remove();
                        item.rightLine = null;
                    });
                    item.vLine && item.vLine.animate(option.anTime).x(item.x + item.w).y(item.y).height(40).after(function () {
                        this.remove();
                        item.vLine = null;
                    });
                } else {
                    queue.forEach(function (d, idx) {
                        d.g.animate(option.anTime).opacity(0).translate(item.x - d.w, item.y).after(function () {
                            this.remove();
                        });
                        d.hLine.animate(option.anTime).x(0);
                    });
                    item.rightLine && item.rightLine.animate(option.anTime).plot(0, 20, 0, 20).after(function () {
                        this.remove();
                        item.rightLine = null;
                    });
                    item.vLine && item.vLine.animate(option.anTime).x(item.x).y(item.y).height(40).after(function () {
                        this.remove();
                        item.vLine = null;
                    });
                }


                // var new_h = list[list.length - 1].y - list[0].y;
                // var new_y = item.y;
                // var num = h/2-this.hh-y - (new_h/2-this.hh-new_y)
                // console.log(y, item.y)
                // console.log(h, new_h,num)

                // this.loopLevelList(false,function (list,idx) {
                //     list.forEach(function(d,idx){
                //         d.y-=num;
                //     })
                // });


                this.render(isRight);
                // if (mapId[item.pid]) {
                //     this.rootGroup.animate().move(mapId[item.pid].x-this.hw,  mapId[item.pid].y-this.hh)
                // }


            } else {
                item.open = true;
                var temList = [];
                let fn = function (list) {
                    $.each(list, function (idx, d) {
                        d.open = false;
                        d.g = null;
                        infoList.push(d);
                        if (!mapLevel[d.level]) {
                            mapLevel[d.level] = [];
                        }
                        mapId[d.id] = d;
                        temList.push(d);
                    });
                };
                fn(item.children);
                var list = mapLevel[item.level];
                var idx = list.indexOf(item);
                if (idx > 0) {
                    var upItem = this.getPrevItem(list, idx);
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
                // this.halfGroup.remove();
                // var halfGroup = this.rootGroup.group();
                //
                // var nodeGroup = halfGroup.group();
                // var lineGroup = halfGroup.group();
                // this.halfGroup = halfGroup;
                // this.lineGroup = lineGroup;
                // this.nodeGroup = nodeGroup;
                temList.forEach(function (d) {
                    d.animateAdd = true;
                    d.animateMoreAdd = false;
                    d.py = item.y;
                    d.px = item.x;
                    d.pw = item.w;
                });
                this.calcItemPos(isRight);

                item.animateAdd = true;
                //  item.rightLine && item.rightLine.animate(option.anTime).width(0).after(function () {
                // this.remove();
                // item.rightLine = null;
                // });
                //  if(item.vLine){
                //      var v_plot = item.vLine.plot();
                //      var x1=v_plot.value[0][0],x2=v_plot.value[1][0];
                //      var y1=v_plot.value[0][1],y2=v_plot.value[1][1];
                //      item.vLine.plot(x1,item.y+20,x1,item.y+20).animate(option.anTime).plot()
                //
                //  }
                //item.vLine && item.vLine.animate(option.anTime).x(item.x + item.w).y(item.y).height(40).after(function () {
                // this.remove();
                // item.vLine = null;
                // });
                this.render(isRight);
                // this.rootGroup.animate().move( -(item.x-this.hw),  -(item.y-this.hh) )

            }


        },
        //更多点击事件
        moreClick: function (e, a) {
            var node = e.target.parentNode;
            if (node.getAttribute("class") !== "svg-more") {
                node = node.parentNode;
            }
            var pid = node.getAttribute("data-pid");

            function celHover() {
                var id = node.getAttribute("data-id");
                var item = mapId[id];
                if (item.hover_polyline) {
                    item.hover_polyline.remove();
                    item.hover_polyline = null;
                }
            }

            celHover();

            //var pid = this.attr("data-pid");
            var item = mapId[pid];
            if (item.moreOpen) {
                item.moreOpen = false;

                var temList = [];
                var len = item.children.length;
                var removeList = [];
                $.each(item.children, function (i, d) {
                    if (i > 9 && i < len - 1) {
                        d.hide = true;
                        var idx = mapLevel[item.level + 1].indexOf(d);
                        if (idx >= 0) {
                            mapLevel[item.level + 1].splice(idx, 1);
                        }
                        removeList.push(d);
                    } else {
                        temList.push(d);
                    }
                });
                item.children = temList;
                var lastItem = item.children[item.children.length - 1];
                lastItem.name = "展开";
                lastItem.g.select("text").get(0).text(lastItem.name);
                lastItem.moreOpen = false;
                // this.halfGroup.remove();
                // var halfGroup = this.rootGroup.group();
                // var nodeGroup = halfGroup.group();
                // var lineGroup = halfGroup.group();
                // this.halfGroup = halfGroup;
                // this.lineGroup = lineGroup;
                // this.nodeGroup = nodeGroup;
                this.calcItemPos(isRight);

                var tem = temList[9];
                removeList.forEach(function (d, idx) {
                    d.g.animate(option.anTime).opacity(0).y(tem.y + 40).after(function () {
                        this.remove();
                    });
                    //d.hLine.animate(option.anTime).x(0);

                });

                this.render(isRight);
            } else {
                item.moreOpen = true;
                var temList = [];
                $.each(item.childrenList, function (i, d) {
                    if (i > 9) {
                        d.idx = i;
                        d.hide = false;
                        d.pid = pid;
                        d.open = false;
                        d.g = null;
                        d.animateMoreAdd = true;
                        d.level = item.level + 1;
                        if (!d.children) {
                            d.children = [];
                        }
                        d.childrenList = d.children || [];
                        if (!mapLevel[d.level + 1]) {
                            mapLevel[d.level + 1] = [];
                        }
                        mapId[d.id] = d;
                        temList.push(d);
                    }
                });
                item.children.splice(10, 0, ...temList);
                var lastItem = item.children[item.children.length - 1];
                var idx = mapLevel[item.level + 1].indexOf(lastItem);
                mapLevel[item.level + 1].splice(idx, 0, ...temList);
                lastItem.name = "收缩";
                lastItem.g.select("text").get(0).text(lastItem.name);
                lastItem.moreOpen = true;
                // this.halfGroup.remove();
                // var halfGroup = this.rootGroup.group();
                //
                // var nodeGroup = halfGroup.group();
                // var lineGroup = halfGroup.group();
                // this.halfGroup = halfGroup;
                // this.lineGroup = lineGroup;
                // this.nodeGroup = nodeGroup;
                this.calcItemPos(isRight);
                var temItem = item.children[9];
                temList.forEach(function (d) {
                    d.py = temItem.y;
                });

                this.render(isRight);
            }
        },
        //渲染
        render: function (isRight, isInit) {
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
                    if (d.hide) {

                    } else {
                        self.childNode(isRight, d);
                        self.renderLine(isRight, d);
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
            } else {
                r_centerX = r_frist.x + r_frist.w + 35;
            }

            if (isRight) {
                if (this.data.right_vLine) {
                    this.data.right_vLine.animate(option.anTime).y(r_frist.y + 20).height(r_last.y - r_frist.y);
                } else {
                    this.data.right_vLine = this.lineGroup.line(r_centerX, r_frist.y + 20, r_centerX, r_last.y + 20).stroke({
                        width: lineWidth,
                        color: option.lineColor
                    }).attr("data-id", this.data.id);
                }

            } else {
                if (this.data.left_vLine) {
                    this.data.left_vLine.animate(option.anTime).y(r_frist.y + 20).height(r_last.y - r_frist.y);
                } else {
                    this.data.left_vLine = this.lineGroup.line(r_centerX, r_frist.y + 20, r_centerX, r_last.y + 20).stroke({
                        width: lineWidth,
                        color: option.lineColor
                    }).attr("data-id", this.data.id);
                }

            }


            var r_centerY = r_frist.y + (r_last.y + 40 - r_frist.y) / 2;
            if (isInit) {
                this.halfGroup.y(-(r_centerY - this.hh))
            } else {
                this.halfGroup.animate(option.anTime).y(-(r_centerY - this.hh));
            }

            // this.halfGroup.y(-(r_centerY - this.hh))
        },
        calcItemPos(isRight) {
            var self = this;
            var keys = [];
            for (var key in mapLevel) {
                keys.push(Number(key));
            }
            var max = Math.max.apply(Math, keys);
            var idx = max, list;

            function getSpace(item) {
                // var pitem = mapId[item.pid];
                // var idx = pitem.children.indexOf(item);
                // if (idx > 0) {
                //     return 10;
                // } else {
                //     return 40;
                // }
                if (item.idx) {
                    return 10;
                } else {
                    return 40;
                }
            }

            function getH(item) {
                var frist = item.children[0];
                var last = item.children[item.children.length - 1];
                var centerY;
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

            var i = 1;
            while (i <= max) {
                list = mapLevel[i];

                var max_w = 0;
                $.each(list, function (di, d) {
                    var w = getLength(d.name) * 14 / 2 + 20;//20 padding
                    if (d.children.length || d.isMoreItem) {
                        w += 20;  //展开收缩按钮
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
            i = 1;

            var hasRepeat = false;
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

                $.each(list, function (idx, d) {
                    if (idx) {
                        var num = d.y - list[idx - 1].y;
                        var top = 50;
                        if (d.pid !== list[idx - 1].pid) {
                            top = 80;
                        }
                        if (num < top) {
                            hasRepeat = true;
                            var t = top - num;
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
                            // w += 20;  //展开收缩按钮
                            if (d.open) {
                                getH(d);
                                d.y = d.centerY - 20;
                            } else {
                                if (i) {
                                    d.y = list[i - 1].y + 40 + d.space;
                                }
                            }
                        } else {
                            if (i) {
                                d.y = list[i - 1].y + 40 + d.space;
                            }
                        }
                        d.h = 40;
                    });
                    idx--;
                }
            }
        },
        //渲染根节点
        renderRoot: function (rootItem) {
            var group = this.rootGroup.group().attr("class", "svg-root-node");
            rootItem.g = group;
            var w = rootItem.name.length * 14 + 32;
            var rect = group.rect(w, 40);
            rootItem.x = this.hw - w / 2;
            rootItem.y = this.hh - 20;
            group.transform({x: rootItem.x, y: rootItem.y});
            var text = group.text(rootItem.name);
            text.font({
                size: 14
            });
            text.x(15);
            text.y(12);
            group.line(-35, 20, 0, 20).stroke({width: lineWidth, color: option.lineColor});
            var r_w = rect.width();
            rootItem.w = r_w;
            maxInfo[0] = r_w / 2;
            group.line(r_w, 20, r_w + 35, 20).stroke({width: lineWidth, color: option.lineColor});
            this.rootRect = rect;
        },
        //渲染子节点
        childNode: function (isRight, item) {
            if (item.g) {
                var g = item.g;
                g.animate(option.anTime).transform({x: item.x, y: item.y});
                this.updateState(item);
                return;
            }
            var g = this.nodeGroup.group();
            item.g = g;
            var rbox = this.rootRect.rbox();
            var rect = g.rect(item.w, 40);
            if (item.animateAdd) {
                if (isRight) {
                    g.transform({x: item.px + item.pw, y: item.py}).animate(option.anTime).transform({
                        x: item.x,
                        y: item.y
                    });
                } else {
                    g.transform({x: item.px - item.w, y: item.py}).animate(option.anTime).transform({
                        x: item.x,
                        y: item.y
                    });
                }
            } else if (item.animateMoreAdd) {
                g.opacity(0).transform({x: item.x, y: item.py}).animate(option.anTime).opacity(1).transform({
                    x: item.x,
                    y: item.y
                });
            } else {
                g.transform({x: item.x, y: item.y});
            }
            var text = g.text(item.name);
            text.font({
                size: 14
            });
            text.x(10);
            text.y(12);
            var text_rbox = text.rbox();
            var tr = this.rootGroup.matrixify();
            if (isRight) {
                item.op_x = (text_rbox.width / tr.d) + 5 + 10;
            } else {
                item.op_x = 8;
            }

            item.op_y = text_rbox.y;
            if (item.children && item.children.length) {
                if (!isRight) {
                    text.x(30);
                }
                this.renderState(g, item);
                g.attr("class", "svg-csp").attr("data-id", item.id);
                g.on("click", this.openClick, this)
            } else {
                // item.w -= 15;
                // rect.width(item.w);
            }
            item.rect = rect;
            if (isRight) {
                if (item.animateAdd) {
                    item.hLine = g.line(0, 20, 0, 20).stroke({width: lineWidth, color: option.lineColor});
                    item.hLine.animate(option.anTime).plot(-35, 20, 0, 20);
                } else {
                    item.hLine = g.line(-35, 20, 0, 20).stroke({width: lineWidth, color: option.lineColor});
                }

            } else {
                if (item.animateAdd) {
                    item.hLine = g.line(item.w, 20, item.w, 20).stroke({width: lineWidth, color: option.lineColor});
                    item.hLine.animate(option.anTime).plot(item.w, 20, item.w + 35, 20);
                } else {
                    item.hLine = g.line(item.w, 20, item.w + 35, 20).stroke({
                        width: lineWidth,
                        color: option.lineColor
                    });
                }

            }

            if (item.isMoreItem) {
                if (!isRight) {
                    text.x(30);
                }
                this.renderState(g, item);
                text.font({
                    size: 14
                });
                g.attr("class", "svg-more").attr("data-id", item.id).attr("data-pid", item.pid);

                g.on("click", this.moreClick, this)
            } else {
                g.attr("class", "svg-node")
            }
            g.on("mouseenter", this.mouseenter, item);
            g.on("mouseleave", this.mouseleave, item);

        },
        updateState: function (item) {
            var g = item.op_g;
            if (g) {
                var line = g.select("line").get(1);
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
        },
        //渲染+ - 按钮状态
        renderState: function (group, item) {
            var g = group.group().attr("class", "node-op-state");
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
        },
        //渲染线条
        renderLine: function (isRight, item) {
            var g = item.g;
            if (item.open && item.children.length) {
                var frist = item.children[0];
                var last = item.children[item.children.length - 1];
                var centerX;
                if (isRight) {
                    centerX = frist.x - item.x - 35;
                    if (item.rightLine) {

                        // item.rightLine.animate(option.anTime).w(centerX)
                    } else {
                        if (item.animateAdd) {
                            item.rightLine = g.line(item.w, 20, item.w, 20).stroke({
                                width: lineWidth,
                                color: option.lineColor
                            });
                            // item.hLine.animate(option.anTime).plot(-35, 20, 0, 20);
                            item.rightLine.animate(option.anTime).plot(item.w, 20, centerX, 20)
                        } else {
                            item.rightLine = g.line(item.w, 20, centerX, 20).stroke({
                                width: lineWidth,
                                color: option.lineColor
                            });
                        }


                    }

                    var centerY = frist.y + (last.y + 40 - frist.y) / 2;
                    if (item.children.length > 1) {
                        if (item.vLine) {
                            item.vLine.animate(option.anTime).y(frist.y + 20).height(last.y - frist.y)
                        } else {
                            if (item.animateAdd) {
                                item.vLine = this.lineGroup.line(item.x + item.w, item.y + 20, item.x + item.w, item.y + 20).stroke({
                                    width: lineWidth,
                                    color: option.lineColor
                                }).attr("data-id", item.id);
                                item.vLine.animate(option.anTime).plot(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20)
                            } else {
                                item.vLine = this.lineGroup.line(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20).stroke({
                                    width: lineWidth,
                                    color: option.lineColor
                                }).attr("data-id", item.id);
                            }
                        }
                    }
                } else {
                    centerX = item.x - frist.x - frist.w - 35;
                    if (item.rightLine) {

                    } else {
                        if (item.animateAdd) {
                            //item.w, 20, item.w, 20
                            item.rightLine = g.line(0, 20, 0, 20).stroke({width: lineWidth, color: option.lineColor});
                            item.rightLine.animate(option.anTime).plot(0, 20, -centerX, 20)
                        } else {
                            item.rightLine = g.line(0, 20, -centerX, 20).stroke({
                                width: lineWidth,
                                color: option.lineColor
                            });
                        }


                    }
                    if (item.children.length > 1) {
                        if (item.vLine) {
                            item.vLine.animate(option.anTime).y(frist.y + 20)
                        } else {
                            if (item.animateAdd) {
                                //item.x + item.w, item.y + 20, item.x + item.w, item.y + 20
                                item.vLine = this.lineGroup.line(item.x, item.y + 20, item.x, item.y + 20).stroke({
                                    width: lineWidth,
                                    color: option.lineColor
                                }).attr("data-id", item.id);
                                item.vLine.animate(option.anTime).plot(item.x - centerX, frist.y + 20, item.x - centerX, last.y + 20)
                            } else {
                                item.vLine = this.lineGroup.line(item.x - centerX, frist.y + 20, item.x - centerX, last.y + 20).stroke({
                                    width: lineWidth,
                                    color: option.lineColor
                                }).attr("data-id", item.id);
                            }

                        }
                    }
                }
            }
        },

    };
    tool.hw = option.hw;
    tool.hh = option.hh;
    tool.rootGroup = option.rootGroup;
    tool.init(data);

    //处理数据
    function conventData(list) {
        mapLevel = {};
        mapId = {};
        infoList = [];
        let fn = function (list, mapLevel, mapId, infoList, level, pid) {
            list.forEach(function (d, idx) {
                d.level = level;
                d.idx = idx;
                d.pid = pid;
                d.childrenList = d.children || [];
                if (idx >= 10) {
                    return
                }
                if (!mapLevel[level.toString()]) {
                    mapLevel[level.toString()] = [];
                }
                mapLevel[level.toString()].push(d);
                if (!d.id || mapId[d.id]) {
                    d.id = pid + "_" + new Date().getTime() + "_" + idx;
                }

                mapId[d.id] = d;
                d.open = level < 4;
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
        fn(list, mapLevel, mapId, infoList, 1, data.id);

        infoList.forEach(function (d, i) {
            if (d.children.length > 10) {
                var child = [], moreList = [];
                d.children.forEach(function (k, idx) {
                    if (idx < 10) {
                        child.push(k);
                    } else if (idx === 10) {
                        var tem = {
                            id: "more_" + d.id + "_01",
                            name: "展开",
                            isMoreItem: true,
                            pid: d.id,
                            idx: idx,
                            level: d.level + 1,
                            moreOpen: false,
                            children: []
                        };
                        mapId[tem.id] = tem;
                        infoList.push(tem);
                        var upItem = d.children[9];
                        var upIdx = mapLevel[tem.level].indexOf(upItem);
                        mapLevel[tem.level].splice(upIdx + 1, 0, tem);
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

    function getLength(str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    }
}


function Relation(SVG, option) {
    var def = {
        anTime: 200
    };
    this.option = $.extend({}, def, option);
    var box_dom = document.getElementById(option.id);
    this.width = box_dom.offsetWidth;
    this.height = box_dom.offsetHeight;
    this.hw = this.width / 2;
    this.hh = this.height / 2;
    var draw = SVG('svgBox').size(this.width, this.height);
    this.rootGroup = draw.group();
    var isDown = false, x1, y1, x, y;
    var self = this;
    //拖动事件
    $(window).on("mousedown.relation", function (e) {
        isDown = true;
        x1 = e.pageX;
        y1 = e.pageY;
        x = self.rootGroup.x();
        y = self.rootGroup.y();
        $(box_dom).addClass("svg-move");
    }).on("click", function () {
        $(".info-box").hide();
        $(this).removeClass("svg-move");
    });
    $(window).on("mousemove.relation", function (e) {
        if (isDown) {
            self.rootGroup.translate(x + e.pageX - x1, y + e.pageY - y1);
        }
    }).on("mouseup", function () {
        isDown = false;
        $(box_dom).removeClass("svg-move");
    }).on("resize", function () {
        draw.width($(window).width());
        draw.height($(window).height());
    });
    var scale = 1;

    // 缩放事件
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

    draw.on("mousewheel", function (e) {
        drag.call(self, e)
    });
}

Relation.prototype.init = function (obj) {
    var opt = $.extend({
        hw: this.hw,
        hh: this.hh,
        rootGroup: this.rootGroup
    }, this.option);
    var halfGroup = new NodeReader(true, obj, opt);
    var leftGroup = new NodeReader(false, obj, opt);
};




