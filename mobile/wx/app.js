//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {

        var code = res.code;
        console.log(code)
        var secret = "4c962d7c7fd09d79224e690544d62ced";
        // wx.request({
        //   url: "https://api.weixin.qq.com/sns/jscode2session?appid=wxfbf4de7cb8d0b47a&secret=" + secret+"&js_code="+code+"&grant_type=authorization_code"
        // })
        console.log("https://api.weixin.qq.com/sns/jscode2session?appid=wxfbf4de7cb8d0b47a&secret=" + secret + "&js_code=" + code + "&grant_type=authorization_code")

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

          //4b86dc4f2e1a0a5651aed0ef29919075150cb5d0
          //9iuStRZ20uU7QqN8SE1aIQ==
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log("us00", res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    list:[]
  }
});