let fs = require('fs');
let url = require("url");
let tool = require('../tool');
let path = require("path");
//文件路径 E://a/b/c
let filePath = path.resolve();
module.exports = {
    init(request, response) {
        let urlObj = url.parse(request.url);
        let pathname = urlObj.pathname;
        if (request.method === "POST") {
            if (pathname === "/code/getFileList") {
                // let params = new URLSearchParams(urlObj.search);
                // let p_path = params.get("path") || "";
                // //path.join win/os 连接符不同
                // console.log(1234,p_path,path.join(filePath, p_path))
                tool.getPostData(request, function (data) {
                    let p_path = data.path || "";
                    fs.readdir(path.join(filePath, p_path), function (err, files) {
                        // response.writeHead(200, {'Content-Type': 'text/html'});
                        if (err) {
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(tool.result.error(err), 'binary');
                        } else {
                            let list = [];
                            //写会相应内容
                            if (files) {
                                list = files.map((d,i) => {
                                    let _path = path.join(p_path, d);
                                    let stat = fs.statSync(_path);
                                    return {
                                        path: _path,
                                        type: stat.isDirectory() ? "catalog" : "file",
                                        name: d,
                                        id: _path,
                                        pid: p_path
                                    }
                                })
                            }
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(tool.result.success(list), 'binary');
                        }
                    });
                })


            } else if (pathname === "/code/getFileString") {
                tool.getPostData(request, function (data) {
                    let p_path = data.path || "";
                    fs.readFile(path.join(filePath, p_path), function (err, data) {
                        if (err) {
                            response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                            response.end(tool.result.error(err), 'binary');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                            response.end(data, 'binary');
                        }
                    });
                })
            } else if (pathname === "/code/saveFileString") {
                console.log("============", request.headers.referer)
                if (request.headers.referer !== "http://localhost/server/codeDesign/index.html" && request.headers.referer !== "http://121.5.68.150/server/codeDesign/index.html") {
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    response.end(tool.result.error("no auth"), 'binary');
                    return;
                }
                tool.getPostData(request, function (data) {
                    let p_path = data.path || "", text = data.text || "", t = data.t || "";
                    let d = tool.getDate();
                    if (d !== t) {
                        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        response.end(tool.result.error("no auth"), 'binary');
                        return;
                    }
                    fs.writeFile(path.join(filePath, p_path), text, 'utf8', function (err, data) {
                        if (err) {
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(tool.result.error(err), 'binary');
                        } else {
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(tool.result.success(), 'binary');
                        }
                    });
                })
            }
        } else if (request.method === "GET") {


        }


    }


}
