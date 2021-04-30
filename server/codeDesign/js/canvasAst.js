(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.ObjTree = factory());
}(this, function () {
    'use strict';


    let colorMap = {
        //参数
        param: "#f14668",
        //变量
        variable: "#f5ad33",
        node: "#00d1b2",
        declare: "#485fc7"
    }

    function getLength(str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    }

    function getLength2(str) {
        let text = new Konva.Text({
            x: 10,
            y: 8,
            text: str,
            fontSize: 14,
            fontFamily: 'Calibri',
            fill: '#fff'
        });
        let w = text.getTextWidth() + 20;
        return parseInt(w);
    }

    function CanvasAst(option) {
        let defs = {
            id: "",
            width: 0,
            height: 0,
            //动画时间
            anTime: 300,
            lineStyle: {
                stroke: "#0db1ef",
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round'
            },
            konva: {}
        };
        this.opt = Object.assign({}, defs, option);

        let stage = new Konva.Stage({
            container: "container",
            width: this.opt.width,
            height: this.opt.height,
            draggable: true
        });
        this.stage = stage;
        let layer = new Konva.Layer();
        stage.add(layer);
        this.layer = layer;
        this.mapLevel = {};
        this.mapId = {};
        this._count = 0;

        this.hw = 0;// this.opt.width / 2;
        this.hh = 0;// this.opt.height / 2;
    }

    CanvasAst.prototype.getId = function () {
        this._count++;
        return this._count;
    }

    //重置尺寸
    CanvasAst.prototype.resize = function () {
        let size = this.getSize();
        this.stage.size(size);
    }
    CanvasAst.prototype.getSize = function () {
        let pos = document.getElementById(this.opt.id).getBoundingClientRect();
        return {width: pos.width, height: pos.height}
    }

    CanvasAst.prototype.openClick = function (e) {
        let mapId = this.mapId;
        let mapLevel = this.mapLevel;

        let id = e.currentTarget.attrs.id;
        let item = mapId[id];
        console.log("click", item);
        console.log("click", item.data);


        if (item.open) {
            item.open = false;
            let queue = [];
            let fn = function (list) {
                $.each(list, function (idx, d) {
                    let map_i = mapLevel[d.level].indexOf(d);
                    if (map_i >= 0) {
                        mapLevel[d.level].splice(map_i, 1);
                    }
                    if (mapId[d.id]) {
                        queue.push(mapId[d.id]);
                        delete mapId[d.id];
                    }

                    if (d.children) {
                        if (d.children.length && d.open) {
                            fn(d.children);
                        }
                    }
                })
            };
            item.animateAdd = false;
            fn(item.children);
            //remove
            queue.forEach(function (d, idx) {
                d.animateAdd = false;
                d.g.removeChildren();
                d.g.remove();
                d.g = null;
                if (d.rightLine) {
                    d.rightLine.remove();
                    d.rightLine = null;
                }
                if (d.vLine) {
                    d.vLine.remove();
                    d.vLine = null;
                }
                if (d.hLine) {
                    d.hLine.remove();
                    d.hLine = null;
                }
            });
            if (item.rightLine) {
                item.rightLine.remove();
                item.rightLine = null;
            }
            if (item.vLine) {
                item.vLine.remove();
                item.vLine = null;
            }

        } else {
            item.open = true;


            let temList = item.children;

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
            item.children.forEach(d => {
                mapId[d.id] = d;
                d.open=false;
                d.animateAdd = true;
                d.py = item.y;
                d.px = item.x;
                d.pw = item.w;
            })
            console.log(item.children)
            item.animateAdd = true;
        }


        this.calcItemPos(1);
        this.render(1);
        this.layer.draw();
    }

    //fn
    CanvasAst.prototype.drawRect = function (item) {
        let self = this, mapId = this.mapId;
        let group = item.g;
        if (!group) {
            if (item.animateAdd) {
                group = new Konva.Group({
                    id: item.id,
                    x: item.px + item.pw,
                    y: item.py,
                    draggable: false
                });
            } else {
                group = new Konva.Group({
                    id: item.id,
                    x: item.x,
                    y: item.y,
                    draggable: false
                });
            }
            item.g = group;

        } else {
            group.to({
                x: item.x,
                y: item.y,
                duration: this.opt.anTime / 1000,
                onFinish: () => {
                    console.log('finished');
                }
            });
            return;
        }
        this.nodeGroup.add(group);
        group.on('dragstart', function () {
            console.log('dragstart')
        });
        group.on('dragmove', function (e) {
            console.log('dragmove', e)
            var mousePos = self.stage.getPointerPosition();
            var x = mousePos.x;
            var y = mousePos.y;
            console.log('x: ' + x + ', y: ' + y);
        });
        group.on('dragend', function () {
            console.log('dragend')
        });
        group.on("click", function (e) {
            self.openClick(e);
        });


        let rect = new Konva.Rect({
            width: 50,
            height: 30,
            fill: item.color
        });
        group.add(rect);

        //name
        let text = new Konva.Text({
            x: 0,
            y: item.twoName ? 3 : 8,
            text: item.name,
            fontSize: 14,
            fontFamily: 'Calibri',
            fill: '#fff',
            align: 'center'
        });
        group.add(text);
        let new_w = text.getTextWidth() + 20;
        if (item.twoName) {
            let text2 = new Konva.Text({
                x: 0,
                y: 14,
                text: item.twoName,
                fontSize: 14,
                fontFamily: 'Calibri',
                fill: '#fff',
                align: 'center'
            });
            group.add(text2);
            new_w = Math.max(new_w, text2.getTextWidth() + 20);
            text2.width(new_w);
        }
        text.width(new_w);
        rect.width(new_w);

        //line
        if (item.animateAdd) {
            group.to({
                x: item.x,
                y: item.y,
                duration: this.opt.anTime / 1000
            });
            // item.hLine = g.line(0, 20d, 0, 20)d  dfgdfdfg
            // item.hLine.animate(option.anTime).plot(-35, 20, 0, 20);

            item.hLine = new Konva.Line({
                points: [-35, 20, 0, 20],
                ...this.opt.lineStyle,
            });
            group.add(item.hLine);
        } else {
            item.hLine = new Konva.Line({
                points: [-35, 20, 0, 20],
                ...this.opt.lineStyle,
            });
            group.add(item.hLine);
        }


        return group;

    }


    CanvasAst.prototype.getItemById = function (_id) {
        if (mapId[_id]) {
            return mapId[_id];
        } else {
            return null;
        }
    }
    //寻找到上一个展开的iten ,用来获取y位置
    CanvasAst.prototype.getPrevItem = function (list, idx) {
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
    }
    //寻找到下一个展开的iten ,用来重置y位置
    CanvasAst.prototype.getNextItem = function (list, idx) {
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
    }

    CanvasAst.prototype.renderLine = function (item, isRight) {
        isRight = true;
        let g = item.g, opt = this.opt, layer = this.layer;
        if (item.open && item.children.length) {
            let first = item.children[0];
            let last = item.children[item.children.length - 1];
            let centerX;

            centerX = first.x - item.x - 35;
            if (item.rightLine) {
                item.rightLine.to({
                    x:item.w,
                    y:20,
                    points: [0,0, centerX-item.w, 0],
                    duration: this.opt.anTime / 1000
                })
            } else {
                if (item.animateAdd) {
                    item.rightLine = new Konva.Line({
                        x:item.w,
                        y:20,
                        points: [0,0,0,0],
                        ...this.opt.lineStyle,
                    });
                    g.add(item.rightLine);
                    item.rightLine.to({
                        x:item.w,
                        y:20,
                        points: [0,0,centerX-item.w,0],
                        duration: this.opt.anTime / 1000
                    });


                    // item.hLine.animate(option.anTime).plot(-35, 20, 0, 20);
                    //item.rightLine.animate(opt.anTime).plot(item.w, 20, centerX, 20)


                } else {
                    item.rightLine = new Konva.Line({
                        points: [item.w, 20, centerX, 20],
                        ...this.opt.lineStyle,
                    });
                    g.add(item.rightLine)
                }
            }
            //  var centerY = first.y + (last.y + 40 - first.y) / 2;
            if (item.children.length > 1) {
                if (item.vLine) {
                    // console.log(item.vLine.x(),item.x , centerX)
                    item.vLine.to({
                        x: item.x + centerX,
                        y: first.y + 20,
                        points: [0, 0, 0, last.y - first.y],
                        duration: this.opt.anTime / 1000
                    })
                    //   item.vLine.points([item.x + centerX, first.y + 20, item.x + centerX, last.y + 20])
                    // item.vLine.animate(opt.anTime).x(item.x + centerX).y(first.y + 20).height(last.y - first.y)
                } else {
                    if (item.animateAdd) {
                        // item.vLine = this.lineGroup.line(item.x + item.w, item.y + 20, item.x + item.w, item.y + 20).attr("data-id", item._id);
                        // item.vLine.animate(opt.anTime).plot(item.x + centerX, first.y + 20, item.x + centerX, last.y + 20)

                        item.vLine = new Konva.Line({
                            x: item.x + item.w,
                            y: item.y + 20,
                            points: [0, 0, 0, last.y-first.y],
                            ...this.opt.lineStyle,
                        });
                        this.lineGroup.add(item.vLine)
                        item.vLine.to({
                            x: item.x + centerX,
                            y: first.y + 20,
                            points: [0, 0, 0, last.y-first.y],
                            duration: this.opt.anTime / 1000
                        })

                    } else {
                        // item.vLine = this.lineGroup.line(item.x + centerX, first.y + 20, item.x + centerX, last.y + 20).attr("data-id", item._id);
                        item.vLine = new Konva.Line({
                            x: item.x + centerX,
                            y: first.y + 20,
                            points: [0, 0, 0, last.y - first.y],
                            ...this.opt.lineStyle,
                        });
                        this.lineGroup.add(item.vLine)
                    }
                }
            }
        }
    }

    //转换为treeData
    CanvasAst.prototype.conventData = function (data) {
        let self = this, mapLevel = this.mapLevel, mapId = this.mapId;

        let getInfoByType = function (d, xi, yi, id) {
            let twoName = "", list = [], color = "#2ce2d1";
            let typeFn = function (d, twoName, list, other = {}) {
                if (d) {
                    if (d.type === "FunctionDeclaration") {
                        twoName = d.id.name;
                        fn(d.params, xi, yi, id, {color: colorMap.param});
                        fn(d.body, xi, yi, id, {color: colorMap.node});
                    } else if (d.type === "FunctionExpression") {
                        fn(d.params, xi, yi, id, {color: colorMap.param});
                        fn(d.body, xi, yi, id, {color: colorMap.node});
                    } else if (d.type === "BlockStatement") {
                        // fn(d.body, xi, yi, id);
                        list = d.body;
                    } else if (d.type === "ExpressionStatement") {
                        // fn(d.expression, xi, yi, id, {color: colorMap.fnBlock});
                        return typeFn(d.expression, twoName, list, {isExpression: 1});
                    } else if (d.type === "VariableDeclaration") {
                        twoName = d.kind;
                        list = d.declarations;
                        color = colorMap.declare;
                    } else if (d.type === "VariableDeclarator") {
                        // twoName = d.id.name;
                        // list = d.init.properties;
                        // color = colorMap.variable;

                        fn(d.init, xi, yi, id, {color: colorMap.variable});


                    } else if (d.type === "CallExpression") {
                        fn(d.callee, xi, yi, id, {color: colorMap.node});
                        fn(d.arguments, xi, yi, id, {color: colorMap.param});
                    } else if (d.type === "MemberExpression") {
                        // if (d.object.type === "Identifier") {
                        //     twoName = d.object.name + "." + d.property.name;
                        // } else {
                        //     twoName += "." + typeFn(d.object).twoName;
                        // }

                        fn(d.object, xi, yi, id, {color: colorMap.node});
                        fn(d.property, xi, yi, id, {color: colorMap.node});

                    } else if (d.type === "Identifier") {
                        twoName = d.name;
                        list = [];
                        if (other.isParams) {
                            color = colorMap.param;
                        } else {
                            color = "#48c78e";
                        }

                    } else if (d.type === "LogicalExpression") {
                        twoName = d.operator;
                        fn(d.left, xi, yi, id);
                        fn(d.right, xi, yi, id);
                    } else if (d.type === "Literal") {
                        twoName = d.raw;
                        list = [];
                        if (other.isParams) {
                            color = colorMap.param;
                        } else {
                            color = "#48c78e";
                        }
                    } else {
                        twoName = "";
                        list = d.body;
                    }
                }
                return {twoName, list, color};
            }
            let obj = typeFn(d, twoName, list);
            return obj;


        }

        let fn = function (obj, xi, yi, pid, other = {}) {
            if (!obj) {
                return;
            }
            if (!mapLevel[xi]) {
                mapLevel[xi] = [];
            }
            let list = obj;
            if (!Array.isArray(obj)) {
                list = [obj];
            }

            list.forEach(function (d, yi) {
                let new_item = {
                    id: "id_" + self.getId(),
                    pid: pid,
                    x: 0,
                    y: 0,
                    level: xi,
                    idx: yi,
                    data: d,
                    type: d.type,
                    //名称
                    name: d.type,
                    //二级名称
                    twoName: "",
                    color: other.color || "",
                    open: true,
                    children: []
                }
                mapId[new_item.id] = new_item;
                if (mapId[pid]) {
                    mapId[pid].children.push(new_item);
                } else {
                    if (pid !== "root") {
                        console.warn("no find pid", new_item)
                    }
                }
                mapLevel[xi].push(new_item);

                let info = getInfoByType(d, xi + 1, yi, new_item.id);
                if (info.twoName) {
                    new_item.twoName = info.twoName;
                }
                if (!new_item.color) {
                    new_item.color = info.color;
                }

                fn(info.list, xi + 1, yi, new_item.id, other);


                // if (d.body) {
                //     fn(d.body, xi + 1, yi, new_item.id);
                // }else{
                //
                //
                // }
            })
        }
        fn(data, 0, 0, "root",);


        console.log("mapLevel", mapLevel, mapId)

    }

    //绑定事件
    CanvasAst.prototype.bindEvent = function () {
        let self = this;
        $(window).on("resize", function () {
            self.resize();
        })
    }

    //递归
    CanvasAst.prototype.recursion = function (astTree, callback) {
        let fn = function (obj, xi, yi, pid, callback) {
            let list = obj;
            if (!Array.isArray(obj)) {
                list = [obj];
            }
            list.forEach(function (d, yi) {
                callback && callback(d, xi, yi);
                if (d.body) {
                    fn(d.body, xi + 1, yi, callback);
                }
            })
        }

        fn(astTree, 0, 0, "root", callback);
    }

    //todo 三级撑开2级，第一项距离过大
    //计算
    CanvasAst.prototype.calcItemPos = function (isRight) {
        let self = this, mapLevel = this.mapLevel, mapId = this.mapId;
        let keys = [], maxInfo = [];
        for (let key in mapLevel) {
            if (mapLevel.hasOwnProperty(key)) {
                keys.push(Number(key));
            }

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
            let first = item.children[0];
            let last = item.children[item.children.length - 1];
            let centerY;
            if (item.hasMore) {
                if (!item.moreOpen) {
                    last = item.children[8];
                } else {
                    last = item.children[item.children.length - 2];
                }
                centerY = first.y + (last.y + 50 + 40 - first.y) / 2;
                item.vLineH = last.y + 50 - first.y;
            } else {
                centerY = first.y + (last.y + 40 - first.y) / 2;
                item.vLineH = last.y - first.y;
            }
            item.centerY = centerY;
        }

        let i = 0;
        //默认排列位置
        while (i <= max) {
            list = mapLevel[i];
            let max_w = 0;
            $.each(list, function (di, d) {

                let w = getLength2(d.name.length > d.twoName.length ? d.name : d.twoName);//20 padding
                // if (d.children.length || d.isMoreItem) {
                //     w += 20;  //展开收缩按钮
                // }
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
            while (idx >= 0) {
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
            i = 0;
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
                while (idx >= 0) {
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
        i = 0;
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
                                    let top_num = parseInt((list[idx + 1].y - 50 - d.y) / 2);
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

    CanvasAst.prototype.init = function (data) {
        let self = this;
        this.data = data;
        // let rg = this.drawRect();
        // this.layer.add(rg);
        console.log(data.body)
        this.createGroup();

        self.conventData(data);
        self.calcItemPos(true);

        this.render();
        this.bindEvent();
    }
    CanvasAst.prototype.createGroup = function () {
        // var halfGroup = this.rootGroup.group();
        let nodeGroup = new Konva.Group({
            x: 0,
            y: 0
        });

        let lineGroup = new Konva.Group({
            x: 0,
            y: 0
        });


        // this.halfGroup = halfGroup;
        this.lineGroup = lineGroup;
        this.nodeGroup = nodeGroup;
    }


    CanvasAst.prototype.childNode = function (isRight, item) {


    }

    CanvasAst.prototype.render = function () {
        let self = this, mapLevel = this.mapLevel, mapId = this.mapId;


        let keys = [];
        for (let key in mapLevel) {
            if (mapLevel.hasOwnProperty(key)) {
                keys.push(Number(key));
            }
        }
        let max = Math.max.apply(Math, keys);
        let idx = max, list;
        while (idx >= 0) {
            list = mapLevel[idx];
            $.each(list, function (i, d) {
                if (d.hide) {

                } else {
                    if (mapId[d.pid]) {
                        if (mapId[d.pid].open) {
                            self.drawRect(d);
                            self.renderLine(d);
                        }
                    }
                    if (d.pid === "root") {
                        self.drawRect(d);
                        self.renderLine(d);
                    }
                }
            });
            idx--;
        }
        this.layer.add(this.lineGroup);
        this.layer.add(this.nodeGroup);
        console.log(this.stage);


        console.log("111111111", this.data)
    }
    return CanvasAst;
}));





