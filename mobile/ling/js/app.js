
window.mjs = {};
window.define = function (name, fn) {
    console.log("define", name)
    window.mjs[name] = fn();
}
window.require = function (name, src) {
    console.log("require", name)
    if (!window.mjs[name]) {
        if (!src) {
            src = "./js/" + name + ".js";
        }
        return $.getScript(src).then(function (res) {
            return window.mjs[name];
        }, function (err) {
            console.error(err, err.toString());
            return err;
        });
    } else {
        return new Promise((resolve, reject) => {
            if (window.mjs[name]) {
                resolve(window.mjs[name]);
            } else {
                reject("load " + name + "fail!");
            }
        });
    }
}

document.addEventListener("deviceready", ready, false);

function getTemp(url, fn) {
    var xhr = new XMLHttpRequest();
    //true表示异步
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        // readyState == 4说明请求已完成
        var status = 200;
        // if (xhr.responseURL.match(/^file:/)) {
        //     status = 0;
        // }
        if (xhr.readyState == 4 && (xhr.status == status || xhr.responseURL.match(/^file:/)) || xhr.status == 304) {
            fn.call(this, xhr.responseText);
        }
    };
    xhr.send();
}

function loadComponent(resolve, opt) {
    var jsModule = require(opt.name, opt.jsSrc);
    getTemp(opt.htmlSrc, function (res) {
        jsModule.then(function (module) {
            Object.assign(module, Vue.compile(res));
            module.name = opt.name;
            resolve(module);
        }, function (e) {
            console.log("loadComponent catch", e, e.toString());
        })
    })
}

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => {
        console.info("router", err)
    })
};

//路由列表
const router = new VueRouter({
    routes: [
        {
            path: '/tab',
            component: {
                templateUrl: "../pages/tabs.html"
            }
        },
        {
            path: '/index',
            component: function (resolve) {
                loadComponent(resolve, {
                    name: "index",
                    jsSrc: "./js/index.js",
                    htmlSrc: "./pages/index.html"
                });
            }

        },
        {
            path: '/ling',
            component: {
                templateUrl: "../pages/lingling.html"
            }
        },
        {
            path: '/detail/:bookId',
            component: {
                templateUrl: "../pages/detail.html"
            }
        },
        {
            path: '/mulu/:bid',
            component: {
                templateUrl: "../pages/mulu.html"
            }
        },
        {
            path: '/error',
            component: {
                templateUrl: "../pages/error.html"
            }
        },
        {
            path: '/yuedu/:bid/:cid/:typeId',
            params: {
                typeId: -1
            },
            component: {
                templateUrl: "../pages/yuedu.html"
            }
        },
        {

            path: '/sort',
            component: function (resolve) {
                loadComponent(resolve, {
                    name: "sort",
                    jsSrc: "./js/sort.js",
                    htmlSrc: "./pages/sort.html"
                });
            }
        },
        {
            path: '/sortBook/:sortId',
            component: {
                templateUrl: "../pages/sortList.html"
            }
        },
        {
            path: '/books',
            component: function (resolve) {
                loadComponent(resolve, {
                    name: "books",
                    jsSrc: "./js/books.js",
                    htmlSrc: "./pages/books.html"
                });
            }
        },
        {
            path: '/pathConfig',
            component: function (resolve) {
                loadComponent(resolve, {
                    name: "pathConfig",
                    jsSrc: "./js/pathConfig.js",
                    htmlSrc: "./pages/pathConfig.html"
                });
            }
        },
        {
            path: '/pathAdd/:id?',
            component: function (resolve) {
                loadComponent(resolve, {
                    name: "pathAdd",
                    jsSrc: "./js/pathAdd.js",
                    htmlSrc: "./pages/pathAdd.html"
                });
            }
        },
        {
            path: '/search/:p',
            component: {
                templateUrl: "../pages/search.html"
            }
        },
        {
            path: '/setting',
            component: function (resolve) {
                loadComponent(resolve, {
                    name: "setting",
                    jsSrc: "./js/setting.js",
                    htmlSrc: "./pages/setting.html"
                });
            }
        }, {
            path: '/localStorage',
            component: {
                templateUrl: "../pages/localStorage.html"
            }
        },
    ]
});

function initApp() {
    // Vue.use(Vuex);
    // Vue.use(VueRouter);
    let vm = new Vue({
        el: "#app",
        router,
        store,
        mixins: [mixin],
        computed: {
            tabIdx() {
                let tabIdx = store.state.tabIdx;
                this.changeTab(tabIdx);
                return tabIdx
            }
        },
        data: {
            //  tabIdx: 0
        },
        methods: {
            toTab(tabIdx) {
                store.commit("changTabIdx", tabIdx);
            },
            changeTab(tabIdx) {
                router.push(store.state.tabName);
            },
            showExit() {
                this.$modal.confirm("确认退出吗！", {
                    success: function () {
                        navigator.app.exitApp();
                    }
                })
            }
        },
        created() {

        },
        mounted() {
            console.log("start app")
        }
    });

    return vm;
}

function ready() {
    console.log(111,"ready")
    let vm = initApp();
    window.vm = vm;
    //监听物理返回按键
    document.addEventListener("backbutton", function () {
        let list = router.getMatchedComponents();
        if (list.length) {
            if (list[0].name === "index") {
                vm.showExit();
            } else {
                //是否为主菜单
                if (list[list.length - 1].name === store.state.tabName) {
                    vm.toTab(0);
                } else {
                    router.push("/" + store.state.tabName);
                }
            }
        }
    }, false);
    // 获取视图原始高度
    let screenHeight = document.body.offsetHeight;
    // 为window绑定resize事件
    window.onresize = function () {
        let nowHeight = document.body.offsetHeight;
        if (nowHeight < screenHeight) {
            $(".yd-tabs").hide();
        } else {
            $(".yd-tabs").show();
        }
    }

}
