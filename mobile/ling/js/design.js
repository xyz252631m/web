
define("design", function () {
    console.log("this is design");
    return {
        data() {
            return {
                isEdit:false
            }
        },
        methods: {
            yuedu() {

            },
            edit(){

            },
            del(){

            },
            toIndex(){
                console.log(this)
                this.$store.commit("changTabIdx", 0);
                // console.log(this,this.$router.push("/index"))
            },
            toSetting(){
                this.$router.push("/setting");
            }
        },
        created() {

        },
        mounted() {
            console.log("mounted books")
        }
    };
});







