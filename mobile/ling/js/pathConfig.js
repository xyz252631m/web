define("pathConfig", function () {

    return {
        //mixins: [mixin],
        data() {
            return {
                pname: [],
                list: []
            }
        },
        methods: {
            back() {
                this.$router.back();
            },
            myInfo() {

            },
            toPathConfig() {

            },
            async getData() {
                let tool = await require("vueTool");
                let list = JSON.parse(tool.lc.get(tool.lc.name.pathConfig)) || [];
                this.list = list;
            },

            toAdd() {
                this.$router.push("/pathAdd");
            },
            toEditPath(m) {
                this.$router.push("/pathAdd/" + m.id);
            }
        },
        created() {
            this.getData();
        },
        mounted() {
            console.log("mounted pathConfig")
        }
    };
});








