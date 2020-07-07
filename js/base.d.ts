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
declare function $(selector: any): _jq;
declare namespace $ {
    var extend: (target: any, ...source: any[]) => any;
    var deepCopy: (obj: any, cache?: any[]) => any;
    var post: (url: any, data: any, success: any, config?: any) => Promise<void>;
    var get: (url: any, success: any, config?: any) => Promise<void>;
    var each: (list: any, fn: Function) => void;
    var trim: (str: string) => string;
}
declare class _jq {
    el: Array<Window> | NodeListOf<Element>;
    forEach: (callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any) => void;
    splice: {
        (start: number, deleteCount?: number): any[];
        (start: number, deleteCount: number, ...items: any[]): any[];
    };
    _events: any;
    constructor(elem: any);
    selector(elem: any): any[] | NodeListOf<Element>;
    find(selector: string): _jq;
    get(idx: number): _jq;
    eq(idx: number): _jq;
    on(eventName: string, entrust?: string | Function, cb?: Function): this;
    off(eventName: string): void;
    hide(): this;
    each(fn: Function): this;
    show(): this;
    css(a: any, b?: any): this;
    text(text: string): any;
    html(html: string): any;
    val(val: string): any;
    addClass(cls: string): void;
    removeClass(cls: string): void;
    width(): any;
    height(): any;
}
declare function loadJS(url: any, resolve: any, reject: any): void;
declare const mi: MI;
