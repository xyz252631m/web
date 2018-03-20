//<!--市-->
//<label class = "xui-label-select city-2" data-val = "003">
//	<strong class = "title">市</strong><i></i><span>杭州</span>
//	<a>
//	<label data-val = "003">杭州</label>
//	</a></label>

//.xui-label-select { display: inline-block; cursor: pointer; .height(38px); .bor(#d0d0d0); .align; width: 148px; position: relative;
//.title { float: right; padding: 0 10px; height: 24px; border-left: #e9e9e9 solid 1px; line-height: 24px; margin-top: 6px; text-align: center }
//	i { width: 9px; height: 5px; float: right; background: url('@{img}/s_btn_bg.jpg') -217px 0 no-repeat; margin-top: 17px; margin-right: 12px; }
//	span { padding-left: 15px; color: #333333; }
//
//	a { display: none; line-height: 40px; max-height: 240px; overflow-y: scroll; width: 100%; position: absolute; top: 38px; left: -1px; .bor(#d0d0d0); background-color: white;
//	&::-webkit-scrollbar { width: 2px; }
//	&::-webkit-scrollbar-track { background-color: #f1f1f1; }
//	&::-webkit-scrollbar-thumb { background-color: #666666; }
//	}
//	label { display: block; text-indent: 15px;
//	&:hover { background-color: #f5f5f5; cursor: pointer; }
//	}
//}
(function ($) {
    var def = {
        list: [], // 列表
        item: {
            id: "",
            text: "--请选择--"
        },
        selectItem: {}, // 选中item
        saveItem: null,
        id: "id", // 列表key
        text: "text", // 列表val
        clickFn: null
        // 点击回调事件
    };

    function listStr(list, opts) {
        var html = [];
        $.each(list || [], function (idx, item) {
            html.push("<label data-val = '" + item[opts.id] + "'>" + item[opts.text] + "</label>")
        })
        return html.join(" ");
    }

    $.fn.selectToggle = function (fn, option) {
        var $root = $(".xui-label-select");
        var $node = $(this), $box = $node.find("a");
        var opts = $.extend({}, def, option);
        if (typeof (fn) == "function") {
            $.extend(opts, {
                clickFn: fn
            });
        } else {
            $.extend(opts, fn);
        }
        // 设置选中值
        function setVal(item) {
//			if (item[opts.text]) {
            if (item.text) {
                //$node.data(item);
                $node.attr("data-val", item.id);
                $node.find("span").text(item.text);
                opts.saveItem = $.extend({}, item);
                item = {};
            }
        }

        function setNullVal() {
            $node.attr("data-val", opts.item.id);
            $node.find("span").text(opts.item.text);
            $box.html("<label data-val = '" + opts.item.id + "'>" + opts.item.text + "</label>")
        }

        // 绑定选中事件
        function bindLabelClick($item) {
            $item.find("label").bind("click", function () {
                var $label = $(this);
                var val = $label.attr("data-val");
                $item.removeClass("select-active");
                $node.data($label.data());

                opts.selectItem = {val: val, text: $label.text()};
                setVal(opts.selectItem);

                // setVal($item,{val:val,text:$label.text()},opts);
                opts.clickFn && opts.clickFn.apply($node, [opts.selectItem]);
                return false;
            })
        }

        // 修改下拉列表
        function changeList(list) {
            $box.html(listStr(list, opts));
            if (opts.selectItem && opts.selectItem.text) {
                setVal(opts.selectItem)
            } else {
                opts.selectItem = {val: list[0][opts.id], text: list[0][opts.text]};
                setVal(opts.selectItem)
            }
        }

        $.each($node, function (idx, item) {
            var $item = $(item);
            // 绑定展开，关闭事件
            $item.bind("click.toggle", function () {
                var hasClass = $(this).hasClass("active");
                $root.removeClass("select-active");
                if (!hasClass) {
                    $(this).addClass("select-active");
                }
                return false
            });
            if (opts.list && opts.list.length) {
                changeList(opts.list);
            }
            if (!$item.find("label").length) {
                setNullVal();
            }
            bindLabelClick($item);
        });
        $(document).on("click.cusSelect",function () {
            $root.removeClass("select-active");
        })
        return {
            reset: function (list, isNext, option) {
                $.extend(true,opts, option);
                if (list && list.length) {
                    changeList(list, isNext);
                } else {
                    setNullVal();
                }
                bindLabelClick($node.eq(0));
                if (option&&option.selectItem) {
                    opts.selectItem = {val: option.selectItem[opts.id], text: option.selectItem[opts.text]}
                }else{
                    opts.selectItem = {val: list[0][opts.id], text: list[0][opts.text]};
                }
                setVal(opts.selectItem);
                isNext && (opts.clickFn && opts.clickFn.apply($node, [opts.selectItem]));
            },
            getSelectItem: function () {
                return opts.saveItem || $node.data();
            }
        }
    }
})(jQuery);
    // var t = $(".city-2").selectToggle(
    //     {
    //         id: "ids", // 列表key
    //         text: "text", // 列表val
    //         list:[{ids:1,text:"Item1"},{ids:2,text:"Item2"}],
    //         clickFn:function(item) {
    //             console.log(item,t.getSelectItem())
    //         }
    //     }
    // );
// })(jQuery);
