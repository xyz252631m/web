let mapLevel = {};
let mapId = {};
let infoList = [];

//处理数据
function conventData(list) {
    mapLevel = {};
    mapId = {};
    infoList = [];
    let fn = function (list, mapLevel, mapId, infoList, level, pid) {
        list.forEach(function (d, idx) {
            if (level > 3) {
                return
            }
            d.level = level;
            d.idx = idx;
            d.pid = pid;
            d._id = d.id;
            d.childrenList = d.children || [];
            if (idx >= 10) {
                return
            }
            if (!mapLevel[level.toString()]) {
                mapLevel[level.toString()] = [];
            }
            mapLevel[level.toString()].push(d);
            if (!d._id || mapId[d._id]) {
                d._id = pid + "_" + new Date().getTime() + "_" + idx;
            }

            mapId[d._id] = d;
            d.open = level < 3;
            infoList.push(d);
            if (d.children) {
                if (d.children.length) {
                    fn(d.children, mapLevel, mapId, infoList, level + 1, d._id);
                }
            } else {
                d.children = [];
            }
        })
    };
    fn(list, mapLevel, mapId, infoList, 1, "root");

    infoList.forEach(function (d, i) {
        if (d.children.length > 10) {
            var child = [], moreList = [];
            d.children.forEach(function (k, idx) {
                if (idx < 10) {
                    child.push(k);
                } else if (idx === 10) {
                    var tem = {
                        id: "more_" + d._id + "_01",
                        _id: "more_" + d._id + "_01",
                        name: "展开",
                        isMoreItem: true,
                        pid: d._id,
                        idx: idx,
                        level: d.level + 1,
                        moreOpen: false,
                        children: []
                    };
                    mapId[tem._id] = tem;
                    infoList.push(tem);
                    var upItem = d.children[9];
                    var upIdx = mapLevel[tem.level].indexOf(upItem);
                    mapLevel[tem.level].splice(upIdx + 1, 0, tem);
                    child.push(tem);
                } else {
                    k.hide = true;
                    moreList.push(k);
                }
            });
            d.moreOpen = false;
            d.children = child;
            d.moreList = moreList;
            d.hasMore = true;
        }
    });
}

function getLength(str) {
    return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
}

class Tree {
    constructor(svgDoc, option) {
        let opt = option;
        let rect = svgDoc.node().getBoundingClientRect();
        let svg = svgDoc;

        this.transform = {
            x: 200,
            y: rect.height / 2,
            x1: 0,
            y1: 0,
            z: 1,
            isMove: false
        };
        this.root_g = svg.append('g');
        this.link_g = this.root_g.append('g');
        this.node_g = this.root_g.append('g');
        this.drag(svg, this.root_g);

        opt.data.open = true;
        this.data = opt.data;
        conventData(this.data.children);

        let tree = d3.tree().size([600, 400])//设定尺寸，即转换后的各个节点的坐标在哪一个范围内；
            .separation(function (a, b) {//设置节点之间的间隔；
                return (a.parent === b.parent ? 1 : 2)
            })
            .nodeSize([50, 200]);

        this.tree = tree;

        console.log("data", this.data)
        let root = this.initTreeLayout(this.data);
        // 设置第一个元素的初始位置
        root.x0 = 600 / 2;
        root.y0 = 0;


        let treeData = tree(root);
        this.treeData = treeData;

        this.calcItemPos(treeData);

    }

    //初始化tree布局
    initTreeLayout(data) {
        let root = d3.hierarchy(data, function (d) {
            return d.children;
        });
        return root;
    }

    //计算位置
    calcItemPos(treeData) {
        // 计算新的Tree层级
        let nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);


        let mapLevel = {};
        let max_w = 0;
        nodes.forEach(function (d) {
            // d.y = d.depth * 180;
            if (!mapLevel[d.depth]) {
                mapLevel[d.depth] = 0;
            }

            if (!d.data.children) {
                d.data.children = [];
            }
            if (!d.data.openList) {
                d.data.openList = [];
            }
            let w = getLength(d.data.name) * 14 / 2 + 20;//20 padding
            if (d.data.children.length || d.data.openList.length || d.data.isMoreItem) {
                w += 20;  //展开收缩按钮
            }
            mapLevel[d.depth] = Math.max(w, mapLevel[d.depth]);
            d.w = w;
        });

