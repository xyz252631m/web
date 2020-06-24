var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
//amd load
function _define(name, callback) {
    return mi.load(name, callback);
}
_define.amd = true;
var define = _define;
var MI = /** @class */ (function () {
    function MI() {
        this.exportMap = {};
        this.map = {
            require: this.load,
            exports: this.exportMap
        };
        this.loadList = [];
        this.basePath = "/web";
    }
    MI.addTool = function (name, cb) {
        var _a;
        Object.defineProperties(this.tool, (_a = {},
            _a[name] = cb,
            _a));
    };
    //amd 定义
    MI.prototype.load = function (name, callback) {
        // console.log("name", name, this)
        var cb = callback;
        var deps = [];
        if (typeof name === "function") {
            cb = name;
        }
        if (Array.isArray(name)) {
            deps = name;
            name = null;
        }
        this.loadList.push({ deps: deps, cb: cb });
    };
    MI.prototype.use = function (name) {
        if (this.map[name]) {
            return this.map[name];
        }
        else if (this.exportMap[name]) {
            return this.exportMap[name];
        }
        else {
            console.error("no find module，" + name);
        }
    };
    //定义
    MI.prototype.define = function (name, callback) {
        var _a;
        var cab = callback;
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
        Object.defineProperties(this, (_a = {},
            _a[name] = this.map[name].cab,
            _a));
        // this[name] = this.map[name].cab;
    };
    //预加载
    MI.prototype.preload = function (url) {
        var _url = url;
        if (url[0] === "/") {
            _url = this.basePath + url;
        }
        if (this.map[_url]) {
            return this.map[_url].cab;
        }
        else if (this.exportMap[_url]) {
            return this.exportMap[_url];
        }
        else {
            this.map[_url] = {
                url: _url,
                cab: undefined,
                exports: {}
            };
            return new Promise(function (resolve, reject) {
                loadJS(_url, resolve, reject);
            });
        }
    };
    return MI;
}());
function $(elem) {
    if (typeof elem === "function") {
        document.addEventListener("DOMContentLoaded", function () {
            elem();
        });
        return;
    }
    var obj = new _jq(elem);
    var d = function () {
    };
    d.prototype = _jq.prototype;
    var _d = new d();
    obj.el.forEach(function (d) {
        [].push.call(_d, d);
    });
    return _d;
}
//对象合并
$.extend = function (target) {
    var source = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        source[_i - 1] = arguments[_i];
    }
    var list = __spreadArrays(source);
    var deep = false, _s = target;
    if (typeof target === "boolean") {
        deep = target;
        _s = list.shift();
    }
    var res = Object.assign.apply(Object, __spreadArrays([{}, _s], list));
    if (deep) {
        return this.deepCopy(res);
    }
    else {
        return res;
    }
};
//深拷贝
$.deepCopy = function (obj, cache) {
    var _this = this;
    if (cache === void 0) { cache = []; }
    // typeof [] => 'object'
    // typeof {} => 'object'
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // 如果传入的对象与缓存的相等, 则递归结束, 防止循环
    var hit = cache.filter(function (c) { return c.original === obj; })[0];
    if (hit) {
        return hit.copy;
    }
    var copy = Array.isArray(obj) ? [] : {};
    cache.push({
        original: obj,
        copy: copy
    });
    Object.keys(obj).forEach(function (key) {
        copy[key] = _this.deepCopy(obj[key], cache);
    });
    return copy;
};
//axios post
$.post = function (url, data, success, config) {
    return __awaiter(this, void 0, void 0, function () {
        var axios;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mi.preload("/lib/axios.js")];
                case 1:
                    axios = _a.sent();
                    return [2 /*return*/, axios.post(url, data, config || {}).then(function (res) {
                            success(res.data);
                        })];
            }
        });
    });
};
//axios get
$.get = function (url, success, config) {
    return __awaiter(this, void 0, void 0, function () {
        var axios;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mi.preload("/lib/axios.js")];
                case 1:
                    axios = _a.sent();
                    return [2 /*return*/, axios.get(url, config || {}).then(function (res) {
                            success(res.data);
                        })];
            }
        });
    });
};
MI.tool = $;
var _jq = /** @class */ (function () {
    function _jq(elem) {
        if (Array.isArray(elem)) {
            this.el = elem;
        }
        else {
            this.el = this.selector(elem);
        }
    }
    _jq.prototype.selector = function (elem) {
        if (typeof elem === "string") {
            return document.querySelectorAll(elem);
        }
        else {
            return [elem];
        }
    };
    _jq.prototype.find = function (selector) {
        var list = [];
        this.forEach(function (d) {
            list.push.apply(list, d.querySelectorAll(selector));
        });
        return $(list);
    };
    _jq.prototype.get = function (idx) {
        return $(this[0]);
    };
    //绑定事件
    _jq.prototype.on = function (type, entrust, cb) {
        if (typeof entrust === "function") {
            cb = entrust;
            entrust = "";
        }
        this.forEach(function (d) {
            if (entrust) {
                d.addEventListener(type, function (e) {
                    console.log("e", e);
                    //d.addEventListener(type, cb);
                });
            }
            else {
                d.addEventListener(type, cb);
            }
        });
        return this;
    };
    _jq.prototype.hide = function () {
        this.forEach(function (d) {
            d.style.display = "none";
        });
        return this;
    };
    _jq.prototype.show = function () {
        this.forEach(function (d) {
            d.style.display = "block";
        });
        return this;
    };
    _jq.prototype.css = function (a, b) {
        if (typeof a === "string") {
            this.forEach(function (d) {
                d[a] = b;
            });
        }
        else {
            var _loop_1 = function (key) {
                if (a.hasOwnProperty(key)) {
                    this_1.forEach(function (d) {
                        d[key] = a[key];
                    });
                }
            };
            var this_1 = this;
            for (var key in a) {
                _loop_1(key);
            }
        }
    };
    _jq.prototype.text = function (text) {
        if (text) {
            this.forEach(function (d) {
                d.innerText = text;
            });
        }
        else {
            return this[0].innerText;
        }
    };
    _jq.prototype.html = function (html) {
        if (html) {
            this.forEach(function (d) {
                d.innerHTML = html;
            });
        }
        else {
            return this[0].innerHTML;
        }
    };
    _jq.prototype.addClass = function (cls) {
        this.forEach(function (d) {
            d.classList.add(cls);
        });
    };
    _jq.prototype.removeClass = function (cls) {
        this.forEach(function (d) {
            d.classList.remove(cls);
        });
    };
    _jq.prototype.width = function () {
        return this[0].offsetWidth;
    };
    _jq.prototype.height = function () {
        return this[0].offsetHeight;
    };
    return _jq;
}());
_jq.prototype.forEach = [].forEach;
_jq.prototype.splice = [].splice;
function loadJS(url, resolve, reject) {
    var script = document.createElement('script');
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
        var name = this.getAttribute("data-moduleName");
        var item = mi.loadList.shift();
        if (item.deps.length) {
            var arg = item.deps.map(function (d) {
                if (d === "exports") {
                    return mi.map[name].exports;
                }
                return mi.map[d];
            });
            // item.cb()
            item.cb.apply(item, arg);
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
var mi = new MI();
