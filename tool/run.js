let fs = require('fs');
//更新菜单数据
exports.updateMenuData = function () {
    let _p = "./tool/html";
    let jsFile = "./tool/js/menu.js";
    fs.readdir(_p, function (err, files) {
        if (files) {
            let list = files.map((d, i) => {
                let file_text = fs.readFileSync(_p + '/' + d, 'utf-8');
                let title = file_text.match(/<title>(.*?)<\/title>/);
                return {
                    id: i + 1,
                    name: title ? title[1] : d,
                    fileName: d.replace(".html", "")
                }
            });
            let content = `define("menuList",function(){\n    return ${JSON.stringify(list)} \n})`;
            fs.writeFile(jsFile, content, function (err) {
                if (err) {
                    console.log("\033[;31m tool ----- 菜单生成失败！ \033[0m", err);
                } else {
                    console.log('\033[;32m tool ----- 菜单生成成功！ \033[0m')
                }
            });
        }
    })
}


