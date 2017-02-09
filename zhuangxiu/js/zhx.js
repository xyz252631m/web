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
		}
		html.push('</div>');
		return html.join(" ");
	}

	function plugin(key) {
		$.extend(this, {
			//initData 设定初始值（方式1 初始化模板） //方式2 为edit方法，修改模板
			create: function (afterElem, initData) {
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
				if (!this.noView) {
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
				zhx.pluginList.push(item);
				this.init.call(item, elem, settingElem);
				if (this.noView) {
					zhx.bindEditEvent(elem);
				} else {
					zhx.bindMousedownEvent(elem);
					zhx.bindInitEvent(elem);
				}
				zhx.resetPrivewList();
				//zhx.dataList.push(item.data);
				//zhx.activeView(elem);
				return item;
			},
			showEdit: function (id, top) {
				zhx.getEditBox.css("marginTop", top);
				zhx.showSetting("set_" + id);
			}
		})
	}

	function radioBindClick($radio, radioObj, type, change) {
		$radio.unbind("click.label").bind("click.label", function () {
			var $item = $(this).find("input");
			var list = radioObj[type];
			$.each(list, function () {
				this.removeClass("label-radio-active");
				this.find("input").attr("checked", "");
			})
			$radio.addClass("label-radio-active");
			$item.attr("checked", "checked");
			change && change.call($item, type, $item.val());
			return false;
		})
	}

	var selectOption = {
		bindList: null,  //绑定list数据
		change: null,	//更改时触发事件
		isValue: false,	//传值方式 默认为text(text,value)
		init: null  		//初始化函数
		//list: [], // 列表
		//selectItem: {}, // 选中item
		//saveItem: null
	}
	var zhx = {
		ac: "active",
		plugins: {},	//所有插件列表
		pluginList: [],	//插件实例化列表
		removePluginItem: function (id) {
			var index = this.getPluginItemIndex(id);
			if (~index) {
				this.pluginList[index].destroy&&this.pluginList[index].destroy();
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
		addPlugin: function (key, fn) {
			var pl = new fn();
			plugin.prototype = pl;
			var tans = new plugin(key, pl);
			this.plugins[key] = tans;
		},
		getClassOp: function (b) {
			return (b) ? "removeClass" : "addClass";
		},
		classOp: function ($elem, b, cls) {
			$elem[zhx.getClassOp(!b)](cls || zhx.ac);
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
		other: {

			radio: function ($list, change) {
				var radioObj = {};
				$list.each(function () {
					var $item = $(this);
					var type = $item.find("input").attr("name");
					if (!radioObj[type]) {
						radioObj[type] = [];
					}
					radioObj[type].push($item);
					radioBindClick($item, radioObj, type, change);
				})
			},
			checkbox: function ($list, callback) {
				$list.unbind("click.label").bind("click.label", function () {
					var $item = $(this), $chb = $item.find("input");
					var checked = $chb.prop("checked");
					if (checked) {
						$item.removeClass("label-checkbox-active");
					} else {
						$item.addClass("label-checkbox-active");
					}
					var type = $chb.attr("name");
					$item.find("input").prop("checked", !checked);
					callback && callback.call($item.find("input"), type, !checked);
					return false;
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
						change && change.call($item, {value: val, text: text},e);
						return false;
					})
					//if(isIE6){
					//	setMaxHeight($item);
					//}
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
	zhx.config = {
		root: $(".preview"),
		editRoot: $(".setContent"),
		editClassName:"active",
		initData:{
			pageTitle:{
				title:"店铺主页"
			}
		},
		plugin:["editor","hr","goodsList","textTitle","imgAd","textNav","imgNav","goodsSearch","goods","notice"]
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
				var $btn = $(this);
				var $plu = $btn.parent().parent();
				var id = $plu.attr("id");
				var elem = $plu.prev();
				//判断是否为第一个
				if (elem.hasClass("move-box")) {
					zhx.getEditBox.hide();
				} else {
					zhx.activeView(elem);
				}
				$plu.remove();
				$("#set_" + id).remove();
				zhx.removePluginItem(id);
				zhx.resetPrivewList();
				return;
				var res = confirm("确认删除吗？");
				if (res) {
				}
			});
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
			id && zhx.plugins[type].showEdit(id, item[0].offsetTop);
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
		submit: null//提交按钮方法
	};
	var $shade = $(".xui-shade");
	var idx = 10000;

	function dialog_resize($node, flag) {
		var num = flag || 0;
		var width = document.documentElement.clientWidth || document.documentElement.offsetWidth,
			height = document.documentElement.clientHeight || document.documentElement.offsetHeight;
		if ($node) {
			$node.css({
				top: ((height - $node.height() - num) / 2) + "px",
				left: ((width - $node.width() - num) / 2) + "px"
			});
		}
	}

	function template(str) {
		var html = [];
		html.push('<div class = "xui-flower none">');
		html.push('<a class = "flower-close">x</a>');
		html.push('<div class = "flower-main">');
		html.push(str);
		html.push('</div>');
		html.push('</div>');
		return html.join(" ");
	}

	$.fn.extend({
		//弹层隐藏
		flowerHide: function () {
			var $node = $(this);
			var idx = $node.attr("data-idx");
			$(window).unbind("resize.flower" + idx);
			$node.find(".flower-close").unbind("click.flower");
			$node.find(".box-btn-close").unbind("click.flower");
			$node.find(".box-btn-submit").unbind("click.flower");
			$node.hide();
			if (!$(".xui-flower:visible").length) {
				$shade.hide();
			}
			return $node;
		}
	});
	$.extend(zhx.box, {
			show: function (html, init, option) {
				var opt = $.extend({}, defaults, {init: init}, option);
				var $node = $(template(html));
				idx++;
				//if ($.browser.msie) {
				//	var domHeight = document.body.scrollHeight, domWidth = document.body.scrollWidth, clientHeight = document.documentElement.clientHeight || document.documentElement.offsetHeight;
				//	$shade.css({
				//		width: domWidth,
				//		height: Math.max(domHeight, clientHeight)
				//	})
				//}
				if (opt.id) {
					$node.attr("id", +"box_" + opt.id);
				}
				$node.attr("data-idx", idx);
				$shade.show();
				$(document.body).append($node);
				dialog_resize($node);
				opt.init && opt.init($node);
				$node.show();
				//关闭
				$node.find(".flower-close").bind("click.flower", function () {
					opt.cancel && opt.cancel.call(this, $node);
					$node.flowerHide();
				})
				$node.find(".box-btn-close").bind("click.flower", function () {
					opt.cancel && opt.cancel.call(this, $node);
					$node.flowerHide();
				})
				//提交
				$node.find(".box-btn-submit").bind("click.flower", function () {
					opt.submit && opt.submit.call(this, $node);
				})
				$(window).bind("resize.flower" + idx, function () {
					dialog_resize($node);
				})
				return $node;
			},
			showById: function (id) {
				$shade.show();
				var box = $("#box_" + id);
				if (box.length) {
					box.show();
					dialog_resize(box);
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
			name: "banner",
			isRepeat: 0,
			isShowOp: 0,
			isDelete: 0,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "ss-banner" style = "display: block">');
				html.push('<div class = "mc">');
				html.push('<div class="banner-bg">');
				html.push('<div class="ba-logo">');
				html.push('<img src = "../images/tem/logo.webp" alt = "">');
				html.push('</div>');
				html.push('<div class="ba-store-name">店铺名称</div>');
				html.push('</div>');
				html.push('<div class="banner-menu">');
				html.push('<ul>');
				html.push('<li><a><span>0</span><span class="li-tl">全部商品</span></a></li>');
				html.push('<li><a><span>0</span><span class="li-tl">上新商品</span></a></li>');
				html.push('<li><a><span><i class="i-user"></i></span><span class="li-tl">我的订单</span></a></li>');
				html.push('</ul>');
				html.push('</div>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-banner">');
				html.push('<p><span>背景图片：</span><a class = "select-img">选择图片</a></p>');
				html.push('<p class="p-tip"><span>&nbsp;</span>最佳尺寸：640 x 200 像素。</p>');
				html.push('<p class="p-tip"><span>&nbsp;</span>尺寸不匹配时，图片将被压缩或拉伸以铺满画面。</p>');
				html.push('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.push('<p class="sb-logo"><span>店铺Logo：</span><img width="80" height="80"/><a class="sb-edit-logo">修改店铺Logo</a></p>');
				html.push('</div>');
				return html.join(" ");
			},
			data:{
				bgColor:"#F02D45",
				bgImgSrc:"",
				bgImgSize:{},
				logoSrc:"",
				logoSize:{}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var changeViewImg = function () {
					if (self.data.bgImgSrc) {
						viewElem.find(".banner-bg").css("background-image","url('"+self.data.bgImgSrc+"')");
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

				settingElem.find(".select-img").bind("click",function () {
					var $a = $(this);
					zhx.dialog.imgList(function (list) {
						var $img = list.eq(0).find("img");
						var src = $img.attr("src");
						self.data.bgImgSrc = src;
						self.data.bgImgSize = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
						changeViewImg();
						$a.text("修改");
					}, 1);
				})
				//修改LOGO
				settingElem.find(".sb-edit-logo").bind("click",function () {




				})
			},edit:function (initData) {
				this.settingElem.find(".label-color input").val(initData.bgColor);
				this.settingElem.find(".label-color input").trigger("change");


				
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
	var template={
		imgList:function () {
			var html = [];
			html.push('<div class = "box-img-list">');
			html.push('<div class = "img-tab">');
			html.push('<label class="search-img"><input type = "text" placeholder="搜索"/></label>');
			html.push('<span class = "active">我的图片</span><span>图标库</span>');
			html.push('</div>');
			html.push('<div class = "img-con">');
			html.push('<div class = "group-list">');
			html.push('<p class = "active"><a>未分组</a></p>');
			html.push('<p><a>未分组1</a></p>');
			html.push('<p><a>未分组2</a></p>');
			html.push('');
			html.push('</div>');
			html.push('<div class = "list">');
			html.push('<ul>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem01.jpg"/>');
			html.push('<p>順豐到付</p>');
			html.push('<cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem03.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem01.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem03.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem02.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem04.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('</ul>');
			html.push('<p class = "state-bar">');
			html.push('<a class = "link-upload">上传图片</a>');
			html.push('');
			html.push('<span class = "page-nubmer">');
			html.push('<a>上一页</a>');
			html.push('<a>1</a><a>2</a><a>3</a>');
			html.push('<label><input class = "go-page" type = "text"/>/11页</label>');
			html.push('<a>下一页</a>');
			html.push('</span>');
			html.push('<span>共3条，每页16条</span>');
			html.push('</p>');
			html.push('</div>');
			html.push('</div>');
			html.push('<div class = "btn-list">');
			html.push('<a>确认</a>');
			html.push('</div>');
			html.push('</div>');
			return html.join(" ");
		},
		selectGoods:function () {

			return $("#test").html();
		}
	}
	$.extend(zhx.dialog, {
		imgList:function (callback,isSingle) {
			zhx.box.show(template.imgList(), function ($box) {
				var $submit = $box.find(".btn-list a");
				var $tab = $box.find(".group-list p"),$selectElem;
				$tab.bind("click", function () {
					zhx.tabChangeClass($tab, $(this), zhx.ac);
				})
				var bindLiClick = function () {
					var $list = $box.find(".list li");
					/*是否为单选*/
					if(isSingle){
						$list.bind("click", function () {
							var $item = $(this);
							zhx.tabChangeClass($list,$item);
							$selectElem = $box.find(".list ul .active");
							zhx.classOp($submit, $selectElem.length);
						})
					}else {
						$list.bind("click", function () {
							var $item = $(this);
							$item.toggleClass(zhx.ac);
							$selectElem = $box.find(".list ul .active");
							zhx.classOp($submit, $selectElem.length);
						})
					}
				}
				bindLiClick();
				$submit.bind("click",function () {
					if($submit.hasClass(zhx.ac)){
						callback&&callback.call($box,$selectElem);
						$box.flowerHide();
					}
				})
			});

		},
		selectGoods:function () {
			zhx.box.show(template.selectGoods(), function ($box) {

			});
		}




	});
})(jQuery);
/*
 * des: banner and logo
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
				html.push('<div class = "sty-editor">');
				html.push('<div class = "mc"><div class="ed-main-txt">点击编辑"富文本"内容</div></div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function (data) {
				var html = [];
				html.push('<div class = "set-sty-editor" style="display: block">');
				html.push('<p><span class="sp-label">颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class="btn-reset" type="button" value="重置"/>');
				html.push('<label class="label-checkbox"><input type="checkbox"/>全屏显示<i class = "i-icon"></i></label>');
				html.push('</p>');
				data.editorId = new Date().getTime() + 100;
				console.log(data.editorId);
				html.push('<script id="editor_' + data.editorId + '" type="text/plain"></script>');
				html.push('</div>');
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
					zhx.classOp(viewElem.find(".mc"), check, "full");
					self.data.isFull = check;
				});
			},
			edit: function (initData) {
				$.extend(this.data, initData);
				var data = this.data;
				var editor = UE.getEditor('editor_' + data.editorId);
				editor.addListener('ready', function ( ) {
					//settingElem.find("#editor").removeAttr("style")
					editor.setContent(data.html);
				});


			},
			destroy: function () {
				UE.getEditor('editor_' + this.data.editorId).destroy();
			}
		}
	})
})(jQuery);
/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("goods", function () {
		return {
			name: "商品",
			isDelete:1,	
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "goods-list goods-big" style="display: block">');
				html.push('<div class = "mc">');
				html.push('<ul class="clearfix card buy-4">');
				html.push('<li class="li-1">');
				html.push('<a  class = "goods-img " href = "">');
				html.push('<img src = "../images/goods_bg_01.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥65.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥65</strong>');
				html.push('<del>原价：¥70.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-2">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_02.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥75.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥75</strong>');
				html.push('<del>原价：¥90.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-3">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_03.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥265.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥265</strong>');
				html.push('<del>原价：¥270.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-4">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_04.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥165.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥165</strong>');
				html.push('<del>原价：¥170.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('</ul>');
				html.push('</div>');

				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-goods-list set-goods">');
				html.push('<div class="sel-list clearfix"><span>选择商品：</span>');



				html.push('<ul class="clearfix">');
				html.push('');
				html.push('');
				html.push('');
				html.push('<li class="li-add"><a class="btn-add-goods"><i></i></a></li>');
				html.push('</ul>');

				html.push('</div>');
				html.push('<p class="list-style"><span>列表样式：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" name = "listStyle" value = "big" checked = "checked"/>大图<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "bigAndSmall"/>一大两小<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "detail"/>详细列表<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('');
				html.push('<div class = "detail-info dta-big">');
				html.push('<p class="show-type"><label class = "label-radio label-radio-active"><input type = "radio" name = "cardStyle" value = "card" checked = "checked"/>卡片样式<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "waterfall"/>瀑布流<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "simple"/>极简样式<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "promotion"/>促销<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<div class = "style-detail card">');
				html.push('<p class="buy-chk"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showBuy" checked="checked"/>显示购买按钮<i class = "i-icon"></i></label></p>');
				html.push('<p class="buy-btn-style">');
				html.push('<label class = "label-radio "><input type = "radio" value = "1" name = "buyStyle"/>样式1<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "2"/>样式2<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "3"/>样式3<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" name = "buyStyle" value = "4"  checked = "checked"/>样式4<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p class="show-name"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showName" checked="checked"/>显示商品名 <i class = "i-icon"></i></label></p>');
				html.push('<p class="show-des"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showDes" checked="checked"/>显示商品简介 <i class = "i-icon"></i></label></p>');
				html.push('<p class="show-price"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showPrice" checked="checked"/>显示价格<i class = "i-icon"></i></label></p>');
				html.push('</div>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				num: 0,				//显示的数量
				pattern: "big",		//模式	[大图，小图，两大一小，详细]
				type: "card",		//类型	[卡片，瀑布，极简，促销]
				showBuy: 1,			//是否显示购买按钮
				showName: 1,			//是否显示商品名称
				showDes: 1,			//是否显示商品描述
				showPrice: 1,		//是否显示商品价格
				buyStyle: 4			//购买按钮风格 0为不显示
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $ul = viewElem.find("ul");
				var $radioList = settingElem.find(".label-radio");
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
				zhx.other.radio($radioList, function (type, value) {
					switch (type) {
						case "listStyle":
							self.data.pattern = value;
							zhx.changeClass(viewElem, listClass, value);
							zhx.changeClass($detailInfo, detailClass, value);
							zhx.resetHeight();

							if(settingElem.find(".show-type .label-radio-active").is(":hidden")){
								settingElem.find(".show-type .label-radio").eq(0).trigger("click");
							}
							break;
						case "cardStyle":
							self.data.type = value;
							zhx.changeClass($ul, listStyle, value);
							zhx.changeClass($styleOther, detailStyle, value);
							//详细列表-极简风格
							if (self.data.pattern == "detail" && value == "simple") {
								if (self.data.buyStyle == 3) {
									settingElem.find(".buy-btn-style .label-radio").eq(0).trigger("click");
								}
							}
							break;
						case "buyStyle":
							if (self.data.showBuy) {
								zhx.changeClass($ul, buyClass, value);
							}
							self.data.buyStyle = value;
							break;
					}
					viewElem.find(".mc p").css("border-bottom-style", $(this).val());
				});
				//购买选项
				var $chkList = settingElem.find(".label-checkbox");
				//elem
				var $buyChk = settingElem.find(".buy-chk");
				var $buyStyle = settingElem.find(".buy-btn-style");
				zhx.other.checkbox($chkList, function (type, value) {
					switch (type) {
						case "showBuy":
							self.data.showBuy = value;
							if (value) {
								zhx.changeClass($ul, buyClass, self.data.buyStyle);
								$buyStyle.removeClass("none");
							} else {
								//self.data.buyStyle = 0;
								zhx.changeClass($ul, buyClass, 0);
								$buyStyle.addClass("none");
							}
							break;
						case "showName":
							self.data.showName = value;
							viewElem.find(".goods-name")[zhx.getClassOp(value)]("none");
							if (self.data.type == "waterfall") {
								viewElem.find(".info-box")[zhx.getClassOp(value)]("h-25");
							}
							break;
						case "showDes":
							self.data.showDes = value;
							//商品描述--只有大图模式可设置
							viewElem.find(".goods-des")[zhx.getClassOp(value)]("none");
							viewElem.find(".info-box")[zhx.getClassOp(value)]("float-info");
							break;
						case "showPrice":
							self.data.showPrice = value;
							viewElem.find(".goods-price")[zhx.getClassOp(value)]("none");
							break;
					}
					//瀑布风格时进行判断
					if (self.data.type == "waterfall") {
						//只有按钮时
						viewElem.find(".info-box")[zhx.getClassOp(!(!self.data.showName && !self.data.showPrice && self.data.showBuy))]("pos-box");
						viewElem.find(".info-box")[zhx.getClassOp(!(!self.data.showName && !self.data.showPrice && !self.data.showBuy))]("h-none");
					}
				});
				//添加图片
				settingElem.find(".li-add a").bind("click",function () {



				})

				//选择商品
				settingElem.find(".btn-add-goods").bind("click",function () {
					zhx.dialog.selectGoods(function (list) {
						console.log(list);
						//var html = [];
						//$.each(list, function () {
						//	var $img = $(this).find("img");
						//	var src = $img.attr("src");
						//	self.data.imgList.push({
						//		src: src,
						//		link: "",
						//		title: "",
						//		size: {w: $img[0].naturalWidth, h: $img[0].naturalHeight}
						//	});
						//	html.push(self.liTemplate(src));
						//})
						//$listBox.append(html.join(" "));
						//resetList();
						//bindLiEvent();
						//changeViewImg();
						//self.setMaxHeight(self, viewElem.find(".mc"));
					})
				})
			}
		}
	})
})(jQuery);
/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("goodsList", function () {
		return {
			name: "商品列表",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "goods-list goods-big" style="display: block">');
				html.push('<div class = "mc">');
				html.push('<ul class="clearfix card buy-4">');
				html.push('<li class="li-1">');
				html.push('<a  class = "goods-img " href = "">');
				html.push('<img src = "../images/goods_bg_01.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥65.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥65</strong>');
				html.push('<del>原价：¥70.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-2">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_02.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥75.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥75</strong>');
				html.push('<del>原价：¥90.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-3">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_03.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥265.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥265</strong>');
				html.push('<del>原价：¥270.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-4">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_04.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥165.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥165</strong>');
				html.push('<del>原价：¥170.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('</ul>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-goods-list">');
				html.push('<p class="r-list"><span>商品来源：</span><label></label><a>选择商品来源</a></p>');
				html.push('<p class="r-tip"><span></span><label>选择商品来源后，左侧实时预览暂不支持显示其包含的商品数据</label></p>');
				html.push('<p class="show-num"><span>显示个数：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" name = "g_showNum" value = "6" checked = "checked"/>6 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "g_showNum" value = "12"/>12<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "g_showNum" value = "18"/>18 <i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('');
				html.push('<p class="list-style"><span>列表样式：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" name = "listStyle" value = "big" checked = "checked"/>大图<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "bigAndSmall"/>一大两小<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "detail"/>详细列表<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('');
				html.push('<div class = "detail-info dta-big">');
				html.push('<p class="show-type"><label class = "label-radio label-radio-active"><input type = "radio" name = "cardStyle" value = "card" checked = "checked"/>卡片样式<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "waterfall"/>瀑布流<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "simple"/>极简样式<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "promotion"/>促销<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<div class = "style-detail card">');
				html.push('<p class="buy-chk"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showBuy" checked="checked"/>显示购买按钮<i class = "i-icon"></i></label></p>');
				html.push('<p class="buy-btn-style">');
				html.push('<label class = "label-radio "><input type = "radio" value = "1" name = "buyStyle"/>样式1<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "2"/>样式2<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "3"/>样式3<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" name = "buyStyle" value = "4"  checked = "checked"/>样式4<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p class="show-name"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showName" checked="checked"/>显示商品名 <i class = "i-icon"></i></label></p>');
				html.push('<p class="show-des"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showDes" checked="checked"/>显示商品简介 <i class = "i-icon"></i></label></p>');
				html.push('<p class="show-price"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showPrice" checked="checked"/>显示价格<i class = "i-icon"></i></label></p>');
				html.push('</div>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				num: 6,				//显示的数量
				pattern: "big",		//模式	[大图，小图，两大一小，详细]
				type: "card",		//类型	[卡片，瀑布，极简，促销]
				showBuy: 1,			//是否显示购买按钮
				showName: 1,			//是否显示商品名称
				showDes: 1,			//是否显示商品描述
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
				zhx.other.radio($radioList, function (type, value) {
					switch (type) {
						case "g_showNum":
							self.data.num = value;
							break;
						case "listStyle":
							self.data.pattern = value;
							zhx.changeClass(viewElem, listClass, value);
							zhx.changeClass($detailInfo, detailClass, value);
							zhx.resetHeight();
							if (settingElem.find(".show-type .label-radio-active").is(":hidden")) {
								settingElem.find(".show-type .label-radio").eq(0).trigger("click");
							}
							break;
						case "cardStyle":
							self.data.type = value;
							zhx.changeClass($ul, listStyle, value);
							zhx.changeClass($styleOther, detailStyle, value);
							//详细列表-极简风格
							if (self.data.pattern == "detail" && value == "simple") {
								if (self.data.buyStyle == 3) {
									settingElem.find(".buy-btn-style .label-radio").eq(0).trigger("click");
								}
							}
							break;
						case "buyStyle":
							if (self.data.showBuy) {
								zhx.changeClass($ul, buyClass, value);
							}
							self.data.buyStyle = value;
							break;
					}
					viewElem.find(".mc p").css("border-bottom-style", $(this).val());
				});
				//购买选项
				var $chkList = settingElem.find(".label-checkbox");
				//elem
				var $buyChk = settingElem.find(".buy-chk");
				var $buyStyle = settingElem.find(".buy-btn-style");
				zhx.other.checkbox($chkList, function (type, value) {
					switch (type) {
						case "showBuy":
							self.data.showBuy = value;
							if (value) {
								zhx.changeClass($ul, buyClass, self.data.buyStyle);
								$buyStyle.removeClass("none");
							} else {
								//self.data.buyStyle = 0;
								zhx.changeClass($ul, buyClass, 0);
								$buyStyle.addClass("none");
							}
							break;
						case "showName":
							self.data.showName = value;
							viewElem.find(".goods-name")[zhx.getClassOp(value)]("none");
							if (self.data.type == "waterfall") {
								viewElem.find(".info-box")[zhx.getClassOp(value)]("h-25");
							}
							break;
						case "showDes":
							self.data.showDes = value;
							//商品描述--只有大图模式可设置
							viewElem.find(".goods-des")[zhx.getClassOp(value)]("none");
							viewElem.find(".info-box")[zhx.getClassOp(value)]("float-info");
							break;
						case "showPrice":
							self.data.showPrice = value;
							viewElem.find(".goods-price")[zhx.getClassOp(value)]("none");
							break;
					}
					//瀑布风格时进行判断
					if (self.data.type == "waterfall") {
						//只有按钮时
						viewElem.find(".info-box")[zhx.getClassOp(!(!self.data.showName && !self.data.showPrice && self.data.showBuy))]("pos-box");
						viewElem.find(".info-box")[zhx.getClassOp(!(!self.data.showName && !self.data.showPrice && !self.data.showBuy))]("h-none");
					}
				})
			},
			edit: function (initData) {
				var patternList = ["big", "small", "bigAndSmall", "detail"];
				var index = patternList.indexOf(initData.pattern);
				if (!~index) {
					index = 0;
				}
				this.settingElem.find(".list-style .label-radio").eq(index).trigger("click");
				//默认开启--关闭状态触发click事件
				if(!initData.showName){
					this.settingElem.find(".show-name .label-checkbox").eq(0).trigger("click");
				}
			}
		}
	})
})(jQuery);
/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("goodsSearch", function () {
		return {
			name: "商品搜索",
			isDelete:1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "gs-search">');
				html.push('<div class = "mc"><p><label class="label-search"><input type="text" placeholder="搜索商品" disabled="disabled"/><i class="i-icon"></i></label></p></div>');

				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-gs-search" style="display: block">');
				html.push('<p><span>背景色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class="btn-reset" type="button" value="重置"/>');
				html.push('</p>');
				html.push('</div>');
				return html.join(" ");
			},
			data:{
				bgColor:"#ffffff"
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
			}
		}
	})
})(jQuery);
/*
 * des: banner and logo
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
				html.push('<div class = "sty-hr">');
				html.push('<div class = "mc"><p></p></div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-sty-hr" style="display: block">');
				html.push('<p><span>颜色：</span><label class = "label-color"><input type = "color" value = "#ececec"></label><input class="btn-reset" type="button" value="重置"/>');
				html.push('<label class="label-checkbox"><input type="checkbox"/>左右留边<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p><span>分类：</span><label class = "label-radio label-radio-active"><input type = "radio" value = "solid"  checked="checked"/>实线 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" value = "dashed"/>虚线<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" value = "dotted"/>点线 <i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('</div>');
				return html.join(" ");
			},
			data:{
				isBlank:false,
				color:"#ececec",
				type:"solid"

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
			}
		}
	})
})(jQuery);
/*
 * des: banner and logo
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
				html.push('<div class = "img-ad ">');
				html.push('<div class = "mc type-carousel">');
				html.push('<div class = "adi-list">');
				html.push('<a href="">');
				html.push('<img src = "../images/img_bg_101.jpg" />');
				html.push('</a>');
				html.push('</div>');
				html.push('<ul class="adi-list-icon">');
				//html.push('<li class="active">.</li>');
				html.push('</ul>');
				html.push('</div>');
				html.push('');
				html.push('</div>');
				return html.join(" ");
			},
			viewItem: function (src, title) {
				var html = [];
				html.push('<a>');
				html.push('<img src = "' + src + '" alt = "">');
				if (title) {
					html.push('<cite class="c-bg"></cite>');
					html.push('<cite class="c-txt">' + title + '</cite>');
				} else {
					html.push('<cite class="c-bg none"></cite>');
					html.push('<cite class="c-txt none"></cite>');
				}
				html.push('</a>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class="set-img-ad" style = "display: block">');
				html.push('<p><span>显示方式：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "carousel" name = "method" checked = "checked"/>折叠轮播 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "method" value = "separate"/>分开显示<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p class="show-size type-car"><span>显示大小：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "big" name = "showSize" checked = "checked"/>大图 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio min-rdi"><input type = "radio" name = "showSize" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<ul class="img-ad-list clearfix">');
				html.push('<li class="move-li"></li>');
				html.push('</ul>');
				html.push('<p class="nav-link"><a><i></i>添加一个广告</a></p>');
				html.push('</div>');
				return html.join(" ");
			},
			liTemplate: function (src) {
				var html = [];
				html.push('<li>');
				html.push('<div class="ad-img-bg">');
				html.push('<img src="' + src + '"/>');
				html.push('<cite class="c-bg"></cite>');
				html.push('<cite class="c-txt">重新上传</cite>');
				html.push('</div>');
				html.push('<div class="ad-img-info">');
				html.push('<p><span>标题：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接：</span><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.push('<a>');
				html.push('<label data-val="店铺主页">店铺主页</label>');
				html.push('<label data-type="会员主页">会员主页</label>');
				html.push('</a>');
				html.push('</label>');
				html.push('</p>');
				html.push('</div>');
				html.push('<i class="i-close">x</i>');
				html.push('</li>');
				return html.join(" ");
			},
			data: {
				method: "carousel",
				showSize: "big",
				imgList: []		//{src,title,link,size:{w,h}}
			},
			getMaxHeight: function (self) {
				var h = [];
				$.each(self.data.imgList, function () {
					h.push(this.size.h / (this.size.w / 320));
				});
				return Math.max.apply([], h);
			},
			setMaxHeight: function (self, elem) {
				if (self.data.method == "carousel") {
					var h = self.getMaxHeight(self);
					elem.height(h);
					elem.find("a").height(h);
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
							settingElem.find(".show-size")[zhx.getClassOp(value == "separate")]("type-car");
							if (self.data.method == "carousel" && self.data.showSize == "small") {
								settingElem.find(".show-size .label-radio").eq(0).trigger("click");
							}
							zhx.changeClass(viewElem.find(".mc"), m_cls, value);
							self.setMaxHeight(self, viewElem.find(".mc"));
							break;
						case "showSize":
							self.data.showSize = value;
							zhx.classOp(viewElem.find(".adi-list"), value == "small", "sm-list");
							break;
					}
				});
				//add
				var $listBox = settingElem.find(".img-ad-list"), $viewImgBox = viewElem.find(".adi-list"), $viewIcon = viewElem.find(".adi-list-icon");
				var $list = $listBox.find("li").not(".move-li");
				var resetList = function () {
					$list = $listBox.find("li").not(".move-li");
				}
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
						$viewImgBox.html('<a><img src = "../images/img_bg_101.jpg" alt = ""></a>');
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
					$listBox.find(".c-txt").unbind("click").bind("click", function () {
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						zhx.dialog.imgList(function (list) {
							var $img = list.eq(0).find("img");
							var src = $img.attr("src");
							$li.find("img").attr("src", src);
							self.data.imgList[idx].src = src;
							self.data.imgList[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
							//bindLiEvent();
							changeViewImg();
							self.setMaxHeight(self, viewElem.find(".mc"));
						}, 1);
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
							});
						}
					})
					//选择链接
					var $linkAddress = settingElem.find(".link-address");
					zhx.other.select($linkAddress, function (data) {
						var $item = $(this);
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						self.data.imgList[idx].link = data.value;
						$item.attr("data-val", data.value);
						$item.find("strong").text(data.text);
					});
				}
				settingElem.find(".nav-link").bind("click", function () {
					zhx.dialog.imgList(function (list) {
						var html = [];
						$.each(list, function () {
							var $img = $(this).find("img");
							var src = $img.attr("src");
							self.data.imgList.push({
								src: src,
								link: "",
								title: "",
								size: {w: $img[0].naturalWidth, h: $img[0].naturalHeight}
							});
							html.push(self.liTemplate(src));
						})
						$listBox.append(html.join(" "));
						resetList();
						bindLiEvent();
						changeViewImg();
						self.setMaxHeight(self, viewElem.find(".mc"));
					})
				})
			}
		}
	})
})(jQuery);
/*
 * des: banner and logo
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
				html.push('<div class = "img-nav">');
				html.push('<div class = "mc">');
				html.push('<a><img /><p></p></a>');
				html.push('<a><img /><p></p></a>');
				html.push('<a><img /><p></p></a>');
				html.push('<a><img /><p></p></a>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			viewItem: function (src, title) {
				var html = [];
				html.push('<a><img src="' + src + '"/>');
				html.push('<p>' + (title || "") + '</p>');
				html.push('</a>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-img-nav">');
				html.push('<ul class="sin-img-list">');
				html.push('</ul>');
				html.push('</div>');
				return html.join(" ");
			},
			liTemplate: function (src) {
				var html = [];
				html.push('<li class="clearfix">');
				html.push('<div class="nav-img-bg">');
				html.push('<img/>');
				html.push('<a class="add-img"><i></i>添加图片</a>');
				html.push('<cite class="c-bg"></cite>');
				html.push('<cite class="c-txt">重新上传</cite>');
				html.push('</div>');
				html.push('<div class="nav-img-info">');
				html.push('<p><span>文字：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接：</span><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');

				html.push('<a>');
				html.push('<label>店铺主页</label>');
				html.push('<label>会员主页</label>');
				html.push('</a>');
				html.push('</label>');
				html.push('</p>');
				html.push('</div>');
				html.push('</li>');
				return html.join(" ");
			},
			data: {
				list: []//{src,title,link}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $listBox = settingElem.find(".sin-img-list"), $viewLinkBox = viewElem.find(".mc");

				function initLi() {
					var html = [];
					for (var i = 0; i < 4; i++) {
						html.push(self.liTemplate());
						self.data.list.push({
							src: "",
							size: {w: 0, h: 0},
							title: "",
							link: ""
						});
					}
					$listBox.html(html.join(" "))
				}

				initLi();
				//var $list = settingElem.find(".label-radio");
				//zhx.other.radio($list,function (type) {
				//	viewElem.find(".mc p").css("border-bottom-style",$(this).val());
				//});
				//settingElem.find(".label-color input").bind("change",function () {
				//	viewElem.find(".mc p").css("border-color",this.value);
				//});
				var changeViewImg = function () {
					var html = [];
					$.each(self.data.list, function () {
						html.push(self.viewItem(this.src, this.title));
					});
					$viewLinkBox.html(html.join(" "));
				}
				//选择图片
				var selectImg = function ($li, isAdd) {
					var idx = $listBox.find("li").index($li);
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
						changeViewImg();
					}, 1);
				}
				//重新选择
				$listBox.find(".c-txt").bind("click", function () {
					var $li = $(this).parents("li");
					selectImg($li);
				})
				//输入标题
				$listBox.find(".link-txt input").bind("blur", function () {
					var val = $(this).val();
					var $li = $(this).parents("li");
					if ($.trim(val)) {
						var idx = $listBox.find("li").index($li);
						self.data.list[idx].title = val;
						$viewLinkBox.find("a").eq(idx).find("p").html(val);
					}
				});
				//添加图片
				settingElem.find(".add-img").bind("click", function () {
					var $li = $(this).parents("li");
					selectImg($li, 1);
				})
				//选择链接
				var $linkAddress =  settingElem.find(".link-address");
				zhx.other.select($linkAddress,function (data) {
					var $item = $(this);
					$item.attr("data-val", data.value);
					$item.find("strong").text(data.text);
				});


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
				html.push('<div class = "sty-notice">');
				html.push('<div class = "mc"><p>公告：<span>请填写内容，如果过长，将会在手机上滚动显示</span></p></div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-notice" style="display: block">');
				html.push('<p><span>公告：</span><label class = "label-input"><input type = "text" placeholder="请填写内容，如果过长，将会在手机上滚动显示"/></label>');
				html.push('</p>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				text: ""
			},
			init: function (viewElem, settingElem) {
				var self = this;
				settingElem.find(".label-input input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					if (val) {
						viewElem.find("p span").text(val);
						self.data.text = val;
					} else {
						viewElem.find("p span").text("请填写内容，如果过长，将会在手机上滚动显示");
						self.data.text = "";
					}
				})
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
				html.push('<div class = "set-title">');
				html.push('<p><span><em>*</em>页面名称：</span><label class = "label-input page-name"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>页面描述：</span><label class = "label-input"><input type = "text" maxlength = "20" placeholder="用户通过微信分享给朋友时，会自动显示页面描述"></label></p>');
				html.push('<p><span>分类：</span><label class = "label-select label-box-select"><input type = "text" maxlength = "20">');
				html.push('<a>');
				html.push('<label data-val = "004">分类1</label>');
				html.push('<label data-val = "005">分类2</label>');
				html.push('<label data-val = "006">分类3</label>');
				html.push('</a>');
				html.push('</label></p>');
				html.push('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				title: "",
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
					titleStr = val;
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
			//默认信息
			DefInfo:function (defData) {
				if(defData.title){
					
				}
				
				
			}
		}
	})
})(jQuery);
/*
 * des: banner and logo
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
				html.push('<div class = "text-nav">');
				html.push('<div class = "mc">');
				html.push('<h3><span>点击编辑导航</span><i class = "i-right"></i></h3>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			viewItem: function (title) {
				return '<h3><span>' + (title || "点击编辑导航") + '</span><i class = "i-right"></i></h3>';
			},
			liTemplate: function (src) {
				var html = [];
				html.push('<li>');
				html.push('<p><span>导航名称：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接到：</span><label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.push('<a>');
				html.push('<label style="display: none" data-val="-2"></label>');
				html.push('<label data-val="1">店铺主页</label>');
				html.push('<label data-val="2">会员主页</label>');
				html.push('<label data-val="9">自定义外链</label>');
				html.push('</a><i class="i-icon"></i>');
				html.push('</label>');
				html.push('</p>');
				html.push('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.push('<i class="i-close">x</i>');
				html.push('</li>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-text-nav">');
				html.push('<ul class="stn-nav-list move-ul">');
				html.push('<li class="move-li"></li>');
				html.push('</ul>');
				html.push('<p class="nav-link"><a><i></i>添加一个文本导航</a></p>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				linkList: []	//{title,type, src }
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
					$viewLinkBox.find("h3").last()[zhx.getClassOp(self.data.linkList.length <= 1)]("no-bor");
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
							});
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
						switch (data.value) {
							case "-2":
								$sname.eq(idx).removeClass("link-mar15").find("em").text(data.text);
								break;
							case "1":
								$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
								break;
							case "2":
								$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
								break;
							case "9":
								self.data.linkList[idx].src = $list.eq(idx).find(".other-link-box input").val();
								$sname.eq(idx).addClass("link-mar15").find("em").text("外链|" + self.data.linkList[idx].src);
								//trigger
								if (e.isTrigger) {
								} else {
									$list.find(".other-link-box").eq(idx).show();
								}
								break;
						}
						self.data.linkList[idx].type = data.value;
						if (data.value == "-2") {
							$item.find("strong").text("设置链接到的页面地址");
						} else {
							$item.find("strong").text("修改");
						}
					});
					//点击事件
					$sname.find("em").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("em").index(this);
						if (self.data.linkList[idx].type == 9) {
							$list.find(".other-link-box").eq(idx).show();
						}
						//$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
					//删除
					$sname.find("i").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("i").index(this);
						$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
				}
				settingElem.find(".nav-link").bind("click", function () {
					var html = self.liTemplate();
					$listBox.append(html);
					self.data.linkList.push({title: " ", src: "", type: -1});
					if (self.data.linkList.length >= 20) {
						settingElem.find(".nav-link").hide();
					}
					$list = $listBox.find("li").not(".move-li");
					bindLiEvent();
					changeViewImg();
				})
			}
		}
	})
})(jQuery);
/*
 * des: banner and logo
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
				html.push('<div class = "text-title">');
				html.push('<div class = "mc">');
				html.push('<div class = "panel-1">');
				html.push('<h3><span>点击编辑标题</span><label>-<a></a></label></h3>');
				html.push('<p class="tt-subtitle"><label></label></p>');
				html.push('</div>');
				html.push('<div class = "panel-2">');
				html.push('<h3><span>点击编辑标题</span></h3>');
				html.push('<p class="tt-subtitle clearfix"><label class="tt-date"></label> <label class="tt-author"></label> <a></a></p>');
				html.push('</div>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-text-title" style = "display: block">');
				html.push('<p><span><em>*</em>标题名：</span><label class = "label-input stt-title"><input type = "text" defaultValue="点击编辑标题" maxlength = "20"></label></p>');
				html.push('<p><span>标题模版：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "tradition" name = "titleType" checked = "checked"/>传统样式<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "titleType" value = "wx"/>模仿微信图文页样式 <i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<div class="panel-1">');
				html.push('<p><span>副标题：</span><label class = "label-input stt-subtitle"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>显示：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "left" name = "textAlign" checked = "checked"/>居左 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "textAlign" value = "center"/>居中<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "textAlign" value = "right"/>居右 <i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.push('<p class="nav-link"><a><i></i>添加一个文本导航</a></p>');
				html.push('<div class="link-text-box">');
				html.push('<p><span><em>*</em>名称：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span><em>*</em>链接：</span><label class = "label-select link-address subtitle-link"><strong>设置链接到的页面地址</strong>');
				html.push('<a>');
				html.push('<label data-val="店铺主页">店铺主页</label>');
				html.push('<label data-val="会员主页">会员主页</label>');
				html.push('</a>');
				html.push('</label></p>');
				html.push('<i class="i-close">x</i>');
				html.push('</div>');
				html.push('</div>');
				html.push('<div class="panel-2">');
				html.push('<p><span>日期：</span><label class = "label-input stt-date"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>作者：</span><label class = "label-input stt-author"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接标题：</span><label class = "label-input stt-link-text"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接地址：</span> ');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "follow" name = "linkTYpe" checked = "checked"/>引导关注<i class = "i-icon"></i></label>');
				html.push('<a class="set-fast-link">设置快速关注链接</a>')
				html.push('</p>');
				html.push('<p><span></span>');
				html.push('<label class = "label-radio"><input type = "radio" value = "other" name = "linkTYpe"/>其它链接<i class = "i-icon"></i></label>');
				html.push('<label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.push('<a>');
				html.push('<label data-val="店铺主页">店铺主页</label>');
				html.push('<label data-val="会员主页">会员主页</label>');
				html.push('</a>');
				html.push('</label>');
				html.push('</p>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				title: "",	//标题
				titleType: "tradition",  //类型 常规 或 仿微信
				tradition: {
					hasLink: 0,	//是否有链接
					link: {
						text: "",
						src: ""
					},
					titleBg: "",
					txtAlign: "left",	//align 样式
					subtitle: ""	//副标题
				},
				wx: {
					datetime: "",
					author: "",
					linkTitle: "",
					linkType: "follow",
					linkSrc: ""
				}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var tra = self.data.tradition, wx = self.data.wx;
				var $radioList = settingElem.find(".label-radio");
				settingElem.find(".stt-title input").bind("blur", function () {
					var $input = $(this), val = $input.val(), deVal = $input.attr("defaultValue");
					viewElem.find("h3 span").text(val || deVal);
					self.data.title = val || deVal;
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
				var $linkAddress = settingElem.find(".link-address");
				zhx.other.select($linkAddress, function (data) {
					var $item = $(this);
					$item.attr("data-val", data.value);
					$item.find("strong").text(data.text);
					if ($item.hasClass("subtitle-link")) {
						tra.link.src = data.value;
					} else {
						wx.linkSrc = data.value;
					}
				});
				settingElem.find(".stt-date input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-date").text(val);
					wx.datetime=val;
				})
				settingElem.find(".stt-author input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-author").text(val);
					wx.author = val;
				})
				settingElem.find(".stt-link-text input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-subtitle a").text(val);
					wx.linkTitle=val;
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
					}
				});
			},
			edit:function (initData) {
				this.settingElem.find(".stt-title input").val(initData.title).trigger("blur");

			}
		}
	})
})(jQuery);
;(function () {
	var typeList = ["main", "detail", "custom"];//主页 自定义页
	var type = typeList[2];
	$.extend(zhx, {
		//type:无拖动 编辑Event
		init: function (list) {
			zhx.createOp();
			zhx.bindOpEvent();
			if (list && list.length) {
				zhx.resetInit(list);
			}else{
				zhx.plugins["pageTitle"].create("", {title: "店铺主页"});
			}
		},
		resetInit: function (list) {
			$.each(list, function (idx, item) {
				var p = zhx.plugins[item.key].create("", item);
				p.edit&&p.edit(item);
			})
		}
	});
	$(function () {
		//if(window.devicePixelRatio && devicePixelRatio >= 2){
		//	//document.querySelector('ul').className = 'hairlines';
		//}
		//	zhx.bindMousedownEvent();
		//zhx.plugins["pageTitle"].create("", {title: "店铺主页"});
		//zhx.getEditBox.show();
		//zhx.getEditBox.find(".set-img-nav").show();
		//zhx.dialog.imgList();
	})
})();







