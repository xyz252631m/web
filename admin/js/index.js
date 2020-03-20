//menuData

var menu = {
    map: {},
    treeData: [],
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
            if (e.target.nodeName === "I") {
                $li = $li.parent();
            }
            return $li;
        };
        var self = this;
        $(".list-box").on("click", function (e) {

            var $li = getLi(e);
            var src = $li.attr("data-src");
            console.log(this)

        }).on("mouseover", function (e) {
            console.log(e.target.nodeName)
            if (e.target.nodeName === "LI") {
                var $li = $(e.target);
                var id = $li.attr("data-id");
                var item = self.getMenuItem(id);
                var level = +$li.parent().attr("data-level");
                var str = self.create(item.children, level + 1);
                self.removeUl(level);
                self.getItemLine(item, level);
                $(".list-box").append(str);
            }
        })
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
        $(".list-box").html(str);

    }
};

menu.toTree(menuData);


var leftMenu = {}
$(function () {
    menu.bindEvent();
    menu.oneCite();

    $(".tab-box li").on("click", function () {

        $(".tab-box li").removeClass("active");
        $(this).addClass("active")
    });

    //left menu
    $(".sidebar-menu a").on("click", function () {
        var $li = $(this).parent();
        if ($li.hasClass("active")) {
            $li.removeClass("active");
            $li.find(">ul").slideUp(200);
        } else {
            $li.addClass("active");
            $li.find(">ul").slideDown(200);
        }
    })
});














