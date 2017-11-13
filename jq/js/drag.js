 //拖动方法
 var drag = {
    $target: $(".s-input"),
    $target_i: null,
    //要拖动的元素
    elem: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    },
    IsDown: false,  //是否按下(可拖动)
    isEnter: false,//是否进入目标区域
    //拖动元素
    dragElem: null,//动态创建的拖动元素
    startPoint: {   //鼠标起点(按下)坐标
        x: 0, y: 0
    },
    targetArea: {//目标区域
        x1: 0, x2: 0, y1: 0, y2: 0
    },
    //elemX elemY 要拖动元素的顶点坐标  x y 当前鼠标按下的坐标
    start: function (elemX, elemY, x, y, dragElem) {
        var self = this;
        this.elem.left = elemX;
        this.elem.top = elemY;
        this.startPoint.x = x;
        this.startPoint.y = y;
        this.dragElem = dragElem;
        this.resetTargetOffset();
        this.IsDown = true;
        dragElem.addClass("body-span").css({
            "left": (elemX + 1) + "px", "top": (elemY ) + "px"
        })
        this.$target.addClass("input-active");
        $("body").append(dragElem).on("mousemove", function (e) {
            self.move(e);
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }).on("mouseup", function () {
            self.IsDown = false;
            $("body").off("mousemove").off("mouseup");
            $(".body-span").remove();
            //插入元素
            if (self.isEnter) {
                var h = '<i></i><label>' + self.$target_i.text() + '<em>x</em></label>';
                self.$target_i.before(h);
                setListTop();
                self.resetTargetOffset();
                self.$target_i.width(0).text("");
            }
            self.$target.removeClass("input-active");
            self.isEnter = false;
        })
    },
    move: function (evt) {
        var moveX, moveY;
        if (this.IsDown) {
            moveX = this.elem.left + evt.clientX - this.startPoint.x;
            moveY = this.elem.top + evt.clientY - this.startPoint.y;
            var $span = $(".body-span");
            $span.css({
                "left": moveX + "px", "top": moveY + "px"
            });

            this.isEnter = this.isEnterTarget($span, moveX, moveY);
            if (this.isEnter) {
                //  $target.addClass("input-active");
                this.$target_i = this.targetItem($span, moveX, moveY);
            } else {
                // $target.removeClass("input-active");
            }
        }
    },
    resetTargetOffset: function () {
        var target_offset = this.$target.offset();
        this.targetArea.x1 = target_offset.left;
        this.targetArea.y1 = target_offset.top;
        this.targetArea.x2 = this.targetArea.x1 + this.$target.width();
        this.targetArea.y2 = this.targetArea.y1 + (this.$target.height() || 40);
    },
    isEnterTarget: function (elem, x, y) {
        var point_list = [{x: x, y: y}], w = elem.width(), h = elem.height();
        point_list.push({x: x + w, y: y});
        point_list.push({x: x + w, y: y + h});
        point_list.push({x: x, y: y + h});
        var isEnter = false;
        var self = this;
        $.each(point_list, function (idx, el) {
            if (el.x >= self.targetArea.x1 && el.x <= self.targetArea.x2 && el.y >= self.targetArea.y1 && el.y <= self.targetArea.y2) {
                isEnter = true;
            }
        });
        return isEnter;
    },
    targetItem: function (elem, x, y) {
        var $i_list = this.$target.find("i");
        var $item, target_i = $i_list.length - 1;
        $i_list.each(function (idx, el) {
            $item = $(el);
            var offset = $item.offset();
            //padding 14 height 25
            if (x >= offset.left && x <= offset.left + $item.width() + 14 && y >= offset.top && y <= offset.top + 25) {
                target_i = idx;
            }
        });
        $i_list.width(0).text("");
        return $i_list.eq(target_i).width(elem.width()).text(elem.text());
    }
};

//拖动
var $list = $(".tag-main-box .list span"), $target = $(".s-input");