let tool = {
    trim(str) {
        return (str || "").trim();
    },
    match(str, reg) {
        return (str || "").match(reg) || []
    }
}


class css2less {


    //转为单行
    inlineToList(newVal) {
        let val = newVal.replace(/\s+/g, " ")
            .replace(/[\t\n]|^\s*|\s$/g, "")
            // .replace(/\s*\{\s*/g, " { \n")
            // .replace(/\s*;\s*/g, ";\n")
            .replace(/\s*}\s*/g, "}\n")
            //.replace(/\/\*/g, "/*\n")
            .replace(/\*\//g, "*/\n");
        //.replace(/\n\*\//g, "\*\/\n")
        // .replace(/\*\//g, "\*\/\n");


        let list = val.split(/\n/).map(tool.trim);

        let len = list.length;

        for (let i = 0, d = null; i < len; i++) {
            d = list[i];
            //存在注释
            let comments = tool.match(d, /^\/\*/g);
            if (comments.length) {
                while (tool.match(d, /\*\//g).length < tool.match(d, /\/\*/g).length) {
                    list[i] = "";
                    i++;
                    d = d + list[i];
                    if (i >= len) {
                        break;
                    }
                }
                list[i] = d;
            } else {
                //包含行内注释
                let closeTags = tool.match(d, /}/g);
                if (closeTags.length) {
                    while (tool.match(d, /{/g).length < tool.match(d, /}/g).length) {
                        if (i < 0) {
                            break;
                        }
                        list[i] = "";
                        i--;
                        d = list[i] + d;
                    }
                    list[i] = d;
                }
            }
        }

        list = list.filter(tool.trim);
        return list;
    }

    //分割名称
    splitName(name) {
        let list = name.split(",");
        let arr = [];
        let less = "&";
        let ts = ["::", ":"];
        let types = ["+", ">>>", ">", "*", ...ts, " "];
        list.forEach((d, di) => {
            arr[di] = [d];
            let flag = true;
            while (flag) {
                types.forEach(t => {
                    for (let i = 0, sList = []; i < arr[di].length; i++) {
                        sList = arr[di][i].split(t).filter(tool.trim);
                        console.log("sList",sList)
                        if (sList.length > 1) {
                            arr[di].splice(i, 1, ...(sList.map((d, k) => {
                                    if (k) {
                                        if (ts.indexOf(t) >= 0) {
                                            return less + tool.trim(t + tool.trim(d))
                                        } else {
                                            return tool.trim(t + tool.trim(d))
                                        }
                                    } else {
                                        return tool.trim(d)
                                    }
                                }))
                            )
                            break;
                        } else {
                            flag = false;
                        }
                    }
                })
            }
        })
        arr.forEach((d, i) => {
            arr[i] = d.filter(d=>{
                return d!==less&&tool.trim(d)
            });
        })
        return arr;
    }

    //添加css
    addPath(name, valStr, map, repList, _notesList) {

        let val = tool.trim(valStr);
        if (val) {
            let end = val[val.length - 1];
            if (end !== ";") {
                val += ";";
            }
        }

        let lists = this.splitName(name);
        let item = null;

        lists.forEach(list => {
            list.forEach((d, i) => {
                if (!i) {
                    if (!map[d]) {
                        map[d] = {
                            val: ""
                        };
                    }
                    item = map[d];
                } else {
                    if (!item[d]) {
                        item[d] = {
                            val: ""
                        };
                    } else {
                        repList.push({
                            name: d,
                            text: item[d],
                            val: val
                        });
                    }
                    item = item[d];
                }
            })
            item.notes = _notesList;
            item.val += val;
        })
    }

    //拼接 css
    outVal(map, h, t_list) {
        let fn = function (item, h) {
            h.push(item.val);
            let flag = false;
            for (let key in item) {
                if (key === "val" || key === "notes") {
                    continue;
                }
                if (item.hasOwnProperty(key)) {
                    flag = true;
                    h.push("\n");
                    if (item[key].notes && item[key].notes.length) {
                        h.push(item[key].notes.join("\n") + "\n")
                    }
                    h.push(key);
                    h.push("{");
                    fn(item[key], h);
                    h.push("}");
                }
            }
            if (flag) {
                h.push("\n");
            }
        }

        //普通css
        for (let key in map) {
            if (map.hasOwnProperty(key)) {
                if (map[key].notes && map[key].notes.length) {
                    h.push(map[key].notes.join("\n") + "\n")
                }
                h.push(key);
                h.push("{");
                fn(map[key], h);
                h.push("}\n");
            }
        }

        //@ -- 动画、media
        t_list.forEach(d => {
            h.push(d);
        })
    }

    //转换
    convent(newVal) {

        let list = this.inlineToList(newVal);
        // 错误list
        let noList = [];
        //重复list
        let repList = [];
        //注释 对象
        let notesList = [];
        //@ list
        let t_list = [];

        let map = {};

        list.forEach((d, i) => {
            //是否为注释
            if (tool.match(d, /^\/\*/).length) {
                notesList.push(d);
            } else {
                //排除 @ -- 动画、media
                if (tool.match(d, /^@/).length) {
                    t_list.push(d);
                } else {
                    let idx = d.indexOf("{");
                    if (idx >= 0) {
                        let name = d.substring(0, idx);
                        let val = d.substring(idx + 1, d.length - 1);
                        let _notesList = notesList;
                        notesList = [];
                        this.addPath(tool.trim(name), tool.trim(val), map, repList, _notesList);
                    } else {
                        noList.push({d: d, i: i});
                    }
                }
            }
        })

        if (noList.length) {
            console.log("========noList==========")
            console.log(noList)
            console.log(list.forEach((d, i) => {
                console.log(i, d)
            }))
        }

        let h = [];
        this.outVal(map, h, t_list);
        return h.join(" ");


    }
}


console.log("========test==========")
let val = `/*index style*/
/*menu*/
.index-menu {
  padding: 50px 0 0 100px;
}/*menu2*/
.index-menu > a {
  display: inline-block;
  padding: 9px 20px;
  margin: 5px 10px;
  border: #0aa4d2 solid 1px;
  border-radius: 6px;
  transition: all 0.2s;
}/*menu3*/
.index-menu > a:hover {
  color: #313131;
  box-shadow: 0 0 3px 0 #0e90d2, 0 1px 6px 0 #888;
  transform: translateY(-3px);
}
.index-menu div::before{color:#fff}
`
// console.log(new css2less().splitName("html >div::before"))
// let out_str = new css2less().convent(val);
// console.log(out_str)
//

