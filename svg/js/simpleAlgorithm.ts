/*
* des : simple algorithm
* */
class SimpleAlgorithm {
    constructor() {
        this.tree = [];
        this.ChartTree = ChartTree;
    }

    tree: Array<any>

    ChartTree: any

}

interface TreeItem {
    id: string | number
    pid?: string
    name: string
    level?: number
    idx: number
    childrenList?: []
    children: []
    moreList?: []
    open: boolean
    moreOpen: boolean
    hasMore?: boolean
    isMoreItem?: boolean
    hide?: boolean
    data: any
}

///配置项的接口
class TreeOption {
    //动画时长
    anTime = 200
    //初始渲染层级数量
    renderLevel = 2
    scale = 1
    //line hover 样式名称
    lineHoverCls = "line-hover"
    //节点点击事件
    nodeClick = null
}

class ChartTree {

    private opts

    constructor(option: TreeOption) {
        this.opts = option
    }

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

    mapLevel: {} = {}
    mapId: {} = {}
    infoList: Array<TreeItem> = []

    //处理数据
    conventData(list, data) {
        let {mapLevel, mapId, infoList} = this;
        let option = this.opts;
        let fn = function (list, mapLevel, mapId, infoList, level, pid) {
            list.forEach(function (d, idx) {
                let item: TreeItem;
                item.data = d;
                item.id = d.id;


                if (level > option.renderLevel) {
                    return
                }
                d.level = level;
                d.idx = idx;
                d.pid = pid;
                d._id = d.id;
                d.childrenList = d.children || [];
                if (idx >= 10) {
                    return
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
                } else {
                    d.children = [];
                }
            })
        };
        fn(list, mapLevel, mapId, infoList, 1, data._id);

        infoList.forEach(function (d, i) {
            if (d.children.length > 10) {
                let child = [], moreList = [];
                d.children.forEach(function (k, idx) {
                    if (idx < 10) {
                        child.push(k);
                    } else if (idx === 10) {
                        let treeItem: TreeItem = {
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
                        }


                        //  mapId[tem._id] = tem;
                        infoList.push(treeItem);
                        // let upItem = d.children[9];
                        // let upIdx = mapLevel[tem.level].indexOf(upItem);
                        //mapLevel[tem.level].splice(upIdx + 1, 0, tem);
                        child.push(treeItem);
                    } else {
                        // k.hide = true;
                        moreList.push(k);
                    }
                });
                d.moreOpen = false;
                //   d.children = child;
                //   d.moreList = moreList;
                d.hasMore = true;
            }
        });
    }

    getLength(str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    }


}