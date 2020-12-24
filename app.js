var http = require("http");
var url = require("url");
// var util = require("util");
var fs = require('fs');
var path = require("path");
var filePath = path.resolve();

//获取后缀名
function getdir(url) {
    var arr = url.split('.');
    var len = arr.length;
    return arr[len - 1];
}

http.createServer(function (request, response) {
    //解析请求，包括文件名
    var pathname = url.parse(request.url).pathname;
    //输出请求的文件名
    // console.log("Request for " + pathname);
    //从文件系统中都去请求的文件内容
    fs.readFile(pathname.substr(1), function (err, data) {
        if (err) {
            fs.readdir(path.join(filePath, pathname), function (err, files) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                //写会相应内容
                if (files) {
                    response.write(files.map(d => `<p style="margin:0"><a href="${path.join(pathname, d)}">${d}</a></p>`).join("").toString());
                }
                //发送响应数据
                response.end();
            });
            console.log(err);
        } else {
            //HTTP 状态码 200 ： OK
            //Content Type:text/plain
            var t = getdir(pathname);
            if (t === "html") {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            } else if (t === "css") {
                response.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
            } else if (t === "jpg") {
                response.writeHead(200, {'Content-Type': 'image/jpeg'});
            } else if (t === "png") {
                response.writeHead(200, {'Content-Type': 'image/png'});
            } else if (t === "js") {
                response.writeHead(200, {'Content-Type': 'application/javascript'});
            } else if (t === "woff") {
                response.writeHead(200, {'Content-Type': 'font/woff'});
            } else if (t === "woff2") {
                response.writeHead(200, {'Content-Type': 'font/woff2'});
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
            }
            //写会相应内容
            response.end(data, 'binary');
        }
    });
}).listen(8888)
console.log("服务启动成功")