var http = require("http");
var url = require("url");
// var util = require("util");
var fs = require('fs');
var path = require("path");
var filePath = path.resolve();
var querystring = require('querystring');

let resultMsg = {
    success(msg, code) {
        return {
            code: 200 || code,
            msg: msg || "执行成功！"
        }
    },
    error(msg, code) {
        return {
            code: 10000 || code,
            msg: msg || "执行失败！"
        }
    }
}

//获取后缀名
function getdir(url) {
    var arr = url.split('.');
    var len = arr.length;
    return arr[len - 1];
}

//获取服务器路径
function getServerPath(_url) {
    return url.parse(_url).pathname.substr(1)
}

//获取post data
function getPostData(req, callback) {
    var data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        data = decodeURI(data);
        var dataObj = JSON.parse(data);
        callback && callback(dataObj)
    });
}

http.createServer(function (request, response) {
    //获取请求头


    console.log()
//判断请求方式
    let pathUrl = request.url;
    if (request.method === "POST") {
        if (pathUrl === "/updateFile") {
            getPostData(request, function (dataObj) {
                console.log("dataObj", dataObj)
                fs.writeFile(getServerPath(dataObj.url), dataObj.text, function (err, data) {
                    if (err) {
                        response.end(JSON.stringify(err));
                    } else {
                        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        response.end(JSON.stringify(resultMsg.success()));
                    }
                });
            })


        } else if (pathUrl === "/renameFile") {

        } else if (pathUrl === "/deleteFile") {

        } else if (pathUrl === "/getFile") {
            getPostData(request, function (dataObj) {
                fs.readFile(getServerPath(dataObj.url), function (err, data) {
                    if (err) {
                        response.end(JSON.stringify(err));
                    } else {
                        response.writeHead(200, {'Content-Type': 'text/palin; charset=utf-8'});
                        response.end(data, 'binary');
                    }
                });
            })
        } else {
            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            response.end(JSON.stringify(resultMsg.error("未找到！")));
        }
    } else {
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
                        var style = "overflow:auto";
                        response.write("<div style='overflow:auto;background:#222'>" + files.map(d => `<p style="margin:0"><a href="${path.join(pathname, d)}">${d}</a></p>`).join("").toString() + "</div>");
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
    }


    // fs.readFile(pathname.substr(1), function (err, data) {
    //
    //
    //     response.end(data);
    // })


}).listen(8888)
console.log("服务启动成功")


//出错避免中断
process.on('uncaughtException', function (err) {
    console.error('Caught exception: ' + err);
});