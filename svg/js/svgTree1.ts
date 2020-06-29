$(function () {


    mi.define("ready", async () => {
        let SVG = await mi.preload("../svg.min.js");

        console.log("SVG",SVG)

        let citeTree = mi.preload("../js/citeTree.js");
        let {CiteTree} = await citeTree;
        // console.log("a", CiteTree)
        // console.log("axios_pm", MI.tool.axios)


        // $.get("../json/gltp.json", function (res) {
        //     console.log("Res", res)
        // })

        // $("div").on("click", "p", function (e) {
        //     console.log(789,e)
        // })


        //生成从minNum到maxNum的随机数
        function randomNum(minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    return parseInt(String(Math.random() * minNum + 1), 10);
                case 2:
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                default:
                    return 0;
            }
        }

        var nameList = ["高大山", "谢大海", "马宏宇", "林莽", "黄强辉", "章汉夫", "范长江", "林君雄", "谭平山", "朱希亮", "李四光", "甘铁生", "张伍绍祖", "马继祖", "程孝先", "宗敬先",
            "年广嗣", "汤绍箕", "吕显祖", "何光宗", "孙念祖", "马建国", "节振国", "冯兴国", "郝爱民", "于学忠", "马连良", "胡宝善", "李宗仁", "洪学智", "余克勤", "吴克俭", "杨惟义", "李文信",
            "王德茂", "李书诚", "杨勇", "高尚德", "刁富贵", "汤念祖", "吕奉先", "何光宗", "冷德友", "安怡孙", "贾德善", "蔡德霖", "关仁", "郑义贾怡孙天民", "赵大华", "赵进喜", "赵德荣", "赵德茂",
            "钱汉祥", "钱运高", "钱生禄", "孙寿康", "孙应吉", "孙顺达", "李秉贵", "李厚福", "李开富", "王子久", "刘永生", "刘宝瑞", "关玉和", "王仁兴", "李际泰", "罗元发", "刘造时", "刘乃超", "刘长胜",
            "张成基", "张国柱", "张志远", "张广才", "吕德榜", "吕文达", "吴家栋", "吴国梁", "吴立功李大江", "张石山", "王海"];

        var tagList = ['在业', '高新技术企业', '天使轮', '建筑工程企业', 'A股'];
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
                        relation.scaleMap(self.getScaleByRange(newRange));
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

        var relation = new CiteTree(SVG, {
            id: "svgBox",
            lineColor: "#ccc",
            hoverLineColor: "#3ba1f4",
            //是否弹出详细信息框
            hasDetailInfo: true,
            mousewheel: function (scale) {
                rangeBox.setScaleVal(scale);
            },
            //节点点击事件
            nodeClick: function (item) {
                console.log("click", item);
                if (item.level === 1) {
                    //第二层
                    console.log("第二层")
                }
            },
            //详细信息框显示之前触发事件
            detailInfoShowBefore: function (item, $box) {
                var $info = $box.find(".info-box-1");
                if (item.nodeType === '999') {
                    $box.find(".info-box-main").hide();
                    $box.find(".info-box-1").show();
                    $info.find("h4").text(item.name);
                    //名称简称
                    var $nameList = $info.find(".img-box span");
                    $nameList.eq(0).text(item.name[0]);
                    $nameList.eq(1).text(item.name[1]);
                    $nameList.eq(2).text(item.name[2]);
                    $nameList.eq(3).text(item.name[3]);

                    //人名、注册 等信息
                    var $ceList = $info.find(".info-list span");
                    if (!item.hasInfo) {
                        item.hasInfo = {
                            tagList: tagList[randomNum(1, tagList.length)],
                            name: nameList[randomNum(0, nameList.length)],
                            money: randomNum(10, 200) * 10,
                            date: [randomNum(1990, 2015), randomNum(1, 12), randomNum(1, 28)].join("-")
                        }
                    }
                    $info.find(".tag-list label").eq(1).text(item.hasInfo.tagList);
                    $ceList.eq(0).text(item.hasInfo.name);
                    $ceList.eq(1).text(item.hasInfo.money);
                    $ceList.eq(2).text(item.hasInfo.date);

                } else if (item.nodeType === '998') {
                    $info = $box.find(".info-box-2");
                    $box.find(".info-box-main").hide();
                    $box.find(".info-box-2").show();
                    $info.find("h4").text(item.name);
                    $info.find(".img-box span").text(item.name[0]);
                    //数字随机
                    if (!item.hasInfo2) {
                        var r_num = randomNum(0, 4);
                        item.hasInfo2 = {
                            num: [r_num + randomNum(0, 4), randomNum(0, 4), r_num, r_num + randomNum(0, 2)]
                        }
                    }
                    var $span = $info.find(".per-info-list span");
                    $span.eq(0).text(item.hasInfo2.num[0]);
                    $span.eq(1).text(item.hasInfo2.num[1]);
                    $span.eq(2).text(item.hasInfo2.num[2]);
                    $span.eq(3).text(item.hasInfo2.num[3]);
                } else {
                    return false;
                }

            }
        });
        $.get("../json/tupuData.json", function (res) {

            if (res && res.result) {
                var companyInfo = res.result;
                relation.init(companyInfo);
            }

        });
        //window.tr = relation;


        //放大
        $(".op-btn-plus").on("click", function () {
            var scale = relation.plus();
            rangeBox.setScaleVal(scale);
        });
        //缩小
        $(".op-btn-minus").on("click", function () {
            var scale = relation.minus();
            rangeBox.setScaleVal(scale);
        });
        //重置
        $(".op-btn-refresh").on("click", function () {
            relation.reset();
            rangeBox.setScaleVal(1);
        });
        // 全屏事件
        let fullscreen = false;
        // @ts-ignore
        $(".op-btn-expand").on("click", function () {
            // @ts-ignore
            let element = document.documentElement;
            // 判断是否已经是全屏
            // 如果是全屏，退出
            //@ts-ignore
            if (fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                // else if (document.webkitCancelFullScreen) {
                //     document.webkitCancelFullScreen();
                // } else if (document.mozCancelFullScreen) {
                //     document.mozCancelFullScreen();
                // } else if (document.msExitFullscreen) {
                //     document.msExitFullscreen();
                // }
                $(this).find("i").removeClass("fa-compress");
                $(this).find("p").text("全屏");
            } else {    // 否则，进入全屏
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                }
                // else if (element.webkitRequestFullScreen) {
                //     element.webkitRequestFullScreen();
                // } else if (element.mozRequestFullScreen) {
                //     element.mozRequestFullScreen();
                // } else if (element.msRequestFullscreen) {
                //     // IE11
                //     element.msRequestFullscreen();
                // }
                $(this).find("i").addClass("fa-compress");
                $(this).find("p").text("退出");
            }
            // 改变当前全屏状态
            fullscreen = !fullscreen;
        });
    })
})


