define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Observe = void 0;
    class Observe {
        constructor() {
            this._messages = {};
        }
        on(type, fn) {
            // 获取观察者对象
            let messages = this._messages;
            if (!messages[type]) {
                messages[type] = [fn];
            }
            else {
                messages[type].push(fn);
            }
        }
        emit(type, args = {}) {
            let messages = this._messages;
            if (!messages[type])
                return;
            let params = {
                type,
                args
            };
            messages[type].forEach(item => item.call(this, params));
        }
        off(type, fn) {
            let messages = this._messages;
            if (messages[type] instanceof Array) {
                let i = messages[type].length - 1;
                for (; i >= 0; i--) {
                    if (messages[type][i] === fn) {
                        messages[type].splice(i, 1);
                    }
                }
            }
        }
    }
    exports.Observe = Observe;
});
