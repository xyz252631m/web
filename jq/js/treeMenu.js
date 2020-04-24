/*
*des:树形菜单
* */
define(function () {
    function TreeMenu(option) {
        var defs = {
            //菜单节点
            $el: null,
            //操作框
            $opBox: null,
            //是否存在 操作按钮 可以为function
            hasOpBtn: false,
            //操作框 显示之前的事件
            opBoxShowBefore: null,
            //点击事件
            click: null,
            //操作框点击事件 type：返回html上的data-type属性值
            opClick: null
        };
        this.map = {};
        this.opt = $.extend({}, defs, option);
        this.$menuBox = this.opt.$el;
        this.lastLi = null;
    }

    $.extend(TreeMenu.prototype, {
        init: function () {
            this.bindEvent();
            this.createTreeMenu(this.treeData);
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


        //选中某一项数据
        selectItem: function (id) {
            var item = this.map[id];
            if (item) {
                var $ul = this.$menuBox.find(">ul");
                var $li = this.$menuBox.find("li[data-id=" + id + "]");
                $li.trigger("click", true);
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
            var fn = function (list, level) {
                var h = [];
                if (list.length) {
                    h.push('<ul class="ul-' + level + '" data-level="' + level + '">');
                    $.each(list, function (idx) {
                        h.push('<li data-id="' + this.id + '" data-clen="' + this.children.length + '">');
                        h.push('<a href="javascript:void(0);">');
                        if (this.type === "catalog" || this.children && this.children.length) {
                            h.push('<span class="arrow"><i class="fa fa-fw fa-caret-right"></i></span>');
                        }
                        h.push('<label>');
                        switch (this.icoType) {
                            case "home":
                                h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                                break;
                            default:
                                h.push('<span class="icon-box"> <i class="fa fa-fw fa-file-text"></i></span>');
                                break;
                        }
                        h.push(this.name);
                        h.push('</label>');

                        if (typeof (self.opt.hasOpBtn) === "function") {
                            var flag = self.opt.hasOpBtn.call(self, this);
                            if (flag) {
                                h.push('<span class="icon-op"><i class="fa fa-fw fa-reorder"></i></span>');
                            }
                        } else {
                            if (!!self.opt.hasOpBtn) {
                                h.push('<span class="icon-op"><i class="fa fa-fw fa-reorder"></i></span>');
                            }
                        }
                        h.push('</a>');
                        if (this.type === "catalog" || this.children && this.children.length) {
                            h.push(fn(this.children, level + 1));
                        }
                        h.push('</li>');
                    });
                    h.push('</ul>');
                }
                return h.join("");
            };
            var htmlStr = fn(childrenList, level || 1);
            return htmlStr;
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
                        var $ul = $li.find(">ul");
                        if ($ul.is(":hidden")) {
                            if (noAni) {
                                $ul.show();
                            } else {
                                $ul.slideDown(200);
                            }

                            $li.removeClass("close-ul");
                            $li.addClass("open-li");
                            catalogOpen = true;
                        } else {
                            if (noAni) {
                                $ul.hide();
                            } else {
                                $ul.slideUp(200);
                            }

                            $li.addClass("close-ul");
                            $li.removeClass("open-li");
                            catalogOpen = false;
                        }
                    }
                    self.lastLi && self.lastLi.removeClass("active")
                    $li.addClass("active");
                    self.lastLi = $li;
                    if (self.opt.click) {
                        self.opt.click.call(self, item, $li, catalogOpen);
                    }
                }
            });
        }
    });
    return TreeMenu;
})











