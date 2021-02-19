define("design", function () {
    console.log("this is design");
    return {
        data() {
            return {
                //显示 - 弹层
                showLayer: false,
                //当前类型
                selectType: "init",
                //当前选中项
                selectItem: null,
                typeList: []
            }
        },
        methods: {
            async getListByType(type) {
                let tool = await require("vueTool");
                this.typeList = tool.typeMap[type] || [];
            },
            typeOp(val) {

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
            showCreate() {
                this.showLayer = true;
                // let a = this.$modal.fromComponent({
                //     template: "<div>234</div>"
                // }, {title: 'title', theme: "", destroyOnHide: true, onHide: false});
                // console.log(a)
                // a.then(function (r) {
                //     r.show();
                // })

            }
        },
        created() {
            this.getListByType(this.selectType);
            console.log(12, this.typeList)
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







