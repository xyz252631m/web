/*
 * des: banner and logo
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
				html.push('<div class = "text-title">');
				html.push('<div class = "mc">');
				html.push('<div class = "panel-1">');
				html.push('<h3><span>点击编辑标题</span><label>-<a></a></label></h3>');
				html.push('<p class="tt-subtitle"><label></label></p>');
				html.push('</div>');
				html.push('<div class = "panel-2">');
				html.push('<h3><span>点击编辑标题</span></h3>');
				html.push('<p class="tt-subtitle clearfix"><label class="tt-date"></label> <label class="tt-author"></label> <a></a></p>');
				html.push('</div>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-text-title" style = "display: block">');
				html.push('<p><span><em>*</em>标题名：</span><label class = "label-input stt-title"><input type = "text" defaultValue="点击编辑标题" maxlength = "20"></label></p>');
				html.push('<p><span>标题模版：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "tradition" name = "titleType" checked = "checked"/>传统样式<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "titleType" value = "wx"/>模仿微信图文页样式 <i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<div class="panel-1">');
				html.push('<p><span>副标题：</span><label class = "label-input stt-subtitle"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>显示：</span>');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "left" name = "textAlign" checked = "checked"/>居左 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "textAlign" value = "center"/>居中<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" name = "textAlign" value = "right"/>居右 <i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p><span>背景颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class = "btn-reset" type = "button" value = "重置"/></p>');
				html.push('<p class="nav-link"><a><i></i>添加一个文本导航</a></p>');
				html.push('<div class="link-text-box">');
				html.push('<p><span><em>*</em>名称：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span><em>*</em>链接：</span><label class = "label-select link-address subtitle-link"><strong>设置链接到的页面地址</strong>');
				html.push('<a>');
				html.push('<label data-val="店铺主页">店铺主页</label>');
				html.push('<label data-val="会员主页">会员主页</label>');
				html.push('</a>');
				html.push('</label></p>');
				html.push('<i class="i-close">x</i>');
				html.push('</div>');
				html.push('</div>');
				html.push('<div class="panel-2">');
				html.push('<p><span>日期：</span><label class = "label-input stt-date"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>作者：</span><label class = "label-input stt-author"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接标题：</span><label class = "label-input stt-link-text"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接地址：</span> ');
				html.push('<label class = "label-radio label-radio-active"><input type = "radio" value = "follow" name = "linkTYpe" checked = "checked"/>引导关注<i class = "i-icon"></i></label>');
				html.push('<a class="set-fast-link">设置快速关注链接</a>')
				html.push('</p>');
				html.push('<p><span></span>');
				html.push('<label class = "label-radio"><input type = "radio" value = "other" name = "linkTYpe"/>其它链接<i class = "i-icon"></i></label>');
				html.push('<label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');
				html.push('<a>');
				html.push('<label data-val="店铺主页">店铺主页</label>');
				html.push('<label data-val="会员主页">会员主页</label>');
				html.push('</a>');
				html.push('</label>');
				html.push('</p>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				title: "",	//标题
				titleType: "tradition",  //类型 常规 或 仿微信
				tradition: {
					hasLink: 0,	//是否有链接
					link: {
						text: "",
						src: ""
					},
					titleBg: "",
					txtAlign: "left",	//align 样式
					subtitle: ""	//副标题
				},
				wx: {
					datetime: "",
					author: "",
					linkTitle: "",
					linkType: "follow",
					linkSrc: ""
				}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var tra = self.data.tradition, wx = self.data.wx;
				var $radioList = settingElem.find(".label-radio");
				settingElem.find(".stt-title input").bind("blur", function () {
					var $input = $(this), val = $input.val(), deVal = $input.attr("defaultValue");
					viewElem.find("h3 span").text(val || deVal);
					self.data.title = val || deVal;
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
				var $linkAddress = settingElem.find(".link-address");
				zhx.other.select($linkAddress, function (data) {
					var $item = $(this);
					$item.attr("data-val", data.value);
					$item.find("strong").text(data.text);
					if ($item.hasClass("subtitle-link")) {
						tra.link.src = data.value;
					} else {
						wx.linkSrc = data.value;
					}
				});
				settingElem.find(".stt-date input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-date").text(val);
					wx.datetime=val;
				})
				settingElem.find(".stt-author input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-author").text(val);
					wx.author = val;
				})
				settingElem.find(".stt-link-text input").bind("blur", function () {
					var $input = $(this), val = $input.val();
					viewElem.find(".tt-subtitle a").text(val);
					wx.linkTitle=val;
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
					}
				});
			},
			edit:function (initData) {
				this.settingElem.find(".stt-title input").val(initData.title).trigger("blur");

			}
		}
	})
})(jQuery);