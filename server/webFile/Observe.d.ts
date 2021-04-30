export declare class Observe {
    private _messages;
    constructor();
    on(type: any, fn: any): void;
    emit(type: any, args?: {}): void;
    off(type: any, fn: any): void;
}
