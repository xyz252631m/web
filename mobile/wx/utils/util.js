const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};


const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n
};
/**
 * 空闲控制函数， fn仅执行一次
 * @param fn{Function}     传入的函数
 * @param delay{Number}    时间间隔
 * @param options{Object}  如果想忽略开始边界上的调用则传入 {leading:false},
 *                         如果想忽略结束边界上的调用则传入 {trailing:false},
 * @returns {Function}     返回调用函数
 */
const debounce = (fn, delay, options) => {
    var timeoutId;
    if (!options) options = {};
    var leadingExc = false;

    return function () {
        var that = this,
            args = arguments;
        if (!leadingExc && !(options.leading === false)) {
            fn.apply(that, args);
        }
        leadingExc = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function () {
            if (!(options.trailing === false)) {
                fn.apply(that, args);
            }
            leadingExc = false;
        }, delay);
    }
};

let op = {
    //保存到云上
    saveBook: function () {
        //SecretId:AKID77KUTIIOeiaLvItfhaKZhcLYjjW7Hu2U
        //SecretKey:UowwKkAUdaPHG7n9Wlz5JPJ0sIcllY9n
        if (this.isExpires()) {
            return;
        }
        var bucket = "test";

        function getAuth() {
            var skey = 'UowwKkAUdaPHG7n9Wlz5JPJ0sIcllY9n';
            var random = parseInt(Math.random() * Math.pow(2, 32));
            var now = parseInt(new Date().getTime() / 1000);
            var e = now + 60 * 10; //签名过期时间为当前+60s
            var path = ''; //多次签名这里填空
            // "a=[appid]&b=[bucket]&k=[SecretID]&e=[expiredTime]&t=[currentTime]&r=[rand]&f="
            var str = 'a=1251114761&b=test&k=AKID77KUTIIOeiaLvItfhaKZhcLYjjW7Hu2U&e=' + e + '&t=' + now + '&r=' + random +
                '&f=' + path + '';
            var sha1Res = CryptoJS.HmacSHA1(str, skey); //这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
            var strWordArray = CryptoJS.enc.Utf8.parse(str);
            var resWordArray = sha1Res.concat(strWordArray);
            var res = resWordArray.toString(CryptoJS.enc.Base64);
            //res = encodeURIComponent(res);
            return res;
        }

        function cosAjax(url, data, callback, error) {
            $.ajax({
                url: url,
                type: "post",
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                data: data,
                crossDomain: true,
                contentType: false, //必须
                processData: false,
                //jsonp: "jsoncallback",
                success: function (res) {
                    callback && callback(res);
                },
                error: function (err) {
                    error && error(err);
                }
            });
        }

        //http://test-1251114761.costj.myqcloud.com/ebook/69FE0EDB17C93FAF9948/bookshelf.json
        var newFolder = '/ebook/' + localStorage["openid"].toString().substring(0, 20) + "/"; //填你需要创建的文件夹，记得用斜杠包一下
        var createFilder = function () {
            var param = new FormData();
            param.append("op", "create");
            cosAjax("http://tj.file.myqcloud.com/files/v2/1251114761/test" + newFolder + "?sign=" + getAuth(), param, function (res) {
                tool.showTip("创建目录成功!");
                uploadFile();
            }, function (err) {
                tool.showTip("创建目录失败!");
                tool.showTip(err);
            })
        }
        var uploadFile = function () {
            var param = new FormData();
            param.append("op", "upload");
            param.append("filecontent", JSON.stringify(lc.getBookshelf()));
            param.append("insertOnly", "0");
            cosAjax("http://tj.file.myqcloud.com/files/v2/1251114761/test" + newFolder + "/bookshelf.json?sign=" + getAuth(), param, function (res) {
                tool.alert("同步成功！");
            }, function () {
                tool.showTip("同步失败!");
            })
        }
        $.get("http://tj.file.myqcloud.com/files/v2/1251114761/test" + newFolder + "?sign=" + getAuth() + "&op=stat").success(function () {
            tool.showTip("获取目录成功!");
            uploadFile();
        }).error(function () {
            tool.showTip("获取目录失败!");
            createFilder();
        })
    },
    downNoteList: function (params, callback) {
        //http://test-1251114761.costj.myqcloud.com/ebook/69FE0EDB17C93FAF9948/bookshelf.json
        //var url = "https://test-1251114761.cos.ap-beijing-1.myqcloud.com/" + params.nickName + "/list.json";
        var url = "https://test-1251114761.cos.ap-beijing-1.myqcloud.com/ebook/69FE0EDB17C93FAF9948/bookshelf.json";
        wx.downloadFile({
            url: url,
            filePath: `${wx.env.USER_DATA_PATH}/list.json`,
            success: function (res) {

                if (res.statusCode === 200) {
                    console.log("res", res);
                } else {
                    console.log("res", res);
                    wx.showToast({
                        title: '数据下载失败！',
                        icon: 'none',
                        duration: 2000
                    })
                }


                // wx.showToast({
                //   title: '同步成功！',
                //   icon: 'success',
                //   duration: 2000
                // });
            },
            fail: function () {
                wx.showToast({
                    title: '数据下载失败！',
                    icon: 'error',
                    duration: 2000
                })
            }

        })


        // $.get(url).success(function(res) {
        //   var list = JSON.parse(res);
        //   callback && callback(list);
        //   //$.each(list, function () {
        //   //  lc.addBookshelf(this);
        //   //})
        // }).error(function(err) {
        //   tool.alert("下载书架数据失败！");
        //   tool.showTip(err);
        // });
    },
    synchroBook: function () {
        var self = this;
        this.downBook(function (list) {
            lc.addListBookshelf(list);
            self.saveBook();
        })
    }
}


module.exports = {
    formatTime: formatTime,
    debounce,
    ...op
}
