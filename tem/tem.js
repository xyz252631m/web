/**
 * Created by Administrator on 2018/3/30.
 */
//去除 function
window._f = function noFn(obj) {
    function getAttr(temObj, obj) {
        for (let key in obj) {
            if (Array.isArray(obj)) {
                temObj = [];
                obj.forEach(function (el, idx) {
                    temObj[idx] = getAttr({}, el);
                })
            } else {
                if (typeof (obj[key]) != "function") {
                    if (Object.isExtensible(obj[key])) {
                        temObj[key] = getAttr({}, obj[key])
                    } else {
                        temObj[key] = obj[key]
                    }
                }
            }
        }
        return temObj;
    }

    return getAttr({}, obj);
};

//表操作（创建、替换、删除。。。）`
const tableOp = {
    data(){
        return {
            tableOp: {
                showUi: false,
                tableItem: null,
                UiStyle: {
                    left: "",
                    top: ""
                }
            },
            replaceTableTreeOption: {
                disableMenu: true
            },
            tableSelect: {
                show: false,
                isFocus: false,
                searchVal: "",
                selectItem: null
            }
        }
    },
    methods: {
        //显示操作菜单
        showTableOp(e, item){
            this.tableOp.showUi = true;
            this.tableOp.tableItem = item;
            this.tableOp.UiStyle.left = e.offsetX - 60 + 'px';
            this.tableOp.UiStyle.top = e.offsetY + 30 + 'px';
        },
        //显示替换表弹窗
        replaceTable(){
            this.tableSelect.show = true
        },
        //替换表--确认
        submitTableSelect(){
            let table = this.tableOp.tableItem;
            let newItem = this.tableSelect.selectItem;
            if (newItem) {
                let oldTableId = table.tableId;
                //更新uuid，更新表数据
                table.uuid = "tab" + _core.getUuid().replace(/\-/g, "");
                table.tableId = newItem.id;
                table.item = newItem;
                //更新关联关系
                let opFiledSuccess = () => {
                    this.gos.forEach((el) => {
                        if (el.start == table || el.end == table) {
                            this.addDefContact(el, el.start, el.end);
                        }
                    });
                };
                //更新字段数据
                this.updateFiledParam(opFiledSuccess);
                //更新表index
                this.refreshTableIdx(oldTableId);
                this.refreshTableIdx(newItem.id);
            }
        },
        //选择表--关闭
        closeTableSelect(){

        },
        //选择表--选中项点击事件
        selectTableReplace(e, item){
            if (item.type == "leaf" && item.active) {
                this.tableSelect.selectItem = item;
            } else {
                this.tableSelect.selectItem = null;
            }
        },

        setTabSelectFocus(){
            this.tableSelect.isFocus = true
        },
        blurTabSelectFocus(){
            if (this.tableSelect.searchVal == "") {
                this.tableSelect.isFocus = false
            }
        },
        selectTableLi(){

        },
        //删除表
        delTable(){
            let item = this.tableOp.tableItem;
            let temLines = [], temStartItem = null, temEndList = [];
            //删除当前关联关系
            this.gos = this.gos.filter((el, idx) => {
                if (el.start == item || el.end == item) {
                    if (el.start == item) {
                        temEndList.push(el.end)
                    }
                    if (el.end == item) {
                        temStartItem = el.start;
                    }
                    temLines.push(this.lines[idx]);
                    return false;
                } else {
                    return true;
                }
            });

            //this.lines = this.lines.filter((el) => temLines.indexOf(el) == -1);
            //递归获取当前节点下的所有子节点
            function getAllChild(item, result) {
                result.push(item);
                item.nextList.forEach((el, idx) => {
                    getAllChild(el, result)
                });
            }

            if (temStartItem) {
                //删除当前表
                this.dataList.delItem(item);
                this.refreshTableIdx(item.tableId);
                //重新建立关联关系
                temEndList.forEach((el) => {
                    let gosItem = this.createJoin(temStartItem, el);
                    this.addDefContact(gosItem, temStartItem, el)
                });
                //删除线
                this.updateLineAll();
            } else {
                //清空
//                    let result=[];
//                    item.nextList.forEach((el,idx)=>{
//                        if(idx){
//                           getAllChild(el,result);
//                        }
//                    });
                this.dataList = [];// this.dataList.filter((el)=>~result.indexOf(el));
                this.gos = [];
                this.lines = [];
            }
            this.updateFiledParam();
            this.sortTable();
        },
        //刷新表(相同表)索引
        refreshTableIdx(tableId){
            let tableList = this.dataList.filter(el => el.tableId == tableId);
            if (tableList.length > 1) {
                tableList.sort((a, b) => a.level - b.level);
                tableList.forEach((el, idx) => {
                    el.index = idx + 2;
                })
            } else {
                tableList.map(el => el.index = 1);
            }

        },
        //创建表
        createTable(){
            let el = this.moveMenu;
            let tableItem = {
                level: 1,
                uuid: "tab" + _core.getUuid().replace(/\-/g, ""),
                x: el.elem.left - el.svgPos.left + this.$refs.svgBox.scrollLeft,
                y: el.elem.top - el.svgPos.top + this.$refs.svgBox.scrollTop,
                w: 200,
                h: 36,
                item: el.item,
                tableId: el.item.id,
                index: 1,
                active: false
            };
            this.dataList.push(tableItem);
            this.refreshTableIdx(tableItem.tableId);
            let opFiledSuccess = null;
            if (el.enterItem) {
                tableItem.level = el.enterItem.level + 1;
                let gosItem = this.createJoin(el.enterItem, tableItem);
                opFiledSuccess = () => {
                    this.addDefContact(gosItem, el.enterItem, tableItem);
                    el.enterItem = null;
                }
            }
            this.sortTable();
            this.updateFiledParam(opFiledSuccess);
        },

        //排列表
        sortTable(){
            let self = this,list = this.dataList;
            //设置x坐标
            let setX = function (list) {
                for (let j = 0; j < list.length; j++) {
                    let item = list[j];
                    item.x = (item.level - list[0].level + 1) * 380 - 290;  //x:90
                }
            };
            //设置y坐标
            let setY = function (treeData) {
                let temY = (self.svgMaxHeight - treeData[0].maxLine * 100) / 2;
                //左上角坐标
                let pos = {
                    x: 90,
                    y: temY < 0 ? 50 : temY
                };

                //获取上部距离
                function getTop(list, orderByY, parentTop) {
                    let top = 0;
                    list.forEach(function (el) {
                        if (el.orderByY < orderByY) {
                            top += el.maxLine * 100
                        }
                    });
                    return top + parentTop;
                }

                ///递归计算y坐标
                function currY(list, m, parentTop) {
                    let top = getTop(list, m.orderByY, parentTop);
                    m.y = (m.maxLine * 100 - 40) / 2 + pos.y + top;
                    m.nextList.forEach(function (el) {
                        currY(m.nextList, el, top);
                    })
                }

                currY([], treeData[0], 0)
            };
            //设置整体坐标--居中
            let setPos = function (treeData) {

            };
            //递归--转为树形结构
            let getList = function (result, list, level) {
                for (let j = 0; j < result.length; j++) {
                    let item = result[j];
                    item.level = level;
                    item.orderByY = j + 1;
                    item["nextList"] = [];
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].start.uuid == item.uuid) {
                            item["nextList"].push(list[i].end);
                        }
                    }
                    if (item["nextList"].length) {
                        getList(item["nextList"], list, level + 1);
                    }
                }
                return result;
            };
            if (list.length) {
                let treeList = getList([list[0]], this.gos, 1);
                //重置参数
                list.forEach(function (el) {
                    el["lenNum"] = 0;//
                    el["maxLine"] = 1;//占据几行
                });
                //按列(x)排序
                list.sort((a, b) => a.level - b.level);
                let maxLevel = list[list.length - 1].level;
                let temLevel = maxLevel;//保存最大列数据
                while (maxLevel >= 0) {
                    let temList = list.filter((el) => el.level == maxLevel);
                    temList.forEach((item) => {
                        item.lenNum = item.nextList.reduce((sun, el) => el.lenNum + sun, 0) + item.nextList.length;
                        item.maxLine = item.nextList.reduce((sun, el) => el.maxLine + sun, 0) || 1;
                    });
                    maxLevel--;
                }
                setX(list);
                setY(treeList);
                //重置svg画布 width,height
                self.svgStyle.width = Math.max(this.svgMaxWidth - 10, (temLevel * 380 + 90 + 50)) + 'px';
                self.svgStyle.height = Math.max(this.svgMaxHeight - 10, (treeList[0].maxLine * 100 + 100)) + 'px';
            }
            this.updateLineAll();
        },
    }

};

