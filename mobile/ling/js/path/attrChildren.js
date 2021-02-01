define("attrChildren", function () {

    return {
        //mixins: [mixin],
        props: {
            value: {
                type: Array
            }
        },
        data() {
            return {

                list: this.value,
                //属性类型
                attrTypeList: ['text', 'attr', 'bookImg'],
            }
        },
        methods: {


            addRule() {
                this.m.rule.push(
                    // {key: "match", val: "/\d/", idx: 0}
                    {key: "replace", val: "/", val2: ""}
                );
            }

        },
        created() {
            //  this.getData();
        },
        mounted() {
        },
        components: {
            ruleChildren: function (resolve) {
                loadComponent(resolve, {
                    name: "ruleChildren",
                    jsSrc: "./js/path/ruleChildren.js",
                    htmlSrc: "./pages/path/ruleChildren.html"
                });
            }
        }
    };
});








