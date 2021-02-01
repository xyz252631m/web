define("index", function () {
    console.log("this is index")
    return {
        mixins: [mixin],
        data() {
            return {
                menuList: [],
                btype: "",
                tabList: [],
                list: [],
                loading: 0,
                str: ""
            }
        },
        methods: {
            //获取数据
            async getData() {
                let tool = await require("vueTool");
                var bookType = tool.books.getType();
                cordova.plugins.HttpClient.doGet(
                    {
                        url: "https://m.xiangcunxiaoshuo.com",
                        type: "GBK"
                    },
                    function (res) {
                        console.log("success");
                        callback(res);
                    },
                    function (err) {
                        console.log(err)
                    }
                );


                let callback = res => {
                    let $doc = $(res);
                    // let reader = new FileReader();
                    // reader.readAsText(res, 'GBK');
                    // reader.onload = function (e) {
                    //     console.log(reader.result);
                    // }
                    // let title = $doc.find(".logo").text();
                    this.tabList = tool.books.getIndexTabList($doc);
                    //   this.list = bookType.getIndexList($doc);


                    //  console.log(title);
                    //  this.str = title;
                    // console.log(gb2utf8(encodeURIComponent(title)), escape(title))
                    // urldecode(res)
                    // console.log(  title, $URL.decode(gb2utf8(title)))
                    //   var x = new Uint8Array(res);
                    //
                    //   var str =new TextDecoder('gbk').decode(x);
                    //   console.log("res",res)
                }

                // this.xhrGet('http://m.1kanshu.cc',callback)

                // this.ajaxGet(bookType.host).then(res => {
                //
                //     callback(res)
                // })
            },
            toggleLeftSideMenu() {

            },
            changeType() {

            },
            toType() {

            },
            // nofind() {
            //
            //     console.log("img error")
            // },
            toBook() {

            }


        },
        created() {
            this.getData();
        },
        mounted() {
            console.log("mounted index")
        }
    };
});






