define("design", function () {
    console.log("this is design");
    return {
        data() {
            return {
                isEdit: false,
                //显示 - 弹层
                showLayer:false,
            }
        },
        methods: {
            edit() {

            },
            del() {

            },
            toIndex() {
                console.log(this)
                this.$store.commit("changTabIdx", 0);
                // console.log(this,this.$router.push("/index"))
            },
            toSetting() {
                this.$router.push("/setting");
            },
            //创建
            showCreate(){
                console.log(this.$modal.fromComponent)
               this.showLayer = true;
               let a= this.$modal.fromComponent({
                    template:"<div>234</div>"
                },{title:'title',theme:"",destroyOnHide:true,onHide:false});
                console.log(a)
                a.then(function(r){
                    r.show();
                })

                // this.$modal.fromComponent(
                // getComponent({
                //     name: "typeList",
                //     jsSrc: "./js/components/typeList.js",
                //     htmlSrc: "./pages/components/typeList.html"
                // }),
                // {title:'23',theme:"",destroyOnHide:true,onHide:false})
            }
        },
        created() {

        },
        mounted() {
            console.log("mounted books")
        },
        components: {
            // typeList: getComponent({
            //     name: "typeList",
            //     jsSrc: "./js/components/typeList.js",
            //     htmlSrc: "./pages/components/typeList.html"
            // })

        }
    };
});







