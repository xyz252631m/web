var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Tree = /** @class */ (function () {
    function Tree() {
    }
    //转为tree型 list
    Tree.prototype.convertTreeData = function (list) {
        var repMap = {};
        var temList = [];
        //去除重复
        list.forEach(function (d) {
            if (!repMap[d.id]) {
                repMap[d.id] = d;
                temList.push(__assign(__assign({}, d), { isOpen: false, children: [] }));
            }
        });
        var map = {}, treeData = [];
        temList.forEach(function (d) {
            map[d.id] = d;
        });
        temList.forEach(function (d) {
            if (d.pid) {
                if (map[d.pid]) {
                    map[d.pid].children.push(d);
                }
            }
        });
        for (var key in map) {
            if (!map[key].pid) {
                treeData.push(map[key]);
            }
        }
        return treeData;
    };
    //转为tree型 list
    Tree.prototype.convertTreeData2 = function (list) {
        var map = {}, treeData = [];
        list.forEach(function (d) {
            if (map[d.id]) {
                console.error("tree id 重复，" + d.id);
            }
            map[d.id] = {
                key: d.id,
                title: d.name,
                children: [],
                isLeaf: d.type === 'page',
                data: d
            };
        });
        list.forEach(function (d) {
            if (d.pid) {
                if (map[d.pid]) {
                    map[d.pid].children.push(map[d.id]);
                }
            }
            else {
                treeData.push(map[d.id]);
            }
        });
        return treeData;
    };
    //转为tree型 list
    Tree.prototype.convertTreeData3 = function (list) {
        var map = {}, treeData = [], temList = [];
        list.forEach(function (d) {
            if (map[d.id]) {
                console.error("tree id 重复，" + d.id);
            }
            map[d.id] = {
                key: d.id,
                title: d.name,
                children: [],
                isLeaf: d.type === 'page',
                data: d
            };
            if (d.pid) {
                if (map[d.pid]) {
                    map[d.pid].children.push(map[d.id]);
                }
                else {
                    temList.push(d);
                }
            }
            else {
                treeData.push(map[d.id]);
            }
            console.log("count");
        });
        temList.forEach(function (d) {
            if (map[d.pid]) {
                map[d.pid].children.push(map[d.id]);
            }
            console.log("count");
        });
        return treeData;
    };
    return Tree;
}());
