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