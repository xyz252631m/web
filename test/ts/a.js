var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype.pai = function () {
    var list = [1, 2, 3, 4];
    list.forEach(function (d) {
        console.log(d);
    });
};
Test.prototype.getMin = function () {
    var getMinIdx = function (list) {
        var min = Math.min.apply(Math, list);
        return list.indexOf(min);
    };
    var list = [1, 4, 6];
    var sum = list.reduce(function (a, b) { return a + b; });
    var list2 = [[1, 2, 3], [4, 5], [2, 4, 6]];
    var tList = list2.flat();
};
return Test;
}());
var test = new Test();
test.getMin();
