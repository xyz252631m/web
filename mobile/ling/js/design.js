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
            yuedu() {

            },
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
                this.showLayer = true;
            }
        },
        created() {

        },
        mounted() {
            console.log("mounted books")
        },
        components: {
            typeList: getComponent({
                name: "typeList",
                jsSrc: "./js/components/typeList.js",
                htmlSrc: "./pages/components/typeList.html"
            })

        }
    };
});







