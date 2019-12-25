function LineChart(Konva, option) {
    var defs = {
        xRange: [0, 0],
        yRange: [0, 0],
        lineList: []
    };
    var opt = this.opt = $.extend({}, defs, option);
    var stage = new Konva.Stage({
        container: option.container,
        width: option.width,
        height: option.height,


    });

    this.stage = stage;
    this.layer = new Konva.Layer();
    var data = [];


    this.drawGrid();

    var xr = [0, 500];
    var yr = [0, 360];

    console.time('计时器');
    opt.lineList.forEach(d => {
        this.renderLine(d);
    });
    console.timeEnd('计时器');
    // option.data.forEach(d => {
    //     data.push([d[0] * 500 / xSize, d[1] * 360 / ySize])
    // });

    console.log(data);

}

LineChart.prototype.getRange = function () {


};
LineChart.prototype.getGrid = function () {

};
//渲染线
LineChart.prototype.renderLine = function (lineItem, style) {

    var opt = this.opt;
    var xSize = opt.xRange[1] - opt.xRange[0];
    var ySize = opt.yRange[1] - opt.yRange[0];

    var data = [];
    lineItem.xData.forEach((x, i) => {
        data.push([x * 500 / xSize, lineItem.yData[i] * 360 / ySize])
    });

    var stage = this.stage;


    var line = new Konva.Line({
        x: 40,
        y: 40,
        points: data.flat(),
        stroke: '#666',
        strokeWidth: 1
    });
    this.layer.add(line);

    stage.add(this.layer);
    this.layer.draw();

};

LineChart.prototype.drawGrid = function () {
    var stage = this.stage;
    var layer = new Konva.Layer();

    var line_x = new Konva.Line({
        x: 40,
        y: 400,
        points: [0, 0, 510, 0],
        stroke: '#666',
        strokeWidth: 1
    });
    layer.add(line_x);
    var line_y = new Konva.Line({
        x: 40,
        y: 40,
        points: [0, 0, 0, 361],
        stroke: '#666',
        strokeWidth: 1
    });
    layer.add(line_y);

    stage.add(layer);
    layer.draw();


};