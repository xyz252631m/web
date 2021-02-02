let all_config = {
    tabList: [
        {title: "catalog", path: "/catalog"},
        {title: "design", path: "/design"},
        {title: "code", path: "/code"},
        {title: "setting", path: "/setting"}
    ]
}

let mixin = {

    methods: {
        ajaxPost(url, data, option) {
            let self = this;
            this.loading = 0;
            let opt = $.extend({type: "post", url, data}, option);
            return $.ajax(opt).then(function (res) {
                self.loading = 2;
                // let num = pas.float(lc.get("flow"));
                // num += pas.float((check.len(res) / 3072).toFixed(2));
                // lc.set("flow", num);
                res = res.replace(/src/g, "data-src");
                return res;
            }, function (err) {
                console.log(url, err)
            }).always(function () {
                self.loading = 2;
            });
        },
        ajaxGet(url, option) {
            let self = this;
            this.loading = 0;
            let opt = $.extend({
                type: "get",
                url,
                // contentType: "application/x-www-form-urlencoded; charset=gbk"
            }, option);
            console.log(opt)


            return $.ajax(opt).then(function (res) {
                self.loading = 2;
                // let num = pas.float(lc.get("flow"));
                // num += pas.float((check.len(res) / 3072).toFixed(2));
                // lc.set("flow", num);
                res = res.replace(/src/g, "data-src").replace(/script/g, "div").replace(/style/g, "div");
                return res;
            }, function (err) {
                console.log(url, err)
            }).always(function () {
                self.loading = 2;
            });
        },
        xhrGet(url, fn) {
            var xhr = new XMLHttpRequest();
            //true表示异步
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                // readyState == 4说明请求已完成
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    //responseText：从服务器获得数据
                    let res = xhr.responseText.replace(/src/g, "data-src").replace(/script/g, "div").replace(/style/g, "div");

                    //  console.log(res)

                    fn.call(this, res);
                }
            };
            xhr.send();
        },

    }


};

let tool = {
    isMobile: !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)


}