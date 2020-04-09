//alert 插件
(function (a) {
    // 插件的defaults    
    var defaults = {
        title: "提示",
        url: "",
        width: 350,
        height: 160,
        isMove: false,
        isborder: true,
        borwidth: 4,
        iframeWidth: "100%",
        ifremeHeight: '160px',
        showShadeLayer: true,
        noBtn: false,
        init: function () { },
        content: "", //直接显示此内容
        tiptype: "success",   //success error none
        closetxt: '关闭',
        close: function () { },    //右上角 and  关闭按钮的回调函数
        submittxt: '确定',
        submit: function () { } //确认的回调函数
    };
    var opts, index = 1;
    var mx, my, ex, ey, IsDown = false;
    a.alertBox = function () { };
    var tool = {
        //标题
        getTitle: function (opts) {
            var arrHtml = [];
            var id = ++index;
            arrHtml.push(opts.showShadeLayer ? "<div id='shade" + id + "' class='alertbox-shade'></div>" : "");
            arrHtml.push('<div id="box' + id + '" class="alertbox"  style="width:' + opts.width + 'px;height:' + opts.height + 'px;">');
            if (opts.isborder) {
                arrHtml.push('<div class="box-bor" style="width:' + (opts.width + opts.borwidth * 2 + 2) + 'px;height:' + (opts.height + opts.borwidth * 2 + 2) + 'px;"></div>');
            }
            arrHtml.push('<div class="box-con"  style="width:' + opts.width + 'px;height:' + opts.height + 'px; top:' + opts.borwidth + 'px;left:' + opts.borwidth + 'px">');
            arrHtml.push("<h3 ><span class='alertbox-close'><a class='close'>x</a></span>");
            arrHtml.push(opts.title);
            arrHtml.push("</h3>");
            return arrHtml;
        },
        //按钮
        getBtn: function (opts) {
            if (!opts.noBtn) {
                if (opts.tiptype == "error" || opts.tiptype == "success" || opts.tiptype == "info") {
                    return "<div class='alert-info'><input type='button' class='box-btn-close' value='" + opts.closetxt + "'/></div>";
                } else {
                    return "<div class='alert-btn'><input type='button' class='box-btn-close' value='" + opts.closetxt + "'/><input class='box-btn-submit' type='button' value='" + opts.submittxt + "'  /></div>"
                }
            }
        },
        //sueescc error info
        cuscontent: function (options, img) {
            opts = $.extend({}, defaults, options);
            var arrHtml = this.getTitle(opts);
            arrHtml.push('<div class="alert-main">');
            arrHtml.push(img);
            arrHtml.push("<span style='width: " + (opts.width - (img ? 100 : 20)) + "px;display: inline-block;'>");
            arrHtml.push(opts.content);
            arrHtml.push('</span>');
            arrHtml.push('</div>');
            arrHtml.push(this.getBtn(opts));
            arrHtml.push("</div></div>");
            this.addBody(arrHtml.join(""));
            opts.init.call(a.alertBox);
        },
        //添加到body
        addBody: function (html) {
            $("body").append(html);
            if (opts.isMove) {
                $("#box" + index).find(".box-con>h3").css("cursor", "move");
                $("#box" + index).find(".box-con>h3").bind("mousedown", mouseDown.bind([], index));
            }
            if (opts.isMove) {
                $(window).unbind("resize").unbind("scroll");
            } else {
                $(window).resize(function () {
                    tool.init_resize();
                });
                $(window).scroll(function () {
                    tool.init_resize();
                });
            }
            $("#box" + index).find(".close").on("click", a.alertBox.hide.bind([], index));
            $("#box" +index).find(".box-btn-close").on("click", a.alertBox.hide.bind([], index));
            $("#box" + index).find(".box-btn-submit").on("click", a.alertBox.submit.bind([],index))
            this.init_resize();
        },
        //首次加载--设置位置(居中)
        init_resize: function () {
            var lwidow = $("#box" + index);
            var width = $(window).innerWidth();
            var height = $(window).innerHeight();
            var y = $(this).scrollTop();
            lwidow.css({
                left: ((width - lwidow.outerWidth() - 10) / 2) + "px", top: ((height - lwidow.outerHeight() - 10) / 2) + "px"
            });
        }
    };
    //ifram
    a.alertBox.iframe = function (options) {
        opts = $.extend({}, defaults, options);
        var arrHtml = tool.getTitle(opts);
        arrHtml.push('<div class="alert-main"><iframe FRAMEBORDER="0" style="width:' + options.iframeWidth + ';height:' + options.ifremeHeight + ';" src="');
        arrHtml.push(options.url + '"></iframe></div>');
        arrHtml.push(tool.getBtn(opts));
        arrHtml.push("</div>");
        tool.addBody(arrHtml.join(""));
    };
    //custom
    a.alertBox.custom = function (options) {
        options.tiptype = "custom";
        tool.cuscontent(options, "");
    }
    //info  必传  content 参数
    a.alertBox.info = function (options) {
        var img = "<img src='../../images/alertBox/info.png' width='70' height='70'/>";
        options.tiptype = "info";
        tool.cuscontent(options, img);
    };
    //error 必传  content参数
    a.alertBox.error = function (options) {
        var img = "<img src='../../images/alertBox/error.png' width='70' height='70'/>";
        options.tiptype = "error";
        tool.cuscontent(options, img);
    };
    //sueescc 必传  content参数
    a.alertBox.sueescc = function (options) {
        var img = "<img src='../../images/alertBox/success.png' width='70' height='70'/>";
        options.tiptype = "success";
        tool.cuscontent(options, img);
    };
    //confirm 必传  content参数
    a.alertBox.confirm = function (options) {
        var img = "<img src='../../images/alertBox/confirm.png' width='70' height='70'/>";
        options.tiptype = "confirm";
        tool.cuscontent(options, img);
    };
    //确认方法
    a.alertBox.submit = function (id) {
        opts.submit.call(a.alertBox);
    }
    //遮罩层隐藏
    a.alertBox.hide = function (ids) {
        var id = ids || index;
        $("#box" + index).find(".close").unbind("click");
        $("#box" + index).find(".box-btn-close").unbind("click");
        $("#box" + index).find(".box-btn-submit").unbind("click");
        $("#box" + id).remove();
        $("#shade" + id).remove();
        opts.close.call(a.alertBox);
    }
    //点击事件
    function mouseDown(id, obj) {
        $("#box" + id).show();
        var et = obj || event;
        IsDown = true;
        $("body").bind("mousemove", move.bind([], id)).bind("mouseup", up);
        ex = et.clientX;
        ey = et.clientY;
        var lwidow = $("#box" + id);
        mx = lwidow.offset().left;
        my = lwidow.offset().top - $(window).scrollTop();
    }
    //移动事件
    function move(id, obj) {
        var et = obj || event;
        var lwidow = $("#box" + id);
        var lwidth = lwidow.outerWidth();
        var lheight = lwidow.outerHeight();
        if (IsDown) {
            var movex = mx + et.clientX - ex;
            var movey = my + et.clientY - ey;
            //设定width边界
            if (($(window).innerWidth() - mx - lwidth) < (et.clientX - ex)) {
                movex = $(window).innerWidth() - lwidth;
            }
            movex = movex < 0 ? 0 : movex;
            //设定height边界
            if (($(window).innerHeight() - my - lheight) < (et.clientY - ey)) {
                movey = $(window).innerHeight() - lheight;
            }
            movey = movey < 0 ? 0 : movey;
            $(lwidow).css({
                "left": movex, "top": movey
            });
        }
    };
    //移除移动事件
    function up() {
        IsDown = false;
        $("body").unbind("mousemove").unbind("mouseup");
    };
    window.alertBox = a.alertBox;
})(jQuery);