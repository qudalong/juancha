//自定义预约时间
function time(that) {
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  //console.log(hour + ";" + minute);
  var totalNow = parseInt(hour * 60) + parseInt(minute); //装换选择时间
  var arr = ['09:45', '09:50', '09:55', '10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55', '11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30', '11:35', '11:40', '11:45', '11:50', '11:55', '12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55', '13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55', '14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30', '14:35', '14:40', '14:45', '14:50', '14:55', '15:00', '15:05', '15:10', '15:15', '15:20', '15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55', '16:00', '16:05', '16:10', '16:15', '16:20', '16:25', '16:30', '16:35', '16:40', '16:45', '16:50', '16:55', '17:00', '17:05', '17:10', '17:15', '17:20', '17:25', '17:30', '17:35', '17:40', '17:45', '17:50', '17:55', '18:00', '18:05', '18:10', '18:15', '18:20', '18:25', '18:30', '18:35', '18:40', '18:45', '18:50', '18:55', '19:00', '19:05', '19:10', '19:15', '19:20', '19:25', '19:30', '19:35', '19:40', '19:45', '19:50', '19:55', '20:00', '20:00', '20:05', '20:10', '20:15', '20:20', '20:25', '20:30', '20:35', '20:40', '20:45', '20:50', '20:55', '21:00', '21:05', '21:10', '21:15', '21:20'];
  for (var i in arr) {
    var totalM = parseInt(arr[i].split(":")[0] * 60) + parseInt(arr[i].split(":")[1])
    if (totalNow < totalM) {
      //console.log(arr[i] + " , " + i);
      break;
    }
  }
  var flag = parseInt(i) + 4;
  arr.splice(0, flag);
  that.setData({
    hours: arr
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
    jishi:true,//即时订单状态
    result:'',
    location: {},
    latitude: '',
    longitude: '',
    x: true, //营业总开关

    hide: 1, //dialog开始隐藏
    openStatus: true, //营业状态
    open: '10:05', //营业时间
    close: '21:20', //营业时间
    adress: 1, //
    current: 0, //选中状态标识
    items: 0 //
    // shopList: []//门店列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // time(that);//自定义预约时间
    //获取门店列表
    wx.showLoading({
      title: '努力加载中',
      mask: true
    });

    // 判断能不能点餐
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var totalNow = parseInt(hour * 60) + parseInt(minute); //装换选择时间
    var totalOpen = parseInt(that.data.open.split(":")[0] * 60) + parseInt(that.data.open.split(":")[1]);
    var totalClose = parseInt(that.data.close.split(":")[0] * 60) + parseInt(that.data.close.split(":")[1]);

    // 上班
    if (totalNow < totalOpen) {
      that.setData({
        x: false,
        yv: true ,//预约操作状态
        //解决未在营业时间内（选择饮品）按钮点亮问题
        openStatus:false,
        current:2
      })
    }

    //下班
    if (totalNow + 20 > totalClose) {
      that.setData({
        x: false,
        yv: false //预约操作状态
      })
    }
    //即时订单不提前20分关门
    if (totalNow> totalClose) {
      that.setData({
        jishi:false
      })
    }
    if (totalNow < totalOpen) {
      that.setData({
        jishi:false
      })
    }


    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'V5CBZ-CQCE3-VKO3I-YEHZD-NIGRT-ZPFUG'
    });



    //初始化当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        // //console.log('getLocation..........')
        // //console.log(res)
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
            //console.log(111111111111111)
            var location = res.result.address;
            var ad_info = res.result.ad_info;
            var city = res.result.address_component.city;
            //console.log('所在城市名称=' + res.result.address_component.city)
            that.setData({
              location: {
                latitude: ad_info.location.lat, //精度
                longitude: ad_info.location.lng, //
                address: location //详细地址
              }
            });
            var latLong = that.data.location.latitude + "," + that.data.location.longitude;
            wx.setStorageSync('location', location);
            wx.request({
              url: url + 'ShopControl/getAllshop.htm',
              data: {
                cityName: city, //所在城市名称(可选)
                commercialName: "眷茶", //门店名称
                latLong: latLong //经纬度 已逗号隔开
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.success) {
                  //console.log(res.data)
                  that.setData({
                    shopList: res.data.data.list,
                  });
                } else {
                  //console.log("请求门店列表失败")
                }
              }
            });
          }
        });
      }
    });
  },


  //当前时间段内不能预约点餐
  noyv: function(e) {
    wx.showToast({
      title: '当前时间段内不能预约点餐',
      icon: 'none'
    })
  },
  //切换预约时间
  bindChange: function(e) {
    var that = this;
    var val = e.detail.value
    this.setData({
      change: true, //改变时间了
      result: that.data.hours[val]||'',
      result2: that.data.hours[val]
    })
  },

  // 取消
  cancle: function() {
    var that = this;
    that.setData({
      change: false, //选择时间
      hide: !1,
      result: "",
      openStatus: false
    })
  },
  //确定
  sure: function() {
    var that = this;
    that.setData({
      hide: !1,
      openStatus: true
    });
    if (!that.data.result) {
      that.setData({
        result: that.data.result2,
      });
    }
    if (!that.data.change) {
      that.setData({
        result: that.data.hours[0]
      });
    }
  },

  //选择门店列表
  selected: function(e) {
    this.setData({
      items: e.currentTarget.dataset.items
    })
  },

  //选择取餐时间
  selectTime: function(e) {
    var that = this;
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var totalNow = parseInt(hour * 60) + parseInt(minute); //装换选择时间

    var open = e.currentTarget.dataset.open;
    var current = e.currentTarget.dataset.current;
    if (open) {
      var totalOpen = parseInt(open.split(":")[0] * 60) + parseInt(open.split(":")[1]); //转换营业时间
      if (totalNow < totalOpen) { //判断是不在营业范围内
        that.setData({
          openStatus: false,
          current: 2
        });
      }
    }
    that.setData({
      current: current,
      hide: 1
    });
    if (current == 0) {
      that.setData({
        change: false, //没有改变时间
      });
    }
    time(that); //自定义预约时间
  },



  //选择奶茶
  seletedFood: function(e) {
    var data = new Date();
    var y = data.getFullYear();
    var m = data.getMonth() + 1;
    var d = data.getDate();
    var h = data.getHours();
    // var m = data.getMinutes() + 20;
    var m = data.getMinutes() < 10 ? ('0' + data.getMinutes()): (data.getMinutes());
    //console.log('m===' + data.getMinutes())
    //console.log('m===' + m)

    var that = this;
    var time = e.currentTarget.dataset.time; //预约时间
    var id = e.currentTarget.dataset.id; //门店id
    var shop = e.currentTarget.dataset.shop; //门店名字
    var type = e.currentTarget.dataset.type; //现在1  预约2
    var adress = e.currentTarget.dataset.adress; //门店地址
    var index = e.currentTarget.dataset.index; //门店index
    //如果没有点击预约时间
    if (that.data.result) {
      var timer = that.data.result;
    } else {
      // var timer = h + ":" + (m-20);
      var timer = h + ":" + m;
    }
    //console.log('result3=' + timer)

    wx.navigateTo({
      // url: '../selectFood/selectFood?id=' + id + '&adress=' + adress + '&shop=' + shop + '&type=' + type + '&time=' + y + '-' + m + '-' + d + ' ' + that.data.result
      url: '../selectFood/selectFood?id=' + id + '&adress=' + adress + '&shop=' + shop + '&type=' + type + '&time=' + timer
    });

    wx.setStorageSync('shopDetalis', that.data.shopList[index]);

  },

  //获取当前位置
  getLocation: function() {
    var that = this;

    // this.setData({
    //   location: {
    //     address: wx.getStorageSync('location') //详细地址
    //   }
    // });
    //console.log("获取当前位置")

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
            //console.log('详细地址')
            //console.log(res)
            var location = res.result.address;
            var ad_info = res.result.ad_info;
            var city = res.result.address_component.city;
            that.setData({
              location: {
                latitude: ad_info.location.lat, //精度
                longitude: ad_info.location.lng, //
                address: location //详细地址
              }
            });
            // wx.setStorageSync('location', location);
          }
        });
        //获取门店列表
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        //console.log(that.data.location.latitude + "," + that.data.location.longitude);
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
              });
            } else {
              that.setData({
                shopList: [],
              });
              //console.log("请求门店列表失败")
            }
          }
        });
      }
    });





  },

  //选择位置
  chooseLocation: function(e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        //console.log('选择位置是')
        //console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude, //精度
            latitude: res.latitude, //维度
            name: res.name, //地址
            address: res.address //详细地址
          }
        });

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            //console.log(res)
             var city2 = res.result.address_component.city;
            //console.log('所在城市名称2=' + res.result.address_component.city)


            //获取门店列表
            var latLong = that.data.location.latitude + "," + that.data.location.longitude;
            wx.request({
              url: url + 'ShopControl/getAllshop.htm',
              data: {
                cityName: city2, //所在城市名称(可选)
                commercialName: "眷茶", //门店名称
                latLong: latLong //经纬度 已逗号隔开
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.success) {
                  //console.log(res.data)
                  that.setData({
                    shopList: res.data.data.list,
                  });
                } else {
                  that.setData({
                    shopList: [],
                  });
                  //console.log("请求门店列表失败")
                }
              }
            });
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
      imageUrl:'/image/bgone@3x.png',
      path: '/pages/index/index'
    }
  }
})