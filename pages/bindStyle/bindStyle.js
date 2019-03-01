var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var cardStyle = options.cardStyle;
    if (cardStyle) {
      this.setData({
        cardStyle: cardStyle
      });
    }

  },

  //获取微信绑定手机号
  getPhoneNumber: function(e) {
    var that = this;
    // 解秘手机号
    wx.request({
      url: url + 'cocontrol/getPhoneeInes.htm',
      method: 'POST',
      data: {
        session_key: wx.getStorageSync('session_key'),
        encryptedData: e.detail.encryptedData,
        vi: e.detail.iv
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.success) {
          var wxTel = res.data.data.phoneNumber;
          //console.log('微信手机号=' + res.data.data.phoneNumber)
          //判断是否为会员
          if (wxTel) {
            wx.request({
              url: url + 'loginControl/valiMessageCode.htm',
              data: {
                openId: wx.getStorageSync('openid'),
                v_phone: wxTel, //手机号
                i_is_weichat: 1 
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function(res) {
                //console.log(res.data);
                if (res.data.sys_info) {
                  wx.setStorageSync('tel', wxTel);
                  //console.log('已经是会员')
                  if (that.data.cardStyle) {
                    wx.navigateBack({
                      delta: 1
                    });
                  } else {
                    wx.switchTab({
                      url: '../my/my'
                    });
                  }
                } else if (res.data.success) {
                  //console.log('绑定成功')
                  wx.navigateTo({
                    url: '../vip/vip?tel=' + wxTel + '&cardStyle=' + that.data.cardStyle + '&quike=' + 1,
                  })
                }
              }
            });
          } else {
            wx.showToast({
              title: '当前微信号暂未绑定手机号，请点击下方图标输入手机号绑定',
              icon: "none"
            })
          }
        }
      },
      fail:function(){
        wx.navigateTo({
          url: '../bindTel/bindTel?cardStyle=' + that.data.cardStyle,
        })
      }
      
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
  //绑定手机号
  bindTel: function() {
    wx.navigateTo({
      url: '/pages/bindTel/bindTel'
    })
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