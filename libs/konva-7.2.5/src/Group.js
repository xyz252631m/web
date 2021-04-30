define(["require", "exports", "./Util", "./Container", "./Global"], function (require, exports, Util_1, Container_1, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Group = void 0;
    /**
     * Group constructor.  Groups are used to contain shapes or other groups.
     * @constructor
     * @memberof Konva
     * @augments Konva.Container
     * @param {Object} config
     * @@nodeParams
     * @@containerParams
     * @example
     * var group = new Konva.Group();
     */
    class Group extends Container_1.Container {
        _validateAdd(child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Util_1.Util.throw('You may only add groups and shapes to groups.');
            }
        }
    }
    exports.Group = Group;
    Group.prototype.nodeType = 'Group';
    Global_1._registerNode(Group);
    Util_1.Collection.mapMethods(Group);
});
