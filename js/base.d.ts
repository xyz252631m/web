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
    tool: {};
    static tool: {};
    constructor();
    load(name: string | Function, callback: Function): void;
    use(name: string): any;
    define(name: any, callback: object | Function): void;
    preload(url: any): any;
}
declare const mi: MI;
declare function loadJS(url: any, resolve: any, reject: any): void;
