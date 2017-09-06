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