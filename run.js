let http = require("http");
let url = require("url");
// let util = require("util");
let fs = require('fs');
let path = require("path");
let filePath = path.resolve();
let querystring = require('querystring');


let mTool = require('./tool/run.js');

mTool.updateMenuData();

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

let $ = require("./js/jquery-3.5.1");

//获取后缀名
function getdir(url) {
    let arr = url.split('.');
    let len = arr.length;
    return arr[len - 1];
}

//获取服务器路径
function getServerPath(_url) {
    return url.parse(_url).pathname.substr(1)
}


//获取post data
function getPostData(req, callback) {
    let data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        data = decodeURI(data);
        let dataObj = JSON.parse(data);
        callback && callback(dataObj)
    });
}

//递归删除 .d.ts
function removeDTS() {
    let _path = "./lib/resource";

    console.log("\033[;31m begin ----- removeDTS！ \033[0m");
    let fn = function (_p) {
        fs.readdir(_p, function (err, files) {
            if (files) {
                files.forEach(function (f) {
                    let p = _p + "/" + f;
                    let stat = fs.statSync(p);
                    if (stat.isDirectory()) {
                        fn(p)
                    } else {
                        if (f.indexOf(".d.ts") >= 0) {
                            console.log(f)
                            //删除
                             fs.unlinkSync(p)
                             fs.unlinkSync(p.replace(".d.ts",".js"))
                        }
                    }
                })
            }
        })
    }

    fn(_path);


}

removeDTS();


//出错避免中断
process.on('uncaughtException', function (err) {
    console.error('Caught exception: ' + err);
});