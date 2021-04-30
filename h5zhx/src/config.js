/*
 * des: 默认配置
 *
 * */
;(function ($) {
	//linkType  链接类型   1 微页面及分类  2 商品及分类 3 营销活动 4 投票调查 5 店铺主页 6 会员主页 7 自定义外链
	zhx.config = {
		root: $(".preview"),
		editRoot: $(".setContent"),
		editClassName:"active",
		imgroot:"//i2.beta.ulecdn.com/mobile/decorate/161226/images/",
		store:null,	//店铺信息
		plugin:["editor","goods","goodsList","textTitle","textNav","hr","imgAd","imgNav","goodsSearch","notice","blank"
		,"enterStore"
			//,"goodsGroup"
		]
	}
	//TODO :　测试-- 本地环境加分组模块
	if(location.host.indexOf("localhost")>=0){
		zhx.config.plugin.push("goodsGroup");
	}
})(jQuery);
