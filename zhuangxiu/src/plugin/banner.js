/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("banner", function () {
		return {
			name: "banner",
			isRepeat: 0,
			isShowOp: 0,
			isDelete: 0,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "ss-banner" style = "display: block">');
				html.push('<div class = "mc">');
				html.push('<div class="banner-bg">');
				html.push('<div class="ba-logo">');
				html.push('<img src = "../images/tem/logo.webp" alt = "">');
				html.push('</div>');
				html.push('<div class="ba-store-name">店铺名称</div>');
				html.push('</div>');
				html.push('<div class="banner-menu">');
				html.push('<ul>');
				html.push('<li><a><span>0</span><span class="li-tl">全部商品</span></a></li>');
				html.push('<li><a><span>0</span><span class="li-tl">上新商品</span></a></li>');
				html.push('<li><a><span><i class="i-user"></i></span><span class="li-tl">我的订单</span></a></li>');
				html.push('</ul>');
				html.push('</div>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-banner">');
				html.push('<p><span>背景图片：</span><a class = "select-img">选择图片</a></p>');
				html.push('<p class="p-tip"><span>&nbsp;</span>最佳尺寸：640 x 200 像素。</p>');
				html.push('<p class="p-tip"><span>&nbsp;</span>尺寸不匹配时，图片将被压缩或拉伸以铺满画面。</p>');
				html.push('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.push('<p class="sb-logo"><span>店铺Logo：</span><img width="80" height="80"/><a class="sb-edit-logo">修改店铺Logo</a></p>');
				html.push('</div>');
				return html.join(" ");
			},
			data:{
				bgColor:"#F02D45",
				bgImgSrc:"",
				bgImgSize:{},
				logoSrc:"",
				logoSize:{}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var changeViewImg = function () {
					if (self.data.bgImgSrc) {
						viewElem.find(".banner-bg").css("background-image","url('"+self.data.bgImgSrc+"')");
					}
				}
				//背景色
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".banner-bg").css("background-color", this.value);
					self.data.bgColor = this.value;
				});
				//背景色重置
				settingElem.find(".btn-reset").bind("click", function () {
					settingElem.find(".label-color input").val("#F02D45");
					settingElem.find(".label-color input").trigger("change");
				})

				settingElem.find(".select-img").bind("click",function () {
					var $a = $(this);
					zhx.dialog.imgList(function (list) {
						var $img = list.eq(0).find("img");
						var src = $img.attr("src");
						self.data.bgImgSrc = src;
						self.data.bgImgSize = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
						changeViewImg();
						$a.text("修改");
					}, 1);
				})
				//修改LOGO
				settingElem.find(".sb-edit-logo").bind("click",function () {




				})
			},edit:function (initData) {
				this.settingElem.find(".label-color input").val(initData.bgColor);
				this.settingElem.find(".label-color input").trigger("change");


				
			}
		}
	})
})(jQuery);