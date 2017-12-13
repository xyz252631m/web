require.config({
    // baseUrl:'lib',

    paths: {
        'vue': '../../vue.min'
    }
});

require(['vue','../components/app'],function(Vue,App){
 new Vue({
            el: '#app',
            // router,
            render: h => h(App)
        }).$mount('#app')
})