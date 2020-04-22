
function getSearchName(name) {
    let str = location.search.replace(/\?/, "");
    let arry = str.split("&");
    let obj = {};
    $.each(arry, function () {
        var tem = this.split("=");
        obj[tem[0]] = decodeURIComponent(tem[1]);
    })
    return obj[name] || "";
}