/**
 * Created by admin on 2018/2/11.
 */
(function () {
    //分页
    function Page(node) {
        var self = this;
        var $node = node;
        if (!$node instanceof jQuery) {
            $node = $(node);
        }
        var opts = {
            url: "",
            numCount: 5,//显示的数量
            prefixCount: 0,//前缀，后缀 数字
            pageIndex: 1,
            pageSize: 10,
            data: null,
            list: [],
            listCount: 0,
            loading: null,//loading function
            loadTime: 300,
            closeLoading: null,//closeLoading function
            success: null,
            method: "post",
            dataType: "json",//传入数据格式  默认为json 可设置为string
            error: null
        };
        var page = {
            pageShow: false,
            size: 10,
            index: 1,
            count: 0,
            list: {}
        };

        function initPager() {
            var listCount = opts.listCount;
            page.pageShow = true;
            page.count = Math.ceil(listCount / opts.pageSize);
            if (page.count <= 1) {
                node.hide();
            } else {
                node.show();
            }
            // 页码数列表
            var getPageList = function () {
                var list = self.getPageNumber(opts.pageIndex, page.count, opts.numCount, opts.prefixCount);
                return {num: list, select: page.index};
            };
            page.list = getPageList();
            var numNode = $node.find(".pageNum");
            // 数字按钮 pageNum
            numNode.find("a").unbind("click.page");
            self.bindPageNubmer(numNode, page.list, opts.prefixCount, page.count);
            numNode.find("a").bind("click.page", function () {
                opts.pageIndex = Number($(this).text()) || 1;
                update();
            });
            $node.find(".total-page span").text(page.count);
            $node.find(".go-page").val(page.index);
            if (page.index <= 1) {
                node.find(".prev").addClass("dis");
                node.find(".first").addClass("dis");
            } else {
                node.find(".prev").removeClass("dis");
                node.find(".first").removeClass("dis");
            }
            if (page.index >= page.count) {
                node.find(".next").addClass("dis");
                node.find(".last").addClass("dis");
            } else {
                node.find(".next").removeClass("dis");
                node.find(".last").removeClass("dis");
            }
        }
        // 更新
        function update() {
            if (page.count > 0 && opts.pageIndex > page.count) {
                opts.pageIndex = page.count;
            }
            page.index = opts.pageIndex;
//                var url = self.format(opts.url, {pageIndex: opts.pageIndex, pageSize: opts.pageSize});
            opts.data.pageIndex = opts.pageIndex;
            opts.data.pageSize = opts.pageSize;
            var timer = 0;
            if (opts.loading) {
                timer = setTimeout(function () {
                    opts.loading();
                }, opts.loadTime);
            }
            $.ajax({
                url: opts.url,
                data: opts.data,
                method: opts.method,
                dataType: opts.dataType,
                success: function (red) {
                    if (typeof(opts.success) == "function") {
                        opts.success.call(opts, red);
                        initPager();
                    }
                },
                error: function () {
                    if (typeof(opts.error) == "function") {
                        opts.error.call(opts);
                        initPager();
                    }
                },
                complete: function () {
                    if (timer) {
                        clearTimeout(timer);
                        opts.closeLoading && opts.closeLoading.call(opts);
                    }
                }
            })
        }

        // 首页按钮
        node.find(".first").bind("click", function () {
            opts.pageIndex = 1;
            update();
        });
        // 上一页按钮
        node.find(".prev").bind("click", function () {
            if (opts.pageIndex <= 1) {
                return;
            }
            opts.pageIndex--;
            update();
        });
        // 下一页按钮
        node.find(".next").bind("click", function () {
            if (opts.pageIndex >= page.count) {
                return;
            }
            opts.pageIndex++;
            update();
        });
        // 末页按钮
        node.find(".last").bind("click", function () {
            opts.pageIndex = page.count;
            update();
        });
        //go 按钮
        node.find(".btn-go").on("click", function () {
            var $input = node.find(".go-page");
            var val = $input.val();
            if (isNaN(val)) {
                $input.focus();
                return;
            }
            val = Number(val);
            if (val <= 0) {
                val = 1;
            }
            if (val > page.count) {
                val = page.count;
            }
            opts.pageIndex = val;
            $input.val(val);
            update();
        });
        return {
            info: page,
            config: function (option) {
                $.extend(opts, option);
                return page;
            },
            post: function (url, data, successFn, option) {
                opts.method = "post";
                //opts.pageIndex = 1;
                $.extend(opts, {url: url, success: successFn, data: data}, option);
                update();
                return page;
            },
            reset: function () {
                opts.pageIndex = 1;
                update();
            },
            refresh: update
        }
    }

    Page.prototype = {
        // 获取中间的数字列表
        getPageNumber: function (pageIndex, pageCount, num, prefixCount) {
            var list = [];
            if (num == 0) {
                return "";
            }
            var txtNumber = num || 5, minPageIndex = 1, maxPageIndex = 1;// 数字数量
            var numberFlag = Math.floor(txtNumber / 2);
            // 判断起止数字，然后循环
            if (pageIndex - numberFlag <= 1 + prefixCount) {
                minPageIndex = 1;
                if (txtNumber > pageCount) {
                    maxPageIndex = pageCount;
                } else {
                    maxPageIndex = txtNumber + prefixCount;
                }
            } else {
                minPageIndex = pageIndex - numberFlag;
                if (pageIndex + numberFlag + prefixCount >= pageCount) {
                    minPageIndex = pageCount - prefixCount - txtNumber + 1;
                    maxPageIndex = pageCount;
                } else {
                    maxPageIndex = pageIndex + numberFlag;
                }
            }
            if (minPageIndex <= 0) {
                minPageIndex = 1;
            }
            for (var i = minPageIndex; i <= maxPageIndex; i++) {
                list.push(i);
            }
            return list;
        },
        // 绑定中间的数字
        bindPageNubmer: function (numNode, res, prefixCount, pageCount) {
            var self = this;
            var html = [], list = res.num, len = list.length;
            if (prefixCount) {
                if (list[0] - prefixCount >= 0) {
                    for (var k = 1; k <= prefixCount; k++) {
                        if (k < list[0]) {
                            html.push('<a  href = "javascript:void(0)">' + (k) + '</a>');
                        }
                    }
                    if (list[0] - prefixCount > 1) {
                        html.push('<label>......</label>');
                    }
                }
            }
            for (var i = 0; i < len; i++) {
                if (list[i] == res.select) {
                    html.push('<a class="active">' + list[i] + '</a>');
                } else {
                    html.push('<a>' + list[i] + '</a>');
                }
            }
            if (prefixCount) {
                if (list[len - 1] <= pageCount - prefixCount) {
                    if (list[len - 1] < pageCount - prefixCount) {
                        html.push('<label>......</label>');
                    }
                    for (var j = prefixCount; j > 0; j--) {
                        if (pageCount - j + 1 > list[len - 1]) {
                            html.push('<a  href = "javascript:void(0)">' + (pageCount - j + 1) + '</a>');
                        }
                    }
                }
            }
            numNode.html(html.join(" "));
        }
    };

    window.Page = Page;
})();