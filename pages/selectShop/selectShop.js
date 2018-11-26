

var url = getApp().globalData.url;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {},
    latitude: '',
    longitude: '',
    x: true, //营业总开关

    hide: 1, //dialog开始隐藏
    openStatus: true, //营业状态
    open: '10:05', //营业时间
    close: '21:00', //营业时间
    adress: 1, //
    current: 0, //选中状态标识
    items: 0 //
    // shopList: []//门店列表
  },

  // 选好店了(2期)
  selectOk:function(e){
    var shopname = e.currentTarget.dataset.shopname;
    var shopid = e.currentTarget.dataset.id;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      nearby: shopname,
      shopIdenty: shopid
    });
   wx.navigateBack({
     delta:1
   });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

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
        yv: true,//预约操作状态
        //解决未在营业时间内（选择饮品）按钮点亮问题
        openStatus: false,
        current: 2
      })
    }

    //下班
    if (totalNow + 20 > totalClose) {
      that.setData({
        x: false,
        yv: false //预约操作状态
      })
    }


    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'V5CBZ-CQCE3-VKO3I-YEHZD-NIGRT-ZPFUG'
    });



    //初始化当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
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
          success: function (res) {
            console.log(res)
            var location = res.result.address;
            var ad_info = res.result.ad_info;
            var city = res.result.address_component.city;
            console.log('当前位置=' + city)
            that.setData({
              location: {
                latitude: ad_info.location.lat, //精度
                longitude: ad_info.location.lng, //
                address: location //详细地址
              }
            });
            wx.setStorageSync('location', location);
            //获取门店列表
            wx.showLoading({
              title: '努力加载中',
              mask: true
            });
            console.log(that.data.location.latitude + "," + that.data.location.longitude);
            var latLong = that.data.location.latitude + "," + that.data.location.longitude;
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
                  console.log(res.data)
                  that.setData({
                    shopList: res.data.data.list,
                  });
                } else {
                  console.log("请求门店列表失败")
                }
              }
            });
          }
        });
       
      }
    });
    // console.log(that.data.latitude + "," + that.data.longitude);
    // that.selectTime(e);//(没任何操作就选及时订单)
  },


  //当前时间段内不能预约点餐
  noyv: function (e) {
    wx.showToast({
      title: '当前时间段内不能预约点餐',
      icon: 'none'
    })
  },
  //切换预约时间
  bindChange: function (e) {
    var that = this;
    var val = e.detail.value
    this.setData({
      change: true, //改变时间了
      result: that.data.hours[val],
      result2: that.data.hours[val]
    })
  },

  // 取消
  cancle: function () {
    var that = this;
    that.setData({
      change: false, //选择时间
      hide: !1,
      result: "",
      openStatus: false
    })
  },
  //确定
  sure: function () {
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
  selected: function (e) {
    this.setData({
      items: e.currentTarget.dataset.items
    })
  },

  //选择取餐时间
  selectTime: function (e) {
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
  },



  //选择奶茶
  seletedFood: function (e) {
    var data = new Date();
    var y = data.getFullYear();
    var m = data.getMonth() + 1;
    var d = data.getDate();
    var h = data.getHours();
    // var m = data.getMinutes() + 20;
    var m = data.getMinutes() < 10 ? ('0' + data.getMinutes()) : (data.getMinutes());

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
    console.log('result1=' + timer)

    wx.navigateTo({
      // url: '../selectFood/selectFood?id=' + id + '&adress=' + adress + '&shop=' + shop + '&type=' + type + '&time=' + y + '-' + m + '-' + d + ' ' + that.data.result
      url: '../selectFood/selectFood?id=' + id + '&adress=' + adress + '&shop=' + shop + '&type=' + type + '&time=' + timer
    });

    wx.setStorageSync('shopDetalis', that.data.shopList[index]);

  },

  //获取当前位置
  getLocation: function () {
    var that = this;

    // this.setData({
    //   location: {
    //     address: wx.getStorageSync('location') //详细地址
    //   }
    // });
    console.log("获取当前位置")

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'V5CBZ-CQCE3-VKO3I-YEHZD-NIGRT-ZPFUG'
    });



    //初始化当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
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
          success: function (res) {
            console.log('详细地址')
            console.log(res)
            var location = res.result.address;
            var ad_info = res.result.ad_info;
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
        console.log(that.data.location.latitude + "," + that.data.location.longitude);
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
          success: function (res) {
            wx.hideLoading();
            if (res.data.success) {
              console.log(res.data)
              that.setData({
                shopList: res.data.data.list,
              });
            } else {
              that.setData({
                shopList: [],
              });
              console.log("请求门店列表失败")
            }
          }
        });
      }
    });





  },

  //选择位置
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log('选择位置是')
        console.log(res)
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
            console.log(res)
            var city = res.result.address_component.city;

            //获取门店列表
            var latLong = that.data.location.latitude + "," + that.data.location.longitude;
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
                  console.log(res.data)
                  that.setData({
                    shopList: res.data.data.list,
                  });
                } else {
                  that.setData({
                    shopList: [],
                  });
                  console.log("请求门店列表失败")
                }
              }
            });
          }
        })




   
      }
    });
  },

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
    return {
      title: '眷茶手机点餐',
      imageUrl: '/image/bgone@3x.png',
      path: '/pages/index/index'
    }
  }
})