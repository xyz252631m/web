/*jquery 扩展函数*/
;(function ($) {
	Array.prototype.p = Array.prototype.push;
	Date.prototype.format = function(fmt)
	{ //author: meizz
		var o = {
			"M+" : this.getMonth()+1,                 //月份
			"d+" : this.getDate(),                    //日
			"h+" : this.getHours(),                   //小时
			"m+" : this.getMinutes(),                 //分
			"s+" : this.getSeconds(),                 //秒
			"q+" : Math.floor((this.getMonth()+3)/3), //季度
			"S"  : this.getMilliseconds()             //毫秒
		};
		if(/(y+)/.test(fmt))
			fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("("+ k +")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		return fmt;
	}
	var tool = {
		jsonp: function (url, data, success, error, complete) {
			zhx.data.jsonp(url, data)
				.success(function (res) {
					success && success(res);
				})
				.error(function (err) {
					error && error(err);
				})
				.complete(function (msg) {
					complete && complete(msg);
				})
		},
		// 获取中间的数字列表
		getPageNumber: function (pageIndex, pageCount, num, prefixCount) {
			var list = [];
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
			if (maxPageIndex > pageCount) {
				maxPageIndex = pageCount;
			}
			for (var i = minPageIndex; i <= maxPageIndex; i++) {
				list.push(i);
			}
			return list;
		},
		//绑定中间的数字
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
		},
		//格式化字符串
		format: function (str, data) {
			var result = str;
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					var value = data[key];
					if (undefined != value) {
						result = result.replace(new RegExp("\\{" + key + "\\}", "gm"), value);
					}
				}
			}
			return result;
		}
	}
	$.extend($.fn, {
		//树状选择
		tree: function (option) {
			var $node = $(this);
			var defs = {};
			var opt = $.extend({}, defs, option);
			var nodeName = opt.nextStr;//下级名称
			function getListClass(list, currItem, idx, isFirst) {
				var cls = [];
				//判断是否有下级
				if (currItem[nodeName] && currItem[nodeName].length) {
					cls.push("folder");
					if (isFirst && list.length == 1) {
						cls.push("one-folder");
					} else {
						if (!idx) {
							cls.push("first-folder");
						}
						if (idx == list.length - 1) {
							cls.push("last-folder");
						}
					}
				} else {
					cls.push("file");
					if (isFirst && list.length == 1) {
						cls.push("one-file");
					} else {
						if (!idx) {
							cls.push("first-file");
						}
						if (idx == list.length - 1) {
							cls.push("last-file");
						}
					}
				}
				return cls.join(" ");
			}

			function setListHtml(list, html, isFirst) {
				if (list) {
					$.each(list, function (idx) {
						html.push('<li class="' + getListClass(list, this, idx, isFirst) + '">');
						html.push('<a><i class="i-icon"></i><i class="i-type"></i><label data-val="' + this[opt.idStr] + '">' + this[opt.nameStr] + '</label></a>');
						if (this[nodeName] && this[nodeName].length) {
							html.push('<ul>');
							setListHtml(this[nodeName], html, false);
							html.push('</ul>');
						}
						html.push('</li>');
					})
				}
				return html;
			}

			var html = setListHtml(opt.list, [], true);
			$node.find(".tree-main").html(html.join(" "));
			$node.find(".tree-main").bind("click", function (e) {
				var $target = $(e.target), $item;
				if (e.target.nodeName == "UL") {
					return;
				}
				if (e.target.nodeName == "A") {
					$item = $target.parent("li");
				} else if (e.target.nodeName == "I" || e.target.nodeName == "LABEL") {
					$item = $target.parent("a").parent("li");
				} else {
					$item = $target;
				}
				if ($item.hasClass("folder")) {
					$item.toggleClass("folder-open");
					if ($item.hasClass("first-folder")) {
						$item.toggleClass("first-folder-open");
					}
					if ($item.hasClass("last-folder")) {
						$item.toggleClass("last-folder-open");
					}
					if ($item.hasClass("one-folder")) {
						$item.toggleClass("one-folder-open");
					}
				} else {
					//click event
					$node.find("input").val($item.find("label").text());
					$node.attr("data-val", $item.find("label").attr("data-val"));
					$node.find(".i-close").show();
					$node.find(".tree-main").hide();
				}
				return false;
			})
			$node.find(".i-close").bind("click",function() {
				$node.attr("data-val","");
				$node.find("input").val("");
				$node.find(".i-close").hide();
				return false;
			})
			$node.find("input").bind("click", function () {
				$node.find(".tree-main").show();
				$(window).bind("click.tree",function () {
					console.log("click.tree");
					$node.find(".tree-main").hide();
					$(window).unbind("click.tree");
				})
				return false;
			})

		},
		//分页
		flowerPage: function (options) {
			var defs = {
				url: "",
				numCount: 5,//显示的数量
				prefixCount: 0,//前缀，后缀 数字
				pageIndex: 1,
				pageSize: 10,
				params: null,
				data: null,
				list: [],
				listCount: 0,
				loading: null,//loading function
				loadTime: 300,
				closeLoading: null,//closeLoading function
				before: null,	//send before function
				success: null,
				method: "jsonp",
				//dataType: "json",//传入数据格式  默认为json 可设置为string
				error: null
			}
			var self = tool;
			var $node = $(this);
			var opts = $.extend({}, defs, options);
			var page = {
				pageShow: false,
				size: 10,
				index: 1,
				count: 0
			};

			function initPager() {
				var listCount = opts.listCount;
				page.pageShow = true;
				page.count = Math.ceil(listCount / opts.pageSize);
				if (page.count <= 1) {
					$node.find(".page-left").hide();
				} else {
					$node.find(".page-left").show();
				}
				// 页码数列表
				var getPageList = function () {
					var list = self.getPageNumber(opts.pageIndex, page.count, opts.numCount, opts.prefixCount);
					return {num: list, select: page.index};
				}
				page.list = getPageList();
				var numNode = $node.find(".page-nubmer");
				// 数字按钮 page-nubmer
				numNode.find("a").unbind("click.page");
				self.bindPageNubmer(numNode, page.list, opts.prefixCount, page.count);
				numNode.find("a").bind("click.page", function () {
					opts.pageIndex = Number($(this).text()) || 1;
					update();
				})
				$node.find(".go-page").val(page.index);
				$node.find(".page-size").text(page.size);
				$node.find(".sun-page").text(page.count);
				$node.find(".sun-counts").text(listCount);
			}

			// 更新
			function update(isAll) {
				if (page.count > 0 && opts.pageIndex > page.count) {
					opts.pageIndex = page.count;
				}
				page.index = opts.pageIndex;
				page.size = opts.pageSize;
				var url = self.format(opts.url, {pageIndex: opts.pageIndex, pageSize: opts.pageSize});
				var timer = 0;
				if (opts.loading) {
					timer = setTimeout(function () {
						opts.loading();
					}, opts.loadTime);
				}
				opts.before && opts.before();
				tool[opts.method](url, opts.data, function (red) {
					if (typeof(opts.success) == "function") {
						opts.success(red, opts);
						initPager(isAll);
					}
				}, function () {
					if (typeof(opts.error) == "function") {
						opts.error();
						initPager(isAll);
					}
				}, function () {
					if (timer) {
						clearTimeout(timer);
						opts.closeLoading && opts.closeLoading();
					}
				})
			}

			// 首页按钮
			$node.find(".first").bind("click", function () {
				opts.pageIndex = 1;
				update();
			});
			// 上一页按钮
			$node.find(".prev").bind("click", function () {
				if (opts.pageIndex <= 1) {
					return;
				}
				opts.pageIndex--;
				update();
			});
			// 下一页按钮
			$node.find(".next").bind("click", function () {
				if (opts.pageIndex >= page.count) {
					return;
				}
				opts.pageIndex++;
				update();
			});
			// 末页按钮
			$node.find(".last").bind("click", function () {
				opts.pageIndex = page.count;
				update();
			});
			//go 回车事件
			$node.find(".go-page").bind("focus",function (e) {
				$(this).unbind("keydown").bind("keydown", function (e) {
					// 回车键事件
					if (e.which == 13) {
						var $input = $(this);
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
					}
				});

			})

			//刷新 按钮
			$node.find(".btn-page-refresh").bind("click", function () {
				var $input = $node.find(".page-index");
				var $inputCount = $node.find(".page-size");
				var val = $input.val(), count = $inputCount.val();
				if (isNaN(val)) {
					$input.focus();
					return;
				}
				if (isNaN(count)) {
					$inputCount.focus();
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
				opts.pageSize = Number(count);
				$input.val(val);
				update();
			});
			//显示全部
			$node.find(".btn-page-all").bind("click", function () {
				var tem = opts.pageSize;
				opts.pageIndex = 1;
				opts.pageSize = opts.listCount;
				update(1);
				opts.pageSize = tem;
			})
			return {
				info: opts,
				config: function (option) {
					$.extend(opts, option);
					return page;
				},
				//post: function (url, data, successFn, option) {
				//	opts.method = "post";
				//	opts.pageIndex = 1;
				//	$.extend(opts, {url: url, success: successFn, data: data}, option);
				//	update();
				//	return page;
				//},
				//'get': function () {
				//opts.method = "get";
				//opts.pageIndex = 1;
				//$.extend(opts, {url: url, success: successFn, data: data}, option);
				//update();
				//return page;
				//},
				'jsonp': function (url, data, successFn, option) {
					opts.method = "jsonp";
					opts.pageIndex = 1;
					$.extend(opts, {url: url, success: successFn, data: data}, option);
					update();
					return page;
				},
				reset: function () {
					opts.pageIndex = 1;
					update();
				},
				update: update
			}
		}
		//样式切换
		
	})
})(jQuery);