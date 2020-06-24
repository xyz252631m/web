/*
* des : simple algorithm
* */
var SimpleAlgorithm = /** @class */ (function () {
    function SimpleAlgorithm() {
        this.tree = [];
        this.ChartTree = ChartTree;
    }
    return SimpleAlgorithm;
}());
///配置项的接口
var TreeOption = /** @class */ (function () {
    function TreeOption() {
        //动画时长
        this.anTime = 200;
        //初始渲染层级数量
        this.renderLevel = 2;
        this.scale = 1;
        //line hover 样式名称
        this.lineHoverCls = "line-hover";
        //节点点击事件
        this.nodeClick = null;
    }
    return TreeOption;
}());
var ChartTree = /** @class */ (function () {
    function ChartTree(option) {
        // getTreeItem() {
        //     let treeItem: TreeItem = {
        //         id: "",
        //         name: "",
        //         idx: 0,
        //         children: [],
        //         open: false,
        //         moreOpen: false,
        //         data: null
        //     }
        //     return treeItem;
        // }
        this.mapLevel = {};
        this.mapId = {};
        this.infoList = [];
        this.opts = option;
    }
    //处理数据
    ChartTree.prototype.conventData = function (list, data) {
        var _a = this, mapLevel = _a.mapLevel, mapId = _a.mapId, infoList = _a.infoList;
        var option = this.opts;
        var fn = function (list, mapLevel, mapId, infoList, level, pid) {
            list.forEach(function (d, idx) {
                var item;
                item.data = d;
                item.id = d.id;
                if (level > option.renderLevel) {
                    return;
                }
                d.level = level;
                d.idx = idx;
                d.pid = pid;
                d._id = d.id;
                d.childrenList = d.children || [];
                if (idx >= 10) {
                    return;
                }
                if (!mapLevel[level.toString()]) {
                    mapLevel[level.toString()] = [];
                }
                mapLevel[level.toString()].push(d);
                if (!d._id || mapId[d._id]) {
                    d._id = pid + "_" + new Date().getTime() + "_" + idx;
                }
                mapId[d._id] = d;
                d.open = level < option.renderLevel;
                infoList.push(d);
                if (d.children) {
                    if (d.children.length) {
                        fn(d.children, mapLevel, mapId, infoList, level + 1, d._id);
                    }
                }
                else {
                    d.children = [];
                }
            });
        };
        fn(list, mapLevel, mapId, infoList, 1, data._id);
        infoList.forEach(function (d, i) {
            if (d.children.length > 10) {
                var child_1 = [], moreList_1 = [];
                d.children.forEach(function (k, idx) {
                    if (idx < 10) {
                        child_1.push(k);
                    }
                    else if (idx === 10) {
                        var treeItem = {
                            //  id: "more_" + d._id + "_01",
                            // _id: "more_" + d._id + "_01",
                            //kl:"#4",
                            id: d.id,
                            //  pid: d._id,
                            name: "展开",
                            idx: idx,
                            isMoreItem: true,
                            level: d.level + 1,
                            moreOpen: false,
                            children: [],
                            open: true,
                            data: d
                        };
                        //  mapId[tem._id] = tem;
                        infoList.push(treeItem);
                        // let upItem = d.children[9];
                        // let upIdx = mapLevel[tem.level].indexOf(upItem);
                        //mapLevel[tem.level].splice(upIdx + 1, 0, tem);
                        child_1.push(treeItem);
                    }
                    else {
                        // k.hide = true;
                        moreList_1.push(k);
                    }
                });
                d.moreOpen = false;
                //   d.children = child;
                //   d.moreList = moreList;
                d.hasMore = true;
            }
        });
    };
    ChartTree.prototype.getLength = function (str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    };
    return ChartTree;
}());
