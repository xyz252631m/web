// mi.register("acorn","/lib/acorn-8.0.5/acorn.js")12333
//get dir file list
function getDirList(data, callback) {
    _$.post("/code/getFileList", data, function (res) {
        callback && callback(res);
    });
}

//get file content
function getFileString(data, callback) {
    _$.post("/code/getFileString", data, function (res) {
        callback && callback(res);
    }, {
        responseType: "text",
        transformResponse: function (data) {
            return data;
        }
    });
}

//save file content
function saveFileString(data, callback) {
    _$.post("/code/saveFileString", data, function (res) {
        callback && callback(res);
    });
}

function getDate() {
    let d = new Date();
    return d.getFullYear() + "-" + d.getMonth();
}

let tool = {
    //获取后缀名
    getFileExtend(url) {
        let arr = url.split(".");
        let len = arr.length;
        return arr[len - 1];
    }
};
let _js = {
    test: {
        a: {b: 78},
        c: 3
    },
    ast: null,
    parseAst(text) {
        let comments = [];
        let tokens = [];
        let ast = acorn.parse(text, {
            ranges: true,
            onComment: function (block, text, start, end) {
                comments.push({
                    type: block ? "Block" : "Line",
                    value: text,
                    range: [
                        start,
                        end
                    ]
                });
            },
            // collect token ranges
            onToken: function (token) {
                tokens.push({
                    range: [
                        token.start,
                        token.end
                    ]
                });
            }
        });
        this.ast = ast;
        escodegen.attachComments(ast, comments, tokens);
        return ast;
    }
};
//基础
mi.define("base", function () {
    let filePath = "/server/codeDesign/js/index.js";
    getFileString({path: filePath}, function (res) {
        $(".code-box").text(res);
    });
    //按钮事件
    $(".op-box button").on("click", function () {
        let $btn = $(this);
        let type = $btn.attr("data-type");
        if (type === "save") {
            saveFileString({
                path: filePath,
                text: $(".code-box").text(),
                t: getDate()
            }, function (res) {
                console.log(res);
                alert(res.code);
            });
        }
    });
});
mi.define("init", function () {
    let filePath = "/server/codeDesign/js/index.js";
    let objTree = null, menuTree = null;
    let canvasAst = null;
    getFileString({path: filePath}, function (res) {
        // $(".code-box").text(res);
        let ext = tool.getFileExtend(filePath);
        if (ext === "js") {
            let t = _js.parseAst(res);
            mi.preload("objTree", "./js/objTree.js").then(function (ObjTree) {
                objTree = new ObjTree({$el: $(".tree-box")});
                objTree.init(t);

                $(".op-box button").eq(5).click();
                setTimeout(function () {
                    $(".tabs li").eq(2).click();
                }, 20)


            });
        }
    });

    //tabs
    $(".tabs li").on("click", function () {
        let $list = $(".tabs li"), $panels = $(".tabs-panel"), cls = "is-active";
        let idx = $list.index(this);
        $list.removeClass(cls).eq(idx).addClass(cls);
        if (idx !== -1) {
            $panels.hide().eq(idx).show();
            if (idx === 2) {
                if (canvasAst) {
                    canvasAst.resize();
                }
            }
        }
    });
    //按钮事件
    $(".op-box button").on("click", function () {
        let $btn = $(this);
        let type = $btn.attr("data-type");
        if (type === "test") {
            location.href = "http://localhost/server/codeDesign/index.html";
            return;
        } else if (type === "canvas") {

            if (!canvasAst) {
                mi.preload("canvasAst", "./js/canvasAst.js").then(function (CanvasAst) {
                    canvasAst = new CanvasAst({id: "container", width: window.innerWidth, height: window.innerHeight});
                    canvasAst.init(_js.ast);
                });

            }

        } else if (type === "save") {
            saveFileString({
                path: filePath,
                text: $(".code-box").text(),
                t: getDate()
            }, function (res) {
                console.log(res);
            });
        } else if (type === "convert") {
            let text = escodegen.generate(objTree.data, {
                comment: true,
                format: {
                    indent: {adjustMultilineComment: true},
                    quotes: "double"
                }
            });
            $(".result-box").text(text);
        } else if (type === "convert2") {
            $(".code-box").text($(".result-box").text());
        } else if (type === "menu") {
            $(".tabs-panel").hide().eq(4).show();
            if (!menuTree) {
                getDirList(null, function (res) {
                    mi.preload("treeMenu", "/jq/js/virTree.js").then(function (TreeMenu) {
                        menuTree = new TreeMenu({
                            $el: $(".menu-list-box"),
                            softList: [],
                            click: function (item, dom, catalogOpen) {
                                //console.log("this is click", catalogOpen, item, dom);
                                var self = this;
                                if (item.type === "catalog") {
                                    //异步未获取数据时 and 无下级节点数据
                                    if (!item.isGetedData) {
                                        // /&& item.children.length === 0
                                        if (item.loading) {
                                            return;
                                        }
                                        item.loading = this.openLiLoading(dom);
                                        //模拟数据
                                        getDirList({path: item.path}, function (res) {
                                            item.loading = self.closeLiLoading(dom);
                                            if (res.code === 200) {
                                                var list = res.data;
                                                // item.open = true;
                                                self.refreshNodeData(item, dom, list);
                                            } else {
                                                console.error(res.msg);
                                            }
                                        });
                                    } else {
                                    }
                                } else {
                                    let ext = tool.getFileExtend(item.path);
                                    let exList = ["rar"];
                                    if (exList.indexOf(ext) >= 0) {
                                        return;
                                    }
                                    //...
                                    getFileString({path: item.path}, function (res) {
                                        $(".code-box").text(res);
                                        if (ext === "js") {
                                            let t = _js.parseAst(res);
                                            objTree.resetData(t);
                                            $(".tabs li").eq(0).trigger("click");
                                        } else {
                                            // $(".code-box").text(res.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
                                            $(".tabs li").eq(1).trigger("click");
                                        }
                                    });
                                }
                            }
                        });
                        menuTree.toTree(res.data);
                        menuTree.init();
                    });
                });
            }
        }
        if (objTree) {
            let obj = objTree.getSelected();
            if (obj) {
                console.log(obj);
            }
        }
    });
    //modal
    $(".modal .modal-close").on("click", function () {
        $(".modal").removeClass("is-active");
    });
});
_js.test.a.b = 66;
console.log(_js.test.a.b, 66, 99)
