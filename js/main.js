var isExitJson = (typeof (JSON) !== 'undefined');
var isIE7 = navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i) == "7.";
// isIE7=true
require.config({
    baseUrl: '/web/js/',
    urlArgs: 'v=1.0.0',
    paths: {
        jquery: ['http://apps.bdimg.com/libs/jquery/1.11.1/jquery.min', 'jquery-1.11.1.min'],
        json2: 'json2',
        domReady: 'domReady',
        angular: isIE7 ? 'angular-1.2.20/angular.min' : "angular/angular.min",
        angularAMD: 'angular/angularAMD.min',
        angularCSS: 'angular/angular-css.min',
        'uiRoute': 'angular/angular-ui-router.min',
        date: 'My97DatePicker/WdatePicker',
        flowerDialog: 'lib/flower-dialog',
        extend: "lib/extend",
    },
    shim: {
        'angular': {
            exports: "angular",
            deps: [isExitJson || 'json2'],
            init: function () {
                //inIt angular module
                window.ngModule = function (moudlename, module) {
                    //IE 7
                    if (isIE7) {
                        return angular.module(moudlename, module || []).config(function ($sceProvider) {
                            $sceProvider.enabled(false);
                        });
                    } else {
                        return angular.module(moudlename, module || []);
                    }
                }
            }
        },
        'angularAMD': {
            deps: ["angular"]
        },
        'angularCSS': {
            deps: ["angular"]
        },
        'extend': {
            deps: ["angular"]
        },
        'flowerDialog': {
            deps: ["angular"]
        },
        'uiRoute': {
            exports: "ui-router",
            deps: ["angular"]
        }
    }
});

