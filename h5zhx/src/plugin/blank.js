/*
 * des: 辅助空白
 *
 * */
;(function ($) {
	zhx.addPlugin("blank", function () {
		return {
			name: "辅助空白",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "sty-blank">');
				html.p('<div class = "mc"><p></p></div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-blank" style="display: block">');
				html.p('<p><span>空白高度：</span><label class = "label-range"><i class="i-track"></i><i class="i-thumb"></i><input type = "range"/></label>');
				html.p('<label><strong class="blank-height">30</strong>像素</label>');
				html.p('</p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				height: 30
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var timer = 0;
				settingElem.find(".label-range input").bind("input change", function () {
					settingElem.find(".label-range .i-thumb").css({
						left: this.value / 100 * 224 + 'px'
					})
					var h = self.data.height = parseInt(this.value / 100 * 70 + 30);
					settingElem.find(".blank-height").text(h);
					viewElem.find("p").height(h);
					//重置视图的高度
					clearTimeout(timer);
					timer = setTimeout(function () {
						zhx.resetHeight();
					}, 2000);
				})
			},
			edit:function (initData) {
				var settingElem = this.settingElem;
				var h = (initData.height-30)/70*100;
				settingElem.find(".label-range input").val(h).trigger("change");
				settingElem.find(".label-range input").val(h).trigger("input");
			}
		}
	})
})(jQuery);