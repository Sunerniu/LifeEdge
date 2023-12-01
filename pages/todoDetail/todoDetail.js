//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
import {pushAData} from '../utils/utils'
Page({
  data: {
    currentObj:{},
    time:"",
    date:"",
    dateRange:[
      "永不",
      "每天",
      "每周",
      "每两周",
      "每月",
    ],
    colors :  [
        0x84dcf1,
        0x0000FF, // "蓝色",
        0x00FFFF, // "青色",
        0xFFA500, // "橙色",
        0xFFC0CB, // "粉色",
        0xA52A2A, // "棕色",
        0x00CED1, // "深蓝绿色",
        0x2E8B57, // "海洋绿",
        0xFF6347, // "火砖色",
        0x6A5ACD, // "蓝紫罗兰色",
        0x008B8B, // "暗青色",
        0x9932CC, // "深紫罗兰色",
        0x228B22, // "森林绿",
        0x4169E1, // "皇家蓝",
        0x20B2AA, // "海洋绿",
        0x8A2BE2, // "蓝紫色",
    ],
    colornames :  [
        "浅蓝色",
         "蓝色",
        "青色",
         "橙色",
         "粉色",
         "棕色",
         "深蓝绿色",
        "海洋绿",
         "火砖色",
        "蓝紫罗兰色",
         "暗青色",
        "深紫罗兰色",
        "森林绿",
        "皇家蓝",
        "海洋绿",
        "蓝紫色",
    ],
    dateRepeat:"",
    id:"",
    todoLists:[]
  },
  onLoad:function (){
  },
  getInput: function (e) {
    var currentInput = e.detail.value;
    var newCurrentObj = this.data.currentObj;
    newCurrentObj.currentInput = currentInput;
    this.setData({
      currentObj: newCurrentObj
    });
  },
  
  dateSwitchChange: function (e) {
    var checked = e.detail.value;
    this.data.currentObj.dateStatus=checked;
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  handleButtonClick: function() {
    // 这里添加点击按钮后的逻辑
    console.log('按钮被点击了！');
    console.log(this.data.currentObj);
    pushAData(this.data.currentObj);
    wx.switchTab({
      url: '../todolist/todolist',
    })
  },
  bindDateRepeatChange:function(e){
    this.data.currentObj.dateRepeat = this.data.dateRange[e.detail.value];
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  bindDateColorChange:function(e){
    this.data.currentObj.color = this.data.colors[e.detail.value];
    this.data.currentObj.colorname = this.data.colornames[e.detail.value];
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  bindStartTimeChange(e) {
    this.data.currentObj.beginAt = e.detail.value;
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  bindEndTimeChange(e) {
    this.data.currentObj.endAt = e.detail.value;
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  bindDateChange(e) {
    this.data.currentObj.date = e.detail.value;
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  remarkInputAction: function (e) {
    //获取输入框输入的内容
    this.data.currentObj.description = e.detail.value;
    console.log("输入框输入的内容是 " + this.data.currentObj.description)
    this.setData({
        currentObj: this.data.currentObj
      })
  },
})
