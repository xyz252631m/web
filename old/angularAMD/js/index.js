define(["angular"], function (angular) {
    arbitrationEdit.$inject=["$scope","xmAjax","$stateParams","$state","dialog"];
    function arbitrationEdit($scope,xmAjax,$stateParams,$state,dialog) {
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
    // controller
    angular.module("webs").register.controller("index",arbitrationEdit);
});