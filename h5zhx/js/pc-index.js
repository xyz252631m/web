/**
 * Created by wangwei01 on 2017/3/6.
 */
(function () {
	var tabType = localStorage["tabType"];
	if (tabType) {
		setType(tabType);
	}else{
		setType(0);
	}
	function setType(idx) {
		$(".pre-tab a").removeClass("active").eq(idx).addClass("active");;
		$(".pre-view").removeClass("w320 w360 w760");
		if (idx == 0) {
			$(".pre-view").addClass('w320');
		} else if (idx == 1) {
			$(".pre-view").addClass('w360');
		} else if (idx == 2) {
			$(".pre-view").addClass('w760');
		}
		$(".pre-view").show();
	}

	$(function () {
		$(".pre-tab a").bind("click", function () {
			var index = $(".pre-tab a").index(this);
			setType(index);
			localStorage["tabType"] = index;
		})



		//商品搜索-上一页
		$(".pages-search .up-page").bind("click", function () {

			pre.goodsSearch.getDataByPage($(this), 0);
		})
		//商品搜索-下一页
		$(".pages-search .next-page").bind("click", function () {
			pre.goodsSearch.getDataByPage($(this), 1);
		})
	});
})();