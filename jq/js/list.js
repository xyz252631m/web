/**
 * Created by Administrator on 2017/8/21.
 */
(function () {
    $.extend($.fn, {
        //绑定select option list
        setSelectOption: function (list, option) {
            var opt = $.extend({val: "val", text: "text"}, option);
            var html = [], selectId = this.attr("data-val");
            $.each(list, function () {
                html.push('<option value="' + this[opt.val] + '" ' + ( (this[opt.val] != undefined && this[opt.val] == selectId) ? "selected" : "" ) + '>' + this[opt.text] + '</option>');
            });
            this.html(html.join(""))
        },
        //设置select选中值
        setSelectVal: function (val) {
            this.attr("data-val", val);
            this.val(val);
        },
        listPage: function (option) {
            var template = function (item) {
                var html = [];
                html.push('<h3>');
                html.push('<span class="t-btn">');
                html.push('<button class="btn-edit" data-id="' + item.id + '">');
                html.push('<i class="fa fa-pencil"></i>');
                html.push('</button>');
                html.push('<button  class="btn-del"  data-id="' + item.id + '">');
                html.push('<i class="fa fa-remove"></i>');
                html.push('</button>');
                html.push('</span>');
                html.push('<span>' + item.name + '</span>');
                html.push('<label>' + item.type + '</label>');
                html.push('</h3>');
                html.push('<div class="main-img">');
                html.push('<a href="./detail.html?edit=0"><img src="' + item.imgSrc + '"/></a>');
                html.push('</div>');
                html.push('<div class="des"><a href="./detail.html?edit=0">');
                html.push(item.des);
                html.push('</a></div>');
                return html.join("");
            };
            var def = {
                ds: 10,    //距离底部多少距离--触发请求数据
                template: template,       //item模板函数
                tipTemplate: "<p>暂无数据</p>",            //无数据---提示模板
                initLoadClass: "la-line-scale",                 //初始化loading 样式
                ajaxLoadClass: "bottom-loading",               //请求数据loading 样式
                ajax: null,         //ajax 参数
                bindEvent: null,    //绑定事件函数
                init: null   //初始化函数
            };

            var opt = $.extend(def, {elem: this}, option);
            var op = {
                ds: opt.ds,
                $box: null,   //数据显示节点
                $initLoading: null, //初始化 loading
                $loading: null,     //分页 loading
                $tip: null,
                init: function (opt) {
                    var html = [];
                    html.push('<div class="box-init-loading ' + opt.initLoadClass + '">');
                    html.push('<div></div>');
                    html.push('<div></div>');
                    html.push('<div></div>');
                    html.push('<div></div>');
                    html.push('<div></div>');
                    html.push('</div>');
                    html.push('<ul class="data-box"></ul>');
                    html.push('<div class="box-ajax-loading ' + opt.ajaxLoadClass + '">');
                    html.push('<span></span><span></span><span></span><span></span><span></span>');
                    html.push('</div>');
                    html.push('<div class="no-list-data">');
                    html.push(opt.tipTemplate);
                    html.push('</div>');
                    html.push('<div class="box-last-item">');
                    html.push('<p>已到底部</p>');
                    html.push('</div>');
                    opt.elem.html(html.join(""));
                    this.$box = opt.elem.find(".data-box");
                    this.$initLoading = opt.elem.find(".box-init-loading"); //初始化 loading
                    this.$loading = opt.elem.find(".box-ajax-loading");     //分页 loading
                    this.$tip = opt.elem.find(".box-last-item");    //已到底部提示
                    this.$noList = opt.elem.find(".no-list-data");  //无数据提示
                    opt.init && opt.init.apply(op, [opt.elem]);
                },
                //绑定事件
                bindMoveEvent: function (isOff) {
                    var timer = 0, $win = $(window), height = $win.height();

                    function move() {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            if (op.$loading.offset().top + 27 - 10 <= $win.scrollTop() + height + op.ds) {
                                op.nextPage();
                            }
                            timer = 0;
                        }, 500);
                    }

                    //滑动事件
                    if (isOff) {
                        $win.off('touchmove');
                    } else {
                        $win.on('touchmove', move);
                    }
                },
                //卸载事件
                unbindMoveEvent: function () {
                    this.bindMoveEvent(true);
                },
                //下一页
                nextPage: function () {
                    page.pageIndex++;
                    if (page.pageIndex <= page.pageNum) {
                        console.log("---------", page.pageIndex)
                        page.getData(page.pageIndex, function (res) {
                            var $html = op.setHtml(res.list);
                            opt.bindEvent && opt.bindEvent($html);
                        })
                    } else {
                        op.$loading.hide();
                        op.$tip.show();
                        op.unbindMoveEvent();
                        op.isNoData();
                    }
                },
                //修改dom
                setHtml: function (list, callback) {
                    var $html = $(page.template(list));
                    this.$box.append($html).find("li").show(0, callback || null);
                    return $html;
                },
                isNoData: function () {
                    if (!op.$box.find("li").length) {
                        op.$noList.show();
                        op.$tip.hide();
                    }
                }
            };
            //分页
            var page = {
                pageIndex: 1,   //当前分页索引
                pageNum: 10,    //总页数
                getData: function (pageIndex, callback) {
                    //ajax
                    //...
                    var self = this;
                    $.extend(opt.ajax.data, {pageIndex: pageIndex});
                    $.ajax(opt.ajax).then(function (res) {
                        self.pageNum = res.num;
                        callback && callback(res);
                    })
                },
                template: function (list) {
                    var html = [], item;
                    if (list) {
                        for (var i = 0; i < list.length; i++) {
                            item = list[i];
                            html.push('<li>');
                            html.push(opt.template(item));
                            html.push('</li>');
                        }
                    }
                    return html.join("");
                }
            };
            op.init(opt);
            function initData() {
                op.$initLoading.show();
                page.getData(1, function (res) {
                    op.$initLoading.hide();
                    var $html = op.setHtml(res.list, function () {
                        op.$loading.show();
                    });
                    opt.bindEvent && opt.bindEvent.call(op, $html);
                    op.isNoData();
                    $(window).trigger("touchmove");
                });
                op.bindMoveEvent();
            }

            initData();

            return {
                //重置
                reset: function (option) {
                    opt = $.extend(true, opt, option);
                    page.pageIndex = 1;
                    op.$tip.hide();
                    op.$loading.hide();
                    op.$box.html("");
                    op.unbindMoveEvent();
                    initData();
                }
            }
        }
    });


    $(function () {
        var i = 0;
        var list = $("#listBox").listPage({
            ajax: {
                url: "./list.json",
                data: {},
                success: function (res) {
                    i++;
                    res.list[1].name += " --" + i;
                }
            },
            bindEvent: function (elem) {
                //绑定事件--每次请求ajax都会触发
                //console.log(elem)

            },
            init: function (elem) {
                //编辑按钮--事件
                function editClick() {
                    var id = $(this).attr("data-id");
                    location.href = "./detail.html?id=" + id;
                }

                //删除按钮--事件
                function delClick() {
                    var id = $(this).attr("data-id");
                    var $li = $(this).parents("li");
                    $li.hide(500, function () {
                        $li.remove();
                        $(window).trigger("touchmove");
                    });
                }

                //绑定事件
                elem.find("ul").on("click", function (e) {
                    if (e.target.nodeName == "BUTTON") {
                        if (e.target.className == "btn-edit") {
                            editClick.apply(e.target)
                        }
                        if (e.target.className == "btn-del") {
                            delClick.apply(e.target)
                        }
                    }
                    if (e.target.nodeName == "I" && e.target.parentNode.nodeName == "BUTTON") {
                        if (e.target.parentNode.className == "btn-edit") {
                            editClick.apply(e.target.parentNode)
                        }
                        if (e.target.parentNode.className == "btn-del") {
                            delClick.apply(e.target.parentNode)
                        }
                    }
                })
            }

        });
        //搜索
        $(".btn-search").on("click", function () {
            list.reset({
                ajax: {
                    data: {}
                }
            });
        })
    })

})();