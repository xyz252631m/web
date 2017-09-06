/*
 * des:dom 列表
 *
 * */
;(function ($) {
	$.extend(zhx, {
		previewList: zhx.config.root.find(">div:visible").not(".move-box,.p-title,.op-list"),
		resetPrivewList: function () {
			this.previewList = zhx.config.root.find(">div:visible").not(".move-box,.p-title,.op-list");
			this.resetHeight();
			this.resetPluginList();
		},
		moveBox: zhx.config.root.find(".move-box"),
		resetHeight: function () {
			this.getHeightList(1);
			this.getTopList(1);
		},
		resetPluginList: function () {
			var list = [], dataList = [];
			$.each(this.previewList, function () {
				var index = zhx.getPluginItemIndex($(this).attr("id"));
				if (~index) {
					list.push(zhx.pluginList[index]);
					dataList.push(zhx.pluginList[index].data)
				}
			})
			zhx.pluginList = list;
			zhx.dataList = dataList;
		},
		opBox: zhx.config.root.find(".op-list"),
		getEditBox: zhx.config.editRoot.find(".con-bor"),
		getEditList: function () {
			return this.getEditBox.find(">div");
		},
		activeView: function (elem) {
			var item = $(elem), id = item.attr("id"), type = item.attr("data-type");
			zhx.previewList.removeClass(zhx.config.editClassName);
			item.addClass(zhx.config.editClassName);
			id && zhx.showEdit(id, item[0].offsetTop);
		},
		showSetting: function (id) {
			var $item = $("#" + id);
			zhx.getEditList().hide();
			$item.show();
			this.getEditBox.show();
		},
		_elemIdxList: null,		//当前的列表 按 索引排序 (key 为索引)
		_heightList: [],		//当前高度的列表  按 索引排序
		_topList: [],			//当前的offsetTop列表 按 索引排序
		elemList: function () {
		},
		elemListByIdx: function () {
			var obj = {};
		},
		getHeightList: function (isReset) {
			if (isReset || !this._heightList.length) {
				var h_list = [];
				this.previewList.each(function () {
					h_list.push($(this).outerHeight());
				})
				this._heightList = h_list;
			}
			return this._heightList;
		},
		getTopList: function (isReset) {
			if (isReset || !this._topList.length) {
				var top_list = [];
				this.previewList.each(function () {
					top_list.push(this.offsetTop);
				})
				this._topList = top_list;
			}
			return this._topList;
		},
		//视图--移动元素
		moveElem: function ($item, top) {
			var idx = this.previewList.index($item), targetIdx = idx;
			var h_list = this.getHeightList(), top_list = this.getTopList();
			if (top_list[idx] > top) {
				targetIdx--;
				if (targetIdx >= 0) {
					if (top_list[targetIdx] + h_list[targetIdx] / 2 > top + h_list[idx] / 2) {
						this.previewList.eq(targetIdx).before(this.previewList.eq(idx));
						this.resetPrivewList();
					}
				}
			} else {
				targetIdx++;
				if (targetIdx < h_list.length) {
					if (top + h_list[idx] / 2 > top_list[targetIdx] + h_list[targetIdx] / 2) {
						this.previewList.eq(targetIdx).after(this.previewList.eq(idx));
						this.resetPrivewList();
					}
				}
			}
		},
		//
		_shareList: [],
		//设置--移动元素
		shareMoveElem: function ($item, top, callback) {
			var list = this._shareList;
			var idx = list.index($item), targetIdx = idx, h_list = [], top_list = [];
			list.each(function () {
				h_list.push($(this).outerHeight());
			});
			list.each(function () {
				top_list.push(this.offsetTop);
			});
			//重置--重新获取li列表
			var resetList = function () {
				zhx._shareList = $item.parent("ul").find("li").not(".move-li");
			}
			if (top_list[idx] > top) {
				targetIdx--;
				if (targetIdx >= 0) {
					if (top_list[targetIdx] + h_list[targetIdx] / 2 > top + h_list[idx] / 2) {
						list.eq(targetIdx).before(list.eq(idx));
						resetList();
						callback && callback();
					}
				}
			} else {
				targetIdx++;
				if (targetIdx < h_list.length) {
					if (top + h_list[idx] / 2 > top_list[targetIdx] + h_list[targetIdx] / 2) {
						list.eq(targetIdx).after(list.eq(idx));
						resetList();
						callback && callback();
					}
				}
			}
		},
		createOp: function () {
			var list = [];
			$.each(this.config.plugin, function () {
				list.push("<a data-type='" + this + "'>" + zhx.plugins[this].name + "</a>")
			})
			this.opBox.html(list.join(" "));
		},
		addView: function (elem, afterElem) {
			if (afterElem) {
				$(afterElem).after(elem);
			} else {
				this.opBox.before(elem);
			}
		},
		addEditView: function (elem) {
			this.getEditBox.append(elem);
		},
		resizeEditView: function (elem) {
			var item = $(elem), id = item.attr("id");
			zhx.getEditBox.css("marginTop", item[0].offsetTop);
		}
	})
})(jQuery);