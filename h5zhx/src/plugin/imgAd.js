/*
 * des: 图片广告
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
				html.p('<div class = "img-ad ">');
				html.p('<div class = "mc type-carousel">');
				html.p('<div class = "adi-list">');
				html.p('<a href="">');
				html.p('<img src = "' + zhx.config.imgroot + '/img_bg_101.jpg" />');
				html.p('</a>');
				html.p('</div>');
				html.p('<ul class="adi-list-icon">');
				//html.p('<li class="active">.</li>');
				html.p('</ul>');
				html.p('</div>');
				html.p('');
				html.p('</div>');
				return html.join(" ");
			},
			viewItem: function (src, title) {
				var html = [];
				html.p('<a>');
				html.p('<img src = "' + src + '" alt = "">');
				if (title) {
					html.p('<cite class="c-bg"></cite>');
					html.p('<cite class="c-txt">' + title + '</cite>');
				} else {
					html.p('<cite class="c-bg none"></cite>');
					html.p('<cite class="c-txt none"></cite>');
				}
				html.p('</a>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class="set-img-ad" style = "display: block">');
				html.p('<p class="show-method"><span>显示方式：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" value = "carousel" name = "method" checked = "checked"/>折叠轮播 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "method" value = "separate"/>分开显示<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p class="show-size type-car"><span>显示大小：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" value = "big" name = "showSize" checked = "checked"/>大图 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio min-rdi"><input type = "radio" name = "showSize" value = "small"/>小图<i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<ul class="img-ad-list clearfix">');
				html.p('<li class="move-li"></li>');
				html.p('</ul>');
				html.p('<p class="nav-link"><label><i></i>添加一个广告<input type="file"/></label></p>');
				html.p('</div>');
				return html.join(" ");
			},
			liTemplate: function (src) {
				var html = [];
				html.p('<li>');
				html.p('<div class="ad-img-bg">');
				html.p('<img src="' + src + '"/>');
				html.p('<cite class="c-bg"></cite>');
				html.p('<cite class="c-txt"><label >重新上传<input type="file"/></label></cite>');
				html.p('</div>');
				html.p('<div class="ad-img-info">');
				html.p('<p><span>标题：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>链接：</span><label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.p('<a>');
				html.p('<label style="display: none" data-val="-2"></label>');
				html.p('<label data-val="1">微页面</label>');
				html.p('<label data-val="2">商品</label>');
				// html.p('<label data-val="3">营销活动</label>');
				html.p('<label data-val="5">店铺主页</label>');
				html.p('<label data-val="7">自定义外链</label>');
				html.p('</a><i class="i-icon"></i>');
				html.p('</label>');
				html.p('</p>');
				html.p('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.p('</div>');
				html.p('<i class="i-close">x</i>');
				html.p('</li>');
				return html.join(" ");
			},
			data: {
				method: "carousel",
				showSize: "big",
				imgList: []		//{src,title,link,type,name,size:{w,h}}
			},

			checkImg: function ($list, callback) {
				var h_list = [];
				$.each($list, function (idx, el) {
					var img = $list.eq(idx).find("img")[0];
					if (img.src) {
						var check = function () {
							// 只要任何一方大于0 表示服务器已经返回宽高
							if (img.width > 0 || img.height > 0) {
								h_list.push(img.height);
								clearInterval(set);
								if (h_list.length == $list.length) {
									callback && callback(h_list);
								}
							}
						};
						var set = setInterval(check, 40);
					}
				})
			},
			setMaxHeight: function (self, elem) {
				if (self.data.method == "carousel") {
					if (self.data.imgList.length < 2) {
						elem.height("auto");
						elem.find("a").height("auto");
						return;
					}
					self.checkImg(elem.find(".adi-list"),function (h_list) {
						var h = Math.max.apply([], h_list);
						elem.height(h);
						elem.find("a").height(h);
					})


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
							settingElem.find(".show-size").toggleClass("type-car", value != "separate");
							if (self.data.method == "carousel" && self.data.showSize == "small") {
								settingElem.find(".show-size .label-radio").eq(0).trigger("click");
							}
							zhx.changeClass(viewElem.find(".mc"), m_cls, value);
							self.setMaxHeight(self, viewElem.find(".mc"));
							break;
						case "showSize":
							self.data.showSize = value;
							viewElem.find(".adi-list").toggleClass("sm-list", value == "small");
							break;
					}
				});
				//add
				var $listBox = settingElem.find(".img-ad-list"), $viewImgBox = viewElem.find(".adi-list"), $viewIcon = viewElem.find(".adi-list-icon");
				var $list = $listBox.find("li").not(".move-li");
				var resetList = function () {
					$list = $listBox.find("li").not(".move-li");
				}
				//编辑事件
				settingElem.find(".img-ad-list").bind("editEvent", function () {
					var list = self.data.imgList;
					$.each(list, function (idx, el) {
						$listBox.append(self.liTemplate(el.src));
					})
					resetList();
					bindLiEvent();
					changeViewImg();
					self.setMaxHeight(self, viewElem.find(".mc"));
				})
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
						$viewImgBox.html('<a><img src = "' + zhx.config.imgroot + '/img_bg_101.jpg" alt = ""></a>');
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
						resetList();
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
					$listBox.find(".c-txt input").unbind("change").bind("change", function () {
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						//zhx.dialog.imgList(function (list) {
						//	var $img = list.eq(0).find("img");
						//	var src = $img.attr("src");
						//	$li.find("img").attr("src", src);
						//	self.data.imgList[idx].src = src;
						//	self.data.imgList[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
						//	//bindLiEvent();
						//	changeViewImg();
						//	self.setMaxHeight(self, viewElem.find(".mc"));
						//}, 1);
						var file = this.files[0];
						zhx.data.uploadImg(file).success(function (res) {
							if (res.status == 0) {
								//self.data.logoSrc = res.url;
								//viewElem.find(".ba-logo img").attr("src", res.url);
								//settingElem.find(".sb-logo img").attr("src", res.url);
								var src = res.url;
								$li.find("img").attr("src", src);
								self.data.imgList[idx].src = src;
								//bindLiEvent();
								changeViewImg();
								self.setMaxHeight(self, viewElem.find(".mc"));
							}else{
								zhx.box.msg(res.message);
							}
						}).error(function () {
							zhx.box.msg("上传失败！");
						});
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
							}, e);
						}
					})
					//外链关闭
					$listBox.find(".btn-oth-cel").unbind("click").bind("click", function () {
						var idx = $listBox.find(".btn-oth-cel").index(this);
						$listBox.find(".other-link-box").eq(idx).hide();
					})
					//外链确认
					$listBox.find(".btn-oth-ok").unbind("click").bind("click", function () {
						var idx = $list.find(".btn-oth-ok").index(this);
						var src = self.data.imgList[idx].link = $list.find(".other-link-box input").eq(idx).val();
						$list.find(".link-sname").eq(idx).find("em").text("外链|" + src);
						$list.find(".other-link-box").eq(idx).hide();
					})
					//选择链接
					var $linkAddress = $list.find(".link-address");
					//zhx.other.select($linkAddress, function (data) {
					//	var $item = $(this);
					//	var $li = $(this).parents("li");
					//	var idx = $list.index($li);
					//	self.data.imgList[idx].link = data.value;
					//	$item.attr("data-val", data.value);
					//	$item.find("strong").text(data.text);
					//});
					var $sname = $list.find(".link-sname");
					zhx.other.select($linkAddress, function (data, e) {
						var $item = $(this);
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						$item.attr("data-val", data.value);
						var editTxt = function (b) {
							$item.find("strong").text(b ? "修改" : "设置链接到的页面地址");
						}
						var setName = function (name) {
							$sname.eq(idx).addClass("link-mar15").find("em").text(name);
						}
						var setLinkObj = function (obj) {
							if (obj) {
								setName(obj.typeName + "|" + obj.name);
								self.data.imgList[idx].link = obj.src;
								editTxt(1);
							}
						}
						switch (data.value) {
							case "-2":
								$sname.eq(idx).removeClass("link-mar15").find("em").text(data.text);
								editTxt(0);
								break;
							case "1":
								if (e.isTrigger) {
									var obj = {
										typeName: data.text,
										name: self.data.imgList[idx].name,
										src: self.data.imgList[idx].link
									}
									setLinkObj(obj);
								} else {
									zhx.dialog.selectMinPage(setLinkObj);
								}
								break;
							case "2":
								if (e.isTrigger) {
									var obj = {
										typeName: data.text,
										name: self.data.imgList[idx].name,
										src: self.data.imgList[idx].link
									}
									setLinkObj(obj);
								} else {
									zhx.dialog.selectGoodsSingleton(setLinkObj);
								}
								break;
							case "3":
								zhx.dialog.selectActivity(setLinkObj);
								break;
							case "5":
								$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
								self.data.imgList[idx].link = zhx.config.store.mainPageUrl;
								editTxt(1);
								break;
							case "7":
								self.data.imgList[idx].link = $list.eq(idx).find(".other-link-box input").val();
								$sname.eq(idx).addClass("link-mar15").find("em").text("外链|" + self.data.imgList[idx].link);
								//trigger
								if (e.isTrigger) {
								} else {
									$list.find(".other-link-box").eq(idx).show();
								}
								editTxt(1);
								break;
						}
						self.data.imgList[idx].type = data.value;
					});
					//点击事件
					$sname.find("em").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("em").index(this);
						if (self.data.imgList[idx].type == 7) {
							$list.find(".other-link-box").eq(idx).show();
						}
						//$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
					//删除
					$sname.find("i").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("i").index(this);
						$list.eq(idx).find(".other-link-box input").val("");
						$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
				}
				//settingElem.find(".nav-link").bind("click", function () {
				//zhx.dialog.imgList(function (list) {
				//	var html = [];
				//	$.each(list, function () {
				//		var $img = $(this).find("img");
				//		var src = $img.attr("src");
				//		self.data.imgList.push({
				//			src: src,
				//			link: "",
				//			type: "",  //链接类型
				//			title: "",
				//			size: {w: $img[0].naturalWidth, h: $img[0].naturalHeight}
				//		});
				//		html.push(self.liTemplate(src));
				//	})
				//	$listBox.append(html.join(" "));
				//	resetList();
				//	bindLiEvent();
				//	changeViewImg();
				//	self.setMaxHeight(self, viewElem.find(".mc"));
				//})
				//})
				settingElem.find(".nav-link input").bind("change", function () {
					var file = this.files[0];
					zhx.data.uploadImg(file).success(function (res) {
						if (res.status == 0) {
							//self.data.logoSrc = res.url;
							//viewElem.find(".ba-logo img").attr("src", res.url);
							//settingElem.find(".sb-logo img").attr("src", res.url);
							var src = res.url;
							self.data.imgList.push({
								src: src,
								link: "",
								type: "",  //链接类型
								title: "",
								name:"",
								size: {w: 0, h: 0}
							});
							$listBox.append(self.liTemplate(src));
							resetList();
							bindLiEvent();
							changeViewImg();
							self.setMaxHeight(self, viewElem.find(".mc"));
						}else{
							zhx.box.msg(res.message);
						}
					}).error(function () {
						zhx.box.msg("上传失败！");
					});
				});
			},
			edit: function (initData) {
				var d = $.extend({}, this.data, initData);
				var tem_link = [-2, 1, 2, 5, 7];
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var $listBox = settingElem.find(".img-ad-list");
				$listBox.trigger("editEvent");
				if (d.method == "separate") {
					settingElem.find(".show-method").find(".label-radio").eq(1).trigger("click");
				}
				if (d.showSize == "small") {
					settingElem.find(".show-size").find(".label-radio").eq(1).trigger("click");
				}
				if (d.imgList) {
					var $list = $listBox.find("li").not(".move-li");
					$.each(d.imgList, function (idx, el) {
						$list.eq(idx).find(".link-txt input").val(el.title).trigger("blur");
						if (el.type == 7) {
							//自定义外链
							$list.eq(idx).find(".other-link-box input").val(el.link);
							$list.eq(idx).find(".btn-oth-ok").trigger("click");
						}
						$list.eq(idx).find(".link-address").find("label").eq(tem_link.indexOf(parseInt(el.type))).trigger("click");
					})
				}
			}
		}
	})
})(jQuery);