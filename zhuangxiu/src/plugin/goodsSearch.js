/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("goodsSearch", function () {
		return {
			name: "商品搜索",
			isDelete:1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "gs-search">');
				html.push('<div class = "mc"><p><label class="label-search"><input type="text" placeholder="搜索商品" disabled="disabled"/><i class="i-icon"></i></label></p></div>');

				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-gs-search" style="display: block">');
				html.push('<p><span>背景色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class="btn-reset" type="button" value="重置"/>');
				html.push('</p>');
				html.push('</div>');
				return html.join(" ");
			},
			data:{
				bgColor:"#ffffff"
			},
			init: function (viewElem, settingElem) {
				var self = this;
				//更改颜色
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".mc").css("background-color", this.value);
					self.data.bgColor = this.value;
				});
				//重置
				settingElem.find(".btn-reset").bind("click", function () {
					settingElem.find(".label-color input").val("#ffffff");
					settingElem.find(".label-color input").trigger("change");

				})
			}
		}
	})
})(jQuery);