(function (root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(require("echarts"));
    else if (typeof define === 'function' && define.amd)
        define(["echarts"], factory);
    else if (typeof exports === 'object')
        exports["forecast"] = factory(require("echarts"));
    else
        root["forecast"] = factory(root["echarts"]);
})(this, function (echarts) {

    let graphic = echarts.graphic, zrUtil = echarts.util;

    echarts.extendComponentModel({
        type: 'forecast',
        index: 99,
        defaultOption: {
            zlevel: 0,
            z: 2000,
            seriesIndex: 0,
            data: [],       //预测值
            minData: [],    //预测最小值数组
            maxData: [],    //预测最大值数组
            start: 1,   //起始位置
            type: "bar",    //预测显示的样式类型 bar:上下直线 用于柱状图  line:闭合图形 用于折线图
            line: {
                color: ""
            },
            area: {
                color: ""
            },
            scatter: {
                xData: [],
                xMinData: [],
                xMaxData: []
            }
        }
    });

    echarts.extendComponentView({
        type: 'forecast',
        init: function (ecModel, api) {
            this._lineLists = [];
            this._lineXlists = [];
            this._lineSeriesLists = [];
            this._polygon = null;
        },
        buildLines: function (animationModel, posList, xw, color) {
            this._lineLists.forEach(d => {
                d.updateState = false;
            });
            let createLine = function (item, _shape, shape, color) {
                let lineEl = new graphic.Line({
                    shape: _shape,
                    style: {
                        stroke: color,
                    },
                    silent: true
                });
                lineEl.animateTo({
                        shape: shape
                    }, animationModel.duration,
                    animationModel.animationDelay,
                    animationModel.animationEasing);
                return lineEl;
            };
            zrUtil.each(posList, function (item) {
                let tickItem = this._lineLists.find(d => d.name === item.key);
                if (tickItem) {
                    tickItem.lineEl_t.show();
                    tickItem.lineEl_y.show();
                    tickItem.lineEl_b.show();
                    let shape_t = {
                        x1: item.coord - xw,
                        y1: item.max_coord,
                        x2: item.coord + xw,
                        y2: item.max_coord
                    };

                    let shape_y = {
                        x1: item.coord,
                        y1: item.max_coord,
                        x2: item.coord,
                        y2: item.min_coord
                    };

                    let shape_b = {
                        x1: item.coord - xw,
                        y1: item.min_coord,
                        x2: item.coord + xw,
                        y2: item.min_coord
                    };
                    let style = {
                        stroke: color,
                    };
                    tickItem.lineEl_t.animateTo(
                        {
                            shape: shape_t,
                            style: style
                        },
                        animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    tickItem.lineEl_y.animateTo({
                            shape: shape_y,
                            style: style

                        },
                        animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    tickItem.lineEl_b.animateTo({
                            shape: shape_b,
                            style: style
                        },
                        animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    tickItem.updateState = true;
                } else {
                    let shape_t = {
                        x1: item.coord - xw,
                        y1: item.max_coord,
                        x2: item.coord + xw,
                        y2: item.max_coord
                    };
                    let lineEl_t = createLine(item, shape_t, shape_t, color);
                    let shape_y = {
                        x1: item.coord,
                        y1: item.max_coord,
                        x2: item.coord,
                        y2: item.min_coord
                    };
                    let lineEl_y = createLine(item, shape_y, shape_y, color);
                    let shape_b = {
                        x1: item.coord - xw,
                        y1: item.min_coord,
                        x2: item.coord + xw,
                        y2: item.min_coord
                    };
                    let lineEl_b = createLine(item, shape_b, shape_b, color);
                    this._lineLists.push({name: item.key, lineEl_t, lineEl_y, lineEl_b, updateState: true});
                    this.group.add(lineEl_t);
                    this.group.add(lineEl_y);
                    this.group.add(lineEl_b);
                }
            }, this);
            this._lineLists.forEach(d => {
                if (!d.updateState) {
                    d.lineEl_t.hide();
                    d.lineEl_y.hide();
                    d.lineEl_b.hide();
                }
            })
        },
        buildXlines: function (animationModel, posList, xw, color) {
            this._lineXlists.forEach(d => {
                d.updateState = false;
            });
            let createLine = function (item, _shape, shape, color) {
                let lineEl = new graphic.Line({
                    shape: _shape,
                    style: {
                        stroke: color,
                    },
                    silent: true
                });
                lineEl.animateTo({
                        shape: shape
                    }, animationModel.duration,
                    animationModel.animationDelay,
                    animationModel.animationEasing);
                return lineEl;
            };
            zrUtil.each(posList, function (item) {
                let tickItem = this._lineXlists.find(d => d.name === item.key);
                if (tickItem) {
                    tickItem.lineEl_t.show();
                    tickItem.lineEl_x.show();
                    tickItem.lineEl_b.show();
                    let shape_t = {
                        x1: item.min_coord,
                        y1: item.y - xw,
                        x2: item.min_coord,
                        y2: item.y + xw
                    };
                    let shape_x = {
                        x1: item.min_coord,
                        y1: item.y,
                        x2: item.max_coord,
                        y2: item.y
                    };
                    let shape_b = {
                        x1: item.max_coord,
                        y1: item.y - xw,
                        x2: item.max_coord,
                        y2: item.y + xw
                    };

                    let style = {
                        stroke: color,
                    };
                    tickItem.lineEl_t.animateTo(
                        {
                            shape: shape_t,
                            style: style
                        },
                        animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    tickItem.lineEl_x.animateTo({
                            shape: shape_x,
                            style: style

                        },
                        animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    tickItem.lineEl_b.animateTo({
                            shape: shape_b,
                            style: style
                        },
                        animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    tickItem.updateState = true;
                } else {
                    let shape_t = {
                        x1: item.min_coord,
                        y1: item.y - xw,
                        x2: item.min_coord,
                        y2: item.y + xw
                    };
                    let lineEl_t = createLine(item, shape_t, shape_t, color);
                    let shape_x = {
                        x1: item.min_coord,
                        y1: item.y,
                        x2: item.max_coord,
                        y2: item.y
                    };
                    let lineEl_x = createLine(item, shape_x, shape_x, color);
                    let shape_b = {
                        x1: item.max_coord,
                        y1: item.y - xw,
                        x2: item.max_coord,
                        y2: item.y + xw
                    };
                    let lineEl_b = createLine(item, shape_b, shape_b, color);
                    this._lineXlists.push({name: item.key, lineEl_t, lineEl_x, lineEl_b, updateState: true});
                    this.group.add(lineEl_t);
                    this.group.add(lineEl_x);
                    this.group.add(lineEl_b);
                }
            }, this);
            this._lineXlists.forEach(d => {
                if (!d.updateState) {
                    d.lineEl_t.hide();
                    d.lineEl_x.hide();
                    d.lineEl_b.hide();
                }
            })
        },
        render: function (seriesModel, ecModel, api) {
            let data = seriesModel.get("data"), minData = seriesModel.get("minData"),
                maxData = seriesModel.get("maxData");
            let seriesIndex = seriesModel.get("seriesIndex") || seriesModel.componentIndex;
            let start = seriesModel.get("start"), type = seriesModel.get("type");
            let xAxis = ecModel.getComponent("xAxis"), yAxis = ecModel.getComponent("yAxis");
            let itemMap = {};
            let posList = [];
            let seriesList = ecModel.getSeries();
            let dLen = data.length;
            let animationModel = {
                duration: seriesModel.getShallow('animationDurationUpdate'),
                animationEasing: seriesModel.getShallow('animationEasingUpdate'),
                animationDelay: seriesModel.getShallow('animationDelayUpdate') || 0
            };
            let themeColor = ecModel.get("color");
            if (ecModel.option.visualMap.length) {
                themeColor = ecModel.option.visualMap.map(d => d.inRange.color[d.inRange.color.length - 1])
            }

            seriesList.forEach((series, idx) => {
                if (idx === seriesIndex) {
                    let d_list = series.getData();
                    if (type === "bar") {
                        zrUtil.each(d_list._itemLayouts, function (item, i) {
                            let item_idx = d_list.getRawIndex(i);
                            let key = item_idx.toString();
                            if (item_idx >= start && item_idx <= start + dLen) {
                                let idx = item_idx - start;
                                if (echarts.number.isNumeric(minData[idx])
                                    && echarts.number.isNumeric(maxData[idx])
                                    && minData[idx] !== maxData[idx]) {
                                    itemMap[key] = {
                                        key: key,
                                        coord: item.x + item.width / 2,
                                        value: data[idx],
                                        start_y_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(0)),
                                        y_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(data[idx])),
                                        minValue: minData[idx] || data[idx],
                                        min_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(minData[idx] || data[idx])),
                                        maxValue: maxData[idx] || data[idx],
                                        max_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(maxData[idx] || data[idx]))
                                    };
                                    posList.push(itemMap[key])
                                }
                            }
                        }, this);

                        let color = seriesModel.get('line.color') || themeColor[seriesIndex % themeColor.length];
                        this.buildLines(animationModel, posList, 4, color);
                    } else if (type === "line") {
                        let color = seriesModel.get('line.color') || themeColor[seriesIndex % themeColor.length];
                        let min = xAxis.getMin() || 0, max = xAxis.getMax() || xAxis.get("data").length;
                        let minPoints = [], maxPoints = [];
                        for (let i = min; i <= max; i++) {
                            if (i >= start && i < start + dLen) {
                                let idx = i - start;
                                if (echarts.number.isNumeric(minData[idx]) && echarts.number.isNumeric(maxData[idx])) {
                                    maxPoints.push([xAxis.axis.toGlobalCoord(xAxis.axis.dataToCoord(i)), yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(maxData[idx]))]);
                                    minPoints.push([xAxis.axis.toGlobalCoord(xAxis.axis.dataToCoord(i)), yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(minData[idx]))]);
                                }
                            }
                        }
                        let points = maxPoints.concat(minPoints.reverse());
                        if (this._polygon) {
                            this._polygon.animateTo({
                                    shape: {
                                        points: points
                                    },
                                    style: {
                                        fill: color,
                                        lineWidth: 0,
                                        opacity: 0.3
                                    }
                                }, animationModel.duration,
                                animationModel.animationDelay,
                                animationModel.animationEasing);
                        } else {
                            let lineEl = new graphic.Polygon({
                                shape: {
                                    points: points,
                                },
                                style: {
                                    fill: color,
                                    lineWidth: 0,
                                    opacity: 0.3
                                },
                                silent: true
                            });
                            this.group.add(lineEl);
                            this._polygon = lineEl;
                        }
                    } else if (type === "scatter") {
                        let x_data = seriesModel.get("scatter.xData"),
                            x_minData = seriesModel.get("scatter.xMinData"),
                            x_maxData = seriesModel.get("scatter.xMaxData");
                        let x_posList = [];
                        zrUtil.each(d_list._itemLayouts, function (item, i) {
                            let item_idx = d_list.getRawIndex(i);
                            let key = item_idx.toString();
                            if (item_idx >= start && item_idx <= start + dLen) {
                                let idx = item_idx - start;
                                if (echarts.number.isNumeric(x_minData[idx])
                                    && echarts.number.isNumeric(x_maxData[idx])
                                    && x_minData[idx] !== x_maxData[idx]) {
                                    let obj = {
                                        key: key,
                                        x: item[0],
                                        y: item[1],
                                        value: x_data[idx],
                                        minValue: x_minData[idx] || x_data[idx],
                                        min_coord: xAxis.axis.toGlobalCoord(xAxis.axis.dataToCoord(x_minData[idx] || x_data[idx])),
                                        maxValue: x_maxData[idx] || x_data[idx],
                                        max_coord: xAxis.axis.toGlobalCoord(xAxis.axis.dataToCoord(x_maxData[idx] || x_data[idx])),
                                    };
                                    x_posList.push(obj)
                                }

                                if (echarts.number.isNumeric(minData[idx])
                                    && echarts.number.isNumeric(maxData[idx])
                                    && minData[idx] !== maxData[idx]) {
                                    itemMap[key] = {
                                        key: key,
                                        coord: item[0],
                                        value: data[idx],
                                        start_y_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(0)),
                                        y_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(data[idx])),
                                        minValue: minData[idx] || data[idx],
                                        min_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(minData[idx] || data[idx])),
                                        maxValue: maxData[idx] || data[idx],
                                        max_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(maxData[idx] || data[idx])),
                                        x: {}
                                    };
                                    posList.push(itemMap[key])
                                }
                            }
                        }, this);
                        let color = seriesModel.get('line.color') || themeColor[seriesIndex % themeColor.length];
                        this.buildLines(animationModel, posList, 4, color);
                        this.buildXlines(animationModel, x_posList, 4, color);
                    }
                }
            });
        },
        dispose: function () {
            this._lineLists = [];
            this._lineXlists = [];
            this._lineSeriesLists = [];
            this._polygon = null;
        }
    });
});