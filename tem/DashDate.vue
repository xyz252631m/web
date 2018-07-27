<template>
    <div class="da-date-input">
        <input @click="clickHandle" :value="inputVal" readonly="readonly"/>
        <transition name="date" @after-leave="date_afterLeave">
            <div class="drm-date-box" v-show="show" v-transfer-dom>

                <div class="drm-data-bg"></div>

                <div class="drm-date-main">
                    <div class="curr-date">{{localValString}}</div>
                    <div class="sc-box">
                        <date-item v-for="(key,index) in fm.dateKeyList" :type="key" :show="show" v-model="date[key]" :data="dataList[key]" :class="'sc-'+key" @end="getDateByFormat"></date-item>
                    </div>
                    <div class="button-list">
                        <v-touch tag="button" class="btn-cel" @tap="close">取消</v-touch>
                        <v-touch tag="button" class="btn-ok" @tap="submit">确认</v-touch>
                    </div>
                </div>

            </div>
        </transition>
    </div>

</template>

<style scoped lang='scss'>
    @import "./DashDate.scss";
</style>
<script>
    import _ from 'lodash'
    import DateItem from './DashDateItem.vue'

    function pad(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
            val = '0' + val;
        }
        return val;
    }

    const parseDate = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "\u65e5",
            "1": "\u4e00",
            "2": "\u4e8c",
            "3": "\u4e09",
            "4": "\u56db",
            "5": "\u4e94",
            "6": "\u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    const formats = {
        q: function (dateObj) {
            return Math.floor((dateObj.getMonth() + 3) / 3)
        },
        qq: function (dateObj) {
            return pad(Math.floor((dateObj.getMonth() + 3) / 3));
        },
        d: function (dateObj) {
            return dateObj.getDate();
        },
        dd: function (dateObj) {
            return pad(dateObj.getDate());
        },
        /**
         * @return {number}
         */
        M: function (dateObj) {
            return dateObj.getMonth() + 1;
        },
        MM: function (dateObj) {
            return pad(dateObj.getMonth() + 1);
        },

        yy: function (dateObj) {
            return String(dateObj.getFullYear()).substr(2);
        },
        yyyy: function (dateObj) {
            return dateObj.getFullYear();
        },
        h: function (dateObj) {
            return dateObj.getHours() % 12 || 12;
        },
        hh: function (dateObj) {
            return pad(dateObj.getHours() % 12 || 12);
        },
        /**
         * @return {number}
         */
        H: function (dateObj) {
            return dateObj.getHours();
        },
        HH: function (dateObj) {
            return pad(dateObj.getHours());
        },
        m: function (dateObj) {
            return dateObj.getMinutes();
        },
        mm: function (dateObj) {
            return pad(dateObj.getMinutes());
        },
        s: function (dateObj) {
            return dateObj.getSeconds();
        },
        ss: function (dateObj) {
            return pad(dateObj.getSeconds());
        }
    };

    const dh = 40; //item height

    let newDate = new Date();
    let date = {
        yyyy: newDate.getFullYear()
    };

    export default {
        name: "DashDate",
        components: {DateItem},
        props: {
            value: {
                type: [Date, String],
                default: newDate
            },
            format: {
                type: String,
                default: 'yyyy-MM'
            },
        },
        data() {
            return {
                show: false,
                date: {
                    year: formats.yyyy(newDate),
                    mouth: formats.MM(newDate),
                    day: formats.dd(newDate),
                    hour: formats.HH(newDate),
                    minute: formats.mm(newDate),
                    second: formats.ss(newDate),
                    quart: formats.qq(newDate),
                },
                dataList: {
                    year: [],
                    mouth: [],
                    day: [],
                    hour: [],
                    minute: [],
                    second: [],
                    quart: [],
                },
                fm: {
                    keyList: [],    //yyyy ,mm --- list
                    dateKeyList: [], //year mouth   --- list
                    nameList: [],    //中文
                    idxList: [],    //起始位置
                    valList: [],     //数字
                    numsList: [],       //生成列表
                    sNumList: []         //起止列表
                },
                inputVal: "", //input val
                currValStr: "", // 组件val
                localValString: ""  //显示文本
            }
        },
        methods: {
            init() {
                this.getKeyList(this.format);
                if (this.value) {
                    this.getCurrValue(this.value);
                } else {
                    this.getCurrValue(newDate);
                }
                this.initList();
                this.setCurrValStr();
                this.getDateByFormat();
                if (this.value) {
                    this.inputVal = this.currValStr;
                }
            },
            getDayList(yyyy, mm) {
                return new Date(yyyy, mm, 0).getDate();
            },
            date_afterLeave() {
                this.show = false
            },
            initList() {
                this.yearList = [];
                let dl = this.dataList;
                for (let key in dl) {
                    if (dl.hasOwnProperty(key)) {
                        dl[key] = [];
                    }
                }
                this.fm.dateKeyList.forEach((key, i) => {
                    if (key === "day") {
                        _.times(this.getDayList(this.date.year, this.date.mouth), d => {
                            dl[key].push(d + this.fm.sNumList[i]);
                        });
                    } else {
                        _.times(this.fm.numsList[i], d => {
                            dl[key].push(d + this.fm.sNumList[i]);
                        });
                    }
                });
            },
            //获取值列表
            getCurrValue(valStr) {
                if (typeof valStr === 'string') {
                    let tem = valStr.replace("Z", "").replace("T", "");
                    let str = tem.replace(/[^0-9\s]/g, '-');
                    let arr = str.split('-');
                    this.fm.valList = [];
                    arr.forEach(d => {
                        if (d) {
                            this.fm.valList.push(d);
                        }
                    });
                    this.fm.keyList.forEach((d, i) => {
                        this.date[this.fm.dateKeyList[i]] = this.fm.valList[i] || formats[d](newDate);
                    });
                } else {
                    try {
                        let date = new Date(valStr);
                        this.fm.keyList.forEach((d, i) => {
                            this.date[this.fm.dateKeyList[i]] = formats[d](date);
                        });
                    } catch (e) {
                        this.fm.keyList.forEach((d, i) => {
                            this.date[this.fm.dateKeyList[i]] = formats[d](newDate);
                        });
                    }
                }
            },
            //获取keyList
            getKeyList(format) {
                let key = ["yyyy", "MM", "dd", "HH", "hh", "mm", "ss", "qq"];
                let shortKey = ["yy", "M", "d", "H", "h", "m", "s", "q"];
                let dateKey = ["year", "mouth", "day", "hour", "hour", "minute", "second", "quart"];
                let name = ["年", "月", "日", "时", "时", "分", "秒", "季度"];
                let runNums = [200, 12, 30, 24, 12, 60, 60, 4];
                let sNums = [1900, 1, 1, 0, 0, 0, 0, 1];
                let idx = -1, keyList = [], idxList = [], dateKeyList = [], numsList = [], sNumList = [], nameList = [];
                key.forEach((d, i) => {
                    idx = format.indexOf(d);
                    if (idx >= 0) {
                        idxList.push(idx);
                        keyList.push(d);
                        dateKeyList.push(dateKey[i]);
                        numsList.push(runNums[i]);
                        sNumList.push(sNums[i]);
                        nameList.push(name[i])
                    } else {
                        idx = format.indexOf(shortKey[i]);
                        if (idx >= 0) {
                            idxList.push(idx);
                            keyList.push(shortKey[i]);
                            dateKeyList.push(dateKey[i]);
                            numsList.push(runNums[i]);
                            sNumList.push(sNums[i]);
                            nameList.push(name[i]);
                        }
                    }
                });
                this.fm.idxList = idxList;
                this.fm.keyList = keyList;
                this.fm.dateKeyList = dateKeyList;
                this.fm.numsList = numsList;
                this.fm.sNumList = sNumList;
                this.fm.nameList = nameList;
            },
            setCurrValStr() {
                let format = this.format;
                this.fm.keyList.forEach((d, i) => {
                    format = format.replace(d, this.fm.valList[i] || "");
                });
                this.currValStr = format;
            },
            clickHandle() {
                this.show = true;
                if (this.value) {
                    this.getCurrValue(this.value);
                }
            },
            close() {
                this.show = false;
            },
            //确认
            submit() {
                this.getDateByFormat();
                this.inputVal = this.currValStr;
                this.$emit('input', this.inputVal);
                this.close();
            },
            getDateByFormat(type) {
                if (type === "mouth" || type === "year") {
                    this.dataList.day = [];
                    _.times(this.getDayList(this.date.year, this.date.mouth), d => {
                        this.dataList.day.push(d + 1);
                    });
                }
                let format = this.format;
                let localValString = "";
                this.fm.keyList.forEach((d, i) => {
                    format = format.replace(d, pad(parseInt(this.date[this.fm.dateKeyList[i]]), d.length));
                    localValString += pad(parseInt(this.date[this.fm.dateKeyList[i]]), d.length) + this.fm.nameList[i];
                });
                this.currValStr = format;
                this.localValString = localValString;
            }
        },
        mounted() {
            this.init();
        },
        directives: {
            transferDom: {
                update(el) {
                    if (el.parentNode.nodeName !== "BODY") {
                        document.body.appendChild(el);
                    }
                }
            }
        }
    }
</script>

