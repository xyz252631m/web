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
/*
 * des:core and tool
 *
 * */
;(function ($) {
	function getBorOp(self) {
		var html = [];
		html.push('<div class = "active-bor">');
		html.push('</div>');
		html.push('<div class = "op-box">');
		if (self.isDelete) {
			html.push('<a class="op-del" >删除</a>');
			html.push('<div class="del-tip-box"><span>确定删除吗？</span><a class="tip-cel">取消</a><a class="tip-ok">确定</a><i class="i-1"></i><i class="i-2"></i></div>')
		}
		html.push('</div>');
		return html.join(" ");
	}
	
	var zhx = {
		ac: "active",
		plugins: {},	//所有插件列表
		pluginList: [],	//插件实例化列表
		holdPluginList: [],//(不可拖动)插件实例化列表
		removePluginItem: function (id) {
			var index = this.getPluginItemIndex(id);
			if (~index) {
				this.pluginList[index].destroy && this.pluginList[index].destroy();
				this.pluginList.splice(index, 1);
			}
		},
		getPluginItemIndex: function (id) {
			var index = -1;
			$.each(this.pluginList, function (idx) {
				if (this.id == id) {
					index = idx;
				}
			})
			return index;
		},
		opList: [],
		dataList: [],
		showEdit: function (id, top) {
			zhx.getEditBox.css("marginTop", top);
			zhx.showSetting("set_" + id);
		},
		addPlugin: function (key, fn) {
			function plugin(key) {
				//initData 设定初始值（方式1 初始化模板） //方式2 为edit方法，修改模板
				this.create = function (afterElem, initData) {
					var data = $.extend(true, {key: key}, this.data, initData);
					var elem = $(this.viewTemplate(data));
					var settingElem = $(this.settingTemplate(data));
					settingElem.hide();
					var attr = {
						'id': [key, "_" +
						new Date().getTime()].join(""),
						'data-type': key
					};
					elem.attr(attr);
					if (this.isShowOp) {
						elem.append(getBorOp(this));
					}
					settingElem.attr("id", "set_" + attr["id"]);
					if (!this.noView) {
						zhx.addView(elem, afterElem);
					}
					zhx.addEditView(settingElem);
					var obj = function () {
						this.id = attr.id;
						this.view = elem;
						this.editView = settingElem;
						this.data = data;
					};
					obj.prototype = this;
					var item = new obj();
					item.viewElem = elem;
					item.settingElem = settingElem;
					this.init.call(item, elem, settingElem);
					if (this.noView) {
						zhx.bindEditEvent(elem);
						zhx.holdPluginList.push(item);
					} else {
						zhx.pluginList.push(item);
						zhx.bindMousedownEvent(elem);
						zhx.bindInitEvent(elem);
					}
					zhx.resetPrivewList();
					//zhx.dataList.push(item.data);
					//zhx.activeView(elem);
					return item;
				}
			}

			plugin.prototype = fn();
			var tans = new plugin(key);
			this.plugins[key] = tans;
		},
		tabChangeClass: function ($list, $item, cls) {
			$.each($list, function () {
				$(this).removeClass(cls || zhx.ac);
			})
			$item.addClass(cls || zhx.ac);
		},
		changeClass: function ($node, classList, clsKey) {
			$.each(classList, function (key, val) {
				$node.removeClass(val);
			})
			$node.addClass(classList[clsKey]);
		},
		getSearchName: function (name) {
			var str = location.search.replace(/\?/, "");
			var arr = str.split("&");
			var obj = {};
			$.each(arr, function () {
				var tem = this.split("=");
				obj[tem[0]] = decodeURIComponent(tem[1]);
			})
			return obj[name] || "";
		},
		int: function (str) {
			if (str && !isNaN(str)) {
				return -(-str);
			} else {
				return 0;
			}
		},
		other: {
			radio: function ($list, change) {
				var radioObj = {};
				$list.each(function () {
					var $label = $(this);
					var type = $label.find("input").attr("name");
					if (!radioObj[type]) {
						radioObj[type] = [];
					}
					radioObj[type].push($label);
					$label.unbind("click.label").bind("click.label", function (e) {
						var $item = $(this).find("input");
						var list = radioObj[type];
						$.each(list, function () {
							this.removeClass("label-radio-active");
							this.find("input").prop("checked", "");
						})
						$label.addClass("label-radio-active");
						$item.prop("checked", "checked");
						change && change.call($item, type, $item.val(), e);
						return false;
					})
				})
			},
			checkbox: function ($list, callback) {
				$list.unbind("click.label").bind("click.label", function (e) {
					var $item = $(this), $chb = $item.find("input");
					var checked = !!$chb.prop("checked");
					$item.toggleClass("label-checkbox-active", !checked);
					var type = $chb.attr("name");
					$chb.prop("checked", !checked);
					callback && callback.call($chb, type, !checked, e);
					return false;
				})
			},
			//isChecked typeof bool
			activeCheck: function ($list, isChecked, callback) {
				$.each($list, function () {
					var $item = $(this), $chb = $item.find("input");
					$item.toggleClass("label-checkbox-active", isChecked);
					$chb.prop("checked", isChecked);
					callback && callback.call($chb, isChecked);
				})
			},
			select: function ($list, change) {
				$.each($list, function () {
					var $item = $(this);
					$item.hover(function () {
						$item.addClass("label-active");
					}, function () {
						$item.removeClass("label-active");
					});
					$item.find("label").not(".dis-label").unbind("click.label").bind("click.label", function (e) {
						var $option = $(this);
						var val = $option.attr("data-val"), text = $option.text();
						$item.find("label").removeClass("select");
						$option.addClass("select");
						$item.removeClass("label-active");
						//$item.attr("data-val", val);
						//$item.find("input").val(text);
						change && change.call($item, {value: val, text: text}, e);
						return false;
					})
				})
			}
		}
	};
	$.zhx = zhx;
	window.zhx = zhx;
})(jQuery);
/*
 * des: 默认配置
 *
 * */
;(function ($) {
	//linkType  链接类型   1 微页面及分类  2 商品及分类 3 营销活动 4 投票调查 5 店铺主页 6 会员主页 7 自定义外链
	zhx.config = {
		root: $(".preview"),
		editRoot: $(".setContent"),
		editClassName:"active",
		imgroot:"//i2.beta.ulecdn.com/mobile/decorate/161226/images/",
		store:null,	//店铺信息
		plugin:["editor","goods","goodsList","textTitle","textNav","hr","imgAd","imgNav","goodsSearch","notice","blank"
		,"enterStore"
			//,"goodsGroup"
		]
	}
	//TODO :　测试-- 本地环境加分组模块
	if(location.host.indexOf("localhost")>=0){
		zhx.config.plugin.push("goodsGroup");
	}
})(jQuery);

/*
 * des:dom拖动函数
 *
 * */
;(function ($) {
	var my, ey, IsDown = false;
	var box, $item;

	function up() {
		IsDown = false;
		try {
			$(document).unbind("mousemove").unbind("mouseup");
			box.hide();
			$item.removeAttr("style");
			zhx.resizeEditView($item);
		} catch (e) {
		}
	};
	function move(evt) {
		var moveY;
		if (IsDown) {
			moveY = my + evt.clientY - ey;
			box.css({
				"top": moveY + "px"
			});
			zhx.moveElem($item, moveY);
		}
	};
	$.fn.extend({
		//视图里拖动
		dragStar: function (moveBox, evt) {
			box = moveBox;
			$item = $(this);
			var et = evt || event;
			IsDown = true;
			$(document).bind("mousemove", function (evts) {
				move(evts || event);
			}).bind("mouseup", up);
			ey = et.clientY;
			my = $item[0].offsetTop;
			box.html($item[0].outerHTML);
			$item.css("visibility", "hidden");
			box.css({
				"top": my
			})
			box.show();
			box.find(">div").addClass(zhx.config.editClassName);
		},
		//设置里共用拖动  $list:需要传入最新dom
		shareDrag: function (moveBox, $list, callback, evt) {
			zhx._shareList = $list;
			$list.each(function () {
				$(this).removeAttr("style");
			})
			$item = $(this), box = moveBox;
			var et = evt || event, ey = et.clientY, my = $item[0].offsetTop, IsDown = true;
			box.html($item.children().clone());
			$item.css("visibility", "hidden");
			box.css({
				"top": my
			}) 
			box.show();
			$(document).bind("mousemove", function (evts) {
				var moveY, evt = evts || event;
				if (IsDown) {
					moveY = my + evt.clientY - ey;
					box.css({
						"top": moveY + "px"
					});
					zhx.shareMoveElem($item, moveY, callback);
				}
			}).bind("mouseup", function () {
				IsDown = false;
				try {
					$(document).unbind("mousemove").unbind("mouseup");
					box.hide();
					$item.removeAttr("style");
				} catch (e) {
				}
			});
		}
	})
})(jQuery);
/**
 * 获取数据
 */
;(function () {


	zhx.data = {};
	var urlSrc = "beta.ule.com";
	var host = location.host;
	if(host.indexOf("ule.com")>=0&&host.indexOf("beta.ule.com")<0){
		urlSrc = "ule.com";
	}
	$.extend(zhx.data, {
		urlSrc:urlSrc,
		//host:"//192.168.116.10:3030/microshop",
		host: "//m."+urlSrc+"/microshop",//  "//192.168.116.132:3030/microshop/"
		jsonp: function (url, data, callbackName) {
			return $.ajax({
				url: url,
				dataType: "jsonp",
				data: data,
				jsonp: callbackName || "callback"
			})
		},
		post: function (url, data) {
			return $.ajax({
				url: url,
				type: "post",
				dataType: "json",
				data: data
			})
		},
		upload: function (url, data) {
			return $.ajax({
				url: url,
				type: "post",
				dataType: "json",
				data: data,
				processData: false,
				contentType: false
			})
		},
		put: function (url, data) {
			return $.ajax({
				url: url,
				type: "put",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: data
			})
		},
		_goods: {
			brandList: [],	//品牌分类
			categroyList: [],//分类
			storeCategoryList: [],	//店铺分类
			listingList: []	//商品分类
		},
		getBaseInfo: function (data) {
			var d = {
				microshoppId: zhx.config.store.id,
				searchFlag: "1,2,3"
			}
			$.extend(d, data);
			return this.jsonp(this.host + "/api/finding/v1/groupListing", d).then(function (res) {
				zhx.data._goods.brandList = res.map.brandList;
				zhx.data._goods.categroyList = res.map.categroyList;
				zhx.data._goods.storeCategoryList = res.map.storeCategoryList;
				return res.map;
			});
		},
		getGoods: function (data) {
			var d ={
				microshoppId:zhx.config.store.id
			}
			$.extend(d, data);
			return this.jsonp(this.host + "/api/finding/v1/listings", d).then(function (res) {
				return res.result;
			});
		},
		//getPageList:function (data) {
		//	return this.post(this.host + "/ms/manage/finding/queryByForPage",null);
		//},
		getBrandList: function (data) {
			if (this._goods.brandList.length) {
				return $.when(this._goods.brandList);
			} else {
				return this.getBaseInfo(data).then(function (res) {
					return res.brandList;
				});
			}
		},
		getStoreList: function (data) {
			if (this._goods.storeCategoryList.length) {
				return $.when(this._goods.storeCategoryList);
			} else {
				return this.getBaseInfo(data).then(function (res) {
					return res.storeCategoryList;
				});
			}
		},
		getCategroyList: function (data) {
			if (this._goods.categroyList.length) {
				return $.when(this._goods.categroyList);
			} else {
				return this.getBaseInfo(data).then(function (res) {
					return res.categroyList;
				});
			}
		},
		uploadImg: function (imgFile) {
			var formData = new FormData();
			formData.append("uploadFlag ", "1");
			formData.append("storeId  ", zhx.config.store.id);
			formData.append("myfile ", imgFile);
			return this.upload(zhx.config.store.basePath + "/api/v1/resource/save", formData)

			//return this.upload("//192.168.116.10:4040/microshopAdmin/api/v1/resource/save", formData)
		}

	});
})();




/*
 * des: event
 *
 * */
;(function ($) {
	$.extend(zhx, {
		//type:无拖动 编辑Event
		bindEditEvent: function (elem) {
			var $item = elem || this.previewList;
			$item.bind("click", function () {
				zhx.activeView(elem);
			});
			return this;
		},
		//unbindEditEvent: function (elem) {
		//	var $item = elem || this.previewList;
		//	$item.unbind("click");
		//	return this;
		//},
		//type:拖动 编辑Event
		bindMousedownEvent: function (elem) {
			var $item = elem || this.previewList;
			$item.find(".active-bor").bind("mousedown", function (evt) {
				var elem = $(this).parent();

				zhx.activeView(elem);
				elem.dragStar(zhx.moveBox, evt);
			})
			return this;
		},
		bindOpEvent: function () {
			//创建
			this.config.root.find(".op-list").bind("click", function (e) {
				if (e.target.nodeName == "A") {
					var $item = $(e.target);
					var type = $item.attr("data-type");
					var plu = zhx.plugins[type].create();
					zhx.activeView(plu.viewElem);
				}
			})
			return this;
		},
		bindInitEvent: function (pluginBox) {
			var $bor = pluginBox.find(".op-box");
			//删除
			$bor.find(".op-del").bind("click", function () {
				pluginBox.find(".del-tip-box").show();
				pluginBox.bind("mouseleave",function () {
					pluginBox.find(".del-tip-box").hide();
					pluginBox.unbind("mouseleave");
				})
			});
			//删除--确认
			pluginBox.find(".tip-ok").bind("click",function () {
				pluginBox.find(".tip-ok").unbind("click");

				var id = pluginBox.attr("id");
				var elem = pluginBox.prev();
				//判断是否为第一个
				if (elem.hasClass("move-box")) {
					zhx.getEditBox.hide();
				} else {
					zhx.activeView(elem);
				}
				pluginBox.remove();
				$("#set_" + id).remove();
				zhx.removePluginItem(id);
				zhx.resetPrivewList();

			})
			//删除--取消
			pluginBox.find(".tip-cel").bind("click",function () {
				pluginBox.find(".del-tip-box").hide();
			})
		}
	})
})(jQuery);

/*
 * des:dom 列表
 *
 * */
;(function ($) {
	$.extend(zhx, {
		previewList: zhx.config.root.find(">div:visible").not(".move-box,.p-title,.op-list"),
		resetPrivewList: function () {
			this.previewList = zhx.config.root.find(">div:visible").not(".move-box,.p-title,.op-list");
			this.resetHeight();
			this.resetPluginList();
		},
		moveBox: zhx.config.root.find(".move-box"),
		resetHeight: function () {
			this.getHeightList(1);
			this.getTopList(1);
		},
		resetPluginList: function () {
			var list = [], dataList = [];
			$.each(this.previewList, function () {
				var index = zhx.getPluginItemIndex($(this).attr("id"));
				if (~index) {
					list.push(zhx.pluginList[index]);
					dataList.push(zhx.pluginList[index].data)
				}
			})
			zhx.pluginList = list;
			zhx.dataList = dataList;
		},
		opBox: zhx.config.root.find(".op-list"),
		getEditBox: zhx.config.editRoot.find(".con-bor"),
		getEditList: function () {
			return this.getEditBox.find(">div");
		},
		activeView: function (elem) {
			var item = $(elem), id = item.attr("id"), type = item.attr("data-type");
			zhx.previewList.removeClass(zhx.config.editClassName);
			item.addClass(zhx.config.editClassName);
			id && zhx.showEdit(id, item[0].offsetTop);
		},
		showSetting: function (id) {
			var $item = $("#" + id);
			zhx.getEditList().hide();
			$item.show();
			this.getEditBox.show();
		},
		_elemIdxList: null,		//当前的列表 按 索引排序 (key 为索引)
		_heightList: [],		//当前高度的列表  按 索引排序
		_topList: [],			//当前的offsetTop列表 按 索引排序
		elemList: function () {
		},
		elemListByIdx: function () {
			var obj = {};
		},
		getHeightList: function (isReset) {
			if (isReset || !this._heightList.length) {
				var h_list = [];
				this.previewList.each(function () {
					h_list.push($(this).outerHeight());
				})
				this._heightList = h_list;
			}
			return this._heightList;
		},
		getTopList: function (isReset) {
			if (isReset || !this._topList.length) {
				var top_list = [];
				this.previewList.each(function () {
					top_list.push(this.offsetTop);
				})
				this._topList = top_list;
			}
			return this._topList;
		},
		//视图--移动元素
		moveElem: function ($item, top) {
			var idx = this.previewList.index($item), targetIdx = idx;
			var h_list = this.getHeightList(), top_list = this.getTopList();
			if (top_list[idx] > top) {
				targetIdx--;
				if (targetIdx >= 0) {
					if (top_list[targetIdx] + h_list[targetIdx] / 2 > top + h_list[idx] / 2) {
						this.previewList.eq(targetIdx).before(this.previewList.eq(idx));
						this.resetPrivewList();
					}
				}
			} else {
				targetIdx++;
				if (targetIdx < h_list.length) {
					if (top + h_list[idx] / 2 > top_list[targetIdx] + h_list[targetIdx] / 2) {
						this.previewList.eq(targetIdx).after(this.previewList.eq(idx));
						this.resetPrivewList();
					}
				}
			}
		},
		//
		_shareList: [],
		//设置--移动元素
		shareMoveElem: function ($item, top, callback) {
			var list = this._shareList;
			var idx = list.index($item), targetIdx = idx, h_list = [], top_list = [];
			list.each(function () {
				h_list.push($(this).outerHeight());
			});
			list.each(function () {
				top_list.push(this.offsetTop);
			});
			//重置--重新获取li列表
			var resetList = function () {
				zhx._shareList = $item.parent("ul").find("li").not(".move-li");
			}
			if (top_list[idx] > top) {
				targetIdx--;
				if (targetIdx >= 0) {
					if (top_list[targetIdx] + h_list[targetIdx] / 2 > top + h_list[idx] / 2) {
						list.eq(targetIdx).before(list.eq(idx));
						resetList();
						callback && callback();
					}
				}
			} else {
				targetIdx++;
				if (targetIdx < h_list.length) {
					if (top + h_list[idx] / 2 > top_list[targetIdx] + h_list[targetIdx] / 2) {
						list.eq(targetIdx).after(list.eq(idx));
						resetList();
						callback && callback();
					}
				}
			}
		},
		createOp: function () {
			var list = [];
			$.each(this.config.plugin, function () {
				list.push("<a data-type='" + this + "'>" + zhx.plugins[this].name + "</a>")
			})
			this.opBox.html(list.join(" "));
		},
		addView: function (elem, afterElem) {
			if (afterElem) {
				$(afterElem).after(elem);
			} else {
				this.opBox.before(elem);
			}
		},
		addEditView: function (elem) {
			this.getEditBox.append(elem);
		},
		resizeEditView: function (elem) {
			var item = $(elem), id = item.attr("id");
			zhx.getEditBox.css("marginTop", item[0].offsetTop);
		}
	})
})(jQuery);
/*
 * des: alert box
 *
 * */
