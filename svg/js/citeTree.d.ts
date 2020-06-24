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
    bindEvent(): void;
}
export default function a(): void;
export { CiteTree };
