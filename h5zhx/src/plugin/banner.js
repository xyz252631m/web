/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("banner", function () {
		return {
			name:"店铺店招",// "banner",
			isRepeat: 0,
			isShowOp: 1,
			isDelete: 0,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "ss-banner" style = "display: block">');
				html.p('<div class = "mc">');
				html.p('<div class="banner-bg">');
				html.p('<div class="ba-logo">');
				html.p('<img src = "//i0.ulecdn.com/ule/header/images/logo.png" alt = "">');
				html.p('</div>');
				html.p('<div class="ba-store-name">店铺名称</div>');
				html.p('</div>');
				// html.p('<div class="banner-menu">');
				// // html.p('<ul>');
				// // html.p('<li><a><span>0</span><span class="li-tl">全部商品</span></a></li>');
				// // html.p('<li><a><span>0</span><span class="li-tl">上新商品</span></a></li>');
				// // html.p('<li><a><span><i class="i-user"></i></span><span class="li-tl">我的订单</span></a></li>');
				// // html.p('</ul>');
				// html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-banner">');
				html.p('<p><span>背景图片：</span><label class = "select-img">选择图片<input type="file"/></label></p>');
				html.p('<p class="p-tip"><span>&nbsp;</span>最佳尺寸：640 x 200 像素。</p>');
				html.p('<p class="p-tip"><span>&nbsp;</span>尺寸不匹配时，图片将被压缩或拉伸以铺满画面。</p>');
				html.p('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.p('<p class="sb-logo"><span>店铺Logo：</span><img width="80" height="80"/><label class="sb-edit-logo">修改店铺Logo <input type="file"/></label></p>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				bgColor: "#F02D45",
				bgImgSrc: "",
				bgImgSize: {},
				logoSrc: "",
				storeName:"",
				logoSize: {}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var changeViewImg = function () {
					if (self.data.bgImgSrc) {
						viewElem.find(".banner-bg").css("background-image", "url('" + self.data.bgImgSrc + "')");
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
				//背景色图片
				//settingElem.find(".select-img").bind("click",function () {
				//	var $a = $(this);
				//	zhx.dialog.imgList(function (list) {
				//		var $img = list.eq(0).find("img");
				//		var src = $img.attr("src");
				//		self.data.bgImgSrc = src;
				//		self.data.bgImgSize = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
				//		changeViewImg();
				//		$a.text("修改");
				//	}, 1);
				//})
				settingElem.find(".select-img input").bind("change", function () {
					var file = this.files[0];
					var $a = $(this);
					zhx.data.uploadImg(file).success(function (res) {
						if (res.status == 0) {
							self.data.bgImgSrc = res.url;
							changeViewImg();
							$a.text("修改");
						}else{
							zhx.box.msg(res.message);
						}
					}).error(function () {
						zhx.box.msg("上传失败！");
					});
				})
				//修改LOGO
				settingElem.find(".sb-edit-logo input").bind("change", function () {
					var file = this.files[0];
					zhx.data.uploadImg(file).success(function (res) {
						if (res.status == 0) {
							self.data.logoSrc = res.url;
							viewElem.find(".ba-logo img").attr("src",res.url);
							settingElem.find(".sb-logo img").attr("src",res.url);
						}else{
							zhx.box.msg(res.message);
						}
					}).error(function () {
						zhx.box.msg("上传失败！");
					});
				})
			}, edit: function (initData) {
				var d = $.extend({},this.data, initData);
				var viewElem = this.viewElem, settingElem = this.settingElem;
				//view
				viewElem.find(".ba-store-name").text(d.storeName);
				//settion
				settingElem.find(".label-color input").val(d.bgColor);
				settingElem.find(".label-color input").trigger("change");
				if (d.bgImgSrc) {
					viewElem.find(".banner-bg").css("background-image", "url('" + d.bgImgSrc + "')");
				}
				if(d.logoSrc){
					viewElem.find(".ba-logo img").attr("src",d.logoSrc);
					settingElem.find(".sb-logo img").attr("src",d.logoSrc);
				}else{
					if(zhx.config.store.storeLogo){
						this.data.logoSrc = zhx.config.store.storeLogo;
						viewElem.find(".ba-logo img").attr("src",this.data.logoSrc);
						settingElem.find(".sb-logo img").attr("src",this.data.logoSrc);
					}
				}


			}
		}
	})
})(jQuery);