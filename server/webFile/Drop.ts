import {Observe} from "./Observe.js"

export class Drop extends Observe {
    private isDown: boolean;
    private x: number;
    private y: number;
    private isMove: boolean;


    constructor() {
        super();
        this.isDown = false;
        this.x = 0;
        this.y = 0;
    }

    start(e: MouseEvent) {
        this.isDown = true;
        this.isMove = false;
        this.x = e.x;
        this.y = e.y;
        this.emit("start")
    }


    move(e) {
        let moveX = 0;
        let moveY = 0;
        this.isMove = true;
        if (this.isDown) {
            moveX = e.x - this.x;
            moveY = e.y - this.y;
            this.emit("move", {moveX, moveY, e})
        }
    }

    end(e) {
        if (this.isDown) {
            this.isDown = false;
            this.isMove = false;
            this.emit("end");
        }
    }
}



