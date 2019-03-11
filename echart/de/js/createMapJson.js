(function () {
    //覆盖物
    let oly = {
        //回调获得覆盖物信息
        overlayComplete: function (e) {
            //多边形
            if (e.drawingMode === "polygon" || e.drawingMode === "rectangle") {
                let polygon = e.overlay;
                // cmap.addPolygon(polygon);
                let path = polygon.getPath();
                let id = cmap.createId();
                polygon._id = id;
                cmap.list.push(polygon);
                let featureObj = jsonOp.addPolygon(id, path);

                oly.polygonClickEvent(polygon, featureObj.properties);
                $(".btn-polygon").blur();
                $(".btn-rect").blur();
                //重新生成 json
                jsonOp.setEditor(jsonOp.obj);
            }
            this.close();
        },
        createByList(featuresList) {
            featuresList.forEach(d => {
                let properties = d.properties;
                let geometry = d.geometry;
                let points = geometry.coordinates;
                if (!d.id) {
                    d.id = cmap.createId();
                } else {
                    if (featuresList.filter(k => k.id === d.id).length >= 2) {
                        d.id = cmap.createId();
                    }
                }

                switch (geometry.type) {
                    case "Polygon":
                        points.forEach(p => {
                            let opt = this.propertiesToPolygonOption(jsonOp.def.properties);
                            let polygon = new BMap.Polygon(p.map(d => new BMap.Point(...d)), opt);
                            this.polygonClickEvent(polygon, properties);
                            polygon._id = d.id;
                            cmap.list.push(polygon);
                            cmap._map.addOverlay(polygon);
                        });
                        break;
                    case "MultiPolygon":
                        points.forEach((p, pi) => {
                            let opt = this.propertiesToPolygonOption(jsonOp.def.properties);
                            let polygon = new BMap.Polygon(p.map(d => new BMap.Point(...d)), opt);
                            this.polygonClickEvent(polygon, properties);
                            polygon._id = d.id;
                            polygon._idx = pi;
                            cmap.list.push(polygon);
                            cmap._map.addOverlay(polygon);
                        });
                        break;
                }
            });
        },

        //绑定多边形点击事件
        polygonClickEvent(polygon, properties, callback) {
            polygon.addEventListener("click", function (e) {
                let p = e.point;
                let infoBox = new InfoBox(properties, p, polygon);
                infoBox.infoWindow.addEventListener("open", function () {
                    infoBox.bindEvent(this);
                });
                cmap._map.openInfoWindow(infoBox.infoWindow, p); //开启信息窗口
            });
        },

        //转换为经纬度数组
        toPoints(list) {
            let arr = [];
            let len = list.length;
            let t = parseInt(len / 200) || 1;
            list.forEach((d, i) => {
                if (i % t === 0) {
                    arr.push(d);
                }
            });
            return arr;
        },

        //从properties  里拼装  PolygonOption
        propertiesToPolygonOption(properties) {
            return {
                strokeColor: properties.stroke,
                fillColor: properties.fill,
                strokeWeight: properties["stroke-width"],
                strokeOpacity: properties["stroke-opacity"],
                fillOpacity: properties["fill-opacity"],
                strokeStyle: properties["stroke-style"],
            };
        }
    };

    //信息弹窗
    //properties:{strokeColor,fillColor ... }
    //point: 当前点击时的经纬度坐标点 {lng,lat}
    //polygon: 当前的图形实例
    //opt: is InfoWindowOptions
    class InfoBox {
        constructor(properties, point, polygon, opt) {
            let opts = {
                width: 250,     // 信息窗口宽度
                // height: 80,     // 信息窗口高度
                // title: "信息窗口", // 信息窗口标题
                enableMessage: false//设置允许信息窗发送短息
            };
            this.content = $(this.getBaseContent());
            this.properties = properties;
            this.point = point;
            this.polygon = polygon;
            this.showByData(properties);
            this.infoWindow = new BMap.InfoWindow(this.content[0], opts);  // 创建信息窗口对象
        }

        //获取input列表
        getInputList($el) {
            let $table = $el.find(".attr-table");
            let $nameList = $table.find("th input"), $valList = $table.find("td input");
            return {$nameList, $valList}
        }

        //回显数据
        showByData(properties) {
            if (properties) {
                let {$nameList, $valList} = this.getInputList(this.content);
                $nameList.each(function (idx, el) {
                    let key = el.value.trim();
                    if (el.dataset.key) {
                        key = el.dataset.key;
                    }
                    let prop = properties[key];
                    if (prop) {
                        if (el.dataset.idx) {
                            $valList[idx].value = prop[parseInt(el.dataset.idx)];
                        } else {
                            $valList[idx].value = prop;
                        }
                    }
                });
            }
        }

        //获取html
        getBaseContent() {
            return $("#info_html").text();
        }

        bindEvent(infoWindow) {
            //显示属性
            $(".chb-show-style").off("click").on("click", e => {
                let $el = $(e.target);
                let val = $el.prop("checked");
                let $table = $(".attr-table");
                if (val) {
                    $table.removeClass("attr-no-style");
                } else {
                    $table.addClass("attr-no-style");
                }
                infoWindow.redraw();
            });

            //保存
            $(".btn-info-save").off("click").on("click", () => {
                let $el = $(infoWindow.getContent());
                let {$nameList, $valList} = this.getInputList($el);
                let map = {};
                $nameList.each(function (idx, el) {
                    let key = el.value.trim();
                    if (el.dataset.key) {
                        key = el.dataset.key;
                    }
                    if (el.dataset.idx) {
                        if (map[key] === undefined) {
                            map[key] = [];
                        }
                        map[key][parseInt(el.dataset.idx)] = $valList[idx].value;
                    } else {
                        map[key] = $valList[idx].value;
                    }
                });
                Object.assign(this.properties, map);
                infoWindow.close();
                jsonOp.setEditor(jsonOp.obj);
            });
            //填入当前经纬度
            $(".info-marker").off("click").on("click", (e) => {
                let $el = $(infoWindow.getContent());
                let {$nameList, $valList} = this.getInputList($el);
                let list = $nameList.filter((idx, elem) => elem.dataset.key === "cp");
                list.each((idx, elem) => {
                    let i = $nameList.index(elem);
                    //cp 必须有 data-idx
                    if (parseInt(elem.dataset.idx)) {
                        //纬度
                        $valList[i].value = this.point.lat;
                    } else {
                        $valList[i].value = this.point.lng;
                    }
                })
            });

            //编辑
            $(".info-min-edit").off("click").on("click", e => {
                $(".pop-box").show();

                cmap.list.forEach(d => {
                    if (d === this.polygon) {
                        this.polygon.enableEditing();
                    } else {
                        d.disableEditing();
                    }
                });

                cmap.itemEdit = true;
                cmap.editPolygon = this.polygon;
                cmap.points = this.polygon.getPath();
                infoWindow.close();
            });

            //删除
            $(".info-min-del").off("click").on("click", e => {
                cmap.list.splice(cmap.list.findIndex(d => d === this.polygon), 1);
                this.polygon.remove();
                jsonOp.delPolygon(this.polygon._id);
                infoWindow.close();
                //重新生成 json
                jsonOp.setEditor(jsonOp.obj);
            });

            //关闭
            $(".btn-info-cel").off("click").on("click", () => {
                infoWindow.close();
            });
        }
    }

    //json 操作
    let jsonOp = {
        def: {
            "type": "FeatureCollection",
            "features": [],
            feature: {
                "id": "",
                "type": "Feature",
                "properties": {
                    name: "",
                    cp: []
                },
                "geometry": {
                    "type": "Polygon",
                    "encodeOffsets": [],
                    "coordinates": []
                }
            },
            properties: {
                "stroke": "#333",
                "fill": "#333",
                "stroke-width": 2,
                "stroke-opacity": 0.8,
                "fill-opacity": 0.6,
                "stroke-style": "solid",
            }

        },
        //当前json 对象
        obj: null,

        loadJson(jsonObj, setEditorVal) {
            if (!Array.isArray(jsonObj.features)) {
                throw "json 格式不正确！"
            }
            jsonObj.features.forEach(d => {
                d.properties = Object.assign({}, this.def.feature.properties, d.properties);
            });
            cmap.list = [];
            cmap._map.clearOverlays();
            this.obj = jsonObj;
            this.toMapJsonObj(jsonObj);
            oly.createByList(jsonObj.features);
            setEditorVal && this.setEditor(jsonObj);
        },
        setEditor(jsonObj) {
            if (cmap.editor) {
                cmap.isAutoEditor = true;
                cmap.editor.setValue(JSON.stringify(jsonObj));
                let totalLines = cmap.editor.lineCount();
                cmap.editor.autoFormatRange({line: 0, ch: 0}, {line: totalLines});
            }

        },

        delPolygon(id) {
            let idx = this.obj.features.findIndex(d => d.id === id);
            if (idx >= 0) {
                this.obj.features.splice(idx, 1);
            }
        },
        //添加polyon json 对象
        addPolygon(id, path) {
            let featureObj = {};
            let list = [];
            path.forEach(d => {
                list.push([d.lng, d.lat]);
            });
            $.extend(true, featureObj, this.def.feature);
            featureObj.geometry.coordinates = [list];
            featureObj.id = id;
            this.obj.features.push(featureObj);
            return featureObj;
        },

        creatDefJson() {
            this.obj = {
                "type": "FeatureCollection",
                "features": []
            }
        },
        //转为普通数据 - 如果存在加密则需要解密数据
        toMapJsonObj(jsonObj) {
            jsonObj.features.forEach(d => {
                let geometry = d.geometry;
                let coordinates = geometry.coordinates;
                let list = [];
                let encodeOffsets = geometry.encodeOffsets;
                switch (geometry.type) {
                    case "Polygon":
                        list = [];
                        coordinates.forEach((k, ki) => {
                            if (Array.isArray(k)) {
                                list.push(k);
                            } else {
                                list.push(oly.toPoints(decodePolygon(k, encodeOffsets[ki] || [0, 0])))
                            }
                        });
                        geometry.coordinates = list;
                        break;
                    case "MultiPolygon":
                        list = [];
                        coordinates.forEach((y, yi) => {
                            let temList = y;
                            y.forEach((k, ki) => {
                                if (Array.isArray(k)) {

                                } else {
                                    temList = oly.toPoints(decodePolygon(k, encodeOffsets[yi][ki] || [0, 0]))
                                }
                            });
                            list.push(temList);
                        });

                        geometry.coordinates = list;
                        break;
                }
            });
        },
        //加密数据
        encodeJsonObj(jsonObj) {
            jsonObj.features.forEach(d => {
                let geometry = d.geometry;
                let coordinates = geometry.coordinates;
                let list = [], encodeOffsetList = [];
                switch (geometry.type) {
                    case "Polygon":
                        list = [];
                        encodeOffsetList = [];
                        coordinates.forEach((k, ki) => {
                            let encodeOffsets = [];
                            list.push(encodePolygon(k, encodeOffsets));
                            encodeOffsetList.push(encodeOffsets);
                        });
                        geometry.coordinates = list;
                        geometry.encodeOffsets = encodeOffsetList;
                        break;
                    case "MultiPolygon":
                        list = [];
                        encodeOffsetList = [];
                        coordinates.forEach((k, ki) => {
                            let temList = [];
                            let temOffset = [];
                            let encodeOffsets = [];
                            temList.push(encodePolygon(k, encodeOffsets));
                            temOffset.push(encodeOffsets);
                            list.push(temList);
                            encodeOffsetList.push(temOffset)
                        });
                        geometry.coordinates = list;
                        geometry.encodeOffsets = encodeOffsetList;
                        break;
                }
            });
        }
    };


    // class CusMap {
    //     constructor(map, jsonObj, opt) {
    //         this._map = map;
    //         this.list = [];
    //     }
    // }

    let cmap = {
        _map: null,
        _idx: 100,
        isAutoEditor: false, //是否更新一次editor
        //Polygon list
        list: [],
        polygonMap: {},
        //单个item 编辑状态
        itemEdit: false,
        points: [],
        editPolygon: null,
        //编辑状态
        isEdit: false,
        //初始化
        init(map, jsonObj, editor) {
            this._map = map;
            this.editor = editor;
            if (jsonObj) {
                jsonOp.loadJson(jsonObj, true);
            } else {
                jsonOp.creatDefJson();
                jsonOp.setEditor(jsonOp.obj)
            }
            let styleOptions = oly.propertiesToPolygonOption(jsonOp.def.properties);
            //实例化鼠标绘制工具
            let drawingManager = new BMapLib.DrawingManager(map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: false, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    scale: 0.8, //工具栏缩放比例
                    drawingModes: [
                        BMAP_DRAWING_MARKER,
                        BMAP_DRAWING_POLYGON,
                        BMAP_DRAWING_RECTANGLE
                    ]
                },
                polygonOptions: styleOptions,
                rectangleOptions: styleOptions
            });
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            drawingManager.addEventListener('overlaycomplete', oly.overlayComplete);


            //双击删除 -- 测试版
            map.addEventListener("addoverlay", function (e, a) {
                cmap.list.forEach(p => {
                    p.lc.forEach(d => {
                        if (d.V && d.V.classList.contains("BMap_vectex_node")) {
                            d.V.dataset.point = d.point.lng + "," + d.point.lat;
                            d.V.dataset.pid = p._id;
                            d.V.removeEventListener("dblclick", cmap.delOpNode);
                            d.V.addEventListener("dblclick", cmap.delOpNode);
                        }
                    })
                });
            });

            map.addEventListener("click", function () {
                cmap.isEdit = false;
            });

            return {
                drawingManager
            }
        },


        //删除节点
        delOpNode(e) {
            let obj = this.dataset;
            let polygon = cmap.list.find(k => k._id === obj.pid);
            if (polygon) {
                let points = polygon.getPath();
                if (points.length > 3) {
                    let curr_point = new BMap.Point(...obj.point.split(","));
                    let new_points = points.filter(p => !p.equals(curr_point));
                    polygon.setPath(new_points);
                }
            }
        },


        createId() {
            this._idx++;
            return new Date().getTime() + "_" + this._idx;
        },

        //根据polygon 列表更新json对象
        updateAllPolygonPath() {
            let featuresList = jsonOp.obj.features;
            this.list.forEach(d => {
                let points = d.getPath();
                let jsonObj = featuresList.find(k => k.id === d._id);
                if (jsonObj) {
                    let idx = d._idx || 0;
                    jsonObj.geometry.coordinates[idx] = points.map(k => [k.lng, k.lat]);
                }
            });
            jsonOp.setEditor(jsonOp.obj);
        }
    };

    window.jsonOp = jsonOp;
    window.cmap = cmap;
})();