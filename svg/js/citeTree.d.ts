import svgjs = require("../svg.js");
interface CiteData {
    _id: any;
    id: any;
    x: number;
    y: number;
    right_vLine?: svgjs.Line;
    left_vLine?: svgjs.Line;
    children: Array<CiteData>[];
}
declare class CiteTree {
    private option;
    private width;
    private height;
    private hw;
    private hh;
    private draw;
    rootGroup: any;
    private readonly box_dom;
    private scale;
    private _jData;
    private rightGroup;
    getDefs(): {
        anTime: number;
        renderLevel: number;
        scale: number;
        lineHoverCls: string;
    };
    constructor(svg: any, option: any);
    init(obj: any): void;
    convertTreeData(list: Array<CiteData>): any[];
    bindEvent(): void;
}
export default function a(): void;
export { CiteTree };
