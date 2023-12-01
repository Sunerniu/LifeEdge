//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
          }
        })
        
    },
    //app.js
 onLaunch(){
    wx.getSetting({
      // 获取用户的当前设置，返回值中只会出现小程序已经向用户请求过的权限（用户同意被请求的）
      success:res=>{
        // .xxx和['xxx']取值的区别
        res.authSetting['scope.userInfo']
        ?
      (console.log('已授权'),
      // 把授权过的信息保存到全局
      wx.getUserInfo({
        success:data=>{
          this.globalData.userInfo=data.userInfo
        }
      })
      )
      :
      console.log('用户未授权');
      }
    })
      },

    globalData: {
      userInfo: null
    }
})