var htmlUrl = '../html/';
require(["angularAMD", "uiRoute", "extend", "angularCSS", "flowerDialog", "date"], function (angularAMD) {
    var app = ngModule("webs", ["ui.router", "angularCSS", "extend", "flowerDialog"]);
    var controllerNameByParams = function ($stateParams) {
        var url = "";
        if ($stateParams.ctrl) {
            url = $stateParams.ctrl;
        }
        if ($stateParams.action) {
            url += $stateParams.action.substring(0, 1).toUpperCase() + $stateParams.action.substring(1);
        }
        return url;
    }
    var getPath = function ($stateParams, type) {
        return [htmlUrl, $stateParams.module, "/", $stateParams.name, ".", type].join("");
    }
    // registerRoutes
    function registerRoutes($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise("/index");
        $stateProvider
            .state("index", angularAMD.route({
                url: "/index",
                templateUrl: function ($stateParams) {
                    return htmlUrl + "index.html";
                },
                css: function ($stateParams) {
                    return htmlUrl + "css/index.css";
                },
                resolve: {
                    loadController: ['$q', '$stateParams',
                        function ($q, $stateParams) {
                            var deferred = $q.defer();
                            require([htmlUrl + "js/index"], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }]
                },
                controllerProvider: function ($stateParams) {
                    return "index";
                }
            }))
            .state("html", angularAMD.route({
                url: '/html/:module/:ctrl/:action/:id',
                templateUrl: function ($stateParams) {
                    var url = "";
                    if ($stateParams.module) {
                        url = $stateParams.module;
                    }
                    var action = controllerNameByParams($stateParams);
                    url += "/" + action + ".html";
                    return htmlUrl + url;
                },
                css: function ($stateParams) {
                    var action = controllerNameByParams($stateParams);
                    if (/list/i.test(action)) {
                        return htmlUrl + '../css/list.css';
                    }
                    if (/edit/i.test(action)) {
                        return htmlUrl + '../css/edit.css';
                    }
                    return '';
                },
                resolve: {
                    loadController: ['$q', '$stateParams',
                        function ($q, $stateParams) {
                            var controllerName = controllerNameByParams($stateParams);
                            var deferred = $q.defer();
                            try {
                                require(["ctrl/" + controllerName], function () {
                                    deferred.resolve();
                                });
                            } catch (e) {
                                new Error("load " + controllerName + " javascript error!");
                                deferred.resolve();
                            }
                            return deferred.promise;
                        }]
                },
                controllerProvider: function ($stateParams) {
                    var controllerName = controllerNameByParams($stateParams);
                    return controllerName;
                }
            }))
            .state("p", angularAMD.route({
                url: "/p/:module/:name",
                templateUrl: function ($stateParams) {
                    return getPath($stateParams,'html');
                },
                css: function ($stateParams) {
                    return getPath($stateParams,'css');
                },
                resolve: {
                    loadController: ['$q', '$stateParams',
                        function ($q, $stateParams) {
                            var deferred = $q.defer();
                            require([getPath($stateParams,'js')], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }]
                },
                controllerProvider: function ($stateParams) {
                    return $stateParams.name;
                }
            }));
    };
    app.run(["$rootScope", "xmElement", "$state", "$stateParams", "$timeout", function ($rootScope, xmElement, $state, $stateParams, $timeout) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        // var timer;/*此处为单例（只支持一个页面一个view），如果一个页面有多个view，请修改此处代码*/
        // function startLoading() {
        //     timer = $timeout(function () {
        //         xmElement.removeClass(document.getElementById("pageLoading"), "hide");
        //     },100);
        // }
        // function endLoading(){
        //     if(timer){
        //         $timeout.cancel(timer);
        //         xmElement.addClass(document.getElementById("pageLoading"), "hide");
        //     }
        // }
        // /*add loading 名称和参数不可修改*/
        // $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //     startLoading();
        // });
        // /*remove loading*/
        // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //     endLoading();
        // });
        // $rootScope.ajaxLoadingClose=function(){
        //     $rootScope.ajaxLoading=false;
        // }
    }]);
    /*左侧收缩-展开*/
    app.directive("menuOpen", ["xmElement", function (xmElement) {
        return {
            link: function (scope, ele, attr, ctrl) {
                ele.bind("click", function () {
                    var masterLeft = document.getElementById(attr["menuOpen"]);
                    var masterRight = document.getElementById("masterRight");
                    if (xmElement.hasClass(masterLeft, "left-close")) {
                        xmElement.removeClass(masterLeft, "left-close");
                        xmElement.removeClass(masterRight, "master-right-all");
                    } else {
                        xmElement.addClass(masterLeft, "left-close");
                        xmElement.addClass(masterRight, "master-right-all");
                    }
                });
            }
        }
    }]);
    /*菜单项点击动画*/
    app.directive("menuEvent", ["xmElement", "$animate", function (xmElement, $animate) {
        return {
            link: function (scope, ele, attr, ctrl) {
                ele.children().bind("click", function () {
                    var tEle = angular.element(this);
                    if (xmElement.hasClass(tEle, "open-li")) {
                        //xmElement.removeClass(tEle,"open-li");
                        //$animate.removeClass(tEle,"open-li");
                        return;
                    }
                    xmElement.removeClass(ele.children(), "open-li");
                    xmElement.addClass(tEle, "open-li");
                });
            }
        }
    }]);
    //自定义ajax
    app.factory("xmAjax", ["$http", "dialog", "$timeout", "$rootScope", function ($http, dialog, $timeout, $rootScope) {
        function errorInfo() {
            dialog.error("请求失败！")
        }

        function startLoading() {
            return $timeout(function () {
                $rootScope.ajaxLoading = true;
            }, 200);
        }

        function endLoading(timer) {
            if (timer) {
                $timeout.cancel(timer);
                $rootScope.ajaxLoading = false;
            }
        }

        return {
            //post请求，data转为字符串
            postString: function (url, data, config) {
                var timer = startLoading();
                var c = {
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                };
                var opts = angular.extend({}, c, config);
                var promise = $http.post(url, data, opts).error(errorInfo);
                promise["finally"](function () {
                    endLoading(timer)
                });
                return promise;
            },
            //post请求，data转为json(默认)
            post: function (url, data, config) {
                var timer = startLoading();
                var promise = $http.post(url, data, config).error(errorInfo);
                promise["finally"](function () {
                    endLoading(timer)
                });
                return promise;
            },
            'get': function (url, config) {
                var timer = startLoading();
                var promise = $http.get(url, config).error(errorInfo);
                promise["finally"](function () {
                    endLoading(timer)
                });
                return promise;
            }
        }
    }])
    app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", registerRoutes]);
    angularAMD.bootstrap(app);
});