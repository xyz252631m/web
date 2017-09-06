/**
 * Created by wangwei01 on 2017/2/15.
 */
(function () {
	//显示连接url
	$(".js_link").bind("click", function (e) {
		if (e.target.nodeName == "A") {
			var item = $(e.target), $box = $(".url-box");
			var op = item.offset();
			var url = item.attr("data-url");
			$box.find("input").val(url);
			$box.css({
				left: op.left - 308,
				top: op.top - 18
			}).show();
			$(document).bind("click", function () {
				$(".url-box").hide();
			})
		}
		return false;
	})
	//显示二维码
	var timer;
	$(".btn-wx,.wx-info").hover(function () {
		clearTimeout(timer);
		$(".wx-info").show();
	}, function () {
		timer = setTimeout(function () {
			$(".wx-info").hide();
		}, 500)
	})
	//序号点击
	$(".order-by-num").bind("click", function () {
		var $li = $(this).parent();
		var val = $(this).hide().text();
		$li.find(".t-num").val(val).show();
		$(document).bind("click", function () {
			var num = $li.find("input").val() || 0;
			num > 9999 && (num = 9999);
			$li.find("input").hide();
			$li.find("a").text(num).show();
		})
		return false;
	});
	//序号输入点击
	$(".t-num").bind("click", function () {
		return false;
	})
	$(".t-num").bind("input",function () {
		var val = this.value;
		if(val>9999){
			this.value=9999;
		}
	})
	//复制
	$(".url-box .btn-copy").bind("click", function () {
		try {
			var $input = $(".url-box input");
			$input[0].select();
			document.execCommand("Copy");
			$input.blur();
			JEND.page.alert({
				type: 'success', message: '复制成功！', callback: function () {
					$(".url-box").hide();
				}
			});
		} catch (e) {
			JEND.page.alert({message: '请手动复制！'});
		}
	})
	//搜索
	//$(".search-box input").bind("focus", function () {
	//	$(this).unbind("keydown").bind("keydown", function (e) {
	//		// 回车键事件
	//		if (e.which == 13) {
	//			//筛选
	//			//
	//			location.reload();
	//		}
	//	});
	//})
})()