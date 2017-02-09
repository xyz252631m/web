/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("imgAd", function () {
		return {
			name: "图片广告",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "img-ad ">');
				html.push('<div class = "mc type-carousel">');
				html.push('<div class = "adi-list">');
				html.push('<a href="">');
				html.push('<img src = "../images/img_bg_101.jpg" />');
				html.push('</a>');
				html.push('</div>');
				html.push('<ul class="adi-list-icon">');
				//html.push('<li class="active">.</li>');
				html.push('</ul>');
				html.push('</div>');
				html.push('');
				html.push('</div>');
				return html.join(" ");
			},
			viewItem: function (src, title) {
				var html = [];
				html.push('<a>');
				html.push('<img src = "' + src + '" alt = "">');
				if (title) {
					html.push('<cite class="c-bg"></cite>');
					html.push('<cite class="c-txt">' + title + '</cite>');
				} else {
					html.push('<cite class="c-bg none"></cite>');
					html.push('<cite class="c-txt none"></cite>');
				}
				html.push('</a>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class="set-img-ad" style = "display: block">');
				html.push('<p><span>显示方式：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "carousel" name = "method" checked = "checked"/>折叠轮播 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "method" value = "separate"/>分开显示<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p class="show-size type-car"><span>显示大小：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "big" name = "showSize" checked = "checked"/>大图 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio min-rdi"><input type = "radio" name = "showSize" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<ul class="img-ad-list clearfix">');
				html.push('<li class="move-li"></li>');
				html.push('</ul>');
				html.push('<p class="nav-link"><a><i></i>添加一个广告</a></p>');
				html.push('</div>');
				return html.join(" ");
			},
			liTemplate: function (src) {
				var html = [];
				html.push('<li>');
				html.push('<div class="ad-img-bg">');
				html.push('<img src="' + src + '"/>');
				html.push('<cite class="c-bg"></cite>');
				html.push('<cite class="c-txt">重新上传</cite>');
				html.push('</div>');
				html.push('<div class="ad-img-info">');
				html.push('<p><span>标题：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接：</span><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.push('<a>');
				html.push('<label data-val="店铺主页">店铺主页</label>');
				html.push('<label data-type="会员主页">会员主页</label>');
				html.push('</a>');
				html.push('</label>');
				html.push('</p>');
				html.push('</div>');
				html.push('<i class="i-close">x</i>');
				html.push('</li>');
				return html.join(" ");
			},
			data: {
				method: "carousel",
				showSize: "big",
				imgList: []		//{src,title,link,size:{w,h}}
			},
			getMaxHeight: function (self) {
				var h = [];
				$.each(self.data.imgList, function () {
					h.push(this.size.h / (this.size.w / 320));
				});
				return Math.max.apply([], h);
			},
			setMaxHeight: function (self, elem) {
				if (self.data.method == "carousel") {
					var h = self.getMaxHeight(self);
					elem.height(h);
					elem.find("a").height(h);
				} else {
					elem.height("auto");
					elem.find("a").height("auto")
				}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $radioList = settingElem.find(".label-radio");
				var m_cls = {carousel: "type-carousel", separate: "type-separate"};
				zhx.other.radio($radioList, function (type, value) {
					switch (type) {
						case "method":
							self.data.method = value;
							settingElem.find(".show-size")[zhx.getClassOp(value == "separate")]("type-car");
							if (self.data.method == "carousel" && self.data.showSize == "small") {
								settingElem.find(".show-size .label-radio").eq(0).trigger("click");
							}
							zhx.changeClass(viewElem.find(".mc"), m_cls, value);
							self.setMaxHeight(self, viewElem.find(".mc"));
							break;
						case "showSize":
							self.data.showSize = value;
							zhx.classOp(viewElem.find(".adi-list"), value == "small", "sm-list");
							break;
					}
				});
				//add
				var $listBox = settingElem.find(".img-ad-list"), $viewImgBox = viewElem.find(".adi-list"), $viewIcon = viewElem.find(".adi-list-icon");
				var $list = $listBox.find("li").not(".move-li");
				var resetList = function () {
					$list = $listBox.find("li").not(".move-li");
				}
				var changeViewImg = function () {
					var html = [];
					$.each(self.data.imgList, function () {
						html.push(self.viewItem(this.src, this.title));
					});
					$viewImgBox.html(html.join(" "));
					var iconHtml = [];
					if (self.data.imgList.length > 1) {
						$.each(self.data.imgList, function (idx) {
							if (idx == 0) {
								iconHtml.push('<li class="active">.</li>');
							} else {
								iconHtml.push('<li>.</li>');
							}
						})
						$viewIcon.html(iconHtml.join(" "))
					} else {
						$viewIcon.html("");
					}
					if (self.data.imgList.length == 0) {
						$viewImgBox.html('<a><img src = "../images/img_bg_101.jpg" alt = ""></a>');
						viewElem.find(".mc").removeAttr("style");
					}
				}
				//绑定li事件
				var bindLiEvent = function () {
					//关闭
					$listBox.find(".i-close").unbind("click").bind("click", function () {
						var $li = $(this).parent("li");
						var idx = $list.index($li);
						if (idx >= 0) {
							self.data.imgList.splice(idx, 1);
						}
						$li.remove();
						changeViewImg();
						self.setMaxHeight(self, viewElem.find(".mc"));
					});
					//标题
					$listBox.find(".link-txt input").unbind("blur").bind("blur", function () {
						var val = $(this).val();
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						self.data.imgList[idx].title = val;
						if ($.trim(val)) {
							$viewImgBox.find("a").eq(idx).find(".c-txt").html(val);
							$viewImgBox.find("a").eq(idx).find("cite").removeClass("none");
						} else {
							$viewImgBox.find("a").eq(idx).find("cite").addClass("none");
						}
					});
					//重新选择
					$listBox.find(".c-txt").unbind("click").bind("click", function () {
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						zhx.dialog.imgList(function (list) {
							var $img = list.eq(0).find("img");
							var src = $img.attr("src");
							$li.find("img").attr("src", src);
							self.data.imgList[idx].src = src;
							self.data.imgList[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
							//bindLiEvent();
							changeViewImg();
							self.setMaxHeight(self, viewElem.find(".mc"));
						}, 1);
					})
					//拖拽事件
					$listBox.find("li").unbind("mousedown").bind("mousedown", function (e) {
						var elem = $(this);
						if (e.target.nodeName == "LI") {
							elem.shareDrag($listBox.find(".move-li"), $listBox.find("li").not(".move-li"), function () {
								resetList();
								$list.each(function (idx) {
									var $item = $(this);
									$item.find("input").trigger("blur");
									$item.find(".link-address").trigger("click");
									//修改图片src
									var $img = $item.find("img");
									self.data.imgList[idx].src = $img.attr("src");
									self.data.imgList[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
									changeViewImg();
									self.setMaxHeight(self, viewElem.find(".mc"));
								})
							});
						}
					})
					//选择链接
					var $linkAddress = settingElem.find(".link-address");
					zhx.other.select($linkAddress, function (data) {
						var $item = $(this);
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						self.data.imgList[idx].link = data.value;
						$item.attr("data-val", data.value);
						$item.find("strong").text(data.text);
					});
				}
				settingElem.find(".nav-link").bind("click", function () {
					zhx.dialog.imgList(function (list) {
						var html = [];
						$.each(list, function () {
							var $img = $(this).find("img");
							var src = $img.attr("src");
							self.data.imgList.push({
								src: src,
								link: "",
								title: "",
								size: {w: $img[0].naturalWidth, h: $img[0].naturalHeight}
							});
							html.push(self.liTemplate(src));
						})
						$listBox.append(html.join(" "));
						resetList();
						bindLiEvent();
						changeViewImg();
						self.setMaxHeight(self, viewElem.find(".mc"));
					})
				})
			}
		}
	})
})(jQuery);