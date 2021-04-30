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