define("setting", function () {
    return {
        //mixins: [mixin],
        data() {
            return {
                pname: [],

            }
        },
        methods: {
            back() {
                this.$router.back();
            },
            myInfo() {

            },
            toPathConfig() {
                this.$router.push('pathConfig');
            }


        },
        created() {
            //  this.getData();
        },
        mounted() {
            console.log("mounted setting")
        }
    };
});