;(function ($) {
	zhx.box = {};
	var defaults = {
		init: null,//初始化方法--显示弹出层之前
		cancel: null,//取消方法--隐藏弹出层之前
		submit: null,//提交按钮方法
		hasSubmit: true,	//是否有提交按钮
		hasCancel: true	//是否有取消按钮
	};
	var $shade = $(".xui-shade");
	var idx = 10000;

	function dialog_resize($node, flag) {
		var num = flag || 0;
		var width = document.documentElement.clientWidth || document.documentElement.offsetWidth,
			height = document.documentElement.clientHeight || document.documentElement.offsetHeight;
		if ($node) {
			var top = (height - $node.height() - num) / 2;
			if(top>0){
				$node.css({
					top: ((height - $node.height() - num) / 2) + "px",
					left: ((width - $node.width() - num) / 2) + "px"
				});
			}else{
				$node.css({
					position:"absolute",
					top: ((document.body.scrollTop||document.documentElement.scrollTop)+10)+"px",
					left: ((width - $node.width() - num) / 2) + "px"
				});
			}

		}
	}

	var template = {
		box: function (str) {
			var html = [];
			html.p('<div class = "xui-flower none">');
			html.p('<a class = "flower-close">x</a>');
			html.p('<div class = "flower-main">');
			html.p(str);
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		msg: function (opt) {
			var html = [];
			html.p('<div class = "art-tip-msg">');
			html.p('<div class = "tip-title">');
			html.p('<span class = "active">' + (opt.title || "") + '</span>');
			html.p('</div>');
			html.p('<div class = "tip-con">');
			html.p('<p>' + (opt.content || "发生错误！") + '</p>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<p>');
			if (opt.hasSubmit) {
				html.p('<a class="box-btn-submit active">确认</a>');
			}
			if (opt.hasCancel) {
				html.p('<a class="box-btn-close">关闭</a>');
			}
			html.p('</p>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		}
	}
	$.fn.extend({
		//弹层隐藏
		flowerHide: function () {
			var $node = $(this);
			var idx = $node.attr("data-idx");
			$node.hide();
			if (!$(".xui-flower:visible").length) {
				$shade.hide();
			}
			return $node;
		},
		//弹层删除
		flowerRemove: function () {
			var $node = $(this);
			var idx = $node.attr("data-idx");
			$(window).unbind("resize.flower" + idx);
			$node.find(".flower-close").unbind("click.flower");
			$node.find(".box-btn-close").unbind("click.flower");
			$node.find(".box-btn-submit").unbind("click.flower");
			$node.remove();
			if (!$(".xui-flower:visible").length) {
				$shade.hide();
			}
			return $node;
		}
	});
	function bindEvent($node, opt, idx) {
		//关闭
		$node.find(".flower-close").bind("click.flower", function () {
			opt.cancel && opt.cancel.call(this, $node);
			if (opt.id) {
				$node.flowerHide();
			} else {
				$node.flowerRemove();
			}
		})
		$node.find(".box-btn-close").bind("click.flower", function () {
			opt.cancel && opt.cancel.call(this, $node);
			if (opt.id) {
				$node.flowerHide();
			} else {
				$node.flowerRemove();
			}
		})
		//提交
		$node.find(".box-btn-submit").bind("click.flower", function () {
			opt.submit && opt.submit.call(this, $node);
		})
		$(window).bind("resize.flower" + idx, function () {
			dialog_resize($node);
		})
	}

	$.extend(zhx.box, {
			//传入id为隐藏，没有id为删除
			show: function (html, init, option) {
				var opt = $.extend({}, defaults, {init: init}, option);
				idx++;
				if (opt.id) {
					var temNode = $("#box_" + opt.id);
					if (temNode.length) {
						$shade.show();
						temNode.show();
						return temNode;
					}
				}
				var $node = $(template.box(html));
				$node.attr("id", "box_" + opt.id);
				$node.attr("data-idx", idx);
				$shade.show();
				$(document.body).append($node);
				dialog_resize($node);
				opt.init && opt.init($node);
				$node.show();
				bindEvent($node, opt, idx);
				return $node;
			},
			//提示
			msg: function (msg, option) {
				var opt = $.extend({}, defaults, {content: msg, hasCancel: false});
				if(typeof (option)=="function"){
					$.extend(opt,{submit:option});
				}else{
					$.extend(opt,option);
				}

				idx++;
				var $node = $(template.box(template.msg(opt)));
				$shade.show();
				$(document.body).append($node);
				dialog_resize($node);
				opt.init && opt.init($node);
				$node.show();
				var fn = opt.submit;
				opt.submit = function () {
					$node.flowerRemove();
					fn&& fn.call(this, $node);
					//opt.submit && opt.submit.call(this, $node);
				}
				bindEvent($node, opt, idx);
			},
			//确认提示
			confirm: function (msg, option) {
				var opt = $.extend({}, defaults, {content: msg}, option);
				idx++;
				var $node = $(template.box(template.msg(opt)));
				$shade.show();
				$(document.body).append($node);
				dialog_resize($node);
				opt.init && opt.init($node);
				$node.show();
				bindEvent($node, opt, idx);
			},
			showById: function (id, fn) {
				$shade.show();
				var box = $("#box_" + id);
				if (box.length) {
					box.show();
					dialog_resize(box);
				} else {
					fn & fn();
				}
			}
		}
	)
})(jQuery);

/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("banner", function () {
		return {
			name:"店铺店招",// "banner",
			isRepeat: 0,
			isShowOp: 1,
			isDelete: 0,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "ss-banner" style = "display: block">');
				html.p('<div class = "mc">');
				html.p('<div class="banner-bg">');
				html.p('<div class="ba-logo">');
				html.p('<img src = "//i0.ulecdn.com/ule/header/images/logo.png" alt = "">');
				html.p('</div>');
				html.p('<div class="ba-store-name">店铺名称</div>');
				html.p('</div>');
				// html.p('<div class="banner-menu">');
				// // html.p('<ul>');
				// // html.p('<li><a><span>0</span><span class="li-tl">全部商品</span></a></li>');
				// // html.p('<li><a><span>0</span><span class="li-tl">上新商品</span></a></li>');
				// // html.p('<li><a><span><i class="i-user"></i></span><span class="li-tl">我的订单</span></a></li>');
				// // html.p('</ul>');
				// html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-banner">');
				html.p('<p><span>背景图片：</span><label class = "select-img">选择图片<input type="file"/></label></p>');
				html.p('<p class="p-tip"><span>&nbsp;</span>最佳尺寸：640 x 200 像素。</p>');
				html.p('<p class="p-tip"><span>&nbsp;</span>尺寸不匹配时，图片将被压缩或拉伸以铺满画面。</p>');
				html.p('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.p('<p class="sb-logo"><span>店铺Logo：</span><img width="80" height="80"/><label class="sb-edit-logo">修改店铺Logo <input type="file"/></label></p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				bgColor: "#F02D45",
				bgImgSrc: "",
				bgImgSize: {},
				logoSrc: "",
				storeName:"",
				logoSize: {}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var changeViewImg = function () {
					if (self.data.bgImgSrc) {
						viewElem.find(".banner-bg").css("background-image", "url('" + self.data.bgImgSrc + "')");
					}
				}
				//背景色
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".banner-bg").css("background-color", this.value);
					self.data.bgColor = this.value;
				});
				//背景色重置
				settingElem.find(".btn-reset").bind("click", function () {
					settingElem.find(".label-color input").val("#F02D45");
					settingElem.find(".label-color input").trigger("change");
				})
				//背景色图片
				//settingElem.find(".select-img").bind("click",function () {
				//	var $a = $(this);
				//	zhx.dialog.imgList(function (list) {
				//		var $img = list.eq(0).find("img");
				//		var src = $img.attr("src");
				//		self.data.bgImgSrc = src;
				//		self.data.bgImgSize = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
				//		changeViewImg();
				//		$a.text("修改");
				//	}, 1);
				//})
				settingElem.find(".select-img input").bind("change", function () {
					var file = this.files[0];
					var $a = $(this);
					zhx.data.uploadImg(file).success(function (res) {
						if (res.status == 0) {
							self.data.bgImgSrc = res.url;
							changeViewImg();
							$a.text("修改");
						}else{
							zhx.box.msg(res.message);
						}
					}).error(function () {
						zhx.box.msg("上传失败！");
					});
				})
				//修改LOGO
				settingElem.find(".sb-edit-logo input").bind("change", function () {
					var file = this.files[0];
					zhx.data.uploadImg(file).success(function (res) {
						if (res.status == 0) {
							self.data.logoSrc = res.url;
							viewElem.find(".ba-logo img").attr("src",res.url);
							settingElem.find(".sb-logo img").attr("src",res.url);
						}else{
							zhx.box.msg(res.message);
						}
					}).error(function () {
						zhx.box.msg("上传失败！");
					});
				})
			}, edit: function (initData) {
				var d = $.extend({},this.data, initData);
				var viewElem = this.viewElem, settingElem = this.settingElem;
				//view
				viewElem.find(".ba-store-name").text(d.storeName);
				//settion
				settingElem.find(".label-color input").val(d.bgColor);
				settingElem.find(".label-color input").trigger("change");
				if (d.bgImgSrc) {
					viewElem.find(".banner-bg").css("background-image", "url('" + d.bgImgSrc + "')");
				}
				if(d.logoSrc){
					viewElem.find(".ba-logo img").attr("src",d.logoSrc);
					settingElem.find(".sb-logo img").attr("src",d.logoSrc);
				}else{
					if(zhx.config.store.storeLogo){
						this.data.logoSrc = zhx.config.store.storeLogo;
						viewElem.find(".ba-logo img").attr("src",this.data.logoSrc);
						settingElem.find(".sb-logo img").attr("src",this.data.logoSrc);
					}
				}


			}
		}
	})
})(jQuery);
/*
 * des: 辅助空白
 *
 * */
;(function ($) {
	zhx.addPlugin("blank", function () {
		return {
			name: "辅助空白",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "sty-blank">');
				html.p('<div class = "mc"><p></p></div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-blank" style="display: block">');
				html.p('<p><span>空白高度：</span><label class = "label-range"><i class="i-track"></i><i class="i-thumb"></i><input type = "range"/></label>');
				html.p('<label><strong class="blank-height">30</strong>像素</label>');
				html.p('</p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				height: 30
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var timer = 0;
				settingElem.find(".label-range input").bind("input change", function () {
					settingElem.find(".label-range .i-thumb").css({
						left: this.value / 100 * 224 + 'px'
					})
					var h = self.data.height = parseInt(this.value / 100 * 70 + 30);
					settingElem.find(".blank-height").text(h);
					viewElem.find("p").height(h);
					//重置视图的高度
					clearTimeout(timer);
					timer = setTimeout(function () {
						zhx.resetHeight();
					}, 2000);
				})
			},
			edit:function (initData) {
				var settingElem = this.settingElem;
				var h = (initData.height-30)/70*100;
				settingElem.find(".label-range input").val(h).trigger("change");
				settingElem.find(".label-range input").val(h).trigger("input");
			}
		}
	})
})(jQuery);
/*
 * des: 弹出层
 *
 * */
