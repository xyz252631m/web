/*
 * des: 弹出层
 *
 * */
;(function ($) {
	zhx.dialog = {};
	var template = {
		//选择图片模板（包含单选和多选）
		imgListStr: function () {
			var html = [];
			html.p('<div class = "box-img-list">');
			html.p('<div class = "img-tab">');
			html.p('<label class="search-img"><input type = "text" placeholder="搜索"/></label>');
			html.p('<span class = "active">我的图片</span><span>图标库</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "group-list">');
			html.p('<p class = "active"><a>未分组</a></p>');
			html.p('<p><a>未分组1</a></p>');
			html.p('<p><a>未分组2</a></p>');
			html.p('');
			html.p('</div>');
			html.p('<div class = "list">');
			html.p('<ul>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem01.jpg"/>');
			html.p('<p>順豐到付</p>');
			html.p('<cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem03.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem01.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem03.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem02.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('<li>');
			html.p('<img src = "../images/tem/tem04.jpg"/><p>順豐到付</p><cite class="c-bg"></cite>');
			html.p('<cite class="c-txt">540*250</cite>');
			html.p('<div class="img-bor">');
			html.p('<i class="i-bg"></i>');
			html.p('<i class="i-icon"></i>');
			html.p('</div>');
			html.p('</li>');
			html.p('</ul>');
			html.p('<p class = "state-bar">');
			html.p('<a class = "link-upload">上传图片</a>');
			html.p('');
			html.p('<span class = "page-nubmer">');
			html.p('<a>上一页</a>');
			html.p('<a>1</a><a>2</a><a>3</a>');
			html.p('<label><input class = "go-page" type = "text"/>/11页</label>');
			html.p('<a>下一页</a>');
			html.p('</span>');
			html.p('<span>共3条，每页16条</span>');
			html.p('</p>');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<a>确认</a>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		//选择商品模板
		goodsStr: function (goodsList) {
			var html = [];
			html.p('<div class = "box-goods-select">');
			html.p('<div class = "img-tab">');
			html.p('<span class = "active">已上架商品</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "g-search">');
			html.p('<table>');
			html.p('<tr>');
			html.p('<td><span>品牌：</span><label><select class="js_brand">');
			html.p('<option>请选择</option>');
			html.p('</select></label></td>');
			html.p('<td><span>店铺分类：</span>');
			html.p('<label class = "label-tree store-tree">');
			html.p('<input type = "text" readonly = "readonly" placeholder = "请选择">');
			html.p('<ul class = "tree-main"></ul><i class="i-close">X</i>');
			html.p('</label>');
			html.p('</td>');
			html.p('<td><span>商品分类： </span>');
			html.p('<label class = "label-tree shopping-tree">');
			html.p('<input type = "text" readonly = "readonly" placeholder = "请选择">');
			html.p('<ul class = "tree-main"></ul><i class="i-close">X</i>');
			html.p('</label>');
			html.p('</td>');
			html.p('</tr>');
			html.p('<tr>');
			html.p('<td><span>商品id：</span><label class = "label-input"><input class="js_goods_id" type = "text"/></label></td>');
			html.p('<td><span>商品名称：</span><label class = "label-input"><input  class="js_goods_name"  type = "text"/></label></td>');
			html.p('<td><a class = "btn-search">查询</a></td>');
			html.p('</tr>');
			html.p('</table>');
			html.p('</div>');
			html.p('<div class = "op-tab">');
			html.p('<a data-type="2">月销量</a><a data-type="3">上架时间</a><a data-type="1">价格</a>');//1价格从低到高  2月销量从高到低  3上架时间倒序
			html.p('</div>');
			html.p('<div class = "data-list">');
			html.p('<table class="goods-table">');
			html.p('<thead>');
			html.p('<tr>');
			html.p('<th width="90px"></th>');
			html.p('<th width="320px">商品名称</th>');
			html.p('<th width="120px">商品库存</th>');
			html.p('<th width="120px">商品价格</th>');
			html.p('<th><label>操作</label><input type="checkbox" id="all-goods" class="chk-all"/><label class="js_all" for="all-goods">全选</label></th>');
			html.p('</tr>');
			html.p('</thead>');
			html.p('<tbody>');
			html.p('</tbody>');
			html.p('</table>');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<a class="btn-submit">确认</a>');
			html.p('<div class="pages goods-pages">');
			html.p('<span class = "page-left">');
			html.p('<a class="prev">上一页</a>');
			html.p('<span class = "page-nubmer">');
			html.p('<a>1</a><a>2</a><a>3</a>');
			html.p('</span>');
			html.p('<label><input class = "go-page" type = "text"/>/<span class="sun-page">0</span>页</label>');
			html.p('<a class="next">下一页</a>');
			html.p('</span>');
			html.p('<span>共<label class = "sun-counts">5</label>条，每页<label class = "page-size">5</label>条</span>');
			html.p('</div>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		//选择商品分组模板
		goodsListStr: function () {
			var html = [];
			html.p('<div class="box-groups">');
			html.p('<div class = "img-tab">');
			html.p('<span class = "active">商品分组</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "g-search">');
			html.p('<p>选择类别</p>');
			html.p('<dl>');
			html.p('<dd><span>店铺分类：</span>');
			html.p('<label class = "label-tree store-tree">');
			html.p('<input type = "text" readonly = "readonly" placeholder = "请选择">');
			html.p('<ul class = "tree-main"></ul><i class="i-close">X</i>');
			html.p('</label>');
			html.p('</dd>');
			html.p('<dd><span>品牌：</span><label><select class="js_brand">');
			html.p('<option>请选择</option>');
			html.p('</select></label></d>');
			html.p('<dd><span>商品分类：</span>');
			html.p('<label class = "label-tree shopping-tree">');
			html.p('<input type = "text" readonly = "readonly" placeholder = "请选择">');
			html.p('<ul class = "tree-main"></ul><i class="i-close">X</i>');
			html.p('</label>');
			html.p('</dd>');
			html.p('</dl>');
			html.p('<p class="order-by">排序方式：<label><input type = "radio" name="orderBy" value="1" checked="checked"/>价格从低到高</label></p>');
			html.p('<p class="p-orderBy"><label><input type = "radio" name="orderBy" value="2"/>月销量从高到低</label></p>');
			html.p('<p class="p-orderBy"><label><input type = "radio" name="orderBy" value="3"/>按上架时间倒序</label></p>');
			html.p('');
			html.p('</div>');
			html.p('');
			html.p('<div class = "data-list">');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<a class="btn-submit active">确认</a>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		//微页面选择
		minPageStr: function () {
			var html = [];
			html.p('<div class="box-pages">');
			html.p('<div class = "img-tab">');
			html.p('<span class = "active">微页面选择</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "data-list">');
			html.p('<table class="min-page-table">');
			html.p('<thead>');
			html.p('<tr>');
			html.p('<th width="30%" class="td-title">标题</th>');
			html.p('<th width="40%">创建时间</th>');
			html.p('<th width="30%">');
			html.p('<div class="search-name">');
			html.p('<input type = "text"><a class="btn-search">搜</a>');
			html.p('</div>');
			html.p('</th>');
			html.p('</tr>');
			html.p('</thead>');
			html.p('<tbody>');
			html.p('</tbody>');
			html.p('</table>');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<div class="pages min-pages">');
			html.p('<span class = "page-left">');
			html.p('<a class="prev">上一页</a>');
			html.p('<span class = "page-nubmer">');
			html.p('<a>1</a><a>2</a><a>3</a>');
			html.p('</span>');
			html.p('<label><input class = "go-page" type = "text"/>/<span class="sun-page">0</span>页</label>');
			html.p('<a class="next">下一页</a>');
			html.p('</span>');
			html.p('<span>共<label class = "sun-counts">5</label>条，每页<label class = "page-size">5</label>条</span>');
			html.p('</div>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		},
		//活动
		activityStr: function (list) {
			var html = [];
			html.p('<div class="box-pages">');
			html.p('<div class = "img-tab">');
			html.p('<span class = "active">活动</span>');
			html.p('</div>');
			html.p('<div class = "img-con">');
			html.p('<div class = "data-list">');
			html.p('<table>');
			html.p('<thead>');
			html.p('<tr>');
			html.p('<th width="30%" class="td-title">标题</th>');
			html.p('<th width="40%">有效时间</th>');
			html.p('<th width="30%">');
			html.p('<div class="search-name">');
			html.p('<input type = "text"><a>搜</a>');
			html.p('</div>');
			html.p('</th>');
			html.p('</tr>');
			html.p('</thead>');
			html.p('<tbody>');
			$.each(list, function () {
				html.p('<tr>');
				html.p('<td class="td-title"><a target="_blank">' + this.name + '</a></td>');
				html.p('<td>2017-1-1 16:44:33 - 2017-1-2 16:44:33</td>');
				html.p('<td><a class="btn-select">选择</a></td>');
				html.p('</tr>');
			})
			html.p('</tbody>');
			html.p('</table>');
			html.p('</div>');
			html.p('</div>');
			html.p('<div class = "btn-list">');
			html.p('<span>共3条，每页5条</span>');
			html.p('</div>');
			html.p('</div>');
			return html.join(" ");
		}
	}

	function listToTree(arry) {
		///
		//var red = [
		//	{
		//		"id": 1,
		//		"pid": 0,
		//		"name": "常用"
		//	},
		//	{
		//		"id": 2,
		//		"pid": 0,
		//		"name": "分类"
		//	},
		//	{
		//		"id": 3,
		//		"pid": 0,
		//		"name": "类别3"
		//	},
		//	{
		//		"id": 4,
		//		"pid": 1,
		//		"name": "常用1"
		//	},
		//	{
		//		"id": 5,
		//		"pid": 1,
		//		"name": "常用2"
		//	},
		//	{
		//		"id": 6,
		//		"pid": 5,
		//		"name": "常用2.1"
		//	},
		//	{
		//		"id": 7,
		//		"pid": 2,
		//		"name": "分类1"
		//	},
		//	{
		//		"id": 8,
		//		"pid": 2,
		//		"name": "分类2"
		//	}
		//];
		//var list = [red[0], red[1], red[2]];
		var list = [];//获取一级节点
		$.each(arry, function () {
			if (this.id == 0) {
				list.p(this);
			}
		})
		var tem_obj = {}, i = 0, j = 0, item;
		//获取一级目录
		for (; i < list.length; i++) {
			tem_obj[list[i].id] = i;
		}
		function getTopItem(list, item) {
			if (!item) return;
			if (!item.pid) return item;
			var id = item.pid;
			label:for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].id == id) {
					if (!list[i].pid) {
						return list[i];
					} else {
						id = list[i].pid;
						break label;
					}
				}
			}
		}

		function getCurrItem(list, path) {
			for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].href == path) {
					list[i].active = true;
					return list[i];
				}
			}
		}

		//递归
		var sunNum = 0, shiNum = 0;
		var getList = function (result, list) {
			for (var j = 0; j < result.length; j++) {
				item = result[j];
				item["open"] = false;
				if (!item["nextList"]) {
					item["nextList"] = [];
				}
				for (i = 0; i < list.length; i++) {
					sunNum++;
					if (!list[i]["isDel"]) {
						shiNum++;
						if (list[i].pid == item.id) {
							list[i]["isDel"] = 1;
							item["nextList"].p(list[i]);
						}
					}
				}
				if (item["nextList"].length) {
					getList(item["nextList"], list);
				}
			}
			//return result;
		}
		getList(list, red);
		var path = "";
		var currItem = getCurrItem(red, path);
		var topItem = getTopItem(red, currItem);
		if (topItem) {
			$.each(list, function (idx, item) {
				if (item.id == topItem.id) {
					item.open = true;
				}
			})
		}
		return list;
	}

	$.extend(zhx.dialog, {
		//选择图片（包含单选和多选）
		imgList: function (callback, isSingle) {
			zhx.box.show(template.imgListStr(), function ($box) {
				var $submit = $box.find(".btn-list a");
				var $tab = $box.find(".group-list p"), $selectElem;
				$tab.bind("click", function () {
					zhx.tabChangeClass($tab, $(this), zhx.ac);
				})
				var bindLiClick = function () {
					var $list = $box.find(".list li");
					/*是否为单选*/
					if (isSingle) {
						$list.bind("click", function () {
							var $item = $(this);
							zhx.tabChangeClass($list, $item);
							$selectElem = $box.find(".list ul .active");
							$submit.toggleClass(zhx.ac, !!$selectElem.length);
						})
					} else {
						$list.bind("click", function () {
							var $item = $(this);
							$item.toggleClass(zhx.ac);
							$selectElem = $box.find(".list ul .active");
							$submit.toggleClass(zhx.ac, !!$selectElem.length);
						})
					}
				}
				bindLiClick();
				$submit.bind("click", function () {
					if ($submit.hasClass(zhx.ac)) {
						callback && callback.call($box, $selectElem);
						$box.flowerHide();
					}
				})
			});
		},
		//选择商品 （多选） isOne : 是否单选 oldList:已选择的列表
		selectGoods: function (callback, isOne,oldList) {
			var getInfo = zhx.data.getBaseInfo();
			zhx.box.show(template.goodsStr([]), function ($box) {
				var $select = $box.find(".btn-select");
				var $submit = $box.find(".btn-submit");
				var $allChk = $box.find(".chk-all");
				var dataList = [], dataObj = {};
				var list = [];
				if (isOne) {
					$box.find(".btn-submit").hide();
					$box.find(".chk-all").hide();
					$box.find(".js_all").hide();
				}
				var pages = $box.find(".goods-pages").flowerPage({pageSize: 5});
				var data = {
					microshoppId: zhx.config.store.id
				}
				var hasId=function(id){
					var has = false;
						if(oldList&&oldList.length){
							$.each(oldList,function(){
								if(this.listingId==id){
									has=true;
								}

							});
						}
						return has;

				}
				pages.jsonp(zhx.data.host + "/api/finding/v1/listings?pageIndex={pageIndex}&pageSize={pageSize}", data, function (res, opts) {
					if (res.result) {
						list = res.result.listingList || [];
						var h = [];
						opts.listCount = res.result.totalNum || 0;	//总数据条数
						if (list&&list.length) {
							$.each(list, function () {
								h.p('<tr>');
								h.p('<td class="td-img">');
								h.p('<img src = "' + this.imgUrl + '"/></td>');
								h.p('<td class="td-title"><a target="_blank" href="' + this.listingUrl + '">' + this.listingName + '</a></td>');
								h.p('<td>' + this.storage + '</td>');
								h.p('<td>¥' + this.salePrice + '</td>');
								if (dataObj[this.listingId]||hasId(this.listingId)) {
									h.p('<td><a class="btn-select active">取消</a></td>');
									dataObj[this.listingId] = this;
								} else {
									h.p('<td><a class="btn-select">选择</a></td>');
								}
								h.p('</tr>');
							})
						} else {
							h.p('<tr><td colspan="5" height="100">未找到数据！</td></tr>');
						}
						$box.find(".goods-table tbody").html(h.join(" "));
						selectBtnActive();
					}
				})
				var getParam = function (orderBy) {
					var d = {
						brandId: $.trim($box.find(".js_brand").val()),
						storeCategroyId: $box.find(".store-tree").attr("data-val"),
						categroyId: $box.find(".shopping-tree").attr("data-val"),
						listingIds: $box.find(".js_goods_id").val(),
						listingName: $box.find(".js_goods_name").val(),
						orderType: orderBy || ""
					}
					for (var key in d) {
						if (d.hasOwnProperty(key)) {
							if (!d[key]) {
								delete d[key];
							}
						}
					}
					return $.extend({}, data, d);
				}
				//查询按钮
				$box.find(".btn-search").bind("click", function () {
					pages.config({data: getParam()});
					pages.reset();
				})
				//排序
				$box.find(".op-tab a").bind("click", function () {
					var $a = $(this), val = $a.attr("data-type");
					var cls = "";
					if (val == 1) {
						cls = "up";
					} else if (val == 2 || val == 3) { 
						cls = "down";
					}
					if ($a.hasClass(cls)) {
						$box.find(".op-tab a").removeClass("up down");
						$a.removeClass(cls);
						val = 0;
					} else {
						$box.find(".op-tab a").removeClass("up down");
						$a.addClass(cls);
					}
					pages.config({data: getParam(val)});
					pages.reset();
				})
				var selectBtnActive = function () {
					dataList = [];
					$.each(dataObj, function (key, val) {
						dataList.p(val);
					})
					if (dataList.length) {
						$submit.addClass(zhx.ac)
					} else {
						$submit.removeClass(zhx.ac);
					}
				}
				//选择
				$box.find(".goods-table").bind("click", function (e) {
					if (e.target.nodeName == "A") {
						var $btn = $(e.target);
						if ($btn.hasClass("btn-select")) {
							var idx = $box.find(".btn-select").index($btn);
							var item = list[idx];
							if (isOne) {
								item.typeName = "商品";
								item.name = item.listingName;
								item.src = item.listingUrl;
								callback && callback.call($box, item);
								$box.flowerRemove();
							} else {
								var isCel = $btn.hasClass(zhx.ac);
								$btn.text(isCel ? "选择" : "取消");
								if (isCel) {
									$btn.removeClass(zhx.ac);
									if (dataObj[item.listingId]) {
										delete dataObj[item.listingId];
									}
								} else {
									$btn.addClass(zhx.ac);
									if (dataObj[item.listingId]) {
									} else {
										dataObj[item.listingId] = item;
									}
								}
							}
							selectBtnActive();
						}
					}
				})


				//全选
				$allChk.bind("click", function () {
					var isSelect = this.checked;
					if (isSelect) {
						$.each($box.find(".btn-select"), function () {
							if ($(this).hasClass(zhx.ac)) {
							} else {
								$(this).trigger("click");
							}
						})
					} else {
						$.each($box.find(".btn-select"), function () {
							if ($(this).hasClass(zhx.ac)) {
								$(this).trigger("click");
							}
						})
					}
				})
				//店铺分类
				getInfo.then(function (res) {
					var list = res.storeCategoryList;
					//list.unshift({storeCategoryId: "", categoryName: "全部"});
					$box.find(".store-tree").tree({
						list: list,
						nextStr: "children",
						idStr: "storeCategoryId",
						nameStr: "categoryName"
					})
				})
				//商城分类
				getInfo.then(function (res) {
					var list = res.categroyList;
					//list.unshift({categoryId: "", name: "全部"});
					$box.find(".shopping-tree").tree({
						list: list,
						nextStr: "children",
						idStr: "categoryId",
						nameStr: "name"
					})
				})
				//品牌分类
				getInfo.then(function (res) {
					var $option = ['<option value=" ">请选择</option>'];
					$.each(res.brandList, function () {
						$option.p('<option value="' + this.brandId + '">' + this.brandName + '</option>');
					})
					$box.find(".js_brand").html($option.join(" "))
				})
				//提交
				$submit.bind("click", function () {
					if ($submit.hasClass(zhx.ac)) {
						callback && callback.call($box, dataList);
						$box.flowerRemove();
					}
				})
			});
		},
		//选择商品 （单选）
		selectGoodsSingleton: function (callback) {
			this.selectGoods(callback, true);
		},
		//选择商品分组（多选）
		selectGroup: function (callback) {
			var list = [{id: 1, name: "日常用品"}, {id: 2, name: "推荐商品"}, {id: 3, name: "服装商品"}];
			zhx.box.show(template.goodsListStr(list), function ($box) {
				var $select = $box.find(".btn-select");
				var $submit = $box.find(".btn-submit");
				var dataList = [], dataObj = {};
				//选择
				$select.bind("click", function () {
					var idx = $select.index(this);
					var item = list[idx];
					var $btn = $(this);
					var isCel = $btn.hasClass(zhx.ac);
					$btn.text(isCel ? "选择" : "取消");
					if (isCel) {
						$btn.removeClass(zhx.ac);
						if (dataObj[item.id]) {
							delete dataObj[item.id];
						}
					} else {
						$btn.addClass(zhx.ac);
						if (dataObj[item.id]) {
						} else {
							dataObj[item.id] = item;
						}
					}
					dataList = [];
					$.each(dataObj, function (key, val) {
						dataList.p(val);
					})
					if (dataList.length) {
						$submit.addClass(zhx.ac)
					} else {
						$submit.removeClass(zhx.ac);
					}
				})
				//提交
				$submit.bind("click", function () {
					if ($submit.hasClass(zhx.ac)) {
						callback && callback.call($box, dataList);
						$box.flowerHide();
					}
				})
			});
		},
		//选择商品分组（单选）
		selectGroupSingleton: function (callback) {
			var getInfo = zhx.data.getBaseInfo();
			zhx.box.show(template.goodsListStr([]), function ($box) {
				//店铺分类
				getInfo.then(function (res) {
					var list = res.storeCategoryList;
					$box.find(".store-tree").tree({
						list: list,
						nextStr: "children",
						idStr: "storeCategoryId",
						nameStr: "categoryName"
					})
				})
				//商品分类
				getInfo.then(function (res) {
					var list = res.categroyList;
					$box.find(".shopping-tree").tree({
						list: list,
						nextStr: "children",
						idStr: "categoryId",
						nameStr: "name"
					})
				})
				//品牌分类
				getInfo.then(function (res) {
					var $option = ['<option value=" ">请选择</option>'];
					$.each(res.brandList, function () {
						$option.p('<option value="' + this.brandId + '">' + this.brandName + '</option>');
					})
					$box.find(".js_brand").html($option.join(" "))
				})
				var getParam = function () {
					var d = {
						brandId: $.trim($box.find(".js_brand").val()),
						storeCategroyId: $box.find(".store-tree").attr("data-val"),
						categroyId: $box.find(".shopping-tree").attr("data-val"),
						orderType: $box.find("input[type='radio']:checked").val()
					}
					for (var key in d) {
						if (d.hasOwnProperty(key)) {
							if (!d[key]) {
								delete d[key];
							}
						}
					}
					return d;
				}
				$box.find(".btn-submit").bind("click", function () {
					callback && callback.call($box, getParam());
					$box.flowerHide();
				})
			});
		},
		//选择微页面（单选）
		selectMinPage: function (callback) {
			zhx.box.show(template.minPageStr(), function ($box) {
				var list = [];
				var pages = $box.find(".min-pages").flowerPage({pageSize: 5});
				var getParam = function () {
					return {
						searchTitle: $.trim($box.find(".search-name input").val())
					};
				}
				var data = getParam();
				pages.jsonp(zhx.config.store.basePath + "/api/v1/page/queryByForPage?pageIndex={pageIndex}&pageSize={pageSize}", data, function (res, opts) {
					var h = [];
					if (res.pageDtoPage && res.pageDtoPage.result) {
						list = res.pageDtoPage.result || [];
						opts.listCount = res.pageDtoPage.totalRecords || 0;	//总数据条数
						if (list) {
							$.each(list, function () {
								h.p('<tr>');
								h.p('<td class="td-title"><a target="_blank">' + this.pageTitle + '</a></td>');
								h.p('<td>' + (new Date(this.createTime)).format("yyyy-MM-dd") + '</td>');
								h.p('<td><a class="btn-select">选择</a></td>');
								h.p('</tr>');
							})
						} else {
						}
					} else {
						h.p('<tr><td colspan="3" height="100">未找到数据！</td></tr>');
					}
					$box.find(".min-page-table tbody").html(h.join(" "));
				})
				//选择
				$box.find(".min-page-table").bind("click", function (e) {
					if (e.target.nodeName == "A") {
						var $btn = $(e.target);
						if ($btn.hasClass("btn-select")) {
							var idx = $box.find(".btn-select").index($btn);
							var item = list[idx];
							item.typeName = "微页面";
							item.name = item.pageTitle;
							item.src = item.pageUrl;
							callback && callback.call($box, item);
							$box.flowerHide();
						}
					}
				})
				//搜索
				$box.find(".search-name a").bind("click", function () {
					pages.config({data: getParam()});
					pages.reset();
				})
			});
		},
		//选择活动（单选）
		selectActivity: function (callback) {
			var list = [{name: "活动1"}, {name: "活动2"}, {name: "活动3"}];
			zhx.box.show(template.activityStr(list), function ($box) {
				var $select = $box.find(".btn-select");
				$select.bind("click", function () {
					var idx = $select.index(this);
					callback && callback.call($box, {typeName: "营销活动", name: list[idx].name, src: idx});
					$box.flowerHide();
				})
			});
		}
	});
})(jQuery);