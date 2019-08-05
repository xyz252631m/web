function NodeReader(isRight, data, option) {
    var companyInfo = {}, mapLevel = {}, mapId = {}, infoList = [];
    var maxInfo = [];


    var tool = {

        renderRoot: function (rootItem) {
            var group = this.rootGroup.group();

            rootItem.g = group
            var w = rootItem.name.length * 14 + 32;
            var rect = group.rect(w, 40);
            group.transform({x: this.hw - w / 2, y: this.hh - 20});
            rect.fill("#128BED");

            // rect.x();
            //  console.log(rect);
            var text = group.text(rootItem.name);
            text.font({
                // anchor: "middle",
                style: "fill:#fff",
                size: 14
            });
            text.x(15);
            text.y(12);
            // console.log(text, text.width());
            // text.variant("")
            // console.log("roodNode", rect);
            group.line(-35, 20, 0, 20).stroke({width: 0.5, color: "#666"});
            var r_w = rect.width();
            maxInfo[0] = r_w / 2;
            group.line(r_w, 20, r_w + 35, 20).stroke({width: 0.5, color: "#666"});

            // this.rootGroup = group;
            this.rootRect = rect;
            // group.rect(100, 100)
        },
        init: function (data) {

            this.data = data;
            this.renderRoot(data);
            var rightGroup = this.rootGroup.group();
            var rightLineG = rightGroup.group();
            var rightNodeG = rightGroup.group();
            this.rightGroup = rightGroup;
            this.rightLineG = rightLineG;
            this.rightNodeG = rightNodeG;


            // var leftGroup = this.rootGroup.group();
            // var leftLineG = leftGroup.group();
            // var leftNodeG = leftGroup.group();
            // this.rightGroup = leftGroup;
            // this.rightLineG = leftLineG;
            // this.rightNodeG = leftNodeG;

            var firstList = data.children;
            if (firstList && firstList.length) {
                var half = Math.ceil(firstList.length / 2);
                var leftList = [], rightList = [];
                $.each(firstList, (idx, item) => {
                    if (idx < half) {
                        rightList.push(item);
                    } else {
                        leftList.push(item);
                    }
                });
                this.rightList = rightList;
                this.leftList = leftList;

                if(isRight){
                    conventData(rightList);
                    this.render(isRight);
                }else{
                    conventData(leftList);
                    this.render(isRight);
                }


            }
        },
        getX(level) {
            var list = mapLevel[level];
            return Math.max(...list.map(d => d.w));
        },
        //寻找到上一个展开的iten ,用来获取y位置
        getPrevItem(list, idx) {
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
        //寻找到下一个展开的iten ,用来重置y位置
        getNextItem(list, idx) {
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
        getSpace(list, prevItem, item) {
            var pi = list.indexOf(prevItem);
            var idx = list.indexOf(item);
            var num = idx - pi - 1;
            var p = num * 50 + 10 + 40;           //50 :h+10 40:原最小间隔
            var space = p - (prevItem.children.length * 50 - 10) / 2 - (item.children.length * 50 - 10) / 2;
            //console.log("space", space)
            return space < 40 ? 40 : space;

        },
        getOffsetY(item) {
            var list = mapLevel[item.level];
            var idx = list.indexOf(item);
            if (idx) {
                //上一个展开节点
                var prevItem = this.getPrevItem(list, idx);
                if (prevItem) {
                    var space = this.getSpace(list, prevItem, item);
                    var children = prevItem.children;
                    if (children && children.length) {

                        return children[children.length - 1].y + 40 + space;//40 h  40: 上下间距
                    } else {
                        return 0;
                    }

                } else {
                    return 0
                }


            } else {
                return 0
            }

        },
        //当前列表里item的位置 不含当前item space
        getY(list, item) {
            var idx = list.indexOf(item);
            var tem = null, y = item.space;
            for (var i = 0; i < idx; i++) {
                tem = list[i];
                y += tem.h + tem.space;
            }

            return y;

        },
        //渲染子节点
        childNode: function (isRight, item) {
            var g = this.rightNodeG.group();
            item.g = g;
            var rbox = this.rootRect.rbox();
            var rect = g.rect(item.w, 40);
            // rect.y(item.y)
            g.transform({x: item.x, y: item.y});
            rect.fill("#128BED");

            // rect.x();
            //console.log(rect);
            var text = g.text(item.name);
            text.font({
                // anchor: "middle",
                style: "fill:#fff",
                size: 14
            });
            text.x(10);
            text.y(12);
            var text_rbox = text.rbox();
           // item.w = text_rbox.width + 20 + 20;
           // rect.width(item.w);
            if(isRight){

                item.op_x = text_rbox.width + 5 + 10;
            }else{

                item.op_x = 8;
            }



            item.op_y = text_rbox.y;
            //console.log(text, text.width(), text.rbox());
            if (item.children && item.children.length) {
                if(!isRight){
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
            if(isRight){

                g.line(-35, 20, 0, 20).stroke({width: 0.5, color: "#666"});
            }else{

                g.line(item.w, 20, item.w+35, 20).stroke({width: 0.5, color: "#666"});
            }

            // if (item.open && item.children.length) {
            //
            //     g.line(item.w, 20, item.children[0].x - 35, 20).stroke({width: 0.5, color: "#666"});
            // }
            // text.variant("")
            if (item.isMoreItem) {
                //item.w += 15;
               // rect.width(item.w);
                if(!isRight){
                    text.x(30);
                }
                this.renderState(g, item);
                rect.fill("#f1f1f1");
                text.font({
                    // anchor: "middle",
                    style: "fill:#333"
                });
                g.attr("class", "svg-more").attr("data-pid", item.pid);

                g.on("click", this.moreClick, this)
            }
            g.on("mouseenter", this.mouseenter)
            g.on("mouseleave", this.mouseleave)

        },
        mouseenter(e) {
            var rect = this.rbox();
            var left = rect.x - 340 + 25;
            var top = rect.y;
            $(".info-box").css({
                left: left + "px",
                top: top + "px"
            }).show()
        },
        mouseleave() {
            $(".info-box").hide()
        },
        //单击事件
        openClick(e) {
            //  console.log(this,e)
            var node = e.target.parentNode;
            if (node.getAttribute("class") !== "svg-csp") {
                node = node.parentNode;
            }
            var id = node.getAttribute("data-id");
            var item = mapId[id];
            console.log("click", item)
            if (item.open) {
                item.open = false;
                let fn = function (list) {
                    list.forEach((d, idx) => {
                        var info_i = infoList.indexOf(d);
                        if (info_i >= 0) {
                            infoList.splice(info_i, 1);
                        }
                        var map_i = mapLevel[d.level].indexOf(d);
                        if (map_i >= 0) {
                            mapLevel[d.level].splice(map_i, 1);
                        }
                        if (mapId[d.id]) {
                            delete mapId[d.id];
                        }
                        if (d.children) {
                            if (d.children.length) {
                                fn(d.children);
                            }
                        }
                    })
                };
                fn(item.children);

                // item.children.forEach(d => {
                //     // d.g.remove();
                //     // d.g = null;
                //     // d.vLine = null;
                //     var info_i = infoList.indexOf(d);
                //     if (info_i >= 0) {
                //         infoList.splice(info_i, 1);
                //     }
                //     var map_i = mapLevel[item.level + 1].indexOf(d);
                //     if (map_i >= 0) {
                //         mapLevel[d.level].splice(map_i, 1);
                //     }
                //     if (mapId[d.id]) {
                //         delete mapId[d.id];
                //     }
                // });
                this.rightGroup.remove();
                var rightGroup = this.rootGroup.group();
                var rightLineG = rightGroup.group();
                var rightNodeG = rightGroup.group();
                this.rightGroup = rightGroup;
                this.rightLineG = rightLineG;
                this.rightNodeG = rightNodeG;
                this.render();
                // item.vLine.remove();
                // item.vLine = null;
                // item.rightLine.remove();
                // item.rightLine = null;
                // var g = item.g.select("g").get(0);
                // g.line(7.5, 4, 7.5, 11).stroke({width: 1, color: "rgb(102, 102, 102)"});
                // //更新下部分item y坐标
                // this.updateNextItem(item);
                //
                // this.updateLineByLevel(item.level - 1);

            } else {
                item.open = true;
                var temList = []
                let fn = function (list) {
                    list.forEach((d, idx) => {
                        d.open = false;
                        infoList.push(d);
                        if (!mapLevel[d.level]) {
                            mapLevel[d.level] = []
                        }
                        mapId[d.id] = d;
                        temList.push(d);
                    })
                };
                fn(item.children);
                var list = mapLevel[item.level];
                var idx = list.indexOf(item);
                if (idx > 0) {
                    var upItem = this.getPrevItem(list, idx);
                    if (upItem) {
                        var lastItem = upItem.children[upItem.children.length - 1]
                        var lastIdx = mapLevel[upItem.level + 1].indexOf(lastItem);
                        mapLevel[item.level + 1].splice(lastIdx + 1, 0, ...temList);

                    } else {
                        mapLevel[item.level + 1].splice(0, 0, ...temList);
                    }
                } else {
                    mapLevel[item.level + 1].splice(0, 0, ...temList);
                }

                console.log(mapLevel[item.level + 1])


                this.rightGroup.remove();
                var rightGroup = this.rootGroup.group();
                var rightLineG = rightGroup.group();
                var rightNodeG = rightGroup.group();
                this.rightGroup = rightGroup;
                this.rightLineG = rightLineG;
                this.rightNodeG = rightNodeG;
                this.render();

            }


        },
        //更多点击事件
        moreClick(e, a) {
            //console.log(this, e, a);
            var node = e.target.parentNode;
            if (node.getAttribute("class") !== "svg-more") {
                node = node.parentNode;
            }
            var pid = node.getAttribute("data-pid");
            //var pid = this.attr("data-pid");
            var item = mapId[pid];
            console.log(mapId[pid]);
            if (item.moreOpen) {
                item.moreOpen = false;

                var temList = [];
                var len = item.children.length;
                item.children.forEach((d, i) => {
                    if (i > 9 && i < len - 1) {
                        d.hide = true;
                        var idx = mapLevel[item.level + 1].indexOf(d);
                        if (idx >= 0) {
                            mapLevel[item.level + 1].splice(idx, 1);
                        }
                    } else {
                        temList.push(d);
                    }
                });
                item.children = temList;
                var lastItem = item.children[item.children.length - 1];
                lastItem.name = "展开";
                lastItem.moreOpen = false;
                this.rightGroup.remove();
                var rightGroup = this.rootGroup.group();
                var rightLineG = rightGroup.group();
                var rightNodeG = rightGroup.group();
                this.rightGroup = rightGroup;
                this.rightLineG = rightLineG;
                this.rightNodeG = rightNodeG;
                this.render();
            } else {
                item.moreOpen = true;
                var temList = [];
                item.childrenList.forEach((d, i) => {
                    if (i > 9) {
                        d.idx = i;
                        d.hide = false;
                        d.pid = pid;
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
                lastItem.moreOpen = true;

                console.log("mapLevel", mapLevel);

                this.rightGroup.remove();
                var rightGroup = this.rootGroup.group();
                var rightLineG = rightGroup.group();
                var rightNodeG = rightGroup.group();
                this.rightGroup = rightGroup;
                this.rightLineG = rightLineG;
                this.rightNodeG = rightNodeG;
                this.render();

            }
        },
        //更新下部分item y
        updateNextItem(item) {
            var list = mapLevel[item.level];
            var idx = list.indexOf(item);
            var upList = [], downList = [];

            list.forEach((d, i) => {
                if (i < idx) {
                    upList.push(d);
                } else if (i > idx) {
                    downList.push(d);
                }
            });
            console.log("downList", downList)
            downList.forEach((d, i) => {
                var x = this.getX(d.level);
                //  var y = this.getY(d.level);
                var off_y = this.getOffsetY(d);
                console.log("offy", off_y)
                d.children.forEach((k, ki) => {
                    k.y = this.getY(d.children, k) + off_y;
                    k.g.y(k.y);
                });
                if (d.children.length) {
                    var frist = d.children[0];
                    var last = d.children[d.children.length - 1];
                    d.vLine.y(frist.y + 20);
                    var centerY = frist.y + (last.y + 40 - frist.y) / 2;
                    d.y = centerY - 20;
                    d.g.y(d.y);
                    // d.vLine.height(last.y + 20);

                }
                // item.vLine.height();

            })

        },

        updateLineByLevel(level) {


            console.log("level", level)

            var list;
            if (level == 0) {


                var list = this.rightList
                var d = this.data;

                var frist = list[0];
                var last = list[list.length - 1];
                // d.vLine.y(frist.y + 20);
                d.vLine.height(last.y - frist.y);
                var centerY = frist.y + (last.y + 40 - frist.y) / 2;
                d.y = centerY - 20;
                //d.g.y(d.y);


            } else {
                while (level > 0) {
                    list = mapLevel[level];

                    list.forEach((d, idx) => {
                        if (d.children.length) {
                            var frist = d.children[0];
                            var last = d.children[d.children.length - 1];
                            d.vLine.y(frist.y + 20);
                            var centerY = frist.y + (last.y + 40 - frist.y) / 2;
                            d.y = centerY - 20;
                            d.g.y(d.y);
                        }
                    })


                    level--;
                }
            }


        },
        updateItemY(item) {

        },

        render(isRight) {
            var keys = Object.keys(mapLevel).map(d => Number(d));
            var max = Math.max(...keys);
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

                //  var centerX = frist.x - item.x - 35;
                // var group = this.rightLineG;
                //  var g = item.g.select("g").get(0);
                //  g.select("line").get(1).remove();
                item.centerY = centerY;

            }

            var i = 1;
            while (i <= max) {
                list = mapLevel[i];
                if (i == 1) {
                    list.forEach(d => {

                        // d.topSpace = 10;
                    });
                } else {

                }
                var max_w = 0;
                list.forEach(d => {
                    var w = getLength(d.name) * 14 / 2 + 20;//22 padding
                    if (d.children.length||d.isMoreItem) {
                        w += 20;  //展开收缩按钮
                    }
                    d.w = w;
                    max_w = Math.max(max_w, w);
                    var off_x = 0;
                    maxInfo.forEach((m, mi) => {
                        if (mi < d.level) {
                            off_x += m;
                        }
                    });
                    if(isRight){
                        d.x = this.hw + off_x + d.level * 70;
                    }else{
                        d.x = this.hw-d.w - off_x - d.level * 70;
                    }

                });
                maxInfo[i] = max_w;
                i++;
            }
            console.log(maxInfo);

            while (idx > 0) {
                list = mapLevel[idx];
                list.forEach((d, i) => {
                    var p = mapId[d.pid];
                    var y = 0;
                    d.space = getSpace(d);

                    if (d.children.length) {
                        // w += 20;  //展开收缩按钮
                        if (d.open) {
                            getH(d);

                            d.y = d.centerY - 20;
                        } else {
                            //  d.space = getSpace(d);
                            //  d.y = this.getY(p.children, d)
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
            i = 1;
            while (i <= max) {
                list = mapLevel[i];
                let fn = function (list, t) {
                    list.forEach((d, idx) => {
                        d.y += t;
                        if (d.children) {
                            if (d.children.length) {
                                fn(d.children, t);
                            }
                        }
                    })

                };

                list.forEach((d, idx) => {
                    if (idx) {
                        var num = d.y - list[idx - 1].y;
                        if (num < 50) {
                            var t = 50 - num;
                            d.y += t;

                            if (d.children.length) {
                                fn(d.children, t);
                            }

                        }
                    }
                });

                i++;
            }

            idx = max;
            while (idx > 0) {
                list = mapLevel[idx];
                list.forEach((d, i) => {
                    if (d.hide) {

                    } else {
                        this.childNode(isRight, d);

                        this.renderLine(isRight, d);
                    }

                });

                idx--;
            }


            var list = mapLevel[1];
            var r_frist = list[0];
            var r_last = list[list.length - 1];
            var r_centerX;
            if(isRight){
                r_centerX = r_frist.x - 35;
            }else{
                r_centerX = r_frist.x+r_frist.w + 35;
            }

            this.data.vLine = this.rightLineG.line(r_centerX, r_frist.y + 20, r_centerX, r_last.y + 20).stroke({
                width: 0.5,
                color: "#666"
            }).attr("data-id", this.data.id);
            var r_centerY = r_frist.y + (r_last.y + 40 - r_frist.y) / 2;
            this.rightGroup.y(-(r_centerY - this.hh));
            //  var num = this.hh-  r_frist.y+(r_last.y  - r_frist.y)/2;
            // this.rightGroup.y(num)


            //
            // infoList.forEach(d => {
            //
            //     this.childNode(true, d);
            // })


        },
        renderLine(isRight, item) {

            var g = item.g;
            //  var polyline = draw.polyline('0,0 100,50 50,100').fill('none').stroke({width: 1})
            if (item.open && item.children.length) {
                var frist = item.children[0];
                var last = item.children[item.children.length - 1];
                console.log("x", item.children[0].x, item.x, item.w);
                var centerX;
                if(isRight){
                    centerX = frist.x - item.x - 35;
                    item.rightLine = g.line(item.w, 20, centerX, 20).stroke({width: 0.5, color: "#666"});
                    var centerY = frist.y + (last.y + 40 - frist.y) / 2;
                    if (item.children.length > 1) {
                        item.vLine = this.rightLineG.line(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20).stroke({
                            width: 0.5,
                            color: "#666"
                        }).attr("data-id", item.id);
                    }
                }else{
                    centerX = frist.x-frist.w - item.x - 35;
                    //item.rightLine = g.line(0, 20, centerX, 20).stroke({width: 0.5, color: "#666"});
                    // if (item.children.length > 1) {
                    //     item.vLine = this.rightLineG.line(item.x - centerX, frist.y + 20, item.x - centerX, last.y + 20).stroke({
                    //         width: 0.5,
                    //         color: "#666"
                    //     }).attr("data-id", item.id);
                    // }
                }





            }

        },
        //画线 竖
        line(isRight, item) {

            var g = item.g;
            //  var polyline = draw.polyline('0,0 100,50 50,100').fill('none').stroke({width: 1})
            if (item.open && item.children.length) {
                var frist = item.children[0];
                var last = item.children[item.children.length - 1];
                console.log("x", item.children[0].x, item.x, item.w);
                var centerX = frist.x - item.x - 35;
                item.rightLine = g.line(item.w, 20, centerX, 20).stroke({width: 0.5, color: "#666"});
                var centerY = frist.y + (last.y + 40 - frist.y) / 2;
                if (item.children.length > 1) {
                    item.vLine = group.line(item.x + centerX, frist.y + 20, item.x + centerX, last.y + 20).stroke({
                        width: 0.5,
                        color: "#666"
                    }).attr("data-id", item.id);
                }
                //重置item y

                item.y = centerY - 20;
                item.g.y(item.y);


                var list = mapLevel[item.level];
                //排列上部分

                var idx = list.indexOf(item);
                if (idx > 1) {
                    var prevItem = this.getPrevItem(list, idx);
                    if (prevItem) {
                        var p_idx = list.indexOf(prevItem);
                        var p_num = idx - p_idx;
                        if (p_num > 1) {
                            var p_space = (item.y - prevItem.y) / p_num;
                            for (var i = 1; i < p_num; i++) {
                                list[p_idx + i].g.y(prevItem.y + p_space * i);
                            }
                        }


                    }
                }
                if (idx < list.length - 2) {
                    //排列下部分
                    var nextItem = this.getNextItem(list, idx);
                    if (nextItem) {

                    }
                }
                //

            }

        },

        //渲染+ - 按钮状态
        renderState(group, item) {

            var g = group.group();
            g.transform({x: item.op_x, y: 13});
            //stroke: rgb(102, 102, 102); fill: rgb(255, 255, 255); stroke-width: 1;
            g.circle(15).fill('#fff').stroke({width: 1, color: "rgb(102, 102, 102)"});
            g.line(4, 7.5, 11, 7.5).stroke({width: 1, color: "rgb(102, 102, 102)"});
            if (item.isMoreItem) {

                if (!item.moreOpen) {
                    g.line(7.5, 4, 7.5, 11).stroke({width: 1, color: "rgb(102, 102, 102)"});
                }
            } else {
                if (!item.open) {
                    g.line(7.5, 4, 7.5, 11).stroke({width: 1, color: "rgb(102, 102, 102)"});
                }
            }


        }
    };

    tool.hw = option.hw;
    tool.hh = option.hh;
    tool.rootGroup = option.rootGroup;

    tool.init(data)

//处理数据
    function conventData(list) {
        mapLevel = {};
        mapId = {};
        infoList = [];
        let fn = function (list, mapLevel, mapId, infoList, level, pid) {
            list.forEach((d, idx) => {
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


                if (d.id) {
                    mapId[d.id] = d;
                } else {
                    console.log(d)
                }
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
        fn(list, mapLevel, mapId, infoList, 1, "root");

        infoList.forEach((d, i) => {

            if (d.children.length > 10) {
                var child = [], moreList = [];
                d.children.forEach((k, idx) => {
                    if (idx < 10) {
                        child.push(k);
                    } else if (idx === 10) {
                        var tem = {
                            id: "more_" + d.id + "_01",
                            name: "更多",
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
                        var id = "more_" + d.id + "_01";
                        console.log("id_item", mapId[id]);
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
        console.log("mapId", mapId)
        console.log("mapLevel", mapLevel)
    }


    function getLength(str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    };


};


function Relation(SVG, option) {
    var box_dom = document.getElementById(option.id);
    this.width = box_dom.offsetWidth;
    this.height = box_dom.offsetHeight;
    this.hw = this.width / 2;
    this.hh = this.height / 2;
    var draw = SVG('svgBox').size(this.width, this.height);

    this.rootGroup = draw.group();
    this.rootGroup.draggable();
    var scale = 1;

    // 缩放
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

    var self = this;
    draw.on("mousewheel", function (e) {
        drag.call(self, e)
    });
}

Relation.prototype.init = function (obj) {


    var rightGroup = new NodeReader(true, obj, {
        hw: this.hw,
        hh: this.hh,
        rootGroup: this.rootGroup
    });
    var leftGroup = new NodeReader(false, obj, {
        hw: this.hw,
        hh: this.hh,
        rootGroup: this.rootGroup
    });
};




