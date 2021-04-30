(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.ObjTree = factory());
}(this, function () {
    'use strict';

    function ObjTree(option) {
        let defs = {
            //object array
            type: "object",
        };
        this.opt = Object.assign({}, defs, option);
        this.$select = null;
        this.bindEvents();
    }

    ObjTree.prototype.init = function (data) {
        let opt = this.opt;
        let $el = opt.$el;
        this.data = data;
        if (opt.type === "object") {
            $el.html(this.templateByObj(data));
        } else {
            $el.html(this.templateByArray(data));
        }
    }
    ObjTree.prototype.resetData = function(data){
        this.$select = null;
        this.bindEvents();
        this.init(data);
    }

    ObjTree.prototype.templateByObj = function (obj) {
        if (typeof (obj) === "object" && obj !== null && obj !== undefined) {
            let h = ['<ul>'], text;
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    text = key;
                    if (typeof (obj[key]) === "object" && obj[key] !== null) {
                        if (Array.isArray(obj[key])) {
                            text += ('：[]');
                        } else {
                            text += ('：{}');
                        }
                        h.push('<li data-key="' + key + '"><a><span class="arrow"><i class="fa fa-fw fa-caret-right"></i></span><label>' + text + '</label></a></li>')
                    } else {
                        text += ('：' + obj[key]);
                        h.push('<li  data-key="' + key + '"><a><label>' + text + '</label></a></li>')
                    }
                }
            }
            h.push('<ul>');
            return h.join("");
        } else {
            return ""
        }
    }

    ObjTree.prototype.templateByArray = function (list) {
        if (list && list.length) {
            let h = ['<ul>'], text;
            list.forEach(d => {
                text = d.name;
                if (d.type === "catalog") {
                    h.push('<li data-key="' + text + '"><a><span class="arrow"><i class="fa fa-fw fa-caret-right"></i></span><label>' + text + '</label></a></li>')
                } else {
                    h.push('<li  data-key="' + key + '"><a><label>' + text + '</label></a></li>')
                }
            })
            h.push('<ul>');
            return h.join("");
        } else {
            return ""
        }
    }

    ObjTree.prototype.bindEvents = function () {
        let $el = this.opt.$el, self = this;
        $el.off("click", "li");
        $el.on("click", "li", function () {
            let $m = $(this), cls = 'open-li', active = 'active';
            //selected
            console.log(self.$select)
            if (self.$select) {
                self.$select.removeClass(active);
            }
            self.$select = $m;
            self.$select.addClass(active);
            let $ul = $m.children("ul");
            if ($ul.length) {
                if ($ul.css("display") === "none") {
                    $m.addClass(cls)
                    $ul.show();
                } else {
                    $m.removeClass(cls)
                    $ul.hide();
                }
            } else {
                let res = self.getParentNode(this);
                let obj = self.getObjByPath(res.keyList);
                $(this).append(self.templateByObj(obj))
                $m.addClass(cls)
            }
        })
    }

    //获取父级列表 return{ keyList nodeList}
    ObjTree.prototype.getParentNode = function (node) {
        let self = this, nodeList = [], keyList = [];
        while (node !== self.opt.$el[0] || node === document.body) {
            nodeList.push(node)
            keyList.push(node.getAttribute("data-key"));
            node = node.parentNode;
        }
        return {keyList: keyList.reverse(), nodeList}
    }

    //获取对象
    ObjTree.prototype.getObjByPath = function (paths) {
        let temObj = this.data;
        paths.forEach(d => {
            if (d) {
                temObj = temObj[d];
            }
        })
        return temObj;
    }

    //获取选中对象
    ObjTree.prototype.getSelected = function () {
        let $s = this.$select;
        if ($s) {
            let res = this.getParentNode($s[0]);
            if (this.opt.type === "object") {
                return this.getObjByPath(res.keyList)
            } else {
                return res.keyList.join("");
            }
        } else {
            return null;
        }
    }

    ObjTree.prototype.destroy = function () {
        let $el = this.opt.$el;
        $el.off("click", "li");
        this.$select = null;
        this.opt = null;
    }

    return ObjTree;
}));





