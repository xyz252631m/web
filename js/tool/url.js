function getSearchName(name) {
    var str = location.search.replace(/\?/, "");
    var arry = str.split("&");
    var obj = {};
    $.each(arry, function () {
        var tem = this.split("=");
        obj[tem[0]] = decodeURIComponent(tem[1]);
    });
    return obj[name] || "";
}
//# sourceMappingURL=url.js.map