/**
 * Created by Administrator on 2017/8/21.
 */
(function () {
    function getSearchName(name) {
        var str = location.search.replace(/\?/, "");
        var arry = str.split("&");
        var obj = {};
        $.each(arry, function () {
            var tem = this.split("=");
            obj[tem[0]] = decodeURIComponent(tem[1]);
        });
        return obj[name] || "";
    }

    //绑定默认值
    function initValue() {


    }

    $(function () {
        initValue();
        var editType = getSearchName("edit") || 1;
        if (editType == 0) {
            $(".list input").each(function () {
                $(this).attr("readonly", true);
            });
            $(".btn-box").hide();
            $(".view").css("bottom", 0);
            $(".btn-box-read").show();
        }

        //取消按钮
        $(".btn-cel").on("click", function () {
            location.href = "./index.html";
        });
        //提交
        $(".btn-submit").on("click", function () {
            $("#detail_form").submit();
        });
        //返回
        $(".btn-back").on("click", function () {
            history.go(-1)
        });


    })

})();