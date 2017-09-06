/*
 * des: 页面头部标题
 *
 * */
;(function ($) {
	zhx.addPlugin("pageTitle", function () {
		return {
			name: "页面头部标题",
			isDelete: 0,
			isRepeat: 0,
			isShowOp: 0,
			noView: 1,	//默认是否已存在( pageTitle 默认已存在)
			viewTemplate: function () {
				return ".p-title";
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-title">');
				html.p('<p><span><em>*</em>页面名称：</span><label class = "label-input page-name"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>页面描述：</span><label class = "label-input page-des"><input type = "text" maxlength = "20" placeholder="用户通过微信分享给朋友时，会自动显示页面描述"></label></p>');
				// html.p('<p><span>分类：</span><label class = "label-select label-box-select"><input type = "text" maxlength = "20">');
				// html.p('<a>');
				// html.p('<label data-val = "004">分类1</label>');
				// html.p('<label data-val = "005">分类2</label>');
				// html.p('<label data-val = "006">分类3</label>');
				// html.p('</a>');
				// html.p('</label></p>');
				html.p('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				title: "",
				des:"",
				bodyBg:"#ffffff"
			},
			init: function (viewElem, settingElem) {
				var self = this, titleStr = self.data.title;
				if (titleStr) {
					viewElem.find("h3").text(titleStr);
					settingElem.find(".page-name input").val(titleStr);
				}
				settingElem.find(".page-name input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find("h3").text(val);
					self.data.title = val;
					//console.log(titleStr===self.data.title);
				})
				settingElem.find(".page-des input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					self.data.des = val;
				})
				//背景色
				settingElem.find(".label-color input").bind("change", function () {
					zhx.config.root.css("background-color", this.value);
					//viewElem.find(".mc").css("background-color", this.value);
					self.data.bodyBg = this.value;
				});
				//背景色重置
				settingElem.find(".btn-reset").bind("click", function () {
					//viewElem.css("background-color", "#ffffff");
					settingElem.find(".label-color input").val("#ffffff");
					settingElem.find(".label-color input").trigger("change");
				})
			},
			
			edit:function (initData) {
				var d = $.extend({},this.data, initData);
				var viewElem = this.viewElem, settingElem = this.settingElem;
				settingElem.find(".page-name input").val(d.title).trigger('blur');
				settingElem.find(".page-des input").val(d.des).trigger('blur');
				settingElem.find(".label-color input").val(d.bodyBg).trigger("change");
				
			}
		}
	})
})(jQuery);