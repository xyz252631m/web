/*
** v:3.0
* */
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
        setLabel(list) {
            this.labels = list;
        },
        labels: [],
        defaultOption: {
            data: [],
            offset: 0,
            axis: "x",   // x  y
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
                align: "center",
                // verticalAlign: "middle",
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
            }
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
            this.label_w = 0;
            this.label_pos_y = 0;
            this._labels = [];
            this._splitArea = [];
            this._tickLists = [];
        },
        render: function (seriesModel, ecModel, api) {
            //let group = this.group;
            let topAxis = ecModel.getComponent("xAxis");
            //let grid = ecModel.getModel('grid'),
            let axis = topAxis.axis;
            let isY = seriesModel.get('axis') === "y";
            if (isY) {
                topAxis = ecModel.getComponent("yAxis");
                axis = ecModel.getComponent("yAxis").axis;
            }
            let comp_idx = seriesModel.componentIndex;
            let posList = this.settingPosIndexByList(seriesModel);
            let rect = axis.grid.getRect().clone(),
                tickCoords = axis.getTicksCoords(),
                labels = axis.getViewLabels();
            let animationModel = {
                duration: seriesModel.getShallow('animationDurationUpdate'),
                animationEasing: seriesModel.getShallow('animationEasingUpdate'),
                animationDelay: seriesModel.getShallow('animationDelayUpdate') || 0
            };
            let tcLen = tickCoords.length;
            //获取刻度之间的间距
            let _bandWidth = axis.getBandWidth();
            let bandWidth = _bandWidth;
            //可能存在间隔显示的情况
            if (tcLen >= 2) {
                bandWidth = tickCoords[tcLen - 1].coord - tickCoords[tcLen - 2].coord || _bandWidth;
            } else if (tcLen === 1) {
                bandWidth = tickCoords[0].coord || _bandWidth;
            }
            let toMaxWidth = function (val) {
                if (isY) {
                    let max = rect.y + rect.height;
                    if (val > max) {
                        return max;
                    } else {
                        return val;
                    }
                } else {
                    let max = rect.x + rect.width;
                    if (val > max) {
                        return max;
                    } else {
                        return val;
                    }
                }
            };
            let topAxisLabel = topAxis.getModel("axisLabel");
            let label_y = (topAxisLabel.get("fontSize") || 0) + (topAxisLabel.get("margin") || 0);
            let label_x = topAxisLabel.get("margin") || 0;
            if (isY) {
                let max_width = 0;
                topAxis.axis.getViewLabels().forEach(function (d) {
                    max_width = Math.max(max_width, topAxis.getModel("axisLabel").getTextRect(d.formattedLabel).width);
                });
                label_x += max_width;
            }
            ecModel.eachComponent("twoAxis", function (comp, i) {
                if (i < comp_idx) {
                    let textStyleModel = comp.getModel('axisLabel');
                    let fontSize = textStyleModel.get("fontSize");
                    let offset = comp.get("offset");
                    label_y += fontSize + 8 + offset;
                    if (isY) {
                        let max_width = 0;
                        comp.labels.forEach(function (label) {
                            max_width = Math.max(max_width, comp.getModel("axisLabel").getTextRect(label.text).width);
                        });
                        label_x += max_width + 8;
                    }
                }
            });

            this.label_pos_y = seriesModel.get("offset") + label_y + 8;
            let w = rect.x - seriesModel.get("offset") - this.label_w - label_x - 8;
            let h = rect.y + rect.height + this.label_pos_y;
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
                if (isY) {
                    if (remainder) {
                        item.position = [w, toMaxWidth(rect.y + rect.height - tickItemCoord)];
                    } else {
                        item.position = [w, rect.y + rect.height - tickItemCoord - bandWidth / 2];
                    }
                } else {
                    if (remainder) {
                        item.position = [toMaxWidth(rect.x + tickItemCoord), h];
                    } else {
                        item.position = [rect.x + tickItemCoord + bandWidth / 2, h];
                    }
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
                                label_w: posItem.label_w,
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
            seriesModel.labels = labelPosList;
            this.buildLabels(seriesModel, labelPosList, animationModel, isY);
            this.buildSplitArea(seriesModel, labelPosList, animationModel, rect, bandWidth, posList, isY);
            this.buildTicks(seriesModel, labelPosList, animationModel, rect, isY);
        },

        buildLabels: function (seriesModel, labelPosList, animationModel, isY) {
            let textStyleModel = seriesModel.getModel('axisLabel');
            let show = textStyleModel.get("show");
            if (!show) {
                return;
            }
            let align = textStyleModel.get("align");
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
                    textAlign: align,
                    textVerticalAlign: textStyleModel.get("verticalAlign"),
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
                        textAlign: align,
                        textVerticalAlign: textStyleModel.get("verticalAlign"),
                        font: textStyleModel.getFont(),
                        textFill: typeof textColor === 'function' ? textColor(item.name, idx) : textColor
                    });
                    labelItem.textEl.setStyle("text", fmt ? fmt(item.text, idx) : item.text);

                    let _pos = item.position;
                    if (isY) {
                        if (align === "center") {
                            _pos = [item.position[0] + item.label_w / 2, item.position[1]]
                        } else if (align === "right") {
                            _pos = [item.position[0] + item.label_w, item.position[1]]
                        }
                    }

                    labelItem.textEl.animateTo({
                            position: _pos
                        }, animationModel.duration,
                        animationModel.animationDelay,
                        animationModel.animationEasing);
                    labelItem.updateState = true;
                } else {
                    //初始化时创建label
                    let _pos = item.position;
                    if (isY) {
                        if (align === "center") {
                            _pos = [item.position[0] + item.label_w / 2, item.position[1]]
                        } else if (align === "right") {
                            _pos = [item.position[0] + item.label_w, item.position[1]]
                        }
                    }

                    let textEl = createTextEl(item, _pos, _pos, idx);
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

        buildTicks: function (seriesModel, labelPosList, animationModel, rect, isY) {
            this._tickLists.forEach(d => {
                d.updateState = false;
            });
            let tickModel = seriesModel.getModel('axisTick');
            let show = tickModel.get("show");
            if (!show) {
                return;
            }

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
                        y2: rect.y + item.position[1] - rect.y
                    };
                    if (isY) {
                        shape = {
                            x1: item.position[0] + item.label_w,
                            y1: rect.y + rect.height - item.start.coord,
                            x2: rect.x,
                            y2: rect.y + rect.height - item.start.coord,
                        };
                    }
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
                        y2: rect.y + item.position[1] - rect.y
                    };
                    if (isY) {
                        shape = {
                            x1: item.position[0] + item.label_w,
                            y1: rect.y + rect.height - item.start.coord,
                            x2: rect.x,
                            y2: rect.y + rect.height - item.start.coord,
                        };
                    }
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

        buildSplitArea: function (seriesModel, labelPosList, animationModel, rect, bandWidth, posList, isY) {
            let splitAreaModel = seriesModel.getModel('splitArea');
            let areaStyleModel = splitAreaModel.getModel('areaStyle');
            let show = splitAreaModel.get("show");
            if (!show) {
                return;
            }
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
            zrUtil.each(labelPosList, function (item) {
                let splitAreaItem = this._splitArea.find(d => d.name === item.name);
                if (splitAreaItem) {
                    let shape = {
                        x: rect.x + item.start.coord,
                        y: rect.y,
                        width: item.end.coord - item.start.coord + bandWidth,
                        height: rect.height
                    };
                    if (isY) {
                        shape = {
                            x: rect.x,
                            y: rect.y + rect.height - item.end.coord - bandWidth,
                            width: rect.width,
                            height: item.end.coord - item.start.coord + bandWidth,
                        };
                        //超出图表内容部分
                        if (shape.y + shape.height > rect.y + rect.height) {
                            shape.height -= shape.y + shape.height - (rect.y + rect.height)
                        }
                    } else {
                        //超出图表内容部分
                        if (shape.x + shape.width > rect.x + rect.width) {
                            shape.width -= shape.x + shape.width - (rect.x + rect.width)
                        }
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
                    if (isY) {
                        shape = {
                            x: rect.x,
                            y: rect.y + rect.height - item.end.coord - bandWidth,
                            width: rect.width,
                            height: item.end.coord - item.start.coord + bandWidth,
                        };
                    }
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
            let label_w = 0;
            let posList = [];
            if (list) {
                let getName = function (dataItem) {
                    return dataItem && (dataItem.value == null ? dataItem : dataItem.value);
                };
                zrUtil.each(list, function (dataItem, idx) {
                    let name = getName(dataItem);
                    let w = seriesModel.getModel("axisLabel").getTextRect(name).width;
                    label_w = Math.max(label_w, w);
                    if (idx) {
                        let prevName = getName(list[idx - 1]);
                        if (prevName === name) {
                            posList[posList.length - 1].end = idx;
                        } else {
                            posList.push({
                                name: name + "_" + idx,
                                dataItem: dataItem,
                                text: name,
                                label_w: w,
                                start: idx,
                                end: idx
                            })
                        }
                    } else {
                        posList.push({
                            name: name + "_" + idx,
                            dataItem: dataItem,
                            text: name,
                            label_w: w,
                            start: idx,
                            end: idx
                        })
                    }
                })
            }
            this.label_w = label_w;
            return posList;
        },
        dispose: function () {
            this.label_w = 0;
            this.label_pos_y = 0;
            this._labels = [];
            this._splitArea = [];
            this._tickLists = [];
        }
    });
});
