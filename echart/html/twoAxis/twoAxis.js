(function (root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(require("echarts"));
    else if (typeof define === 'function' && define.amd)
        define(["echarts"], factory);
    else if (typeof exports === 'object')
        exports["twoAxis"] = factory(require("echarts"));
    else
        root["twoAxis"] = factory(root["echarts"]);
})(this, function (echarts) {

    let graphic = echarts.graphic, zrUtil = echarts.util;

    echarts.extendComponentModel({
        type: 'twoAxis',
        defaultOption: {
            data: [],
            offset: 30,
            axisLine: {
                show: true,
                onZero: true,
                onZeroAxisIndex: null,
                lineStyle: {
                    color: '#333',
                    width: 1,
                    type: 'solid'
                },
                symbol: ['none', 'none'],
                symbolSize: [10, 15]
            },
            axisTick: {
                show: true,
                alignWithLabel: false,
                interval: 'auto',
                inside: false,
                length: 5,
                lineStyle: {
                    width: 1
                }
            },
            axisLabel: {
                show: true,
                inside: false,
                interval: 'auto',
                rotate: 0,
                showMinLabel: null,
                showMaxLabel: null,
                margin: 8,
                formatter: null,
                fontSize: 12
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ['#ccc'],
                    width: 1,
                    type: 'solid'
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                }
            },
        }
    });

    echarts.extendComponentView({
        type: 'twoAxis',
        getLabelItem(key) {
            let item = this._labels.find(d => d.name === key);
            if (item) {
                return item;
            }
            return null;
        },
        init: function (ecModel, api) {
            this._labels = [];
            this._splitArea = [];
            this._tickLists = [];
        },
        render: function (seriesModel, ecModel, api) {
            let group = this.group;
            let grid = ecModel.getModel('grid'), xAxis = ecModel.getComponent("xAxis");
            let posList = this.settingPosIndexByList(seriesModel);
            let rect = xAxis.axis.grid.getRect(),
                tickCoords = xAxis.axis.getTicksCoords(),
                labels = xAxis.axis.getViewLabels();

            let animationModel = {
                duration: seriesModel.getShallow('animationDurationUpdate'),
                animationEasing: seriesModel.getShallow('animationEasingUpdate'),
                animationDelay: seriesModel.getShallow('animationDelayUpdate') || 0
            };

            let tcLen = tickCoords.length;
            //获取刻度之间的间距
            let _bandWidth = xAxis.axis.getBandWidth();
            let bandWidth = _bandWidth;
            //可能存在间隔显示的情况
            if (tcLen >= 2) {
                bandWidth = tickCoords[tcLen - 1].coord - tickCoords[tcLen - 2].coord || _bandWidth;
            } else if (tcLen === 1) {
                bandWidth = tickCoords[0].coord || _bandWidth;
            }
            let toMaxWidth = function (val) {
                let max = rect.x + rect.width;
                if (val > max) {
                    return max;
                } else {
                    return val;
                }
            };
            let h = rect.y + rect.height + seriesModel.get("offset");
            let labelMap = {}, labelPosList = [];

            let getItemByPos = function (tick, posList) {
                let item = null;
                for (let i = 0; i < posList.length; i++) {
                    if (posList[i].start <= tick && tick <= posList[i].end) {
                        item = posList[i];
                        break;
                    }
                }
                return item;
            };
            labels.forEach(d => {
                let item = tickCoords.find(k => k.tickValue === d.tickValue);
                if (item) {
                    d.coord = item.coord;
                } else {
                    d.coord = 0;
                }
            });
            let calcPosition = function (item, labels) {
                let diff = item.endIndex - item.startIndex;
                let remainder = diff % 2;
                let middle = item.startIndex + Math.ceil(diff / 2);
                let tickItemCoord = labels[middle].coord;//getCoordsByValue(middle);
                if (remainder) {
                    item.position = [toMaxWidth(rect.x + tickItemCoord), h];
                } else {
                    item.position = [rect.x + tickItemCoord + bandWidth / 2, h];
                }
            };
            labels.forEach(function (item, idx) {
                if (item.tickValue !== undefined) {
                    let posItem = getItemByPos(item.tickValue, posList);
                    if (posItem) {
                        if (!labelMap[posItem.name]) {
                            labelMap[posItem.name] = {
                                name: posItem.name,
                                text: posItem.text,
                                start: item,
                                startIndex: idx,
                                end: item,
                                endIndex: idx,
                                position: []
                            };
                            labelPosList.push(labelMap[posItem.name]);
                        } else {
                            labelMap[posItem.name].end = item;
                            labelMap[posItem.name].endIndex = idx;
                        }
                        //计算label位置
                        calcPosition(labelMap[posItem.name], labels)
                    }
                }
            });

            this.buildLabels(seriesModel, labelPosList, animationModel);
            this.buildSplitArea(seriesModel, labelPosList, animationModel, rect, bandWidth, posList);
            this.buildTicks(seriesModel, labelPosList, animationModel, rect);
        },

        buildLabels: function (seriesModel, labelPosList, animationModel) {
            let textStyleModel = seriesModel.getModel('axisLabel');
            let fmt = textStyleModel.get("formatter");


            let textColor = textStyleModel.getTextColor() || seriesModel.get('axisLine.lineStyle.color');
            let createTextEl = function (item, _pos, position, idx) {
                let textEl = new graphic.Text({
                    position: _pos,
                    //rotation: labelLayout.rotation,
                    silent: true
                });
                graphic.setTextStyle(textEl.style, textStyleModel, {
                    text: fmt ? fmt(item.text, idx) : item.text,
                    font: textStyleModel.getFont(),
                    textAlign: textStyleModel.get("align") || "center",
                    textFill: typeof textColor === 'function' ? textColor(item.name, idx) : textColor
                });
                textEl.animateTo({
                        position: position
                    }, animationModel.duration,
                    animationModel.animationDelay,
                    animationModel.animationEasing);
                return textEl;
            };

            this._labels.forEach(d => {
                d.updateState = false;
            });

            zrUtil.each(labelPosList, function (item, idx) {
                let labelItem = this.getLabelItem(item.name);
                if (labelItem) {
                    //已存在时直接更新
                    labelItem.textEl.show();
                    graphic.setTextStyle(labelItem.textEl.style, textStyleModel, {
                        textAlign: textStyleModel.get("align") || "center",
                        font: textStyleModel.getFont(),
                        textFill: typeof textColor === 'function' ? textColor(item.name, idx) : textColor
                    });
                    labelItem.textEl.setStyle("text", fmt ? fmt(item.text, idx) : item.text);
                    labelItem.textEl.animateTo({
                            position: item.position
                        }, animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    labelItem.updateState = true;
                } else {
                    //初始化时创建label
                    let _pos = item.position;
                    let textEl = createTextEl(item, _pos, item.position, idx);
                    this._labels.push({name: item.name, textEl, updateState: true});
                    this.group.add(textEl);
                }
            }, this);

            this._labels.forEach(d => {
                if (!d.updateState) {
                    d.textEl.hide();
                }
            })
        },

        buildTicks: function (seriesModel, labelPosList, animationModel, rect) {
            this._tickLists.forEach(d => {
                d.updateState = false;
            });
            let tickModel = seriesModel.getModel('axisTick');
            let lineStyleModel = tickModel.getModel('lineStyle');
            let createTick = function (item, _shape, shape, color) {
                let lineEl = new graphic.Line({
                    shape: _shape,
                    style: zrUtil.defaults(
                        lineStyleModel.getLineStyle(),
                        {
                            stroke: color,
                            lineDash: lineStyleModel.getLineDash()
                        }),
                    silent: true
                });
                lineEl.animateTo({
                        shape: shape,
                    }, animationModel.duration,
                    animationModel.animationDelay,
                    animationModel.animationEasing);
                return lineEl;
            };
            let color = seriesModel.get('axisLine.lineStyle.color');
            zrUtil.each(labelPosList, function (item, idx) {
                if (idx === 0) {
                    return;
                }
                let tickItem = this._tickLists.find(d => d.name === item.name);
                if (tickItem) {
                    let shape = {
                        x1: rect.x + item.start.coord,
                        y1: rect.y + rect.height,
                        x2: rect.x + item.start.coord,
                        y2: rect.y + rect.height + seriesModel.get("offset")
                    };
                    tickItem.lineEl.show();
                    let style = zrUtil.defaults(lineStyleModel.getLineStyle(), {
                        lineDash: lineStyleModel.getLineDash() || [0, 0]
                    });
                    tickItem.lineEl.animateTo({
                            shape: shape,
                            style: style
                        },
                        animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    tickItem.updateState = true;
                } else {
                    let shape = {
                        x1: rect.x + item.start.coord,
                        y1: rect.y + rect.height,
                        x2: rect.x + item.start.coord,
                        y2: rect.y + rect.height + seriesModel.get("offset")
                    };

                    let lineEl = createTick(item, shape, shape, color);
                    this._tickLists.push({name: item.name, lineEl, shape, updateState: true});
                    this.group.add(lineEl);
                }
            }, this);

            this._tickLists.forEach(d => {
                if (!d.updateState) {
                    d.lineEl.hide();
                }
            })
        },

        buildSplitArea: function (seriesModel, labelPosList, animationModel, rect, bandWidth, posList) {
            let splitAreaModel = seriesModel.getModel('splitArea');
            let areaStyleModel = splitAreaModel.getModel('areaStyle');
            let areaColors = areaStyleModel.get('color');
            let areaStyle = areaStyleModel.getAreaStyle();
            let createSplitArea = function (item, _shape, shape, color) {
                let rectEl = new graphic.Rect({
                    shape: _shape,
                    style: zrUtil.defaults({
                        fill: color
                    }, areaStyle),
                    silent: true
                });

                rectEl.animateTo({
                        shape: shape,
                    }, animationModel.duration,
                    animationModel.animationDelay,
                    animationModel.animationEasing);
                return rectEl;
            };

            zrUtil.each(this._splitArea, function (d) {
                d.updateState = false;
            });
            zrUtil.each(labelPosList, function (item, idx) {
                let splitAreaItem = this._splitArea.find(d => d.name === item.name);
                if (splitAreaItem) {
                    let shape = {
                        x: rect.x + item.start.coord,
                        y: rect.y,
                        width: item.end.coord - item.start.coord + bandWidth,
                        height: rect.height
                    };
                    //超出图表内容部分
                    if (shape.x + shape.width > rect.x + rect.width) {
                        shape.width -= shape.x + shape.width - (rect.x + rect.width)
                    }
                    splitAreaItem.rectEl.show();
                    splitAreaItem.rectEl.animateTo({
                            shape: shape,
                        }, animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    splitAreaItem.updateState = true;
                } else {
                    let shape = {
                        x: rect.x + item.start.coord,
                        y: rect.y,
                        width: item.end.coord - item.start.coord + bandWidth,
                        height: rect.height
                    };
                    let colorIndex = posList.findIndex(d => d.name === item.name);
                    let color = areaColors[colorIndex % 2];
                    let rectEl = createSplitArea(item, shape, shape, color);
                    this._splitArea.push({name: item.name, rectEl, shape, updateState: true});
                    this.group.add(rectEl);
                }
            }, this);
            this._splitArea.forEach(d => {
                if (!d.updateState) {
                    d.rectEl.hide();
                }
            })
        },

        //获取当前数据的位置信息
        settingPosIndexByList: function (seriesModel) {
            let list = seriesModel.get("data");
            let posList = [];
            if (list) {
                let getName = function (dataItem) {
                    return dataItem && (dataItem.value == null ? dataItem : dataItem.value);
                };
                zrUtil.each(list, function (dataItem, idx) {
                    let name = getName(dataItem);
                    if (idx) {
                        let prevName = getName(list[idx - 1]);
                        if (prevName === name) {
                            posList[posList.length-1].end = idx;
                        } else {
                            posList.push({
                                name: name + "_" + idx,
                                dataItem: dataItem,
                                text: name,
                                start: idx,
                                end: idx
                            })
                        }
                    } else {
                        posList.push({
                            name: name + "_" + idx,
                            dataItem: dataItem,
                            text: name,
                            start: idx,
                            end: idx
                        })
                    }
                })
            }
            console.log("posList1",posList)

            return posList;
        },
        dispose: function () {
            this._labels = [];
            this._splitArea = [];
            this._tickLists = [];
        }
    });
});