;(function ($) {
	zhx.dialog = {};
	var template = {
		//选择图片模板（包含单选和多选）
		imgListStr: function () {
			var html = [];
			html.p('<div class = "box-img-list">');
			html.p('<div class = "img-tab">');
			html.p('<label class="search-img"><input type = "text" placeholder="搜索"/></label>');
			html.p('<span class = "active">我的图片</span><span>图标库</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "group-list">');
			html.p('<p class = "active"><a>未分组</a></p>');
			html.p('<p><a>未分组1</a></p>');
			html.p('<p><a>未分组2</a></p>');
			html.p('');
			html.p('</div>');
			html.p('<div class = "list">');
			html.p('<ul>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem01.jpg"/>');
			html.p('<p>順豐到付</p>');
			html.p('<cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem03.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem01.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem03.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem02.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem04.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('</ul>');
			html.p('<p class = "state-bar">');
			html.p('<a class = "link-upload">上传图片</a>');
			html.p('');
			html.p('<span class = "page-nubmer">');
			html.p('<a>上一页</a>');
			html.p('<a>1</a><a>2</a><a>3</a>');
			html.p('<label><input class = "go-page" type = "text"/>/11页</label>');
			html.p('<a>下一页</a>');
			html.p('</span>');
			html.p('<span>共3条，每页16条</span>');
			html.p('</p>');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<a>确认</a>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		//选择商品模板
		goodsStr: function (goodsList) {
			var html = [];
			html.p('<div class = "box-goods-select">');
			html.p('<div class = "img-tab">');
			html.p('<span class = "active">已上架商品</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "g-search">');
			html.p('<table>');
			html.p('<tr>');
			html.p('<td><span>品牌：</span><label><select class="js_brand">');
			html.p('<option>请选择</option>');
			html.p('</select></label></td>');
			html.p('<td><span>店铺分类：</span>');
			html.p('<label class = "label-tree store-tree">');
			html.p('<input type = "text" readonly = "readonly" placeholder = "请选择">');
			html.p('<ul class = "tree-main"></ul><i class="i-close">X</i>');
			html.p('</label>');
			html.p('</td>');
			html.p('<td><span>商品分类： </span>');
			html.p('<label class = "label-tree shopping-tree">');
			html.p('<input type = "text" readonly = "readonly" placeholder = "请选择">');
			html.p('<ul class = "tree-main"></ul><i class="i-close">X</i>');
			html.p('</label>');
			html.p('</td>');
			html.p('</tr>');
			html.p('<tr>');
			html.p('<td><span>商品id：</span><label class = "label-input"><input class="js_goods_id" type = "text"/></label></td>');
			html.p('<td><span>商品名称：</span><label class = "label-input"><input  class="js_goods_name"  type = "text"/></label></td>');
			html.p('<td><a class = "btn-search">查询</a></td>');
			html.p('</tr>');
			html.p('</table>');
			html.p('</div>');
			html.p('<div class = "op-tab">');
			html.p('<a data-type="2">月销量</a><a data-type="3">上架时间</a><a data-type="1">价格</a>');//1价格从低到高  2月销量从高到低  3上架时间倒序
			html.p('</div>');
			html.p('<div class = "data-list">');
			html.p('<table class="goods-table">');
			html.p('<thead>');
			html.p('<tr>');
			html.p('<th width="90px"></th>');
			html.p('<th width="320px">商品名称</th>');
			html.p('<th width="120px">商品库存</th>');
			html.p('<th width="120px">商品价格</th>');
			html.p('<th><label>操作</label><input type="checkbox" id="all-goods" class="chk-all"/><label class="js_all" for="all-goods">全选</label></th>');
			html.p('</tr>');
			html.p('</thead>');
			html.p('<tbody>');
			html.p('</tbody>');
			html.p('</table>');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<a class="btn-submit">确认</a>');
			html.p('<div class="pages goods-pages">');
			html.p('<span class = "page-left">');
			html.p('<a class="prev">上一页</a>');
			html.p('<span class = "page-nubmer">');
			html.p('<a>1</a><a>2</a><a>3</a>');
			html.p('</span>');
			html.p('<label><input class = "go-page" type = "text"/>/<span class="sun-page">0</span>页</label>');
			html.p('<a class="next">下一页</a>');
			html.p('</span>');
			html.p('<span>共<label class = "sun-counts">5</label>条，每页<label class = "page-size">5</label>条</span>');
			html.p('</div>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		//选择商品分组模板
		goodsListStr: function () {
			var html = [];
			html.p('<div class="box-groups">');
			html.p('<div class = "img-tab">');
			html.p('<span class = "active">商品分组</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "g-search">');
			html.p('<p>选择类别</p>');
			html.p('<dl>');
			html.p('<dd><span>店铺分类：</span>');
			html.p('<label class = "label-tree store-tree">');
			html.p('<input type = "text" readonly = "readonly" placeholder = "请选择">');
			html.p('<ul class = "tree-main"></ul><i class="i-close">X</i>');
			html.p('</label>');
			html.p('</dd>');
			html.p('<dd><span>品牌：</span><label><select class="js_brand">');
			html.p('<option>请选择</option>');
			html.p('</select></label></d>');
			html.p('<dd><span>商品分类：</span>');
			html.p('<label class = "label-tree shopping-tree">');
			html.p('<input type = "text" readonly = "readonly" placeholder = "请选择">');
			html.p('<ul class = "tree-main"></ul><i class="i-close">X</i>');
			html.p('</label>');
			html.p('</dd>');
			html.p('</dl>');
			html.p('<p class="order-by">排序方式：<label><input type = "radio" name="orderBy" value="1" checked="checked"/>价格从低到高</label></p>');
			html.p('<p class="p-orderBy"><label><input type = "radio" name="orderBy" value="2"/>月销量从高到低</label></p>');
			html.p('<p class="p-orderBy"><label><input type = "radio" name="orderBy" value="3"/>按上架时间倒序</label></p>');
			html.p('');
			html.p('</div>');
			html.p('');
			html.p('<div class = "data-list">');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<a class="btn-submit active">确认</a>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		//微页面选择
		minPageStr: function () {
			var html = [];
			html.p('<div class="box-pages">');
			html.p('<div class = "img-tab">');
			html.p('<span class = "active">微页面选择</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "data-list">');
			html.p('<table class="min-page-table">');
			html.p('<thead>');
			html.p('<tr>');
			html.p('<th width="30%" class="td-title">标题</th>');
			html.p('<th width="40%">创建时间</th>');
			html.p('<th width="30%">');
			html.p('<div class="search-name">');
			html.p('<input type = "text"><a class="btn-search">搜</a>');
			html.p('</div>');
			html.p('</th>');
			html.p('</tr>');
			html.p('</thead>');
			html.p('<tbody>');
			html.p('</tbody>');
			html.p('</table>');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<div class="pages min-pages">');
			html.p('<span class = "page-left">');
			html.p('<a class="prev">上一页</a>');
			html.p('<span class = "page-nubmer">');
			html.p('<a>1</a><a>2</a><a>3</a>');
			html.p('</span>');
			html.p('<label><input class = "go-page" type = "text"/>/<span class="sun-page">0</span>页</label>');
			html.p('<a class="next">下一页</a>');
			html.p('</span>');
			html.p('<span>共<label class = "sun-counts">5</label>条，每页<label class = "page-size">5</label>条</span>');
			html.p('</div>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		//活动
		activityStr: function (list) {
			var html = [];
			html.p('<div class="box-pages">');
			html.p('<div class = "img-tab">');
			html.p('<span class = "active">活动</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "data-list">');
			html.p('<table>');
			html.p('<thead>');
			html.p('<tr>');
			html.p('<th width="30%" class="td-title">标题</th>');
			html.p('<th width="40%">有效时间</th>');
			html.p('<th width="30%">');
			html.p('<div class="search-name">');
			html.p('<input type = "text"><a>搜</a>');
			html.p('</div>');
			html.p('</th>');
			html.p('</tr>');
			html.p('</thead>');
			html.p('<tbody>');
			$.each(list, function () {
				html.p('<tr>');
				html.p('<td class="td-title"><a target="_blank">' + this.name + '</a></td>');
				html.p('<td>2017-1-1 16:44:33 - 2017-1-2 16:44:33</td>');
				html.p('<td><a class="btn-select">选择</a></td>');
				html.p('</tr>');
			})
			html.p('</tbody>');
			html.p('</table>');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<span>共3条，每页5条</span>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		}
	}

	function listToTree(arry) {
		///
		//var red = [
		//	{
		//		"id": 1,
		//		"pid": 0,
		//		"name": "常用"
		//	},
		//	{
		//		"id": 2,
		//		"pid": 0,
		//		"name": "分类"
		//	},
		//	{
		//		"id": 3,
		//		"pid": 0,
		//		"name": "类别3"
		//	},
		//	{
		//		"id": 4,
		//		"pid": 1,
		//		"name": "常用1"
		//	},
		//	{
		//		"id": 5,
		//		"pid": 1,
		//		"name": "常用2"
		//	},
		//	{
		//		"id": 6,
		//		"pid": 5,
		//		"name": "常用2.1"
		//	},
		//	{
		//		"id": 7,
		//		"pid": 2,
		//		"name": "分类1"
		//	},
		//	{
		//		"id": 8,
		//		"pid": 2,
		//		"name": "分类2"
		//	}
		//];
		//var list = [red[0], red[1], red[2]];
		var list = [];//获取一级节点
		$.each(arry, function () {
			if (this.id == 0) {
				list.p(this);
			}
		})
		var tem_obj = {}, i = 0, j = 0, item;
		//获取一级目录
		for (; i < list.length; i++) {
			tem_obj[list[i].id] = i;
		}
		function getTopItem(list, item) {
			if (!item) return;
			if (!item.pid) return item;
			var id = item.pid;
			label:for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].id == id) {
					if (!list[i].pid) {
						return list[i];
					} else {
						id = list[i].pid;
						break label;
					}
				}
			}
		}

		function getCurrItem(list, path) {
			for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].href == path) {
					list[i].active = true;
					return list[i];
				}
			}
		}

		//递归
		var sunNum = 0, shiNum = 0;
		var getList = function (result, list) {
			for (var j = 0; j < result.length; j++) {
				item = result[j];
				item["open"] = false;
				if (!item["nextList"]) {
					item["nextList"] = [];
				}
				for (i = 0; i < list.length; i++) {
					sunNum++;
					if (!list[i]["isDel"]) {
						shiNum++;
						if (list[i].pid == item.id) {
							list[i]["isDel"] = 1;
							item["nextList"].p(list[i]);
						}
					}
				}
				if (item["nextList"].length) {
					getList(item["nextList"], list);
				}
			}
			//return result;
		}
		getList(list, red);
		var path = "";
		var currItem = getCurrItem(red, path);
		var topItem = getTopItem(red, currItem);
		if (topItem) {
			$.each(list, function (idx, item) {
				if (item.id == topItem.id) {
					item.open = true;
				}
			})
		}
		return list;
	}

	$.extend(zhx.dialog, {
		//选择图片（包含单选和多选）
		imgList: function (callback, isSingle) {
			zhx.box.show(template.imgListStr(), function ($box) {
				var $submit = $box.find(".btn-list a");
				var $tab = $box.find(".group-list p"), $selectElem;
				$tab.bind("click", function () {
					zhx.tabChangeClass($tab, $(this), zhx.ac);
				})
				var bindLiClick = function () {
					var $list = $box.find(".list li");
					/*是否为单选*/
					if (isSingle) {
						$list.bind("click", function () {
							var $item = $(this);
							zhx.tabChangeClass($list, $item);
							$selectElem = $box.find(".list ul .active");
							$submit.toggleClass(zhx.ac, !!$selectElem.length);
						})
					} else {
						$list.bind("click", function () {
							var $item = $(this);
							$item.toggleClass(zhx.ac);
							$selectElem = $box.find(".list ul .active");
							$submit.toggleClass(zhx.ac, !!$selectElem.length);
						})
					}
				}
				bindLiClick();
				$submit.bind("click", function () {
					if ($submit.hasClass(zhx.ac)) {
						callback && callback.call($box, $selectElem);
						$box.flowerHide();
					}
				})
			});
		},
		//选择商品 （多选） isOne : 是否单选 oldList:已选择的列表
		selectGoods: function (callback, isOne,oldList) {
			var getInfo = zhx.data.getBaseInfo();
			zhx.box.show(template.goodsStr([]), function ($box) {
				var $select = $box.find(".btn-select");
				var $submit = $box.find(".btn-submit");
				var $allChk = $box.find(".chk-all");
				var dataList = [], dataObj = {};
				var list = [];
				if (isOne) {
					$box.find(".btn-submit").hide();
					$box.find(".chk-all").hide();
					$box.find(".js_all").hide();
				}
				var pages = $box.find(".goods-pages").flowerPage({pageSize: 5});
				var data = {
					microshoppId: zhx.config.store.id
				}
				var hasId=function(id){
					var has = false;
						if(oldList&&oldList.length){
							$.each(oldList,function(){
								if(this.listingId==id){
									has=true;
								}

							});
						}
						return has;

				}
				pages.jsonp(zhx.data.host + "/api/finding/v1/listings?pageIndex={pageIndex}&pageSize={pageSize}", data, function (res, opts) {
					if (res.result) {
						list = res.result.listingList || [];
						var h = [];
						opts.listCount = res.result.totalNum || 0;	//总数据条数
						if (list&&list.length) {
							$.each(list, function () {
								h.p('<tr>');
								h.p('<td class="td-img">');
								h.p('<img src = "' + this.imgUrl + '"/></td>');
								h.p('<td class="td-title"><a target="_blank" href="' + this.listingUrl + '">' + this.listingName + '</a></td>');
								h.p('<td>' + this.storage + '</td>');
								h.p('<td>¥' + this.salePrice + '</td>');
								if (dataObj[this.listingId]||hasId(this.listingId)) {
									h.p('<td><a class="btn-select active">取消</a></td>');
									dataObj[this.listingId] = this;
								} else {
									h.p('<td><a class="btn-select">选择</a></td>');
								}
								h.p('</tr>');
							})
						} else {
							h.p('<tr><td colspan="5" height="100">未找到数据！</td></tr>');
						}
						$box.find(".goods-table tbody").html(h.join(" "));
						selectBtnActive();
					}
				})
				var getParam = function (orderBy) {
					var d = {
						brandId: $.trim($box.find(".js_brand").val()),
						storeCategroyId: $box.find(".store-tree").attr("data-val"),
						categroyId: $box.find(".shopping-tree").attr("data-val"),
						listingIds: $box.find(".js_goods_id").val(),
						listingName: $box.find(".js_goods_name").val(),
						orderType: orderBy || ""
					}
					for (var key in d) {
						if (d.hasOwnProperty(key)) {
							if (!d[key]) {
								delete d[key];
							}
						}
					}
					return $.extend({}, data, d);
				}
				//查询按钮
				$box.find(".btn-search").bind("click", function () {
					pages.config({data: getParam()});
					pages.reset();
				})
				//排序
				$box.find(".op-tab a").bind("click", function () {
					var $a = $(this), val = $a.attr("data-type");
					var cls = "";
					if (val == 1) {
						cls = "up";
					} else if (val == 2 || val == 3) { 
						cls = "down";
					}
					if ($a.hasClass(cls)) {
						$box.find(".op-tab a").removeClass("up down");
						$a.removeClass(cls);
						val = 0;
					} else {
						$box.find(".op-tab a").removeClass("up down");
						$a.addClass(cls);
					}
					pages.config({data: getParam(val)});
					pages.reset();
				})
				var selectBtnActive = function () {
					dataList = [];
					$.each(dataObj, function (key, val) {
						dataList.p(val);
					})
					if (dataList.length) {
						$submit.addClass(zhx.ac)
					} else {
						$submit.removeClass(zhx.ac);
					}
				}
				//选择
				$box.find(".goods-table").bind("click", function (e) {
					if (e.target.nodeName == "A") {
						var $btn = $(e.target);
						if ($btn.hasClass("btn-select")) {
							var idx = $box.find(".btn-select").index($btn);
							var item = list[idx];
							if (isOne) {
								item.typeName = "商品";
								item.name = item.listingName;
								item.src = item.listingUrl;
								callback && callback.call($box, item);
								$box.flowerRemove();
							} else {
								var isCel = $btn.hasClass(zhx.ac);
								$btn.text(isCel ? "选择" : "取消");
								if (isCel) {
									$btn.removeClass(zhx.ac);
									if (dataObj[item.listingId]) {
										delete dataObj[item.listingId];
									}
								} else {
									$btn.addClass(zhx.ac);
									if (dataObj[item.listingId]) {
									} else {
										dataObj[item.listingId] = item;
									}
								}
							}
							selectBtnActive();
						}
					}
				})


				//全选
				$allChk.bind("click", function () {
					var isSelect = this.checked;
					if (isSelect) {
						$.each($box.find(".btn-select"), function () {
							if ($(this).hasClass(zhx.ac)) {
							} else {
								$(this).trigger("click");
							}
						})
					} else {
						$.each($box.find(".btn-select"), function () {
							if ($(this).hasClass(zhx.ac)) {
								$(this).trigger("click");
							}
						})
					}
				})
				//店铺分类
				getInfo.then(function (res) {
					var list = res.storeCategoryList;
					//list.unshift({storeCategoryId: "", categoryName: "全部"});
					$box.find(".store-tree").tree({
						list: list,
						nextStr: "children",
						idStr: "storeCategoryId",
						nameStr: "categoryName"
					})
				})
				//商城分类
				getInfo.then(function (res) {
					var list = res.categroyList;
					//list.unshift({categoryId: "", name: "全部"});
					$box.find(".shopping-tree").tree({
						list: list,
						nextStr: "children",
						idStr: "categoryId",
						nameStr: "name"
					})
				})
				//品牌分类
				getInfo.then(function (res) {
					var $option = ['<option value=" ">请选择</option>'];
					$.each(res.brandList, function () {
						$option.p('<option value="' + this.brandId + '">' + this.brandName + '</option>');
					})
					$box.find(".js_brand").html($option.join(" "))
				})
				//提交
				$submit.bind("click", function () {
					if ($submit.hasClass(zhx.ac)) {
						callback && callback.call($box, dataList);
						$box.flowerRemove();
					}
				})
			});
		},
		//选择商品 （单选）
		selectGoodsSingleton: function (callback) {
			this.selectGoods(callback, true);
		},
		//选择商品分组（多选）
		selectGroup: function (callback) {
			var list = [{id: 1, name: "日常用品"}, {id: 2, name: "推荐商品"}, {id: 3, name: "服装商品"}];
			zhx.box.show(template.goodsListStr(list), function ($box) {
				var $select = $box.find(".btn-select");
				var $submit = $box.find(".btn-submit");
				var dataList = [], dataObj = {};
				//选择
				$select.bind("click", function () {
					var idx = $select.index(this);
					var item = list[idx];
					var $btn = $(this);
					var isCel = $btn.hasClass(zhx.ac);
					$btn.text(isCel ? "选择" : "取消");
					if (isCel) {
						$btn.removeClass(zhx.ac);
						if (dataObj[item.id]) {
							delete dataObj[item.id];
						}
					} else {
						$btn.addClass(zhx.ac);
						if (dataObj[item.id]) {
						} else {
							dataObj[item.id] = item;
						}
					}
					dataList = [];
					$.each(dataObj, function (key, val) {
						dataList.p(val);
					})
					if (dataList.length) {
						$submit.addClass(zhx.ac)
					} else {
						$submit.removeClass(zhx.ac);
					}
				})
				//提交
				$submit.bind("click", function () {
					if ($submit.hasClass(zhx.ac)) {
						callback && callback.call($box, dataList);
						$box.flowerHide();
					}
				})
			});
		},
		//选择商品分组（单选）
		selectGroupSingleton: function (callback) {
			var getInfo = zhx.data.getBaseInfo();
			zhx.box.show(template.goodsListStr([]), function ($box) {
				//店铺分类
				getInfo.then(function (res) {
					var list = res.storeCategoryList;
					$box.find(".store-tree").tree({
						list: list,
						nextStr: "children",
						idStr: "storeCategoryId",
						nameStr: "categoryName"
					})
				})
				//商品分类
				getInfo.then(function (res) {
					var list = res.categroyList;
					$box.find(".shopping-tree").tree({
						list: list,
						nextStr: "children",
						idStr: "categoryId",
						nameStr: "name"
					})
				})
				//品牌分类
				getInfo.then(function (res) {
					var $option = ['<option value=" ">请选择</option>'];
					$.each(res.brandList, function () {
						$option.p('<option value="' + this.brandId + '">' + this.brandName + '</option>');
					})
					$box.find(".js_brand").html($option.join(" "))
				})
				var getParam = function () {
					var d = {
						brandId: $.trim($box.find(".js_brand").val()),
						storeCategroyId: $box.find(".store-tree").attr("data-val"),
						categroyId: $box.find(".shopping-tree").attr("data-val"),
						orderType: $box.find("input[type='radio']:checked").val()
					}
					for (var key in d) {
						if (d.hasOwnProperty(key)) {
							if (!d[key]) {
								delete d[key];
							}
						}
					}
					return d;
				}
				$box.find(".btn-submit").bind("click", function () {
					callback && callback.call($box, getParam());
					$box.flowerHide();
				})
			});
		},
		//选择微页面（单选）
		selectMinPage: function (callback) {
			zhx.box.show(template.minPageStr(), function ($box) {
				var list = [];
				var pages = $box.find(".min-pages").flowerPage({pageSize: 5});
				var getParam = function () {
					return {
						searchTitle: $.trim($box.find(".search-name input").val())
					};
				}
				var data = getParam();
				pages.jsonp(zhx.config.store.basePath + "/api/v1/page/queryByForPage?pageIndex={pageIndex}&pageSize={pageSize}", data, function (res, opts) {
					var h = [];
					if (res.pageDtoPage && res.pageDtoPage.result) {
						list = res.pageDtoPage.result || [];
						opts.listCount = res.pageDtoPage.totalRecords || 0;	//总数据条数
						if (list) {
							$.each(list, function () {
								h.p('<tr>');
								h.p('<td class="td-title"><a target="_blank">' + this.pageTitle + '</a></td>');
								h.p('<td>' + (new Date(this.createTime)).format("yyyy-MM-dd") + '</td>');
								h.p('<td><a class="btn-select">选择</a></td>');
								h.p('</tr>');
							})
						} else {
						}
					} else {
						h.p('<tr><td colspan="3" height="100">未找到数据！</td></tr>');
					}
					$box.find(".min-page-table tbody").html(h.join(" "));
				})
				//选择
				$box.find(".min-page-table").bind("click", function (e) {
					if (e.target.nodeName == "A") {
						var $btn = $(e.target);
						if ($btn.hasClass("btn-select")) {
							var idx = $box.find(".btn-select").index($btn);
							var item = list[idx];
							item.typeName = "微页面";
							item.name = item.pageTitle;
							item.src = item.pageUrl;
							callback && callback.call($box, item);
							$box.flowerHide();
						}
					}
				})
				//搜索
				$box.find(".search-name a").bind("click", function () {
					pages.config({data: getParam()});
					pages.reset();
				})
			});
		},
		//选择活动（单选）
		selectActivity: function (callback) {
			var list = [{name: "活动1"}, {name: "活动2"}, {name: "活动3"}];
			zhx.box.show(template.activityStr(list), function ($box) {
				var $select = $box.find(".btn-select");
				$select.bind("click", function () {
					var idx = $select.index(this);
					callback && callback.call($box, {typeName: "营销活动", name: list[idx].name, src: idx});
					$box.flowerHide();
				})
			});
		}
	});
})(jQuery);
/*
 * des: 富文本
 *
 * */
;(function ($) {
	zhx.addPlugin("editor", function () {
		return {
			name: "富文本",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "sty-editor">');
				html.p('<div class = "mc"><div class="ed-main-txt">点击编辑"富文本"内容</div></div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function (data) {
				var html = [];
				html.p('<div class = "set-sty-editor" style="display: block">');
				html.p('<p><span class="sp-label">颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class="btn-reset" type="button" value="重置"/>');
				html.p('<label class="label-checkbox"><input type="checkbox"/>全屏显示<i class = "i-icon"></i></label>');
				html.p('</p>');
				data.editorId = new Date().getTime() + 100;
				html.p('<script id="editor_' + data.editorId + '" type="text/plain"></script>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				editorId: "",
				html: "",
				isFull: false,
				bgColor: "#ffffff"
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var editor = UE.getEditor('editor_' + this.data.editorId, {
					initialFrameWidth: "400", initialFrameHeight: "300"
				})
				editor.addListener("contentChange", function () {
					self.data.html = editor.getContent();
					viewElem.find(".ed-main-txt").html(self.data.html);
				});
				//ready
				editor.addListener('ready', function (editor) {
					//settingElem.find("#editor").removeAttr("style")
				});
				//背景色
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".mc").css("background-color", this.value);
					self.data.bgColor = this.value;
				});
				//背景色重置
				settingElem.find(".btn-reset").bind("click", function () {
					//viewElem.css("background-color", "#ffffff");
					settingElem.find(".label-color input").val("#ffffff");
					settingElem.find(".label-color input").trigger("change");
				})
				//是否全屏
				zhx.other.checkbox(settingElem.find(".label-checkbox"), function () {
					var check = $(this).prop("checked");
					viewElem.find(".mc").toggleClass("full",!!check);
					self.data.isFull = check;
				});
			},
			edit: function (initData) {
				var d = $.extend(this.data, initData);
				var settingElem = this.settingElem;
				var editor = UE.getEditor('editor_' + d.editorId);
				editor.addListener('ready', function () {
					//settingElem.find("#editor").removeAttr("style")
					editor.setContent(d.html);
				});
				if (d.isFull) {
					settingElem.find(".label-checkbox").trigger("click");
				}
				settingElem.find(".label-color input").val(d.bgColor).trigger("change");
			},
			destroy: function () {
				UE.getEditor('editor_' + this.data.editorId).destroy();
			}
		}
	})
})(jQuery);
/*
 * des: 辅助空白
 *
 * */
;(function ($) {
	zhx.addPlugin("enterStore", function () {
		return {
			name: "进入店铺",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "se-store">');
				html.p('<div class = "mc"><p><a href=""><i class="i-icon"></i><i class="i-right"></i><label>'+(zhx.config.store.name||"店铺名称")+'</label><span>进入店铺</span></a></p></div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-se-store" style="display: block">');
				html.p('<p>进入店铺</p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {

			},
			init: function (viewElem, settingElem) {
			},
			edit:function (initData) {
				
			}
		}
	})
})(jQuery);
/*
 * des: 商品
 *
 * */
