//ee966633dd719e0be4048d3b2a189ca9847bfd13


// axios.defaults.withCredentials = false;
// axios.defaults.headers.common['OAUTH-TOKEN'] = token;
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';//配置请求头
//
// //添加一个请求拦截器
// axios.interceptors.request.use(function (config) {
//     // let user = JSON.parse(window.sessionStorage.getItem('token'));
//     // if (user) {
//     //     token = user.token;
//     // }
//     console.log(111,config)
//     config.headers.common['OAUTH-TOKEN'] = 'ee966633dd719e0be4048d3b2a189ca9847bfd13';
//     //console.dir(config);
//     return config;
// }, function (error) {
//     // Do something with request error
//     console.info("error: ");
//     console.info(error);
//     return Promise.reject(error);
// });


// $.post("https://api.github.com/user/repos", {token : 'ee966633dd719e0be4048d3b2a189ca9847bfd13'}, function (res) {
//     console.log(res)
// })
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

function loadComponent(opt, resolve) {
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

window.getComponent = R.curry(loadComponent)

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => {
        console.info("router", err)
    })
};

const routes = [
    {
        path: '/',
        component: function (resolve) {
            if (tool.isMobile) {
                loadComponent({
                    name: "setting",
                    jsSrc: "./js/setting.js",
                    htmlSrc: "./pages/setting.html"
                }, resolve);
            } else {
                loadComponent({
                    name: "design",
                    jsSrc: "./js/design.js",
                    htmlSrc: "./pages/design.html"
                }, resolve);
            }

        }
    },
    {
        path: '/index',
        component: getComponent({
            name: "index",
            jsSrc: "./js/index.js",
            htmlSrc: "./pages/index.html"
        })

    },
    {
        path: '/design',
        component: getComponent({
            name: "design",
            jsSrc: "./js/design.js",
            htmlSrc: "./pages/design.html"
        })
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
        component: getComponent({
            name: "sort",
            jsSrc: "./js/sort.js",
            htmlSrc: "./pages/sort.html"
        })

    },
    {
        path: '/sortBook/:sortId',
        component: {
            templateUrl: "../pages/sortList.html"
        }
    },
    {
        path: '/books',
        component: getComponent({
            name: "books",
            jsSrc: "./js/books.js",
            htmlSrc: "./pages/books.html"
        })

    },
    {
        path: '/pathConfig',
        component: getComponent({
            name: "pathConfig",
            jsSrc: "./js/pathConfig.js",
            htmlSrc: "./pages/pathConfig.html"
        })

    },
    {
        path: '/pathAdd/:id?',
        component: getComponent({
            name: "pathAdd",
            jsSrc: "./js/pathAdd.js",
            htmlSrc: "./pages/pathAdd.html"
        })

    },
    {
        path: '/search/:p',
        component: {
            templateUrl: "../pages/search.html"
        }
    },
    {
        path: '/setting',
        component: getComponent({
            name: "setting",
            jsSrc: "./js/setting.js",
            htmlSrc: "./pages/setting.html"
        })

    },
    {
        path: '/localStorage',
        component: {
            templateUrl: "../pages/localStorage.html"
        }
    },
];
//路由列表
const router = new VueRouter({
    routes:routes
});


function initApp() {
    Vue.use(Vonic.default);
    // let vm =  Vue.use(Vonic.default.app, {
    //     router: router
    // })

    // Vue.use(Vuex);
    // Vue.use(VueRouter);
    let vm = new Vue({
        el: "#app",
        router,
        store,
        mixins: [mixin],
        computed: {},
        data: {
            tabIdx: 3,
            tabItem: null,
            tabList: tool.isMobile ? all_config.tabList : []
        },
        methods: {
            toTab(item, idx) {
                this.tabIdx = idx;
                this.tabItem = item;
                store.commit("changTabIdx", idx);
                this.$router.push(item.path);
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
    console.log(111, "ready")
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
