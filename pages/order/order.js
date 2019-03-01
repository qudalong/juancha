var url = getApp().globalData.url;
Page({


  data: {
    currentTab: 0,//tab
    show: true,
    orderList: []//订单列表
  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
    }
    that.request();
  },


  onLoad: function (options) {
    var that = this;
     //全部订单
      that.seachAlldown();
  },


  seachAlldown:function(){
    wx.showLoading({
      title: '努力加载中',
       mask: true
    })
    var that=this;
    wx.request({
      url: url + 'ShopControl/seachAlldown.htm',
      data: {
        v_phone: wx.getStorageSync('tel')
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            orderList: res.data.dataList
          })
          wx.hideLoading();
        } else {
          ////console.log("请求我的订单失败")
        }
      }
    });
  },



  //取消订单
  cancleOrder: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var i = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？取消后欠款将按原路径返回',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          wx.request({
            url: url + 'ShopControl/cancelDown.htm',
            data: {
              customerId: wx.getStorageSync('customerId'),//顾客id
              orderId: orderId,
              reason: 'xxx'
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              ////console.log(res.data)
              wx.hideLoading();
                that.seachAlldown();
              if (res.data.success) {
                wx.showToast({
                  title: res.data.message
                });
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration:2000
                });
              }
            }
          });
        } else if (res.cancel) {
        }
      }
    })
  },


  //再次退款
  againReturn: function (e) {
    var that=this;
    var shopId = e.currentTarget.dataset.shopid;
    var i = e.currentTarget.dataset.index;
    var orderId = e.currentTarget.dataset.id;
    wx.request({
      url: url + 'ShopControl/againReturn.htm',
      data: {
        customerId: wx.getStorageSync('customerId'),//顾客id
        shopId: shopId,//
        v_order_no: orderId
        // orderId: orderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.seachAlldown();
        if (res.data.success){
          wx.showToast({
            title: '退款成功'
          })
        }else{
          wx.showToast({
            title: '退款失败',
            icon: 'none',
          })
        }
      }
    });
  },

  //查看详情
  orderDetails: function (e) {
    var orderId = e.currentTarget.dataset.id;
    ////console.log(orderId)
    wx.navigateTo({
      url: '../orderDetails/orderDetails?orderId=' + orderId
    })
  },

  // 选择门店
  seleteShop: function () {
    wx.navigateTo({
      url: '../adressList/adressList'
    })
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
    var that=this;
    //全部订单
    that.seachAlldown();
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
    return {
      title: '眷茶手机点餐',
      imageUrl: '/image/bgone@3x.png',
      path: '/pages/index/index'
    }
  }
})