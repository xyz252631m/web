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