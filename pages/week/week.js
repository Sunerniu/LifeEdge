// pages/calendarmonth/calendarmonth.js
import {getData} from '../utils/utils'
function calculateWeekAndDay(startDateStr, targetDateStr) {
    const startDate = new Date(startDateStr);
    const targetDate = new Date(targetDateStr);
    const diffInMs = targetDate - startDate;

    // 将毫秒差转换为天数
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // 计算周数和周内的天数
    const weeks = Math.floor(diffInDays / 7);
    const days = diffInDays % 7;

    // 返回结果
    return { week: weeks + 1, day: days + 1 }; // 加1是因为我们从第1周的第1天开始计数
}

Page({
 
  data:{
    todays:[],
    calendarList:[],
    today:'',
    week:14,
    day:3
  },
  
  onClickCalendar: function(e){
    console.log(e);
  },
 
  onMyEvent: function(e){
    const result = calculateWeekAndDay("2023-08-28",e.detail.data);
    var wList = wx.getStorageSync('wlists')
    var week = result.week
    var day = result.day
    var todays =[]
    for (let i = 0; i < wList[week].length; i++) {
        if(wList[week][i].isToday == result.day){
            todays.push(wList[week][i])
        }
    }
    console.log(todays)
    this.setData({
        todays:todays,
        today:e.detail,
        week:week,
        day:day
    })
  },
 
  onLoad: function(options){
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const result = calculateWeekAndDay("2023-08-28",dateString);
    var week = result.week
    var day  = result.day
    var wList = wx.getStorageSync('wlists')
    var week = this.data.week
    var todays =[]
    for (let i = 0; i < wList[week].length; i++) {
        if(wList[week][i].isToday == day){
            todays.push(wList[week][i])
        }
    }
    console.log(todays)
    this.setData({
        todays:todays,
        week:week,
        day:day
    })
  },
  onPullDownRefresh: function() {
    var that = this;
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("下拉刷新啦");
    getData().then(wList => {
      try {
        wx.getStorageSync('wlists', wList);
      } catch (e) {
        console.log('保存数据时发生错误:', e);
      }
      var todays =[]
      for (let i = 0; i < wList[that.data.week].length; i++) {
        if(wList[that.data.week][i].isToday ==that.data.day){
            todays.push(wList[that.data.week][i])
        }
    }
      this.setData({ todays });
    }).catch(error => {
      console.log('获取数据失败:', error);
    }).finally(() => {
      wx.stopPullDownRefresh();
    });
   
    
    setTimeout(function () {
      this.triggered = false;
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      that.setData({ isRefreshing: false })
      wx.stopPullDownRefresh();
    }, 2000)
  },
})