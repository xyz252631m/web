define("pathAdd", function () {

    return {
        //mixins: [mixin],
        data() {
            return {
                id: this.$route.params.id || 0,
                name: "",
                protocol: "https",
                host: "",
                //属性类型
                attrTypeList: ['text', 'attr', 'bookImg'],
                //规则列表
                ruleTypeList: ['match', 'replace', 'split', 'join'],


                index: {
                    value: [],
                    //属性列表显示状态
                    attrShow: true,
                    //数据列表
                    listShow: true,
                    children: []
                }
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
                let obj = list.find(d => d.id === this.id);
                if (!obj) {
                    obj = this.getDefObj();
                }
                this.conventData(obj);
            },
            conventData(obj) {
                this.name = obj.name;
                this.host = obj.host;
                Object.assign(this.index, obj.index);
            },
            getJsonObj() {
                let obj = this.getDefObj();
                obj.name = this.name;
                obj.host = this.host;
                obj.id = this.id;
                Object.assign(obj.index, this.index);
                delete obj.index.attrShow;
                delete obj.index.listShow;

                return obj;
            },
            getDefObj() {
                let obj = {
                    name: "默认",
                    id: (new Date()).getTime(),
                    host: "xiao",
                    index: {
                        type: "array",
                        path: ".article",
                        not: "0",
                        value: [
                            {
                                name: "bigTitle",
                                type: "text",
                                path: ".title a"
                            },

                            {
                                name: "typeId",
                                type: "attr",
                                attr: "href",
                                path: ".title a",
                                rule: [
                                    {key: "match", val: "/\d/", idx: 0},
                                    {key: "replace", val: "/", val2: ""},
                                    {key: "split", val: "-"},
                                    {key: "join", val: "/"}
                                ],

                            },
                            {
                                name: "imgSrc",
                                type: "bookImg",
                                attr: "data-src",
                                path: ".block_img img"
                            },
                            {
                                name: "bookId",
                                type: "attr",
                                attr: "href",
                                path: "a",
                                rule: [
                                    {key: "match", val: "/\d/", idx: 0},
                                ]
                            },
                            {
                                name: "title",
                                type: "text",
                                path: ".block_txt h2"
                            }

                        ],
                        children: [
                            {
                                type: "array",
                                path: "ul li",
                                value: [
                                    {
                                        name: "sort",
                                        type: "text",
                                        path: "a",
                                        eq: 0
                                    },
                                    {
                                        name: "title",
                                        type: "text",
                                        path: "a",
                                        eq: 1
                                    },
                                    {
                                        name: "bookId",
                                        type: "attr",
                                        attr: "href",
                                        path: "a",
                                        eq: 1,
                                        rule: [
                                            {key: "match", val: "/\d/", idx: 0},
                                        ]
                                    },
                                ]


                            }
                        ]
                    }
                };
                return obj;
            },
            add() {
                this.$router.push("/pathAdd")
            },
            async sumbit() {
                let tool = await require("vueTool");
                let obj = this.getJsonObj();
                let list = JSON.parse(tool.lc.get(tool.lc.name.pathConfig)) || [];
                let idx = list.findIndex(d => d.id === obj.id);
                if (idx >= 0) {
                    list.splice(idx, 1, obj);
                } else {
                    list.push(obj);
                }
                tool.lc.set(tool.lc.name.pathConfig, JSON.stringify(list));
                //this.$router.back();
            }
        },
        created() {
            this.getData();
        },
        mounted() {

        },
        components: {
            pathChild: function (resolve) {
                loadComponent(resolve, {
                    name: "attrChildren",
                    jsSrc: "./js/path/attrChildren.js",
                    htmlSrc: "./pages/path/attrChildren.html"
                });
            }
        }
    };
});








