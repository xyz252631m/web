(function () {
	window.pre = {
		view: {},
		init: function () {
			var str = localStorage["temZhxInfo"];
			if (str) {
				var obj = JSON.parse(str);
				for (var i = 0; i < obj.length; i++) {
				}
			}
		}
	};
})();
(function () {
	$.extend(pre.view,{
		hr:function (obj) {
			
		}
	})


})();

