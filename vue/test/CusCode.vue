<template>
    <div class="cv-code" @click="codeClick">
        <div class="cv-textarea">
            <textarea ref="inputBox" autocorrect="off" autocapitalize="off" spellcheck="false"
                      tabindex="0" @input="inputTxtValue($event)" @focus="inputFocus" @blur="inputBlur"></textarea>
        </div>

        <div class="cv-cursor-list" ref="cursorBox">
            <div class="cv-cursor"></div>
        </div>
        <div class="cv-code-main" ref="code">
            <pre v-for="h in htmlList" v-html="h">

            </pre>
        </div>
    </div>
</template>
<style scoped lang='scss'>
    @import "CusCode";
</style>
<style>

    .cv-key-words { color: #ef6155;}
    .cv-builtin {color: #ef6155;}
</style>
<script>

    function oneOf(value, validList) {
        for (let i = 0; i < validList.length; i++) {
            if (value === validList[i]) {
                return true;
            }
        }
        return false;
    }


    function insert_flg(soure, start, newStr) {
        return soure.slice(0, start) + newStr + soure.slice(start)
    }

    function replace_flg(soure, start, newStr, len) {
        return soure.slice(0, start) + newStr + soure.slice(start + len);
    }

    function setArr(str) {
        return str.split(" ");
    }

    function parseDom(arg) {
        let objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.childNodes;
    }

    function regCheck(soure, key, cls) {
        let keyPosInfo = [];
        let regList = ["^(" + key + ")(?=[^\\w<>])", "[^\\w<>](" + key + ")(?=[^\\w])", "[^\\w<>](" + key + ")$", "^(" + key + ")$"];
        regList.forEach((exp, i) => {
            // if (key === "and") {
            //     console.log(2)
            // }
            while (true) {
                let reg = soure.match(new RegExp(exp));
                if (reg) {
                    if (reg[0] === key) {
                        soure = replace_flg(soure, reg.index, `<span class="${cls}">${key}</span>`, key.length);
                    } else {
                        if (i === 1 || i === 2) {
                            soure = replace_flg(soure, reg.index + 1, `<span class="${cls}">${key}</span>`, key.length);
                        } else {
                            break;
                        }
                    }
                    //  soure = soure.replace(reg, `${(i === 1 || i === 2) ? " " : ""}<span class="${cls}">${key}</span>`)
                    // keyPosInfo.push({
                    //     key: key,
                    //     index: reg.index,
                    //     len: key.length
                    // })
                } else {
                    break;
                }
            }
        });

        return soure;
        // return keyPosInfo;

    }

    const white = '\uFEFF';
    const keywords = setArr("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union all update values where limit left if inner right full case when then else end rownum begin");
    const builtin = setArr("bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric substr");
    const atoms = setArr("false true null unknown");

    import {datePicker} from "iview";

    export default {
        name: 'CusCode',
        props: {
            type: {
                type: String,
                default: "date"
            },
            format: {
                type: String
            },
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: true
            },
            clearable: {
                type: Boolean,
                default: true
            },
            confirm: {
                type: Boolean,
                default: false
            },
            open: {
                type: Boolean,
                default: null
            },
            multiple: {
                type: Boolean,
                default: false
            },
            timePickerOptions: {
                default: () => ({}),
                type: Object,
            },
            splitPanels: {
                type: Boolean,
                default: false
            },
            showWeekNumbers: {
                type: Boolean,
                default: false
            },
            startDate: {
                type: Date
            },
            size: {
                validator(value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            placeholder: {
                type: String,
                default: ''
            },
            placement: {
                validator(value) {
                    return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'bottom-start'
            },
            transfer: {
                type: Boolean,
                default: false
            },
            name: {
                type: String
            },
            elementId: {
                type: String
            },
            steps: {
                type: Array,
                default: () => []
            },
            value: {
                type: [Date, String, Array]
            },
            options: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                dateValue: this.value,
                currVal: this.value,
                cursorTimer: 0,

                htmlList: [],
                html: "",
                text: "",
                textList: [],
                boxOffsetTop: 0,
                boxOffsetLeft: 0,
                cursor: {
                    line: 0,
                    ch: 0,
                    rLen: 0,
                    rStr: "",    //replace string
                    type: 1  //1:add 2:replace
                },
                area: {
                    prevTxt: "",
                }
            };
        },
        watch: {
            // value(val) {
            //     if (val !== this.currVal) {
            //         this.dateValue = val || null;
            //     }
            // },
            // type(val) {
            //     this.dateValue = null;
            // }
        },
        methods: {
            changeDate(val) {
                this.currVal = val;
                this.$emit("input", val);
                this.$emit("on-change", val);
            },

            codeClick(e) {
                this.clearTxtValue();
                this.setCursorPosByClick(e);
                let selection = window.getSelection();
                this.$refs.inputBox.focus();
                this.$refs.cursorBox.style.visibility = "visible";
                this.setCursor();
                // if(selection.isCollapsed){
                //
                //
                // }else{
                //
                //
                //     selection.extend(selection.focusNode,selection.focusOffset)
                // }
            },
            //obj {line,ch}
            setCursorPos(obj) {
                console.log("cursor",obj)
                let box = this.$refs.code;
                let listPre = box.querySelectorAll("pre");

                let textList = this.textList;
                let top = 0;
                if (listPre.length) {
                    let lineSize = textList[obj.line].length;
                    if (textList[obj.line] == white) {
                        //lineSize = 0;
                    }
                    while (obj.ch > lineSize) {
                        if (textList[obj.line + 1] !== undefined) {
                            obj.line++;
                            obj.ch--;
                            obj.ch -= lineSize;
                            lineSize = textList[obj.line].length;
                        } else {
                            obj.ch = lineSize;
                            break;
                        }
                    }
                }

                if (obj.line) {
                    // while()
                    top = listPre[obj.line - 1].offsetTop + listPre[obj.line - 1].offsetHeight - this.boxOffsetTop
                }


                // console.log("1", obj)

                //TODO 自动换行未处理
                let left = obj.ch * 6;
                this.setCursorPosByXY(top, left);
            },
            setCursorPosByXY(x, y) {
                let cursor = this.$refs.cursorBox.querySelector("div");
                cursor.style.top = x + 'px';
                cursor.style.left = y + 'px';
            },
            getLine(lineIdx) {
                return this.$refs.code.querySelectorAll("pre")[lineIdx];
            },

            getPreNode(node) {
                let ele = node;
                let target = node;
                while (ele) {
                    if (ele.nodeName === "DIV") {
                        this.$msg.info("编辑器内容出错！");
                        target = null;
                        break;
                    }
                    if (ele.nodeName === "PRE") {
                        target = ele;
                        break;
                    } else {
                        ele = ele.parentNode;
                    }
                }
                return target;
            },
            setCursorPosByClick(e) {
                console.log(e)
                let cursor = this.$refs.cursorBox.querySelector("div");
                if (!this.htmlList.length) {
                    this.setCursorPosByXY({line: 0, ch: 0});
                    return;
                }
                // debugger
                let selection = window.getSelection();
                // console.log("4", selection.anchorOffset, selection);
                let box = this.$refs.code;
                let listPre = box.querySelectorAll("pre");
                let line = parseInt(e.offsetY / 17);
                let ch = 0;
                let left = e.offsetX;
                if (e.target.nodeName === "SPAN") {
                    let pre = this.getPreNode(e.target);
                    if (pre) {
                        line = Array.from(listPre).indexOf(pre);
                        ch = selection.anchorOffset;
                        //TODO 自动换行未处理 中文未处理
                        this.setCursorPos({line, ch});
                    }
                } else if (e.target.nodeName === "PRE") {

                    if (line < this.htmlList.length) {

                    } else {

                    }
                    //TODO 自动换行未处理
                    line = Array.from(listPre).indexOf(e.target);
                    ch = this.getByteLen(this.getLine(line).innerText);
                    //(e.target.offsetTop-this.boxOffsetTop)/17;
                    this.setCursorPos({line, ch});
                } else {
                    if (line < this.htmlList.length) {


                    } else {
                        //  cursor.style.top = (this.htmlList.length - 1) * 17 + 'px';
                        let listSpan = listPre[this.htmlList.length - 1].querySelectorAll("span");
                        console.log(listSpan);
                        // cursor.style.left = (listSpan[0].offsetLeft + listSpan[0].offsetWidth - box.offsetLeft) + 'px';
                        line = this.htmlList.length - 1;
                        ch = this.getByteLen(this.getLine(line).innerText);
                        this.setCursorPos({line, ch});
                    }

                    // if (e.target.className.split(" ").find(d => d === "cv-code")) {
                    //
                    //
                    // }
                }

                this.cursor.line = line;
                this.cursor.ch = ch;
                // cursor.style.top = parseInt(e.offsetY / 17) + 'px';
                // cursor.style.left = e.offsetX + 'px';
            },
            showCursor() {
                if (this.$refs.cursorBox.style.visibility === "visible") {
                    this.$refs.cursorBox.style.visibility = "";
                } else {
                    this.$refs.cursorBox.style.visibility = "visible"
                }
            },

            setCursor() {
                clearInterval(this.cursorTimer);
                this.cursorTimer = setInterval(this.showCursor, 600)
            },
            getByteLen(val) {
                let len = 0;
                for (let i = 0; i < val.length; i++) {
                    let a = val.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {
                        len += 2;
                    }
                    else {
                        len += 1;
                    }
                }
                let wLen = val.match(/\uFEFF/g);
                if (wLen) {
                    len -= (wLen.length * 2);
                }
                return len;
            },

            setValueByPos(txt, obj) {
                let idx = obj.ch;
                let box = this.$refs.code;
                let listPre = Array.from(box.querySelectorAll("pre") || []);
                //todo 当前行
                // debugger
                for (let i = 0; i < listPre.length; i++) {
                    if (i < obj.line) {
                        idx++;
                        idx += (listPre[i].innerText.length);
                    } else {
                        break;
                    }
                }
                let str = this.text;
                if (this.cursor.type === 2) {
                    // console.log(this.cursor.ch, this.area.prevTxt.length);

                    this.text = replace_flg(str, idx - this.area.prevTxt.length, txt, this.area.prevTxt.length);//  str.replace(this.cursor.rStr, txt);
                } else if (this.cursor.type === 1) {
                    this.text = insert_flg(str, idx, txt);
                }
                // console.log("777", this.getByteLen(txt), this.getByteLen(this.area.prevTxt));
                this.cursor.ch += (this.getByteLen(txt) - this.getByteLen(this.area.prevTxt));
                // console.log("3", this.cursor)
                this.area.prevTxt = txt;
                this.textToList();
                this.setCursorPos(this.cursor)
            },

            textToList() {
                let txt = this.text;
                let list = txt.split(/\n/);
                this.textList = list.map(d => d || white);

                this.htmlList = list.map(d => {
                    if (d) {
                        let keyPosInfo = [];
                        // console.log("nodelist", parseDom(d));
                        keywords.forEach(k => {
                            //     keyPosInfo = keyPosInfo.concat(regCheck(d, k));
                            d = regCheck(d, k, "cv-key-words")
                        });

                        builtin.forEach(k => {
                            // keyPosInfo = keyPosInfo.concat(regCheck(d, k));
                            d = regCheck(d, k, "cv-key-words")
                        });
                        //
                        // if (keyPosInfo.length) {
                        //     let a = keyPosInfo[0];
                        //     d = replace_flg(d, a.index ? a.index + 1 : 0, `<span class="cv-key-words">${a.key}</span>`, a.len);
                        //
                        // }
                        return d;

                    } else {
                        return `<span>${white}</span>`
                    }
                    //  return `<span>${d}</span>`
                });
            },
            //手动输入value 事件
            inputTxtValue(e) {
                let txt = e.target.value;
                // console.log("old", this.area.prevTxt)
                if (this.area.prevTxt) {
                    this.cursor.type = 2;
                    this.cursor.rStr = this.area.prevTxt;
                } else {
                    this.cursor.type = 1;
                }
                this.setValueByPos(txt, this.cursor);
                // console.log("change", e, txt)
            },
            //清空value
            clearTxtValue() {
                this.area.prevTxt = "";
                this.$refs.inputBox.value = "";
            },
            bindEnter(e) {
                // console.log(e)
                //删除
                if (e.keyCode === 8) {

                } else if (e.keyCode === 46) {
                    //delete
                } else if (e.keyCode === 38) {
                    //up
                } else if (e.keyCode === 40) {
                    //down
                } else if (e.keyCode === 37) {
                    //left
                } else if (e.keyCode === 39) {
                    //right
                }
            },
            inputFocus() {
                window.addEventListener("keydown", this.bindEnter)
            },
            inputBlur() {
                window.removeEventListener("keydown", this.bindEnter)
            }
        },
        mounted() {
            this.boxOffsetLeft = this.$refs.code.offsetLeft;
            this.boxOffsetTop = this.$refs.code.offsetTop;
        },
        components: {
            // 'i-datePicker': datePicker
        }
    };
</script>
