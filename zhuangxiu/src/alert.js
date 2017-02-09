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
