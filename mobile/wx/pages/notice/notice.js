const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
        id: "#24",
        text: "",
        fileName: "",
        item: null
    },
    onLoad: function (options) {
        let id = options.id;
        this.setData({
            id: id
        });

        // if (!id) {
        //     id = (new Date()).getTime();
        // }
        let item = app.globalData.list.find(d => d.id === id);

        if (item) {
            this.setData({
                fileName: id,
                item: item
            });
            let FileSystemManager = wx.getFileSystemManager();
            FileSystemManager.readFile({
                filePath: `${wx.env.USER_DATA_PATH}/${item.fileName}`,
                encoding: "utf8",
                success: (res) => {
                    let data = res.data;
                    if (data) {
                        this.setData({
                            text: data
                        });
                    }
                },
                fail: () => {
                    this.setData({
                        text: ""
                    });
                }
            });
        } else {
            let new_item = {
                id: id,
                fileName: id,
                des: "",
                time: util.formatTime(new Date())
            };
            this.setData({
                fileName: id
            });
            app.globalData.list.push(new_item);
            this.setData({
                item: new_item
            });
        }
    },
    input: util.debounce(function (e) {
        let val = e.detail.value;
        this.data.item.des = val.substr(0, 50);
        const fs = wx.getFileSystemManager();
        fs.writeFileSync(`${wx.env.USER_DATA_PATH}/${this.data.fileName}`, val, 'utf8');
    }, 3000)
});