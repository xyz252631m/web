<template>
    <dropdown trigger="click">
        <i-input size="small" style="width: 100%" :value="currVal" readonly></i-input>
        <dropdown-menu slot="list">
            <ul class="sim-ss-list-box">
                <li v-for="(m,i) in currList" :key="m.val+'_'+i" @click="clickItem(m)" :class="getClass(m)">{{m.name}}</li>
                <li v-if="currList.length===0">无数据</li>
            </ul>
            <div class="sim-ss-op-box">
                <div class="sim-ss-look-select">
                    <span>查看已选</span>
                    <i-switch style="margin-left: 6px;margin-top: -1px;" size="small" v-model="isLookSelect" @on-change="lookSelect"></i-switch>
                </div>
                <i-checkbox v-model="isAll" @on-change="allSelect">全选</i-checkbox>
            </div>
        </dropdown-menu>
    </dropdown>
</template>
<style lang="scss">
    .sim-ss-list-box { min-height: 90px; max-height: 210px;overflow: auto;margin-bottom: 5px;
        li {line-height: normal; padding: 7px 16px; clear: both;
            color: #495060; font-size: 12px; white-space: nowrap; list-style: none; cursor: pointer;
            -webkit-transition: background .2s ease-in-out; transition: background .2s ease-in-out;}
        li:hover { background: #f3f3f3;}
        .ss-select { color: #fff; background: rgba(45, 140, 240, .9); }
        .ss-selects {color: rgba(45, 140, 240, .9); background: #fff;
            &::after { display: inline-block; font-family: Ionicons; speak: none;
                font-style: normal; font-weight: 400; font-variant: normal; text-transform: none;
                text-rendering: auto; line-height: 12px; -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale; float: right; font-size: 24px; content: '\F3FD'; color: rgba(45, 140, 240, .9);
            }
        }
    }
    .sim-ss-op-box {margin: 0 10px; padding-top: 5px; border-top: #eee solid 1px;
    }
    .sim-ss-look-select {float: right;
    }
</style>
<script>
    import {Select, Option, Dropdown, DropdownMenu, Input, Checkbox, Switch} from "iview";

    export default {
        name: 'simSelect',
        props: {
            list: {
                type: Array,
                default: []
            },
            value: {
                type: [Number, String, Array],
                default: ''
            },
            disabled: {
                type: Boolean
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                currVal: this.value,
                currList: this.list,
                isAll: false,
                isLookSelect: false,
                currValList: []
            }
        },
        watch: {
            value(val) {
                if (this.currVal !== val) {
                    this.init(val);
                }
            },
            list(val) {
                this.currList = this.list;
            }
        },
        created() {
            this.init(this.value);
        },
        methods: {
            init(val) {
                if (this.multiple) {
                    this.currVal = val;
                    this.currValList = val ? val.split(",") : [];
                } else {
                    this.currVal = val;
                }
            },
            getClass(m) {
                if (this.multiple) {
                    return this.currValList.indexOf(m.val) >= 0 ? "ss-selects" : "";
                } else {
                    return m.val === this.currVal ? "ss-select" : "";
                }
            },
            //单击事件
            clickItem(item) {
                if (this.multiple) {
                    let idx = this.currValList.indexOf(item.val);
                    if (idx >= 0) {
                        this.currValList.splice(idx, 1)
                    } else {
                        this.currValList.push(item.val);
                    }
                    this.currVal = this.currValList.join(",");
                    this.$emit("input", this.currVal);
                    this.$emit("on-select", this.currVal);
                } else {
                    this.currVal = item.val;
                    this.$emit("input", this.currVal);
                    this.$emit("on-select", item);
                }
            },
            //change事件
            changeItem(val) {
                // if (this.multiple) {
                //     this.$emit("on-change", val);
                // } else {
                //     this.$emit("on-change", this.list.find(d => d.val === val));
                // }
            },
            //全选
            allSelect(val) {
                if (val) {
                    this.currValList = this.list.map(d => d.val);
                } else {
                    this.currValList = [];
                }
                this.currVal = this.currValList.join(",");
                this.$emit("input", this.currVal);
                this.$emit("on-select", this.currVal);
            },
            //查看已选
            lookSelect(val) {

                if (val) {
                    if (!this.currValList.length) {
                        this.$msg.info("未选择数据");
                        return
                    }
                    this.currList = this.list.filter(d => this.currValList.indexOf(d.val) >= 0);
                } else {
                    this.currList = this.list;
                }
            }
        },
        components: {
            "i-input": Input,
            "i-select": Select,
            "i-option": Option,
            "i-checkbox": Checkbox,
            "i-switch": Switch,
            Dropdown,
            DropdownMenu
        }
    }
</script>