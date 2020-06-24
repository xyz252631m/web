// declare let $: any;
function getSearchName(name) {
    // @ts-ignore
    var str = location.search.replace(/\?/, "");
    var arry = str.split("&");
    var obj = {};
    $.each(arry, function () {
        var tem = this.split("=");
        obj[tem[0]] = decodeURIComponent(tem[1]);
    });
    return obj[name] || "";
}
var tool = /** @class */ (function () {
    function tool() {
        var arr = [];
        arr.push(345);
    }
    return tool;
}());
