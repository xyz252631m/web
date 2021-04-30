/**
 * Created by admin on 2018/2/11.
 */
(function () {
    //动画类型
    var animate_list = {
        option: [
            "bounceIn",
            "bounceInUp",
            "bounceInRight",
            "bounceInLeft",
            "bounceInDown",
            "fadeIn",
            "fadeInDown",
            "fadeInDownBig",
            "fadeInLeft",
            "fadeInLeftBig",
            "fadeInRight",
            "fadeInRightBig",
            "fadeInUp",
            "fadeInUpBig",
            "flipInX",
            "flipInY",
            "lightSpeedIn",
            "rollIn",
            "rotateInDownLeft",
            "rotateInDownRight",
            "rotateInUpLeft",
            "rotateInUpRight",
            "zoomIn",
            "zoomInDown",
            "zoomInLeft",
            "zoomInRight",
            "zoomInUp"
        ]
    };
    var isAnRun = 0;
    var imgSwitch = {
        $elem:null,
        index: 0,
        inter:0,
        domList:[],
        autoRun:true,
        time:3000,
        an: {
            in: "fadeInLeft",
            out: "fadeOutLeft"
        },
        random:true,//是否随机
        init: function (option) {
            $.extend(this, option);
            this.$elem = $(".img-box");
            this.$list = $(".img-box li");
            if(this.$list.length<=1){
                return;
            }
            this.$spanList =  $(".img-btn span");
            this.domList =[null,this.$list.eq(0),this.$list.eq(1)];
            if (this.random) {
                this.randomCls(); //随机更换下一次切换效果
            }
            this.setInter();
        },
        randomCls:function () {
            var list = animate_list.option;
            var len = list.length, tem = len / 10;
            var num = parseInt((Math.random() * 10) * tem);
            this.an = {
                in: list[num]
            }
        },
        setSpan:function () {
          var idx = this.index;
            this.$spanList.removeClass("active").eq(idx).addClass("active");
        },
        next: function () {
            var self = this;
            if (isAnRun == 1) {
                return;
            }
            this.index++;
            if (this.index == this.$list.length) {
                this.index = 0;
            }
            this.domList[2] = this.getDom(this.index, 1);
            this.domList[2].css({
                opacity: "1",
                "z-index": 103
            }).addClass(this.an.in);
            this.setSpan();
            clearInterval(this.inter);
            isAnRun = 1;

            var callback = function () {
                var list = self.$list, idx = self.index;
                self.domList[1].removeClass(self.an.in).removeAttr("style").removeClass("active-item");
                self.domList[1].css({
                    opacity: "0"
                });
                self.domList[2].removeClass(self.an.in).removeAttr("style").addClass("active-item");
                self.getDom(idx, 1);
                self.domList[1] = self.$elem.find(".active-item").eq(0);
                self.setInter();
                isAnRun = 0;
                if (self.random) {
                    self.randomCls(); //随机更换下一次切换效果
                }
            };
            setTimeout(callback, 1000);
        },
        setInter : function () {
            if (this.autoRun) {
                var self = this;
                this.inter = setInterval(function () {
                    self.next();
                }, this.time)
            }
        },
        getDom: function (idx, isNext) {
            var list = this.$list;
            if (isNext) {
                if (idx == list.length) {
                    idx = 0;
                }
            } else {
                if (idx == -1) {
                    idx = list.length - 1;
                }
            }
            return list.eq(idx);
        },
        toIndex : function (idx) {
            var list = this.$list;
            if (idx >= list.length || this.index == idx) {
                return;
            }
            this.getDom(idx);
            this.index = idx - 1;
            this.next();
        }
    };
    
    function Carousel(option) {
        var def = {
            elem:null,              //元素
            autoRun:true,           //是否自动切换
            time:3000,              //自动切换---间隔时间
            random:true,            //是否随机
            inCls:"fadeInLeft",     //入场动画效果
            outCls:"fadeOutLeft"    //出场动画效果
        }
        var opts = $.extend({},def,option)


    }
    Carousel.prototype.toIndex=function (idx) {

    };


    $(function () {
        //图片轮播设置
        imgSwitch.init({
            autoRun:true,//是否自动运行
            time:5000 , //间隔3s切换到下一张
            an: {
                in: "fadeInRight"    //切换动画名称
            },
            random:true//动画是否随机，如果为true则动画名称项无效
        });
        var $span = $(".img-btn span");
        $span.on("click", function () {
            var idx = $span.index(this);
            imgSwitch.toIndex(idx);
        })

    })


})();