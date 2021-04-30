let http = require("http");
let url = require("url");
// let util = require("util");
let fs = require('fs');
let path = require("path");
let filePath = path.resolve();
let querystring = require('querystring');
let codeDesign = require('./server/codeDesign');

console.log(123, codeDesign)

let tool = require('./server/tool');
let resultMsg = tool.result;

//获取后缀名
let getdir = tool.getFileExtend;

//获取服务器路径
let getServerPath = tool.getServerPath;


http.createServer(function (request, response) {

    codeDesign.init(request, response);
    //获取请求头
    //判断请求方式
    let pathUrl = request.url;
    if (request.method === "POST") {
        if (pathUrl === "/updateFile") {
            tool.getPostData(request, function (dataObj) {
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
            tool.getPostData(request, function (dataObj) {
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
            // response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            // response.end(JSON.stringify(resultMsg.error("未找到路径！")));
            // response.end();
        }
    } else {
        //解析请求，包括文件名
        let pathname = url.parse(request.url).pathname;
        //输出请求的文件名
        // console.log("Request for " + pathname);
        //从文件系统中都去请求的文件内容
        fs.readFile(pathname.substr(1), function (err, data) {

            if (err) {
                fs.readdir(path.join(filePath, pathname), function (err2, files) {
                    if (err2) {
                        response.writeHead(404, {'Content-Type': 'text/html'});
                    } else {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        //写会相应内容
                        if (files) {
                            let style = "overflow:auto";
                            response.write("<div style='overflow:auto;background:#fff'>" + files.map(d => `<p style="margin:0"><a href="${path.join(pathname, d)}">${d}</a></p>`).join("").toString() + "</div>");
                        }
                    }
                    //发送响应数据
                    response.end();
                });
                console.log(1236666, err);
            } else {
                let stat = fs.statSync(pathname.substr(1))
                const serverTime = stat.ctime.toUTCString();
                //读取时间
                const clientTime = request.headers["if-modified-since"];
                // 若是本地的文件修改时间和浏览器返回的修改时间相同，则使用缓存的数据，返回304
                if (clientTime === serverTime) {
                    response.statusCode = 304
                    return response.end()
                }
                //强制缓存 单位: s
                let cacheObj = {'cache-control': 'max-age=10', "Last-Modified": serverTime};

                //HTTP 状态码 200 ： OK
                //Content Type:text/plain
                let t = getdir(pathname);
                if (t === "html") {
                    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', ...cacheObj});
                } else if (t === "css") {
                    response.writeHead(200, {'Content-Type': 'text/css; charset=utf-8', ...cacheObj});
                } else if (t === "jpg") {
                    response.writeHead(200, {'Content-Type': 'image/jpeg', ...cacheObj});
                } else if (t === "png") {
                    response.writeHead(200, {'Content-Type': 'image/png', ...cacheObj});
                } else if (t === "js") {
                    response.writeHead(200, {'Content-Type': 'application/javascript', ...cacheObj});
                } else if (t === "woff") {
                    response.writeHead(200, {'Content-Type': 'font/woff', ...cacheObj});
                } else if (t === "woff2") {
                    response.writeHead(200, {'Content-Type': 'font/woff2', ...cacheObj});
                } else {
                    response.writeHead(200, {'Content-Type': 'text/html', ...cacheObj});
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


}).listen(3000)
console.log("服务启动成功")


//出错避免中断
process.on('uncaughtException', function (err) {
    console.error('Caught exception: ' + err);
});