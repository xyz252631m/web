/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("hr", function () {
		return {
			name: "辅助线",
			isDelete:1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "sty-hr">');
				html.push('<div class = "mc"><p></p></div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function () {
				var html = [];
				html.push('<div class = "set-sty-hr" style="display: block">');
				html.push('<p><span>颜色：</span><label class = "label-color"><input type = "color" value = "#ececec"></label><input class="btn-reset" type="button" value="重置"/>');
				html.push('<label class="label-checkbox"><input type="checkbox"/>左右留边<i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('<p><span>分类：</span><label class = "label-radio label-radio-active"><input type = "radio" value = "solid"  checked="checked"/>实线 <i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" value = "dashed"/>虚线<i class = "i-icon"></i></label>');
				html.push('<label class = "label-radio"><input type = "radio" value = "dotted"/>点线 <i class = "i-icon"></i></label>');
				html.push('</p>');
				html.push('</div>');
				return html.join(" ");
			},
			data:{
				isBlank:false,
				color:"#ececec",
				type:"solid"

			},
			init: function (viewElem, settingElem) {
				var self = this;
				var $list = settingElem.find(".label-radio");
				zhx.other.checkbox(settingElem.find(".label-checkbox"), function () {
					var check = $(this).prop("checked");
					if (check) {
						viewElem.find(".mc p").addClass("is-blank");
					} else {
						viewElem.find(".mc p").removeClass("is-blank");
					}
					self.data.isBlank = check;
				});
				zhx.other.radio($list, function (type) {
					var val = $(this).val();
					viewElem.find(".mc p").css("border-bottom-style", val);
					self.data.type = val;
				});
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".mc p").css("border-color", this.value);
					self.data.color = this.value;
				});
				settingElem.find(".btn-reset").bind("click", function () {
					settingElem.find(".label-color input").val("#ececec");
					settingElem.find(".label-color input").trigger("change");
					$list.eq(0).trigger("click");
					if (settingElem.find(".label-checkbox input").eq(0).prop("checked")) {
						settingElem.find(".label-checkbox").eq(0).trigger("click");
					}
				})
			}
		}
	})
})(jQuery);