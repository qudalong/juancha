var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // cartList: [],
    ordeItem:'',
    sumMonney: 0,
    cutMonney: 0,
    cupNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    var that=this;
    var orderId=options.orderId;
    ////console.log(orderId)
    ////console.log(1)
    that.setData({
      orderId: orderId
    })
    wx.setNavigationBarTitle({
      title: '订单详情'
    });

    //订单状态
    that.seachOnedown();
  },

  seachOnedown:function(){
    var that=this;
    wx.request({
      url: url + 'ShopControl/seachOnedown.htm',
      data: {
        v_phone: wx.getStorageSync('tel'),
        orderId: that.data.orderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data.dataList[0])
        if (res.data.success) {
        wx.hideLoading();
          that.setData({
            ordeItem: res.data.dataList[0]
          })
        } else {
          ////console.log("请求订单状态失败")
        }
      }
    });

  },

  //取消订单
  cancleOrder: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
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
              reason: ''
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              ////console.log(res.data)
              if (res.data.success) {
                wx.showToast({
                  title: res.data.message
                });
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                });
              }
              that.seachOnedown();
            }
          });
        } else if (res.cancel) {
        }
      }
    })
  },

  //再次退款
  againReturn: function (e) {
    var that = this;
    var shopId = e.currentTarget.dataset.shopid;
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
        that.seachOnedown();
        if (res.data.success) {
          wx.showToast({
            title: '退款成功'
          })
        } else {
          wx.showToast({
            title: '退款失败',
            icon: 'none',
          })
        }
      }
    });
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
    wx.switchTab({
      url: '/pages/order/order'
    });
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