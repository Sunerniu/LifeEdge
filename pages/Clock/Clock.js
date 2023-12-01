// index.js
import {formatTime} from '../utils/utils'
import {drawCircle} from '../utils/utils'
Page({
    data:{
        break:false,
        focusTimes: [1,30, 35, 55, 45,50], // 专注时间的选项
        breakTimes: [1, 10, 15, 20, 25, 30], // 休息时间的选项
        timeValue: [0, 0],
        time:'17', 
        worktime :1,
        breaktime:1,
        mTime:'',
        timeStr:'',
        rate:'',
        isClock:false,
        timer:null,
        playShow:true, //暂停按钮切换
        clockText:'', 
        focusTimeIndex: 0,
        breakTimeIndex: 0
    },
    breakClick(){
        clearInterval(this.data.timer); 
        let timeValue = this.data.breaktime;
        console.log("uiuiuiui")
        this.setData({
        timeStr:"00:00",
        break:true,
        time:this.data.breaktime,
        mTime:this.data.breaktime*60*1000, 
        timeStr: parseInt(timeValue) >= 10 ? timeValue + ":00" : "0" + timeValue + ":00" })
        this.drawActive()
    },
    bindFocusTimeChange: function(e) {
        let newTime = this.data.focusTimes[e.detail.value];
        this.setData({
            focusTimeIndex: e.detail.value,
            worktime: newTime
        });
      },
    bindBreakTimeChange: function(e) {
        let newTime = this.data.breakTimes[e.detail.value];
        this.setData({
          breakTimeIndex: e.detail.value,
           breaktime : newTime
        });
      },
    onLoad(){
        let res=wx.getSystemInfoSync()
        let rate=750/res.windowWidth
        this.setData({
            rate
        })

    },
    setButtonClick(){
        wx.showModal({
                    title: '提示',
                    content:'本轮专注完成',
                    showCancel:false,
                    confirmText:'好的',
                    confirmColor:'#84dcf1',
                })
    },
    onCircleButtonClick: function() {
        let timeValue = this.data.worktime;
        this.setData({
            isClock:true,
            time:this.data.worktime,
            mTime:this.data.worktime*60*1000, 
            timeStr: parseInt(timeValue) >= 10 ? timeValue + ":00" : "0" + timeValue + ":00"

        })
        wx.hideTabBar()
        drawCircle('#circle', this.data.rate);
        // console.log(this.data.break)
        this.drawActive().then(() => {
            console.log("qqqqqqqq")
            this.breakClick()
        });
        
        
      },
    drawActive(){
        return new Promise((resolve, reject) => {
            let _this = this
        var timer =setInterval(()=>{
            let angle = 1.5 + 2*(_this.data.time*60*1000 - _this.data.mTime)/(_this.data.time*60*1000);
            let currentTime = _this.data.mTime - 100
            _this.setData({
                mTime:currentTime
            })
            if(angle<3.5){
                if(currentTime % 1000 == 0){
                    var timeStr1 = currentTime / 1000;//s
                    var timeStr2 = parseInt(timeStr1 / 60); //m
                    var timeStr3 = (timeStr1 - timeStr2 * 60) >= 10 ? (timeStr1 - timeStr2 * 60) :"0" +  (timeStr1 - timeStr2 * 60);
                    var timeStr2 = timeStr2 >= 10 ? timeStr2:"0" + timeStr2;
                    _this.setData({
                     timeStr:timeStr2 + ":" + timeStr3
                    })
                  };
                const lineWidth = 5;//px
                const query = wx.createSelectorQuery()
                query.select('#circle_active')
                    .fields({ node:true, size: true})
                    .exec((res) => {
                    const canvas = res[0].node
                    const ctx = canvas.getContext('2d')
                    const dpr = wx.getSystemInfoSync().pixelRatio
                    canvas.width = res[0].width * dpr
                    canvas.height = res[0].height * dpr
                    ctx.scale(dpr, dpr)
                    ctx.lineCap='round'
                    ctx.lineWidth=lineWidth
                    ctx.beginPath()
                    ctx.arc(500/_this.data.rate/2,500/_this.data.rate/2,500/_this.data.rate/2-2*lineWidth,1.5*Math.PI,angle*Math.PI,false)
                    ctx.strokeStyle ="#84dcf1"
                    ctx.stroke()
                    })
            }else{
                console.log(this.data.break)
                if(this.data.break){
                wx.showModal({
                    title: '提示',
                    content:'恭喜你完成一次专注',
                    showCancel:false,
                    confirmText:'好的',
                    confirmColor:'#FA8072',
                    success (res) {
                      if (res.confirm) {
                        _this.setData({
                            isClock:false,
                            timeStr:"",
                            playShow:true,
                            break:false
                         })
                         wx.showTabBar() 
                      }
                    }
                })
                clearInterval(timer);
                }
                resolve();
            }    
        },100)
        _this.setData({
            timer :timer
        })
            
        });
    },
    // 暂停按钮
    ClockPause(){
        console.log(99,this.data.timer)
        clearInterval(this.data.timer);
        this.setData({
            playShow:false
        }) 
    },
    //播放按钮
    ClockPlay(){
        
        this.setData({
            playShow:true
        }) 
        this.drawActive()
    },
    //中止按钮
    ClockSuspend(){
        clearInterval(this.data.timer);
        let _this=this
        wx.showModal({
            title: '提示',
            content:'是否停止',
            confirmColor:'#84dcf1',
            success (res) {
              if (res.confirm) {
                _this.setData({
                    timeStr:"",
                    isClock:false,
                    playShow:true,
                    break:false
                })
                wx.showTabBar() 

              }else if(res.cancel){
                _this.drawActive()
              }
            }
        })
    },
    drawCircle(){
        const lineWidth = 5;
        const query = wx.createSelectorQuery()
        query.select('#circle')
            .fields({ node:true, size: true})
            .exec((res) => {
               const canvas = res[0].node
               const ctx = canvas.getContext('2d')
               const dpr = wx.getSystemInfoSync().pixelRatio
               canvas.width = res[0].width * dpr
               canvas.height = res[0].height * dpr
               ctx.scale(dpr, dpr)
               ctx.lineCap='round'
               ctx.lineWidth=lineWidth
               ctx.beginPath()
               ctx.arc(500/this.data.rate/2,500/this.data.rate/2,500/this.data.rate/2-2*lineWidth,0,2*Math.PI,false)
               ctx.strokeStyle ="#ffffff"
               ctx.stroke()
            })
    }
})
