interface loadOpt {
    js: string;
    css?: string;
}
interface loadMap {
    key: string;
    callback?: Function;
}
declare function A(): void;
declare function _define(name: string, callback: Function): Function;
declare namespace _define {
    var amd: boolean;
}
declare const define: typeof _define;
declare class MI {
    private map;
    private lastList;
    constructor();
    load(name: string | Function, callback: Function): Function;
    use(name: string, opt: loadOpt): void;
    define(name: any, callback: Function): void;
    loader(name: any, callback?: Function): void;
}
declare const mi: MI;
declare function loadJS(url: any): void;
