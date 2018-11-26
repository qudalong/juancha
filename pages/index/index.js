var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration:400
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid');
   //条形码
    that.setData({
      img: url + 'adverControl/getBarCode.htm?v_phone=' + wx.getStorageSync('tel')
    });
   //获取轮播图
    wx.request({
      url: url + 'adverControl/getAlladerImage.htm',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode==200) {
          for (var i in res.data){
            that.data.imgUrls.push(url + res.data[i].v_path)
          }
          that.setData({
            imgUrls: that.data.imgUrls
          });
        }
      }
    });
  
  },


  //选择商店
  selectShop:function(){
  wx.navigateTo({
    url: '../adressList/adressList',
  })
  },

  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // that.loginTag();
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