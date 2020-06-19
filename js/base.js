function A() {
}
A.prototype.add = function (key, fn) {
    this[key] = fn;
};
//amd load
function _define(name, callback) {
    return mi.load(name, callback);
}
_define.amd = true;
const define = _define;
class MI {
    constructor() {
        this.map = {};
        // load(name: string, opt: loadOpt) {
        //
        // },
        // use(url: string, callback?: Function) {
        //
        // },
        this.lastList = [];
    }
    load(name, callback) {
        // console.log("name", name, this)
        if (typeof name === "function") {
            let a = name;
            this.lastList.push(a);
            return a;
        }
        else if (Array.isArray(name)) {
            let b = callback;
            this.lastList.push(b);
            return b;
        }
        else {
            let c = callback;
            this.lastList.push(c);
            return c;
        }
    }
    use(name, opt) {
    }
    define(name, callback) {
        this.map[name] = {
            url: name,
            cab: undefined,
            list: []
        };
        this[name] = callback;
    }
    loader(name, callback) {
        if (this.map[name]) {
            this.map[name].list.push(callback);
            //callback(this.map[name].cab)
        }
        else {
            this.map[name] = {
                url: name,
                cab: undefined,
                list: [callback]
            };
            loadJS(name);
            //   return loadJS(name,callback);
        }
    }
}
const mi = new MI();
function loadJS(url) {
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
        let cab = mi.lastList.shift();
        mi.map[name].cab = cab();
        mi.map[name].list.forEach(function (d) {
            d(mi.map[name].cab);
        });
    });
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
