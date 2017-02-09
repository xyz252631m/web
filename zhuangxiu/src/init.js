;(function () {
	var typeList = ["main", "detail", "custom"];//主页 自定义页
	var type = typeList[2];
	$.extend(zhx, {
		//type:无拖动 编辑Event
		init: function (list) {
			zhx.createOp();
			zhx.bindOpEvent();
			if (list && list.length) {
				zhx.resetInit(list);
			}else{
				zhx.plugins["pageTitle"].create("", {title: "店铺主页"});
			}
		},
		resetInit: function (list) {
			$.each(list, function (idx, item) {
				var p = zhx.plugins[item.key].create("", item);
				p.edit&&p.edit(item);
			})
		}
	});
	$(function () {
		//if(window.devicePixelRatio && devicePixelRatio >= 2){
		//	//document.querySelector('ul').className = 'hairlines';
		//}
		//	zhx.bindMousedownEvent();
		//zhx.plugins["pageTitle"].create("", {title: "店铺主页"});
		//zhx.getEditBox.show();
		//zhx.getEditBox.find(".set-img-nav").show();
		//zhx.dialog.imgList();
	})
})();







