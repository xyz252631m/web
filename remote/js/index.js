/**
 * Created by Administrator on 2017/8/21.
 */
(function () {
    var menu = {
        init: function (list, option) {
            var def = {
                pidKey: "pid",
                idKey: "id"
            }
            var opt = this.opt = $.extend({}, def, option);

            var arr = this.initMenuList(list);
            $(".main").html(this.tem(arr, 1, opt));
            $(".main button").on("click", function () {
                var $btn = $(this);
                var id = $btn.attr("data-attr");
            })
        },
        //初始化菜单列表对象
        initMenuList: function (red) {
            var self = this;
            var list = red.filter(function (el) {
                return el[self.opt.pidKey] == 0;
            });
            var tem_obj = {}, i = 0, j = 0, item;
            //获取一级目录
            for (; i < list.length; i++) {
                tem_obj[list[i][self.opt.idKey]] = i;
            }
            //递归
            var getList = function (result, list) {
                for (var j = 0; j < result.length; j++) {
                    item = result[j];
                    if (!item["nextList"]) {
                        item["nextList"] = [];
                    }
                    for (i = 0; i < list.length; i++) {
                        if (list[i][self.opt.pidKey] == item[self.opt.idKey]) {
                            item["nextList"].push(list[i]);
                        }
                    }
                    if (item["nextList"].length) {
                        getList(item["nextList"], list);
                    }
                }
                return result;
            }
            getList(list, red);
            return list;
        },
        //list 数据 grade 第几级菜单
        tem: function (list, grade, opt) {
            var html = [], self = this;
            $.each(list, function (i, el) {
                html.push('<button type="button" data-id="' + el[opt.id] + '" class="btn btn-default btn-lg btn-block ' + ("grade-" + grade) + '">' + (el.title || el.viewTile) + '</button>');
                if (el.nextList.length) {
                    html.push(self.tem(el.nextList, grade + 1, opt));
                }
            })
            return html.join(" ");
        }
    }
    window.menu = menu;

    var $win = $(window), w = $win.width(), h = $win.height();
    $(window).on("resize", function () {
        w = $win.width();
        h = $win.height();
    })
    var startPoint = {
        x: 0,
        y: 0,
        x1: 0,
        y1: 0
    }
    // up 0 down 1  left 2 right 3
    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 2 : 3) : (y1 - y2 > 0 ? 0 : 1)
    }

    $.extend($.fn, {
        _s_init: function (elem, callback) {
            var $elem = $(elem);
            $elem.on("touchstart", function (e) {
                var firstTouch = e.originalEvent == undefined ? e.touches[0] : e.originalEvent.touches[0];
                startPoint.x = firstTouch.pageX;
                startPoint.y = firstTouch.pageY;
                startPoint.x1 = firstTouch.pageX;
                startPoint.y1 = firstTouch.pageY;

            });
            $elem.on("touchmove", function (e) {
                var firstTouch = e.originalEvent == undefined ? e.touches[0] : e.originalEvent.touches[0];
                startPoint.x1 = firstTouch.pageX;
                startPoint.y1 = firstTouch.pageY;
            })
            $elem.on("touchend", function () {
                var direction = swipeDirection(startPoint.x, startPoint.x1, startPoint.y, startPoint.y1);
                if (direction > 1) {
                    callback && callback();
                }
            });
        },
        m_swipe: function (leftCallback, rightCallback) {
            this._s_init(this, function () {
                if ((startPoint.x - startPoint.x1) > w / 5) {
                    leftCallback && leftCallback();
                }
                if ((startPoint.x1 - startPoint.x) > w / 5) {
                    rightCallback && rightCallback();
                }
            })
        }
    })
    $(function () {
        //播放或暂停
        $(".f-play").on("click", function () {
            var $btn = $(this), cls = "fa-pause";
            if ($btn.hasClass(cls)) {
                //暂停
                $btn.removeClass(cls);
            } else {
                //播放
                $btn.addClass(cls);
            }
        })
        //左右移动
        $(".p-box").m_swipe(function () {
            //left
            console.log("left")
        }, function () {
            //right
            console.log("right")
        })
        $(".p-box").on("click",function (e) {
            if(e.target.nodeName=="SPAN"){
                return;
            }
            $(".f-play").trigger("click");
        })
        //收缩
        $(".f-down").on("click",function () {
            $(".pointer-box").hide();
            $(".con-box").show();
            $(".btn-box").removeClass("pointer-active")
        })
        //展开
        $(".f-up").on("click",function () {
            $(".pointer-box").show();
            $(".con-box").hide();
            $(".btn-box").addClass("pointer-active")
        })

        //提示层
        $(".pointer-tip").on("click",function () {
            $(this).hide();
        })
    })
})()