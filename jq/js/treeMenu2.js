/*
*des:树形菜单
* */
define(function () {
    //virtualTreeMenu
    function TreeMenu(option) {
        var defs = {
            //菜单节点
            $el: null,
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
            //操作框点击事件 type：返回html上的data-type属性值
            opClick: null
        };
        this.map = {};
        this.opt = $.extend({}, defs, option);
        this.$menuBox = this.opt.$el;
        this.lastLi = null;

        //默认显示的数量
        this.showItemNum = 50;
        //数据列表
        this.dataList = [];
        //显示的数据列表
        this.showDataList = [];
        //显示的开始索引
        this.dataIdx = 0;
        //滚动位置
        this.dataLastScroll=0;
    }

    $.extend(TreeMenu.prototype, {
        init: function () {
            this.getMenuHeight();
            this.bindEvent();

            this.dataList = this.treeData;

            this.refreshDataList(0);


            //  this.createTreeMenu(this.treeData);
            //   this.createTreeBg();


        },
        // createTreeBg: function () {
        //     var $bg = '<div class="virtual-tree-bg"></div>'
        //     this.$bg = $bg;
        //     this.$menuBox.prepend($bg);
        // },
        //获取菜单的高度
        getMenuHeight: function () {
            this.boxH = this.$menuBox.height();
            this.showItemNum = Math.ceil(this.boxH / this.opt.itemHeight);
        },
        //获取子级
        getOpenItem: function (item) {

            var list = []
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
            var newList = this.convertToTreeData(list);
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
        liTemplate: function (list) {
            var h = [];
            var self = this;
            $.each(list, function (idx, item) {
                var cls = "level-li-" + item.level;
                if (item.open) {
                    cls += " open-li "
                }

                h.push('<li class="' + cls + '" data-id="' + item.id + '" data-clen="' + item.children.length + '">');
                h.push('<a href="javascript:void(0);">');
                if (item.type === "catalog" || item.children && item.children.length) {
                    h.push('<span class="arrow"><i class="fa fa-fw fa-caret-right"></i></span>');
                }
                h.push('<label>');
                switch (item.icoType) {
                    case "home":
                        h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                        break;
                    default:
                        h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                        break;
                }
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
                h.push('</a>');
                // if (item.type === "catalog" || item.children && item.children.length) {
                //     h.push(fn(item.children, level + 1));
                // }
                h.push('</li>');
            });
            return h.join("");

        },
        //重置数据
        resetTree: function (list) {
            this.map = {};
            this.toTree(list);
            this.createTreeMenu(this.treeData);
        },
        //将list转换为treeData
        convertToTreeData: function (list) {
            var map = this.map, newList = [];
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

        //刷新 节点数据
        refreshNodeData: function (item, dom, list) {
            if (list && list.length) {
                var map = this.map;
                $.each(list, function () {
                    if (!this.pid) {
                        this.pid = item.id;
                    } else {
                        if (this.pid !== item.id) {
                            console.error("pid 未对应到item id !");
                        }
                    }
                });
                this.convertToTreeData(list);
                item.isGetedData = true;
                var html = this.template(item.children, item.level);
                dom.append(html);
                dom.trigger("click");
            } else {
                item.isGetedData = true;
                dom.find(">a").find(".arrow").hide().remove();
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
                d.forEach(function (p) {
                    arrList.push(p);
                })
            })
            lastList.forEach(function (p) {
                arrList.push(p);
            })
            return arrList;
        },

        //合并数据
        addTreeDataItem: function (item) {
            var self = this;
            var pid = item.pid;
            var add = function (list, item) {
                var idx = list.indexOf(item);
                var html = "";
                //特殊处理 -- 初始下级为空的情况
                if (list.length === 1) {
                    html = self.template([item], item.level || 1);
                } else {
                    html = self.template(item, item.level || 1);
                }
                if (idx > 0) {
                    //存在文件夹
                    var beforeId = list[idx - 1].id;
                    var $bli = self.$menuBox.find("li[data-id='" + beforeId + "']");
                    $bli.after(html);
                } else if (idx === 0) {
                    //存在节点 但没有文件夹
                    var pid = item.pid;
                    var $pli = self.$menuBox.find("li[data-id='" + pid + "']");
                    if (list.length === 1) {
                        $pli.append(html);
                    } else {
                        $pli.find(">ul").prepend(html);
                    }
                } else {

                }
            }
            //非根节点
            if (pid) {
                var pitem = this.map[pid];
                //异步文件夹不用处理
                if (!item.isGetedData && pitem.children.length === 0) {
                    return;
                }
                this.convertToTreeData([item]);
                if (pitem) {
                    pitem.children = this.treeListOrder(pitem.children);
                    add(pitem.children, item);
                }
            } else {
                this.convertToTreeData([item]);
                this.treeData.push(item);
                this.treeData = this.treeListOrder(this.treeData);
                add(this.treeData, item);
            }
        },


        //选中某一项数据
        selectItem: function (id, noTriggerClick) {
            var item = this.map[id];
            if (item) {
                var $ul = this.$menuBox.find(">ul");
                var $li = this.$menuBox.find("li[data-id='" + id + "']");
                if (noTriggerClick) {

                } else {
                    $li.trigger("click", true);
                }

                var $temUl = $li.parent("ul");
                while ($temUl !== $ul) {
                    $temUl.show();
                    $li = $temUl.parent("li");
                    if ($li.length) {
                        $li.removeClass("close-ul");
                        $li.addClass("open-li");
                        $temUl = $li.parent("ul");
                    } else {
                        break;
                    }
                }
            } else {
                console.warn("未找到item ! id:" + id);
            }
        },


        openLiLoading: function (dom) {
            dom.find(">a").append('<span class="k-bar"></span>');
            return true;
        },
        closeLiLoading: function (dom) {
            dom.find(">a").find(".k-bar").hide().remove();
            return false;
        },

        //拼接 html
        template: function (childrenList, level) {
            var self = this;
            var liTemplate = function (h, item, level) {
                h.push('<li  data-id="' + item.id + '" data-clen="' + item.children.length + '">');
                h.push('<a href="javascript:void(0);">');
                if (item.type === "catalog" || item.children && item.children.length) {
                    h.push('<span class="arrow"><i class="fa fa-fw fa-caret-right"></i></span>');
                }
                h.push('<label>');
                switch (item.icoType) {
                    case "home":
                        h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                        break;
                    default:
                        h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                        break;
                }
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
                h.push('</a>');
                if (item.type === "catalog" || item.children && item.children.length) {
                    h.push(fn(item.children, level + 1));
                }
                h.push('</li>');
                return h;
            }
            var fn = function (list, level) {
                var h = [];
                if (list.length) {
                    h.push('<ul class="ul-' + level + '" data-level="' + level + '">');
                    $.each(list, function (idx) {
                        liTemplate(h, this, level)
                    });
                    h.push('</ul>');
                }
                return h.join("");
            };

            if ($.isArray(childrenList)) {
                var htmlStr = fn(childrenList, level || 1);
                return htmlStr;
            } else {
                return liTemplate([], childrenList, level || 1).join("");
            }


        },

        //生成树形菜单
        createTreeMenu: function (childrenList) {
            var htmlStr = this.template(childrenList);
            this.$menuBox.html(htmlStr);
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
            this.$menuBox.on("click", function (e, noAni) {
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
                if (item) {
                    self.opt.$opBox && self.opt.$opBox.fadeOut();
                    if (item.children.length) {
                        // $li.find(">ul").slideToggle(200);
                        // $li.toggleClass("close-ul");
                        var list = self.getOpenItem(item);
                        if (item.open) {
                            list.forEach(function (d) {
                                var i = self.dataList.indexOf(d);
                                if (i >= 0) {
                                    self.dataList.splice(i, 1);
                                }
                            });
                            item.open = false;
                            // $li.removeClass("close-ul");
                            // $li.addClass("open-li");
                            catalogOpen = true;
                        } else {
                            var idx = self.dataList.indexOf(item);
                            if (idx >= 0) {
                                list.unshift(idx + 1, 0);
                                Array.prototype.splice.apply(self.dataList, list);
                            }
                            item.open = true;
                            // $li.addClass("close-ul");
                            // $li.removeClass("open-li");
                            catalogOpen = false;
                        }

                        self.refreshDataList(self.dataIdx);
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
    return TreeMenu;
})











