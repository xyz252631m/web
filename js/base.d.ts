declare const loader: {
    use(name: string, url: string): void;
    loader(url: string, callback?: Function): void;
};
