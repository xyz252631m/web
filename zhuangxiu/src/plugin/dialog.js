/*
 * des: 弹出层
 *
 * */
;(function ($) {
	zhx.dialog = {};
	var template={
		imgList:function () {
			var html = [];
			html.push('<div class = "box-img-list">');
			html.push('<div class = "img-tab">');
			html.push('<label class="search-img"><input type = "text" placeholder="搜索"/></label>');
			html.push('<span class = "active">我的图片</span><span>图标库</span>');
			html.push('</div>');
			html.push('<div class = "img-con">');
			html.push('<div class = "group-list">');
			html.push('<p class = "active"><a>未分组</a></p>');
			html.push('<p><a>未分组1</a></p>');
			html.push('<p><a>未分组2</a></p>');
			html.push('');
			html.push('</div>');
			html.push('<div class = "list">');
			html.push('<ul>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem01.jpg"/>');
			html.push('<p>順豐到付</p>');
			html.push('<cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem03.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem01.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem03.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem02.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('<li>');
			html.push('<img src = "../images/tem/tem04.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.push('<cite class="c-txt">540*250</cite>');
			html.push('<div class="img-bor">');
			html.push('<i class="i-bg"></i>');
			html.push('<i class="i-icon"></i>');
			html.push('</div>');
			html.push('</li>');
			html.push('</ul>');
			html.push('<p class = "state-bar">');
			html.push('<a class = "link-upload">上传图片</a>');
			html.push('');
			html.push('<span class = "page-nubmer">');
			html.push('<a>上一页</a>');
			html.push('<a>1</a><a>2</a><a>3</a>');
			html.push('<label><input class = "go-page" type = "text"/>/11页</label>');
			html.push('<a>下一页</a>');
			html.push('</span>');
			html.push('<span>共3条，每页16条</span>');
			html.push('</p>');
			html.push('</div>');
			html.push('</div>');
			html.push('<div class = "btn-list">');
			html.push('<a>确认</a>');
			html.push('</div>');
			html.push('</div>');
			return html.join(" ");
		},
		selectGoods:function () {

			return $("#test").html();
		}
	}
	$.extend(zhx.dialog, {
		imgList:function (callback,isSingle) {
			zhx.box.show(template.imgList(), function ($box) {
				var $submit = $box.find(".btn-list a");
				var $tab = $box.find(".group-list p"),$selectElem;
				$tab.bind("click", function () {
					zhx.tabChangeClass($tab, $(this), zhx.ac);
				})
				var bindLiClick = function () {
					var $list = $box.find(".list li");
					/*是否为单选*/
					if(isSingle){
						$list.bind("click", function () {
							var $item = $(this);
							zhx.tabChangeClass($list,$item);
							$selectElem = $box.find(".list ul .active");
							zhx.classOp($submit, $selectElem.length);
						})
					}else {
						$list.bind("click", function () {
							var $item = $(this);
							$item.toggleClass(zhx.ac);
							$selectElem = $box.find(".list ul .active");
							zhx.classOp($submit, $selectElem.length);
						})
					}
				}
				bindLiClick();
				$submit.bind("click",function () {
					if($submit.hasClass(zhx.ac)){
						callback&&callback.call($box,$selectElem);
						$box.flowerHide();
					}
				})
			});

		},
		selectGoods:function () {
			zhx.box.show(template.selectGoods(), function ($box) {

			});
		}




	});
})(jQuery);