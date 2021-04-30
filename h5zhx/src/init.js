;(function () {
	$.extend(zhx, {
		init: function (list) {
			zhx.createOp();
			zhx.bindOpEvent();
			if (list && list.length) {
				zhx.resetInit(list);
			}else{
				zhx.plugins["pageTitle"].create("", {title: "店铺主页"});
			}
			zhx.activeView(zhx.holdPluginList[0].view);
		},
		resetInit: function (list) {
			$.each(list, function (idx, item) {
				var p = zhx.plugins[item.key].create("", item);
				p.edit&&p.edit(item);
			})
		}
	});
})();







