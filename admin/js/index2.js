//menuData

var menu = {
    map: {},
    treeData: [],
    $menuBox: null,
    init: function () {
        this.$menuBox = $(".menu-box");
        this.bindEvent();
        this.bindMainBtn();
    },
    bindMainBtn: function () {
        var self = this;
        $(".tb-menu").on("click", function () {
            self.toggleMenu();
        })
    },
    //处理数据 将list数据转为tree层级数据
    toTree: function (list) {
        var map = {}, newList = [];
        $.each(list, function () {
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
        this.map = map;
        this.treeData = newList;
    },
    getMenuItem: function (id) {
        return this.map[id];
    },
    bindEvent: function () {
        var getLi = function (e) {
            var $li = $(e.target);
            if (e.target.nodeName !== "LI") {
                $li = $li.parent("li");
            }
            console.log($li);
            return $li;
        };
        var self = this;
        $(".list-box").on("click", function (e) {
            var $li = getLi(e);
            var src = $li.attr("data-src");
            var $tab = leftTab.addTab($li.find(">a").text().trim(), "");
            self.hideMenu();
            leftTab.activeTab($tab);
            console.log(this)

        });
    },
    getItemLine: function (item, level) {

    },
    removeUl: function (level) {
        $(".list-box").find("ul").each(function () {
            if ($(this).attr("data-level") > level) {
                $(this).remove();
            }
        });
    },
    create: function (list, level) {
        var h = [];
        if (list.length) {
            h.push('<ul class="ul-' + level + '" data-level="' + level + '">');
            $.each(list, function (idx) {
                h.push('<li data-id="' + this.id + '" data-url="' + this.url + '" data-clen="' + this.children.length + '">');
                if (this.ico) {
                    h.push('<i class="' + this.ico + '"></i>');
                } else {
                    h.push('<i class="fa fa-file-text-o"></i>');
                }
                h.push(this.text);
                if (this.children && this.children.length) {
                    h.push('<i class="fa fa-angle-right icon-arrow"></i>');
                }
                h.push('</li>');
            });
            h.push('</ul>');
        }
        return h.join("");
    },
    oneCite: function () {
        var str = this.create(this.treeData, 1);
        $(".list-box .left-tree-box").html(str);
    },
    //切换菜单
    toggleMenu: function () {
        // if (this.$menuBox.is(":hidden")) {
        if (this.$menuBox.hasClass("menu-show")) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    },
    //开启菜单 45
    showMenu: function () {
        // this.$menuBox.fadeIn(300);
        $(".menu-box").addClass("menu-show").removeClass("menu-hide");
    },
    //隐藏菜单
    hideMenu: function () {
        // this.$menuBox.fadeOut(300);
        $(".menu-box").addClass("menu-hide").removeClass("menu-show");
    }
};

//menu.toTree(menuData);

//左侧标签栏

var leftTab = {
    $tabBox: null,
    $tabList: null,
    init: function () {
        this.$tabBox = $(".tab-box");
        this.initTabList();
        this.bindMenuEvent();
        this.bindClick();
    },
    initTabList: function () {
        this.$tabList = this.$tabBox.find("li").not(".add-li");
    },
    //绑定菜单事件
    bindMenuEvent: function () {
        var $addLi = this.$tabBox.find(".add-li");
        $addLi.on("click", function () {
            menu.toggleMenu();
        })
    },
    //绑定点击事件
    bindClick: function () {
        var self = this;
        this.$tabBox.on("click", function (e) {
            var $li = null;
            if (e.target.nodeName === "LI") {
                $li = $(e.target);
            } else if (e.target.nodeName === "A") {
                $li = $(e.target.parentNode);
            } else if (e.target.nodeName === "SPAN") {
                $li = $(e.target.parentNode.parentNode);
            } else if (e.target.nodeName === "I") {
                //关闭事件
                self.delTab($(e.target.parentNode.parentNode));
            }
            if ($li) {
                if (!$li.hasClass("add-li")) {
                    self.activeTab($li);
                }
            }
            console.log($li)
        });
        // this.$tabList.on("click", function () {
        //     self.activeTab($(this));
        // });
    },
    addTab: function (name, src) {
        var $tab = $('<li class="active"><a href="javascript:void(0)"><i class="fa fa-file-o"></i><span>' + name + '</span><i class="fa fa-close i-close"></i></a></li>');
        this.$tabList.eq(0).after($tab);
        this.initTabList();
        return $tab;
    },
    delTab: function ($li) {
        $li.remove();
        this.initTabList();
    },
    activeTab: function ($li) {
        this.$tabList.removeClass("active");
        $li.addClass("active");
    }

};


var ifr = {
    create:function () {
        var $tab = $('<iframe></iframe>');
    },

};


$(function () {
    menu.init();
    leftTab.init();
    //menu.bindEvent();
    //menu.oneCite();
    console.log(leftTab);

    //left menu
    // $(".sidebar-menu a").on("click", function () {
    //     var $li = $(this).parent();
    //     if ($li.hasClass("active")) {
    //         $li.removeClass("active");
    //         $li.find(">ul").slideUp(200);
    //     } else {
    //         $li.addClass("active");
    //         $li.find(">ul").slideDown(200);
    //     }
    // })
});














