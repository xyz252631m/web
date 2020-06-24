interface loadOpt {
    js: string,
    css?: string
}

//amd load
function _define(name: string, callback: Function) {
    return mi.load(name, callback);
}

_define.amd = true;
const define = _define;

class MI {
    //加载成功对象
    map: {};
    //加载列表
    loadList: Array<any>;
    exportMap: {};
    static tool: {};
    private readonly basePath: string;


    constructor() {
        this.exportMap = {};
        this.map = {
            require: this.load,
            exports: this.exportMap
        };
        this.loadList = [];
        this.basePath = "/web";
    }

    static addTool(name, cb) {
        Object.defineProperties(this.tool, {
            [name]: cb
        });

    }

    //amd 定义
    load(name: string | Function, callback: Function) {
        // console.log("name", name, this)
        let cb = callback;
        let deps = [];
        if (typeof name === "function") {
            cb = name;
        }
        if (Array.isArray(name)) {
            deps = name;
            name = null;
        }

        this.loadList.push({deps, cb});
    }

    use(name: string) {
        if (this.map[name]) {
            return this.map[name]
        } else if (this.exportMap[name]) {
            return this.exportMap[name];
        } else {
            console.error("no find module，" + name);
        }
    }

    //定义
    define(name, callback: object | Function) {
        let cab = callback;
        if (typeof callback === "function") {
            cab = callback();
        }
        if (this.map[name]) {
            console.error("module is exist，" + name);
        }
        this.map[name] = {
            url: name,
            cab: cab
        }

        Object.defineProperties(this, {
            [name]: this.map[name].cab
        });

        // this[name] = this.map[name].cab;
    }


    //预加载
    preload(url) {
        let _url = url;
        if (url[0] === "/") {
            _url = this.basePath + url;
        }
        if (this.map[_url]) {
            return this.map[_url].cab
        } else if (this.exportMap[_url]) {
            return this.exportMap[_url];
        } else {
            this.map[_url] = {
                url: _url,
                cab: undefined,
                exports: {}
            }
            return new Promise(function (resolve, reject) {
                loadJS(_url, resolve, reject);
            });
        }
    }
}

function $(elem: any): _jq {
    if (typeof elem === "function") {
        document.addEventListener("DOMContentLoaded", function () {
            elem();
        })
        return;
    }
    let obj = new _jq(elem);
    let d = function () {
    };
    d.prototype = _jq.prototype;
    let _d = new d();
    obj.el.forEach(d => {
        [].push.call(_d, d)
    })
    return _d;
}

//对象合并
$.extend = function (target, ...source) {


}
//深拷贝
$.deepCopy = function (obj, cache = []) {
    // typeof [] => 'object'
    // typeof {} => 'object'
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    // 如果传入的对象与缓存的相等, 则递归结束, 防止循环
    const hit = cache.filter(c => c.original === obj)[0]
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    cache.push({
        original: obj,
        copy
    })
    Object.keys(obj).forEach(key => {
        copy[key] = this.deepCopy(obj[key], cache)
    })

    return copy
}

//axios post
$.post = async function (url, data, success, config?) {
    let axios = await mi.preload("/lib/axios.js");
    return axios.post(url, data, config || {}).then(function (res) {
        success(res.data)
    });
}

//axios get
$.get = async function (url, success, config?) {
    let axios = await mi.preload("/lib/axios.js");
    return axios.get(url, config || {}).then(function (res) {
        success(res.data)
    });
}

MI.tool = $;

class _jq {
    el: Array<Window> | NodeListOf<Element>;
    forEach: (callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any) => void;
    splice: { (start: number, deleteCount?: number): any[]; (start: number, deleteCount: number, ...items: any[]): any[] };

    constructor(elem: any) {
        if (Array.isArray(elem)) {
            this.el = elem;
        } else {
            this.el = this.selector(elem);
        }
    }

    selector(elem: any) {
        if (typeof elem === "string") {
            return document.querySelectorAll(elem);
        } else {
            return [elem];
        }
    }

    find(selector: string) {
        let list = [];
        this.forEach(d => {
            list.push(...d.querySelectorAll(selector));
        })
        return $(list);
    }

    get(idx: number) {
        return $(this[0]);
    }

    //绑定事件
    on(type: string, entrust?: string | Function, cb?: string | Function) {

        if (typeof entrust === "function") {
            cb = entrust;
            entrust = "";
        }
        this.forEach(d => {
            if (entrust) {
                d.addEventListener(type, function (e) {

                    console.log("e", e)

                    //d.addEventListener(type, cb);
                });
            } else {
                d.addEventListener(type, cb);
            }

        })

        return this;
    }

    hide() {
        this.forEach(d => {
            d.style.display = "none";
        });
        return this;
    }

    show() {
        this.forEach(d => {
            d.style.display = "block";
        });
        return this;
    }

    css(a, b?) {
        if (typeof a === "string") {
            this.forEach(d => {
                d[a] = b;
            })
        } else {
            for (let key in a) {
                if (a.hasOwnProperty(key)) {
                    this.forEach(d => {
                        d[key] = a[key];
                    })
                }
            }
        }
    }

    text(text: string) {
        if (text) {
            this.forEach(d => {
                d.innerText = text;
            })
        } else {
            return this[0].innerText;
        }
    }

    html(html: string) {
        if (html) {
            this.forEach(d => {
                d.innerHTML = html;
            })
        } else {
            return this[0].innerHTML;
        }
    }

    addClass(cls: string) {
        this.forEach(d => {
            d.classList.add(cls);
        })
    }

    removeClass(cls: string) {
        this.forEach(d => {
            d.classList.remove(cls);
        })
    }

    width() {
        return this[0].offsetWidth;
    }

    height() {
        return this[0].offsetHeight;
    }
}

_jq.prototype.forEach = [].forEach;
_jq.prototype.splice = [].splice;


function loadJS(url, resolve, reject) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.setAttribute("data-moduleName", url);
    //IE
    // if (script.readyState) {
    //     script.onreadystatechange = function () {
    //         if (script.readyState == 'loaded' || script.readyState == 'complete') {
    //             script.onreadystatechange = null;
    //             fn();
    //         }
    //     };
    // } else {
    //其他浏览器
    script.addEventListener("load", function () {
        let name = this.getAttribute("data-moduleName");
        let item = mi.loadList.shift();
        if (item.deps.length) {
            let arg = item.deps.map(d => {
                if (d === "exports") {
                    return mi.map[name].exports
                }
                return mi.map[d]
            })
            // item.cb()
            item.cb(...arg);
            //  mi.map[name].cab = mi.exportMap[name]=item.cb(...arg);
            console.log(333, mi.map[name])
            resolve(mi.map[name].exports);
        } else {
            mi.map[name].cab = item.cb();
            resolve(mi.map[name].cab);
        }


    })
    script.addEventListener("error", function (e) {
        reject(e);
    })
    //}
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);

}

const mi = new MI();



