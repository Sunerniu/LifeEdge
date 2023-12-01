const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
  }
  
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
  }    
  
  module.exports = {
    formatTime: formatTime
  }
  // util.js

function drawCircle(querySelector, rate) {
    const lineWidth = 5;
    const query = wx.createSelectorQuery();
    query.select(querySelector)
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            const dpr = wx.getSystemInfoSync().pixelRatio;
            canvas.width = res[0].width * dpr;
            canvas.height = res[0].height * dpr;
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.arc(500/rate/2,500/rate/2,500/rate/2-2*lineWidth,0,2*Math.PI,false)
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();
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
function getMin(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var min = hours*60+minutes;
    // 返回当日的时间戳
    return min;
}
function getDay(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var min = hours*60+minutes;
    // 返回当日的时间戳
    return min;
}
function getWeekAndDayFromTimestamp(timestamp, firstMondayTimestamp) {
    // 计算时间戳之间的天数差
    const oneDay = 24 * 60 * 60 * 1000; // 毫秒数
    const daysDifference = Math.floor((timestamp - firstMondayTimestamp) / oneDay);

    // 计算周数和星期数
    const weeks = Math.floor(daysDifference / 7) + 1; // +1 因为第一周从1开始计数
    const dayOfWeek = daysDifference % 7; // 0为周一，1为周二，以此类推

    return {
        week: weeks,
        day: dayOfWeek + 1 // +1 使其变成1为周一，2为周二，依此类推
    };
}

function getAndStoreToken(code) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'http://47.110.228.72:8080/lifeedge/user/account/wechatLogin',
            method: 'POST',
            data: {
                code: code
            },
            success: function(res) {
                if (res.statusCode === 200) {
                    wx.setStorageSync('token', res.data.data.token);
                    console.log('Token 获取并存储成功', res);
                    resolve(res); // 解决 Promise
                } else {
                    console.log('获取 Token 失败', res);
                    reject('获取 Token 失败'); // 拒绝 Promise
                }
            },
            fail: function(error) {
                console.log('请求失败', error);
                reject(error); // 拒绝 Promise
            }
        });
    });
}

function loginAndFetchToken() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: function(res) {
                if (res.code) {
                    getAndStoreToken(res.code).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                    reject(res.errMsg);
                }
            }
        });
    });
}



function getData() {
    return new Promise((resolve, reject) => {
        var token = wx.getStorageSync('token');
        if (!token) {
            loginAndFetchToken().then(() => {
                // Token 获取成功后，再次尝试获取数据
                fetchData(resolve, reject);
            }).catch((error) => {
                // 处理登录或 token 获取失败的情况
                reject(error);
            });
        } else {
            console.log('Token 已存在，可以直接使用');
            fetchData(resolve, reject);
        }
    });
}

function fetchData(resolve, reject) {
    var token = wx.getStorageSync('token');
    var wlist = [];
    token = wx.getStorageSync('token');
      wx.request({
        url: 'http://47.110.228.72:8080/lifeedge/user/schedule/selectTerm', 
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': token
        },
        success(res){

            for (var index = 0; index < res.data.data.eventList.length; index++)  {
                var element = res.data.data.eventList[index];
                const firstMondayTimestamp = new Date('2023-08-28').getTime(); 
                const result = getWeekAndDayFromTimestamp(element.beginAt*1000, firstMondayTimestamp);
                var aitem = {};
                aitem.beginAt=getMin(element.beginAt*1000);
                aitem.endAt=getMin(element.endAt*1000);
                aitem.color = '#'+`${element.color.toString(16).toUpperCase()}`.padStart(6, '0');
                aitem.id =  element.id
                aitem.name = element.name;
                aitem.description =  element.description;
                aitem.isToday = result.day;
                var aweek = result.week;
                if (!Array.isArray(wlist[aweek])) {
                    wlist[aweek] = [];
                }
                wlist[aweek].push(aitem);
            }
            try {
                wx.setStorageSync('wlists', wlist);
              } catch (e) {
                console.log('保存数据时发生错误:', e);
              }
          resolve(wlist);
        },
        fail(error) {
          console.error('请求失败:', error);
          // 在失败时，拒绝 Promise
          reject(error);
        }
      });
}

function pushAData(aData){
    var token = wx.getStorageSync('token');
    var dateTimeString1 = aData.date +" "+ aData.beginAt;
    var dateTimeString2 = aData.date +" "+ aData.endAt;
    var dateObject1 = new Date(dateTimeString1);
    var beginAt = dateObject1.getTime();
    var dateObject2 = new Date(dateTimeString2);
    var endAt = dateObject2
    console.log(aData.color)
    var res = wx.request({
        url: 'http://47.110.228.72:8080/lifeedge/user/schedule/create', // 你的目标服务器地址
        method: 'POST',
        data: {
            name: aData.currentInput,
            description: aData.description,
            beginAt: beginAt/1000,
            endAt: endAt/1000,
            color: aData.color,
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
}

module.exports = {
    drawCircle: drawCircle,
    getTimestrFromMinutes:getTimestrFromMinutes,
    getData:getData,pushAData:pushAData,
    loginAndFetchToken:loginAndFetchToken,
    getAndStoreToken:getAndStoreToken
};