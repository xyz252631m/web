declare const loader: {
    use(name: string, url: string): void;
    loader(url: string, callback?: Function): void;
    define(nameList: any, callback: any): void;
};
declare function loadJS(url: any, callback: any): void;