        nodes.forEach(d => {
            var off_x = 0;
            Object.entries(mapLevel).forEach(function (m) {
                if (Number(m[0]) < d.depth) {
                    off_x += m[1];
                }
            });
            d.y = off_x + d.depth * 70;
        });

        this.render(this.root_g, nodes, links)
    }


    render(root_g, nodes, links) {
        let self = this;
        let {link_g, node_g} = this;
        //创建item
        console.log("nodes", nodes)

        nodes.forEach(d => {
            if (d.data.g) {
                let item_g = d.data.g;
                item_g.datum(d);
                item_g.transition()
                    .attr('transform', function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });
            } else {
                let item_g = node_g.append("g");
                d.data.g = item_g;
                item_g.datum(d);
                item_g.append('rect');
                item_g.append('path');
                item_g.append('text');
                nodeUpdate(item_g);
            }
        });


        // let node_update = node_g.selectAll('.node').data(nodes);
        // let node_enter = node_update.enter().append('g');
        // node_enter.append('rect');
        // node_enter.append('path');
        // node_enter.append('text');
        // node_update.exit().remove();

        function nodeUpdate(list) {
            list.attr('class', 'node')
                .attr('transform', function (d) {
                    if (d.data.animateAdd) {
                        return "translate(" + d.data.py + "," + d.data.px + ")";
                    } else {
                        return "translate(" + d.y + "," + d.x + ")";
                    }
                })
                .attr("opacity", 0)

                .transition()
                .attr('transform', function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                })
                .attr("opacity", 1);
            list.select('rect').attr("fill", "#128BED").attr("height", 40).attr("width", d => d.w);//.height(40);


            list.filter(function (p) {
                if (p.depth) {
                    return p
                }
            }).select("path").attr('class', 'link').attr('d', function (d) {
                return `M 0 20h-35`
            });

            // node.append('circle').attr('r', 4.5)
            list.select('text')
                .attr("dx", function (d) {
                    return 10
                })
                .attr("dy", 25)
                // .style("text-anchor", function (d) {
                //     return d.children ? "end" : "start";
                // })
                .text(function (d) {
                    return d.data.name;
                })
                .attr("fill", "#fff");

        }

        // node_update.call(nodeUpdate);
        // node_enter.call(nodeUpdate);
        let node = node_g.selectAll('.node');
        //创建 + - 图标
        let opData = node.filter(d => (d.data.children && d.data.children.length) || (d.data.openList && d.data.openList.length) || d.data.isMoreItem);
        node.selectAll(".node-op-state").remove();
        let op_gs = opData.append("g");
        op_gs.append("circle");
        op_gs.append("line");

        //操作按钮 + -
        function opUpdate(list) {
            list.attr("class", "node-op-state")
                .attr("transform", function (d) {
                    return `translate(${d.w - 23},13)`
                });
            list.select("circle").attr("r", 7.5).attr("cx", 7.5).attr("cy", 7.5);
            list.select("line").attr("x1", 4).attr("y1", 7.5).attr("x2", 11).attr("y2", 7.5);//4, 7.5, 11, 7.5
            let addList = list.filter(function (d) {
                if (d.data.isMoreItem) {
                } else {
                    if (!d.data.open) {
                        return d
                    }
                }
            });
            //添加为加号 +
            addList.append("line").attr("x1", 7.5).attr("y1", 4).attr("x2", 7.5).attr("y2", 11);//4, 7.5, 11, 7.5
            list.on("click", function (d) {
                self.openClick(d);
            });
        }

        op_gs.call(opUpdate);
        //竖线
        let vDataList = nodes.filter(d => d.children && d.children.length > 1);
        let vList_update = link_g.selectAll('.link-v').data(vDataList);
        let vList_enter = vList_update.enter().append('path');


        function updateVList(list) {
            list.attr('class', 'link link-v')
                .transition()
                .attr('d', function (d) {
                    let first = d.children[0];
                    let last = d.children[d.children.length - 1];
                    return `M ${first.y - 35} ${first.x + 20}V${last.x + 20}`
                });
        }

        vList_update.call(updateVList);
        vList_enter.call(updateVList);

        vList_update.exit().remove();
        link_g.selectAll('.link-v').each(function (d, i) {
            d.vList = this;
        });


        let hasChildList = nodes.filter(d => d.children && d.children.length);


        //父到子 -- 连接子项的线
        let rList_update = link_g.selectAll('.link-r').data(hasChildList);

        let rList_enter = rList_update.enter().append('path');

        function updateRList(list) {
            list.attr('class', 'link link-r')
                .attr('d', function (d) {
                    let first = d.children[0];
                    let last = d.children[d.children.length - 1];
                    return `M ${first.y - 35} ${d.x + 20}H${d.y + d.w}`
                });
        }

        rList_update.call(updateRList);
        rList_enter.call(updateRList);

        rList_update.exit().remove();

    }

    //item 点击事件 open or close
    openClick(d) {
        console.log(d)
        if (d.data.isMoreItem) {
            let pid = d.parent.data.id;
            let item_g = d.data.g;
            //收起
            if (d.data.moreOpen) {
                d.data.moreOpen = false;
                d.data.name = "展开"
                let temList = [], removeList = [];
                let item = d.parent;
                let len = item.data.children.length;
                item.data.children.forEach((p, i) => {
                    if (i > 9 && i < len - 1) {
                        p.hide = true;
                        removeList.push(p);
                    } else {
                        temList.push(p);
                    }
                });
                item.data.children = temList;
                // var lastItem = item.children[item.children.length - 1];
                // lastItem.name = "展开";
                var tem = temList[9].g.datum();

                removeList.forEach(function (p, idx) {
                    p.g.attr("opacity", 1)
                        .transition()
                        .attr("opacity", 0)
                        .attr('transform', function (d) {
                            return "translate(" + d.y + "," + (tem.x + 40) + ")";
                        })
                        .remove();
                    // p.g.animate(option.anTime).opacity(0).y(tem.y + 40).after(function () {
                    //     this.remove();
                    // });
                    //d.hLine.animate(option.anTime).x(0);
                    if (p.open) {
                        //self.closeItemChildren(p, tem, false)
                    }
                });

            } else {
                d.data.moreOpen = true;
                let temList = [];
                d.parent.data.childrenList.forEach((p, i) => {
                    if (i > 9) {
                        p.idx = i;
                        p.hide = false;
                        p.pid = pid;
                        p.open = false;
                        p.g = null;
                        p.animateAdd = false;
                        p.animateMoreAdd = true;
                        if (!p.children) {
                            p.children = [];
                        }
                        p.childrenList = p.children || [];
                        temList.push(p);
                    }
                })
                Array.prototype.splice.apply(d.parent.data.children, [10, 0].concat(temList));
                var temItem = d.parent.data.children[9];
                temList.forEach(function (d) {
                    d.py = temItem.y;
                });
                d.data.name = "收缩"
            }

            item_g.select('text').text(function (d) {
                return d.data.name;
            })
        } else {
            //收起
            if (d.data.open) {
                d.data.open = false;
                d.data.openList = d.data.children;
                d.data.children = [];

                var queue = [];
                let fn = function (list) {
                    list.forEach(a => {
                        queue.push(a);
                        if (a.children) {
                            if (a.children.length && a.open) {
                                fn(a.children);
                            }
                        }
                    })
                };
                fn(d.data.openList);

                queue.forEach(k => {
                    k.animateAdd = true;
                    k.animateMoreAdd = false;
                    k.px = d.x;
                    k.py = d.y;
                    k.g.attr("opacity", 1)
                        .transition()
                        .attr('transform', function (a) {
                            return "translate(" + d.y + "," + d.x + ")";
                        })
                        .attr("opacity", 0)
                        .remove();
                    k.g = null;
                })


            } else {
                d.data.open = true;
                d.data.children = d.data.openList;
                d.data.openList = [];
            }

        }
        //重新计算层级、位置
        let root = this.initTreeLayout(this.data);
        let treeData = this.tree(root);
        this.calcItemPos(treeData);

    }

    //拖动事件
    drag(svg, root_g) {
        let {transform} = this;
        root_g.attr("style", "transform:translate(" + transform.x + "px," + transform.y + "px)");
        let drag = d3.drag().on("drag", function () {
            transform.isMove = true;
            transform.x1 = transform.x - (d3.event.subject.x - d3.event.x);
            transform.y1 = transform.y - (d3.event.subject.y - d3.event.y);
            root_g.attr("style", "transform:translate3d(" + transform.x1 + "px," + transform.y1 + "px,0) scale(" + transform.z + ")")
        }).on("end", function (a) {
            if (transform.isMove) {
                transform.x = transform.x1;
                transform.y = transform.y1;
                transform.isMove = false;
            }
        });
        svg.call(drag);
    }
}