;(function ($) {
	zhx.addPlugin("goods", function () {
		return {
			name: "商品",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			def: {
				imgList: [{
					listingName: "商品1",
					imgUrl_s: zhx.config.imgroot + "goods_bg_01.jpg",
					minPrice: 70,
					p2: 65
				}, {
					listingName: "商品2",
					imgUrl_s: zhx.config.imgroot + "goods_bg_02.jpg",
					minPrice: 240,
					p2: 225
				}, {
					listingName: "商品3",
					imgUrl_s: zhx.config.imgroot + "goods_bg_03.jpg",
					minPrice: 170,
					p2: 165
				}, {
					listingName: "商品4",
					imgUrl_s: zhx.config.imgroot + "goods_bg_04.jpg",
					minPrice: 100,
					p2: 80
				}],
				//商品展示样式
				listClass: {
					"big": "goods-big",
					"small": "goods-small",
					"bigAndSmall": "goods-big-small",
					"detail": "goods-detail"
				},
				//商品展示风格
				listStyle: {
					"card": "card",
					"waterfall": "waterfall",
					"simple": "simple",
					"promotion": "promotion"
				},
				//右侧设置--样式切换
				detailClass: {
					"big": "dta-big",
					"small": "dta-small",
					"bigAndSmall": "dta-bs",
					"detail": "dta-list"
				},
				//右侧设置--风格切换 ---  共用商品展示风格样式名称
				detailStyle: this.listStyle,
				//购买按钮样式
				buyClass: ["buy-none", "buy-1", "buy-2", "buy-3", "buy-4"]
			},
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "goods-list goods-big" style="display: block">');
				html.p('<div class = "mc">');
				html.p('<ul class="ul-1 clearfix card buy-4">');
				html.p('</ul>');
				html.p('<ul class="ul-2 clearfix card buy-4">');
				html.p('</ul>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-goods-list set-goods">');
				html.p('<div class="sel-list clearfix"><span>选择商品：</span>');
				html.p('<ul class="good-rew-list clearfix">');
				//html.p('<li><a><img src="../images/tem/tem03.jpg"/><i class="i-close">x</i></a></li>');
				html.p('<li class="li-add"><a class="btn-add-goods"><i></i></a></li>');
				html.p('</ul>');
				html.p('</div>');
				html.p('<p class="list-style"><span>列表样式：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "listStyle" value = "big" checked = "checked"/>大图<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "bigAndSmall"/>一大两小<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "detail"/>详细列表<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('');
				html.p('<div class = "detail-info dta-big">');
				html.p('<p class="show-type"><label class = "label-radio label-radio-active"><input type = "radio" name = "cardStyle" value = "card" checked = "checked"/>卡片样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "waterfall"/>瀑布流<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "simple"/>极简样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "promotion"/>促销<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<div class = "style-detail card">');
				html.p('<p class="buy-chk"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showBuy" checked="checked"/>显示购买按钮<i class = "i-icon"></i></label></p>');
				html.p('<p class="buy-btn-style">');
				html.p('<label class = "label-radio "><input type = "radio" value = "1" name = "buyStyle"/>样式1<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "2"/>样式2<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "3"/>样式3<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" checked = "checked" name = "buyStyle" value = "4"/>样式4<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p class="show-name"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showName" checked="checked"/>显示商品名 <strong class="dta-tip">(小图不显示名称)</strong><i class = "i-icon"></i></label></p>');
				//html.p('<p class="show-des"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showDes" checked="checked"/>显示商品简介 <i class = "i-icon"></i></label></p>');
				html.p('<p class="show-price"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showPrice" checked="checked"/>显示价格<i class = "i-icon"></i></label></p>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			//商品小图生产
			minGoodsStr: function (list) {
				var html = [];
				$.each(list, function () {
					html.p('<li ><a><img src="' + this.imgUrl_m + '"/><i class="i-close" data-id="' + this.categoryId + '">x</i></a></li>');
				})
				return html.join(" ");
			},
			data: {
				num: 0,				//显示的数量
				goodsList: [],		//显示的商品列表
				pattern: "big",		//模式	[大图，小图，两大一小，详细]
				type: "card",		//类型	[卡片，瀑布，极简，促销]
				showBuy: 1,			//是否显示购买按钮
				showName: 1,			//是否显示商品名称
				//	showDes: 1,			//是否显示商品描述
				showPrice: 1,		//是否显示商品价格
				buyStyle: 4			//购买按钮风格 0为不显示
				
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $ul = viewElem.find("ul");
				var $radioList = settingElem.find(".label-radio");
				//商品展示风格
				var listStyle = {
					"card": "card",
					"waterfall": "waterfall",
					"simple": "simple",
					"promotion": "promotion"
				}
				//右侧设置--样式切换
				var detailClass = {
					"big": "dta-big",
					"small": "dta-small",
					"bigAndSmall": "dta-bs",
					"detail": "dta-list"
				}
				//右侧设置--风格切换
				var detailStyle = listStyle;	//共用商品展示风格样式名称
				var $detailInfo = settingElem.find(".detail-info");
				var $styleOther = settingElem.find(".style-detail");
				zhx.other.radio($radioList, function (type, value, e) {
					switch (type) {
						case "listStyle":
							self.data.pattern = value;
							zhx.changeClass($detailInfo, detailClass, value);

							if (settingElem.find(".show-type .label-radio-active").is(":hidden")) {
								settingElem.find(".show-type .label-radio").eq(0).trigger("click");
							}
							break;
						case "cardStyle":
							self.data.type = value;
							zhx.changeClass($styleOther, detailStyle, value);
							//详细列表-极简风格
							if (self.data.pattern == "detail" && value == "simple") {
								if (self.data.buyStyle == 3) {
									settingElem.find(".buy-btn-style .label-radio").eq(0).trigger("click");
								}
							}
							self.addGoodsListHtml();
							break;
						case "buyStyle":
							self.data.buyStyle = value;
							break;
					}
					if (!e.isTrigger) {
						self.resetHtml(self.data);
					}
					viewElem.find(".mc p").css("border-bottom-style", $(this).val());
				});
				//购买选项
				var $chkList = settingElem.find(".label-checkbox");
				//elem
				var $buyChk = settingElem.find(".buy-chk");
				var $buyStyle = settingElem.find(".buy-btn-style");
				zhx.other.checkbox($chkList, function (type, value, e) {
					switch (type) {
						case "showBuy":
							self.data.showBuy = value;
							if (!value) {
								self.data.buyStyle = 0;
							}else{
								self.data.buyStyle =$buyStyle.find(".label-radio-active input").val();
							}
							$buyStyle.toggleClass("none", !value);//false 隐藏
							break;
						case "showName":
							self.data.showName = value;
							break;
						case "showPrice":
							self.data.showPrice = value;
							break;
					}
					if (!e.isTrigger) {
						self.resetHtml(self.data);
					}
				});
				//选择商品
				settingElem.find(".btn-add-goods").bind("click", function () {
					zhx.dialog.selectGoods(function (list) {
						if (list && list.length) {
							self.data.goodsList.length=0;
							Array.prototype.push.apply(self.data.goodsList, list);
							var html = self.minGoodsStr(list);

							settingElem.find(".good-rew-list li").not(".li-add").remove();
							settingElem.find(".li-add").before(html);
						} else {
							self.data.goodsList = [];
						}
						self.addGoodsListHtml();
						self.resetHtml(self.data);
					},false,self.data.goodsList)
				})
				//小图--商品  删除 (绑定在父元素ul上)
				settingElem.find(".good-rew-list").bind("click", function (e) {
					if (e.target.nodeName == "I") {
						var $elem = $(e.target), $node = $(this);
						if ($elem.hasClass("i-close")) {
							var idx = $node.find(".i-close").index($elem);
							self.removeGoods($elem.attr("data-id"));
							$node.find("li").eq(idx).remove();
							self.data.goodsList.splice(idx, 1);
							viewElem.find("li").eq(idx).remove();
							//if (!self.data.goodsList.length) {
							self.addGoodsListHtml();
							//}
						}
					}
				})
				self.addGoodsListHtml();
				self.resetHtml(self.data);
			},
			//isWaterfall : 是否为瀑布流
			addGoodsListHtml: function () {
				var isWaterfall = this.data.type == "waterfall";
				var list = this.data.goodsList;
				if (list && list.length) {
				} else {
					list = this.def.imgList;
				}
				var leftArr = [], rightArr = [];
				var liStr = function (item, idx) {
					var h = [];
					h.p('<li class="li-' + (idx + 1) + '">');
					h.p('<a  class = "goods-img " href = "">');
					h.p('<img src = "' + (item.imgUrl_xl || item.imgUrl_s) + '">');
					h.p('</a>');
					h.p('<div class = "info-box">');
					h.p('<p class="goods-name" href = ""><a>' + item.listingName + '</a></p>');
					h.p('<p class="goods-price">¥' + item.minPrice + '</p>');
					h.p('<a class="btn-buy" href = "">订购</a>');
					h.p('</div>');
					h.p('<div class = "promotion-box none">');
					h.p('<div class = "prom-price">');
					h.p('<strong>¥' + item.minPrice + '</strong>');
					h.p('<del>原价：¥' + (item.maxPrice || "") + '</del>');
					h.p('</div>');
					h.p('<a class = "btn-prom" href = "" data-id="' + item.listingId + '">我要抢购</a>');
					h.p('</div>');
					h.p('</li>');
					return h;
				}
				$.each(list, function (idx) {
					if (isWaterfall) {
						if (idx % 2) {
							Array.prototype.push.apply(rightArr, liStr(this, idx));
						} else {
							Array.prototype.push.apply(leftArr, liStr(this, idx));
						}
					} else {
						Array.prototype.push.apply(leftArr, liStr(this, idx));
					}
				})
				if (isWaterfall) {
					this.viewElem.find(".ul-1").html(leftArr.join(" "));
					this.viewElem.find(".ul-2").html(rightArr.join(" ")).show();
				} else {
					this.viewElem.find(".ul-1").html(leftArr.join(" "));
					this.viewElem.find(".ul-2").hide();
				}
			},
			removeGoods: function (id) {
				var self = this;
				$.each(this.data.goodsList, function (idx) {
					if (this.id == id) {
						self.data.goodsList.splice(idx, 1);
					}
				})
			},
			resetHtml: function (initData) {
				var self = this;
				var fn = function () {
					var viewElem = this.viewElem, settingElem = this.settingElem;
					var mainView = viewElem.find(".mc");//.clone();
					var $ul = viewElem.find("ul");
					var d = initData;//$.extend(this.data, initData);
					//列表样式
					zhx.changeClass(viewElem, this.def.listClass, d.pattern);
					//卡片样式
					zhx.changeClass(mainView.find("ul"), this.def.listStyle, d.type);
					//购买按钮
					zhx.changeClass($ul, self.def.buyClass, d.buyStyle);
					//瀑布风格时进行判断
					if (self.data.type == "waterfall") {
						//只有按钮时
						mainView.find(".info-box").toggleClass('pos-box', (!self.data.showName && !self.data.showPrice && self.data.showBuy));
						mainView.find(".info-box").toggleClass('h-none', (!self.data.showName && !self.data.showPrice && self.data.showBuy));
						//显示商品名称修改高度
						//mainView.find(".info-box").toggleClass("h-25", !d.showName);
					} else {
						//mainView.find(".info-box").removeClass("h-25")
					}
					//名称
					mainView.find(".goods-name").toggleClass("none", !d.showName);
					//价格
					mainView.find(".goods-price").toggleClass("none", !d.showPrice);
					zhx.resetHeight();
				}
				requestAnimationFrame(function () {
					fn.apply(self);
				})
			},
			resetSetting: function (initData) {
				var self = this;
				var fn = function () {
					var viewElem = this.viewElem, settingElem = this.settingElem;
					var d = initData;
					var patternList = ["big", "small", "bigAndSmall", "detail"];
					var index = patternList.indexOf(d.pattern);
					if (!~index) {
						index = 0;
					}

					zhx.changeClass(settingElem.find(".detail-info"), this.def.detailClass, d.pattern);
					//列表样式
					settingElem.find(".list-style .label-radio").eq(index).trigger("click");
					//卡片样式
					var cardStyleList =["card","waterfall","simple","promotion"];
					var cardIdx = cardStyleList.indexOf(d.type);
					if (!~cardIdx) {
						cardIdx = 0;
					}
					settingElem.find(".show-type .label-radio").eq(cardIdx).trigger("click");

					//购买按钮
					zhx.other.activeCheck(settingElem.find(".buy-chk label"), !!d.showBuy);
					settingElem.find(".buy-btn-style").toggleClass("none",  !d.showBuy);//false 隐藏
					//购买按钮样式
					if(d.buyStyle){
						settingElem.find(".buy-btn-style .label-radio").eq(d.buyStyle-1).trigger("click");
					}
					//商品名称
					zhx.other.activeCheck(settingElem.find(".show-name label"), !!d.showName);
					//价格
					zhx.other.activeCheck(settingElem.find(".show-price label"), !!d.showPrice);
				}
				requestAnimationFrame(function () {
					fn.apply(self);
				})
			},
			edit: function (initData) {
				var self = this;
				this.resetHtml(initData);
				this.resetSetting(initData);
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var param={
					listingIds:initData.itemIds.join(",")
				}

				zhx.data.getGoods(param).then(function (res) {
					var list = res.listingList;
					if (list && list.length) {
						self.data.goodsList.length = 0;
						Array.prototype.push.apply(self.data.goodsList, list);
						var html = self.minGoodsStr(list);
						settingElem.find(".good-rew-list li").not(".li-add").remove();
						settingElem.find(".li-add").before(html);
					} else {
						self.data.goodsList = [];
					}
					self.addGoodsListHtml();
					 
					self.resetHtml(self.data);


				})
			}
		}
	})
})(jQuery);
/*
 * des:商品分组
 *
 * */
;(function ($) {
	zhx.addPlugin("goodsGroup", function () {
		return {
			name: "商品分组",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			def: {
				imgList: [{
					listingName: "商品1",
					imgUrl_s: zhx.config.imgroot + "goods_bg_01.jpg",
					salePrice: 70,
					p2: 65
				}, {
					listingName: "商品2",
					imgUrl_s: zhx.config.imgroot + "goods_bg_02.jpg",
					salePrice: 240,
					p2: 225
				}, {
					listingName: "商品3",
					imgUrl_s: zhx.config.imgroot + "goods_bg_03.jpg",
					salePrice: 170,
					p2: 165
				}, {
					listingName: "商品4",
					imgUrl_s: zhx.config.imgroot + "goods_bg_04.jpg",
					salePrice: 100,
					p2: 80
				}],
				//商品展示样式
				listClass: {
					"big": "goods-big",
					"small": "goods-small",
					"bigAndSmall": "goods-big-small",
					"detail": "goods-detail"
				},
				//商品展示风格
				listStyle: {
					"card": "card",
					"waterfall": "waterfall",
					"simple": "simple",
					"promotion": "promotion"
				},
				//右侧设置--样式切换
				detailClass: {
					"big": "dta-big",
					"small": "dta-small",
					"bigAndSmall": "dta-bs",
					"detail": "dta-list"
				},
				//右侧设置--风格切换 ---  共用商品展示风格样式名称
				detailStyle: this.listStyle,
				//购买按钮样式
				buyClass: ["buy-none", "buy-1", "buy-2", "buy-3", "buy-4"]
			},
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "goods-list goods-big" style="display: block">');
				html.p('<div class = "mc">');
				html.p('<div class="group group-1 clearfix">');
				html.p('<div class="group-nav">');
				html.p('<ol>');
				html.p('<li class="active"><a>分组1</a></li>');
				html.p('<li><a>分组2</a></li>');
				html.p('<li><a>分组3</a></li>');
				html.p('<li><a>分组4</a></li>');
				html.p('</ol>');
				html.p('</div>');
				html.p('<div class="group-con">');
				html.p('<ol>');
				$.each(this.def.imgList, function () {
					html.p('<li>');
					html.p('<img src = "' + (this.imgUrl_xl || this.imgUrl_s) + '">');
					html.p('<div class="text-con">');
					html.p('<p><a>商品名称</a></p>');
					html.p('<p><em>¥120.00</em></p>');
					html.p('<i class="btn-buy"></i>');
					html.p('</div>');
					html.p('</li>');
				})
				html.p('</ol>');
				html.p('</div>');
				html.p('</div>');
				html.p('<div class = "group group-2">');
				html.p('<ul class="clearfix card buy-4">');
				$.each(this.def.imgList, function (idx) {
					html.p('<li class="li-' + (idx + 1) + '">');
					html.p('<a  class = "goods-img " href = "">');
					html.p('<img src = "' + (this.imgUrl_xl || this.imgUrl_s) + '">');
					html.p('</a>');
					html.p('<div class = "info-box">');
					html.p('<p class="goods-name" href = ""><a>商品名称</a></p>');
					//html.p('<p class="goods-des"><label>商品描述</label></p>');
					html.p('<p class="goods-price">¥' + this.p2 + '</p>');
					html.p('<a class="btn-buy" href = "">订购</a>');
					html.p('</div>');
					html.p('<div class = "promotion-box none">');
					html.p('<div class = "prom-price">');
					html.p('<strong>¥' + this.p2 + '</strong>');
					html.p('<del>原价：¥' + this.p1 + '</del>');
					html.p('</div>');
					html.p('<a class = "btn-prom" href = "">我要抢购</a>');
					html.p('</div>');
					html.p('</li>');
				})
				html.p('</ul>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-goods-list set-goods-group">');
				html.p('<p class="show-view"><span>商品分组模板：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "viewType" value = "list" checked = "checked"/>左侧菜单 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "viewType" value = "group"/>顶部菜单<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<div class="set-group-1">');
				html.p('<p class="nav-link"><a><i></i>添加商品分组</a></p>');
				html.p('<p class="r-tip"><label>选择商品来源后，左侧实时预览暂不支持显示其包含的商品数据</label></p>');
				html.p('</div>');
				html.p('<div class="set-group-2">');
				html.p('<p class="nav-link"><a><i></i>添加商品分组</a></p>');
				html.p('<p class="r-tip"><label>选择商品来源后，左侧实时预览暂不支持显示其包含的商品数据</label></p>');
				html.p('');
				html.p('<p class="list-style"><span>列表样式：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "listStyle" value = "big" checked = "checked"/>大图<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "bigAndSmall"/>一大两小<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "detail"/>详细列表<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('');
				html.p('<div class = "detail-info dta-big">');
				html.p('<p class="show-type"><label class = "label-radio label-radio-active"><input type = "radio" name = "cardStyle" value = "card" checked = "checked"/>卡片样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "waterfall"/>瀑布流<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "simple"/>极简样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "promotion"/>促销<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<div class = "style-detail card">');
				html.p('<p class="buy-chk"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showBuy" checked="checked"/>显示购买按钮<i class = "i-icon"></i></label></p>');
				html.p('<p class="buy-btn-style">');
				html.p('<label class = "label-radio "><input type = "radio" value = "1" name = "buyStyle"/>样式1<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "2"/>样式2<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "3"/>样式3<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "buyStyle" value = "4"  checked = "checked"/>样式4<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p class="show-name"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showName" checked="checked"/>显示商品名 <i class = "i-icon"></i></label></p>');
				//html.p('<p class="show-des"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showDes" checked="checked"/>显示商品简介 <i class = "i-icon"></i></label></p>');
				html.p('<p class="show-price"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showPrice" checked="checked"/>显示价格<i class = "i-icon"></i></label></p>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				//num: 6,				//显示的数量
				viewType: "list",	//list 左侧导航模式（只有列表一种样式） group  顶部导航模式
				pattern: "detail",		//模式	[大图，小图，两大一小，详细]
				type: "card",		//类型	[卡片，瀑布，极简，促销]
				showBuy: 1,			//是否显示购买按钮
				showName: 1,			//是否显示商品名称
				//showDes: 1,			//是否显示商品描述
				showPrice: 1,		//是否显示商品价格
				buyStyle: 4			//购买按钮风格 0为不显示
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $ul = viewElem.find("ul");
				var $radioList = settingElem.find(".label-radio");
				//zhx.other.checkbox(settingElem.find(".label-checkbox"), function () {
				//	var check = $(this).prop("checked");
				//	if (check) {
				//		viewElem.find(".mc p").addClass("is-blank");
				//	} else {
				//		viewElem.find(".mc p").removeClass("is-blank");
				//	}
				//});
				//面板1----添加分组
				settingElem.find(".nav-link").bind("click", function () {
					zhx.dialog.selectGroup(function (list) {
						console.log(list)
					})
				})
				//商品展示样式
				var listClass = {
					"big": "goods-big",
					"small": "goods-small",
					"bigAndSmall": "goods-big-small",
					"detail": "goods-detail"
				}
				//商品展示风格
				var listStyle = {
					"card": "card",
					"waterfall": "waterfall",
					"simple": "simple",
					"promotion": "promotion"
				}
				//右侧设置--样式切换
				var detailClass = {
					"big": "dta-big",
					"small": "dta-small",
					"bigAndSmall": "dta-bs",
					"detail": "dta-list"
				}
				//右侧设置--风格切换
				var detailStyle = listStyle;	//共用商品展示风格样式名称
				//购买按钮--样式切换
				var buyClass = ["buy-none", "buy-1", "buy-2", "buy-3", "buy-4"];
				var $detailInfo = settingElem.find(".detail-info");
				var $styleOther = settingElem.find(".style-detail");
				zhx.other.radio($radioList, function (type, value, e) {
					switch (type) {
						case "viewType":
							self.data.viewType = value;
							if (value == "list") {
								viewElem.find(".group-1").show();
								viewElem.find(".group-2").hide();
								settingElem.find(".set-group-1").show();
								settingElem.find(".set-group-2").hide();
							} else {
								viewElem.find(".group-1").hide();
								viewElem.find(".group-2").show();
								settingElem.find(".set-group-1").hide();
								settingElem.find(".set-group-2").show();
							}
							break;
						case "listStyle":
							self.data.pattern = value;
							zhx.changeClass($detailInfo, detailClass, value);
							zhx.resetHeight();
							if (settingElem.find(".show-type .label-radio-active").is(":hidden")) {
								settingElem.find(".show-type .label-radio").eq(0).trigger("click");
							}
							break;
						case "cardStyle":
							self.data.type = value;
							zhx.changeClass($styleOther, detailStyle, value);
							//详细列表-极简风格
							if (self.data.pattern == "detail" && value == "simple") {
								if (self.data.buyStyle == 3) {
									settingElem.find(".buy-btn-style .label-radio").eq(0).trigger("click");
								}
							}
							self.addGoodsListHtml();
							break;
						case "buyStyle":
							self.data.buyStyle = value;
							break;
					}
					if (!e.isTrigger) {
						self.resetHtml(self.data);
					}
					viewElem.find(".mc p").css("border-bottom-style", $(this).val());
				});
				//购买选项
				var $chkList = settingElem.find(".label-checkbox");
				//elem
				var $buyChk = settingElem.find(".buy-chk");
				var $buyStyle = settingElem.find(".buy-btn-style");
				zhx.other.checkbox($chkList, function (type, value, e) {
					switch (type) {
						case "showBuy":
							self.data.showBuy = value;
							if (!value) {
								self.data.buyStyle = 0;
							} else {
								self.data.buyStyle = $buyStyle.find("input:checked").val();
							}
							$buyStyle.toggleClass("none", !value);//false 隐藏
							break;
						case "showName":
							self.data.showName = value;
							break;
						case "showPrice":
							self.data.showPrice = value;
							break;
					}
					if (!e.isTrigger) {
						self.resetHtml(self.data);
					}
				});
			},
			//isWaterfall : 是否为瀑布流
			addGoodsListHtml: function () {
				var isWaterfall = this.data.type == "waterfall";
				var list = this.data.goodsList;
				if (list && list.length) {
				} else {
					list = this.def.imgList;
				}
				var leftArr = [], rightArr = [];
				var liStr = function (item, idx) {
					var h = [];
					h.p('<li class="li-' + (idx + 1) + '">');
					h.p('<a  class = "goods-img " href = "">');
					h.p('<img src = "' + (item.imgUrl_xl || item.imgUrl_s) + '">');
					h.p('</a>');
					h.p('<div class = "info-box">');
					h.p('<p class="goods-name" href = ""><a>' + item.listingName + '</a></p>');
					h.p('<p class="goods-price">¥' + item.salePrice + '</p>');
					h.p('<a class="btn-buy" href = "">订购</a>');
					h.p('</div>');
					h.p('<div class = "promotion-box none">');
					h.p('<div class = "prom-price">');
					h.p('<strong>¥' + item.salePrice + '</strong>');
					h.p('<del>原价：¥' + (item.p1 || "") + '</del>');
					h.p('</div>');
					h.p('<a class = "btn-prom" href = "" data-id="' + item.listingId + '">我要抢购</a>');
					h.p('</div>');
					h.p('</li>');
					return h;
				}
				$.each(list, function (idx) {
					if (isWaterfall) {
						if (idx % 2) {
							Array.prototype.push.apply(rightArr, liStr(this, idx));
						} else {
							Array.prototype.push.apply(leftArr, liStr(this, idx));
						}
					} else {
						Array.prototype.push.apply(leftArr, liStr(this, idx));
					}
				})
				if (isWaterfall) {
					this.viewElem.find(".ul-1").html(leftArr.join(" "));
					this.viewElem.find(".ul-2").html(rightArr.join(" ")).show();
				} else {
					this.viewElem.find(".ul-1").html(leftArr.join(" "));
					this.viewElem.find(".ul-2").hide();
				}
			},
			removeGoods: function (id) {
				var self = this;
				$.each(this.data.goodsList, function (idx) {
					if (this.id == id) {
						self.data.goodsList.splice(idx, 1);
					}
				})
			},
			resetHtml: function (initData) {
				var self = this;
				var fn = function () {
					var viewElem = this.viewElem, settingElem = this.settingElem;
					var mainView = viewElem.find(".mc");//.clone();
					var $ul = viewElem.find("ul");
					var d = initData;//$.extend(this.data, initData);
					//列表样式
					zhx.changeClass(viewElem, this.def.listClass, d.pattern);
					//卡片样式
					zhx.changeClass(mainView.find("ul"), this.def.listStyle, d.type);
					//购买按钮
					//if (d.showBuy) {
					zhx.changeClass($ul, self.def.buyClass, d.buyStyle);
					//}
					//瀑布风格时进行判断
					if (self.data.type == "waterfall") {
						//只有按钮时
						mainView.find(".info-box").toggleClass('pos-box', (!self.data.showName && !self.data.showPrice && self.data.showBuy));
						mainView.find(".info-box").toggleClass('h-none', (!self.data.showName && !self.data.showPrice && self.data.showBuy));
						//显示商品名称修改高度
						//mainView.find(".info-box").toggleClass("h-25", !d.showName);
					} else {
						//mainView.find(".info-box").removeClass("h-25")
					}
					//名称
					mainView.find(".goods-name").toggleClass("none", !d.showName);
					//价格
					mainView.find(".goods-price").toggleClass("none", !d.showPrice);
				}
				requestAnimationFrame(function () {
					fn.apply(self);
				})
			},
			resetSetting: function (initData) {
				var self = this;
				var fn = function () {
					var viewElem = this.viewElem, settingElem = this.settingElem;
					var d = $.extend(this.data, initData);
					var patternList = ["big", "small", "bigAndSmall", "detail"];
					var index = patternList.indexOf(d.pattern);
					if (!~index) {
						index = 0;
					}
					zhx.changeClass(settingElem.find(".detail-info"), this.def.detailClass, d.pattern);
					//列表样式
					settingElem.find(".list-style .label-radio").eq(index).trigger("click");
					//购买按钮
					zhx.other.activeCheck(settingElem.find(".buy-chk label"), !!d.showBuy);
					//购买按钮样式
					settingElem.find(".buy-btn-style .label-radio").eq(d.showBuy).trigger("click");
				}
				requestAnimationFrame(function () {
					fn.apply(self);
				})
			},
			edit: function (initData) {
				var self = this;
				this.resetHtml(initData);
				this.resetSetting(initData);
				var param = {
					listings: initData.itemIds.join(",")
				}
				zhx.data.getGoods(param).then(function (res) {
					var list = res.listingList;
					if (list && list.length) {
						Array.prototype.push.apply(self.data.goodsList, list);
						var html = self.minGoodsStr(list);
						$(".li-add").before(html);
					} else {
						self.data.goodsList = [];
					}
					self.addGoodsListHtml();
					self.resetHtml(self.data);
				})
			}
		}
	})
})(jQuery);
/*
 * des:商品列表
 *
 * */
;(function ($) {
	zhx.addPlugin("goodsList", function () {
		return {
			name: "商品列表",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			def: {
				imgList: [{
					listingName: "商品1",
					imgUrl_s: zhx.config.imgroot + "goods_bg_01.jpg",
					minPrice: 70,
					p2: 65
				}, {
					listingName: "商品2",
					imgUrl_s: zhx.config.imgroot + "goods_bg_02.jpg",
					minPrice: 240,
					p2: 225
				}, {
					listingName: "商品3",
					imgUrl_s: zhx.config.imgroot + "goods_bg_03.jpg",
					minPrice: 170,
					p2: 165
				}, {
					listingName: "商品4",
					imgUrl_s: zhx.config.imgroot + "goods_bg_04.jpg",
					minPrice: 100,
					p2: 80
				}],
				//商品展示样式
				listClass: {
					"big": "goods-big",
					"small": "goods-small",
					"bigAndSmall": "goods-big-small",
					"detail": "goods-detail"
				},
				//商品展示风格
				listStyle: {
					"card": "card",
					"waterfall": "waterfall",
					"simple": "simple",
					"promotion": "promotion"
				},
				//右侧设置--样式切换
				detailClass: {
					"big": "dta-big",
					"small": "dta-small",
					"bigAndSmall": "dta-bs",
					"detail": "dta-list"
				},
				//右侧设置--风格切换 ---  共用商品展示风格样式名称
				detailStyle: this.listStyle,
				//购买按钮样式
				buyClass: ["buy-none", "buy-1", "buy-2", "buy-3", "buy-4"]
			},
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "goods-list goods-big" style="display: block">');
				html.p('<div class = "mc">');
				html.p('<ul class="ul-1 clearfix card buy-4">');
				html.p('</ul>');
				html.p('<ul class="ul-2 clearfix card buy-4">');
				html.p('</ul>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-goods-list">');
				html.p('<p class="r-list"><span>商品来源：</span><label><em></em></label><a>选择商品来源</a></p>');
				html.p('<p class="r-tip"><span></span><label>选择商品来源后，左侧实时预览暂不支持显示其包含的商品数据</label></p>');
				html.p('<p class="show-num"><span>显示个数：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "g_showNum" value = "6" checked = "checked"/>6 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "g_showNum" value = "12"/>12<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "g_showNum" value = "18"/>18 <i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('');
				html.p('<p class="list-style"><span>列表样式：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "listStyle" value = "big" checked = "checked"/>大图<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "bigAndSmall"/>一大两小<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "detail"/>详细列表<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('');
				html.p('<div class = "detail-info dta-big">');
				html.p('<p class="show-type"><label class = "label-radio label-radio-active"><input type = "radio" name = "cardStyle" value = "card" checked = "checked"/>卡片样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "waterfall"/>瀑布流<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "simple"/>极简样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "promotion"/>促销<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<div class = "style-detail card">');
				html.p('<p class="buy-chk"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showBuy" checked="checked"/>显示购买按钮<i class = "i-icon"></i></label></p>');
				html.p('<p class="buy-btn-style">');
				html.p('<label class = "label-radio "><input type = "radio" value = "1" name = "buyStyle"/>样式1<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "2"/>样式2<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "3"/>样式3<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "buyStyle" value = "4"  checked = "checked"/>样式4<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p class="show-name"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showName" checked="checked"/>显示商品名  <strong class="dta-tip">(小图不显示名称)</strong><i class = "i-icon"></i></label></p>');
				//html.p('<p class="show-des"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showDes" checked="checked"/>显示商品简介 <i class = "i-icon"></i></label></p>');
				html.p('<p class="show-price"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showPrice" checked="checked"/>显示价格<i class = "i-icon"></i></label></p>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				num: 6,				//显示的数量
				goodsList: [],		//显示的商品列表
				pattern: "big",		//模式	[大图，小图，两大一小，详细]
				type: "card",		//类型	[卡片，瀑布，极简，促销]
				showBuy: 1,			//是否显示购买按钮
				showName: 1,			//是否显示商品名称
				//showDes: 1,			//是否显示商品描述
				showPrice: 1,		//是否显示商品价格
				buyStyle: 4,			//购买按钮风格 0为不显示
				searchData: {}			//搜索参数---保存时使用
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $ul = viewElem.find("ul");
				var $radioList = settingElem.find(".label-radio");
				//zhx.other.checkbox(settingElem.find(".label-checkbox"), function () {
				//	var check = $(this).prop("checked");
				//	if (check) {
				//		viewElem.find(".mc p").addClass("is-blank");
				//	} else {
				//		viewElem.find(".mc p").removeClass("is-blank");
				//	}
				//});
				//商品展示样式
				var listClass = {
					"big": "goods-big",
					"small": "goods-small",
					"bigAndSmall": "goods-big-small",
					"detail": "goods-detail"
				}
				//商品展示风格
				var listStyle = {
					"card": "card",
					"waterfall": "waterfall",
					"simple": "simple",
					"promotion": "promotion"
				}
				//右侧设置--样式切换
				var detailClass = {
					"big": "dta-big",
					"small": "dta-small",
					"bigAndSmall": "dta-bs",
					"detail": "dta-list"
				}
				//右侧设置--风格切换
				var detailStyle = listStyle;	//共用商品展示风格样式名称
				//购买按钮--样式切换
				var buyClass = ["buy-none", "buy-1", "buy-2", "buy-3", "buy-4"];
				var $detailInfo = settingElem.find(".detail-info");
				var $styleOther = settingElem.find(".style-detail");
				zhx.other.radio($radioList, function (type, value, e) {
					switch (type) {
						case "g_showNum":
							self.data.num = value;
							self.addGoodsListHtml();
							self.resetHtml(self.data);
							break;
						case "listStyle":
							self.data.pattern = value;
							zhx.changeClass($detailInfo, detailClass, value);
							//zhx.resetHeight();
							if (settingElem.find(".show-type .label-radio-active").is(":hidden")) {
								settingElem.find(".show-type .label-radio").eq(0).trigger("click");
							}
							break;
						case "cardStyle":
							self.data.type = value;
							zhx.changeClass($styleOther, detailStyle, value);
							//详细列表-极简风格
							if (self.data.pattern == "detail" && value == "simple") {
								if (self.data.buyStyle == 3) {
									settingElem.find(".buy-btn-style .label-radio").eq(0).trigger("click");
								}
							}
							self.addGoodsListHtml();
							break;
						case "buyStyle":
							self.data.buyStyle = value;
							break;
					}
					if (!e.isTrigger) {
						self.resetHtml(self.data);
					}
					viewElem.find(".mc p").css("border-bottom-style", $(this).val());
				});
				//购买选项
				var $chkList = settingElem.find(".label-checkbox");
				//elem
				var $buyChk = settingElem.find(".buy-chk");
				var $buyStyle = settingElem.find(".buy-btn-style");
				zhx.other.checkbox($chkList, function (type, value, e) {
					switch (type) {
						case "showBuy":
							self.data.showBuy = value;
							if (!value) {
								self.data.buyStyle = 0;
							}else{
								self.data.buyStyle =$buyStyle.find(".label-radio-active input").val();
							}
							$buyStyle.toggleClass("none", !value);//false 隐藏
							break;
						case "showName":
							self.data.showName = value;
							break;
						case "showPrice":
							self.data.showPrice = value;
							break;
					}
					if (!e.isTrigger) {
						self.resetHtml(self.data);
					}
				})
				//选择商品
				settingElem.find(".r-list a").bind("click", function () {
					zhx.dialog.selectGroupSingleton(function (searchData) {
						// if (list && list.length) {
						// 	Array.prototype.push.apply(self.data.goodsList, list);
						// 	var html = self.minGoodsStr(list);
						// 	$(".li-add").before(html);
						// } else {
						// 	self.data.goodsList = [];
						// }
						self.data.searchData = searchData;
						var data = {
							microshoppId: zhx.config.store.id,
							pageIndex: 1,
							pageSize: 18
						};
						$.extend(data, searchData);
						zhx.data.jsonp(zhx.data.host + "/api/finding/v1/listings", data).success(function (res) {
							self.data.goodsList.length=0;//清空列表
							Array.prototype.push.apply(self.data.goodsList, res.result.listingList || []);
							self.addGoodsListHtml();
							self.resetHtml(self.data);
						})
					})
				})
				self.addGoodsListHtml();
				self.resetHtml(self.data);
			},
			//isWaterfall : 是否为瀑布流
			addGoodsListHtml: function () {
				var num = this.data.num;
				var isWaterfall = this.data.type == "waterfall";
				var list = this.data.goodsList;
				if (list && list.length) {
				} else {
					list = this.def.imgList;
				}
				var leftArr = [], rightArr = [];
				var liStr = function (item, idx) {
					var h = [];
					if (idx < num) {
						h.p('<li class="li-' + (idx + 1) + '">');
						h.p('<a  class = "goods-img " href = "">');
						h.p('<img src = "' + (item.imgUrl_xl || item.imgUrl_s) + '">');
						h.p('</a>');
						h.p('<div class = "info-box">');
						h.p('<p class="goods-name" href = ""><a>' + item.listingName + '</a></p>');
						h.p('<p class="goods-price">¥' + item.minPrice + '</p>');
						h.p('<a class="btn-buy" href = "">订购</a>');
						h.p('</div>');
						h.p('<div class = "promotion-box none">');
						h.p('<div class = "prom-price">');
						h.p('<strong>¥' + item.minPrice + '</strong>');
						h.p('<del>原价：¥' + (item.maxPrice || "") + '</del>');
						h.p('</div>');
						h.p('<a class = "btn-prom" href = "" data-id="' + item.listingId + '">我要抢购</a>');
						h.p('</div>');
						h.p('</li>');
					}
					return h;
				}
				$.each(list, function (idx) {
					if (isWaterfall) {
						if (idx % 2) {
							Array.prototype.push.apply(rightArr, liStr(this, idx));
						} else {
							Array.prototype.push.apply(leftArr, liStr(this, idx));
						}
					} else {
						Array.prototype.push.apply(leftArr, liStr(this, idx));
					}
				})
				if (isWaterfall) {
					this.viewElem.find(".ul-1").html(leftArr.join(" "));
					this.viewElem.find(".ul-2").html(rightArr.join(" ")).show();
				} else {
					this.viewElem.find(".ul-1").html(leftArr.join(" "));
					this.viewElem.find(".ul-2").hide();
				}
			},
			resetHtml: function (initData) {
				var self = this;
				var fn = function () {
					var viewElem = this.viewElem, settingElem = this.settingElem;
					var mainView = viewElem.find(".mc");//.clone();
					var $ul = viewElem.find("ul");
					var d = initData;//$.extend(this.data, initData);
					//列表样式
					zhx.changeClass(viewElem, this.def.listClass, d.pattern);
					//卡片样式
					zhx.changeClass(mainView.find("ul"), this.def.listStyle, d.type);
					//购买按钮
					//if (d.showBuy) {
					zhx.changeClass($ul, self.def.buyClass, d.buyStyle);
					//}
					//瀑布风格时进行判断
					if (self.data.type == "waterfall") {
						//只有按钮时
						mainView.find(".info-box").toggleClass('pos-box', (!self.data.showName && !self.data.showPrice && self.data.showBuy));
						mainView.find(".info-box").toggleClass('h-none', (!self.data.showName && !self.data.showPrice && self.data.showBuy));
						//显示商品名称修改高度
						//mainView.find(".info-box").toggleClass("h-25", !d.showName);
					} else {
						//mainView.find(".info-box").removeClass("h-25")
					}
					//名称
					mainView.find(".goods-name").toggleClass("none", !d.showName);
					//价格
					mainView.find(".goods-price").toggleClass("none", !d.showPrice);
					zhx.resetHeight();
				}
				requestAnimationFrame(function () {
					fn.apply(self);
				})
			},
			resetSetting: function (initData) {
				var self = this;
				var fn = function () {
					var viewElem = this.viewElem, settingElem = this.settingElem;
					var d =  initData ;
					var patternList = ["big", "small", "bigAndSmall", "detail"];
					var index = patternList.indexOf(d.pattern);
					if (!~index) {
						index = 0;
					}
					zhx.changeClass(settingElem.find(".detail-info"), this.def.detailClass, d.pattern);
					//列表样式
					settingElem.find(".list-style .label-radio").eq(index).trigger("click");
					//卡片样式
					var cardStyleList =["card","waterfall","simple","promotion"];
					var cardIdx = cardStyleList.indexOf(d.type);
					if (!~cardIdx) {
						cardIdx = 0;
					}
					settingElem.find(".show-type .label-radio").eq(cardIdx).trigger("click");
					//购买按钮
					zhx.other.activeCheck(settingElem.find(".buy-chk label"), !!d.showBuy);
					if(d.buyStyle){
						//索引和value值相差1，所以减1
						settingElem.find(".buy-btn-style .label-radio").eq(d.buyStyle-1).trigger("click");
					}
					//商品名称
					zhx.other.activeCheck(settingElem.find(".show-name label"), !!d.showName);
					//价格
					zhx.other.activeCheck(settingElem.find(".show-price label"), !!d.showPrice);
				}
				requestAnimationFrame(function () {
					fn.apply(self);
				})
			},
			edit: function (initData) {
				var self = this;
				this.resetHtml(initData);
				this.resetSetting(initData);
				var param = $.extend(true, {}, initData.initSearchData);
				delete param.type;
				zhx.data.getGoods(param).then(function (res) {
					Array.prototype.push.apply(self.data.goodsList, res.listingList || []);
					self.addGoodsListHtml();
					self.resetHtml(self.data);
				})
			}
		}
	})
})(jQuery);
/*
 * des: 商品搜索
 *
 * */
;(function ($) {
	zhx.addPlugin("goodsSearch", function () {
		return {
			name: "商品搜索",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "gs-search">');
				html.p('<div class = "mc"><p><label class="label-search"><input type="text" placeholder="搜索商品" disabled="disabled"/><i class="i-icon"></i></label></p></div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-gs-search" style="display: block">');
				html.p('<p><span>背景色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class="btn-reset" type="button" value="重置"/>');
				html.p('</p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				bgColor: "#ffffff"
			},
			init: function (viewElem, settingElem) {
				var self = this;
				//更改颜色
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".mc").css("background-color", this.value);
					self.data.bgColor = this.value;
				});
				//重置
				settingElem.find(".btn-reset").bind("click", function () {
					settingElem.find(".label-color input").val("#ffffff");
					settingElem.find(".label-color input").trigger("change");
				})
			},
			edit: function (initData) {
				var settingElem = this.settingElem;
				settingElem.find(".label-color input").val(initData.bgColor).trigger("change");
			}
		}
	})
})(jQuery);
/*
 * des: hr 辅助线
 *
 * */
;(function ($) {
	zhx.addPlugin("hr", function () {
		return {
			name: "辅助线",
			isDelete:1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "sty-hr">');
				html.p('<div class = "mc"><p></p></div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-sty-hr" style="display: block">');
				html.p('<p><span>颜色：</span><label class = "label-color"><input type = "color" value = "#ececec"></label><input class="btn-reset" type="button" value="重置"/>');
				html.p('<label class="label-checkbox"><input type="checkbox"/>左右留边<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p><span>分类：</span><label class = "label-radio label-radio-active"><input type = "radio" value = "solid"  checked="checked"/>实线 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" value = "dashed"/>虚线<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" value = "dotted"/>点线 <i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('</div>');
				return html.join(" ");
			},
			data:{
				isBlank:false,
				color:"#ececec",
				type:"solid"	//solid dashed  dotted
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $list = settingElem.find(".label-radio");
				zhx.other.checkbox(settingElem.find(".label-checkbox"), function () {
					var check = $(this).prop("checked");
					if (check) {
						viewElem.find(".mc p").addClass("is-blank");
					} else {
						viewElem.find(".mc p").removeClass("is-blank");
					}
					self.data.isBlank = check;
				});
				zhx.other.radio($list, function (type) {
					var val = $(this).val();
					viewElem.find(".mc p").css("border-bottom-style", val);
					self.data.type = val;
				});
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".mc p").css("border-color", this.value);
					self.data.color = this.value;
				});
				settingElem.find(".btn-reset").bind("click", function () {
					settingElem.find(".label-color input").val("#ececec");
					settingElem.find(".label-color input").trigger("change");
					$list.eq(0).trigger("click");
					if (settingElem.find(".label-checkbox input").eq(0).prop("checked")) {
						settingElem.find(".label-checkbox").eq(0).trigger("click");
					}
				})
			},
			edit:function (initData) {
				var d = $.extend(this.data, initData);
				var viewElem = this.viewElem, settingElem = this.settingElem;
				if(d.isBlank){
					settingElem.find(".label-checkbox").trigger("click");
				}
				var tem_list = ["solid", "dashed" , "dotted"];
				settingElem.find(".label-radio").eq(tem_list.indexOf(d.type)).trigger("click");
				settingElem.find(".label-color input").val(d.color).trigger("change");
			}
		}
	})
})(jQuery);
/*
 * des: 图片广告
 *
 * */
