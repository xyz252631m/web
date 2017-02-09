/*
 * des: 默认配置
 *
 * */
;(function ($) {
	zhx.config = {
		root: $(".preview"),
		editRoot: $(".setContent"),
		editClassName:"active",
		initData:{
			pageTitle:{
				title:"店铺主页"
			}
		},
		plugin:["editor","hr","goodsList","textTitle","imgAd","textNav","imgNav","goodsSearch","goods","notice"]
	}
})(jQuery);
