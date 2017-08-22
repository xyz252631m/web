require.config({
    // baseUrl:'lib',

    paths: {
        'vue': '../../vue.min'
    }
});

require(['vue','./components/app.vue'],function(Vue,App){
 new Vue({
            el: '#app',
            // router,
            render: h => h(App)
        }).$mount('#app')
})