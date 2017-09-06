/**
 * 获取数据
 */
;(function () {


	zhx.data = {};
	var urlSrc = "beta.ule.com";
	var host = location.host;
	if(host.indexOf("ule.com")>=0&&host.indexOf("beta.ule.com")<0){
		urlSrc = "ule.com";
	}
	$.extend(zhx.data, {
		urlSrc:urlSrc,
		//host:"//192.168.116.10:3030/microshop",
		host: "//m."+urlSrc+"/microshop",//  "//192.168.116.132:3030/microshop/"
		jsonp: function (url, data, callbackName) {
			return $.ajax({
				url: url,
				dataType: "jsonp",
				data: data,
				jsonp: callbackName || "callback"
			})
		},
		post: function (url, data) {
			return $.ajax({
				url: url,
				type: "post",
				dataType: "json",
				data: data
			})
		},
		upload: function (url, data) {
			return $.ajax({
				url: url,
				type: "post",
				dataType: "json",
				data: data,
				processData: false,
				contentType: false
			})
		},
		put: function (url, data) {
			return $.ajax({
				url: url,
				type: "put",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: data
			})
		},
		_goods: {
			brandList: [],	//品牌分类
			categroyList: [],//分类
			storeCategoryList: [],	//店铺分类
			listingList: []	//商品分类
		},
		getBaseInfo: function (data) {
			var d = {
				microshoppId: zhx.config.store.id,
				searchFlag: "1,2,3"
			}
			$.extend(d, data);
			return this.jsonp(this.host + "/api/finding/v1/groupListing", d).then(function (res) {
				zhx.data._goods.brandList = res.map.brandList;
				zhx.data._goods.categroyList = res.map.categroyList;
				zhx.data._goods.storeCategoryList = res.map.storeCategoryList;
				return res.map;
			});
		},
		getGoods: function (data) {
			var d ={
				microshoppId:zhx.config.store.id
			}
			$.extend(d, data);
			return this.jsonp(this.host + "/api/finding/v1/listings", d).then(function (res) {
				return res.result;
			});
		},
		//getPageList:function (data) {
		//	return this.post(this.host + "/ms/manage/finding/queryByForPage",null);
		//},
		getBrandList: function (data) {
			if (this._goods.brandList.length) {
				return $.when(this._goods.brandList);
			} else {
				return this.getBaseInfo(data).then(function (res) {
					return res.brandList;
				});
			}
		},
		getStoreList: function (data) {
			if (this._goods.storeCategoryList.length) {
				return $.when(this._goods.storeCategoryList);
			} else {
				return this.getBaseInfo(data).then(function (res) {
					return res.storeCategoryList;
				});
			}
		},
		getCategroyList: function (data) {
			if (this._goods.categroyList.length) {
				return $.when(this._goods.categroyList);
			} else {
				return this.getBaseInfo(data).then(function (res) {
					return res.categroyList;
				});
			}
		},
		uploadImg: function (imgFile) {
			var formData = new FormData();
			formData.append("uploadFlag ", "1");
			formData.append("storeId  ", zhx.config.store.id);
			formData.append("myfile ", imgFile);
			return this.upload(zhx.config.store.basePath + "/api/v1/resource/save", formData)

			//return this.upload("//192.168.116.10:4040/microshopAdmin/api/v1/resource/save", formData)
		}

	});
})();



