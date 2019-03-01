var url = getApp().globalData.url;
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list1: [], //未使用
    // list1: [1, 2, 3]
    list2: [], //已使用
    list3: [], //已过期
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var a = that.data;
    wx.showLoading({
      title: '加载中',
    });
    //获取所有标签
    wx.request({
      url: url + 'cocontrol/getAllyhq.htm',
      method: 'POST',
      data: {
        customerId: wx.getStorageSync('customerId')
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: function(res) {
        //console.log(res)
        wx.hideLoading();
        if (res.data.success) {
          var dataList = res.data.dataList;
          if (dataList.length) {
            for (var i in dataList) {
              // 临时添加 点击伸缩用
              dataList[i].flag = false;
              // 格式化星期
              var week = dataList[i].week.split("");
              //console.log(week)
              if (week[0] == 0) {
                dataList[i].week = "周日不可用"
              } else if (week[1] == 0) {
                dataList[i].week = "周一不可用"
                //console.log(1)
              } else if (week[2] == 0) {
                dataList[i].week = "周二不可用"
                //console.log(2)
              } else if (week[3] == 0) {
                dataList[i].week = "周三不可用"
              } else if (week[4] == 0) {
                dataList[i].week = "周四 不可用"
              } else if (week[5] == 0) {
                dataList[i].week = "周无不可用"
              } else if (week[6] == 0) {
                dataList[i].week = "周六不可用"
              } else {
                dataList[i].week = "全周可用"
              }

              if (dataList[i].couponStatus == 1) {
                a.list1.push(dataList[i])
              } else if (dataList[i].couponStatus == 2) {
                a.list2.push(dataList[i])
              } else if (dataList[i].couponStatus == 3) {
                a.list3.push(dataList[i])
              }
            }
            //1:未使用;2:已使用;3:已过期;
            that.setData({
              dataList: dataList,
              list1: a.list1,
              list2: a.list2,
              list3: a.list3
            });
          }
          //console.log(a.list1)
        }
      }
    });
  },

  //点击tab切换 
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },

  // 伸缩
  toggle: function(e) {
    var that = this;
    var a = that.data;
    var index = e.currentTarget.dataset.index;
    //console.log(index)
    for (var i in a.list1) {
      a.list1[index].flag = !a.list1[index].flag;
    }
    // for (var i in a.list2) {
    //   a.list2[index].flag = !a.list2[index].flag;
    // }
    // for (var i in a.list3) {
    //   a.list3[index].flag = !a.list3[index].flag;
    // }
    that.setData({
      dataList: a.dataList,
      list1: a.list1,
      list2: a.list2,
      list3: a.list3
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '眷茶手机点餐',
      imageUrl: '/image/bgone@3x.png',
      path: '/pages/index/index'
    }
  }
})