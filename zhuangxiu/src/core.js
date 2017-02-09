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