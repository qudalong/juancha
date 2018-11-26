//60秒倒计时
var countdown = 60;
var timeOut=null;
var settime = function (that) {

  if (countdown == 0) {
    that.setData({
      getTime: false,
      reget: true
    });
    countdown = 60;
    return;
  } else {
    that.setData({
      getTime: true,
      reget: false,
      last_time: countdown
    });
    countdown--;
  }
   timeOut=setTimeout(function () {
    settime(that)
  }
    , 1000);
}

var url = getApp().globalData.url;
Page({
  data: {
    last_time:60,
    gary: true,
    Get: false,
    telVal: '',//手机号
    code: ''//验证码
  },

  //输入手机号
  tel: function (e) {
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var myreg =/^1\d{10}$/;
    if (e.detail.value.length == 11 && myreg.test(e.detail.value)) {
      this.setData({
        gary: false,
        Get: true,
        getTime: false,
        reget: false
      });
    } else {
      clearTimeout(timeOut);
      countdown = 60;
      this.setData({
        gary: true,
        Get: false,
        getTime: false,
        reget: false
      });
    }
    this.setData({
      telVal: e.detail.value
    });

  },

  //输入验证码
  code: function (e) {
    this.setData({
      code: e.detail.value
    });

  },


  //获取验证码
  getCode: function () {
    clearTimeout(timeOut);
    countdown=60;
    var that = this;
    that.setData({
      gary: false,
      Get: false
    });
    settime(that);
    // that.setData({
    //   last_time: 60
    // });
   
     
    //获取短信验证码
    wx.request({
      url: url + 'loginControl/getMessage.htm',
      data: {
        v_phone: that.data.telVal
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data);
        if (res.data.success) {

        } else {
          //console.log('获取验证码失败')
        }
      }
    });



  },

  //绑定手机号
  bind: function () {
    var that = this;
    var tel = that.data.telVal;
    var code = that.data.code;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (tel.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (tel.length != 11 || !myreg.test(tel)) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (code.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      });
      return;
    }



    //验证短信验证码是否有效
    wx.request({
      url: url + 'loginControl/valiMessageCode.htm',
      data: {
        openId: wx.getStorageSync('openid'),
        v_phone: that.data.telVal,//手机号
        v_code: code//验证码
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.sys_info) {
          wx.setStorageSync('tel', that.data.telVal);
          console.log('已经是会员')
          if (that.data.cardStyle){
            wx.navigateBack({
              delta:1
            });
          }else{
          wx.switchTab({
            url: '../my/my'
          });
          }
        } else if (res.data.success){
          console.log('绑定成功')
          wx.navigateTo({
            url: '../vip/vip?tel=' + that.data.telVal + '&cardStyle=' + that.data.cardStyle,
          })
        } else {
          wx.showToast({
            title: '输入验证码有误',
            icon: 'none',
          })
        }
      }
    });

    // wx.setStorageSync('tel', tel);
    //       wx.navigateTo({
    //         url: '../vip/vip',
    //       })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setStorageSync('tel', '');
    var cardStyle = options.cardStyle;
    if (cardStyle){
    this.setData({
      cardStyle: cardStyle
    });
    }
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
    // this.setData({
    //   last_time: 60
    // });
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