/*
 * des: banner and logo
 *
 * */
;(function ($) {
	zhx.addPlugin("editor", function () {
		return {
			name: "富文本",
			isDelete: 1,
			isRepeat: 1,
			isShowOp: 1,
			viewTemplate: function () {
				var html = [];
				html.push('<div class = "sty-editor">');
				html.push('<div class = "mc"><div class="ed-main-txt">点击编辑"富文本"内容</div></div>');
				html.push('</div>');
				return html.join(" ");
			},
			settingTemplate: function (data) {
				var html = [];
				html.push('<div class = "set-sty-editor" style="display: block">');
				html.push('<p><span class="sp-label">颜色：</span><label class = "label-color"><input type = "color" value = "#ffffff"></label><input class="btn-reset" type="button" value="重置"/>');
				html.push('<label class="label-checkbox"><input type="checkbox"/>全屏显示<i class = "i-icon"></i></label>');
				html.push('</p>');
				data.editorId = new Date().getTime() + 100;
				console.log(data.editorId);
				html.push('<script id="editor_' + data.editorId + '" type="text/plain"></script>');
				html.push('</div>');
				return html.join(" ");
			},
			data: {
				editorId: "",
				html: "",
				isFull: false,
				bgColor: "#ffffff"
			},
			init: function (viewElem, settingElem) {
				var self = this;
				var editor = UE.getEditor('editor_' + this.data.editorId, {
					initialFrameWidth: "400", initialFrameHeight: "300"
				})
				editor.addListener("contentChange", function () {
					self.data.html = editor.getContent();
					viewElem.find(".ed-main-txt").html(self.data.html);
				});
				//ready
				editor.addListener('ready', function (editor) {
					//settingElem.find("#editor").removeAttr("style")
				});
				//背景色
				settingElem.find(".label-color input").bind("change", function () {
					viewElem.find(".mc").css("background-color", this.value);
					self.data.bgColor = this.value;
				});
				//背景色重置
				settingElem.find(".btn-reset").bind("click", function () {
					//viewElem.css("background-color", "#ffffff");
					settingElem.find(".label-color input").val("#ffffff");
					settingElem.find(".label-color input").trigger("change");
				})
				//是否全屏
				zhx.other.checkbox(settingElem.find(".label-checkbox"), function () {
					var check = $(this).prop("checked");
					zhx.classOp(viewElem.find(".mc"), check, "full");
					self.data.isFull = check;
				});
			},
			edit: function (initData) {
				$.extend(this.data, initData);
				var data = this.data;
				var editor = UE.getEditor('editor_' + data.editorId);
				editor.addListener('ready', function ( ) {
					//settingElem.find("#editor").removeAttr("style")
					editor.setContent(data.html);
				});


			},
			destroy: function () {
				UE.getEditor('editor_' + this.data.editorId).destroy();
			}
		}
	})
})(jQuery);