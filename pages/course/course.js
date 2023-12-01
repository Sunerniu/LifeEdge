var colors = require('../../utils/colors.js')
import {getTimestrFromMinutes,getAndStoreToken,getData,loginAndFetchToken} from '../utils/utils'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekArray: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周', '第20周', '第21周'],
    pageNum: 0, // 当前所在分类的索引
    todayDay: '', // 今日日期
    todayMonth:'', // 今日月份
    todayWeek:'', // 今日周
    day:'', // 日期
    month: '', // 月份
    monthNum:1,
    week: ['一', '二', '三', '四', '五', '六','日',], // 周日为起始日
    nowDay:[1,2,3,4,5,6,7], // 本周的七天日期
    schoolTime: ['2023','08','29'],
    nowWeek: '', 
    wList:[],
    isRefreshing: true
    },

  onLoad: function (options) {
    const token = wx.getStorageSync('token');
        if (!token) {
            loginAndFetchToken();
        }
    let nowWeek = this.getNowWeek()
    let nowDay = this.getDayOfWeek(nowWeek)
    let pageNum = nowWeek - 1
    let month = this.getMonth((nowWeek - 1) * 7)
    getData()
    var wList = wx.getStorageSync('wlists')
    this.data.todayMonth
    this.setData({
      wList,
      nowWeek,
      nowDay,
      pageNum,
      todayWeek:nowWeek,
      monthNum: month / 1, // 当前月份数字类型，用于数字运算
      colorArrays: colors 
    })
  },
  topRefresh: function() {
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
        this.setData({ wList });
        this.onLoad();
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
  getdata(){

    getData()
    var wList;
        try {
        wList = wx.getStorageSync('wlists');
        } catch (e) {
        console.log('读取 wList 发生错误', e);
        }
    this.setData({
        wList
      })
  },
  getMonth(days) {
    let [year,month,day] = this.data.schoolTime
    var date = new Date(year,month-1,day);    
    date.setDate(date.getDate() + days);//获取n天后的日期      
    var m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);        
    return  m;     
  },

  // 获取第几周后的星期几的日期
  getDay(days) {
    let [year, month, day] = this.data.schoolTime
    var date = new Date(year, month-1, day);
    date.setDate(date.getDate() + days);//获取n天后的日期      
    var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();//获取当前几号，不足10补0    
    return d;
  },

  // 获取当前周
  getNowWeek(){
    var date = new Date();
    let [year, month, day] = this.data.schoolTime
    var start = new Date(year, month-1, day);
    //计算时间差
    var left_time = parseInt((date.getTime()-start.getTime())/1000)+24 * 60 * 60;
    var days = parseInt(left_time/3600/24);
    var week = Math.floor(days / 7) + 1;
    var result = week
    if(week>20 || week <= 0){
      result = this.data.now_week;
    }
    return result
  },

  //获取一周的日期
  getDayOfWeek(week){
    var day = []
    for (var i = -1; i < 6; i++) {
      var days = (week - 1) * 7 + i;
      day.push(this.getDay(days))
    }
    return day
  },
  // 点击切换导航的回调
  changeNav(event){
    let pageNum = event.currentTarget.dataset.page
    let nowWeek = pageNum + 1
    let nowDay = this.getDayOfWeek(nowWeek)
    let month = this.getMonth((nowWeek-1)*7)
    this.setData({
      pageNum,
      nowWeek,
      nowDay,
      month,
      monthNum: month / 1, // 当前月份数字类型，用于数字运算
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      todayDay: new Date().getDate(),
      todayMonth: new Date().getMonth() + 1,
      day: new Date().getDate(),
      month: new Date().getMonth() + 1 ,
    })
  },
  //点击项目出现弹窗
  showMessage(e){
    const token = wx.getStorageSync('token');
    var item = e.currentTarget.dataset.item;
    var timer1 =  getTimestrFromMinutes(item.beginAt)
    var timer2 =  getTimestrFromMinutes(item.endAt)
    const errMes = item.description+"\r\n"+timer1+'-'+timer2
    
    console.log("Clicked item:", item);
    wx.showModal({
        title:item.name,
        confirmColor : '#FF0000',
        confirmText :"删除",
        content: `${errMes}`,
        success: function (sm){
            if (sm.confirm) {
                wx.request({
                    url: 'http://47.110.228.72:8080/lifeedge/user/schedule/delete/'+item.id, 
                    method: 'DELETE',
                    data:{
                    },
                    header: {
                      'content-type': 'application/json',
                      'Authorization': token
                    }
                })


              } else if (sm.cancel) {
                console.log('用户点击取消')
              }
    
        }
        


    })
  }
})