/*
*des:树形菜单
*v:2.2.0
* */

(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS、CMD规范检查
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD规范检查
        define(factory);
    } else {
        // 浏览器注册全局对象
        global.VirTree = factory();
    }
})(this, (function () {
    //virtualTreeMenu
    function VirTree(option) {
        var defs = {
            //菜单节点
            $el: null,
            //数据类型 list(id,pid) tree(children)
            dataType: "list",
            //显示图标
            iconShow:true,
            //li 的高度
            itemHeight: 30,
            //操作框
            $opBox: null,
            //是否存在操作按钮 默认为Boolean 类型 ， 可以为function需要返回 Boolean 类型值
            hasOpBtn: false,
            //操作框 显示之前的事件
            opBoxShowBefore: null,
            //点击事件
            click: null,
            //添加数据项时 按 type 类型排序
            softList: ["catalog"],
            //图标管理
            icon: {
                arrow:"fa fa-fw fa-caret-right",
                //文件夹
                folder: "fa fa-folder-o i-bold",
                //文件夹开启状态  （追加Open字符串）
                folderOpen: "fa fa-folder-open-o i-bold",
                //文件夹
                catalog: "fa fa-folder-o i-bold",
                //文件夹开启状态  （追加Open字符串）
                catalogOpen: "fa fa-folder-open-o i-bold",
            },
            //样式 -- 用于修改颜色等
            itemCls: {},
            //操作框点击事件 type：返回html上的data-type属性值
            opClick: null
        };
        this.map = {};
        this.opt = $.extend(true, defs, option);
        this.$menuBox = this.opt.$el;
        this.lastLi = null;

        //激活item
        this.activeItem = null;
        //默认显示的数量
        this.showItemNum = 50;
        //数据列表
        this.dataList = [];
        //显示的数据列表
        this.showDataList = [];
        //显示的开始索引
        this.dataIdx = 0;
        //滚动位置
        this.dataLastScroll = 0;
    }

    $.extend(VirTree.prototype, {
        init: function () {
            this.getMenuHeight();
            this.bindEvent();
            this.dataList = this.getFlatList();
            this.refreshDataList(0);
        },
        //获取显示的list数据
        getFlatList: function () {
            var treeData = this.treeData;
            var newList = [];
            var fn = function (newList, list, level) {
                list.forEach(function (d) {
                    d.level = level;
                    newList.push(d);
                    if (d.open) {
                        if (d.children && d.children.length) {
                            fn(newList, d.children, level + 1);
                        }
                    }
                });
            }
            fn(newList, treeData, 1);
            return newList;
        },
        //获取菜单的高度
        getMenuHeight: function () {
            this.boxH = this.$menuBox.height();
            this.showItemNum = Math.ceil(this.boxH / this.opt.itemHeight);
        },
        //获取子级
        getOpenItem: function (item) {
            var list = [];
            var fn = function (list, item) {
                item.children.forEach(function (d) {
                    d.level = item.level + 1;
                    list.push(d);
                    if (d.open) {
                        fn(list, d);
                    }
                })
            }
            fn(list, item);
            return list;
        },
        //处理数据 将list数据转为tree层级数据
        toTree: function (list) {
            if (this.opt.dataType === "list") {
                var newList = this.convertToTreeData(list, true);
                var map = this.map;
                $.each(list, function () {
                    var item = map[this.pid];
                    while (item) {
                        item.count++;
                        if (item.pid) {
                            item = map[item.pid];
                        } else {
                            break;
                        }
                    }
                });
                this.treeData = newList;
            } else {
                this.loadTreeData(list);
            }
        },


        //showList
        refreshDataList: function (idx) {
            var $box = this.$menuBox.find("ul");
            if (!this.dataList.length) {
                $box.html('');
                $box.css({
                    paddingTop: 0,
                    paddingBottom: 0
                });
                return;
            }
            var paddingBottom = (this.dataList.length - this.showItemNum * 2 - idx) * this.opt.itemHeight;
            $box.css({
                paddingTop: idx * this.opt.itemHeight + 'px',
                paddingBottom: (paddingBottom > 0 ? paddingBottom : 0) + 'px'
            });
            $box.html(this.liTemplateByVir(this.dataList, idx));
        },
        //显示虚拟列表
        liTemplateByVir: function (list, idx) {
            var len = list.length;
            var start = idx < 0 ? 0 : idx;
            var itemNum = this.showItemNum;
            var end = idx + itemNum * 2 >= len ? len : (idx + itemNum * 2);
            var showList = [];
            for (var i = start; i < end; i++) {
                showList.push(list[i]);
            }
            return this.liTemplate(showList);
        },

        //重置数据
        resetTree: function (list) {
            this.map = {};
            this.toTree(list);
            this.dataList = this.getFlatList();

            this.dataIdx = 0;
            this.dataLastScroll = 0;
            this.refreshDataList(0);
        },
        //转换数据 将list为treeData
        convertToTreeData: function (list) {
            var map = this.map, newList = [];
            list = this.treeListOrder(list);
            //初始化 并合并到map里
            $.each(list, function () {
                this.count = 0;
                this.level = 1;
                this.isGetedData = false;
                if (!this.children) {
                    this.children = [];
                }
                if (!this.pid) {
                    newList.push(this);
                }
                if (map[this.id]) {
                    console.error("菜单目录配置id存在重复,id：" + this.id);
                }
                map[this.id] = this;
            });
            $.each(list, function (idx) {
                if (this.pid) {
                    map[this.pid].children.push(this);
                }
            });
            return newList;
        },

        //转换数据 加工treeData 1.item 2.list
        loadTreeData: function (treeData) {
            var map = this.map;
            var count = 0;
            var fn = function (list, pid, level) {
                list.forEach(function (d) {
                    if (!d.id) {
                        count++
                        d.id = "id_count_" + count;
                    }
                    if (map[this.id]) {
                        console.error("菜单目录配置id存在重复,id：" + this.id);
                    }
                    map[d.id] = d;
                    if (!d.pid) {
                        d.pid = pid;
                    }
                    if (!d.level) {
                        d.level = level + 1;
                    }
                    if (!d.children) {
                        d.type = "file";
                        d.children = [];
                    } else {
                        d.type = "catalog";
                    }
                    fn(d.children, d.id, d.level);
                })


            }
            fn(treeData, "", 0);
            this.treeData = treeData;
        },

        //刷新 节点数据
        refreshNodeData: function (item, dom, list) {
            var self = this;

            if (list && list.length) {
                list = this.treeListOrder(list);
                $.each(list, function () {
                    if (!this.pid) {
                        this.pid = item.id;
                    } else {
                        if (this.pid !== item.id) {
                            console.error("pid 未对应到item id !");
                        }
                    }
                });
                $.each(list, function () {
                    if (this.pid) {
                        if (self.map[this.id]) {

                        } else {
                            this.count = 0;
                            this.level = 1;
                            this.isGetedData = false;
                            if (!this.children) {
                                this.children = [];
                            }
                            self.map[this.id] = this;
                            self.map[this.pid].children.push(this);
                        }
                    }
                });
                // this.convertToTreeData(list);
                item.isGetedData = true;

                // var $li = this.$menuBox.find("li[data-id='" + item.id + "']");
                //默认没有子节点（直接追加 合并后的子节点） 如果默认有子节点则会重复
                //true 合并后的子节点会直接替换原有子节点
                // $li.trigger("click", {isReplace: true});
                dom.trigger("click", {isReplace: true});
            } else {
                item.isGetedData = true;
                // if (item.open) {
                //     item.open = false;
                //     dom.removeClass("open-li");
                // } else {
                item.open = true;
                dom.addClass("open-li");
                // }
            }
        },


        //排序 文件夹在最开始
        treeListOrder: function (arr, types) {
            if (!types) {
                types = ["catalog"];
            }
            //如果数组长度小于等于1，则返回数组本身
            if (arr.length <= 1) {
                return arr;
            }

            var arrList = [];

            var list = [];
            types.forEach(function () {
                list.push([]);
            });
            var lastList = [];

            arr.forEach(function (item, i) {
                // if (typeof type === "function") {
                //
                // } else {
                var idx = types.indexOf(item.type);
                if (idx >= 0) {
                    list[idx].push(item);
                } else {
                    lastList.push(item);
                }
                // }
            });
            list.forEach(function (d) {
                [].push.apply(arrList, d);
            })
            lastList.forEach(function (p) {
                arrList.push(p);
            })
            return arrList;
        },

        //合并数据
        addTreeDataItem: function (item) {
            var pid = item.pid;
            //非根节点
            if (pid) {
                var pitem = this.map[pid];
                //异步文件夹不用处理
                if (pitem) {
                    this.convertToTreeData([item]);
                    if (!item.isGetedData && pitem.children.length === 0) {
                        return;
                    }
                    item.level = pitem.level + 1;
                    pitem.children = this.treeListOrder(pitem.children);
                    if (pitem.open) {
                        this.dataList = this.getFlatList();
                        this.refreshTree();
                    }
                } else {
                    console.error("未找到pid item!")
                }
            } else {
                this.convertToTreeData([item]);
                this.treeData.push(item);
                if (this.treeData.length === 1) {

                } else {
                    this.treeData = this.treeListOrder(this.treeData);
                }
                this.dataList = this.getFlatList();
                this.refreshTree();
            }
        },

        refreshTree: function () {
            this.refreshDataList(this.dataIdx);
        },

        //刷新树节点 -- 目录 isTable: 不为目录节点
        refreshTreeByItem: function (id, list, isTable) {
            var item = this.map[id];
            if (!list) {
                list = [];
            }
            if (item) {
                var map = this.map;
                var tableList = [], noTableList = [];
                //获取所有的表item
                item.children.forEach(function (d) {
                    if (d.type === "table") {
                        tableList.push(d);
                    } else {
                        noTableList.push(d);
                    }
                });
                if (isTable) {
                    //属性文本（非目录）节点
                    list.forEach(function (d) {
                        //已存在不处理
                        if (map[d.id]) {
                            $.extend(map[d.id], d);
                            noTableList.push(map[d.id]);
                        } else {
                            d.pid = item.id;
                            d.count = 0;
                            d.level = item.level + 1;
                            d.isGetedData = false;
                            if (!d.children) {
                                d.children = [];
                            }
                            map[d.id] = d;
                            noTableList.push(d);
                        }
                    });
                    item.children = noTableList;
                } else {
                    //刷新目录节点
                    list.reverse().forEach(function (d) {
                        //已存在不处理
                        if (map[d.id]) {
                            $.extend(map[d.id], d);
                            tableList.unshift(map[d.id]);
                        } else {
                            d.pid = item.id;
                            d.count = 0;
                            d.level = item.level + 1;
                            d.isGetedData = false;
                            if (!d.children) {
                                d.children = [];
                            }
                            map[d.id] = d;
                            tableList.unshift(d);
                        }
                    });
                    item.children = tableList;
                }

                //如果是展示状态 则刷新树
                if (item.open) {
                    this.dataList = this.getFlatList();
                    this.refreshTree();
                }
            } else {
                function rootRefresh() {
                    var map = this.map;
                    var tableList = [], noTableList = [];
                    //获取所有的表item
                    this.treeData.forEach(function (d) {
                        if (d.type === "table") {
                            tableList.push(d);
                        } else {
                            noTableList.push(d);
                        }
                    });
                    if (isTable) {
                        //属性文本（非目录）节点
                        list.forEach(function (d) {
                            //已存在不处理
                            if (map[d.id]) {
                                $.extend(map[d.id], d);
                                noTableList.push(map[d.id]);
                            } else {
                                d.pid = "";
                                d.count = 0;
                                d.level = 1;
                                d.isGetedData = false;
                                if (!d.children) {
                                    d.children = [];
                                }
                                map[d.id] = d;
                                noTableList.push(d);
                            }
                        });
                        this.treeData = noTableList;
                    } else {
                        //刷新目录节点
                        list.reverse().forEach(function (d) {
                            //已存在不处理
                            if (map[d.id]) {
                                $.extend(map[d.id], d);
                                tableList.unshift(map[d.id]);
                            } else {
                                d.pid = "";
                                d.count = 0;
                                d.level = 1;
                                d.isGetedData = false;
                                if (!d.children) {
                                    d.children = [];
                                }
                                map[d.id] = d;
                                tableList.unshift(d);
                            }
                        });
                        this.treeData = tableList;
                    }
                    //刷新树
                    this.dataList = this.getFlatList();
                    this.refreshTree();
                }

                rootRefresh.call(this);
            }
        },


        //刷新树节点名称
        refreshItemNode: function (newItem) {
            var item = this.map[newItem.id];
            if (item) {
                var $li = this.$menuBox.find("li[data-id='" + newItem.id + "']");
                if ($li.length) {
                    var h = this.iconTemp(newItem.icoType || item.icoType);
                    h += newItem.name;
                    $li.find(">a>label").html(h);
                }
            }
        },

        //选中某一项数据
        selectItem: function (id, noTriggerClick) {
            var item = this.map[id];
            if (item) {
                this.activeItem = item;
                var pitem = this.map[item.pid];
                while (pitem) {
                    pitem.open = true;
                    if (pitem.pid) {
                        pitem = this.map[pitem.pid]
                    } else {
                        break;
                    }
                }
                this.dataList = this.getFlatList();
                this.refreshTree();
                var $li = this.$menuBox.find("li[data-id='" + id + "']");
                if (noTriggerClick) {

                } else {
                    $li.trigger("click", true);
                }

            } else {
                console.warn("未找到item ! id:" + id);
            }
        },

        openLiLoading: function (dom) {
            dom.children("a").append('<span class="k-bar"></span>');
            return true;
        },

        closeLiLoading: function (dom) {
            dom.children("a").find(".k-bar").hide().remove();
            return false;
        },
        iconTemp: function (icoType, item) {
            var h =[];
            if(this.opt.iconShow) {
                  h.push('<span class="icon-box">');
                var iconMap = this.opt.icon;
                var icon = iconMap[item.type];
                if (icon) {
                    if (item.open) {
                        h.push(' <i class="' + (iconMap[item.type + 'Open'] || icon) + '"></i>');
                    } else {
                        h.push(' <i class="' + icon + '"></i>');
                    }

                } else {
                    h.push(' <i class="fa fa-fw fa-file-text-o"></i>');
                }

                // switch (icoType) {
                //     case "home":
                //         h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                //         break;
                //     case "home":
                //         h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                //         break;
                //     default:
                //         h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                //         break;
                // }
                h.push('</span>');
            }
            return h.join("");

        },
        liTemplate: function (list) {
            var h = [];
            var self = this;
            $.each(list, function (idx, item) {
                var cls = "level-li-" + item.level;
                if (item.open) {
                    cls += " open-li "
                }
                if (self.activeItem) {
                    if (item.id === self.activeItem.id) {
                        cls += " active "
                    }
                }
                if (self.opt.itemCls[item.type]) {

                    cls += " " + self.opt.itemCls[item.type] + " ";
                }

                h.push('<li class="' + cls + '" data-id="' + item.id + '" data-clen="' + item.children.length + '">');
                h.push('<a href="javascript:void(0);">');

                    if (item.type === "catalog" || item.children && item.children.length) {
                        h.push('<span class="arrow"><i class="'+self.opt.icon.arrow+'"></i></span>');
                    }


                h.push('<label>');
                h.push(self.iconTemp(item.icoType, item));
                h.push(item.name);
                h.push('</label>');

                if (typeof (self.opt.hasOpBtn) === "function") {
                    var flag = self.opt.hasOpBtn.call(self, item);
                    if (flag) {
                        h.push('<span class="icon-op"><i class="fa fa-fw fa-reorder"></i></span>');
                    }
                } else {
                    if (!!self.opt.hasOpBtn) {
                        h.push('<span class="icon-op"><i class="fa fa-fw fa-reorder"></i></span>');
                    }
                }
                if (item.loading) {
                    h.push('<span class="k-bar"></span>');
                }

                h.push('</a>');
                // if (item.type === "catalog" || item.children && item.children.length) {
                //     h.push(fn(item.children, level + 1));
                // }
                h.push('</li>');
            });
            return h.join("");

        },

        getMenuItem: function (id) {
            return this.map[id];
        },
        bindEvent: function () {
            var getLi = function (e) {
                var $li = $(e.target);
                if (e.target.nodeName !== "LI") {
                    $li = $li.parents("li").eq(0);
                }
                return $li;
            };
            var self = this;
            if (self.opt.$opBox && self.opt.$opBox.length) {
                var timer = [];
                this.$menuBox.on("mouseleave", function () {
                    timer.push(setTimeout(function () {
                        self.opt.$opBox.fadeOut();
                    }, 2000));
                });
                self.opt.$opBox.on("mouseenter", function () {
                    $.each(timer, function () {
                        clearTimeout(this);
                    });
                    timer = [];
                }).on("mouseleave", function () {
                    timer.push(setTimeout(function () {
                        self.opt.$opBox.fadeOut();
                    }, 1000));
                }).on("click", function (e) {
                    $.each(timer, function () {
                        clearTimeout(this);
                    });
                    var $el = null;
                    if (e.target.nodeName === "P") {
                        $el = $(e.target);
                    }
                    if (e.target.nodeName === "SPAN") {
                        $el = $(e.target).parent();
                    }
                    if ($el) {
                        var type = $el.attr("data-type");
                        if (self.opt.opClick) {
                            self.opt.opClick.call(self, self.lastItem, type);
                        }
                        self.opt.$opBox.fadeOut();
                    }
                });
            }
            //菜单点击事件
            this.$menuBox.on("click", function (e, obj) {
                var $node = $(e.target);
                var $li = getLi(e);
                var src = $li.attr("data-src");
                var id = $li.attr("data-id");
                var item = self.map[id];
                var catalogOpen = undefined;
                self.lastItem = null;
                var spanNode = e.target;
                if (e.target.nodeName === "I") {
                    spanNode = e.target.parentNode;
                }
                //操作按钮 点击事件
                if (spanNode.nodeName === "SPAN" && $(spanNode).hasClass("icon-op")) {
                    if (self.opt.$opBox && self.opt.$opBox.length) {
                        var $box = self.opt.$opBox;
                        self.lastItem = item;
                        $box.css({
                            top: (e.pageY + 5) + 'px',
                            left: (e.pageX + 10) + 'px'
                        });
                        self.opt.opBoxShowBefore && self.opt.opBoxShowBefore.call(self, item, $box);
                        $box.fadeIn();
                    }
                    return;
                }
                var isReplace = false, noSelect = false;

                if (obj) {
                    isReplace = !!obj.isReplace;
                    noSelect = !!obj.noSelect;
                }


                if (item) {
                    if (!noSelect) {
                        if (self.activeItem) {
                            var activeLi = self.$menuBox.find("li[data-id='" + self.activeItem.id + "']");
                            activeLi.removeClass("active");
                        }
                        self.activeItem = item;
                    }

                    self.opt.$opBox && self.opt.$opBox.fadeOut();
                    if (item.children.length) {
                        // $li.find(">ul").slideToggle(200);
                        // $li.toggleClass("close-ul");
                        var list = self.getOpenItem(item);
                        if (!item.open || isReplace) {
                            //添加子节点
                            var idx = self.dataList.indexOf(item);
                            if (idx >= 0) {
                                list.unshift(idx + 1, 0);
                                Array.prototype.splice.apply(self.dataList, list);
                            }
                            item.open = true;
                            // $li.addClass("close-ul");
                            // $li.removeClass("open-li");
                            catalogOpen = false;
                        } else {
                            //删除子节点
                            list.forEach(function (d) {
                                d._del = true;
                            })
                            var newList = [];
                            self.dataList.forEach(function (d) {
                                if (d._del) {
                                    d._del = false;
                                } else {
                                    newList.push(d);
                                }
                            })
                            self.dataList = newList;
                            item.open = false;
                            // $li.removeClass("close-ul");
                            // $li.addClass("open-li");
                            catalogOpen = true;
                        }
                        if (isReplace) {
                            self.dataList = self.getFlatList();
                        }

                        self.refreshDataList(self.dataIdx);
                        $li = self.$menuBox.find("li[data-id='" + self.activeItem.id + "']");
                    } else {
                        //已请求过数据
                        if (item.isGetedData) {
                            if (item.open) {
                                item.open = false;
                                $li.removeClass("open-li");
                            } else {
                                item.open = true;
                                $li.addClass("open-li");
                            }
                        }
                    }
                    self.lastLi && self.lastLi.removeClass("active")

                    $li.addClass("active");
                    self.lastLi = $li;

                    if (self.opt.click) {
                        self.opt.click.call(self, item, $li, catalogOpen);
                    }
                }
            })
                .on("scroll", function (e) {
                    var el = e.target;
                    requestAnimationFrame(function () {
                        var itemNum = self.showItemNum;
                        var itemH = self.opt.itemHeight;
                        var itemNumH = itemNum * itemH;
                        var h = itemNumH * 2;
                        var box_h = itemNumH;
                        //up
                        if (self.dataLastScroll - el.scrollTop > 0) {
                            if ((el.scrollTop - self.dataIdx * itemH) < 0) {
                                if (self.dataIdx > 0) {
                                    self.dataIdx -= Math.ceil((self.dataIdx * itemH - el.scrollTop) / itemNumH) * itemNum;
                                    self.refreshDataList(self.dataIdx);
                                }
                            }
                        } else if (self.dataLastScroll - el.scrollTop < 0) {
                            if (h - (el.scrollTop - self.dataIdx * itemH) < box_h) {
                                self.dataIdx += Math.floor((el.scrollTop - self.dataIdx * itemH) / itemNumH) * itemNum;
                                self.refreshDataList(self.dataIdx);
                            }
                        } else {

                        }
                        self.dataLastScroll = el.scrollTop;
                    })
                });
        }
    });
    return VirTree;
}))














