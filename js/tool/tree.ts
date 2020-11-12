class Tree {


    //转为tree型 list
    convertTreeData(list) {
        let repMap = {};
        let temList = [];
        //去除重复
        list.forEach(d => {
            if (!repMap[d.id]) {
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

    //转为tree型 list
    convertTreeData2(list) {
        let map = {}, treeData = [];
        list.forEach(d => {
            if (map[d.id]) {
                console.error("tree id 重复，" + d.id);
            }
            map[d.id] = {
                key: d.id,
                title: d.name,
                children: [],
                isLeaf: d.type === 'page',
                data: d
            };

        });
        list.forEach(d => {
            if (d.pid) {
                if (map[d.pid]) {
                    map[d.pid].children.push(map[d.id]);
                }
            } else {
                treeData.push(map[d.id]);
            }
        });
        return treeData;
    }

    //转为tree型 list
    convertTreeData3(list) {
        let map = {}, treeData = [], temList = [];
        list.forEach(d => {
            if (map[d.id]) {
                console.error("tree id 重复，" + d.id);
            }
            map[d.id] = {
                key: d.id,
                title: d.name,
                children: [],
                isLeaf: d.type === 'page',
                data: d
            };

            if (d.pid) {
                if (map[d.pid]) {
                    map[d.pid].children.push(map[d.id]);
                } else {
                    temList.push(d);
                }
            } else {
                treeData.push(map[d.id]);
            }
            console.log("count")
        });
        temList.forEach(d => {
            if (map[d.pid]) {
                map[d.pid].children.push(map[d.id]);
            }
            console.log("count")
        });
        return treeData;
    }
}