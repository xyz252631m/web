$(function () {

    //头部导航事件
    var $menuList = $(".nav-links .nav-item");
    $menuList.on("click", function () {
        var idx = $menuList.index(this);
        $menuList.removeClass("active").eq(idx).addClass("active");
        $(".page-main .nav-panel").hide().eq(idx).fadeIn(400);
    })

    $menuList.eq(4).click();

    //类型选择
    $(".type-select-box label").on("click", function () {
        var $p = $(this).parent();
        var $list = $p.find("label");
        var idx = $list.index(this);
        $list.removeClass("active").eq(idx).addClass("active");
        $p.attr("data-val", $(this).attr("data-val"));
    })

    //日志页面
    var log = {
        $box: $(".log-box"),
        init: function () {
            this.$links = this.$box.find(".left-sidebar li");
            this.$links_li = this.$box.find(".log-list-box h4>a");
            this.bindEvents();
        },
        bindEvents: function () {
            var self = this;
            this.$links.on("click", function () {
                var idx = self.$links.index(this);
                self.$links.removeClass("active").eq(idx).addClass("active");
                var href = $(this).find("a").attr("href");
                var pos = $(href).offset().top;
                var scrollTop = document.scrollingElement.scrollTop;
                var val = Math.abs(scrollTop - (pos - 70));
                self.scrollTo(pos - 70, val)
                return false;
            })

            this.$links_li.on("click", function () {
                var href = $(this).attr("href");
                var pos = $(href).offset().top;
                var scrollTop = document.scrollingElement.scrollTop;
                var val = Math.abs(scrollTop - (pos - 70));
                self.scrollTo(pos - 70, val)
                return false;
            })

        },
        scrollTo: function (val, timer) {
            $(document.scrollingElement).animate({
                scrollTop: val
            }, timer);
        }
    }

    log.init();

    //添加日志
    var addLog = {
        $box: $(".add-log-box"),
        logItem: {
            title: "",
            list: []
        },
        init: function () {
            var self = this;
            //添加日志条目事件
            this.$box.find(".btn-ok").on("click", function (e) {
                var item = self.getLogItem();
                var id = $(this).attr("data-id");
                self.$box.find("textarea").removeClass("input-error");
                if (item.text) {
                    if (id) {
                        self.logItem.list.forEach(function (d) {
                            if (d.id === id) {
                                d.text = item.text;
                                d.id = item.id;
                                d.type = item.type;
                            }
                        })
                        $(this).removeAttr("data-id");
                    } else {
                        self.logItem.list.push(item);
                    }

                    $(this).removeClass("btn-warning").text("添加");
                    self.resetHtml();
                    //复原
                    self.setLogItemHtml({
                        type: self.$box.find(".type-select-box label").eq(0).attr("data-val"),
                        text: ""
                    })
                } else {
                    setTimeout(function () {
                        self.$box.find("textarea").addClass("input-error");
                    }, 0)
                }
            })

            //删除事件
            this.$box.find("ol").on("click", ".li-del", function (e) {
                var idx = self.$box.find(".li-del").index(this);
                if (idx >= 0) {
                    self.logItem.list.splice(idx, 1);
                    self.resetHtml();
                }
                return false;
            })

            //点击进行修改事件
            this.$box.find("ol").on("click", "li", function (e) {
                var idx = self.$box.find("ol li").index(this);
                if (idx >= 0) {
                    var item = self.logItem.list[idx];
                    self.setLogItemHtml(item);
                    self.$box.find(".btn-ok").attr("data-id", item.id).addClass("btn-warning").text("修改");
                }
            })

            //保存
            this.$box.find(".btn-save").on("click", function () {
                var title = self.$box.find(".input-log-title").removeClass("input-error").val();
                if (!title) {
                    setTimeout(function () {
                        self.$box.find(".input-log-title").addClass("input-error");
                    }, 0)
                    return;
                }
                self.logItem.title = title;
                if (self.logItem.list.length === 0) {
                    return;
                }

                console.log(self.logItem)

            })
        },
        //获取日志条目
        getLogItem: function () {
            var item = {
                id: (+new Date()) + '',
                type: this.$box.find(".type-select-box").attr("data-val"),
                text: this.$box.find("textarea").val()
            }
            return item;
        },
        //修改日志条目
        setLogItemHtml: function (item) {
            if (item) {
                this.$box.find(".type-select-box").find("label[data-val='" + item.type + "']").click();
                this.$box.find("textarea").val(item.text);
            }
        },
        resetHtml: function () {
            var h = [];
            this.logItem.list.forEach(function (d) {
                h.push('<li><label>' + d.text + '</label><span class="li-del"><i class="fa fa-close"></i></span></li>')
            });
            if (h.length === 0) {
                this.$box.find("ol").html("").hide();
            } else {
                this.$box.find("ol").html(h.join("")).fadeIn(400)
            }

        },

    };
    addLog.init();

})