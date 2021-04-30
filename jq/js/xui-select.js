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
        click: null // 点击回调事件
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
        var actCls = "select-active";
        if (typeof (fn) == "function") {
            $.extend(opts, {
                click: fn
            });
        } else {
            $.extend(opts, fn);
        }
        // 设置选中值
        function setVal(item) {
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
                $item.removeClass(actCls);
                $node.data($label.data());
                opts.selectItem = {val: val, text: $label.text()};
                setVal(opts.selectItem);
                opts.click && opts.click.apply($node, [opts.selectItem]);
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
                var hasClass = $(this).hasClass(actCls);
                $root.removeClass(actCls);
                if (!hasClass) {
                    $(this).addClass(actCls);
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
        $(document).on("click.cusSelect", function () {
            $root.removeClass(actCls);
        });
        return {
            reset: function (list, isNext, option) {
                $.extend(true, opts, option);
                if (list && list.length) {
                    changeList(list, isNext);
                } else {
                    setNullVal();
                }
                bindLabelClick($node.eq(0));
                if (option && option.selectItem) {
                    opts.selectItem = {val: option.selectItem[opts.id], text: option.selectItem[opts.text]}
                } else {
                    opts.selectItem = {val: list[0][opts.id], text: list[0][opts.text]};
                }
                setVal(opts.selectItem);
                isNext && (opts.click && opts.click.apply($node, [opts.selectItem]));
            },
            getSelectItem: function () {
                return opts.saveItem || $node.data();
            }
        }
    }
})(jQuery);
