// pages/statistics/statistics.js
Page({
    data: {
      headphoto:'http://tmp/AeymwJ8RFU5tcd2bf426f841186968fca79e3884c151.jpeg',
      username:'Wikz',
      isRefreshing: true
    },
    ccoure:function(){
      wx.showModal({
        title: '导入课表',
        placeholderText: '请输入您想要添加的课程',
        editable:true,
        confirmText:'导入课程',
        success (res) {
          if (res.confirm) {
            console.log(res.content)
            var token = wx.getStorageSync('token')    
            var res = wx.request({
                url: 'http://47.110.228.72:8080/lifeedge/user/schedule/course/importSome', 
                method: 'POST',
                data: {
                    courseInfo:res.content
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
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    onPullDownRefresh: function() {
        console.log("下拉刷新啦");
        var that = this;
        wx.showLoading({
          title: 'Loading...',
        })
        
        var token = wx.getStorageSync('token');
        wx.request({
            url: 'http://47.110.228.72:8080/lifeedge/user/account/query',
            method: 'GET',
            header: {
                'content-type': 'application/json',
                'Authorization': token
            },
            success(res) {
                    that.setData({
                        username: res.data.data.username,
                        headphoto: res.data.data.pictureUrl
                    });
                console.log(res.data.data)
            },
            fail(error) {
                console.log('请求失败:', error);
            }
        });
        console.log(token)
        
        setTimeout(function () {
          this.triggered = false;
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          that.setData({ isRefreshing: false })
          wx.stopPullDownRefresh();
        }, 2000)
      },
    tongzhi:function(){
      wx.showModal({
        title: '是否开启通知',
        confirmText:'是',
        cancelText:'否',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    onLoad(options) {
        var token = wx.getStorageSync('token');
        var that = this; 
        wx.request({
            url: 'http://47.110.228.72:8080/lifeedge/user/account/query',
            method: 'GET',
            header: {
                'content-type': 'application/json',
                'Authorization': token
            },
            success(res) {
                    that.setData({
                        username: res.data.data.username,
                        headphoto: res.data.data.pictureUrl
                    });
                console.log(res.data.data)
            },
            fail(error) {
                console.log('请求失败:', error);
            }
        });
        console.log(this.data.username)
    }
    
  })