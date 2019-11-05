// miniprogram/pages/main/main.js

Page({

  /**
   * 页面的初始数据
   */
  db: undefined,
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    scheduleArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let db = wx.cloud.database();
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.onQuery(year, now.getMonth());
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    })
  },

  onQuery: function (setYear, setMonth) {
    var start_day = new Date(setYear,setMonth,1)
    var end_day = new Date(setYear, setMonth+1, 1)
    this.db = wx.cloud.database()
    const _ = this.db.command
    // 查询当前用户所有的 counters
    this.db.collection('calendar').where({
      calendar_date: _.gte(start_day).and(_.lt(end_day))
    }).get({
      success: res => {
        this.dateInit(setYear, setMonth, res.data);
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        this.dateInit(setYear, setMonth, null);
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  dateInit: function (setYear, setMonth, sqlData) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                        //需要遍历的日历数组数据
    let arrLen = 0;                            //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();               //月份从0开始，没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);  
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();                //获取目标月有多少天
    let obj = {};
    let num = 0;
    let scheduleArr = {};
    let scheduleDate = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    
    arrLen = startWeek + dayNums;
    // console.log(sqlData);
    for (let i = 0; i < sqlData.length; i++){
      scheduleDate = sqlData[i].calendar_date.getDate();
      scheduleArr[scheduleDate] = { 'city': sqlData[i].city, "calendar_time": sqlData[i].calendar_time, "calendar_des": sqlData[i].calendar_des};
    }
    // console.log(scheduleArr);
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        if (scheduleArr.hasOwnProperty(num.toString())) {
          obj = {
            isToday: '' + year + (month + 1) + num,
            dateNum: num,
            hasSchedule: true,
            weight: 5
          }
        }
        else {
          obj = {
            isToday: '' + year + (month + 1) + num,
            dateNum: num,
            hasSchedule: false,
            weight: 5
          }
        }
        
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    // console.log(dateArr)

    this.setData({
      dateArr: dateArr,
      scheduleArr: scheduleArr
    })


    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})