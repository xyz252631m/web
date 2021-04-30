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
