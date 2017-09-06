/*
 * des:图片导航
 *
 * */
;(function ($) {
	zhx.addPlugin("imgNav", function () {
		return {
			name: "图片导航",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "img-nav">');
				html.p('<div class = "mc">');
				html.p('<a><img /><p></p></a>');
				html.p('<a><img /><p></p></a>');
				html.p('<a><img /><p></p></a>');
				html.p('<a><img /><p></p></a>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			viewItem: function (src, title) {
				var html = [];
				html.p('<a><img src="' + (src || "") + '"/>');
				html.p('<p>' + (title || "") + '</p>');
				html.p('</a>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-img-nav">');
				html.p('<ul class="sin-img-list">');
				html.p('</ul>');
				html.p('</div>');
				return html.join(" ");
			},
			liTemplate: function (src) {
				var html = [];
				html.p('<li class="clearfix">');
				html.p('<div class="nav-img-bg">');
				html.p('<img/>');
				html.p('<label class="add-img"><i></i>添加图片<input type="file"/></label>');
				html.p('<cite class="c-bg"></cite>');
				html.p('<cite class="c-txt">重新上传<input type="file"/></cite>');
				html.p('<p><em class="msg msg-img">图片不能为空！</em></p>');
				html.p('</div>');
				html.p('<div class="nav-img-info">');
				html.p('<p><span>文字：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
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
				html.p('<p><em class="msg msg-link">链接不能为空！</em></p>');
				html.p('</div>');
				html.p('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.p('</li>');
				return html.join(" ");
			},
			data: {
				list: []//{src,title,link,type,name}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $listBox = settingElem.find(".sin-img-list"), $viewLinkBox = viewElem.find(".mc");
				var $list = $listBox.find("li").not(".move-li");
				var resetList = function () {
					$list = $listBox.find("li").not(".move-li");
				}

				function initLi() {
					var html = [];
					html.push('<li class="move-li clearfix"></li>');
					for (var i = 0; i < 4; i++) {
						html.push(self.liTemplate());
						if (self.data.list.length >= 4) {
						} else {
							self.data.list.push({
								src: "",
								size: {w: 0, h: 0},
								name:"",
								title: "",
								link: "",
								type: ""
							});
						}
					}
					$listBox.html(html.join(" "))
				}

				//var $list = settingElem.find(".label-radio");
				//zhx.other.radio($list,function (type) {
				//	viewElem.find(".mc p").css("border-bottom-style",$(this).val());
				//});
				//settingElem.find(".label-color input").bind("change",function () {
				//	viewElem.find(".mc p").css("border-color",this.value);
				//});
				var changeViewImg = function () {
					self.resetViewImg();
				}
				//绑定li事件
				var bindLiEvent = function () {
					//关闭
					$listBox.find(".i-close").unbind("click").bind("click", function () {
						var $li = $(this).parent("li");
						var idx = $list.index($li);
						if (idx >= 0) {
							self.data.list.splice(idx, 1);
						}
						$li.remove();
						if (self.data.list.length < 20) {
							settingElem.find(".nav-link").show();
						}
						resetList();
						changeViewImg();
					});
					//标题
					$listBox.find(".link-txt input").unbind("blur").bind("blur", function () {
						var val = $(this).val() || " ";
						var $li = $(this).parents("li");
						var idx = $list.index($li);
						self.data.list[idx].title = val;
						$viewLinkBox.find("a").eq(idx).find("p").html(val);
					});
					//重新选择
					$listBox.find(".c-txt input").unbind("change").bind("change", function () {
						var $li = $(this).parents("li");
						//selectImg($li);
						labelSelectImg($li, 0, this.files[0]);
					})
					//添加图片
					settingElem.find(".add-img input").unbind("change").bind("change", function () {
						var $li = $(this).parents("li");
						//selectImg($li, 1);
						labelSelectImg($li, 1, this.files[0]);
					})
					//拖拽事件
					$listBox.find("li").unbind("mousedown").bind("mousedown", function (e) {
						var elem = $(this);
						if (e.target.nodeName == "LI" || e.target.nodeName == "P") {
							elem.shareDrag($listBox.find(".move-li"), $listBox.find("li").not(".move-li"), function () {
								resetList();
								$list.each(function (idx) {
									var $item = $(this);
									$item.find("input").trigger("blur");

									if ($item.find(".link-address .select").length) {
										//console.log($(this).find(".link-address .select"));
										$item.find(".link-address .select").trigger("click");
									}else{
										$item.find(".link-address label").eq(0).trigger("click");
									}
									//修改图片src
									var $img = $item.find("img");
									self.data.list[idx].src = $img.attr("src");
									self.data.list[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
									changeViewImg();
									//self.setMaxHeight(self, viewElem.find(".mc"));
								})
							},e);
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
						var src = self.data.list[idx].link = $list.find(".other-link-box input").eq(idx).val();
						$list.find(".link-sname").eq(idx).find("em").text("外链|" + src);
						$list.find(".other-link-box").eq(idx).hide();
					})
					//选择链接
					var $linkAddress = $list.find(".link-address");
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
								self.data.list[idx].link = obj.src;
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
										name: self.data.list[idx].name,
										src: self.data.list[idx].link
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
										name: self.data.list[idx].name,
										src: self.data.list[idx].link
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
								editTxt(1);
								self.data.list[idx].link = zhx.config.store.mainPageUrl;
								break;
							case "7":
								var src = self.data.list[idx].link = $list.eq(idx).find(".other-link-box input").val();
								setName("外链|" + src);
								//trigger
								if (e.isTrigger) {
								} else {
									$list.find(".other-link-box").eq(idx).show();
								}
								editTxt(1);
								break;
						}
						self.data.list[idx].type = data.value;
						if(data.value>0){
							$li.find(".msg-link").hide();
						}else{
							$li.find(".msg-link").show();
						}
					});
					//点击事件
					$sname.find("em").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("em").index(this);
						if (self.data.list[idx].type == 7) {
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
				initLi();
				resetList();
				bindLiEvent();
				//选择图片
				var selectImg = function ($li, isAdd) {
					var idx = $list.index($li);
					zhx.dialog.imgList(function (list) {
						if (isAdd) {
							$li.find(".add-img").addClass("none");
							$li.find("cite").show();
						}
						var $img = list.eq(0).find("img");
						var src = $img.attr("src");
						$li.find("img").attr("src", src);
						self.data.list[idx].src = src;
						self.data.list[idx].size = {w: $img[0].naturalWidth, h: $img[0].naturalHeight};
						//bindLiEvent();
						changeViewImg();
					}, 1);
				}
				var labelSelectImg = function ($li, isAdd, file) {
					var idx = $list.index($li);
					zhx.data.uploadImg(file).success(function (res) {
						if (res.status == 0) {
							var src = res.url;
							if (isAdd) {
								$li.find(".add-img").addClass("none");
								$li.find("cite").show();
								settingElem.find(".msg-img").eq(idx).hide();
							}
							$li.find("img").attr("src", src);
							self.data.list[idx].src = src;
							self.data.list[idx].size = {w: 0, h: 0};
							//bindLiEvent();
							changeViewImg();
						}else{
							zhx.box.msg(res.message);
						}
					}).error(function () {
						zhx.box.msg("上传失败！");
					});
				}
			},
			resetViewImg: function () {
				var html = [], self = this;
				$.each(self.data.list, function () {
					html.push(self.viewItem(this.src, this.title));
				});
				this.viewElem.find(".mc").html(html.join(" "));
			},
			//验证函数
			check: function () {
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var isSubmit = true, d = this.data;
				var $li = settingElem.find("li").not(".move-li");
				var msg_link = $li.find(".msg-link"), msg_img = $li.find(".msg-img");
				$.each(d.list, function (idx, el) {
					if (el.type > 0) {
						msg_link.eq(idx).hide();
					} else {
						isSubmit = false;
						msg_link.eq(idx).show();
					}
					if (el.src) {
						msg_img.eq(idx).hide();
					} else {
						isSubmit = false;
						msg_img.eq(idx).show();
					}
				})
				//zhx.activeView(this.view);
				return isSubmit;
			},
			edit: function (initData) {
				var d = initData;
				var tem_link = [-2, 1, 2, 5, 7];
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var $listBox = settingElem.find(".sin-img-list");
				var $list = $listBox.find("li").not(".move-li");
				//this.data.list = [];
				$.each(d.list, function (idx, el) {
					var $li = $list.eq(idx);
					if (el.type) {
						$li.find(".add-img").addClass("none");
						$li.find("cite").show();
						$li.find("img").attr("src", el.src);
						$li.find(".link-txt input").val(el.title).trigger("blur");
						if (el.type == 7) {
							//自定义外链
							$li.find(".other-link-box input").val(el.link);
							$li.find(".btn-oth-ok").trigger("click");
						}
						$li.find(".link-address").find("label").eq(tem_link.indexOf(parseInt(el.type))).trigger("click");
					}
				})
				this.resetViewImg();
			}
		}
	})
})(jQuery);