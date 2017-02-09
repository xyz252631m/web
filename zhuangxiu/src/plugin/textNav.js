/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("textNav", function () {
		return {
			name: "文本导航",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "text-nav">');
				html.push('<div class = "mc">');
				html.push('<h3><span>点击编辑导航</span><i class = "i-right"></i></h3>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			viewItem: function (title) {
				return '<h3><span>' + (title || "点击编辑导航") + '</span><i class = "i-right"></i></h3>';
			},
			liTemplate: function (src) {
				var html = [];
				html.push('<li>');
				html.push('<p><span>导航名称：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接到：</span><label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.push('<a>');
				html.push('<label style="display: none" data-val="-2"></label>');
				html.push('<label data-val="1">店铺主页</label>');
				html.push('<label data-val="2">会员主页</label>');
				html.push('<label data-val="9">自定义外链</label>');
				html.push('</a><i class="i-icon"></i>');
				html.push('</label>');
				html.push('</p>');
				html.push('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.push('<i class="i-close">x</i>');
				html.push('</li>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-text-nav">');
				html.push('<ul class="stn-nav-list move-ul">');
				html.push('<li class="move-li"></li>');
				html.push('</ul>');
				html.push('<p class="nav-link"><a><i></i>添加一个文本导航</a></p>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				linkList: []	//{title,type, src }
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $listBox = settingElem.find(".stn-nav-list"), $viewLinkBox = viewElem.find(".mc");
				var $list = $listBox.find("li").not(".move-li");
				var resetList = function () {
					$list = $listBox.find("li").not(".move-li");
				}
				var changeViewImg = function () {
					var html = [];
					$.each(self.data.linkList, function () {
						html.push(self.viewItem(this.title));
					});
					$viewLinkBox.html(html.join(" "));
					$viewLinkBox.find("h3").last()[zhx.getClassOp(self.data.linkList.length <= 1)]("no-bor");
					if (self.data.linkList.length == 0) {
						$viewLinkBox.html(self.viewItem());
					}
				}
				//绑定li事件
				var bindLiEvent = function () {
					//关闭
					$listBox.find(".i-close").unbind("click").bind("click", function () {
						var $li = $(this).parent("li");
						var idx = $list.index($li);
						if (idx >= 0) {
							self.data.linkList.splice(idx, 1);
						}
						$li.remove();
						if (self.data.linkList.length < 20) {
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
						self.data.linkList[idx].title = val;
						$viewLinkBox.find("h3").eq(idx).find("span").html(val);
					});
					//拖拽事件
					$listBox.find("li").unbind("mousedown").bind("mousedown", function (e) {
						var elem = $(this);
						if (e.target.nodeName == "P") {
							elem.shareDrag($listBox.find(".move-li"), $listBox.find("li").not(".move-li"), function () {
								resetList();
								$list.each(function () {
									$(this).find("input").trigger("blur");
									if ($(this).find(".link-address .select").length) {
										//console.log($(this).find(".link-address .select"));
										$(this).find(".link-address .select").trigger("click");
									}
								})
							});
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
						var src = self.data.linkList[idx].src = $list.find(".other-link-box input").eq(idx).val();
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
						switch (data.value) {
							case "-2":
								$sname.eq(idx).removeClass("link-mar15").find("em").text(data.text);
								break;
							case "1":
								$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
								break;
							case "2":
								$sname.eq(idx).addClass("link-mar15").find("em").text(data.text);
								break;
							case "9":
								self.data.linkList[idx].src = $list.eq(idx).find(".other-link-box input").val();
								$sname.eq(idx).addClass("link-mar15").find("em").text("外链|" + self.data.linkList[idx].src);
								//trigger
								if (e.isTrigger) {
								} else {
									$list.find(".other-link-box").eq(idx).show();
								}
								break;
						}
						self.data.linkList[idx].type = data.value;
						if (data.value == "-2") {
							$item.find("strong").text("设置链接到的页面地址");
						} else {
							$item.find("strong").text("修改");
						}
					});
					//点击事件
					$sname.find("em").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("em").index(this);
						if (self.data.linkList[idx].type == 9) {
							$list.find(".other-link-box").eq(idx).show();
						}
						//$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
					//删除
					$sname.find("i").unbind("click").bind("click", function () {
						//位置改变---重新获取dom元素
						$sname = $list.find(".link-sname");
						var idx = $sname.find("i").index(this);
						$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
					})
				}
				settingElem.find(".nav-link").bind("click", function () {
					var html = self.liTemplate();
					$listBox.append(html);
					self.data.linkList.push({title: " ", src: "", type: -1});
					if (self.data.linkList.length >= 20) {
						settingElem.find(".nav-link").hide();
					}
					$list = $listBox.find("li").not(".move-li");
					bindLiEvent();
					changeViewImg();
				})
			}
		}
	})
})(jQuery);