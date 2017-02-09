/*
 * des: banner and logo
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
				html.push('<div class = "img-nav">');
				html.push('<div class = "mc">');
				html.push('<a><img /><p></p></a>');
				html.push('<a><img /><p></p></a>');
				html.push('<a><img /><p></p></a>');
				html.push('<a><img /><p></p></a>');
				html.push('</div>');
				html.push('</div>');
				return html.join(" ");
			},
			viewItem: function (src, title) {
				var html = [];
				html.push('<a><img src="' + src + '"/>');
				html.push('<p>' + (title || "") + '</p>');
				html.push('</a>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-img-nav">');
				html.push('<ul class="sin-img-list">');
				html.push('</ul>');
				html.push('</div>');
				return html.join(" ");
			},
			liTemplate: function (src) {
				var html = [];
				html.push('<li class="clearfix">');
				html.push('<div class="nav-img-bg">');
				html.push('<img/>');
				html.push('<a class="add-img"><i></i>添加图片</a>');
				html.push('<cite class="c-bg"></cite>');
				html.push('<cite class="c-txt">重新上传</cite>');
				html.push('</div>');
				html.push('<div class="nav-img-info">');
				html.push('<p><span>文字：</span><label class = "label-input link-txt"><input type = "text" maxlength = "20"></label></p>');
				html.push('<p><span>链接：</span><label class = "label-select link-address"><strong>设置链接到的页面地址</strong>');

				html.push('<a>');
				html.push('<label>店铺主页</label>');
				html.push('<label>会员主页</label>');
				html.push('</a>');
				html.push('</label>');
				html.push('</p>');
				html.push('</div>');
				html.push('</li>');
				return html.join(" ");
			},
			data: {
				list: []//{src,title,link}
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $listBox = settingElem.find(".sin-img-list"), $viewLinkBox = viewElem.find(".mc");

				function initLi() {
					var html = [];
					for (var i = 0; i < 4; i++) {
						html.push(self.liTemplate());
						self.data.list.push({
							src: "",
							size: {w: 0, h: 0},
							title: "",
							link: ""
						});
					}
					$listBox.html(html.join(" "))
				}

				initLi();
				//var $list = settingElem.find(".label-radio");
				//zhx.other.radio($list,function (type) {
				//	viewElem.find(".mc p").css("border-bottom-style",$(this).val());
				//});
				//settingElem.find(".label-color input").bind("change",function () {
				//	viewElem.find(".mc p").css("border-color",this.value);
				//});
				var changeViewImg = function () {
					var html = [];
					$.each(self.data.list, function () {
						html.push(self.viewItem(this.src, this.title));
					});
					$viewLinkBox.html(html.join(" "));
				}
				//选择图片
				var selectImg = function ($li, isAdd) {
					var idx = $listBox.find("li").index($li);
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
						changeViewImg();
					}, 1);
				}
				//重新选择
				$listBox.find(".c-txt").bind("click", function () {
					var $li = $(this).parents("li");
					selectImg($li);
				})
				//输入标题
				$listBox.find(".link-txt input").bind("blur", function () {
					var val = $(this).val();
					var $li = $(this).parents("li");
					if ($.trim(val)) {
						var idx = $listBox.find("li").index($li);
						self.data.list[idx].title = val;
						$viewLinkBox.find("a").eq(idx).find("p").html(val);
					}
				});
				//添加图片
				settingElem.find(".add-img").bind("click", function () {
					var $li = $(this).parents("li");
					selectImg($li, 1);
				})
				//选择链接
				var $linkAddress =  settingElem.find(".link-address");
				zhx.other.select($linkAddress,function (data) {
					var $item = $(this);
					$item.attr("data-val", data.value);
					$item.find("strong").text(data.text);
				});


			}
		}
	})
})(jQuery);