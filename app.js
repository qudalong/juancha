//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var that=this;
          wx.request({
            url: this.globalData.url + 'ShopControl/onLogin.htm',
            method: 'POST',
            data: {
              platform: 1,
              code: res.code
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
          
              wx.setStorageSync('openid', res.data.openid);
              wx.setStorageSync('session_key', res.data.session_key);
              //判断有无手机号
              wx.request({
                url: that.globalData.url + 'loginControl/loginTag.htm',
                data: {
                  openId: wx.getStorageSync('openid')//微信唯一标识
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log(res)
                  if (res.data.success) {
                    var message = res.data.data;
                    wx.setStorageSync('tel', message.v_phone);
                    wx.setStorageSync('customerId', message.customerId);//优惠券使用
                  }
                }
              });
            }
          });

         
      
        } else {
          //console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    // url: 'http://192.168.32.203:8080/cleanpro/'
    url: 'https://www.shanjuancha.com/cleanpro/'//wai
  }
})