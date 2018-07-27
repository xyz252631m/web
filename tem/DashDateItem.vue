<template>
    <div v-if="data.length" class="sc-item sc-quarter">
        <div class="item-line"></div>
        <div class="date-select-box" @touchstart="startHandle" @touchend="endHandle" @scroll="scrollHandle" ref="ListBox">
            <ul>
                <li v-for="m in list" :key="m">{{m}}</li>
            </ul>
        </div>
    </div>

</template>

<style scoped lang='scss'>
    @import "./DashDateItem.scss";
</style>
<script>
    const dh = 40; //item height
    export default {
        name: "DashDateItem",
        props: {
            data: {
                type: Array,
                default: []
            },
            value: {
                type: [String, Number],
                default: ""
            },
            show: {
                type: Boolean
            },
            type: {
                type: String
            }
        },
        data() {
            return {
                isTouch: true,
                timer: 0,
                list: this.data
            }
        },
        watch: {
            show(val) {
                if (val) {
                    //显示组件时 设置scrollTop
                    this.setTop()
                }
            },
            value(val) {

            },
            data(val) {
                this.list = val;
            }
        },
        methods: {
            //设置scrollTop
            setTop() {
                if (this.value !== undefined && this.value !== "") {
                    let idx = this.data.indexOf(parseInt(this.value));
                    this.$refs.ListBox.scrollTop = idx * 40;
                }
            },
            //tool 间隔值
            regionNum(num, regionVal) {
                let remainder = num % regionVal;
                if (remainder === 0) {
                    return num;
                } else {
                    if (remainder < regionVal / 2) {
                        return num - remainder;
                    } else {
                        return num - remainder + regionVal;
                    }
                }
            },
            startHandle() {
                this.isTouch = true;
            },
            endHandle() {
                this.isTouch = false;
                this.scrollHandle(true);
            },
            scrollHandle(isRun) {
                if (this.isTouch) {
                    return;
                }
                let fn = () => {
                    let stop = this.$refs.ListBox.scrollTop;
                    let tarTop = this.regionNum(stop, dh);
                    this.isTouch = true;
                    this.scrollToTop(this.$refs.ListBox, stop, tarTop, d => {
                        this.$emit("input", this.data[d / dh]);
                        this.$emit("end", this.type);
                        this.isTouch = false;
                    })
                };
                clearTimeout(this.timer);
                if (isRun) {
                    this.timer = setTimeout(fn, 100);
                } else {
                    this.timer = setTimeout(fn, 800);
                }
            },
            scrollToTop(dom, scrollY, targetScrollY, callback) {
                let y = scrollY;
                let sumCount = Math.abs(targetScrollY - scrollY);
                let step = targetScrollY - scrollY >= 0 ? 1 : -1;
                let count = 0;
                let scrollInterval = setInterval(function () {
                    // alert(sumCount)
                    if (count < sumCount) {
                        count++;
                        y += step;
                        dom.scrollTop = y;
                    } else {
                        clearInterval(scrollInterval);
                        callback && callback(targetScrollY)
                    }
                }, 15);
            },
        },
        mounted() {

        },
    }
</script>

