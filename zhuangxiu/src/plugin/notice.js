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