//表关系
const gos = {

    methods: {
        //tool method 计算角度
        getAngle(px1, py1, px2, py2) {
            //两点的x、y值
            let x = px2 - px1;
            let y = py2 - py1;
            let hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));//斜边长度
            if (hypotenuse == 0) {
                return 0;
            }
            let cos = x / hypotenuse;
            let radian = Math.acos(cos);//求出弧度
            let angle = radian * 180 / Math.PI;//用弧度算出角度
            if (y < 0) {
                angle = -angle;
            } else if ((y == 0) && (x < 0)) {
                angle = 180;
            }
            return angle;
        },
        isExistGos(list, itemA, itemB){
            let item = null;
            list.forEach(function (el) {
                if (el.start == itemA && el.end == itemB) {
                    item = this;
                }
            });
            return item;
        },
        //获取连接点坐标
        getPointPos(item, type) {
            let x, y;
            if (type == "left") {
                x = item.x;
                y = item.y + item.h / 2;

            } else if (type == "right") {
                x = item.x + item.w;
                y = item.y + item.h / 2;
            }
            return {x, y};
        },
        //分割点
        splitLine(start, end, arry){
            let d = end - start;
            let t = [start + 0.5];
            arry.forEach(function (el) {
                t.push(start + 0.5 + parseInt(d * el / 10));
            });
            return t;
        },
        //获取关联线path
        getPaths(startItem, endItem){
            let a_w = 10, a_h = 6;   //箭头width height
            let r1 = this.getPointPos(startItem, "right"), r2 = this.getPointPos(endItem, "left");
            let imgX = this.splitLine(r1.x, r2.x, [5, 10]), imgY = this.splitLine(r1.y, r2.y, [5, 10]);
            //三角 path
            let arrow_path = ["M" + r1.x, r1.y, "L" + (r1.x + a_w), r1.y - a_h / 2, "L" + (r1.x + a_w), r1.y + a_h / 2, "Z"].join(" ");
            //线 path
            let left_ds = 6, right_ds = 12; //线的左端固定距离  右端固定距离
            let line_path = ["M" + (r1.x + a_w), r1.y, "L" + (r1.x + a_w + left_ds), r1.y, "L" + (r2.x - right_ds), r2.y, "L" + r2.x, r2.y].join(" ");
            //文本框 x,y
            let imgBox = {
                x: 0,
                y: 0,
                w: 69,
                h: 24
            };
            imgBox.x = imgX[1] - imgBox.w / 2;
            imgBox.y = imgY[1] - imgBox.h / 2;
            return {arrowPath: arrow_path, linePath: line_path, textBox: imgBox};
        },
        //更新关联---线
        updateLines(item) {
            let obj, self = this;
            this.gos.forEach(function (el, idx) {
                if (el.start == item) {
                    obj = self.getPaths(el.start, el.end);
                    self.lines[idx] = obj;
                }
                if (el.end == item) {
                    obj = self.getPaths(el.start, el.end);
                    self.lines[idx] = obj
                }
            });
        },
        //更新关联--全部
        updateLineAll(){
            let obj, self = this;
            self.lines = [];
            this.gos.forEach(function (el, idx) {
                obj = self.getPaths(el.start, el.end);
                self.lines.push(obj);
            });
        },
        //创建关联
        createJoin(itemA, itemB){
            let gos_item = this.isExistGos(this.gos, itemA, itemB);
            if (!gos_item) {
                let temGos = {
                    start: itemA,
                    end: itemB,
                    joinType: "left_join",//left_join inner_join full_join
                    contact: []
                };
                this.gos.push(temGos);
                let obj = this.getPaths(itemA, itemB);
                this.lines.push(obj);
                return temGos;
            }

            return null;
        },
        //删除关联
        delJoin(itemA, itemB){
            let gos_item = this.isExistGos(this.gos, itemA, itemB);

            if (gos_item) {
                this.gos.delItem(gos_item);
                let obj = this.getPaths(itemA, itemB);
                this.lines.push(obj);
                return temGos;
            }
        },
        //获取倒三角路径
        getArrowPath(tableItem){
            return "m" + (tableItem.x + tableItem.w - 20) + "," + (tableItem.y + tableItem.h / 2 - 3) +
                "l5.62273,5.62277l5.62271,-5.62274l-0.67474,-0.67474l-4.94797,4.94801l-4.94799,-4.94799l-0.67474,0.67469z";
        },
    }
}

const tree={
    getItemByTree(tree, id){
        let fn = function (tree, list) {
            tree.forEach(function (el) {
                list.push(el);
                if (el.children) {
                    fn(el.children, list);
                }
            });
            return list;
        };
        let getPath = function (list, id, arrPath) {
            list.forEach(function (el) {
                if (el.id == id) {
                    arrPath.push(el);
                    getPath(list, el.pid, arrPath);
                }
            });
            return arrPath;
        };
        return getPath(fn(tree, []), id, []).reverse();
    },
}