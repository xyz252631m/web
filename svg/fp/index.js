define(["echarts","x/x-loading","../js/svg.min.js"],function(echarts){
    var myloading = require("x/x-loading").init();
    myloading.open();
    window.SVG = require("../js/svg.min.js");
    var chart1 = echarts.init(document.getElementById("chart1"));
    option1 = {
        tooltip:
            {
                trigger: "axis",
                axisPointer: { type: "shadow" }
            },
        grid:
            {
                left: "10%", right: "5%", bottom: 30
            },
        color: ["#20A8D8", "#009EF0", "#F46060", "#EA7C09", "#EBE120", "#96BC17", "#45A834"],
        calculable: !0,
        xAxis: [{
            type: "category", axisLabel: { rotate: 20 },
            data: ["商品1", "商品2", "商品3", "商品4", "商品5"]
        }],
        yAxis: [{ type: "value", name: "万元" }],
        series: [{
            name: "销项发票金额", type: "bar",
            label: { show: !0, position: "top" },
            data: [
                { name: "商品1", value: "120000", itemStyle: { color: "#20A8D8" } },
                { name: "商品2", value: "80000", itemStyle: { color: "#009EF0" } },
                { name: "商品3", value: "80000", itemStyle: { color: "#F46060" } },
                { name: "商品4", value: "60000", itemStyle: { color: "#EA7C09" } },
                { name: "商品5", value: "56000", itemStyle: { color: "#EBE120" } }
            ],
            barWidth: 25
        }]
    }
    var chart2 = echarts.init(document.getElementById("chart2"));
    option2 = {
        tooltip:
            {
                trigger: "axis",
                axisPointer: { type: "shadow" }
            },
        grid:
            {
                left: "10%", right: "5%", bottom: 30
            },
        color: ["#20A8D8", "#009EF0", "#F46060", "#EA7C09", "#EBE120", "#96BC17", "#45A834"],
        calculable: !0,
        xAxis: [{
            type: "category", axisLabel: { rotate: 20 },
            data: ["商品1", "商品2", "商品3", "商品4", "商品5"]
        }],
        yAxis: [{ type: "value", name: "万元" }],
        series: [{
            name: "进项发票金额", type: "bar",
            label: { show: !0, position: "top" },
            data: [
                { name: "商品1", value: "120000", itemStyle: { color: "#20A8D8" } },
                { name: "商品2", value: "80000", itemStyle: { color: "#009EF0" } },
                { name: "商品3", value: "80000", itemStyle: { color: "#F46060" } },
                { name: "商品4", value: "60000", itemStyle: { color: "#EA7C09" } },
                { name: "商品5", value: "56000", itemStyle: { color: "#EBE120" } }
            ],
            barWidth: 25
        }]
    }
    var chart3 = echarts.init(document.getElementById("chart3"));
    option3 = {
        color: [ '#47d6ff', '#479eff', 'rgba(255,255,255,.5)'],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },

        series: [
            {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 3350, name: '非顶额开票'},
                    {value: 310, name: '顶额开票'}

                ],
                label: {
                    fontSize: 13,
                    color: '#333',
                    formatter: function(param) {
                        return param.name + '{per' + param.dataIndex + '|' + param.percent.toFixed(0) + '%}';
                    },
                    rich: {

                        per0: {
                            padding: [0, 0, 0, 5],
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: '#47d6ff'
                        },
                        per1: {
                            padding: [0, 0, 0, 5],
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: '#479eff'
                        }
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var chart4 = echarts.init(document.getElementById("chart4"));
    s = function() {
        for (var e = [], a = 1; a < 10; a++) e.push(a + "月");
        return e
    } ();
    option4 = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        grid: {
            left: "10%", right: "5%", bottom: 30
        },
        calculable: !0,
        xAxis: [{
            type: "category",
            data: s
        }],
        yAxis: [{
            type: "value",
            name: "金额：亿元",
            min: 0,
            max: 5e3,
            position: "left",
            axisLabel: {
                formatter: "{value} "
            },
            splitLine: {
                show: !1
            }
        }],
        series: [{
            name: "开票金额",
            type: "bar",
            barWidth: 20,
            itemStyle: {
                normal: {
                    color: "#009EF0"
                }
            },
            data: [4300, 3200, 3800, 3500, 4e3, 3600, 3500, 4e3, 2300]
        }]
    }

    var chart5 = echarts.init(document.getElementById("chart5"));
    option5 = {
        tooltip:
            {
                trigger: "axis",
                axisPointer: { type: "shadow" }
            },
        grid:
            {
                left: "10%", right: "5%", bottom: 30
            },
        color: ["#20A8D8", "#009EF0", "#F46060", "#EA7C09", "#EBE120", "#96BC17", "#45A834"],
        calculable: !0,
        xAxis: [{
            type: "category", axisLabel: { rotate: 20 },
            data: ["商品1", "商品2", "商品3", "商品4", "商品5"]
        }],
        yAxis: [{ type: "value", name: "万元" }],
        series: [{
            name: "销项发票金额", type: "bar",
            label: { show: !0, position: "top" },
            data: [
                { name: "商品1", value: "120000", itemStyle: { color: "#20A8D8" } },
                { name: "商品2", value: "80000", itemStyle: { color: "#009EF0" } },
                { name: "商品3", value: "80000", itemStyle: { color: "#F46060" } },
                { name: "商品4", value: "60000", itemStyle: { color: "#EA7C09" } },
                { name: "商品5", value: "56000", itemStyle: { color: "#EBE120" } }
            ],
            barWidth: 25
        }]
    }
    var chart6 = echarts.init(document.getElementById("chart6"));
    option6 = {
        tooltip:
            {
                trigger: "axis",
                axisPointer: { type: "shadow" }
            },
        grid:
            {
                left: "10%", right: "5%", bottom: 30
            },
        color: ["#20A8D8", "#009EF0", "#F46060", "#EA7C09", "#EBE120", "#96BC17", "#45A834"],
        calculable: !0,
        xAxis: [{
            type: "category", axisLabel: { rotate: 20 },
            data: ["商品1", "商品2", "商品3", "商品4", "商品5"]
        }],
        yAxis: [{ type: "value", name: "万元" }],
        series: [{
            name: "进项发票金额", type: "bar",
            label: { show: !0, position: "top" },
            data: [
                { name: "商品1", value: "120000", itemStyle: { color: "#20A8D8" } },
                { name: "商品2", value: "80000", itemStyle: { color: "#009EF0" } },
                { name: "商品3", value: "80000", itemStyle: { color: "#F46060" } },
                { name: "商品4", value: "60000", itemStyle: { color: "#EA7C09" } },
                { name: "商品5", value: "56000", itemStyle: { color: "#EBE120" } }
            ],
            barWidth: 25
        }]
    }

    var chart7 = echarts.init(document.getElementById("chart7"));
    option7 = {
        color: [ '#47d6ff', '#479eff', 'rgba(255,255,255,.5)'],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },

        series: [
            {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 3350, name: '非顶额开票'},
                    {value: 310, name: '顶额开票'}

                ],
                label: {
                    fontSize: 13,
                    color: '#333',
                    formatter: function(param) {
                        return param.name + '{per' + param.dataIndex + '|' + param.percent.toFixed(0) + '%}';
                    },
                    rich: {

                        per0: {
                            padding: [0, 0, 0, 5],
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: '#47d6ff'
                        },
                        per1: {
                            padding: [0, 0, 0, 5],
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: '#479eff'
                        }
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var chart8 = echarts.init(document.getElementById("chart8"));
    option8 = {
        color: [ '#47d6ff', '#479eff', 'rgba(255,255,255,.5)'],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },

        series: [
            {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 3350, name: '非顶额开票'},
                    {value: 310, name: '顶额开票'}

                ],
                label: {
                    fontSize: 13,
                    color: '#333',
                    formatter: function(param) {
                        return param.name + '{per' + param.dataIndex + '|' + param.percent.toFixed(0) + '%}';
                    },
                    rich: {

                        per0: {
                            padding: [0, 0, 0, 5],
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: '#47d6ff'
                        },
                        per1: {
                            padding: [0, 0, 0, 5],
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: '#479eff'
                        }
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var chart9 = echarts.init(document.getElementById("chart9"));
    option9 = {

        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                var str = ''; //声明一个变量用来存储数据
                var a = params[0],b=params[1];
                var fn = function(p){
                    return p.value > 0 ? p.value : -p.value
                }
                var a1 = a.seriesName+": "+fn(a)+"万元";
                var b1 = b.seriesName+": "+fn(b);
                str = a1 + '</br>' + b1 +'万元';
                return str;
            }
        },
        legend: {
            //位置需要与color对应，方可得到相应颜色
            data: ['进项开票金额', '销项开票金额']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'单位：万元',
                axisLabel:{
                    formatter:function(v){
                        return v>0?v:-v;
                    }
                }
            }
        ],
        series: [
            {
                name: '进项开票金额',
                type: 'bar',
                stack: '总量',
                barWidth: 25,
                color: "#F46060" ,
                data: [-180, -262, -201, -154, -110, -230, -110,-180, -262, -201, -154, -110]
            },
            {
                name: '销项开票金额',
                type: 'bar',
                stack: '总量',
                barWidth: 25,
                color:"#20A8D8",
                data: [150, 232, 201, 154, 190, 330, 410,150, 232, 201, 154, 190]
            }

        ]
    };



    chart1.setOption(option1);
    chart2.setOption(option2);
    chart3.setOption(option3);
    chart4.setOption(option4);
    chart5.setOption(option5);
    chart6.setOption(option6);
    chart7.setOption(option7);
    chart8.setOption(option8);
    chart9.setOption(option9);
    $(window).resize(function () {
        chart1.resize();
        chart2.resize();
        chart3.resize();
        chart4.resize();
        chart5.resize();
        chart6.resize();
        chart7.resize();
        chart8.resize();
        chart9.resize();
    });

    //原html js
    if (!Array.prototype.find) {
        Array.prototype.find = function (callback) {
            return callback && (this.filter(callback) || [])[0];
        };
    }

    //load
    var figure = {};
    $(function () {

        $.getJSON("../json/gltp33.json", function (res) {
             myloading.close();
             addDefNum(res.data.defNum);
             initMap(res.data);
        });


        //保存默认数值
        function addDefNum(list) {
            //一级企业数量
            $("#num1").attr("data-num", list[0] || 0);
            //二级企业数量
            $("#num2").attr("data-num", list[1] || 0);
        }

        //右侧滑条
        var rangeBox = {
            //滑条总高度
            rangeDomHeight: 200 - 14,
            //当前的滑条移动位置
            range: 57.7,
            init: function () {
                var isDown = false;
                var self = this;
                var range = self.range;
                var newRange = 0; //画布移动后的坐标
                var enterY = 0; //点击时的坐标
                $(".range-content").on("mousedown", function (e) {
                    isDown = true;
                    enterY = e.pageY;
                    range = $(".range-select").height();
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                });
                $(window).on("mousemove", function (e) {
                    if (isDown) {
                        var range_h = self.rangeDomHeight;
                        newRange = range + e.pageY - enterY;
                        if (newRange < 0) {
                            newRange = 0;
                        }
                        if (newRange > range_h) {
                            newRange = range_h;
                        }
                        self.setRangeCss(newRange);
                        figure.scaleMap(self.getScaleByRange(newRange));
                        // self.moveNodes(op.enterPoint, getScaleByRange(newRange))
                    }
                }).on("mouseup", function () {
                    if (isDown) {
                        isDown = false;
                        self.range = newRange
                    }
                });
                self.setScaleVal(1);
            },
            setScaleVal: function (scale) {
                var min = 0.1, max = 3, rangeDomHeight = 200 - 14;
                var range = (scale - min) / (max - min) * rangeDomHeight;
                this.setRangeCss(range)
            },
            getRangeByScale: function (scale) {
                var min = 0.1, max = 3, rangeDomHeight = 200 - 14;
                var range = (scale - min) / (max - min) * rangeDomHeight;
                return range;
            },
            getScaleByRange: function (range) {
                var min = 0.1, max = 3;
                this.scale = range / this.rangeDomHeight * (max - min) + min;
                return this.scale;
            },
            //设置滑块值-dom
            setRangeCss: function (top) {
                $(".range-content").css({
                    top: top + 'px'
                });
                $(".range-select").css({
                    height: top + 'px'
                });
            }
        };
        rangeBox.init();

        //居中
        function svgCenter(figure) {
            var rbox = figure.root.rbox();
            //画布宽度
            var canvasWidth = rbox.width;
            //浏览器宽度
            var w = $(document).width();
            //居中
            figure.root.translate(w / 2 - rbox.cx);
            //缩放, 100为左右留白距离
            var scale = (w - 100) / canvasWidth;
            figure.scaleMap(scale);
            //设置滑块数据
            rangeBox.setScaleVal(scale);
        }

        // addDefNum(res.data.defNum);
        // initMap(res.data);

        //初始化
        function initMap(obj) {
            var nodes = obj.nodes;
            var links = obj.links;
            // var width = $("#svgBox").width();
            // var height = $("#svgBox").height();

            $.each(nodes, function () {
                this._x = this.x;
                this._y = this.y;
            });
            figure = new Figure(SVG, {
                //父级容器
                $box: $("#svgBox"),
                //是否可滚轮缩放
                isScale: true,
                nodes: nodes,
                links: links,
                //一级节点和根节点之间的距离
                oneLevelSpace: 700,
                //二级节点和一级节点之间的距离
                twoLevelSpace: 200,
                //一级节点 高度
                oneLevelHeight: 90,
                //二级节点 高度
                twoLevelHeight: 100,
                //一级连线上文字，x偏移量
                textOffset: 100,
                //根节点typeId为root
                //类型id,必填项 [一级进项 typeId,一级销项 typeId,...]
                typeList: ["01", "02", "03", "04", "equal"],
                //团伙typeId -- 判断是否为团伙类型节点
                isTypeEqual: function (node) {
                    return node.typeId === "equal";
                },
                //节点颜色
                nodeColorByTypeId: function (typeId, item) {
                    var color = "#3ba1f4";
                    if (typeId === "01") {  //一级进项
                        color = "#ea8d26"
                    } else if (typeId === "02") {//一级销项
                        color = "#14cbbb"
                    } else if (typeId === "03") {//二级进项
                        color = "#884e37"
                    } else if (typeId === "04") {//二级销项
                        color = "#7EC0EE"
                    } else if (typeId === "equal") {//团伙
                        color = "#8162ec"
                    } else if (typeId === "root") {//目标企业
                        //color = "#FF367D"
                        color = "#148ee3"
                    }
                    return color;
                },
                //图例 类型文本格式化
                legendNodeTypeFormatter: function (item) {
                    var txt = item.typeName;
                    var n_list = obj.number;
                    var tem = n_list.find(function (p) {
                        return p.typeId === item.typeId;
                    })
                    if (tem) {
                        txt += "(" + tem.num + ")";
                    }
                    return txt;
                },
                //连接线样式
                linksStyle: [
                    {name: "金额 > 1000万", typeId: "01", cls: "node-link-01", legendShow: true, arrow: true},
                    {name: "金额 > 100万", typeId: "02", cls: "node-link-02", legendShow: true, arrow: true},
                    {name: "金额 < 100万", typeId: "03", cls: "node-link-03", legendShow: true, arrow: true},
                    {
                        name: "团伙连线",
                        typeId: "equal",
                        cls: "node-link-equal-01",
                        legendShow: false,
                        arrow: true,
                        arrowId: "#arrowEqual_1"
                    },
                    {
                        name: "团伙连线",
                        typeId: "equal2",
                        cls: "node-link-equal-02",
                        legendShow: false,
                        arrow: true,
                        arrowId: "#arrowEqual_2"
                    },
                    {
                        name: "团伙连线",
                        typeId: "equal3",
                        cls: "node-link-equal-03",
                        legendShow: false,
                        arrow: true,
                        arrowId: "#arrowEqual_3"
                    }
                ],

                //连接线上的文本
                lineText: function (link) {
                    var txt = link.properties.role;
                    if (link.properties.shouldCapi) {
                        txt += ' ' + link.properties.shouldCapi + ' ( ' + link.properties.stockPercent + '% )'
                    }
                    return txt;
                },
                //连接线上的文本颜色
                lineTextColor: function (text, link) {
                    var color = "#333";
                    if (text.match(/同法人/)) {
                        color = "#ff6300";
                    } else if (text.match(/同办税员/)) {
                        color = "#ff6300";
                    } else if (text.match(/同财务负责人/)) {
                        color = "#ff6300";
                    }
                    return color
                },
                //滚轮缩放事件
                mousewheel: function (scale) {
                    rangeBox.setScaleVal(scale);
                },
                //节点点击事件
                nodeClick: function (item) {
                    // alert("节点点击事件")
                    console.log("节点点击事件", item)
                    // item.name = item.properties.name;
                    showInfo(item.data)
                },
                //节点双击事件
                nodeDbClick: function (item) {
                    alert("双击事件")
                    console.log('双击事件', item);
                },
                lineClick: function (link) {
                    console.log('线点击事件', link);
                    showInfo(link.data)
                },
                //关闭信息面板事件
                celNodeClick: function (item) {
                    $(".left-tip-panel").hide();
                }
            });

            //清空
            // figure.root.clear()
            //居中
            svgCenter(figure)
        }

        var $box = $(".left-tip-panel");

        //显示信息
        function showInfo(item) {
            var $info = $box.find(".info-panel-1");
            if (item.source) {
                //填入信息
                var companyCallback = function () {
                    //公司
                    $box.find(".info-panel-2").hide();
                    $box.find(".info-panel-1").show();

                }

                if ($box.is(":hidden")) {
                    companyCallback();
                    $box.fadeIn();
                } else {
                    $box.fadeOut(250, function () {
                        companyCallback();
                        $box.fadeIn();
                    });
                }

                chart1.resize();
                chart2.resize();
                chart3.resize();
                chart4.resize();

            } else {
                $info = $box.find(".info-panel-2");
                //填入信息
                var perCallback = function () {
                    //个人
                    $box.find(".info-panel-1").hide();
                    $box.find(".info-panel-2").show();
                };
                if ($box.is(":hidden")) {
                    perCallback();
                    $box.fadeIn();
                } else {
                    $box.fadeOut(250, function () {
                        perCallback();
                        $box.fadeIn();
                    });
                }

                chart5.resize();
                chart6.resize();
                chart7.resize();
                chart8.resize();
                chart9.resize();
            }
        }


        //公司 tabs
        var $comTabList = $(".company-info .com-tabs li");
        $comTabList.on("click", function () {
            var $el = $(this);
            var idx = $comTabList.index($el);
            $comTabList.removeClass('active').eq(idx).addClass('active');
            $(".tabs-box").hide().eq(idx).show();
            figure.infoPanelEvent = true;
            return false;
        });

        //关闭
        $box.find(".head-close").on("click", function () {
            $box.fadeOut(250);
            figure.hoverParam.isActive = false;
            figure.celClickHover(figure.hoverParam.item);
        });

        //放大
        $(".op-btn-plus").on("click", function () {
            var scale = figure.plus();
            rangeBox.setScaleVal(scale);
        });
        //缩小
        $(".op-btn-minus").on("click", function () {
            var scale = figure.minus();
            rangeBox.setScaleVal(scale);
        });
        //重置
        $(".op-btn-refresh").on("click", function () {
            figure.reset();
            rangeBox.setScaleVal(1);
        });
        // 全屏事件
        var fullscreen = false;
        $(".op-btn-expand").on("click", function () {
            var element = document.documentElement;
            // 判断是否已经是全屏
            // 如果是全屏，退出
            if (fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                $(this).find("i").removeClass("fa-compress");
                $(this).find("p").text("全屏");
            } else {    // 否则，进入全屏
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
                $(this).find("i").addClass("fa-compress");
                $(this).find("p").text("退出");
            }
            // 改变当前全屏状态
            fullscreen = !fullscreen;
        });


        // 监听全屏事件
        window.onresize = function () {
            if (!checkFull()) {
                $(".op-btn-expand").find("i").removeClass("fa-compress");
                $(".op-btn-expand").find("p").text("全屏");
                fullscreen = false;
            }
        }

        function checkFull() {
            var isFull = document.fullscreen || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
            if (isFull === undefined) {
                isFull = false;
            }
            return isFull;
        }


        //提示框
        var modal = {
            $el: $(".show-tip-panel"),
            close: function () {
                this.$el.hide();
            },
            confirm: function (msg, ok, cel) {
                var self = this;
                this.$el.css({
                    width: 450,
                    height: 170
                })
                this.$el.find(".detail-wrap").html(msg);
                //close
                this.$el.find(".head-close").off("click").on("click", function () {
                    self.close();
                })
                //cel
                this.$el.find(".foot-wrap button").eq(0).off("click").on("click", function () {
                    cel && cel.call(self, this)
                })
                //ok
                this.$el.find(".foot-wrap button").eq(1).off("click").on("click", function () {
                    ok && ok.call(self, this)
                })
                this.$el.fadeIn();
            }
        }


        //搜索面板收起和展开事件
        $("#js_arrow").on("click", function () {
            $(".search-box").toggleClass("search-box-hide")
        })

        //勾选核心团伙, 则法人、财务负责人、办税人员全选
        $("#checkbox1").on("change", function () {
            if (this.checked) {
                $("#checkbox2").prop("checked", true);
                $("#checkbox3").prop("checked", true);
                $("#checkbox4").prop("checked", true);
            }
        })
        //法人、财务负责人、办税人员人任意一个取消选中，则核心企业团伙取消选中。
        $("#checkbox2,#checkbox3,#checkbox4").on("change", function () {
            if (!this.checked) {
                $("#checkbox1").prop("checked", false);
            }
        })

        //搜索事件
        window.sendSearch = function () {
            var $num1 = $("#num1"), $num2 = $("#num2");
            var n1 = +$num1.val(), n2 = +$num2.val();
            var def_n1 = +$num1.attr("data-num"), def_n2 = +$num2.attr("data-num");
            if (n1 > def_n1 || n2 > def_n2) {
                modal.confirm("展示数据量大是否继续?", function () {
                    //点击确认回调
                    this.close();
                }, function () {
                    //点击取消回调
                    this.close();
                })
            }
        }
    })
})
