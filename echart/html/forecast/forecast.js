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
            }
        }
    });

    echarts.extendComponentView({
        type: 'forecast',
        init: function (ecModel, api) {
            // this._labels = [];
            // this._splitArea = [];
            this._lineLists = [];
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
            seriesList.forEach((series, idx) => {
                if (idx === seriesIndex) {
                    let d_list = series.getData();
                    d_list._itemLayouts.forEach((item, i) => {
                        let item_idx = d_list.getRawIndex(i);
                        let key = item_idx.toString();
                        if (item_idx >= start && item_idx <= start + dLen) {

                            let idx = item_idx - start;
                            if (echarts.number.isNumeric(minData[idx])
                                && echarts.number.isNumeric(maxData[idx])
                                && minData[idx] !== maxData[idx]) {
                                itemMap[key] = {
                                    key: key,
                                    coord: xAxis.axis.toGlobalCoord(xAxis.axis.dataToCoord(item_idx)),
                                    value: data[idx],
                                    y_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(data[idx])),
                                    minValue: minData[idx] || data[idx],
                                    min_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(minData[idx] || data[idx])),
                                    maxValue: maxData[idx] || data[idx],
                                    max_coord: yAxis.axis.toGlobalCoord(yAxis.axis.dataToCoord(maxData[idx] || data[idx]))
                                };
                                posList.push(itemMap[key])
                            }

                        }
                    })
                }
            });
            // console.log("posList", posList)
            let animationModel = {
                duration: seriesModel.getShallow('animationDurationUpdate'),
                animationEasing: seriesModel.getShallow('animationEasingUpdate'),
                animationDelay: seriesModel.getShallow('animationDelayUpdate') || 0
            };

            if (type === "bar") {
                let themeColor = ecModel.get("color");
                let color = seriesModel.get('line.color') || themeColor[seriesIndex % themeColor.length];
                this.buildLines(animationModel, posList, 4, color);
            } else if (type === "line") {

            }
        },


        dispose: function () {
            // this._labels = [];
            // this._splitArea = [];
            this._lineLists = [];
        }
    });
});