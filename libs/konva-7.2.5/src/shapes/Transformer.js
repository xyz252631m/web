define(["require", "exports", "../Util", "../Factory", "../Node", "../Shape", "./Rect", "../Group", "../Global", "../Validators", "../Global"], function (require, exports, Util_1, Factory_1, Node_1, Shape_1, Rect_1, Group_1, Global_1, Validators_1, Global_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transformer = void 0;
    var EVENTS_NAME = 'tr-konva';
    var ATTR_CHANGE_LIST = [
        'resizeEnabledChange',
        'rotateAnchorOffsetChange',
        'rotateEnabledChange',
        'enabledAnchorsChange',
        'anchorSizeChange',
        'borderEnabledChange',
        'borderStrokeChange',
        'borderStrokeWidthChange',
        'borderDashChange',
        'anchorStrokeChange',
        'anchorStrokeWidthChange',
        'anchorFillChange',
        'anchorCornerRadiusChange',
        'ignoreStrokeChange',
    ]
        .map((e) => e + `.${EVENTS_NAME}`)
        .join(' ');
    var NODES_RECT = 'nodesRect';
    var TRANSFORM_CHANGE_STR = [
        'widthChange',
        'heightChange',
        'scaleXChange',
        'scaleYChange',
        'skewXChange',
        'skewYChange',
        'rotationChange',
        'offsetXChange',
        'offsetYChange',
        'transformsEnabledChange',
        'strokeWidthChange',
    ]
        .map((e) => e + `.${EVENTS_NAME}`)
        .join(' ');
    var ANGLES = {
        'top-left': -45,
        'top-center': 0,
        'top-right': 45,
        'middle-right': -90,
        'middle-left': 90,
        'bottom-left': -135,
        'bottom-center': 180,
        'bottom-right': 135,
    };
    const TOUCH_DEVICE = 'ontouchstart' in Global_1.Konva._global;
    function getCursor(anchorName, rad) {
        if (anchorName === 'rotater') {
            return 'crosshair';
        }
        rad += Util_1.Util._degToRad(ANGLES[anchorName] || 0);
        var angle = ((Util_1.Util._radToDeg(rad) % 360) + 360) % 360;
        if (Util_1.Util._inRange(angle, 315 + 22.5, 360) || Util_1.Util._inRange(angle, 0, 22.5)) {
            // TOP
            return 'ns-resize';
        }
        else if (Util_1.Util._inRange(angle, 45 - 22.5, 45 + 22.5)) {
            // TOP - RIGHT
            return 'nesw-resize';
        }
        else if (Util_1.Util._inRange(angle, 90 - 22.5, 90 + 22.5)) {
            // RIGHT
            return 'ew-resize';
        }
        else if (Util_1.Util._inRange(angle, 135 - 22.5, 135 + 22.5)) {
            // BOTTOM - RIGHT
            return 'nwse-resize';
        }
        else if (Util_1.Util._inRange(angle, 180 - 22.5, 180 + 22.5)) {
            // BOTTOM
            return 'ns-resize';
        }
        else if (Util_1.Util._inRange(angle, 225 - 22.5, 225 + 22.5)) {
            // BOTTOM - LEFT
            return 'nesw-resize';
        }
        else if (Util_1.Util._inRange(angle, 270 - 22.5, 270 + 22.5)) {
            // RIGHT
            return 'ew-resize';
        }
        else if (Util_1.Util._inRange(angle, 315 - 22.5, 315 + 22.5)) {
            // BOTTOM - RIGHT
            return 'nwse-resize';
        }
        else {
            // how can we can there?
            Util_1.Util.error('Transformer has unknown angle for cursor detection: ' + angle);
            return 'pointer';
        }
    }
    var ANCHORS_NAMES = [
        'top-left',
        'top-center',
        'top-right',
        'middle-right',
        'middle-left',
        'bottom-left',
        'bottom-center',
        'bottom-right',
    ];
    var MAX_SAFE_INTEGER = 100000000;
    function getCenter(shape) {
        return {
            x: shape.x +
                (shape.width / 2) * Math.cos(shape.rotation) +
                (shape.height / 2) * Math.sin(-shape.rotation),
            y: shape.y +
                (shape.height / 2) * Math.cos(shape.rotation) +
                (shape.width / 2) * Math.sin(shape.rotation),
        };
    }
    function rotateAroundPoint(shape, angleRad, point) {
        const x = point.x +
            (shape.x - point.x) * Math.cos(angleRad) -
            (shape.y - point.y) * Math.sin(angleRad);
        const y = point.y +
            (shape.x - point.x) * Math.sin(angleRad) +
            (shape.y - point.y) * Math.cos(angleRad);
        return {
            ...shape,
            rotation: shape.rotation + angleRad,
            x,
            y,
        };
    }
    function rotateAroundCenter(shape, deltaRad) {
        const center = getCenter(shape);
        return rotateAroundPoint(shape, deltaRad, center);
    }
    function getSnap(snaps, newRotationRad, tol) {
        let snapped = newRotationRad;
        for (let i = 0; i < snaps.length; i++) {
            const angle = Global_1.Konva.getAngle(snaps[i]);
            const absDiff = Math.abs(angle - newRotationRad) % (Math.PI * 2);
            const dif = Math.min(absDiff, Math.PI * 2 - absDiff);
            if (dif < tol) {
                snapped = angle;
            }
        }
        return snapped;
    }
    /**
     * Transformer constructor.  Transformer is a special type of group that allow you transform Konva
     * primitives and shapes. Transforming tool is not changing `width` and `height` properties of nodes
     * when you resize them. Instead it changes `scaleX` and `scaleY` properties.
     * @constructor
     * @memberof Konva
     * @param {Object} config
     * @param {Boolean} [config.resizeEnabled] Default is true
     * @param {Boolean} [config.rotateEnabled] Default is true
     * @param {Array} [config.rotationSnaps] Array of angles for rotation snaps. Default is []
     * @param {Number} [config.rotationSnapTolerance] Snapping tolerance. If closer than this it will snap. Default is 5
     * @param {Number} [config.rotateAnchorOffset] Default is 50
     * @param {Number} [config.padding] Default is 0
     * @param {Boolean} [config.borderEnabled] Should we draw border? Default is true
     * @param {String} [config.borderStroke] Border stroke color
     * @param {Number} [config.borderStrokeWidth] Border stroke size
     * @param {Array} [config.borderDash] Array for border dash.
     * @param {String} [config.anchorFill] Anchor fill color
     * @param {String} [config.anchorStroke] Anchor stroke color
     * @param {String} [config.anchorCornerRadius] Anchor corner radius
     * @param {Number} [config.anchorStrokeWidth] Anchor stroke size
     * @param {Number} [config.anchorSize] Default is 10
     * @param {Boolean} [config.keepRatio] Should we keep ratio when we are moving edges? Default is true
     * @param {Boolean} [config.centeredScaling] Should we resize relative to node's center? Default is false
     * @param {Array} [config.enabledAnchors] Array of names of enabled handles
     * @param {Function} [config.boundBoxFunc] Bounding box function
     * @param {Function} [config.ignoreStroke] Should we ignore stroke size? Default is false
     *
     * @example
     * var transformer = new Konva.Transformer({
     *   nodes: [rectangle],
     *   rotateAnchorOffset: 60,
     *   enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
     * });
     * layer.add(transformer);
     */
    class Transformer extends Group_1.Group {
        constructor(config) {
            // call super constructor
            super(config);
            this._transforming = false;
            this._createElements();
            // bindings
            this._handleMouseMove = this._handleMouseMove.bind(this);
            this._handleMouseUp = this._handleMouseUp.bind(this);
            this.update = this.update.bind(this);
            // update transformer data for certain attr changes
            this.on(ATTR_CHANGE_LIST, this.update);
            if (this.getNode()) {
                this.update();
            }
        }
        /**
         * alias to `tr.nodes([shape])`/ This method is deprecated and will be removed soon.
         * @method
         * @name Konva.Transformer#attachTo
         * @returns {Konva.Transformer}
         * @example
         * transformer.attachTo(shape);
         */
        attachTo(node) {
            this.setNode(node);
            return this;
        }
        setNode(node) {
            Util_1.Util.warn('tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead.');
            return this.setNodes([node]);
        }
        getNode() {
            return this._nodes && this._nodes[0];
        }
        setNodes(nodes = []) {
            if (this._nodes && this._nodes.length) {
                this.detach();
            }
            this._nodes = nodes;
            if (nodes.length === 1) {
                this.rotation(nodes[0].getAbsoluteRotation());
            }
            else {
                this.rotation(0);
            }
            this._nodes.forEach((node) => {
                const additionalEvents = node._attrsAffectingSize
                    .map((prop) => prop + 'Change.' + EVENTS_NAME)
                    .join(' ');
                const onChange = () => {
                    //
                    if (this.nodes().length === 1) {
                        this.rotation(this.nodes()[0].getAbsoluteRotation());
                    }
                    this._resetTransformCache();
                    if (!this._transforming && !this.isDragging()) {
                        this.update();
                    }
                };
                node.on(additionalEvents, onChange);
                node.on(TRANSFORM_CHANGE_STR, onChange);
                node.on(`_clearTransformCache.${EVENTS_NAME}`, onChange);
                node.on(`xChange.${EVENTS_NAME} yChange.${EVENTS_NAME}`, onChange);
                this._proxyDrag(node);
            });
            this._resetTransformCache();
            // we may need it if we set node in initial props
            // so elements are not defined yet
            var elementsCreated = !!this.findOne('.top-left');
            if (elementsCreated) {
                this.update();
            }
            return this;
        }
        _proxyDrag(node) {
            let lastPos;
            node.on(`dragstart.${EVENTS_NAME}`, (e) => {
                lastPos = node.getAbsolutePosition();
                // actual dragging of Transformer doesn't make sense
                // but we need to proxy drag events
                if (!this.isDragging() && node !== this.findOne('.back')) {
                    this.startDrag(e, false);
                }
            });
            node.on(`dragmove.${EVENTS_NAME}`, (e) => {
                if (!lastPos) {
                    return;
                }
                const abs = node.getAbsolutePosition();
                const dx = abs.x - lastPos.x;
                const dy = abs.y - lastPos.y;
                this.nodes().forEach((otherNode) => {
                    if (otherNode === node) {
                        return;
                    }
                    if (otherNode.isDragging()) {
                        return;
                    }
                    const otherAbs = otherNode.getAbsolutePosition();
                    otherNode.setAbsolutePosition({
                        x: otherAbs.x + dx,
                        y: otherAbs.y + dy,
                    });
                    otherNode.startDrag(e);
                });
                lastPos = null;
            });
        }
        getNodes() {
            return this._nodes || [];
        }
        /**
         * return the name of current active anchor
         * @method
         * @name Konva.Transformer#getActiveAnchor
         * @returns {String | Null}
         * @example
         * transformer.getActiveAnchor();
         */
        getActiveAnchor() {
            return this._movingAnchorName;
        }
        /**
         * detach transformer from an attached node
         * @method
         * @name Konva.Transformer#detach
         * @returns {Konva.Transformer}
         * @example
         * transformer.detach();
         */
        detach() {
            // remove events
            if (this._nodes) {
                this._nodes.forEach((node) => {
                    node.off('.' + EVENTS_NAME);
                });
            }
            this._nodes = [];
            this._resetTransformCache();
        }
        _resetTransformCache() {
            this._clearCache(NODES_RECT);
            this._clearCache('transform');
            this._clearSelfAndDescendantCache('absoluteTransform');
        }
        _getNodeRect() {
            return this._getCache(NODES_RECT, this.__getNodeRect);
        }
        // return absolute rotated bounding rectangle
        __getNodeShape(node, rot = this.rotation(), relative) {
            var rect = node.getClientRect({
                skipTransform: true,
                skipShadow: true,
                skipStroke: this.ignoreStroke(),
            });
            var absScale = node.getAbsoluteScale(relative);
            var absPos = node.getAbsolutePosition(relative);
            var dx = rect.x * absScale.x - node.offsetX() * absScale.x;
            var dy = rect.y * absScale.y - node.offsetY() * absScale.y;
            const rotation = (Global_1.Konva.getAngle(node.getAbsoluteRotation()) + Math.PI * 2) %
                (Math.PI * 2);
            const box = {
                x: absPos.x + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
                y: absPos.y + dy * Math.cos(rotation) + dx * Math.sin(rotation),
                width: rect.width * absScale.x,
                height: rect.height * absScale.y,
                rotation: rotation,
            };
            return rotateAroundPoint(box, -Global_1.Konva.getAngle(rot), {
                x: 0,
                y: 0,
            });
        }
        // returns box + rotation of all shapes
        __getNodeRect() {
            var node = this.getNode();
            if (!node) {
                return {
                    x: -MAX_SAFE_INTEGER,
                    y: -MAX_SAFE_INTEGER,
                    width: 0,
                    height: 0,
                    rotation: 0,
                };
            }
            const totalPoints = [];
            this.nodes().map((node) => {
                const box = node.getClientRect({
                    skipTransform: true,
                    skipShadow: true,
                    skipStroke: this.ignoreStroke(),
                });
                var points = [
                    { x: box.x, y: box.y },
                    { x: box.x + box.width, y: box.y },
                    { x: box.x + box.width, y: box.y + box.height },
                    { x: box.x, y: box.y + box.height },
                ];
                var trans = node.getAbsoluteTransform();
                points.forEach(function (point) {
                    var transformed = trans.point(point);
                    totalPoints.push(transformed);
                });
            });
            const tr = new Util_1.Transform();
            tr.rotate(-Global_1.Konva.getAngle(this.rotation()));
            var minX, minY, maxX, maxY;
            totalPoints.forEach(function (point) {
                var transformed = tr.point(point);
                if (minX === undefined) {
                    minX = maxX = transformed.x;
                    minY = maxY = transformed.y;
                }
                minX = Math.min(minX, transformed.x);
                minY = Math.min(minY, transformed.y);
                maxX = Math.max(maxX, transformed.x);
                maxY = Math.max(maxY, transformed.y);
            });
            tr.invert();
            const p = tr.point({ x: minX, y: minY });
            return {
                x: p.x,
                y: p.y,
                width: maxX - minX,
                height: maxY - minY,
                rotation: Global_1.Konva.getAngle(this.rotation()),
            };
            // const shapes = this.nodes().map(node => {
            //   return this.__getNodeShape(node);
            // });
            // const box = getShapesRect(shapes);
            // return rotateAroundPoint(box, Konva.getAngle(this.rotation()), {
            //   x: 0,
            //   y: 0
            // });
        }
        getX() {
            return this._getNodeRect().x;
        }
        getY() {
            return this._getNodeRect().y;
        }
        getWidth() {
            return this._getNodeRect().width;
        }
        getHeight() {
            return this._getNodeRect().height;
        }
        _createElements() {
            this._createBack();
            ANCHORS_NAMES.forEach(function (name) {
                this._createAnchor(name);
            }.bind(this));
            this._createAnchor('rotater');
        }
        _createAnchor(name) {
            var anchor = new Rect_1.Rect({
                stroke: 'rgb(0, 161, 255)',
                fill: 'white',
                strokeWidth: 1,
                name: name + ' _anchor',
                dragDistance: 0,
                // make it draggable,
                // so activating the anchor will not start drag&drop of any parent
                draggable: true,
                hitStrokeWidth: TOUCH_DEVICE ? 10 : 'auto',
            });
            var self = this;
            anchor.on('mousedown touchstart', function (e) {
                self._handleMouseDown(e);
            });
            anchor.on('dragstart', (e) => {
                anchor.stopDrag();
                e.cancelBubble = true;
            });
            anchor.on('dragend', (e) => {
                e.cancelBubble = true;
            });
            // add hover styling
            anchor.on('mouseenter', () => {
                var rad = Global_1.Konva.getAngle(this.rotation());
                var cursor = getCursor(name, rad);
                anchor.getStage().content.style.cursor = cursor;
                this._cursorChange = true;
            });
            anchor.on('mouseout', () => {
                anchor.getStage().content.style.cursor = '';
                this._cursorChange = false;
            });
            this.add(anchor);
        }
        _createBack() {
            var back = new Shape_1.Shape({
                name: 'back',
                width: 0,
                height: 0,
                draggable: true,
                sceneFunc(ctx) {
                    var tr = this.getParent();
                    var padding = tr.padding();
                    ctx.beginPath();
                    ctx.rect(-padding, -padding, this.width() + padding * 2, this.height() + padding * 2);
                    ctx.moveTo(this.width() / 2, -padding);
                    if (tr.rotateEnabled()) {
                        ctx.lineTo(this.width() / 2, -tr.rotateAnchorOffset() * Util_1.Util._sign(this.height()) - padding);
                    }
                    ctx.fillStrokeShape(this);
                },
                hitFunc: (ctx, shape) => {
                    if (!this.shouldOverdrawWholeArea()) {
                        return;
                    }
                    var padding = this.padding();
                    ctx.beginPath();
                    ctx.rect(-padding, -padding, shape.width() + padding * 2, shape.height() + padding * 2);
                    ctx.fillStrokeShape(shape);
                },
            });
            this.add(back);
            this._proxyDrag(back);
            // do not bubble drag from the back shape
            // because we already "drag" whole transformer
            // so we don't want to trigger drag twice on transformer
            back.on('dragstart', (e) => {
                e.cancelBubble = true;
            });
            back.on('dragmove', (e) => {
                e.cancelBubble = true;
            });
            back.on('dragend', (e) => {
                e.cancelBubble = true;
            });
        }
        _handleMouseDown(e) {
            this._movingAnchorName = e.target.name().split(' ')[0];
            var attrs = this._getNodeRect();
            var width = attrs.width;
            var height = attrs.height;
            var hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            this.sin = Math.abs(height / hypotenuse);
            this.cos = Math.abs(width / hypotenuse);
            window.addEventListener('mousemove', this._handleMouseMove);
            window.addEventListener('touchmove', this._handleMouseMove);
            window.addEventListener('mouseup', this._handleMouseUp, true);
            window.addEventListener('touchend', this._handleMouseUp, true);
            this._transforming = true;
            var ap = e.target.getAbsolutePosition();
            var pos = e.target.getStage().getPointerPosition();
            this._anchorDragOffset = {
                x: pos.x - ap.x,
                y: pos.y - ap.y,
            };
            this._fire('transformstart', { evt: e, target: this.getNode() });
            this._nodes.forEach((target) => {
                target._fire('transformstart', { evt: e, target });
            });
        }
        _handleMouseMove(e) {
            var x, y, newHypotenuse;
            var anchorNode = this.findOne('.' + this._movingAnchorName);
            var stage = anchorNode.getStage();
            stage.setPointersPositions(e);
            const pp = stage.getPointerPosition();
            var newNodePos = {
                x: pp.x - this._anchorDragOffset.x,
                y: pp.y - this._anchorDragOffset.y,
            };
            const oldAbs = anchorNode.getAbsolutePosition();
            anchorNode.setAbsolutePosition(newNodePos);
            const newAbs = anchorNode.getAbsolutePosition();
            if (oldAbs.x === newAbs.x && oldAbs.y === newAbs.y) {
                return;
            }
            // rotater is working very differently, so do it first
            if (this._movingAnchorName === 'rotater') {
                var attrs = this._getNodeRect();
                x = anchorNode.x() - attrs.width / 2;
                y = -anchorNode.y() + attrs.height / 2;
                // hor angle is changed?
                let delta = Math.atan2(-y, x) + Math.PI / 2;
                if (attrs.height < 0) {
                    delta -= Math.PI;
                }
                var oldRotation = Global_1.Konva.getAngle(this.rotation());
                const newRotation = oldRotation + delta;
                const tol = Global_1.Konva.getAngle(this.rotationSnapTolerance());
                const snappedRot = getSnap(this.rotationSnaps(), newRotation, tol);
                const diff = snappedRot - attrs.rotation;
                const shape = rotateAroundCenter(attrs, diff);
                this._fitNodesInto(shape, e);
                return;
            }
            var keepProportion = this.keepRatio() || e.shiftKey;
            var centeredScaling = this.centeredScaling() || e.altKey;
            if (this._movingAnchorName === 'top-left') {
                if (keepProportion) {
                    var comparePoint = centeredScaling
                        ? {
                            x: this.width() / 2,
                            y: this.height() / 2,
                        }
                        : {
                            x: this.findOne('.bottom-right').x(),
                            y: this.findOne('.bottom-right').y(),
                        };
                    newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) +
                        Math.pow(comparePoint.y - anchorNode.y(), 2));
                    var reverseX = this.findOne('.top-left').x() > comparePoint.x ? -1 : 1;
                    var reverseY = this.findOne('.top-left').y() > comparePoint.y ? -1 : 1;
                    x = newHypotenuse * this.cos * reverseX;
                    y = newHypotenuse * this.sin * reverseY;
                    this.findOne('.top-left').x(comparePoint.x - x);
                    this.findOne('.top-left').y(comparePoint.y - y);
                }
            }
            else if (this._movingAnchorName === 'top-center') {
                this.findOne('.top-left').y(anchorNode.y());
            }
            else if (this._movingAnchorName === 'top-right') {
                if (keepProportion) {
                    var comparePoint = centeredScaling
                        ? {
                            x: this.width() / 2,
                            y: this.height() / 2,
                        }
                        : {
                            x: this.findOne('.bottom-left').x(),
                            y: this.findOne('.bottom-left').y(),
                        };
                    newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) +
                        Math.pow(comparePoint.y - anchorNode.y(), 2));
                    var reverseX = this.findOne('.top-right').x() < comparePoint.x ? -1 : 1;
                    var reverseY = this.findOne('.top-right').y() > comparePoint.y ? -1 : 1;
                    x = newHypotenuse * this.cos * reverseX;
                    y = newHypotenuse * this.sin * reverseY;
                    this.findOne('.top-right').x(comparePoint.x + x);
                    this.findOne('.top-right').y(comparePoint.y - y);
                }
                var pos = anchorNode.position();
                this.findOne('.top-left').y(pos.y);
                this.findOne('.bottom-right').x(pos.x);
            }
            else if (this._movingAnchorName === 'middle-left') {
                this.findOne('.top-left').x(anchorNode.x());
            }
            else if (this._movingAnchorName === 'middle-right') {
                this.findOne('.bottom-right').x(anchorNode.x());
            }
            else if (this._movingAnchorName === 'bottom-left') {
                if (keepProportion) {
                    var comparePoint = centeredScaling
                        ? {
                            x: this.width() / 2,
                            y: this.height() / 2,
                        }
                        : {
                            x: this.findOne('.top-right').x(),
                            y: this.findOne('.top-right').y(),
                        };
                    newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) +
                        Math.pow(anchorNode.y() - comparePoint.y, 2));
                    var reverseX = comparePoint.x < anchorNode.x() ? -1 : 1;
                    var reverseY = anchorNode.y() < comparePoint.y ? -1 : 1;
                    x = newHypotenuse * this.cos * reverseX;
                    y = newHypotenuse * this.sin * reverseY;
                    anchorNode.x(comparePoint.x - x);
                    anchorNode.y(comparePoint.y + y);
                }
                pos = anchorNode.position();
                this.findOne('.top-left').x(pos.x);
                this.findOne('.bottom-right').y(pos.y);
            }
            else if (this._movingAnchorName === 'bottom-center') {
                this.findOne('.bottom-right').y(anchorNode.y());
            }
            else if (this._movingAnchorName === 'bottom-right') {
                if (keepProportion) {
                    var comparePoint = centeredScaling
                        ? {
                            x: this.width() / 2,
                            y: this.height() / 2,
                        }
                        : {
                            x: this.findOne('.top-left').x(),
                            y: this.findOne('.top-left').y(),
                        };
                    newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) +
                        Math.pow(anchorNode.y() - comparePoint.y, 2));
                    var reverseX = this.findOne('.bottom-right').x() < comparePoint.x ? -1 : 1;
                    var reverseY = this.findOne('.bottom-right').y() < comparePoint.y ? -1 : 1;
                    x = newHypotenuse * this.cos * reverseX;
                    y = newHypotenuse * this.sin * reverseY;
                    this.findOne('.bottom-right').x(comparePoint.x + x);
                    this.findOne('.bottom-right').y(comparePoint.y + y);
                }
            }
            else {
                console.error(new Error('Wrong position argument of selection resizer: ' +
                    this._movingAnchorName));
            }
            var centeredScaling = this.centeredScaling() || e.altKey;
            if (centeredScaling) {
                var topLeft = this.findOne('.top-left');
                var bottomRight = this.findOne('.bottom-right');
                var topOffsetX = topLeft.x();
                var topOffsetY = topLeft.y();
                var bottomOffsetX = this.getWidth() - bottomRight.x();
                var bottomOffsetY = this.getHeight() - bottomRight.y();
                bottomRight.move({
                    x: -topOffsetX,
                    y: -topOffsetY,
                });
                topLeft.move({
                    x: bottomOffsetX,
                    y: bottomOffsetY,
                });
            }
            var absPos = this.findOne('.top-left').getAbsolutePosition();
            x = absPos.x;
            y = absPos.y;
            var width = this.findOne('.bottom-right').x() - this.findOne('.top-left').x();
            var height = this.findOne('.bottom-right').y() - this.findOne('.top-left').y();
            this._fitNodesInto({
                x: x,
                y: y,
                width: width,
                height: height,
                rotation: Global_1.Konva.getAngle(this.rotation()),
            }, e);
        }
        _handleMouseUp(e) {
            this._removeEvents(e);
        }
        getAbsoluteTransform() {
            return this.getTransform();
        }
        _removeEvents(e) {
            if (this._transforming) {
                this._transforming = false;
                window.removeEventListener('mousemove', this._handleMouseMove);
                window.removeEventListener('touchmove', this._handleMouseMove);
                window.removeEventListener('mouseup', this._handleMouseUp, true);
                window.removeEventListener('touchend', this._handleMouseUp, true);
                var node = this.getNode();
                this._fire('transformend', { evt: e, target: node });
                if (node) {
                    this._nodes.forEach((target) => {
                        target._fire('transformend', { evt: e, target });
                    });
                }
                this._movingAnchorName = null;
            }
        }
        _fitNodesInto(newAttrs, evt) {
            var oldAttrs = this._getNodeRect();
            const minSize = 1;
            if (Util_1.Util._inRange(newAttrs.width, -this.padding() * 2 - minSize, minSize)) {
                this.update();
                return;
            }
            if (Util_1.Util._inRange(newAttrs.height, -this.padding() * 2 - minSize, minSize)) {
                this.update();
                return;
            }
            const allowNegativeScale = true;
            var t = new Util_1.Transform();
            t.rotate(Global_1.Konva.getAngle(this.rotation()));
            if (this._movingAnchorName &&
                newAttrs.width < 0 &&
                this._movingAnchorName.indexOf('left') >= 0) {
                const offset = t.point({
                    x: -this.padding() * 2,
                    y: 0,
                });
                newAttrs.x += offset.x;
                newAttrs.y += offset.y;
                newAttrs.width += this.padding() * 2;
                this._movingAnchorName = this._movingAnchorName.replace('left', 'right');
                this._anchorDragOffset.x -= offset.x;
                this._anchorDragOffset.y -= offset.y;
                if (!allowNegativeScale) {
                    this.update();
                    return;
                }
            }
            else if (this._movingAnchorName &&
                newAttrs.width < 0 &&
                this._movingAnchorName.indexOf('right') >= 0) {
                const offset = t.point({
                    x: this.padding() * 2,
                    y: 0,
                });
                this._movingAnchorName = this._movingAnchorName.replace('right', 'left');
                this._anchorDragOffset.x -= offset.x;
                this._anchorDragOffset.y -= offset.y;
                newAttrs.width += this.padding() * 2;
                if (!allowNegativeScale) {
                    this.update();
                    return;
                }
            }
            if (this._movingAnchorName &&
                newAttrs.height < 0 &&
                this._movingAnchorName.indexOf('top') >= 0) {
                const offset = t.point({
                    x: 0,
                    y: -this.padding() * 2,
                });
                newAttrs.x += offset.x;
                newAttrs.y += offset.y;
                this._movingAnchorName = this._movingAnchorName.replace('top', 'bottom');
                this._anchorDragOffset.x -= offset.x;
                this._anchorDragOffset.y -= offset.y;
                newAttrs.height += this.padding() * 2;
                if (!allowNegativeScale) {
                    this.update();
                    return;
                }
            }
            else if (this._movingAnchorName &&
                newAttrs.height < 0 &&
                this._movingAnchorName.indexOf('bottom') >= 0) {
                const offset = t.point({
                    x: 0,
                    y: this.padding() * 2,
                });
                this._movingAnchorName = this._movingAnchorName.replace('bottom', 'top');
                this._anchorDragOffset.x -= offset.x;
                this._anchorDragOffset.y -= offset.y;
                newAttrs.height += this.padding() * 2;
                if (!allowNegativeScale) {
                    this.update();
                    return;
                }
            }
            if (this.boundBoxFunc()) {
                const bounded = this.boundBoxFunc()(oldAttrs, newAttrs);
                if (bounded) {
                    newAttrs = bounded;
                }
                else {
                    Util_1.Util.warn('boundBoxFunc returned falsy. You should return new bound rect from it!');
                }
            }
            // base size value doesn't really matter
            // we just need to think about bounding boxes as transforms
            // but how?
            // the idea is that we have a transformed rectangle with the size of "baseSize"
            const baseSize = 10000000;
            const oldTr = new Util_1.Transform();
            oldTr.translate(oldAttrs.x, oldAttrs.y);
            oldTr.rotate(oldAttrs.rotation);
            oldTr.scale(oldAttrs.width / baseSize, oldAttrs.height / baseSize);
            const newTr = new Util_1.Transform();
            newTr.translate(newAttrs.x, newAttrs.y);
            newTr.rotate(newAttrs.rotation);
            newTr.scale(newAttrs.width / baseSize, newAttrs.height / baseSize);
            // now lets think we had [old transform] and n ow we have [new transform]
            // Now, the questions is: how can we transform "parent" to go from [old transform] into [new transform]
            // in equation it will be:
            // [delta transform] * [old transform] = [new transform]
            // that means that
            // [delta transform] = [new transform] * [old transform inverted]
            const delta = newTr.multiply(oldTr.invert());
            this._nodes.forEach((node) => {
                // for each node we have the same [delta transform]
                // the equations is
                // [delta transform] * [parent transform] * [old local transform] = [parent transform] * [new local transform]
                // and we need to find [new local transform]
                // [new local] = [parent inverted] * [delta] * [parent] * [old local]
                const parentTransform = node.getParent().getAbsoluteTransform();
                const localTransform = node.getTransform().copy();
                // skip offset:
                localTransform.translate(node.offsetX(), node.offsetY());
                const newLocalTransform = new Util_1.Transform();
                newLocalTransform
                    .multiply(parentTransform.copy().invert())
                    .multiply(delta)
                    .multiply(parentTransform)
                    .multiply(localTransform);
                const attrs = newLocalTransform.decompose();
                node.setAttrs(attrs);
                this._fire('transform', { evt: evt, target: node });
                node._fire('transform', { evt: evt, target: node });
                node.getLayer()?.batchDraw();
            });
            this.rotation(Util_1.Util._getRotation(newAttrs.rotation));
            this._resetTransformCache();
            this.update();
            this.getLayer().batchDraw();
        }
        /**
         * force update of Konva.Transformer.
         * Use it when you updated attached Konva.Group and now you need to reset transformer size
         * @method
         * @name Konva.Transformer#forceUpdate
         */
        forceUpdate() {
            this._resetTransformCache();
            this.update();
        }
        _batchChangeChild(selector, attrs) {
            const anchor = this.findOne(selector);
            anchor.setAttrs(attrs);
        }
        update() {
            var attrs = this._getNodeRect();
            this.rotation(Util_1.Util._getRotation(attrs.rotation));
            var width = attrs.width;
            var height = attrs.height;
            var enabledAnchors = this.enabledAnchors();
            var resizeEnabled = this.resizeEnabled();
            var padding = this.padding();
            var anchorSize = this.anchorSize();
            this.find('._anchor').each((node) => {
                node.setAttrs({
                    width: anchorSize,
                    height: anchorSize,
                    offsetX: anchorSize / 2,
                    offsetY: anchorSize / 2,
                    stroke: this.anchorStroke(),
                    strokeWidth: this.anchorStrokeWidth(),
                    fill: this.anchorFill(),
                    cornerRadius: this.anchorCornerRadius(),
                });
            });
            this._batchChangeChild('.top-left', {
                x: 0,
                y: 0,
                offsetX: anchorSize / 2 + padding,
                offsetY: anchorSize / 2 + padding,
                visible: resizeEnabled && enabledAnchors.indexOf('top-left') >= 0,
            });
            this._batchChangeChild('.top-center', {
                x: width / 2,
                y: 0,
                offsetY: anchorSize / 2 + padding,
                visible: resizeEnabled && enabledAnchors.indexOf('top-center') >= 0,
            });
            this._batchChangeChild('.top-right', {
                x: width,
                y: 0,
                offsetX: anchorSize / 2 - padding,
                offsetY: anchorSize / 2 + padding,
                visible: resizeEnabled && enabledAnchors.indexOf('top-right') >= 0,
            });
            this._batchChangeChild('.middle-left', {
                x: 0,
                y: height / 2,
                offsetX: anchorSize / 2 + padding,
                visible: resizeEnabled && enabledAnchors.indexOf('middle-left') >= 0,
            });
            this._batchChangeChild('.middle-right', {
                x: width,
                y: height / 2,
                offsetX: anchorSize / 2 - padding,
                visible: resizeEnabled && enabledAnchors.indexOf('middle-right') >= 0,
            });
            this._batchChangeChild('.bottom-left', {
                x: 0,
                y: height,
                offsetX: anchorSize / 2 + padding,
                offsetY: anchorSize / 2 - padding,
                visible: resizeEnabled && enabledAnchors.indexOf('bottom-left') >= 0,
            });
            this._batchChangeChild('.bottom-center', {
                x: width / 2,
                y: height,
                offsetY: anchorSize / 2 - padding,
                visible: resizeEnabled && enabledAnchors.indexOf('bottom-center') >= 0,
            });
            this._batchChangeChild('.bottom-right', {
                x: width,
                y: height,
                offsetX: anchorSize / 2 - padding,
                offsetY: anchorSize / 2 - padding,
                visible: resizeEnabled && enabledAnchors.indexOf('bottom-right') >= 0,
            });
            this._batchChangeChild('.rotater', {
                x: width / 2,
                y: -this.rotateAnchorOffset() * Util_1.Util._sign(height) - padding,
                visible: this.rotateEnabled(),
            });
            this._batchChangeChild('.back', {
                width: width,
                height: height,
                visible: this.borderEnabled(),
                stroke: this.borderStroke(),
                strokeWidth: this.borderStrokeWidth(),
                dash: this.borderDash(),
                x: 0,
                y: 0,
            });
            this.getLayer()?.batchDraw();
        }
        /**
         * determine if transformer is in active transform
         * @method
         * @name Konva.Transformer#isTransforming
         * @returns {Boolean}
         */
        isTransforming() {
            return this._transforming;
        }
        /**
         * Stop active transform action
         * @method
         * @name Konva.Transformer#stopTransform
         * @returns {Boolean}
         */
        stopTransform() {
            if (this._transforming) {
                this._removeEvents();
                var anchorNode = this.findOne('.' + this._movingAnchorName);
                if (anchorNode) {
                    anchorNode.stopDrag();
                }
            }
        }
        destroy() {
            if (this.getStage() && this._cursorChange) {
                this.getStage().content.style.cursor = '';
            }
            Group_1.Group.prototype.destroy.call(this);
            this.detach();
            this._removeEvents();
            return this;
        }
        // do not work as a container
        // we will recreate inner nodes manually
        toObject() {
            return Node_1.Node.prototype.toObject.call(this);
        }
    }
    exports.Transformer = Transformer;
    function validateAnchors(val) {
        if (!(val instanceof Array)) {
            Util_1.Util.warn('enabledAnchors value should be an array');
        }
        if (val instanceof Array) {
            val.forEach(function (name) {
                if (ANCHORS_NAMES.indexOf(name) === -1) {
                    Util_1.Util.warn('Unknown anchor name: ' +
                        name +
                        '. Available names are: ' +
                        ANCHORS_NAMES.join(', '));
                }
            });
        }
        return val || [];
    }
    Transformer.prototype.className = 'Transformer';
    Global_2._registerNode(Transformer);
    /**
     * get/set enabled handlers
     * @name Konva.Transformer#enabledAnchors
     * @method
     * @param {Array} array
     * @returns {Array}
     * @example
     * // get list of handlers
     * var enabledAnchors = transformer.enabledAnchors();
     *
     * // set handlers
     * transformer.enabledAnchors(['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'enabledAnchors', ANCHORS_NAMES, validateAnchors);
    /**
     * get/set resize ability. If false it will automatically hide resizing handlers
     * @name Konva.Transformer#resizeEnabled
     * @method
     * @param {Array} array
     * @returns {Array}
     * @example
     * // get
     * var resizeEnabled = transformer.resizeEnabled();
     *
     * // set
     * transformer.resizeEnabled(false);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'resizeEnabled', true);
    /**
     * get/set anchor size. Default is 10
     * @name Konva.Transformer#validateAnchors
     * @method
     * @param {Number} 10
     * @returns {Number}
     * @example
     * // get
     * var anchorSize = transformer.anchorSize();
     *
     * // set
     * transformer.anchorSize(20)
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'anchorSize', 10, Validators_1.getNumberValidator());
    /**
     * get/set ability to rotate.
     * @name Konva.Transformer#rotateEnabled
     * @method
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get
     * var rotateEnabled = transformer.rotateEnabled();
     *
     * // set
     * transformer.rotateEnabled(false);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'rotateEnabled', true);
    /**
     * get/set rotation snaps angles.
     * @name Konva.Transformer#rotationSnaps
     * @method
     * @param {Array} array
     * @returns {Array}
     * @example
     * // get
     * var rotationSnaps = transformer.rotationSnaps();
     *
     * // set
     * transformer.rotationSnaps([0, 90, 180, 270]);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'rotationSnaps', []);
    /**
     * get/set distance for rotation handler
     * @name Konva.Transformer#rotateAnchorOffset
     * @method
     * @param {Number} offset
     * @returns {Number}
     * @example
     * // get
     * var rotateAnchorOffset = transformer.rotateAnchorOffset();
     *
     * // set
     * transformer.rotateAnchorOffset(100);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'rotateAnchorOffset', 50, Validators_1.getNumberValidator());
    /**
     * get/set distance for rotation tolerance
     * @name Konva.Transformer#rotationSnapTolerance
     * @method
     * @param {Number} tolerance
     * @returns {Number}
     * @example
     * // get
     * var rotationSnapTolerance = transformer.rotationSnapTolerance();
     *
     * // set
     * transformer.rotationSnapTolerance(100);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'rotationSnapTolerance', 5, Validators_1.getNumberValidator());
    /**
     * get/set visibility of border
     * @name Konva.Transformer#borderEnabled
     * @method
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get
     * var borderEnabled = transformer.borderEnabled();
     *
     * // set
     * transformer.borderEnabled(false);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'borderEnabled', true);
    /**
     * get/set anchor stroke color
     * @name Konva.Transformer#anchorStroke
     * @method
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get
     * var anchorStroke = transformer.anchorStroke();
     *
     * // set
     * transformer.anchorStroke('red');
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'anchorStroke', 'rgb(0, 161, 255)');
    /**
     * get/set anchor stroke width
     * @name Konva.Transformer#anchorStrokeWidth
     * @method
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get
     * var anchorStrokeWidth = transformer.anchorStrokeWidth();
     *
     * // set
     * transformer.anchorStrokeWidth(3);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'anchorStrokeWidth', 1, Validators_1.getNumberValidator());
    /**
     * get/set anchor fill color
     * @name Konva.Transformer#anchorFill
     * @method
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get
     * var anchorFill = transformer.anchorFill();
     *
     * // set
     * transformer.anchorFill('red');
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'anchorFill', 'white');
    /**
     * get/set anchor corner radius
     * @name Konva.Transformer#anchorCornerRadius
     * @method
     * @param {Number} enabled
     * @returns {Number}
     * @example
     * // get
     * var anchorCornerRadius = transformer.anchorCornerRadius();
     *
     * // set
     * transformer.anchorCornerRadius(3);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'anchorCornerRadius', 0, Validators_1.getNumberValidator());
    /**
     * get/set border stroke color
     * @name Konva.Transformer#borderStroke
     * @method
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get
     * var borderStroke = transformer.borderStroke();
     *
     * // set
     * transformer.borderStroke('red');
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'borderStroke', 'rgb(0, 161, 255)');
    /**
     * get/set border stroke width
     * @name Konva.Transformer#borderStrokeWidth
     * @method
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get
     * var borderStrokeWidth = transformer.borderStrokeWidth();
     *
     * // set
     * transformer.borderStrokeWidth(3);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'borderStrokeWidth', 1, Validators_1.getNumberValidator());
    /**
     * get/set border dash array
     * @name Konva.Transformer#borderDash
     * @method
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get
     * var borderDash = transformer.borderDash();
     *
     * // set
     * transformer.borderDash([2, 2]);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'borderDash');
    /**
     * get/set should we keep ratio while resize anchors at corners
     * @name Konva.Transformer#keepRatio
     * @method
     * @param {Boolean} keepRatio
     * @returns {Boolean}
     * @example
     * // get
     * var keepRatio = transformer.keepRatio();
     *
     * // set
     * transformer.keepRatio(false);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'keepRatio', true);
    /**
     * get/set should we resize relative to node's center?
     * @name Konva.Transformer#centeredScaling
     * @method
     * @param {Boolean} centeredScaling
     * @returns {Boolean}
     * @example
     * // get
     * var centeredScaling = transformer.centeredScaling();
     *
     * // set
     * transformer.centeredScaling(true);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'centeredScaling', false);
    /**
     * get/set should we think about stroke while resize? Good to use when a shape has strokeScaleEnabled = false
     * default is false
     * @name Konva.Transformer#ignoreStroke
     * @method
     * @param {Boolean} ignoreStroke
     * @returns {Boolean}
     * @example
     * // get
     * var ignoreStroke = transformer.ignoreStroke();
     *
     * // set
     * transformer.ignoreStroke(true);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'ignoreStroke', false);
    /**
     * get/set padding
     * @name Konva.Transformer#padding
     * @method
     * @param {Number} padding
     * @returns {Number}
     * @example
     * // get
     * var padding = transformer.padding();
     *
     * // set
     * transformer.padding(10);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'padding', 0, Validators_1.getNumberValidator());
    Factory_1.Factory.addGetterSetter(Transformer, 'node');
    /**
     * get/set attached nodes of the Transformer. Transformer will adapt to their size and listen to their events
     * @method
     * @name Konva.Transformer#nodes
     * @returns {Konva.Node}
     * @example
     * // get
     * const nodes = transformer.nodes();
     *
     * // set
     * transformer.nodes([rect, circle]);
     *
     * // push new item:
     * const oldNodes = transformer.nodes();
     * const newNodes = oldNodes.concat([newShape]);
     * // it is important to set new array instance (and concat method above will create it)
     * transformer.nodes(newNodes);
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'nodes');
    /**
     * get/set bounding box function. **IMPORTANT!** boundBondFunc operates in absolute coordinates.
     * @name Konva.Transformer#boundBoxFunc
     * @method
     * @param {Function} func
     * @returns {Function}
     * @example
     * // get
     * var boundBoxFunc = transformer.boundBoxFunc();
     *
     * // set
     * transformer.boundBoxFunc(function(oldBox, newBox) {
     *   // width and height of the boxes are corresponding to total absolute width and height of all nodes combined
     *   // so it includes scale of the node.
     *   if (newBox.width > 200) {
     *     return oldBox;
     *   }
     *   return newBox;
     * });
     */
    Factory_1.Factory.addGetterSetter(Transformer, 'boundBoxFunc');
    Factory_1.Factory.addGetterSetter(Transformer, 'shouldOverdrawWholeArea', false);
    Factory_1.Factory.backCompat(Transformer, {
        lineEnabled: 'borderEnabled',
        rotateHandlerOffset: 'rotateAnchorOffset',
        enabledHandlers: 'enabledAnchors',
    });
    Util_1.Collection.mapMethods(Transformer);
});
