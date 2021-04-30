// enter file of limited Konva version with only core functions
// @ts-ignore
var Konva = require('./_CoreInternals').Konva;
// add Konva to global variable
Konva._injectGlobal(Konva);
// @ts-ignore
exports['default'] = Konva;
Konva.default = Konva;
// @ts-ignore
module.exports = exports['default'];
