//amd load
function _define(name, callback) {
    return mi.load(name, callback);
}
_define.amd = true;
const define = _define;
class MI {
    constructor() {
        this.exportMap = {};
        this.map = {
            require: this.load,
            exports: this.exportMap
        };
        this.loadList = [];
    }
    //amd 定义
    load(name, callback) {
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
        this.loadList.push({ deps, cb });
    }
    use(name) {
        if (this.map[name]) {
            return this.map[name];
        }
        else if (this.exportMap[name]) {
            return this.exportMap[name];
        }
        else {
            console.error("no find module，" + name);
        }
    }
    //定义
    define(name, callback) {
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
        };
        this[name] = this.map[name].cab;
    }
    //预加载
    preload(url) {
        if (this.map[url]) {
            return this.map[url].cab;
        }
        else if (this.exportMap[url]) {
            return this.exportMap[url];
        }
        else {
            this.map[url] = {
                url: url,
                cab: undefined,
                exports: {}
            };
            return new Promise(function (resolve, reject) {
                loadJS(url, resolve, reject);
            });
        }
    }
}
MI.tool = {
    extend() {
    },
    //深拷贝
    deepCopy(obj, cache = []) {
        // typeof [] => 'object'
        // typeof {} => 'object'
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        // 如果传入的对象与缓存的相等, 则递归结束, 防止循环
        const hit = cache.filter(c => c.original === obj)[0];
        if (hit) {
            return hit.copy;
        }
        const copy = Array.isArray(obj) ? [] : {};
        cache.push({
            original: obj,
            copy
        });
        Object.keys(obj).forEach(key => {
            copy[key] = this.deepCopy(obj[key], cache);
        });
        return copy;
    }
};
const mi = new MI();
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
                    return mi.map[name].exports;
                }
                return mi.map[d];
            });
            // item.cb()
            item.cb(...arg);
            //  mi.map[name].cab = mi.exportMap[name]=item.cb(...arg);
            console.log(333, mi.map[name]);
            resolve(mi.map[name].exports);
        }
        else {
            mi.map[name].cab = item.cb();
            resolve(mi.map[name].cab);
        }
    });
    script.addEventListener("error", function (e) {
        reject(e);
    });
    //}
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
