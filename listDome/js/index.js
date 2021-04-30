/**
 * Created by Administrator on 2017/8/21.
 */
(function () {
    //模拟数据
    var res = {
        list: [
            {
                id: 1,
                name: "陕A 123456",
                type: "奥迪",
                imgSrc: "../images/12.jpg",
                des: "天文学界的共识是，观测其它拥有行星系统，特别是像开普勒-90 这种和太阳系有着明显相同点的星系，对于人类探索宇宙有着重要的意义。比如，一个和太阳系近似的星系中可能有和地球类似的行星→生命存在的可能性较高。"
            },
            {
                id: 2,
                name: "陕A 123456",
                type: "奥迪",
                imgSrc: "../images/12.jpg",
                des: "天文学界的共识是，观测其它拥有行星系统，特别是像开普勒-90 这种和太阳系有着明显相同点的星系，对于人类探索宇宙有着重要的意义。比如，一个和太阳系近似的星系中可能有和地球类似的行星→生命存在的可能性较高。"
            },
            {
                id: 3,
                name: "陕A 123456",
                type: "奥迪",
                imgSrc: "../images/12.jpg",
                des: "天文学界的共识是，观测其它拥有行星系统，特别是像开普勒-90 这种和太阳系有着明显相同点的星系，对于人类探索宇宙有着重要的意义。比如，一个和太阳系近似的星系中可能有和地球类似的行星→生命存在的可能性较高。"
            }
        ],
        num: 6
    };
    //分页
    var page = {
        url:"",
        data:null,
        pageIndex: 1,   //当前分页索引
        pageNum: 10,    //总页数
        getData: function (pageIndex, callback) {
            //ajax
            //...
            var self = this;
            // $.post(this.url,this.data,function () {
            //     self.pageNum = res.num;
            //     callback && callback(res);
            // });

            setTimeout(function () {
                self.pageNum = res.num;
                callback && callback(res);
            }, 2000)
        },
        template: function (list) {
            var html = [], item;
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    item = list[i];
                    html.push('<li>');
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
                    html.push('</li>');
                }
            }
            return html.join("");

        }
    };
    //滑动操作
    var op = {
        ds: 0,       //距离底部多少距离--触发请求数据
        $box: $(".data-box"),   //数据显示节点
        $initLoading: $(".la-line-scale"), //初始化 loading
        $loading: $(".bottom-loading"),     //分页 loading

        //初始化
        init: function (option) {
            page.url = option.url;
            page.data = option.data;
            var self = this;
            this.$initLoading.show();
            page.getData(1, function (res) {
                self.$initLoading.hide();
                op.setHtml(res.list, function () {
                    op.$loading.show();
                });
            });
            this.bindEvent();
        },
        //绑定事件
        bindEvent: function (isOff) {
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
                $win.off('touchmove', move);
            } else {
                $win.on('touchmove', move);
            }

            //编辑按钮--事件
            function editClick() {
                var id = $(this).attr("data-id");
                location.href = "./detail.html?id=" + id;
            }

            //删除按钮--事件
            function delClick() {
                var id = $(this).attr("data-id");
                var $li = $(this).parents("li");
                $li.hide(1000, function () {
                    $li.remove();
                });
                move();
            }

            op.$box.on("click", function (e) {
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


        },
        //卸载事件
        unbindEvent: function () {
            this.bindEvent(true);
        },
        //下一页
        nextPage: function () {
            page.pageIndex++;
            if (page.pageIndex <= page.pageNum) {
                page.getData(page.pageIndex, function () {
                    op.setHtml(res.list)
                })
            } else {
                op.$loading.hide();
                $(".no-list").show();
                op.unbindEvent();
                op.isNoData();
            }
        },
        //修改dom
        setHtml: function (list, callback) {
            var html = page.template(list);
            this.$box.append(html).find("li").show(0, callback || null);
        },
        isNoData: function () {
            if (!op.$box.find("li").length) {
                $(".no-list-data").show();
                $(".no-list").hide();
            }
        }
    };

    $(function () {
        op.init({
            url:"",
            data:""
        })
    })

})();