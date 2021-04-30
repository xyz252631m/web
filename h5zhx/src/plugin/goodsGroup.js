/*
 * des:商品分组
 *
 * */
;(function ($) {
	zhx.addPlugin("goodsGroup", function () {
		return {
			name: "商品分组",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			def: {
				imgList: [{
					listingName: "商品1",
					imgUrl_s: zhx.config.imgroot + "goods_bg_01.jpg",
					salePrice: 70,
					p2: 65
				}, {
					listingName: "商品2",
					imgUrl_s: zhx.config.imgroot + "goods_bg_02.jpg",
					salePrice: 240,
					p2: 225
				}, {
					listingName: "商品3",
					imgUrl_s: zhx.config.imgroot + "goods_bg_03.jpg",
					salePrice: 170,
					p2: 165
				}, {
					listingName: "商品4",
					imgUrl_s: zhx.config.imgroot + "goods_bg_04.jpg",
					salePrice: 100,
					p2: 80
				}],
				//商品展示样式
				listClass: {
					"big": "goods-big",
					"small": "goods-small",
					"bigAndSmall": "goods-big-small",
					"detail": "goods-detail"
				},
				//商品展示风格
				listStyle: {
					"card": "card",
					"waterfall": "waterfall",
					"simple": "simple",
					"promotion": "promotion"
				},
				//右侧设置--样式切换
				detailClass: {
					"big": "dta-big",
					"small": "dta-small",
					"bigAndSmall": "dta-bs",
					"detail": "dta-list"
				},
				//右侧设置--风格切换 ---  共用商品展示风格样式名称
				detailStyle: this.listStyle,
				//购买按钮样式
				buyClass: ["buy-none", "buy-1", "buy-2", "buy-3", "buy-4"]
			},
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "goods-list goods-big" style="display: block">');
				html.p('<div class = "mc">');
				html.p('<div class="group group-1 clearfix">');
				html.p('<div class="group-nav">');
				html.p('<ol>');
				html.p('<li class="active"><a>分组1</a></li>');
				html.p('<li><a>分组2</a></li>');
				html.p('<li><a>分组3</a></li>');
				html.p('<li><a>分组4</a></li>');
				html.p('</ol>');
				html.p('</div>');
				html.p('<div class="group-con">');
				html.p('<ol>');
				$.each(this.def.imgList, function () {
					html.p('<li>');
					html.p('<img src = "' + (this.imgUrl_xl || this.imgUrl_s) + '">');
					html.p('<div class="text-con">');
					html.p('<p><a>商品名称</a></p>');
					html.p('<p><em>¥120.00</em></p>');
					html.p('<i class="btn-buy"></i>');
					html.p('</div>');
					html.p('</li>');
				})
				html.p('</ol>');
				html.p('</div>');
				html.p('</div>');
				html.p('<div class = "group group-2">');
				html.p('<ul class="clearfix card buy-4">');
				$.each(this.def.imgList, function (idx) {
					html.p('<li class="li-' + (idx + 1) + '">');
					html.p('<a  class = "goods-img " href = "">');
					html.p('<img src = "' + (this.imgUrl_xl || this.imgUrl_s) + '">');
					html.p('</a>');
					html.p('<div class = "info-box">');
					html.p('<p class="goods-name" href = ""><a>商品名称</a></p>');
					//html.p('<p class="goods-des"><label>商品描述</label></p>');
					html.p('<p class="goods-price">¥' + this.p2 + '</p>');
					html.p('<a class="btn-buy" href = "">订购</a>');
					html.p('</div>');
					html.p('<div class = "promotion-box none">');
					html.p('<div class = "prom-price">');
					html.p('<strong>¥' + this.p2 + '</strong>');
					html.p('<del>原价：¥' + this.p1 + '</del>');
					html.p('</div>');
					html.p('<a class = "btn-prom" href = "">我要抢购</a>');
					html.p('</div>');
					html.p('</li>');
				})
				html.p('</ul>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-goods-list set-goods-group">');
				html.p('<p class="show-view"><span>商品分组模板：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "viewType" value = "list" checked = "checked"/>左侧菜单 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "viewType" value = "group"/>顶部菜单<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<div class="set-group-1">');
				html.p('<p class="nav-link"><a><i></i>添加商品分组</a></p>');
				html.p('<p class="r-tip"><label>选择商品来源后，左侧实时预览暂不支持显示其包含的商品数据</label></p>');
				html.p('</div>');
				html.p('<div class="set-group-2">');
				html.p('<p class="nav-link"><a><i></i>添加商品分组</a></p>');
				html.p('<p class="r-tip"><label>选择商品来源后，左侧实时预览暂不支持显示其包含的商品数据</label></p>');
				html.p('');
				html.p('<p class="list-style"><span>列表样式：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "listStyle" value = "big" checked = "checked"/>大图<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "bigAndSmall"/>一大两小<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "listStyle" value = "detail"/>详细列表<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('');
				html.p('<div class = "detail-info dta-big">');
				html.p('<p class="show-type"><label class = "label-radio label-radio-active"><input type = "radio" name = "cardStyle" value = "card" checked = "checked"/>卡片样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "waterfall"/>瀑布流<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "simple"/>极简样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "cardStyle" value = "promotion"/>促销<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<div class = "style-detail card">');
				html.p('<p class="buy-chk"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showBuy" checked="checked"/>显示购买按钮<i class = "i-icon"></i></label></p>');
				html.p('<p class="buy-btn-style">');
				html.p('<label class = "label-radio "><input type = "radio" value = "1" name = "buyStyle"/>样式1<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "2"/>样式2<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "buyStyle" value = "3"/>样式3<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" name = "buyStyle" value = "4"  checked = "checked"/>样式4<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p class="show-name"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showName" checked="checked"/>显示商品名 <i class = "i-icon"></i></label></p>');
				//html.p('<p class="show-des"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showDes" checked="checked"/>显示商品简介 <i class = "i-icon"></i></label></p>');
				html.p('<p class="show-price"><label class = "label-checkbox label-checkbox-active"><input type = "checkbox" name="showPrice" checked="checked"/>显示价格<i class = "i-icon"></i></label></p>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				//num: 6,				//显示的数量
				viewType: "list",	//list 左侧导航模式（只有列表一种样式） group  顶部导航模式
				pattern: "detail",		//模式	[大图，小图，两大一小，详细]
				type: "card",		//类型	[卡片，瀑布，极简，促销]
				showBuy: 1,			//是否显示购买按钮
				showName: 1,			//是否显示商品名称
				//showDes: 1,			//是否显示商品描述
				showPrice: 1,		//是否显示商品价格
				buyStyle: 4			//购买按钮风格 0为不显示
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $ul = viewElem.find("ul");
				var $radioList = settingElem.find(".label-radio");
				//zhx.other.checkbox(settingElem.find(".label-checkbox"), function () {
				//	var check = $(this).prop("checked");
				//	if (check) {
				//		viewElem.find(".mc p").addClass("is-blank");
				//	} else {
				//		viewElem.find(".mc p").removeClass("is-blank");
				//	}
				//});
				//面板1----添加分组
				settingElem.find(".nav-link").bind("click", function () {
					zhx.dialog.selectGroup(function (list) {
						console.log(list)
					})
				})
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
				zhx.other.radio($radioList, function (type, value, e) {
					switch (type) {
						case "viewType":
							self.data.viewType = value;
							if (value == "list") {
								viewElem.find(".group-1").show();
								viewElem.find(".group-2").hide();
								settingElem.find(".set-group-1").show();
								settingElem.find(".set-group-2").hide();
							} else {
								viewElem.find(".group-1").hide();
								viewElem.find(".group-2").show();
								settingElem.find(".set-group-1").hide();
								settingElem.find(".set-group-2").show();
							}
							break;
						case "listStyle":
							self.data.pattern = value;
							zhx.changeClass($detailInfo, detailClass, value);
							zhx.resetHeight();
							if (settingElem.find(".show-type .label-radio-active").is(":hidden")) {
								settingElem.find(".show-type .label-radio").eq(0).trigger("click");
							}
							break;
						case "cardStyle":
							self.data.type = value;
							zhx.changeClass($styleOther, detailStyle, value);
							//详细列表-极简风格
							if (self.data.pattern == "detail" && value == "simple") {
								if (self.data.buyStyle == 3) {
									settingElem.find(".buy-btn-style .label-radio").eq(0).trigger("click");
								}
							}
							self.addGoodsListHtml();
							break;
						case "buyStyle":
							self.data.buyStyle = value;
							break;
					}
					if (!e.isTrigger) {
						self.resetHtml(self.data);
					}
					viewElem.find(".mc p").css("border-bottom-style", $(this).val());
				});
				//购买选项
				var $chkList = settingElem.find(".label-checkbox");
				//elem
				var $buyChk = settingElem.find(".buy-chk");
				var $buyStyle = settingElem.find(".buy-btn-style");
				zhx.other.checkbox($chkList, function (type, value, e) {
					switch (type) {
						case "showBuy":
							self.data.showBuy = value;
							if (!value) {
								self.data.buyStyle = 0;
							} else {
								self.data.buyStyle = $buyStyle.find("input:checked").val();
							}
							$buyStyle.toggleClass("none", !value);//false 隐藏
							break;
						case "showName":
							self.data.showName = value;
							break;
						case "showPrice":
							self.data.showPrice = value;
							break;
					}
					if (!e.isTrigger) {
						self.resetHtml(self.data);
					}
				});
			},
			//isWaterfall : 是否为瀑布流
			addGoodsListHtml: function () {
				var isWaterfall = this.data.type == "waterfall";
				var list = this.data.goodsList;
				if (list && list.length) {
				} else {
					list = this.def.imgList;
				}
				var leftArr = [], rightArr = [];
				var liStr = function (item, idx) {
					var h = [];
					h.p('<li class="li-' + (idx + 1) + '">');
					h.p('<a  class = "goods-img " href = "">');
					h.p('<img src = "' + (item.imgUrl_xl || item.imgUrl_s) + '">');
					h.p('</a>');
					h.p('<div class = "info-box">');
					h.p('<p class="goods-name" href = ""><a>' + item.listingName + '</a></p>');
					h.p('<p class="goods-price">¥' + item.salePrice + '</p>');
					h.p('<a class="btn-buy" href = "">订购</a>');
					h.p('</div>');
					h.p('<div class = "promotion-box none">');
					h.p('<div class = "prom-price">');
					h.p('<strong>¥' + item.salePrice + '</strong>');
					h.p('<del>原价：¥' + (item.p1 || "") + '</del>');
					h.p('</div>');
					h.p('<a class = "btn-prom" href = "" data-id="' + item.listingId + '">我要抢购</a>');
					h.p('</div>');
					h.p('</li>');
					return h;
				}
				$.each(list, function (idx) {
					if (isWaterfall) {
						if (idx % 2) {
							Array.prototype.push.apply(rightArr, liStr(this, idx));
						} else {
							Array.prototype.push.apply(leftArr, liStr(this, idx));
						}
					} else {
						Array.prototype.push.apply(leftArr, liStr(this, idx));
					}
				})
				if (isWaterfall) {
					this.viewElem.find(".ul-1").html(leftArr.join(" "));
					this.viewElem.find(".ul-2").html(rightArr.join(" ")).show();
				} else {
					this.viewElem.find(".ul-1").html(leftArr.join(" "));
					this.viewElem.find(".ul-2").hide();
				}
			},
			removeGoods: function (id) {
				var self = this;
				$.each(this.data.goodsList, function (idx) {
					if (this.id == id) {
						self.data.goodsList.splice(idx, 1);
					}
				})
			},
			resetHtml: function (initData) {
				var self = this;
				var fn = function () {
					var viewElem = this.viewElem, settingElem = this.settingElem;
					var mainView = viewElem.find(".mc");//.clone();
					var $ul = viewElem.find("ul");
					var d = initData;//$.extend(this.data, initData);
					//列表样式
					zhx.changeClass(viewElem, this.def.listClass, d.pattern);
					//卡片样式
					zhx.changeClass(mainView.find("ul"), this.def.listStyle, d.type);
					//购买按钮
					//if (d.showBuy) {
					zhx.changeClass($ul, self.def.buyClass, d.buyStyle);
					//}
					//瀑布风格时进行判断
					if (self.data.type == "waterfall") {
						//只有按钮时
						mainView.find(".info-box").toggleClass('pos-box', (!self.data.showName && !self.data.showPrice && self.data.showBuy));
						mainView.find(".info-box").toggleClass('h-none', (!self.data.showName && !self.data.showPrice && self.data.showBuy));
						//显示商品名称修改高度
						//mainView.find(".info-box").toggleClass("h-25", !d.showName);
					} else {
						//mainView.find(".info-box").removeClass("h-25")
					}
					//名称
					mainView.find(".goods-name").toggleClass("none", !d.showName);
					//价格
					mainView.find(".goods-price").toggleClass("none", !d.showPrice);
				}
				requestAnimationFrame(function () {
					fn.apply(self);
				})
			},
			resetSetting: function (initData) {
				var self = this;
				var fn = function () {
					var viewElem = this.viewElem, settingElem = this.settingElem;
					var d = $.extend(this.data, initData);
					var patternList = ["big", "small", "bigAndSmall", "detail"];
					var index = patternList.indexOf(d.pattern);
					if (!~index) {
						index = 0;
					}
					zhx.changeClass(settingElem.find(".detail-info"), this.def.detailClass, d.pattern);
					//列表样式
					settingElem.find(".list-style .label-radio").eq(index).trigger("click");
					//购买按钮
					zhx.other.activeCheck(settingElem.find(".buy-chk label"), !!d.showBuy);
					//购买按钮样式
					settingElem.find(".buy-btn-style .label-radio").eq(d.showBuy).trigger("click");
				}
				requestAnimationFrame(function () {
					fn.apply(self);
				})
			},
			edit: function (initData) {
				var self = this;
				this.resetHtml(initData);
				this.resetSetting(initData);
				var param = {
					listings: initData.itemIds.join(",")
				}
				zhx.data.getGoods(param).then(function (res) {
					var list = res.listingList;
					if (list && list.length) {
						Array.prototype.push.apply(self.data.goodsList, list);
						var html = self.minGoodsStr(list);
						$(".li-add").before(html);
					} else {
						self.data.goodsList = [];
					}
					self.addGoodsListHtml();
					self.resetHtml(self.data);
				})
			}
		}
	})
})(jQuery);