define(["angular"], function (angular) {
    arbitrationEdit.$inject = ["$scope", "xmAjax", "$stateParams", "$state", "dialog"];
    function arbitrationEdit($scope, xmAjax, $stateParams, $state, dialog) {

        $scope.activeType = 0;

        $scope.getType = function (typeId) {
            return $scope.activeType == typeId ? 'active' : "";
        };

        $scope.$watch('activeType', function (val, oldVal) {
            console.log(val)
        });

        $scope.editStyle={
            width:"640px",
            height:"480px",
            marginLeft: "-320px",
            marginTop:"-240px"
        };

        $scope.svgStyle={
            width:"640px",
            height:"480px"
        }


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
                        scope.activeType = Array.prototype.indexOf.apply(ele.children(), [node]);
                    });
                });
            }
        }
    }

    // controller
    angular.module("webs").register.controller("inlineEdit", arbitrationEdit);

    angular.module("webs").register.directive("menuEvent", menuEvent);
});