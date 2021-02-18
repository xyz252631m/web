define("typeList", function () {
    console.log("this is typeList");
    return {
        data() {
            return {
                list: [
                    {val: 'function', txt: "函数(fn)"},
                    {val: 'let', txt: "变量(let)"},
                    {val: 'const', txt: "常量(const)"},
                ]
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
            }
        },
        created() {

        },
        mounted() {
            console.log("mounted typeList")
        }
    };
});







