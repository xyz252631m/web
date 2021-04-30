module.exports = {
//获取post data
    getPostData(req, callback) {
        let data = '';
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            data = decodeURI(data);
            let dataObj = JSON.parse(data||null)||{};
            callback && callback(dataObj)
        });
    },
    //get date
    getDate() {
        let d = new Date();
        return d.getFullYear() + "-" + d.getMonth();
    },
    //获取服务器路径
    getServerPath(_url) {
        return url.parse(_url).pathname.substr(1)
    },
    //获取后缀名
    getFileExtend(url) {
        let arr = url.split('.');
        let len = arr.length;
        return arr[len - 1];
    },

    //返回结果
    result: {
        success(data, code) {
            return JSON.stringify({
                code: 200 || code,
                data: data || null
            })
        },
        error(msg, code) {
            return JSON.stringify({
                code: 10000 || code,
                msg: msg || "执行失败！"
            })
        }
    },



}