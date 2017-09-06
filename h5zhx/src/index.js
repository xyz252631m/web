/**
 * Created by wangwei01 on 2017/1/17.
 */
 ;(function () {
 	var type = zhx.getSearchName("type");
 	var list = [];
 	switch (type) {
 		case "storeMain":
 		list.push({key: "banner", bgColor: "#DE3A53"});
 		list.push({key: "textTitle", title: "新品上架"});
 		list.push({key: "goodsList", pattern: "small", showName: 0, type: "card"});
			//list.push({key:"notice"})
			break;
			case "custom":
			break;
		}
	//参数转换
	var getConf = {
		imgAd: function (plugin, typeId) {
			var d = plugin.data;
			var styleConf = {
				type: typeId,
				//showType:d.method
				showType: "type-" + d.method,
				imgSizeType: d.showSize == "small" ? "sm-list" : ""
			};
			var list = [];
			$.each(d.imgList, function (idx) {
				//http://www.ule.com\",\"showOrder\":1,\"title\":\"11111\",\"linkType\":\"1\",\"linkUrl\":\"1111\
				list.push({
					uuid: this.uuid || "",
					imgUrl: this.src,
					showOrder: idx + 1,
					title: this.title,
					linkType: this.type,
					linkName:this.name,
					linkUrl: this.link||"javascript:void(0)"
				})
			})
			var dataConf = {
				type: typeId,
				data: JSON.stringify(list)
			};
			return {styleConf: styleConf, dataConf: dataConf};
		},
		imgNav: function (plugin, typeId) {
			var d = plugin.data;
			var list = [];
			$.each(d.list, function (idx) {
				//http://www.ule.com\",\"showOrder\":1,\"title\":\"11111\",\"linkType\":\"1\",\"linkUrl\":\"1111\
				list.push({
					uuid: this.uuid || "",
					imgUrl: this.src,
					showOrder: idx + 1,
					title: this.title,
					linkType: this.type,
					linkName:this.name,
					linkUrl: this.link
				})
			})
			var dataConf = {
				type: typeId,
				data: JSON.stringify(list)
			};
			return {styleConf: null, dataConf: dataConf};
		},
		goods: function (plugin, typeId) {
			var d = plugin.data;
			var styleConfDto = {
				type: typeId,
				layoutStyle: plugin.def.listClass[d.pattern],
				cardStyle: plugin.def.listStyle[d.type],
				buyIconStyle: plugin.def.buyClass[d.buyStyle],
				isShowPrice: d.showPrice ? 1 : 0,
				isShowName: d.showName ? 1 : 0,
				layoutValue: d.pattern,
				cardValue: d.type,
				buyIconValue: d.showBuy ? 1 : 0
			};
			var itemIds = [];
			$.each(d.goodsList, function () {
				itemIds.p(this.listingId);
			})
			var dataConfDto = {
				type: typeId,
				itemIds: itemIds.join(",")
			}
			return {styleConf: styleConfDto, dataConf: dataConfDto};
		},
		goodsList: function (plugin, typeId) {
			var d = plugin.data, sd = plugin.data.searchData;
			var styleConfDto = {
				type: typeId,
				layoutStyle: plugin.def.listClass[d.pattern],
				cardStyle: plugin.def.listStyle[d.type],
				buyIconStyle: plugin.def.buyClass[d.buyStyle],
				isShowPrice: d.showPrice ? 1 : 0,
				isShowName: d.showName ? 1 : 0,
				layoutValue: d.pattern,
				cardValue: d.type,
				buyIconValue: d.showBuy ? 1 : 0
			};
			var dataConfDto = {
				type: typeId,
				brand: sd.brandId || "",
				orderType: sd.orderType || "",
				itemNumber: d.num,
				uleCategroy: sd.categroyId || "",
				storeCategroy: sd.storeCategroyId || "",
				merchantId: ""
			}
			return {styleConf: styleConfDto, dataConf: dataConfDto};
		},
		banner: function (plugin, typeId) {
			var d = plugin.data;
			var styleConf = {
				type: typeId,
				bgColor: "background-color:" + d.bgColor,
				bgImgUrl: d.bgImgSrc,
				bannerLogo: d.logoSrc,
				storeName: zhx.config.store.name
			};
			var dataConf = {
				type: typeId,
				data: {
					uuid: d.uuid || "",
					content: d.bgColor
				}
			};
			return {styleConf: styleConf, dataConf: dataConf};
		},
		textNav: function (plugin, typeId) {
			var d = plugin.data;
			var list = [];
			//datas\":[{\"title\":\"1\",\"showOrder\":1,\"linkType\":\"1\",\"linkUrl\":\"1\"}]}"
			$.each(d.linkList, function (idx) {
				list.p({
					uuid: this.uuid || "",
					title: this.title,
					showOrder: idx + 1,
					linkType: this.type,
					linkName:this.name,
					linkUrl: this.src
				})
			})
			var dataConf = {
				type: typeId,
				data: JSON.stringify(list)
			};
			return {styleConf: null, dataConf: dataConf};
		},
		textTitle: function (plugin, typeId) {
			var d = plugin.data;
			var styleConf = {
				type: typeId,
				textAlign: "txt-" + d.tradition.txtAlign,
				textAlignValue: d.tradition.txtAlign,
				titleTemplateType: d.titleType == "tradition" ? 1 : 0,
				bgColor: "background-color:"+ d.tradition.titleBg,
				bgColorValue: d.tradition.titleBg
			};
			var dataConf = {
				type: typeId,
				data: {
					title: d.title,
					halfTitle: d.tradition.subtitle,
					imgTxtLinkType: d.wx.linkType == "follow" ? 1 : 0,
					haslink: d.tradition.hasLink,
					author: d.wx.author,
					date: d.wx.datetime,
					linkTitle:d.wx.linkTitle,
					textNavigationDataDto: {
						uuid: d.uuid || "",
						title: "",
						showOrder: 1,
						linkName:d.wx.link.name,
						linkType: d.wx.link.type,
						linkUrl: d.wx.link.src
					}
				}
			};
			if (styleConf.titleTemplateType) {
				if (d.tradition.hasLink) {
					dataConf.data.textNavigationDataDto = {
						title: d.tradition.link.text,
						showOrder: 1,
						linkType: d.tradition.link.type,
						linkName:d.tradition.link.name,
						linkUrl: d.tradition.link.src
					}
				}
			}
			return {styleConf: styleConf, dataConf: dataConf};
		},
		blank: function (plugin, typeId) {
			var d = plugin.data;
			var styleConf = {
				type: typeId,
				height: d.height
			};
			return {styleConf: styleConf, dataConf: null};
		},
		editor: function (plugin, typeId) {
			var d = plugin.data;
			var styleConf = {
				type: typeId,
				backgroundColor: "background-color:" + d.bgColor,
				backgroundColorValue:d.bgColor,
				isFullScreen: d.isFull
			};
			var dataConf = {
				type: typeId,
				data: {
					uuid: d.uuid || "",
					content: d.html
				}
			};
			return {styleConf: styleConf, dataConf: dataConf};
		},
		goodsSearch: function (plugin, typeId) {
			var d = plugin.data;
			var styleConf = {
				type: typeId,
				bgColor: "background-color:" + d.bgColor
			};
			return {styleConf: styleConf, dataConf: null};
		},
		hr: function (plugin, typeId) {
			var d = plugin.data;
			var styleConf = {
				type: typeId,
				//color:d.color,
				colorCode: d.color,
				isPadding: d.isBlank ? "is-blank" : "",
				styleValue: d.type,
				style: ["border:", d.color, d.type, "1px"].join(" ")
			};
			return {styleConf: styleConf, dataConf: null};
		},
		notice: function (plugin, typeId) {
			var d = plugin.data;
			var dataConf = {
				type: typeId,
				data: {
					uuid: d.uuid || "",
					content: d.text
				}
			};
			return {styleConf: null, dataConf: dataConf};
		},
		enterStore: function (plugin, typeId) {
			//后端需要url,单独加上
			var styleConf = {
				type: typeId,
				url: zhx.config.store.mainPageUrl
			};
			return {styleConf: styleConf, dataConf: null};
		}
	};
	var getSetting = {
		imgAd: function (key, item) {
			var dataConf = item.dataConfDto;
			var styleConf = item.styleConfDto;
			var list = [];
			var tlist = dataConf.data || [];
			$.each(tlist, function (idx, el) {
				list.push({
					uuid: el.uuid,
					src: el.imgUrl,
					title: el.title,
					name:el.linkName,
					link: el.linkUrl,
					type: el.linkType
				})
			})
			return {
				method: styleConf.showType.replace("type-", ""),//"carousel",
				showSize: styleConf.imgSizeType == "sm-list" ? "small" : "big",
				imgList: list
			}
		},
		imgNav: function (key, item) {
			var dataConf = item.dataConfDto;
			var list = [];
			var tlist = dataConf.data || [];
			$.each(tlist, function (idx, el) {
				list.push({
					uuid: el.uuid,
					src: el.imgUrl,
					title: el.title,
					name:el.linkName,
					link: el.linkUrl,
					type: el.linkType
				})
			})
			return {
				list: list
			};
		},
		goods: function (key, item) {
			var dataConf = item.dataConfDto;
			var styleConf = item.styleConfDto;
			var d = {
				itemIds: [],
				pattern: styleConf.layoutValue,
				type: styleConf.cardValue,
				showBuy: zhx.int(styleConf.buyIconValue),
				buyStyle:  zhx.int(styleConf.buyIconStyle.replace("buy-","")),
				showName: zhx.int(styleConf.isShowName),
				showPrice: zhx.int(styleConf.isShowPrice)
			};
			if (dataConf.itemIds) {
				d.itemIds = dataConf.itemIds.split(",");
			}
			return d;
		},
		goodsList: function (key, item) {
			var dataConf = item.dataConfDto;
			var styleConf = item.styleConfDto;
			var d = {
				itemIds: [],
				pattern: styleConf.layoutValue,
				type: styleConf.cardValue,
				showBuy: styleConf.buyIconValue,
				buyStyle:  zhx.int(styleConf.buyIconStyle.replace("buy-","")),
				showName: styleConf.isShowName,
				showPrice: styleConf.isShowPrice
			};
			d.searchData = {
				brandId: dataConf.brand,
				orderType: dataConf.orderType,
				categroyId: dataConf.uleCategroy,
				storeCategroyId: dataConf.storeCategroy
			};
			d.initSearchData = dataConf;
			return d;
		},
		banner: function (key, item) {
			var styleConf = item.styleConfDto;
			var color="";
			if(styleConf.bgColor){
				var idx = styleConf.bgColor.indexOf("#");
				color = styleConf.bgColor.substr(idx,7);
			}
			return {
				uuid:item.dataConf.data? item.dataConf.data.uuid:"",
				bgColor: color,
				bgImgSrc: styleConf.bgImgUrl,
				logoSrc: styleConf.bannerLogo,
				storeName: styleConf.storeName
			}
		},
		textNav: function (key, item) {
			var dataConf = item.dataConfDto;
			var list = [];
			var tlist = dataConf.data || [];
			$.each(tlist, function (idx, el) {
				list.push({
					uuid: el.uuid,
					name:el.name,
					src: el.linkUrl,
					title: el.title,
					type: el.linkType
				})
			})
			return {
				linkList: list
			};
		},
		textTitle: function (key, item) {
			var dataConf = item.dataConfDto;
			var styleConf = item.styleConfDto;
			var d = {
				title: dataConf.data.title,	//标题
				titleType: styleConf.titleTemplateType == 1 ? "tradition" : "wx",  //类型 常规 或 仿微信
				tradition: {
					hasLink: dataConf.data.haslink,	//是否有链接
					link: {
						name:"",
						text: "",
						type: "",
						src: ""
					},
					titleBg: styleConf.bgColorValue,
					txtAlign: styleConf.textAlignValue,//align 样式
					subtitle: dataConf.data.halfTitle	//副标题
				},
				wx: {
					datetime: dataConf.data.date,
					author: dataConf.data.author,
					linkTitle: dataConf.data.linkTitle,	 	//textNavigationDataDto
					linkType: dataConf.data.imgTxtLinkType == 1 ? "follow" : "other",
					link: {
						name:"",
						type: "",
						src: ""
					}
				}
			};
			if (styleConf.titleTemplateType == 1) {
				if (dataConf.data.haslink == 1) {
					d.tradition.link = {
						text: dataConf.data.textNavigationDataDto.title,
						type: dataConf.data.textNavigationDataDto.linkType,
						name: dataConf.data.textNavigationDataDto.linkName,
						src: dataConf.data.textNavigationDataDto.linkUrl
					}
				}
			} else {
				if (dataConf.data.imgTxtLinkType == 0) {
					d.wx.link = {
						type: dataConf.data.textNavigationDataDto.linkType,
						name: dataConf.data.textNavigationDataDto.linkName,
						src: dataConf.data.textNavigationDataDto.linkUrl
					}
				}
			}
			d.uuid = dataConf.data.textNavigationDataDto.uuid;
			return d;
		},
		blank: function (key, item) {
			var styleConf = item.styleConfDto;
			return {height: styleConf.height}
		},
		editor: function (key, item) {
			var dataConf = item.dataConfDto;
			var styleConf = item.styleConfDto;
			return {
				uuid: dataConf.data.uuid,
				html: dataConf.data.content,
				isFull: styleConf.isFullScreen,
				bgColor: styleConf.backgroundColorValue
			}
		},
		goodsSearch: function (key, item) {
			var styleConf = item.styleConfDto;
			var color="";
			if(styleConf.bgColor){
				var idx = styleConf.bgColor.indexOf("#");
				color = styleConf.bgColor.substr(idx,7);
			}
			return {bgColor: color}
		},
		hr: function (key, item) {
			var styleConf = item.styleConfDto;
			var d = {
				color: styleConf.colorCode, isBlank: !!styleConf.isPadding, type: styleConf.styleValue
			}
			return d;
		},
		notice: function (key, item) {
			var dataConf = item.dataConfDto;
			return {uuid: dataConf.data.uuid, text: dataConf.data.content}
		},
		enterStore: function (key, item) {
			return {}
		}
	}
	//zhx.init();
	zhx.config.store = {
		id: $("#storeId").val(),				//店铺id
		name: $("#storeName").val(),			//店铺名称
		templateId: $("#templateId").val(),		//
		merchantId: $("#merchantId").val(),		//
		pageId: $("#pageId").val(),				//
		storeLogo:$("#storeLogo").val(),			//店铺logo
		basePath:$("#basePath").val(),			//接口主机地址
		pcStoreId: $("#pcStoreId").val(),		//pc 店铺id
		mainPageUrl: $("#pageIndexUrl").val()	//店铺主页url
	};
	//list.push({key:"goods",pattern: "small",type: "card"})
	//和后端数据（moduleType）对应
	var mType = {
		"textTitle": 1,
		"hr": 2,
		"goods": 3,
		"goodsList": 4,
		"editor": 5,
		"goodsSearch": 6,
		"blank": 7,
		"notice": 8,
		"textNav": 9,
		"imgNav": 10,
		"imgAd": 11,
		"enterStore": 12,
		"banner": 13
	}

	function getKeyById(id) {
		for (var k in mType) {
			if (mType[k] == id) {
				return k;
			}
		}
	}

	//初始化插件选择列表
	// var customIdList = JSON.parse($("#mType").html() || null) || [];
	// if (customIdList.length) {
	// 	var keyList = [];
	// 	$.each(customIdList, function () {
	// 		keyList.push(getKeyById(this));
	// 	})
	// 	zhx.config.plugin = keyList;
	// }
	//编辑
	var pageDtoStr = $("#pageDtoJson").text();
	if ($.trim(pageDtoStr)) {
		setEditInfo();
	}
	function setEditInfo() {
		var dto = JSON.parse(pageDtoStr);
		console.log("初始化信息：", dto);
		if(dto){
			if (dto.moduleList && dto.moduleList.length) {
				$.each(dto.moduleList, function (idx, item) {
					var key = getKeyById(item.moduleType);
					var sett = getSetting[key](key, item);
					$.extend(sett, {key: key, setInfo: item});
					list.push(sett);
				});

			}
			list.push({key: "pageTitle", title: dto.pageTitle, des: dto.pageDesc, bodyBg: dto.pageBgcolor||"#ffffff"});
		}else{
			list.push({key: "pageTitle", title: "店铺主页"});
		}
	}

	//list.p(
	//	{
	//		key: "imgAd", method: "separate", showSize: "small", imgList: [{
	//		link: "585858",
	//		src: "http://static.beta.ule.com/mstore/user_0/store_0/images/20170308/a9a11cb22f71ee8c.jpg",
	//		title: "title",
	//		type: "7"
	//	}, {
	//		src: "http://static.beta.ule.com/mstore/user_0/store_0/images/20170313/21d3991e944adab8.jpg",
	//		title: "title",
	//		link: "88888888888888888",
	//		type: 5
	//	}
	//	]
	//	})
	//list.p(
	//	{
	//		key: "banner",
	//		bgColor: "#999999",
	//		bgImgSrc: "http://static.beta.ule.com/mstore/user_0/store_0/images/20170308/a9a11cb22f71ee8c.jpg",
	//		logoSrc: "http://static.beta.ule.com/mstore/user_0/store_0/images/20170313/21d3991e944adab8.jpg",
	//		storeName: "我的店铺"
	//	},
	//	{
	//		key: "goodsSearch", bgColor: "#999999"
	//	},
	//	{
	//		key: "notice", text: "三翻四复"
	//	},
	//	{
	//		key: "blank", height: 50
	//	}
	//)
	//初始化插件
	console.log("初始化插件列表：", list);
	zhx.init(list);
	//zhx.init([{key:"pageTitle",title:"店铺主页"},{key:"editor",html:"<p>3333333333333333333</p>"}]);
	// zhx.dialog.selectGoodsSingleton();
	function getEditUUID(editItem) {
		var uuid = "";
		if (editItem) {
			if (editItem.dataConf && editItem.dataConf.data && editItem.dataConf.data.uuid) {
				uuid = editItem.dataConf.data.uuid;
			}
		}
		return uuid;
	}

	function getData() {
		var obj = {
			"uuid": zhx.config.store.pageId,
			"storeId": zhx.config.store.id,
			"templateId": zhx.config.store.templateId,
			"pageTitle": "页面标题",
			"pageDesc": "页面描述",
			"pageBgcolor": "",
			//"pageUrl": "页面url",
			"moduleList": []
		};
		$.each(zhx.pluginList, function (idx, item) {
			var typeId = mType[item.data.key];
			var data = {
				uuid: "",
				pageId: "",
				storeId: obj.storeId,
				moduleName: item.name,
				moduleType: typeId,
				showOrder: idx + 1
			}
			if (item.data.setInfo) {
				data.uuid = item.data.setInfo.uuid;
				data.pageId = item.data.setInfo.pageId;
			}
			var conf = getConf[item.data.key](item, typeId);
			if (conf.styleConf != null) {
				data["styleConf"] = JSON.stringify(conf.styleConf);
			}
			if (conf.dataConf != null) {
				data["dataConf"] = JSON.stringify(conf.dataConf);
			}
			obj.moduleList.push(data);
		});
		$.each(zhx.holdPluginList, function (idx, item) {
			if (item.data.key == "pageTitle") {
				obj.pageTitle = item.data.title;
				obj.pageDesc = item.data.des;
				obj.pageBgcolor = item.data.bodyBg;
			}
		})
		return obj;
	}

	//验证事件
	var check = function () {
		var isSubmit = true,flag = true, i, len, list = zhx.pluginList, item;
		for (i = 0, len = list.length; i < len; i++) {
			item = list[i];
			if (item.check) {
				flag = item.check();
				if (!flag) {
					zhx.activeView(item.view);
				}
				isSubmit = isSubmit&&flag;
			}
		}
		return isSubmit;
		//$.each(zhx.dataList,function (idx,el) {
		//	if(el.key=="imgNav"){
		//		//isSubmit
		//		if(el.list[0].type>0&&el.list[1].type>0&&el.list[2].type>0&&el.list[3].type>0){
		//
		//		}else{
		//			isSubmit = false;
		//			zhx.activeView(zhx.pluginList[idx].view);
		//		}
		//	}
		//})
		//return isSubmit;
	}
	$(function () {
		 
		//发布
		$(".btn-send").bind("click", function () {
			var data = getData();
			console.log("发布参数：", data);
			var isSubmit = check();
			if (isSubmit) {
				zhx.data.put(zhx.config.store.basePath +"api/v1/page/publish", JSON.stringify(data)).success(function (res) {
					if (res.status == 0) {
						zhx.box.msg("发布成功！",function () {
							location.href = zhx.config.store.basePath +"page/";
						})

					}else{
						zhx.box.msg(res.message||"发布失败！")
					}
				}).error(function () {
					zhx.box.msg("发生错误！")
				});
			}
		})
		//保存
		$(".btn-save").bind("click", function () {
			var data = getData();
			console.log("保存参数：", data);
			var isSubmit = check();
			if (isSubmit) {

				zhx.data.put( zhx.config.store.basePath + +"api/v1/page/save", JSON.stringify(data)).success(function (res) {
					if (res.status == 0) {
						zhx.box.msg("保存成功！",function () {
							location.href = zhx.config.store.basePath +"page/";
						})
					}else{
						zhx.box.msg(res.message||"保存失败！")
					}

				}).error(function () {
					zhx.box.msg("发生错误！")
				});
			}
		})
		//预览
		$(".btn-review").bind("click", function () {
			var data = getData();
			console.log("预览参数：", data);
			var isSubmit = check();
			if (isSubmit) {
				zhx.data.put(zhx.config.store.basePath + "api/v1/page/save4PreView", JSON.stringify(data)).success(function (res) {
					if (res.status == 0) {
						window.open(zhx.config.store.basePath +"page/preView", "_blank");
					}else{
						zhx.box.msg(res.message||"预览失败！")
					}
				}).error(function () {
					zhx.box.msg("发生错误！")
				});
			}
		})
	})
})();