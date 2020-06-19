declare class CiteTree {
    private option;
    private width;
    private height;
    private hw;
    private hh;
    private draw;
    rootGroup: any;
    private box_dom;
    private scale;
    getDefs(): {
        anTime: number;
        renderLevel: number;
        scale: number;
        lineHoverCls: string;
    };
    constructor(svg: any, option: any);
    bindEvent(): void;
}
export { CiteTree };
