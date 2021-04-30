/**
 * @Description:
 * @author luohua
 * @date 2020/4/10
 */
/// <reference path ="../typings/jquery/jquery.d.ts"/>

// declare var $: (selector: string) => any;


let a = 10;

export class alertBox {
    constructor() {
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
            content: "", //直接显示此内容
            tiptype: "success",   //success error none
            closetxt: '关闭',
            close: function () {
            },    //右上角 and  关闭按钮的回调函数
            submittxt: '确定',
            submit: function () {
            } //确认的回调函数
        };
    }

    template() {


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


    }
}