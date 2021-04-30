class Test {
    constructor() {
    }
    pai() {
        let list = [1, 2, 3, 4];
        list.forEach(d => {
            //console.log(d)
        });
    }
    getMin() {
        let getMinIdx = function (list) {
            let min = Math.min(...list);
            return list.indexOf(min);
        };
        let list = [1, 4, 6];
        let sum = list.reduce((a, b) => a + b);
        let list2 = [[1, 2, 3], [4, 5], [2, 4, 6]];
        let tList = list2.flat();
    }
}
let test = new Test();
test.getMin();