;(function ($) {
	zhx.addPlugin("imgAd", function () {
		return {
			name: "图片广告",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "img-ad ">');
				html.p('<div class = "mc type-carousel">');
				html.p('<div class = "adi-list">');
				html.p('<a href="">');
				html.p('<img src = "' + zhx.config.imgroot + '/img_bg_101.jpg" />');
				html.p('</a>');
				html.p('</div>');
				html.p('<ul class="adi-list-icon">');
				//html.p('<li class="active">.</li>');
				html.p('</ul>');
				html.p('</div>');
				html.p('');
				html.p('</div>');
				return html.join(" ");
			},
			viewItem: function (src, title) {
				var html = [];
				html.p('<a>');
				html.p('<img src = "' + src + '" alt = "">');
				if (title) {
					html.p('<cite class="c-bg"></cite>');
					html.p('<cite class="c-txt">' + title + '</cite>');
				} else {
					html.p('<cite class="c-bg none"></cite>');
					html.p('<cite class="c-txt none"></cite>');
				}
				html.p('</a>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class="set-img-ad" style = "display: block">');
				html.p('<p class="show-method"><span>显示方式：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" value = "carousel" name = "method" checked = "checked"/>折叠轮播 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "method" value = "separate"/>分开显示<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p class="show-size type-car"><span>显示大小：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" value = "big" name = "showSize" checked = "checked"/>大图 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio min-rdi"><input type = "radio" name = "showSize" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<ul class="img-ad-list clearfix">');
				html.p('<li class="move-li"></li>');
				html.p('</ul>');
				html.p('<p class="nav-link"><label><i></i>添加一个广告<input type="file"/></label></p>');
				html.p('</div>');
				return html.join(" ");
			},
			liTemplate: function (src) {
				var html = [];
				html.p('<li>');
				html.p('<div class="ad-img-bg">');
				html.p('<img src="' + src + '"/>');
				html.p('<cite class="c-bg"></cite>');
				html.p('<cite class="c-txt"><label >重新上传<input type="file"/></label></cite>');
				html.p('</div>');
				html.p('<div class="ad-img-info">');
				html.p('<p><span>标题：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>链接：</span><label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.p('<a>');
				html.p('<label style="display: none" data-val="-2"></label>');
				html.p('<label data-val="1">微页面</label>');
				html.p('<label data-val="2">商品</label>');
				// html.p('<label data-val="3">营销活动</label>');
				html.p('<label data-val="5">店铺主页</label>');
				html.p('<label data-val="7">自定义外链</label>');
				html.p('</a><i class="i-icon"></i>');
				html.p('</label>');
				html.p('</p>');
				html.p('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.p('</div>');
				html.p('<i class="i-close">x</i>');
				html.p('</li>');
				return html.join(" ");
			},
			data: {
				method: "carousel",
				showSize: "big",
				imgList: []		//{src,title,link,type,name,size:{w,h}}
			},

			checkImg: function ($list, callback) {
				var h_list = [];
				$.each($list, function (idx, el) {
					var img = $list.eq(idx).find("img")[0];
					if (img.src) {
						var check = function () {
							// 只要任何一方大于0 表示服务器已经返回宽高
							if (img.width > 0 || img.height > 0) {
								h_list.push(img.height);
								clearInterval(set);
								if (h_list.length == $list.length) {
									callback && callback(h_list);
								}
							}
						};
						var set = setInterval(check, 40);
					}
				})
			},
			setMaxHeight: function (self, elem) {
				if (self.data.method == "carousel") {
					if (self.data.imgList.length < 2) {
						elem.height("auto");
						elem.find("a").height("auto");
						return;
					}
					self.checkImg(elem.find(".adi-list"),function (h_list) {
						var h = Math.max.apply([], h_list);
						elem.height(h);
						elem.find("a").height(h);
					})


				} else {
					elem.height("auto");
					elem.find("a").height("auto")
				}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $radioList = settingElem.find(".label-radio");
				var m_cls = {carousel: "type-carousel", separate: "type-separate"};
				zhx.other.radio($radioList, function (type, value) {
					switch (type) {
						case "method":
							self.data.method = value;
							settingElem.find(".show-size").toggleClass("type-car", value != "separate");
							if (self.data.method == "carousel" && self.data.showSize == "small") {
								settingElem.find(".show-size .label-radio").eq(0).trigger("click");
							}
							zhx.changeClass(viewElem.find(".mc"), m_cls, value);
							self.setMaxHeight(self, viewElem.find(".mc"));
							break;
						case "showSize":
							self.data.showSize = value;
							viewElem.find(".adi-list").toggleClass("sm-list", value == "small");
							break;
					}
				});
				//add
				var $listBox = settingElem.find(".img-ad-list"), $viewImgBox = viewElem.find(".adi-list"), $viewIcon = viewElem.find(".adi-list-icon");
				var $list = $listBox.find("li").not(".move-li");
				var resetList = function () {
					$list = $listBox.find("li").not(".move-li");
				}
				//编辑事件
				settingElem.find(".img-ad-list").bind("editEvent", function () {
					var list = self.data.imgList;
					$.each(list, function (idx, el) {
						$listBox.append(self.liTemplate(el.src));
					})
					resetList();
					bindLiEvent();
					changeViewImg();
					self.setMaxHeight(self, viewElem.find(".mc"));
				})
				var changeViewImg = function () {
					var html = [];
					$.each(self.data.imgList, function () {
						html.push(self.viewItem(this.src, this.title));
					});
					$viewImgBox.html(html.join(" "));
					var iconHtml = [];
					if (self.data.imgList.length > 1) {
						$.each(self.data.imgList, function (idx) {
							if (idx == 0) {
								iconHtml.push('<li class="active">.</li>');
							} else {
								iconHtml.push('<li>.</li>');
							}
						})
						$viewIcon.html(iconHtml.join(" "))
					} else {
						$viewIcon.html("");
					}
					if (self.data.imgList.length == 0) {
						$viewImgBox.html('<a><img src = "' + zhx.config.imgroot + '/img_bg_101.jpg" alt = ""></a>');
						viewElem.find(".mc").removeAttr("style");
					}
				}
				//绑定li事件
				var bindLiEvent = function () {
					//关闭
					$listBox.find(".i-close").unbind("click").bind("click", function () {
						var $li = $(this).parent("li");
						var idx = $list.index($li);
						if (idx >= 0) {
							self.data.imgList.splice(idx, 1);
						}
						$li.remove();
						resetList();
						changeViewImg();
						self.setMaxHeight(self, viewElem.find(".mc"));
					});
					//标题
					$listBox.find(".link-txt input").unbind("blur").bind("blur", function () {
						var val = $(this).val();
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						self.data.imgList[idx].title = val;
						if ($.trim(val)) {
							$viewImgBox.find("a").eq(idx).find(".c-txt").html(val);
							$viewImgBox.find("a").eq(idx).find("cite").removeClass("none");
						} else {
							$viewImgBox.find("a").eq(idx).find("cite").addClass("none");
						}
					});
					//重新选择
					$listBox.find(".c-txt input").unbind("change").bind("change", function () {
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						//zhx.dialog.imgList(function (list) {
						//	var $img = list.eq(0).find("img");
						//	var src = $img.attr("src");
						//	$li.find("img").attr("src", src);
						//	self.data.imgList[idx].src = src;
						//	self.data.imgList[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
						//	//bindLiEvent();
						//	changeViewImg();
						//	self.setMaxHeight(self, viewElem.find(".mc"));
						//}, 1);
						var file = this.files[0];
						zhx.data.uploadImg(file).success(function (res) {
							if (res.status == 0) {
								//self.data.logoSrc = res.url;
								//viewElem.find(".ba-logo img").attr("src", res.url);
								//settingElem.find(".sb-logo img").attr("src", res.url);
								var src = res.url;
								$li.find("img").attr("src", src);
								self.data.imgList[idx].src = src;
								//bindLiEvent();
								changeViewImg();
								self.setMaxHeight(self, viewElem.find(".mc"));
							}else{
								zhx.box.msg(res.message);
							}
						}).error(function () {
							zhx.box.msg("上传失败！");
						});
					})
					//拖拽事件
					$listBox.find("li").unbind("mousedown").bind("mousedown", function (e) {
						var elem = $(this);
						if (e.target.nodeName == "LI") {
							elem.shareDrag($listBox.find(".move-li"), $listBox.find("li").not(".move-li"), function () {
								resetList();
								$list.each(function (idx) {
									var $item = $(this);
									$item.find("input").trigger("blur");
									$item.find(".link-address").trigger("click");
									//修改图片src
									var $img = $item.find("img");
									self.data.imgList[idx].src = $img.attr("src");
									self.data.imgList[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
									changeViewImg();
									self.setMaxHeight(self, viewElem.find(".mc"));
								})
							}, e);
						}
					})
					//外链关闭
					$listBox.find(".btn-oth-cel").unbind("click").bind("click", function () {
						var idx = $listBox.find(".btn-oth-cel").index(this);
						$listBox.find(".other-link-box").eq(idx).hide();
					})
					//外链确认
					$listBox.find(".btn-oth-ok").unbind("click").bind("click", function () {
						var idx = $list.find(".btn-oth-ok").index(this);
						var src = self.data.imgList[idx].link = $list.find(".other-link-box input").eq(idx).val();
						$list.find(".link-sname").eq(idx).find("em").text("外链|" + src);
						$list.find(".other-link-box").eq(idx).hide();
					})
					//选择链接
					var $linkAddress = $list.find(".link-address");
					//zhx.other.select($linkAddress, function (data) {
					//	var $item = $(this);
					//	var $li = $(this).parents("li");
					//	var idx = $list.index($li);
					//	self.data.imgList[idx].link = data.value;
					//	$item.attr("data-val", data.value);
					//	$item.find("strong").text(data.text);
					//});
					var $sname = $list.find(".link-sname");
					zhx.other.select($linkAddress, function (data, e) {
						var $item = $(this);
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						$item.attr("data-val", data.value);
						var editTxt = function (b) {
							$item.find("strong").text(b ? "修改" : "设置链接到的页面地址");
						}
						var setName = function (name) {
							$sname.eq(idx).addClass("link-mar15").find("em").text(name);
						}
						var setLinkObj = function (obj) {
							if (obj) {
								setName(obj.typeName + "|" + obj.name);
								self.data.imgList[idx].link = obj.src;
								editTxt(1);
							}
						}
						switch (data.value) {
							case "-2":
								$sname.eq(idx).removeClass("link-mar15").find("em").text(data.text);
								editTxt(0);
								break;
							case "1":
								if (e.isTrigger) {
									var obj = {
										typeName: data.text,
										name: self.data.imgList[idx].name,
										src: self.data.imgList[idx].link
									}
									setLinkObj(obj);
								} else {
									zhx.dialog.selectMinPage(setLinkObj);
								}
								break;
							case "2":
								if (e.isTrigger) {
									var obj = {
										typeName: data.text,
										name: self.data.imgList[idx].name,
										src: self.data.imgList[idx].link
									}
									setLinkObj(obj);
								} else {
									zhx.dialog.selectGoodsSingleton(setLinkObj);
								}
								break;
							case "3":
								zhx.dialog.selectActivity(setLinkObj);
								break;
							case "5":
								$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
								self.data.imgList[idx].link = zhx.config.store.mainPageUrl;
								editTxt(1);
								break;
							case "7":
								self.data.imgList[idx].link = $list.eq(idx).find(".other-link-box input").val();
								$sname.eq(idx).addClass("link-mar15").find("em").text("外链|" + self.data.imgList[idx].link);
								//trigger
								if (e.isTrigger) {
								} else {
									$list.find(".other-link-box").eq(idx).show();
								}
								editTxt(1);
								break;
						}
						self.data.imgList[idx].type = data.value;
					});
					//点击事件
					$sname.find("em").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("em").index(this);
						if (self.data.imgList[idx].type == 7) {
							$list.find(".other-link-box").eq(idx).show();
						}
						//$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
					//删除
					$sname.find("i").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("i").index(this);
						$list.eq(idx).find(".other-link-box input").val("");
						$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
				}
				//settingElem.find(".nav-link").bind("click", function () {
				//zhx.dialog.imgList(function (list) {
				//	var html = [];
				//	$.each(list, function () {
				//		var $img = $(this).find("img");
				//		var src = $img.attr("src");
				//		self.data.imgList.push({
				//			src: src,
				//			link: "",
				//			type: "",  //链接类型
				//			title: "",
				//			size: {w: $img[0].naturalWidth, h: $img[0].naturalHeight}
				//		});
				//		html.push(self.liTemplate(src));
				//	})
				//	$listBox.append(html.join(" "));
				//	resetList();
				//	bindLiEvent();
				//	changeViewImg();
				//	self.setMaxHeight(self, viewElem.find(".mc"));
				//})
				//})
				settingElem.find(".nav-link input").bind("change", function () {
					var file = this.files[0];
					zhx.data.uploadImg(file).success(function (res) {
						if (res.status == 0) {
							//self.data.logoSrc = res.url;
							//viewElem.find(".ba-logo img").attr("src", res.url);
							//settingElem.find(".sb-logo img").attr("src", res.url);
							var src = res.url;
							self.data.imgList.push({
								src: src,
								link: "",
								type: "",  //链接类型
								title: "",
								name:"",
								size: {w: 0, h: 0}
							});
							$listBox.append(self.liTemplate(src));
							resetList();
							bindLiEvent();
							changeViewImg();
							self.setMaxHeight(self, viewElem.find(".mc"));
						}else{
							zhx.box.msg(res.message);
						}
					}).error(function () {
						zhx.box.msg("上传失败！");
					});
				});
			},
			edit: function (initData) {
				var d = $.extend({}, this.data, initData);
				var tem_link = [-2, 1, 2, 5, 7];
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var $listBox = settingElem.find(".img-ad-list");
				$listBox.trigger("editEvent");
				if (d.method == "separate") {
					settingElem.find(".show-method").find(".label-radio").eq(1).trigger("click");
				}
				if (d.showSize == "small") {
					settingElem.find(".show-size").find(".label-radio").eq(1).trigger("click");
				}
				if (d.imgList) {
					var $list = $listBox.find("li").not(".move-li");
					$.each(d.imgList, function (idx, el) {
						$list.eq(idx).find(".link-txt input").val(el.title).trigger("blur");
						if (el.type == 7) {
							//自定义外链
							$list.eq(idx).find(".other-link-box input").val(el.link);
							$list.eq(idx).find(".btn-oth-ok").trigger("click");
						}
						$list.eq(idx).find(".link-address").find("label").eq(tem_link.indexOf(parseInt(el.type))).trigger("click");
					})
				}
			}
		}
	})
})(jQuery);
/*
 * des:图片导航
 *
 * */
;(function ($) {
	zhx.addPlugin("imgNav", function () {
		return {
			name: "图片导航",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "img-nav">');
				html.p('<div class = "mc">');
				html.p('<a><img /><p></p></a>');
				html.p('<a><img /><p></p></a>');
				html.p('<a><img /><p></p></a>');
				html.p('<a><img /><p></p></a>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			viewItem: function (src, title) {
				var html = [];
				html.p('<a><img src="' + (src || "") + '"/>');
				html.p('<p>' + (title || "") + '</p>');
				html.p('</a>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-img-nav">');
				html.p('<ul class="sin-img-list">');
				html.p('</ul>');
				html.p('</div>');
				return html.join(" ");
			},
			liTemplate: function (src) {
				var html = [];
				html.p('<li class="clearfix">');
				html.p('<div class="nav-img-bg">');
				html.p('<img/>');
				html.p('<label class="add-img"><i></i>添加图片<input type="file"/></label>');
				html.p('<cite class="c-bg"></cite>');
				html.p('<cite class="c-txt">重新上传<input type="file"/></cite>');
				html.p('<p><em class="msg msg-img">图片不能为空！</em></p>');
				html.p('</div>');
				html.p('<div class="nav-img-info">');
				html.p('<p><span>文字：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>链接：</span><label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.p('<a>');
				html.p('<label style="display: none" data-val="-2"></label>');
				html.p('<label data-val="1">微页面</label>');
				html.p('<label data-val="2">商品</label>');
				// html.p('<label data-val="3">营销活动</label>');
				html.p('<label data-val="5">店铺主页</label>');
				html.p('<label data-val="7">自定义外链</label>');
				html.p('</a><i class="i-icon"></i>');
				html.p('</label>');
				html.p('</p>');
				html.p('<p><em class="msg msg-link">链接不能为空！</em></p>');
				html.p('</div>');
				html.p('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.p('</li>');
				return html.join(" ");
			},
			data: {
				list: []//{src,title,link,type,name}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $listBox = settingElem.find(".sin-img-list"), $viewLinkBox = viewElem.find(".mc");
				var $list = $listBox.find("li").not(".move-li");
				var resetList = function () {
					$list = $listBox.find("li").not(".move-li");
				}

				function initLi() {
					var html = [];
					html.push('<li class="move-li clearfix"></li>');
					for (var i = 0; i < 4; i++) {
						html.push(self.liTemplate());
						if (self.data.list.length >= 4) {
						} else {
							self.data.list.push({
								src: "",
								size: {w: 0, h: 0},
								name:"",
								title: "",
								link: "",
								type: ""
							});
						}
					}
					$listBox.html(html.join(" "))
				}

				//var $list = settingElem.find(".label-radio");
				//zhx.other.radio($list,function (type) {
				//	viewElem.find(".mc p").css("border-bottom-style",$(this).val());
				//});
				//settingElem.find(".label-color input").bind("change",function () {
				//	viewElem.find(".mc p").css("border-color",this.value);
				//});
				var changeViewImg = function () {
					self.resetViewImg();
				}
				//绑定li事件
				var bindLiEvent = function () {
					//关闭
					$listBox.find(".i-close").unbind("click").bind("click", function () {
						var $li = $(this).parent("li");
						var idx = $list.index($li);
						if (idx >= 0) {
							self.data.list.splice(idx, 1);
						}
						$li.remove();
						if (self.data.list.length < 20) {
							settingElem.find(".nav-link").show();
						}
						resetList();
						changeViewImg();
					});
					//标题
					$listBox.find(".link-txt input").unbind("blur").bind("blur", function () {
						var val = $(this).val() || " ";
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						self.data.list[idx].title = val;
						$viewLinkBox.find("a").eq(idx).find("p").html(val);
					});
					//重新选择
					$listBox.find(".c-txt input").unbind("change").bind("change", function () {
						var $li = $(this).parents("li");
						//selectImg($li);
						labelSelectImg($li, 0, this.files[0]);
					})
					//添加图片
					settingElem.find(".add-img input").unbind("change").bind("change", function () {
						var $li = $(this).parents("li");
						//selectImg($li, 1);
						labelSelectImg($li, 1, this.files[0]);
					})
					//拖拽事件
					$listBox.find("li").unbind("mousedown").bind("mousedown", function (e) {
						var elem = $(this);
						if (e.target.nodeName == "LI" || e.target.nodeName == "P") {
							elem.shareDrag($listBox.find(".move-li"), $listBox.find("li").not(".move-li"), function () {
								resetList();
								$list.each(function (idx) {
									var $item = $(this);
									$item.find("input").trigger("blur");

									if ($item.find(".link-address .select").length) {
										//console.log($(this).find(".link-address .select"));
										$item.find(".link-address .select").trigger("click");
									}else{
										$item.find(".link-address label").eq(0).trigger("click");
									}
									//修改图片src
									var $img = $item.find("img");
									self.data.list[idx].src = $img.attr("src");
									self.data.list[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
									changeViewImg();
									//self.setMaxHeight(self, viewElem.find(".mc"));
								})
							},e);
						}
					})
					//外链关闭
					$listBox.find(".btn-oth-cel").unbind("click").bind("click", function () {
						var idx = $listBox.find(".btn-oth-cel").index(this);
						$listBox.find(".other-link-box").eq(idx).hide();
					})
					//外链确认
					$listBox.find(".btn-oth-ok").unbind("click").bind("click", function () {
						var idx = $list.find(".btn-oth-ok").index(this);
						var src = self.data.list[idx].link = $list.find(".other-link-box input").eq(idx).val();
						$list.find(".link-sname").eq(idx).find("em").text("外链|" + src);
						$list.find(".other-link-box").eq(idx).hide();
					})
					//选择链接
					var $linkAddress = $list.find(".link-address");
					var $sname = $list.find(".link-sname");
					zhx.other.select($linkAddress, function (data, e) {
						var $item = $(this);
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						$item.attr("data-val", data.value);
						var editTxt = function (b) {
							$item.find("strong").text(b ? "修改" : "设置链接到的页面地址");
						}
						var setName = function (name) {
							$sname.eq(idx).addClass("link-mar15").find("em").text(name);
						}
						var setLinkObj = function (obj) {
							if (obj) {
								setName(obj.typeName + "|" + obj.name);
								self.data.list[idx].link = obj.src;
								editTxt(1);
							}
						}
						switch (data.value) {
							case "-2":
								$sname.eq(idx).removeClass("link-mar15").find("em").text(data.text);
								editTxt(0);
								break;
							case "1":
								if (e.isTrigger) {
									var obj = {
										typeName: data.text,
										name: self.data.list[idx].name,
										src: self.data.list[idx].link
									}
									setLinkObj(obj);
								} else {
									zhx.dialog.selectMinPage(setLinkObj);
								}
								break;
							case "2":
								if (e.isTrigger) {
									var obj = {
										typeName: data.text,
										name: self.data.list[idx].name,
										src: self.data.list[idx].link
									}
									setLinkObj(obj);
								} else {
									zhx.dialog.selectGoodsSingleton(setLinkObj);
								}
								break;
							case "3":
								zhx.dialog.selectActivity(setLinkObj);
								break;
							case "5":
								$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
								editTxt(1);
								self.data.list[idx].link = zhx.config.store.mainPageUrl;
								break;
							case "7":
								var src = self.data.list[idx].link = $list.eq(idx).find(".other-link-box input").val();
								setName("外链|" + src);
								//trigger
								if (e.isTrigger) {
								} else {
									$list.find(".other-link-box").eq(idx).show();
								}
								editTxt(1);
								break;
						}
						self.data.list[idx].type = data.value;
						if(data.value>0){
							$li.find(".msg-link").hide();
						}else{
							$li.find(".msg-link").show();
						}
					});
					//点击事件
					$sname.find("em").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("em").index(this);
						if (self.data.list[idx].type == 7) {
							$list.find(".other-link-box").eq(idx).show();
						}
						//$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
					//删除
					$sname.find("i").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("i").index(this);
						$list.eq(idx).find(".other-link-box input").val("");
						$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
				}
				initLi();
				resetList();
				bindLiEvent();
				//选择图片
				var selectImg = function ($li, isAdd) {
					var idx = $list.index($li);
					zhx.dialog.imgList(function (list) {
						if (isAdd) {
							$li.find(".add-img").addClass("none");
							$li.find("cite").show();
						}
						var $img = list.eq(0).find("img");
						var src = $img.attr("src");
						$li.find("img").attr("src", src);
						self.data.list[idx].src = src;
						self.data.list[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
						//bindLiEvent();
						changeViewImg();
					}, 1);
				}
				var labelSelectImg = function ($li, isAdd, file) {
					var idx = $list.index($li);
					zhx.data.uploadImg(file).success(function (res) {
						if (res.status == 0) {
							var src = res.url;
							if (isAdd) {
								$li.find(".add-img").addClass("none");
								$li.find("cite").show();
								settingElem.find(".msg-img").eq(idx).hide();
							}
							$li.find("img").attr("src", src);
							self.data.list[idx].src = src;
							self.data.list[idx].size = {w: 0, h: 0};
							//bindLiEvent();
							changeViewImg();
						}else{
							zhx.box.msg(res.message);
						}
					}).error(function () {
						zhx.box.msg("上传失败！");
					});
				}
			},
			resetViewImg: function () {
				var html = [], self = this;
				$.each(self.data.list, function () {
					html.push(self.viewItem(this.src, this.title));
				});
				this.viewElem.find(".mc").html(html.join(" "));
			},
			//验证函数
			check: function () {
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var isSubmit = true, d = this.data;
				var $li = settingElem.find("li").not(".move-li");
				var msg_link = $li.find(".msg-link"), msg_img = $li.find(".msg-img");
				$.each(d.list, function (idx, el) {
					if (el.type > 0) {
						msg_link.eq(idx).hide();
					} else {
						isSubmit = false;
						msg_link.eq(idx).show();
					}
					if (el.src) {
						msg_img.eq(idx).hide();
					} else {
						isSubmit = false;
						msg_img.eq(idx).show();
					}
				})
				//zhx.activeView(this.view);
				return isSubmit;
			},
			edit: function (initData) {
				var d = initData;
				var tem_link = [-2, 1, 2, 5, 7];
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var $listBox = settingElem.find(".sin-img-list");
				var $list = $listBox.find("li").not(".move-li");
				//this.data.list = [];
				$.each(d.list, function (idx, el) {
					var $li = $list.eq(idx);
					if (el.type) {
						$li.find(".add-img").addClass("none");
						$li.find("cite").show();
						$li.find("img").attr("src", el.src);
						$li.find(".link-txt input").val(el.title).trigger("blur");
						if (el.type == 7) {
							//自定义外链
							$li.find(".other-link-box input").val(el.link);
							$li.find(".btn-oth-ok").trigger("click");
						}
						$li.find(".link-address").find("label").eq(tem_link.indexOf(parseInt(el.type))).trigger("click");
					}
				})
				this.resetViewImg();
			}
		}
	})
})(jQuery);
/*
 * des: 公告
 *
 * */
;(function ($) {
	zhx.addPlugin("notice", function () {
		return {
			name: "公告",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "sty-notice">');
				html.p('<div class = "mc"><p>公告：<span>请填写内容，如果过长，将会在手机上滚动显示</span></p></div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-notice" style="display: block">');
				html.p('<p><span>公告：</span><label class = "label-input"><input type = "text" maxlength="200" placeholder="请填写内容，如果过长，将会在手机上滚动显示"/></label>');
				html.p('</p>');
				html.p('<p class="msg msg-title"><em >内容不能为空！</em></p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				text: ""
			},
			init: function (viewElem, settingElem) {
				var self = this;
				settingElem.find(".label-input input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find("p span").text(val || "请填写内容，如果过长，将会在手机上滚动显示");
					self.data.text = val;
					if ($.trim(val)) {
						settingElem.find(".msg-title").hide();
					}
				})
			},
			check: function () {
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var isSubmit = true, d = this.data;
				var msg_title = settingElem.find(".msg-title");
				if (!$.trim(d.text)) {
					isSubmit = false;
					msg_title.show();
				} else {
					msg_title.hide();
				}
				return isSubmit;
			},
			edit: function (initData) {
				var settingElem = this.settingElem;
				settingElem.find(".label-input input").val(initData.text).trigger("blur");
			}
		}
	})
})(jQuery);
/*
 * des: 页面头部标题
 *
 * */
;(function ($) {
	zhx.addPlugin("pageTitle", function () {
		return {
			name: "页面头部标题",
			isDelete: 0,
			isRepeat: 0,
			isShowOp: 0,
			noView: 1,	//默认是否已存在( pageTitle 默认已存在)
			viewTemplate: function () {
				return ".p-title";
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-title">');
				html.p('<p><span><em>*</em>页面名称：</span><label class = "label-input page-name"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>页面描述：</span><label class = "label-input page-des"><input type = "text" maxlength = "20" placeholder="用户通过微信分享给朋友时，会自动显示页面描述"></label></p>');
				// html.p('<p><span>分类：</span><label class = "label-select label-box-select"><input type = "text" maxlength = "20">');
				// html.p('<a>');
				// html.p('<label data-val = "004">分类1</label>');
				// html.p('<label data-val = "005">分类2</label>');
				// html.p('<label data-val = "006">分类3</label>');
				// html.p('</a>');
				// html.p('</label></p>');
				html.p('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				title: "",
				des:"",
				bodyBg:"#ffffff"
			},
			init: function (viewElem, settingElem) {
				var self = this, titleStr = self.data.title;
				if (titleStr) {
					viewElem.find("h3").text(titleStr);
					settingElem.find(".page-name input").val(titleStr);
				}
				settingElem.find(".page-name input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find("h3").text(val);
					self.data.title = val;
					//console.log(titleStr===self.data.title);
				})
				settingElem.find(".page-des input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					self.data.des = val;
				})
				//背景色
				settingElem.find(".label-color input").bind("change", function () {
					zhx.config.root.css("background-color", this.value);
					//viewElem.find(".mc").css("background-color", this.value);
					self.data.bodyBg = this.value;
				});
				//背景色重置
				settingElem.find(".btn-reset").bind("click", function () {
					//viewElem.css("background-color", "#ffffff");
					settingElem.find(".label-color input").val("#ffffff");
					settingElem.find(".label-color input").trigger("change");
				})
			},
			
			edit:function (initData) {
				var d = $.extend({},this.data, initData);
				var viewElem = this.viewElem, settingElem = this.settingElem;
				settingElem.find(".page-name input").val(d.title).trigger('blur');
				settingElem.find(".page-des input").val(d.des).trigger('blur');
				settingElem.find(".label-color input").val(d.bodyBg).trigger("change");
				
			}
		}
	})
})(jQuery);
/*
 * des: 文本导航
 *
 * */
;(function ($) {
	zhx.addPlugin("textNav", function () {
		return {
			name: "文本导航",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "text-nav">');
				html.p('<div class = "mc">');
				html.p('<h3><span>点击编辑导航</span><i class = "i-right"></i></h3>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			viewItem: function (title) {
				return '<h3><span>' + (title || "点击编辑导航") + '</span><i class = "i-right"></i></h3>';
			},
			liTemplate: function (src) {
				var html = [];
				html.p('<li>');
				html.p('<p><span>导航名称：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>链接到：</span><label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.p('<a>');
				html.p('<label style="display: none" data-val="-2"></label>');
				html.p('<label data-val="1">微页面</label>');
				html.p('<label data-val="2">商品</label>');
				// html.p('<label data-val="3">营销活动</label>');
				html.p('<label data-val="5">店铺主页</label>');
				html.p('<label data-val="7">自定义外链</label>');
				html.p('</a><i class="i-icon"></i>');
				html.p('</label>');
				html.p('</p>');
				html.p('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.p('<i class="i-close">x</i>');
				html.p('</li>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-text-nav">');
				html.p('<ul class="stn-nav-list move-ul">');
				html.p('<li class="move-li"></li>');
				html.p('</ul>');
				html.p('<p class="nav-link"><a><i></i>添加一个文本导航</a></p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				linkList: []	//{title,type, src ,name}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $listBox = settingElem.find(".stn-nav-list"), $viewLinkBox = viewElem.find(".mc");
				var $list = $listBox.find("li").not(".move-li");
				var resetList = function () {
					$list = $listBox.find("li").not(".move-li");
				}
				var changeViewImg = function () {
					var html = [];
					$.each(self.data.linkList, function () {
						html.push(self.viewItem(this.title));
					});
					$viewLinkBox.html(html.join(" "));
					$viewLinkBox.find("h3").last().toggleClass("no-bor",!(self.data.linkList.length <= 1));
					if (self.data.linkList.length == 0) {
						$viewLinkBox.html(self.viewItem());
					}
				}
				//绑定li事件
				var bindLiEvent = function () {
					//关闭
					$listBox.find(".i-close").unbind("click").bind("click", function () {
						var $li = $(this).parent("li");
						var idx = $list.index($li);
						if (idx >= 0) {
							self.data.linkList.splice(idx, 1);
						}
						$li.remove();
						if (self.data.linkList.length < 20) {
							settingElem.find(".nav-link").show();
						}
						resetList();
						changeViewImg();
					});
					//标题
					$listBox.find(".link-txt input").unbind("blur").bind("blur", function () {
						var val = $(this).val() || " ";
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						self.data.linkList[idx].title = val;
						$viewLinkBox.find("h3").eq(idx).find("span").html(val);
					});
					//拖拽事件
					$listBox.find("li").unbind("mousedown").bind("mousedown", function (e) {
						var elem = $(this);
						if (e.target.nodeName == "P") {
							elem.shareDrag($listBox.find(".move-li"), $listBox.find("li").not(".move-li"), function () {
								resetList();
								$list.each(function () {
									$(this).find("input").trigger("blur");
									if ($(this).find(".link-address .select").length) {
										//console.log($(this).find(".link-address .select"));
										$(this).find(".link-address .select").trigger("click");
									}
								})
							},e);
						}
					})
					//外链关闭
					$listBox.find(".btn-oth-cel").unbind("click").bind("click", function () {
						var idx = $listBox.find(".btn-oth-cel").index(this);
						$listBox.find(".other-link-box").eq(idx).hide();
					})
					//外链确认
					$listBox.find(".btn-oth-ok").unbind("click").bind("click", function () {
						var idx = $list.find(".btn-oth-ok").index(this);
						var src = self.data.linkList[idx].src = $list.find(".other-link-box input").eq(idx).val();
						$list.find(".link-sname").eq(idx).find("em").text("外链|" + src);
						$list.find(".other-link-box").eq(idx).hide();
					})
					//选择链接
					var $linkAddress = $list.find(".link-address");
					var $sname = $list.find(".link-sname");
					zhx.other.select($linkAddress, function (data, e) {
						var $item = $(this);
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						$item.attr("data-val", data.value);
						var editTxt = function (b) {
							$item.find("strong").text(b?"修改":"设置链接到的页面地址");
						}

						var setName = function (name) {
							$sname.eq(idx).addClass("link-mar15").find("em").text(name);
						}
						var setLinkObj =function (obj) {
							if(obj){
								setName(obj.typeName+"|"+obj.name);
								self.data.linkList[idx].name = obj.name;
								self.data.linkList[idx].src = obj.src;
								editTxt(1);
							}
						}
						switch (data.value) {
							case "-2":
								$sname.eq(idx).removeClass("link-mar15").find("em").text(data.text);
								editTxt(0);
								break;
							case "1":
								if (e.isTrigger) {
									var obj = {
										typeName:data.text,
										name:self.data.linkList[idx].name,
										src:self.data.linkList[idx].src
									}
									setLinkObj(obj);
								} else {
									zhx.dialog.selectMinPage(setLinkObj);
								}
								break;
							case "2":
								if (e.isTrigger) {
									var obj = {
										typeName:data.text,
										name:self.data.linkList[idx].name,
										src:self.data.linkList[idx].src
									}
									setLinkObj(obj);
								} else {
									zhx.dialog.selectGoodsSingleton(setLinkObj);
								}

								break;
							case "3":
								zhx.dialog.selectActivity(setLinkObj);
								break;
							case "5":
								$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
								self.data.linkList[idx].src = zhx.config.store.mainPageUrl;
								editTxt(1);
								break;
							case "7":
								self.data.linkList[idx].src = $list.eq(idx).find(".other-link-box input").val();
								$sname.eq(idx).addClass("link-mar15").find("em").text("外链|" + self.data.linkList[idx].src);
								//trigger
								if (e.isTrigger) {
								} else {
									$list.find(".other-link-box").eq(idx).show();
								}
								editTxt(1);
								break;
						}
						self.data.linkList[idx].type = data.value;

					});
					//点击事件
					$sname.find("em").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("em").index(this);
						if (self.data.linkList[idx].type == 7) {
							$list.find(".other-link-box").eq(idx).show();
						}
						//$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
					//删除
					$sname.find("i").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("i").index(this);
						$list.eq(idx).find(".other-link-box input").val("");
						$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");

					})
				}
				settingElem.find(".nav-link").bind("click", function (e) {
					var html = self.liTemplate();
					$listBox.append(html);
					if (e.isTrigger) {
						self.data.linkList.push({uuid:self.data.oldList[self.data.linkList.length].uuid,title: " ",name:"", src: "", type: -1});
					}else{
						self.data.linkList.push({uuid:"",title: " ",name:"", src: "", type: -1});
					}

					if (self.data.linkList.length >= 20) {
						settingElem.find(".nav-link").hide();
					}
					$list = $listBox.find("li").not(".move-li");
					bindLiEvent();
					changeViewImg();
				})
			},
			edit:function (initData) {
				var d =  initData;
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var $listBox = settingElem.find(".stn-nav-list");
				var tem_link = [-2, 1, 2, 5, 7];
				this.data.linkList=[];
				this.data.oldList =initData.linkList;
				$.each(d.linkList,function(idx, el) {
					settingElem.find(".nav-link").trigger("click");
					$listBox.find(".link-txt input").eq(idx).val(el.title).trigger("blur");
					$listBox.find(".link-address").eq(idx).find("label").eq(tem_link.indexOf(parseInt(el.type))).trigger("click");
					if (el.type == 7) {
						//自定义外链
						settingElem.find(".other-link-box input").eq(idx).val(el.src);
						settingElem.find(".btn-oth-ok").eq(idx).trigger("click");
					}
				});
			}
		}
	})
})(jQuery);
/*
 * des: 标题
 *
 * */
;(function ($) {
	zhx.addPlugin("textTitle", function () {
		return {
			name: "标题",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "text-title">');
				html.p('<div class = "mc">');
				html.p('<div class = "panel-1">');
				html.p('<h3><span>点击编辑标题</span><label>-<a></a></label></h3>');
				html.p('<p class="tt-subtitle"><label></label></p>');
				html.p('</div>');
				html.p('<div class = "panel-2">');
				html.p('<h3><span>点击编辑标题</span></h3>');
				html.p('<p class="tt-subtitle clearfix"><label class="tt-date"></label> <label class="tt-author"></label> <a></a></p>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-text-title" style = "display: block">');
				html.p('<p><span><em>*</em>标题名：</span><label class = "label-input stt-title"><input type = "text" defaultValue="点击编辑标题" maxlength = "20"></label></p>');
				html.p('<p><em class="msg msg-title">标题不能为空！</em></p>');
				html.p('<p><span>标题模版：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" value = "tradition" name = "titleType" checked = "checked"/>传统样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "titleType" value = "wx"/>模仿微信图文页样式 <i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<div class="panel-1">');
				html.p('<p><span>副标题：</span><label class = "label-input stt-subtitle"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>显示：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" value = "left" name = "textAlign" checked = "checked"/>居左 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "textAlign" value = "center"/>居中<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "textAlign" value = "right"/>居右 <i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.p('<p class="nav-link"><a><i></i>添加一个文本导航</a></p>');
				html.p('<div class="link-text-box">');
				html.p('<p><span><em>*</em>名称：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span><em>*</em>链接：</span><label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address subtitle-link"><strong>设置链接到的页面地址</strong>');
				html.p('<a>');
				html.p('<label style="display: none" data-val="-2"></label>');
				html.p('<label data-val="1">微页面</label>');
				html.p('<label data-val="2">商品</label>');
				// html.p('<label data-val="3">营销活动</label>');
				html.p('<label data-val="5">店铺主页</label>');
				html.p('<label data-val="7">自定义外链</label>');
				html.p('</a><i class="i-icon"></i>');
				html.p('</label></p>');
				html.p('<i class="i-close">x</i>');
				html.p('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.p('</div>');
				html.p('</div>');
				html.p('<div class="panel-2">');
				html.p('<p><span>日期：</span><label class = "label-input stt-date"><input type = "text" maxlength = "20" onfocus = "WdatePicker()"></label></p>');
				html.p('<p><span>作者：</span><label class = "label-input stt-author"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>链接标题：</span><label class = "label-input stt-link-text"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>链接地址：</span> ');
				//html.p('<label class = "label-radio "><input type = "radio" value = "follow" name = "linkType"/>引导关注<i class = "i-icon"></i></label>');
				//html.p('<a class="set-fast-link">设置快速关注链接</a>')
			//	html.p('</p>');
				//html.p('<p><span></span>');
				html.p('<label class = "other-link-radio label-radio label-radio-active"><input type = "radio" value = "other"  checked = "checked" name = "linkType"/>其它链接<i class = "i-icon"></i></label>');
				html.p('<label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.p('<a>');
				html.p('<label style="display: none" data-val="-2"></label>');
				html.p('<label data-val="1">微页面</label>');
				html.p('<label data-val="2">商品</label>');
				// html.p('<label data-val="3">营销活动</label>');
				html.p('<label data-val="5">店铺主页</label>');
				html.p('<label data-val="7">自定义外链</label>');
				html.p('</a><i class="i-icon"></i>');
				html.p('</label>');
				html.p('</p>');
				html.p('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				title: "",	//标题
				titleType: "tradition",  //类型 常规 或 仿微信
				tradition: {
					hasLink: 0,	//是否有链接
					link: {
						text: "",
						name:"",
						type: "",
						src: ""
					},
					titleBg: "#ffffff",
					txtAlign: "left",	//align 样式
					subtitle: ""	//副标题
				},
				wx: {
					datetime: "",
					author: "",
					linkTitle: "",
					linkType: "other",	//follow other
					link: {
						type: "",
						name:"",
						src: ""
					}
				}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var tra = self.data.tradition, wx = self.data.wx;
				var $radioList = settingElem.find(".label-radio");
				settingElem.find(".stt-title input").bind("blur", function () {
					var $input = $(this), val = $input.val(), deVal = $input.attr("defaultValue");
					viewElem.find("h3 span").text(val || deVal);
					self.data.title = val;
					if($.trim(val)){
						settingElem.find(".msg-title").hide();
					}
				})
				settingElem.find(".stt-subtitle input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".panel-1 .tt-subtitle label").text(val);
					tra.subtitle = val;
				})
				//添加一个导航
				var $link = viewElem.find("h3 label");
				var $linkBox = settingElem.find(".link-text-box");
				//标题
				settingElem.find(".nav-link").bind("click", function () {
					var $box = $(this);
					$box.hide();
					$link.show();
					$linkBox.show();
					tra.hasLink = 1;
				})
				//背景色
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".mc").css("background-color", this.value);
					tra.titleBg = this.value;
				});
				//背景色重置
				settingElem.find(".btn-reset").bind("click", function () {
					//viewElem.css("background-color", "#ffffff");
					settingElem.find(".label-color input").val("#ffffff");
					settingElem.find(".label-color input").trigger("change");
				})
				//关闭链接
				settingElem.find(".i-close").bind("click", function () {
					settingElem.find(".nav-link").show();
					$link.hide();
					$linkBox.hide();
					tra.hasLink = 0;
				})
				//链接
				settingElem.find(".link-txt input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find("h3 label a").text(val);
					tra.link.text = val;
				})
				//panel - 2
				//外链关闭
				settingElem.find(".btn-oth-cel").unbind("click").bind("click", function () {
					var idx = settingElem.find(".btn-oth-cel").index(this);
					settingElem.find(".other-link-box").eq(idx).hide();
				})
				//外链确认
				settingElem.find(".btn-oth-ok").unbind("click").bind("click", function () {
					var idx = settingElem.find(".btn-oth-ok").index(this);
					var src = settingElem.find(".other-link-box input").eq(idx).val();
					if (idx==0) {
						//tra.link.type = 7;
						tra.link.src = src;
					} else {
						//wx.link.type = 7;
						wx.link.src = src;
					}
					settingElem.find(".link-sname").eq(idx).find("em").text("外链|" + src);
					settingElem.find(".other-link-box").eq(idx).hide();
				})
				var $linkAddress = settingElem.find(".link-address");
				var $sname = settingElem.find(".link-sname");
				zhx.other.select($linkAddress, function (data, e) {
					var $item = $(this);
					$item.attr("data-val", data.value);
					//$item.find("strong").text(data.text);
					var idx = $linkAddress.index($item);
					var src = "";
					//console.log(data.value)
					var editTxt = function (b) {
						$item.find("strong").text(b ? "修改" : "设置链接到的页面地址");
					}
					var setName = function (name) {
						$sname.eq(idx).addClass("link-mar15").find("em").text(name);
					}
					var setLinkObj = function (obj) {
						if (obj) {
							setName(obj.typeName + "|" + obj.name);
							if ($item.hasClass("subtitle-link")) {
								tra.link.type = data.value;
								tra.link.name = obj.name;
								tra.link.src = obj.src;
							} else {
								wx.link.type = data.value;
								wx.link.name = obj.name;
								wx.link.src = obj.src;
							}
							editTxt(1);
						}
					}
					switch (data.value) {
						case "-2":
							$sname.eq(idx).removeClass("link-mar15").find("em").text(data.text);
							editTxt(0);
							break;
						case "1":
							if (e.isTrigger) {
								var obj = {
									typeName: data.text,
									name: wx.link.name,
									src: wx.link.src
								}
								if ($item.hasClass("subtitle-link")) {
									if (tra.link) {
										obj.name = tra.link.name;
										obj.src = tra.link.src;
									}
								}
								setLinkObj(obj);
							} else {
								zhx.dialog.selectMinPage(setLinkObj);
							}
							break;
						case "2":
							if (e.isTrigger) {
								var obj = {
									typeName: data.text,
									name: wx.link.name,
									src: wx.link.src
								}
								if ($item.hasClass("subtitle-link")) {
									if (tra.link) {
										obj.name = tra.link.name;
										obj.src = tra.link.src;
									}
								}
								setLinkObj(obj);
							} else {
								zhx.dialog.selectGoodsSingleton(setLinkObj);
							}
							break;
						case "3":
							zhx.dialog.selectActivity(setLinkObj);
							break;
						case "5":
							$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
							if ($item.hasClass("subtitle-link")) {
								tra.link.type = data.value;
								tra.link.src = zhx.config.store.mainPageUrl;
							} else {
								wx.link.type = data.value;
								wx.link.src = zhx.config.store.mainPageUrl;
							}
							editTxt(1);
							break;
						case "7":
							src = settingElem.find(".other-link-box input").eq(idx).val();
							$sname.eq(idx).addClass("link-mar15").find("em").text("外链|" + src);
							if ($item.hasClass("subtitle-link")) {
								tra.link.type = data.value;
								tra.link.src = src;
							} else {
								wx.link.type = data.value;
								wx.link.src = src;
							}
							//trigger
							if (e.isTrigger) {
							} else {
								settingElem.find(".other-link-box").eq(idx).show();
							}
							editTxt(1);
							break;
					}
				});
				//点击事件
				$sname.find("em").unbind("click").bind("click", function () {
					//位置改变---重新获取dom元素
					$sname = settingElem.find(".link-sname");
					var idx = $sname.find("em").index(this);
					var type;
					if (idx) {
						type = wx.link.type;
					} else {
						type = tra.link.type;
					}
					if (type == 7) {
						settingElem.find(".other-link-box").eq(idx).show();
					}
					//$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
				})
				//删除
				$sname.find("i").unbind("click").bind("click", function () {
					//位置改变---重新获取dom元素
					$sname = settingElem.find(".link-sname");
					var idx = $sname.find("i").index(this);
					settingElem.find(".other-link-box input").eq(idx).val("");
					settingElem.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
				})
				settingElem.find(".stt-date input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-date").text(val);
					wx.datetime = val;
				})
				settingElem.find(".stt-author input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-author").text(val);
					wx.author = val;
				})
				settingElem.find(".stt-link-text input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-subtitle a").text(val);
					wx.linkTitle = val;
				})
				//
				var panelShow = function (idx) {
					viewElem.find(".panel-" + idx).show();
					settingElem.find(".panel-" + idx).show();
				}
				var panelHide = function (idx) {
					viewElem.find(".panel-" + idx).hide();
					settingElem.find(".panel-" + idx).hide();
				}
				zhx.other.radio($radioList, function (type, value) {
					switch (type) {
						case "titleType":
							self.data.titleType = value;
							if (value == "tradition") {
								panelShow(1);
								panelHide(2);
								settingElem.find(".label-color input").trigger("change");
							} else {//wx
								panelHide(1);
								panelShow(2);
								viewElem.find(".mc").removeAttr("style");
							}
							break;
						case "textAlign":
							var alignClass = {
								"left": "txt-left",
								"center": "txt-center",
								"right": "txt-right"
							};
							zhx.changeClass(viewElem.find(".panel-1"), alignClass, value);
							tra.txtAlign = value;
							break;
						case "linkType":
							wx.linkType = value;
							break;
					}
				});
			},
			check: function () {
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var isSubmit = true, d = this.data;
				var msg_title = settingElem.find(".msg-title");
				if (!$.trim(d.title)) {
					isSubmit = false;
					msg_title.show();
				} else {
					msg_title.hide();
				}
				return isSubmit;
			},
			edit: function (initData) {
				var d = $.extend({}, this.data, initData);
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var tem_link = [-2, 1, 2, 5, 7];
				settingElem.find(".stt-title input").val(d.title).trigger("blur");
				if (d.titleType == "tradition") {
					//tradition
					settingElem.find(".stt-subtitle input").val(d.tradition.subtitle).trigger("blur");
					var alignList = ["left", "center", "right"];
					settingElem.find(".panel-1 .label-radio").eq(alignList.indexOf(d.tradition.txtAlign)).trigger("click");
					settingElem.find(".label-color input").val(d.tradition.titleBg).trigger("change");
					if (d.tradition.hasLink) {
						settingElem.find(".nav-link").trigger("click");
						settingElem.find(".link-txt input").val(d.tradition.link.text).trigger("blur");
						settingElem.find(".panel-1 .link-address label").eq(tem_link.indexOf(parseInt(d.tradition.link.type))).trigger("click");
						if (d.tradition.link.type == 7) {
							//自定义外链
							settingElem.find(".panel-1 .other-link-box input").val(d.tradition.link.src);
							settingElem.find(".panel-1 .btn-oth-ok").trigger("click");
						}
					}
				} else {
					//wx
					settingElem.find(".label-radio").eq(1).trigger("click");
					settingElem.find(".stt-date input").val(d.wx.datetime).trigger("blur");
					settingElem.find(".stt-author input").val(d.wx.author).trigger("blur");
					settingElem.find(".stt-link-text input").val(d.wx.linkTitle).trigger("blur");
					if (d.wx.linkType == "other") {
						settingElem.find(".other-link-radio ").trigger("click");
						if (d.wx.link.type == 7) {
							//自定义外链
							settingElem.find(".panel-2 .other-link-box input").val(d.wx.link.src);
							settingElem.find(".panel-2 .btn-oth-ok").trigger("click");
						}
						settingElem.find(".panel-2 .link-address label").eq(tem_link.indexOf(parseInt(d.wx.link.type))).trigger("click");
					}
				}
			}
		}
	})
})(jQuery);
;(function () {
	$.extend(zhx, {
		init: function (list) {
			zhx.createOp();
			zhx.bindOpEvent();
			if (list && list.length) {
				zhx.resetInit(list);
			}else{
				zhx.plugins["pageTitle"].create("", {title: "店铺主页"});
			}
			zhx.activeView(zhx.holdPluginList[0].view);
		},
		resetInit: function (list) {
			$.each(list, function (idx, item) {
				var p = zhx.plugins[item.key].create("", item);
				p.edit&&p.edit(item);
			})
		}
	});
})();







