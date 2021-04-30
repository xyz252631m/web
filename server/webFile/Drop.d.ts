import { Observe } from "./Observe.js";
export declare class Drop extends Observe {
    private isDown;
    private x;
    private y;
    private isMove;
    constructor();
    start(e: MouseEvent): void;
    move(e: any): void;
    end(e: any): void;
}
