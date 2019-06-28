//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
        motto: 'Hello World',
        userInfo: null,
        list: [],
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    toNotice: function () {
        wx.navigateTo({
            url: '../notice/notice'
        })
    },
    newNotice() {
        let id = (new Date()).getTime();
        if (this.data.list.length) {
            let lastItem = this.data.list[this.data.list.length - 1];
            if (lastItem) {
                if (lastItem.des === "") {
                  //  id = lastItem.id;
                }
            }
        }


        wx.navigateTo({
            url: `../notice/notice?id=${id}`
        })
    },
    onShow(){
        console.log("show")
        if(app.globalData.list.length){
            this.setData({
                list:app.globalData.list
            })
        }

    },
    onLoad: function () {
        //util.downNoteList(app.globalData.userInfo);

        if(app.globalData.list.length){
            this.setData({
                list:app.globalData.list
            })

        }else{
            let FileSystemManager = wx.getFileSystemManager();
            FileSystemManager.readFile({
                filePath: `${wx.env.USER_DATA_PATH}/list.json`,
                encoding: "utf8",
                success: (res) => {
                    let data = res.data;
                    console.log("data", data)
                    if (data) {
                        try {
                            app.globalData.list = JSON.parse(data);
                        } catch (e) {
                            app.globalData.list = [];
                        }
                        this.setData({
                            list: app.globalData.list,
                        });
                    }
                },
                fail: () => {
                    this.setData({
                        list: []
                    });
                }
            });
        }




        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                withCredentials: true,
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
