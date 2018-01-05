define(["angular"], function (angular) {
    arbitrationEdit.$inject = ["$scope", "xmAjax", "$stateParams", "$state", "dialog"];
    function arbitrationEdit($scope, xmAjax, $stateParams, $state, dialog) {


        $scope.editObj = {
            activeType: 0,
            lineList: [],
            ellipseList: [],
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
    }


    menuEvent.$inject = ["xmElement", "$parse"];
    function menuEvent(xmElement, $parse) {
        return {
            scope: false,
            link: function (scope, ele, attr, ctrl) {
                ele.children().bind("click", function () {
                    var node = this;
                    scope.$apply(function () {
                        scope.editObj.activeType = Array.prototype.indexOf.apply(ele.children(), [node]);
                    });
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

                var isDown = false, moveIdx = 0, x, y, offsetX, offsetY, x1, y1, item;
                ele.bind("mousedown", function (e) {
                    isDown = true;
                    ele.css("cursor", "default");
                    console.log(e);
                    x = e.x;
                    y = e.y;
                    offsetX = e.offsetX;
                    offsetY = e.offsetY;
                    scope.$apply(function () {
                        switch (scope.editObj.activeType) {
                            case 2:
                                item = {
                                    type: 2,
                                    x1: e.offsetX,
                                    y1: e.offsetY,
                                    x2: e.offsetX,
                                    y2: e.offsetY
                                };
                                break;
                            case 5://圆
                                item = {
                                    type: 5,
                                    rx: 0,
                                    ry: 0,
                                    cx: e.offsetX,
                                    cy: e.offsetY
                                };
                                break;
                        }
                    });
                });

                angular.element(document).bind("mouseup", function (e) {
                    x1 = e.x;
                    y1 = e.y;
                    isDown = false;
                    moveIdx = 0;
                    scope.$apply(function () {

                    });
                });

                angular.element(document).bind("mousemove", function (e) {
                    if (isDown) {
                        switch (scope.editObj.activeType) {
                            case 2://直线
                                scope.$apply(function () {
                                    item.x2 = e.offsetX;
                                    item.y2 = e.offsetY;
                                    if (!moveIdx) {
                                        if (item.x1 == item.x2 && item.y1 == item.y2) {

                                        } else {
                                            scope.editObj.lineList.push(item);
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
                                    if (!moveIdx) {
                                        if (dx == 0 && dy == 0) {

                                        } else {
                                            scope.editObj.ellipseList.push(item);

                                            //e.target.getBoundingClientRect()
                                            moveIdx = 1;
                                        }
                                    }
                                });
                                break;
                        }
                    }
                })
            }
        }
    }

    svgShape.$inject = ["xmElement", "$parse"];
    function svgShape(xmElement, $parse) {
        return {
            link: function (scope, ele, attr, ctrl) {
                scope.$watch(attr.svgShape, function (m) {
                    switch (m.type) {
                        case  2:
                            ele.attr("x1", m.x1).attr("y1", m.y1).attr("x2", m.x2).attr("y2", m.y2);
                            break;
                        case  5:
                            ele.attr("rx", m.rx).attr("ry", m.ry).attr("cx", m.cx).attr("cy", m.cy);
                            break
                    }

                }, true);
            }
        }
    }

    // controller
    angular.module("webs").register.directive("svgShape", svgShape);
    angular.module("webs").register.directive("menuEvent", menuEvent);
    angular.module("webs").register.directive("editPanel", editPanel);
    angular.module("webs").register.controller("inlineEdit", arbitrationEdit);

});