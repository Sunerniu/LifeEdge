const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
 
 
Page({
    
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
 
  },
 
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
   console.log(avatarUrl)
    this.setData({
      avatarUrl,
    })
    app.globalData.userInfo.avatarUrl = avatarUrl
  },
  formSubmit(e){
     var token = wx.getStorageSync('token')
     app.globalData.userInfo.nickName = e.detail.value.nickname
     var Aurl = this.data.avatarUrl
     var res = wx.request({
        url: 'http://47.110.228.72:8080/lifeedge/user/account/changeUsername', 
        method: 'PUT',
        data: {
            newUsername: e.detail.value.nickname
        },
        header: {
          'content-type': 'application/json',
          'Authorization': token
        },
        success(res) {
            console.log(res);
        },
        fail(error) {
          console.log(res)
          console.error('请求失败:', error); // 处理请求失败的情况
        }
      });
      var res = wx.request({
        url: 'http://47.110.228.72:8080/lifeedge/user/account/changePicture', 
        method: 'PUT',
        data: {
            newPictureUrl : Aurl
        },
        header: {
          'content-type': 'application/json',
          'Authorization': token
        },
        success(res) {
            console.log(res);
        },
        fail(error) {
          console.log(res)
          console.error('请求失败:', error); // 处理请求失败的情况
        }
      });
      wx.switchTab({
        url: '/pages/set/set',
      })
  },
  
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  }
})