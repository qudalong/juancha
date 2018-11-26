//自定义预约时间
function timer(that) {
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var totalNow = parseInt(hour * 60) + parseInt(minute); //装换选择时间
  var arr = ['09:45', '09:50', '09:55', '10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55', '11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30', '11:35', '11:40', '11:45', '11:50', '11:55', '12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55', '13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55', '14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30', '14:35', '14:40', '14:45', '14:50', '14:55', '15:00', '15:05', '15:10', '15:15', '15:20', '15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55', '16:00', '16:05', '16:10', '16:15', '16:20', '16:25', '16:30', '16:35', '16:40', '16:45', '16:50', '16:55', '17:00', '17:05', '17:10', '17:15', '17:20', '17:25', '17:30', '17:35', '17:40', '17:45', '17:50', '17:55', '18:00', '18:05', '18:10', '18:15', '18:20', '18:25', '18:30', '18:35', '18:40', '18:45', '18:50', '18:55', '19:00', '19:05', '19:10', '19:15', '19:20', '19:25', '19:30', '19:35', '19:40', '19:45', '19:50', '19:55', '20:00', '20:00', '20:05', '20:10', '20:15', '20:20', '20:25', '20:30', '20:35', '20:40', '20:45', '20:50', '20:55', '21:00', '21:05', '21:10', '21:15', '21:20'];
  for (var i in arr) {
    var totalM = parseInt(arr[i].split(":")[0] * 60) + parseInt(arr[i].split(":")[1])
    if (totalNow < totalM) {
      // //console.log(arr[i] + " , " + i);
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickOk: false,
    time: '',
    chenged: false, //没滑动
    teaxt: true,
    change: false,
    show: false,
    cartList: [],
    sumMonney: 0,
    cutMonney: 0,
    cupNumber: 0,
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    timer(that); //自定义预约时间
    var shopId = options.shopId; //门店id
    var adress = options.adress; //门店地址
    var type = options.type; //取餐方式
    var time = options.time; //预约时间
    // var hour=time.split(' ')[1];//加年月日的时候
    var hour = time;
    var openid = wx.getStorageSync('openid')
    wx.setNavigationBarTitle({
      title: '提交订单'
    });
    that.setData({
      shopId: shopId,
      hour: hour,
      time: time,
      type: type,
      adress: adress, //门店地址
      openid: openid,
      cartList: wx.getStorageSync('cartList'),
      sumMonney: wx.getStorageSync('sumMonney'),
      cupNumber: wx.getStorageSync('cupNumber'),
    })

  },
  //显示之定义时间弹窗
  showZ: function() {
    this.setData({
      show: true,
      teaxt: false,
      chenged: false //滑动了
    })
  },
  // 取消
  cancle: function() {
    var that = this;
    that.setData({
      change: false,
      show: false,
      result: "",
      teaxt: true,
      time: that.data.time //如果没改变时间
    })
  },
  //确定{滑动了}
  sure: function() {
    var that = this;
    that.setData({
      change: true,
      show: false,
      result: that.data.result,
      teaxt: true,
      time: that.data.result //如果改变时间
    });
  },
  //确定{没滑动}
  sure2: function() {
    var that = this;
    console.log("确定没滑动时间=" + that.data.hours[0])
    timer(that); //自定义预约时间
    that.setData({
      change: true,
      show: false,
      result: that.data.hours[0],
      teaxt: true,
      // time: that.data.result //如果改变时间
      time: that.data.hours[0] //如果改变时间
    });
  },


  //切换预约时间
  bindChange: function(e) {
    var that = this;
    timer(that); //自定义预约时间
    var val = e.detail.value
    this.setData({
      chenged: true, //滑动了
      // show: true,
      result: that.data.hours[val]
    })
    //console.log(that.data.result)
  },


  //备注
  remark: function(e) {
    this.setData({
      remark: e.detail.value,
      len: e.detail.value.length
    });
    wx.setStorageSync('remark', e.detail.value);
  },

  //去支付
  gopay: function() {
    var that = this;
    //防止重复点击
    that.setData({
      clickOk: true
    });
    var shopDetalis = wx.getStorageSync('shopDetalis');
    var v_sex = wx.getStorageSync('v_sex');
    wx.request({
      url: url + 'ShopControl/createOrder.htm',
      data: {
        shopId: that.data.shopId,
        openId: that.data.openid, //唯一表示
        total_fee: that.data.sumMonney //金额（分）
        // total_fee:100//金额（分）
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        var tempres = res;
        wx.setStorageSync('orderId', res.data.out_trade_no);
        that.setData({
          orderId: res.data.out_trade_no,
          nonce_str: res.data.nonceStr,
          paysign: res.data.paySign,
          prepay_id: res.data.prepay_id//后加的
        });
     
        var remark = that.data.remark ? that.data.remark : ''
        //判断性别
        var xb = v_sex == "女"?0:1

        var kryOrder = {
          "tpOrderId": res.data.out_trade_no, //订单号：这个订单号是调用createOrder支付的时候反给你的数据out_trade_no
          "needInvoice": 0,
          "invoiceTitle": "0",
          "taxpayerId": 0,
          "createTime": 1491906548372,
          "peopleCount": 1,
          "remark": remark,
          "status": 2,
          "totalPrice": that.data.sumMonney,
          "shopIdenty": shopDetalis.commercialID, //店铺id
          "tpShopId": "247900001",
          "shopName": shopDetalis.commercialName, //店铺名称
          "customers": [{
            "id":'',//会员ID
            "phoneNumber": wx.getStorageSync('tel'),//会员电话
            "name": wx.getStorageSync('vipName'),//会员姓名
            "gender": xb//会员性别
          }],
          "products": that.data.cartList,

          "delivery": {
            "expectTime": 0,
            "deliveryParty": 3,
            "receiverName": wx.getStorageSync('vipName'),
            "receiverPhone": "",
            "receiverGender": xb, //性别
            // "delivererPhone": "13112222222",
            // "delivererAddress": "四川成都",
            // "coordinateType": 1,
            // "longitude": 113.66072,
            // "latitude": 34.79977
          },
          "payment": {
            "totalFee": that.data.sumMonney,
            "deliveryFee": 0,
            "packageFee": 0,
            "discountFee": 0,
            "platformDiscountFee": 0,
            "shopDiscountFee": 0,
            "shopFee": that.data.sumMonney,
            "userFee": that.data.sumMonney,
            "serviceFee": 0,
            "subsidies": 0,
            "payType": 2,
            "totalDiscountFee": 0
          }
        }

        //调用后台保存客如云数据
        wx.request({
          url: url + 'ShopControl/savekryOrder.htm',
          data: {
            customerId: wx.getStorageSync('customerId'), //顾客id
            commercialAddress: that.data.adress, //门店地址
            kryOrder: JSON.stringify(kryOrder),
            v_phone: wx.getStorageSync('tel'), //下单人手机号,
            i_total_fee: that.data.sumMonney, //下单钱数,
            i_down_type: that.data.type, //下单类型:1：实时订单 2：预约订单,
            v_data_reservation: that.data.time, //预约时间，当下单类型为2时，此值必须要传递，时分
            prepay_id: that.data.prepay_id//后加的门店id
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            console.log(res);
            if (res.data.success) {
              //微信支付接口
              if (res.data) {
                wx.requestPayment({
                  'timeStamp': tempres.data.timeStamp,
                  'nonceStr': tempres.data.nonceStr,
                  'package': tempres.data.package,
                  'signType': 'MD5',
                  'paySign': tempres.data.paySign,
                  'success': function(res) {
                    wx.request({
                      url: url + 'ShopControl/updateTorder.htm',
                      data: {
                        v_order_no: that.data.orderId,
                      },
                      method: 'POST',
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function(res) {}
                    });

                    console.log("支付成功啦！");
                    wx.showLoading({
                      title: '加载中'
                    });
                    //支付成功调到
                    wx.navigateTo({
                      url: '../orderDetails/orderDetails?orderId=' + that.data.orderId
                    });
                  },
                  'fail': function(res) {
                    //去支付回复可点击点击
                    that.setData({
                      clickOk: false
                    });
                    console.log('支付失败');
                    wx.hideLoading();
                  }
                });
              }
            } else {
              wx.showToast({
                title: '网络异常',
                icon: 'none'
              })
            }
          }
        });
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