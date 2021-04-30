declare function $(any: any): any;
interface IOption {
    typeBoxSelector: string;
    pointBox: string;
    infoBox: string;
    pointList: Point[];
}
interface Pos {
    x: number;
    y: number;
}
interface Point extends Pos {
    id: string;
    type: string;
}
declare enum PointType {
    Collection = "collection",
    Record = "record"
}
declare class ImgPoint {
    private opt;
    private elem;
    private typeBox;
    pointBox: any;
    clickPoint: Pos;
    pointData: Point[];
    infoBox: any;
    constructor(selector: string, option: IOption);
    init(): void;
    bingEvent(): void;
    hideTypeBox(): void;
    hideInfoBox(): void;
    hideAll(): void;
    getInfoHtmlTmpl(item: Point): string;
    addPoint(type: string, id: string, x: number, y: number): void;
}
