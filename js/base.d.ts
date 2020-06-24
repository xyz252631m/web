interface loadOpt {
    js: string;
    css?: string;
}
declare function _define(name: string, callback: Function): void;
declare namespace _define {
    var amd: boolean;
}
declare const define: typeof _define;
declare class MI {
    map: {};
    loadList: Array<any>;
    exportMap: {};
    static tool: {};
    private readonly basePath;
    constructor();
    static addTool(name: any, cb: any): void;
    load(name: string | Function, callback: Function): void;
    use(name: string): any;
    define(name: any, callback: object | Function): void;
    preload(url: any): any;
}
declare function $(elem: any): _jq;
declare namespace $ {
    var extend: (target: any, ...source: any[]) => any;
    var deepCopy: (obj: any, cache?: any[]) => any;
    var post: (url: any, data: any, success: any, config?: any) => Promise<any>;
    var get: (url: any, success: any, config?: any) => Promise<any>;
}
declare class _jq {
    el: Array<Window> | NodeListOf<Element>;
    forEach: (callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any) => void;
    splice: {
        (start: number, deleteCount?: number): any[];
        (start: number, deleteCount: number, ...items: any[]): any[];
    };
    constructor(elem: any);
    selector(elem: any): any[] | NodeListOf<Element>;
    find(selector: string): _jq;
    get(idx: number): _jq;
    on(type: string, entrust?: string | Function, cb?: string | Function): this;
    hide(): this;
    show(): this;
    css(a: any, b?: any): void;
    text(text: string): any;
    html(html: string): any;
    addClass(cls: string): void;
    removeClass(cls: string): void;
    width(): any;
    height(): any;
}
declare function loadJS(url: any, resolve: any, reject: any): void;
declare const mi: MI;
