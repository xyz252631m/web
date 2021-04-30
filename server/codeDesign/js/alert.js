define("alert", function () {
    function box(str) {
        var html = [];
        html.push('<div class="popup-container popup-showing active">');
        html.push('<div class="popup">');
        html.push('<div class="popup-head">');
        html.push('<div class="popup-title">提示</div>');
        html.push('</div>');
        html.push('<div class="popup-body">' + str + '</div>');
        html.push('<div class="popup-buttons">');
        html.push('<button class="button button-block button-assertive">确定</button>');
        html.push('<button class="button button-block button-default">取消</button>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        return html.join(" ");
    }
    // Vue.directive('tap', {
    //     bind: function () {
    //         console.log("tap")
    //     },
    //     // 当被绑定的元素插入到 DOM 中时……
    //     inserted: function (el) {
    //         console.log("tap", el)
    //     }
    // });
    //modal
    let t = {
        close() {
            var $box = $(".popup-container");
            $(".backdrop").removeClass("active");
            $box.removeClass("active").addClass("popup-hidden");
            setTimeout(function () {
                $box.remove();
                $(".backdrop").removeClass("visible");
            }, 200);
        },
        //确认框
        confirm(text, option) {
            var html = box(text);
            var $box = $(html);
            var $btn = $box.find(".popup-buttons button");
            var close = this.close;
            $btn.eq(0).on("click", function () {
                option && option.success && option.success();
                //close();
            });
            $btn.eq(1).on("click", function () {
                option && option.cel && option.cel();
                close();
            });
            $(".backdrop").addClass("visible active");
            // $("body").append('<div class="backdrop visible active"></div>');
            $("body").append($box);
        }
    };
    return t;
});
