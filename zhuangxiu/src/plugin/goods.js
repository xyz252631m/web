/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("goods", function () {
		return {
			name: "商品",
			isDelete:1,	
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "goods-list goods-big" style="display: block">');
				html.push('<div class = "mc">');
				html.push('<ul class="clearfix card buy-4">');
				html.push('<li class="li-1">');
				html.push('<a  class = "goods-img " href = "">');
				html.push('<img src = "../images/goods_bg_01.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥65.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥65</strong>');
				html.push('<del>原价：¥70.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-2">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_02.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥75.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥75</strong>');
				html.push('<del>原价：¥90.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-3">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_03.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥265.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥265</strong>');
				html.push('<del>原价：¥270.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('<li  class="li-4">');
				html.push('<a class = "goods-img" href = "">');
				html.push('<img src = "../images/goods_bg_04.jpg">');
				html.push('</a>');
				html.push('<div class = "info-box">');
				html.push('<p class="goods-name" href = ""><a>商品名称</a></p>');
				html.push('<p class="goods-des"><label>商品描述</label></p>');
				html.push('<p class="goods-price">¥165.00</p>');
				html.push('<a class="btn-buy" href = "">订购</a>');
				html.push('</div>');
				html.push('<div class = "promotion-box none">');
				html.push('<div class = "prom-price">');
				html.push('<strong>¥165</strong>');
				html.push('<del>原价：¥170.00</del>');
				html.push('</div>');
				html.push('<a class = "btn-prom" href = "">我要抢购</a>');
				html.push('</div>');
				html.push('</li>');
				html.push('</ul>');
				html.push('</div>');

				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-goods-list set-goods">');
				html.push('<div class="sel-list clearfix"><span>选择商品：</span>');



				html.push('<ul class="clearfix">');
				html.push('');
				html.push('');
				html.push('');
				html.push('<li class="li-add"><a class="btn-add-goods"><i></i></a></li>');
				html.push('</ul>');

				html.push('</div>');
				html.push('<p class="list-style"><span>列表样式：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" name = "listStyle" value = "big" checked = "checked"/>大图<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "bigAndSmall"/>一大两小<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "detail"/>详细列表<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('');
				html.push('<div class = "detail-info dta-big">');
				html.push('<p class="show-type"><label class = "label-radio label-radio-active"><input type = "radio" name = "cardStyle" value = "card" checked = "checked"/>卡片样式<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "waterfall"/>瀑布流<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "simple"/>极简样式<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "promotion"/>促销<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<div class = "style-detail card">');
				html.push('<p class="buy-chk"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showBuy" checked="checked"/>显示购买按钮<i class = "i-icon"></i></label></p>');
				html.push('<p class="buy-btn-style">');
				html.push('<label class = "label-radio "><input type = "radio" value = "1" name = "buyStyle"/>样式1<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "2"/>样式2<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "3"/>样式3<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" name = "buyStyle" value = "4"  checked = "checked"/>样式4<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p class="show-name"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showName" checked="checked"/>显示商品名 <i class = "i-icon"></i></label></p>');
				html.push('<p class="show-des"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showDes" checked="checked"/>显示商品简介 <i class = "i-icon"></i></label></p>');
				html.push('<p class="show-price"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showPrice" checked="checked"/>显示价格<i class = "i-icon"></i></label></p>');
				html.push('</div>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				num: 0,				//显示的数量
				pattern: "big",		//模式	[大图，小图，两大一小，详细]
				type: "card",		//类型	[卡片，瀑布，极简，促销]
				showBuy: 1,			//是否显示购买按钮
				showName: 1,			//是否显示商品名称
				showDes: 1,			//是否显示商品描述
				showPrice: 1,		//是否显示商品价格
				buyStyle: 4			//购买按钮风格 0为不显示
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $ul = viewElem.find("ul");
				var $radioList = settingElem.find(".label-radio");
				//商品展示样式
				var listClass = {
					"big": "goods-big",
					"small": "goods-small",
					"bigAndSmall": "goods-big-small",
					"detail": "goods-detail"
				}
				//商品展示风格
				var listStyle = {
					"card": "card",
					"waterfall": "waterfall",
					"simple": "simple",
					"promotion": "promotion"
				}
				//右侧设置--样式切换
				var detailClass = {
					"big": "dta-big",
					"small": "dta-small",
					"bigAndSmall": "dta-bs",
					"detail": "dta-list"
				}
				//右侧设置--风格切换
				var detailStyle = listStyle;	//共用商品展示风格样式名称
				//购买按钮--样式切换
				var buyClass = ["buy-none", "buy-1", "buy-2", "buy-3", "buy-4"];
				var $detailInfo = settingElem.find(".detail-info");
				var $styleOther = settingElem.find(".style-detail");
				zhx.other.radio($radioList, function (type, value) {
					switch (type) {
						case "listStyle":
							self.data.pattern = value;
							zhx.changeClass(viewElem, listClass, value);
							zhx.changeClass($detailInfo, detailClass, value);
							zhx.resetHeight();

							if(settingElem.find(".show-type .label-radio-active").is(":hidden")){
								settingElem.find(".show-type .label-radio").eq(0).trigger("click");
							}
							break;
						case "cardStyle":
							self.data.type = value;
							zhx.changeClass($ul, listStyle, value);
							zhx.changeClass($styleOther, detailStyle, value);
							//详细列表-极简风格
							if (self.data.pattern == "detail" && value == "simple") {
								if (self.data.buyStyle == 3) {
									settingElem.find(".buy-btn-style .label-radio").eq(0).trigger("click");
								}
							}
							break;
						case "buyStyle":
							if (self.data.showBuy) {
								zhx.changeClass($ul, buyClass, value);
							}
							self.data.buyStyle = value;
							break;
					}
					viewElem.find(".mc p").css("border-bottom-style", $(this).val());
				});
				//购买选项
				var $chkList = settingElem.find(".label-checkbox");
				//elem
				var $buyChk = settingElem.find(".buy-chk");
				var $buyStyle = settingElem.find(".buy-btn-style");
				zhx.other.checkbox($chkList, function (type, value) {
					switch (type) {
						case "showBuy":
							self.data.showBuy = value;
							if (value) {
								zhx.changeClass($ul, buyClass, self.data.buyStyle);
								$buyStyle.removeClass("none");
							} else {
								//self.data.buyStyle = 0;
								zhx.changeClass($ul, buyClass, 0);
								$buyStyle.addClass("none");
							}
							break;
						case "showName":
							self.data.showName = value;
							viewElem.find(".goods-name")[zhx.getClassOp(value)]("none");
							if (self.data.type == "waterfall") {
								viewElem.find(".info-box")[zhx.getClassOp(value)]("h-25");
							}
							break;
						case "showDes":
							self.data.showDes = value;
							//商品描述--只有大图模式可设置
							viewElem.find(".goods-des")[zhx.getClassOp(value)]("none");
							viewElem.find(".info-box")[zhx.getClassOp(value)]("float-info");
							break;
						case "showPrice":
							self.data.showPrice = value;
							viewElem.find(".goods-price")[zhx.getClassOp(value)]("none");
							break;
					}
					//瀑布风格时进行判断
					if (self.data.type == "waterfall") {
						//只有按钮时
						viewElem.find(".info-box")[zhx.getClassOp(!(!self.data.showName && !self.data.showPrice && self.data.showBuy))]("pos-box");
						viewElem.find(".info-box")[zhx.getClassOp(!(!self.data.showName && !self.data.showPrice && !self.data.showBuy))]("h-none");
					}
				});
				//添加图片
				settingElem.find(".li-add a").bind("click",function () {



				})

				//选择商品
				settingElem.find(".btn-add-goods").bind("click",function () {
					zhx.dialog.selectGoods(function (list) {
						console.log(list);
						//var html = [];
						//$.each(list, function () {
						//	var $img = $(this).find("img");
						//	var src = $img.attr("src");
						//	self.data.imgList.push({
						//		src: src,
						//		link: "",
						//		title: "",
						//		size: {w: $img[0].naturalWidth, h: $img[0].naturalHeight}
						//	});
						//	html.push(self.liTemplate(src));
						//})
						//$listBox.append(html.join(" "));
						//resetList();
						//bindLiEvent();
						//changeViewImg();
						//self.setMaxHeight(self, viewElem.find(".mc"));
					})
				})
			}
		}
	})
})(jQuery);