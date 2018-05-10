define(["angular"], function (angular) {
    arbitrationEdit.$inject = ["$scope", "xmAjax", "$stateParams", "$state", "dialog", "$document"];
    function arbitrationEdit($scope, xmAjax, $stateParams, $state, dialog, $document) {


        $scope.editObj = {
            activeType: 0,//  0-20 菜单  101 d
            list: [],
            select: [],//选中列表 {item:null,oldItem:null}
            borderList: [],//边框列表
            isDown: false
        };

        $scope.getType = function (typeId) {
            return $scope.editObj.activeType == typeId ? 'active' : "";
        };

        $scope.$watch('editObj.activeType', function (val, oldVal) {
            console.log(val)
        });

        $scope.editStyle = {
            width: "640px",
            height: "480px",
            marginLeft: "-320px",
            marginTop: "-240px"
        };

        $scope.svgStyle = {
            width: "640px",
            height: "480px"
        };
        //全局样式
        $scope.allStyle = {
            strokeWidth: 2,
            stroke: "#000",
            fill: "none"
        };
        //选框样式
        $scope.selectBoxStyle = {
            pointerEvents: "none",
            strokeWidth: 1
        };

        //清空选框
        $scope.clearSelect = function () {
            $scope.editObj.activeType = 0;
            $scope.editObj.selectList = [];
        }


        //stroke-linecap  stroke-linejoin="undefined"


        // //获取数据
        // xmAjax.post(window.adminBaseUrl + "/views/selectManagerArbitrationApplicaInfoById/" + $stateParams["id"]).success(function (red) {
        //     if (red) {
        //         $scope.data = red;
        //     }
        // });
        // //刷新
        // $scope.refresh=function(){
        //     $state.reload();
        // };
        // //返回列表
        // $scope.goList=function(){
        //     $state.go("html",{module:'associator',ctrl:'arbitration',action:'list',id:null});
        // };


        //键盘事件
        $document.on("keydown", function (event) {
            console.log("keydown", event.which, event.shiftKey)
            if (event.which === 13) {
                event.preventDefault();
            }
            //删除
            if (event.which === 8 || event.which === 46) {
                event.preventDefault();
            }

        });


        $scope.getSelectBorder = function (item, params) {
            //var pos = node.getBBox();
            var pos = item , ds = ($scope.allStyle.strokeWidth - $scope.selectBoxStyle.strokeWidth) / 2;
            pos.width = Math.abs(pos.x2 - pos.x);
            pos.height = Math.abs(pos.y2 - pos.y);
            var select_item = {
                type: 101,
                p1: {x: pos.x - 4, y: pos.y - 4, type: 103},
                p2: {x: pos.x - 4 + pos.width / 2, y: pos.y - 4, type: 103},
                p3: {x: pos.x - 4 + pos.width, y: pos.y - 4, type: 103},
                p4: {x: pos.x - 4 + pos.width, y: pos.y - 4 + pos.height / 2, type: 103},
                p5: {x: pos.x - 4 + pos.width, y: pos.y - 4 + pos.height, type: 103},
                p6: {x: pos.x - 4 + pos.width / 2, y: pos.y - 4 + pos.height, type: 103},
                p7: {x: pos.x - 4, y: pos.y - 4 + pos.height, type: 103},
                p8: {x: pos.x - 4, y: pos.y - 4 + pos.height / 2, type: 103},
                d: ["M", pos.x - ds, ",", pos.y - ds, "L", pos.x + pos.width + ds, ",", pos.y - ds, " ", pos.x + pos.width + ds, ",", pos.y + pos.height + ds, " ", pos.x - ds, ",", pos.y + pos.height + ds + "z"].join("")
            };
            return angular.extend(select_item, params);
        }
    }


    menuEvent.$inject = ["xmElement", "$parse"];
    function menuEvent(xmElement, $parse) {
        return {
            scope: false,
            link: function (scope, ele, attr, ctrl) {
                ele.children().bind("click", function (e) {
                    var node = this;
                    scope.$apply(function () {
                        scope.editObj.activeType = Array.prototype.indexOf.apply(ele.children(), [node]);
                    });
                    e.stopPropagation();
                });
            }
        }
    }

    editPanel.$inject = ["xmElement", "$parse"];
    function editPanel(xmElement, $parse) {
        return {
            scope: false,
            link: function (scope, ele, attr, ctrl) {
                console.log(ele)

                //moveIdx 判断是否重复添加
                var isDown = false, moveIdx = 0, x, y, offsetX, offsetY, x1, y1, item;
                ele.bind("mousedown", function (e) {
                    isDown = true;
                    ele.css("cursor", "default");
                    console.log("mdown", e, scope.editObj.activeType);
                    x = e.x;
                    y = e.y;
                    offsetX = e.offsetX;
                    offsetY = e.offsetY;
                    scope.$apply(function () {
                        var node = e.target;
                        if (node) {

                            if (node.nodeName == "svg") {

                                // x y x2 y2 为边框定位属性
                                switch (scope.editObj.activeType) {
                                    case 0:

                                        break;
                                    case 2:
                                        item = {
                                            type: 2,
                                            x: e.offsetX,
                                            y: e.offsetY,
                                            x1: e.offsetX,
                                            y1: e.offsetY,
                                            x2: e.offsetX,
                                            y2: e.offsetY
                                        };
                                        break;
                                    case 5://圆
                                        item = {
                                            type: 5,
                                            x: e.offsetX,
                                            y: e.offsetY,
                                            rx: 0,
                                            ry: 0,
                                            cx: e.offsetX,
                                            cy: e.offsetY
                                        };
                                        break;
                                }
                            }
                        }
                    });
                    e.stopPropagation();
                });
                ele.bind("mousemove", function (e) {

                    if (isDown) {


                        var dx = e.offsetX - offsetX, dy = e.offsetY - offsetY;
                        //存在选中
                        if (scope.editObj.select.length) {
                            scope.$apply(function () {
                                //移动距离val
                                var t_pos = function (list, item, oldItem, val) {
                                    angular.forEach(list, function (el) {
                                        item[el] = oldItem[el] + val;
                                    });
                                };
                                angular.forEach(scope.editObj.select, function (el, idx) {
                                    var selectItem = el.item, oldItem = el.oldItem;
                                    switch (selectItem.type) {
                                        case 2:
                                            t_pos(["x", "x1", "x2"], selectItem, oldItem, dx);
                                            t_pos(["y", "y1", "y2"], selectItem, oldItem, dy);
                                            break;
                                        case 5:
                                            t_pos(["x", "cx", "x2"], selectItem, oldItem, dx);
                                            t_pos(["y", "cy", "y2"], selectItem, oldItem, dy);
                                            break
                                    }
                                    scope.editObj.borderList = [scope.getSelectBorder(selectItem)];
                                })
                            })

                        } else {
                            //菜单
                            switch (scope.editObj.activeType) {
                                case 0: //选择----移动
                                    scope.$apply(function () {


                                    });
                                    break;
                                case 2://直线
                                    scope.$apply(function () {
                                        item.x2 = e.offsetX;
                                        item.y2 = e.offsetY;
                                        item.nodeName = "line";
                                        if (!moveIdx) {
                                            if (item.x1 == item.x2 && item.y1 == item.y2) {

                                            } else {
                                                scope.editObj.list.push(item);
                                                moveIdx = 1;
                                            }
                                        }
                                    });
                                    break;
                                case 5://圆
                                    scope.$apply(function () {
                                        var dx = e.offsetX - offsetX, dy = e.offsetY - offsetY;
                                        item.rx = Math.abs(dx) / 2;
                                        item.ry = Math.abs(dy) / 2;
                                        item.cx = offsetX + dx / 2;
                                        item.cy = offsetY + dy / 2;
                                        item.x2 = e.offsetX;
                                        item.y2 = e.offsetY;
                                        item.nodeName = "ellipse";
                                        if (!moveIdx) {
                                            if (dx == 0 && dy == 0) {

                                            } else {
                                                scope.editObj.list.push(item);
                                                //e.target.getBoundingClientRect()
                                                moveIdx = 1;
                                            }
                                        }
                                    });
                                    break;
                            }
                            console.log(scope.editObj.list)
                        }
                    }
                });


                ele.bind("mouseup", function (e) {
                    x1 = e.x;
                    y1 = e.y;
                    isDown = false;
                    moveIdx = 0;
                    scope.editObj.select = [];
                    //  scope.downSelect.item = null;
                    console.log("up", e);
                    //  var node = e.target;
                    if (item) {
                        scope.$apply(function () {
                            //添加选中item
                            console.log("ups", item)
                            switch (item.nodeName) {
                                case 'line':
                                    scope.editObj.borderList = [scope.getSelectBorder(item)];
                                    break;
                                case 'ellipse':
                                    scope.editObj.borderList = [scope.getSelectBorder(item)];
                                    break;
                                // case 'svg':
                                //     //   scope.editObj.activeType = 0;
                                //     //  scope.editObj.selectList = [];
                                //     break;
                                default:
                                    //   scope.editObj.activeType = 0;
                                    break;
                            }
                        });
                        item = null;
                    }

                });


            }
        }
    }

    //每一项 item
    svgShape.$inject = ["xmElement", "$parse"];
    function svgShape(xmElement, $parse) {
        return {
            link: function (scope, ele, attr, ctrl) {
                scope.$watch(attr.svgShape, function (m) {
                    if (m.type < 100) {
                        ele.css(scope.allStyle)
                    }
                    switch (m.type) {
                        case  2:
                            ele.attr("x1", m.x1).attr("y1", m.y1).attr("x2", m.x2).attr("y2", m.y2);
                            break;
                        case  5:
                            ele.attr("rx", m.rx).attr("ry", m.ry).attr("cx", m.cx).attr("cy", m.cy);
                            ele.css("fill", "#fff");
                            break;
                        case 101:
                            ele.attr("d", m.d);
                            break;
                        case 103:
                            ele.attr("x", m.x).attr("y", m.y);
                            break
                    }


                }, true);

                ele.bind("mousedown", function (e) {
                    var item = $parse(attr.svgShape)(scope);
                    console.log("dd", scope.downItem);
                    //var node = e.target;
                    if (item) {
                        scope.$apply(function () {
                            //添加选中item
                            switch (item.nodeName) {
                                case 'line':
                                    scope.editObj.borderList = [scope.getSelectBorder(item)];
                                    scope.editObj.select = [{item, oldItem: angular.copy(item)}];
                                    break;
                                case 'ellipse':
                                    scope.editObj.borderList = [scope.getSelectBorder(item)];
                                    scope.editObj.select = [{item, oldItem: angular.copy(item)}];
                                    break;
                                case 'svg':
                                    //   scope.editObj.activeType = 0;
                                    //  scope.editObj.selectList = [];
                                    break;
                                default:
                                    //scope.editObj.activeType = 0;
                                    break;
                            }
                        })
                    }
                });

            }
        }
    }

    //键盘事件
    svgEnter.$inject = [];
    function svgEnter(xmElement, $parse) {
        return {
            link: function (scope, ele, attr, ctrl) {

            }
        }
    }

    // controller
    angular.module("webs").register.directive("svgShape", svgShape);
    angular.module("webs").register.directive("menuEvent", menuEvent);
    angular.module("webs").register.directive("editPanel", editPanel);
    angular.module("webs").register.directive("svgEnter", svgEnter);
    angular.module("webs").register.controller("inlineEdit", arbitrationEdit);

});