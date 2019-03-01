function getNowFormatDate(that) {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  that.setData({
    today: currentdate
  });
}
var url = getApp().globalData.url;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: '', //今天
    tel: '',
    name: '',
    sex: '',
    birthday: '',
    password: ''
  },

  onLoad: function(options) {
    var that = this;
    var tel = options.tel;
    var cardStyle = options.cardStyle;
    var quike = options.quike; //快捷绑定
    getNowFormatDate(that);
    // var tel = wx.getStorageSync('tel');
    that.setData({
      cardStyle: cardStyle,
      tel: tel
    });
    if (quike) {
      that.setData({
        quike: quike
      });
    }

    //获取门店列表(2期)
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'V5CBZ-CQCE3-VKO3I-YEHZD-NIGRT-ZPFUG'
    });
    //初始化当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          location: {
            latitude: latitude, //精度
            longitude: longitude //精度
          }
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            //console.log(res)
            var location = res.result.address;
            var ad_info = res.result.ad_info;
            that.setData({
              location: {
                latitude: ad_info.location.lat, //精度
                longitude: ad_info.location.lng, //
                address: location //详细地址
              }
            });
            wx.setStorageSync('location', location);
          }
        });
        //获取门店列表
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        var latLong = that.data.location.latitude + "," + that.data.location.longitude;
        wx.request({
          url: url + 'ShopControl/getAllshop.htm',
          data: {
            cityName: "", //所在城市名称(可选)
            commercialName: "眷茶", //门店名称
            latLong: latLong //经纬度 已逗号隔开
            // latLong: "34.788340,114.035301" //经纬度 已逗号隔开
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            wx.hideLoading();
            if (res.data.success) {
              //console.log(res.data)
              that.setData({
                shopList: res.data.data.list,
                nearby: res.data.data.list[0].commercialName //附近的店
              });
            } else {
              //console.log("请求门店列表失败")
            }
          }
        });
      }
    });
  },

  //选取门店（2期）
  selectShop: function(e) {
    wx.navigateTo({
      url: '../selectShop/selectShop',
    })
  },


  //姓名
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    });
  },

  //男女选择
  clickItem: function(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current,
      sex: e.target.dataset.current
    })
  },

  //出生日期
  bindDateChange: function(e) {
    this.setData({
      birthday: e.detail.value
    });
  },

  //出生日期
  password: function(e) {
    this.setData({
      password: e.detail.value
    });
  },

  //申请
  apply: function() {
    var that = this;
    if (!that.data.name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (!that.data.sex) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (!that.data.birthday) {
      wx.showToast({
        title: '请选择出生日期',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (that.data.password.length != 6) {
      wx.showToast({
        title: '密码格式错误',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    //查看有无绑定手机号
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'loginControl/bindOpenIdPhone.htm',
      data: {
        openId: openid, //微信唯一标识
        v_phone: that.data.tel,
        v_name: that.data.name,
        v_sex: that.data.sex,
        v_birthday: that.data.birthday,
        v_transac_pwd: that.data.password,
        shopIdentyName: that.data.nearby,
        shopIdenty: that.data.shopIdenty //商店id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '申请会员成功',
          success: function() {
            //(注册门店跳转时会有问题)
            if (that.data.cardStyle && that.data.cardStyle !="undefined") {
              wx.setStorageSync('tel', that.data.tel);
              if (that.data.quike) {
                wx.navigateBack({
                  delta: 2
                });
              } else {
                wx.navigateBack({
                  delta: 3
                });
              }
            } else {
              wx.switchTab({
                url: '../my/my'
              });
            }
          }
        });
      }
    });


  },

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