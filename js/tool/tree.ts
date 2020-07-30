
class Tree{



    //转为tree型 list
    convertTreeData(list) {
        let repMap={};
        let temList =[];
        //去除重复
        list.forEach(d=>{
            if(!repMap[d.id]){
                repMap[d.id] = d;
                temList.push({...d, isOpen: false, children: []})
            }
        });
        let map = {}, treeData = [];
        temList.forEach(d => {
            map[d.id] = d;
        });
        temList.forEach(d => {
            if (d.pid) {
                if (map[d.pid]) {
                    map[d.pid].children.push(d);
                }
            }
        });
        for (let key in map) {
            if (!map[key].pid) {
                treeData.push(map[key]);
            }
        }
        return treeData;
    }
}