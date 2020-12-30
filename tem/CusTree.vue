<template>
    <div class="virtual-tree-menu">
        <ul :style="treeStyle">
            <li v-for="m in showList" :key="m.id"
                :class="[m.expand?'open-li':'','level-li-' + m.level,m.id===activeId?'active':'']"
                @click="selectItem($event,m)"
            >
                <a class="" href="javascript:void(0);">
                <span class="arrow" v-if="m.children && m.children.length" @click="changeExpand(m)">
                    <i class="fa fa-fw fa-caret-right"></i>
                </span>
                    <label>
                    <span class="icon-box">
                        <slot name="icon" :item="m">
                            <i class="fa fa-fw fa-file-text"></i>
                        </slot>
                     </span>
                        {{ m.name }}
                    </label>
                    <span class="icon-op" @click.stop="showMoreMenu($event,m)"><i
                        class="fa fa-fw fa-reorder"></i></span>
                </a>

            </li>
        </ul>
    </div>
</template>
<style lang='scss'>
    @import "./CusTree.scss";
</style>
<script>

    export default {
        name: "CusTree",
        props: {
            treeData: {
                type: Array,
                default() {
                    return [];
                }
            },
            keyMap: {
                type: Object,
                default() {
                    return {
                        id: "id",
                        name: "name",
                        iconCls: "iconCls",
                        expand: "expand",
                        children: "children"
                    }
                }
            },
            defaultExpandAll: {
                type: Boolean,
                default: false
            },
            activeId: {}

        },

        data() {
            return {
                dataList: [],
                showList: [],
                dataIdx: 0,
                paddingTop: 0,
                paddingBottom: 0,
                itemHeight: 32,
                showItemNum: 50
            }
        },
        computed: {
            treeStyle() {

                return {
                    paddingTop: this.paddingTop + 'px',
                    paddingBottom: this.paddingBottom + 'px'
                }
            }
        },
        watch: {
            treeData(val, oldVal) {
                this.dataList = this.getFlatList(val);
                this.showList = this.dataList
            },

        },
        methods: {
            selectItem(e, item) {
                this.$emit('on-select', item, e);
            },
            changeExpand(item) {
                item.data.expand = !item.data.expand;
                item.expand = item.data.expand;
                this.dataList = this.getFlatList();
                this.showList = this.dataList;
                // this.refreshDataList(0);
            },
            //获取显示的list数据
            getFlatList() {
                let treeData = this.treeData;
                let newList = [];
                let keyMap = this.keyMap;
                let count = 1;
                let fn = (newList, list, level) => {
                    list.forEach((d) => {
                        count++;
                        if (d[keyMap.expand] === undefined) {
                            d[keyMap.expand] = this.defaultExpandAll
                        }
                        let item = {
                            id: d[keyMap.id] || ('_' + count),
                            name: d[keyMap.name] || "",
                            iconCls: d[keyMap.iconCls] || "",
                            children: d[keyMap.children] || [],
                            level: level,
                            expand: d[keyMap.expand],
                            data: d
                        }
                        newList.push(item);
                        if (item.expand) {
                            if (item.children && item.children.length) {
                                fn(newList, item.data.children, level + 1);
                            }
                        }
                    });
                }
                fn(newList, treeData, 1);
                return newList;
            },

            //转换数据
            //将list转换为treeData
            convertToTreeData: function (list) {
                let map = this.map, newList = [];
                //初始化 并合并到map里
                $.each(list, function () {
                    this.count = 0;
                    this.level = 1;
                    this.isGetedData = false;
                    if (!this.children) {
                        this.children = [];
                    }
                    if (!this.pid) {
                        newList.push(this);
                    }
                    if (map[this.id]) {
                        console.error("菜单目录配置id存在重复,id：" + this.id);
                    }
                    map[this.id] = this;
                });
                $.each(list, function (idx) {
                    if (this.pid) {
                        map[this.pid].children.push(this);
                    }
                });
                return newList;
            },

            showMoreMenu(e, item) {

                this.$emit("on-more", e, item)
            },
            refreshDataList: function (idx) {
                if (!this.dataList.length) {
                    this.paddingTop = 0;
                    this.paddingBottom = 0;
                    return;
                }
                let paddingBottom = (this.dataList.length - this.showItemNum * 2 - idx) * this.itemHeight;
                this.paddingTop = idx * this.itemHeight;
                this.paddingBottom = (paddingBottom > 0 ? paddingBottom : 0)
                this.liTemplateByVir(this.dataList, idx);
            },
            //显示虚拟列表
            liTemplateByVir: function (list, idx) {
                let len = list.length;
                let start = idx < 0 ? 0 : idx;
                let itemNum = this.showItemNum;
                let end = idx + itemNum * 2 >= len ? len : (idx + itemNum * 2);
                let showList = [];
                for (let i = start; i < end; i++) {
                    showList.push(list[i]);
                }
                this.showList = showList;
                // return this.liTemplate(showList);
            }
        },
        mounted() {
            this.dataList = this.getFlatList(this.treeData);

            this.showList = this.dataList;


            this.$on("mobile-tree-select", this.selectItem)
        },
        beforeDestroy() {
            this.showList = [];
        }

    }
</script>

