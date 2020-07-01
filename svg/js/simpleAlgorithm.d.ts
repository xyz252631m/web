declare class SimpleAlgorithm {
    constructor();
    tree: Array<any>;
    ChartTree: any;
}
interface TreeItem {
    id: string | number;
    pid?: string;
    name: string;
    level?: number;
    idx: number;
    childrenList?: [];
    children: [];
    moreList?: [];
    open: boolean;
    moreOpen: boolean;
    hasMore?: boolean;
    isMoreItem?: boolean;
    hide?: boolean;
    data: any;
}
declare class TreeOption {
    anTime: number;
    renderLevel: number;
    scale: number;
    lineHoverCls: string;
    nodeClick: any;
}
declare class ChartTree {
    private opts;
    constructor(option: TreeOption);
    mapLevel: {};
    mapId: {};
    infoList: Array<TreeItem>;
    conventData(list: any, data: any): void;
    getLength(str: any): any;
}
