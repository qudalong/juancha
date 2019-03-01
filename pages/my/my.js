var url = getApp().globalData.url;
var userInfo = getApp().globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    avatarUrl: "",
    bindStatus: false//登录状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              });
              wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
              wx.setStorageSync('nickName', res.userInfo.nickName);
            }
          })
        }
      }
    });
    that.loginTag();

  },

  //查看有无绑定手机号
  loginTag: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'loginControl/loginTag.htm',
      data: {
        openId: openid,//微信唯一标识
        shopIdenty: ''//商店id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
          wx.hideLoading();   
        if (res.data.success) {   
          var message = res.data.data;
          that.setData({
            bindStatus: true,
            message: message
          });
          wx.setStorageSync('customerId', message.customerId);//顾客Id
          wx.setStorageSync('tel', message.v_phone);
          wx.setStorageSync('vipName', message.v_name)
          wx.setStorageSync('v_sex', message.v_sex)
        } else {


          that.setData({
            bindStatus: false
          });
          wx.setStorageSync('tel', '');
        }
      }

    });
  },


  //绑定手机号
  // bindTel: function () {
  //   wx.navigateTo({
  //     url: '/pages/bindStyle/bindStyle'
  //   })
  // },
  bindTel: function () {
    wx.navigateTo({
      url: '/pages/bindStyle/bindStyle'
    })
  },

  //我的信息
  myInfo: function () {
    wx.navigateTo({
      url: '/pages/myInfo/myInfo'
    })
  },


  //优惠券
  discounts: function () {
    wx.navigateTo({
      url: '/pages/coupon/coupon'
    })
  },

  //平台须知
  notice: function () {
    wx.navigateTo({
      url: '/pages/notice/notice'
    })
  },
  //退出账号
  exitOut: function () {
   wx.showModal({
     content: '确定要退出当前账号吗？',
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
    var that = this;
    that.loginTag();
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