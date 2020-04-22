"use strict";
/**
 * @Description:
 * @author luohua
 * @date 2020/4/10
 */
/// <reference path ="../typings/jquery/jquery.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
var a = 10;
var alertBox = /** @class */ (function () {
    function alertBox() {
        this.defs = {
            title: "提示",
            url: "",
            width: 350,
            height: 160,
            isMove: false,
            isborder: true,
            borwidth: 4,
            iframeWidth: "100%",
            iframeHeight: '160px',
            showShadeLayer: true,
            noBtn: false,
            init: function () {
            },
            content: "",
            tiptype: "success",
            closetxt: '关闭',
            close: function () {
            },
            submittxt: '确定',
            submit: function () {
            } //确认的回调函数
        };
    }
    alertBox.prototype.template = function () {
        opts = $.extend({}, defaults, options);
        var arrHtml = this.getTitle(opts);
        arrHtml.push('<div class="alert-main">');
        arrHtml.push(img);
        arrHtml.push("<span style='width: " + (opts.width - (img ? 100 : 20)) + "px;display: inline-block;'>");
        arrHtml.push(opts.content);
        arrHtml.push('</span>');
        arrHtml.push('</div>');
        arrHtml.push(this.getBtn(opts));
        arrHtml.push("</div></div>");
        this.addBody(arrHtml.join(""));
        opts.init.call(a.alertBox);
    };
    return alertBox;
}());
exports.alertBox = alertBox;
//# sourceMappingURL=alertBox.js.map