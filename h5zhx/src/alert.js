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
