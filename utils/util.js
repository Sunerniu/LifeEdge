const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

// module.exports = { formatTime, showBusy, showSuccess, showModel }

// 时间格式转换 yyyy－mm－dd
function formatTime2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate() 
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()  
  return [year, month, day].map(formatNumber).join('-')
}
 
 
// 计算变化多少天后的日期
function DateAddDay(d, days) {
  var d = new Date(d); 
  return new Date(d.setDate(d.getDate() + days));
}
 
// 获得本周周日的日期
function FirstDayInThisWeek(d) { 
  var d = new Date(d);  
  return DateAddDay(d, 0 - d.getDay());
}
function getAndStoreToken(code) {
    wx.request({
      url: 'YOUR_BACKEND_ENDPOINT', // 替换为你的后端 API 地址
      method: 'POST',
      data: {
        code: code
      },
      success: function(res) {
        if (res.statusCode === 200) {
          // 存储 Token
          wx.setStorageSync('token', res.data.token);
        } else {
          console.log('获取 Token 失败');
        }
      },
      fail: function(error) {
        console.log('请求失败', error);
      }
    });
  }
  function getTimestrFromMinutes(minutes) {
    // 将分钟数转换为小时和分钟
    var hours = Math.floor(minutes / 60);
    var remainingMinutes = minutes % 60;

    // 格式化输出，确保小时和分钟始终是两位数字
    var formattedHours = hours.toString().padStart(2, '0');
    var formattedMinutes = remainingMinutes.toString().padStart(2, '0');

    // 返回格式化的时间字符串
    return `${formattedHours}:${formattedMinutes}`;
}

module.exports = {
  formatTime,
  formatTime2,
  DateAddDay,
  addZero: formatNumber,
  FirstDayInThisWeek,
  showBusy,
  showSuccess,
  showModel,
  getTimestrFromMinutes
}