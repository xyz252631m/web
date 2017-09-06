/*
 * des: 标题
 *
 * */
;(function ($) {
	zhx.addPlugin("textTitle", function () {
		return {
			name: "标题",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.p('<div class = "text-title">');
				html.p('<div class = "mc">');
				html.p('<div class = "panel-1">');
				html.p('<h3><span>点击编辑标题</span><label>-<a></a></label></h3>');
				html.p('<p class="tt-subtitle"><label></label></p>');
				html.p('</div>');
				html.p('<div class = "panel-2">');
				html.p('<h3><span>点击编辑标题</span></h3>');
				html.p('<p class="tt-subtitle clearfix"><label class="tt-date"></label> <label class="tt-author"></label> <a></a></p>');
				html.p('</div>');
				html.p('</div>');
				html.p('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.p('<div class = "set-text-title" style = "display: block">');
				html.p('<p><span><em>*</em>标题名：</span><label class = "label-input stt-title"><input type = "text" defaultValue="点击编辑标题" maxlength = "20"></label></p>');
				html.p('<p><em class="msg msg-title">标题不能为空！</em></p>');
				html.p('<p><span>标题模版：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" value = "tradition" name = "titleType" checked = "checked"/>传统样式<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "titleType" value = "wx"/>模仿微信图文页样式 <i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<div class="panel-1">');
				html.p('<p><span>副标题：</span><label class = "label-input stt-subtitle"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>显示：</span>');
				html.p('<label class = "label-radio label-radio-active"><input type = "radio" value = "left" name = "textAlign" checked = "checked"/>居左 <i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "textAlign" value = "center"/>居中<i class = "i-icon"></i></label>');
				html.p('<label class = "label-radio"><input type = "radio" name = "textAlign" value = "right"/>居右 <i class = "i-icon"></i></label>');
				html.p('</p>');
				html.p('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.p('<p class="nav-link"><a><i></i>添加一个文本导航</a></p>');
				html.p('<div class="link-text-box">');
				html.p('<p><span><em>*</em>名称：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span><em>*</em>链接：</span><label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address subtitle-link"><strong>设置链接到的页面地址</strong>');
				html.p('<a>');
				html.p('<label style="display: none" data-val="-2"></label>');
				html.p('<label data-val="1">微页面</label>');
				html.p('<label data-val="2">商品</label>');
				// html.p('<label data-val="3">营销活动</label>');
				html.p('<label data-val="5">店铺主页</label>');
				html.p('<label data-val="7">自定义外链</label>');
				html.p('</a><i class="i-icon"></i>');
				html.p('</label></p>');
				html.p('<i class="i-close">x</i>');
				html.p('<div class="other-link-box"><p><label class="label-input label-oth-link"><input maxlength="100" placeholder="链接地址: http://example.com"/></label><a class="btn-oth-ok">确认</a><a class="btn-oth-cel">取消</a></p><i class="i-top"></i></div>')
				html.p('</div>');
				html.p('</div>');
				html.p('<div class="panel-2">');
				html.p('<p><span>日期：</span><label class = "label-input stt-date"><input type = "text" maxlength = "20" onfocus = "WdatePicker()"></label></p>');
				html.p('<p><span>作者：</span><label class = "label-input stt-author"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>链接标题：</span><label class = "label-input stt-link-text"><input type = "text" maxlength = "20"></label></p>');
				html.p('<p><span>链接地址：</span> ');
				//html.p('<label class = "label-radio "><input type = "radio" value = "follow" name = "linkType"/>引导关注<i class = "i-icon"></i></label>');
				//html.p('<a class="set-fast-link">设置快速关注链接</a>')
			//	html.p('</p>');
				//html.p('<p><span></span>');
				html.p('<label class = "other-link-radio label-radio label-radio-active"><input type = "radio" value = "other"  checked = "checked" name = "linkType"/>其它链接<i class = "i-icon"></i></label>');
				html.p('<label class="link-sname"><em></em><i>X</i></label><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
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
				html.p('</div>');
				return html.join(" ");
			},
			data: {
				title: "",	//标题
				titleType: "tradition",  //类型 常规 或 仿微信
				tradition: {
					hasLink: 0,	//是否有链接
					link: {
						text: "",
						name:"",
						type: "",
						src: ""
					},
					titleBg: "#ffffff",
					txtAlign: "left",	//align 样式
					subtitle: ""	//副标题
				},
				wx: {
					datetime: "",
					author: "",
					linkTitle: "",
					linkType: "other",	//follow other
					link: {
						type: "",
						name:"",
						src: ""
					}
				}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var tra = self.data.tradition, wx = self.data.wx;
				var $radioList = settingElem.find(".label-radio");
				settingElem.find(".stt-title input").bind("blur", function () {
					var $input = $(this), val = $input.val(), deVal = $input.attr("defaultValue");
					viewElem.find("h3 span").text(val || deVal);
					self.data.title = val;
					if($.trim(val)){
						settingElem.find(".msg-title").hide();
					}
				})
				settingElem.find(".stt-subtitle input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".panel-1 .tt-subtitle label").text(val);
					tra.subtitle = val;
				})
				//添加一个导航
				var $link = viewElem.find("h3 label");
				var $linkBox = settingElem.find(".link-text-box");
				//标题
				settingElem.find(".nav-link").bind("click", function () {
					var $box = $(this);
					$box.hide();
					$link.show();
					$linkBox.show();
					tra.hasLink = 1;
				})
				//背景色
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".mc").css("background-color", this.value);
					tra.titleBg = this.value;
				});
				//背景色重置
				settingElem.find(".btn-reset").bind("click", function () {
					//viewElem.css("background-color", "#ffffff");
					settingElem.find(".label-color input").val("#ffffff");
					settingElem.find(".label-color input").trigger("change");
				})
				//关闭链接
				settingElem.find(".i-close").bind("click", function () {
					settingElem.find(".nav-link").show();
					$link.hide();
					$linkBox.hide();
					tra.hasLink = 0;
				})
				//链接
				settingElem.find(".link-txt input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find("h3 label a").text(val);
					tra.link.text = val;
				})
				//panel - 2
				//外链关闭
				settingElem.find(".btn-oth-cel").unbind("click").bind("click", function () {
					var idx = settingElem.find(".btn-oth-cel").index(this);
					settingElem.find(".other-link-box").eq(idx).hide();
				})
				//外链确认
				settingElem.find(".btn-oth-ok").unbind("click").bind("click", function () {
					var idx = settingElem.find(".btn-oth-ok").index(this);
					var src = settingElem.find(".other-link-box input").eq(idx).val();
					if (idx==0) {
						//tra.link.type = 7;
						tra.link.src = src;
					} else {
						//wx.link.type = 7;
						wx.link.src = src;
					}
					settingElem.find(".link-sname").eq(idx).find("em").text("外链|" + src);
					settingElem.find(".other-link-box").eq(idx).hide();
				})
				var $linkAddress = settingElem.find(".link-address");
				var $sname = settingElem.find(".link-sname");
				zhx.other.select($linkAddress, function (data, e) {
					var $item = $(this);
					$item.attr("data-val", data.value);
					//$item.find("strong").text(data.text);
					var idx = $linkAddress.index($item);
					var src = "";
					//console.log(data.value)
					var editTxt = function (b) {
						$item.find("strong").text(b ? "修改" : "设置链接到的页面地址");
					}
					var setName = function (name) {
						$sname.eq(idx).addClass("link-mar15").find("em").text(name);
					}
					var setLinkObj = function (obj) {
						if (obj) {
							setName(obj.typeName + "|" + obj.name);
							if ($item.hasClass("subtitle-link")) {
								tra.link.type = data.value;
								tra.link.name = obj.name;
								tra.link.src = obj.src;
							} else {
								wx.link.type = data.value;
								wx.link.name = obj.name;
								wx.link.src = obj.src;
							}
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
									name: wx.link.name,
									src: wx.link.src
								}
								if ($item.hasClass("subtitle-link")) {
									if (tra.link) {
										obj.name = tra.link.name;
										obj.src = tra.link.src;
									}
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
									name: wx.link.name,
									src: wx.link.src
								}
								if ($item.hasClass("subtitle-link")) {
									if (tra.link) {
										obj.name = tra.link.name;
										obj.src = tra.link.src;
									}
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
							if ($item.hasClass("subtitle-link")) {
								tra.link.type = data.value;
								tra.link.src = zhx.config.store.mainPageUrl;
							} else {
								wx.link.type = data.value;
								wx.link.src = zhx.config.store.mainPageUrl;
							}
							editTxt(1);
							break;
						case "7":
							src = settingElem.find(".other-link-box input").eq(idx).val();
							$sname.eq(idx).addClass("link-mar15").find("em").text("外链|" + src);
							if ($item.hasClass("subtitle-link")) {
								tra.link.type = data.value;
								tra.link.src = src;
							} else {
								wx.link.type = data.value;
								wx.link.src = src;
							}
							//trigger
							if (e.isTrigger) {
							} else {
								settingElem.find(".other-link-box").eq(idx).show();
							}
							editTxt(1);
							break;
					}
				});
				//点击事件
				$sname.find("em").unbind("click").bind("click", function () {
					//位置改变---重新获取dom元素
					$sname = settingElem.find(".link-sname");
					var idx = $sname.find("em").index(this);
					var type;
					if (idx) {
						type = wx.link.type;
					} else {
						type = tra.link.type;
					}
					if (type == 7) {
						settingElem.find(".other-link-box").eq(idx).show();
					}
					//$list.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
				})
				//删除
				$sname.find("i").unbind("click").bind("click", function () {
					//位置改变---重新获取dom元素
					$sname = settingElem.find(".link-sname");
					var idx = $sname.find("i").index(this);
					settingElem.find(".other-link-box input").eq(idx).val("");
					settingElem.find(".link-address").eq(idx).find("label").eq(0).trigger("click");
				})
				settingElem.find(".stt-date input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-date").text(val);
					wx.datetime = val;
				})
				settingElem.find(".stt-author input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-author").text(val);
					wx.author = val;
				})
				settingElem.find(".stt-link-text input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-subtitle a").text(val);
					wx.linkTitle = val;
				})
				//
				var panelShow = function (idx) {
					viewElem.find(".panel-" + idx).show();
					settingElem.find(".panel-" + idx).show();
				}
				var panelHide = function (idx) {
					viewElem.find(".panel-" + idx).hide();
					settingElem.find(".panel-" + idx).hide();
				}
				zhx.other.radio($radioList, function (type, value) {
					switch (type) {
						case "titleType":
							self.data.titleType = value;
							if (value == "tradition") {
								panelShow(1);
								panelHide(2);
								settingElem.find(".label-color input").trigger("change");
							} else {//wx
								panelHide(1);
								panelShow(2);
								viewElem.find(".mc").removeAttr("style");
							}
							break;
						case "textAlign":
							var alignClass = {
								"left": "txt-left",
								"center": "txt-center",
								"right": "txt-right"
							};
							zhx.changeClass(viewElem.find(".panel-1"), alignClass, value);
							tra.txtAlign = value;
							break;
						case "linkType":
							wx.linkType = value;
							break;
					}
				});
			},
			check: function () {
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var isSubmit = true, d = this.data;
				var msg_title = settingElem.find(".msg-title");
				if (!$.trim(d.title)) {
					isSubmit = false;
					msg_title.show();
				} else {
					msg_title.hide();
				}
				return isSubmit;
			},
			edit: function (initData) {
				var d = $.extend({}, this.data, initData);
				var viewElem = this.viewElem, settingElem = this.settingElem;
				var tem_link = [-2, 1, 2, 5, 7];
				settingElem.find(".stt-title input").val(d.title).trigger("blur");
				if (d.titleType == "tradition") {
					//tradition
					settingElem.find(".stt-subtitle input").val(d.tradition.subtitle).trigger("blur");
					var alignList = ["left", "center", "right"];
					settingElem.find(".panel-1 .label-radio").eq(alignList.indexOf(d.tradition.txtAlign)).trigger("click");
					settingElem.find(".label-color input").val(d.tradition.titleBg).trigger("change");
					if (d.tradition.hasLink) {
						settingElem.find(".nav-link").trigger("click");
						settingElem.find(".link-txt input").val(d.tradition.link.text).trigger("blur");
						settingElem.find(".panel-1 .link-address label").eq(tem_link.indexOf(parseInt(d.tradition.link.type))).trigger("click");
						if (d.tradition.link.type == 7) {
							//自定义外链
							settingElem.find(".panel-1 .other-link-box input").val(d.tradition.link.src);
							settingElem.find(".panel-1 .btn-oth-ok").trigger("click");
						}
					}
				} else {
					//wx
					settingElem.find(".label-radio").eq(1).trigger("click");
					settingElem.find(".stt-date input").val(d.wx.datetime).trigger("blur");
					settingElem.find(".stt-author input").val(d.wx.author).trigger("blur");
					settingElem.find(".stt-link-text input").val(d.wx.linkTitle).trigger("blur");
					if (d.wx.linkType == "other") {
						settingElem.find(".other-link-radio ").trigger("click");
						if (d.wx.link.type == 7) {
							//自定义外链
							settingElem.find(".panel-2 .other-link-box input").val(d.wx.link.src);
							settingElem.find(".panel-2 .btn-oth-ok").trigger("click");
						}
						settingElem.find(".panel-2 .link-address label").eq(tem_link.indexOf(parseInt(d.wx.link.type))).trigger("click");
					}
				}
			}
		}
	})
})(jQuery);