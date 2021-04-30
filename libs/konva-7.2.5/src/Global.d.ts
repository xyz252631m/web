export declare const _parseUA: (userAgent: any) => {
    browser: any;
    version: any;
    isIE: number | boolean;
    mobile: boolean;
    ieMobile: boolean;
};
export declare const glob: any;
export declare const Konva: {
    _global: any;
    version: string;
    isBrowser: boolean;
    isUnminified: boolean;
    dblClickWindow: number;
    getAngle(angle: any): any;
    enableTrace: boolean;
    _pointerEventsEnabled: boolean;
    /**
     * Should we enable hit detection while dragging? For performance reasons, by default it is false.
     * But on some rare cases you want to see hit graph and check intersections. Just set it to true.
     * @property hitOnDragEnabled
     * @default false
     * @name hitOnDragEnabled
     * @memberof Konva
     * @example
     * Konva.hitOnDragEnabled = true;
     */
    hitOnDragEnabled: boolean;
    /**
     * Should we capture touch events and bind them to the touchstart target? That is how it works on DOM elements.
     * The case: we touchstart on div1, then touchmove out of that element into another element div2.
     * DOM will continue trigger touchmove events on div1 (not div2). Because events are "captured" into initial target.
     * By default Konva do not do that and will trigger touchmove on another element, while pointer is moving.
     * @property captureTouchEventsEnabled
     * @default false
     * @name captureTouchEventsEnabled
     * @memberof Konva
     * @example
     * Konva.captureTouchEventsEnabled = true;
     */
    captureTouchEventsEnabled: boolean;
    listenClickTap: boolean;
    inDblClickWindow: boolean;
    /**
     * Global pixel ratio configuration. KonvaJS automatically detect pixel ratio of current device.
     * But you may override such property, if you want to use your value. Set this value before any components initializations.
     * @property pixelRatio
     * @default undefined
     * @name pixelRatio
     * @memberof Konva
     * @example
     * // before any Konva code:
     * Konva.pixelRatio = 1;
     */
    pixelRatio: any;
    /**
     * Drag distance property. If you start to drag a node you may want to wait until pointer is moved to some distance from start point,
     * only then start dragging. Default is 3px.
     * @property dragDistance
     * @default 0
     * @memberof Konva
     * @example
     * Konva.dragDistance = 10;
     */
    dragDistance: number;
    /**
     * Use degree values for angle properties. You may set this property to false if you want to use radian values.
     * @property angleDeg
     * @default true
     * @memberof Konva
     * @example
     * node.rotation(45); // 45 degrees
     * Konva.angleDeg = false;
     * node.rotation(Math.PI / 2); // PI/2 radian
     */
    angleDeg: boolean;
    /**
     * Show different warnings about errors or wrong API usage
     * @property showWarnings
     * @default true
     * @memberof Konva
     * @example
     * Konva.showWarnings = false;
     */
    showWarnings: boolean;
    /**
     * Configure what mouse buttons can be used for drag and drop.
     * Default value is [0] - only left mouse button.
     * @property dragButtons
     * @default true
     * @memberof Konva
     * @example
     * // enable left and right mouse buttons
     * Konva.dragButtons = [0, 2];
     */
    dragButtons: number[];
    /**
     * returns whether or not drag and drop is currently active
     * @method
     * @memberof Konva
     */
    isDragging(): any;
    /**
     * returns whether or not a drag and drop operation is ready, but may
     *  not necessarily have started
     * @method
     * @memberof Konva
     */
    isDragReady(): boolean;
    UA: {
        browser: any;
        version: any;
        isIE: number | boolean;
        mobile: boolean;
        ieMobile: boolean;
    };
    document: any;
    _injectGlobal(Konva: any): void;
    _parseUA: (userAgent: any) => {
        browser: any;
        version: any;
        isIE: number | boolean;
        mobile: boolean;
        ieMobile: boolean;
    };
};
export declare const _NODES_REGISTRY: {};
export declare const _registerNode: (NodeClass: any) => void;
