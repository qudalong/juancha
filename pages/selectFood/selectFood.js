var url = getApp().globalData.url;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerArr: [],
    waidai: {
      name: "芝士打包盒",
      price: 1,
      status: 0
    },
    aIcon: [
      '/image/milk_tea@3x.png',
      '/image/fruit_tea@3x.png',
      '/image/artisticconception_tea@3x.png',
      '/image/lowfat_tea@3x.png',
      '/image/goldmedal_tea@3x.png',
      '/image/hybrid_tea@3x.png',
      '/image/handblunt_tea@3x.png',
      '/image/dimsum_tea@3x.png',
      '/image/giftbox_tea@3x.png',
    ],
    clickStatus: true, //购物车点击状态，防止连续点击
    listData: [],
    activeIndex: 0,
    toView: 'a0',
    scrollTop: 100,
    screenWidth: 667,
    showModalStatus: false,
    showDetails: false,
    currentType: 0,
    currentIndex: 0,
    sizeIndex: 0,
    sugarIndex: 0,
    temIndex: 0,
    sugar: ['常规糖', '无糖', '微糖', '半糖', '多糖'],
    tem: ['常规冰', '多冰', '少冰', '去冰', '温', '热'],
    size: ['常规', '燕麦', '西米露'],
    cartList: [],
    sumMonney: 0,
    cupNumber: 0,
    showCart: false,
    loading: false,
    windowHeight: '',
    number: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var time = options.time
    var shopId = options.id
    var shop = options.shop
    var adress = options.adress
    var type = options.type //取餐类型 现在1  预约2
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    //////console.log('windowHeight=' + sysinfo)
    //////console.log('time=' + time)
    wx.setNavigationBarTitle({
      title: shop
    });
    that.setData({
      shopId: shopId,
      time: time,
      type: type,
      adress: adress,
      windowHeight: sysinfo,
      goodHeight: sysinfo - 52,
    })
    // //////////console.log(sysinfo)
    wx.showLoading({
      title: '努力加载中',
      mask: true
    });
    //获取左边导航栏
    wx.request({
      url: url + 'ShopControl/getCategoryByShopId.htm',
      data: {
        shopId: shopId, //门店id
        // shopId: '810130245',//门店id
        startId: 1,
        pageNum: 1000
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.success) {
          var listData = res.data.dataList;
          var len = listData.length;
          //追加path
          for (var i in listData) {
            listData[i].v_path ? listData[i].v_path = url + listData[i].v_path:''
          }

          that.setData({
            listData: listData,
            len: len,
            loading: true
          });
          //计算单个菜品高度
          var arr = [];
          for (var i = 0; i < that.data.len; i++) {
            if (i == 0) {
              var itemH = that.data.listData[i].diss.length * 90 + 20 + that.data.bannerArr.length * 105 ;
            } else {
              var itemH = that.data.listData[i].diss.length * 90 + 20; //最后一个没有下边框
            }
            arr.push(itemH)
          }
          that.setData({
            arr: arr
          });
        } 
      }
    });

    //获取banner
    wx.request({
      url: url + 'adverControl/getAllxcImage.htm',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          for (var i in res.data) {
            that.data.bannerArr.push(url + res.data[i].v_path)
          }
          that.setData({
            bannerArr: that.data.bannerArr
          });
        }
      }
    });
  },
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.index
    ////console.log(this.data.arr)
    ////console.log('第' + (index + 1) + "个栏目")
    this.setData({
      activeIndex: index,
      toView: 'a' + index,
    })

  },

  //商品详情
  goodDetail: function(e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setData({
      showDetails: !this.data.showDetails,
      currentType: type,
      currentIndex: index
    });
  },
  closeShowDetails: function() {
    this.setData({
      showDetails: !this.data.showDetails
    });
  },


  //外带选择
  waidai: function(e) {
    var that = this;
    var wname = e.currentTarget.dataset.wname;
    that.data.waidai.status = !that.data.waidai.status;
    that.setData({
      wname: wname,
      waidai: that.data.waidai
    });
  },

  selectInfo: function(e) {
    var that = this;
    that.data.waidai.status=0;
    //防止连点购物车

    that.setData({
      itemName: '',
      waidai: that.data.waidai,
      showDetails: false,
      clickStatus: true
    });
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var total = e.currentTarget.dataset.total;
    if (total==2) {
      wx.showToast({
        title: '对不起，该商品已售罄！',
        icon: 'none'
      });
      return;
    }

    var aTem = this.data.listData[type].diss[index].supplyCondiments;
    var size = this.data.listData[type].diss[index].attrs;
    ////console.log("加料.........")
    ////console.log(aTem)
    //小料
    if (aTem && aTem[0].name != '常规') {
      aTem.unshift({
        'id': 1,
        'name': '常规',
        'marketPrice': 0
      });
    }
    //温度+糖度
    if (size) {
      var wd = []; //温度
      var td = []; //糖度
      for (var i in size) {
        if (size[i].type == 1) {
          if (size[i].name.indexOf(" ") != -1 || size[i].name.length == 1) {
            wd.push(size[i].name)
          } else {
            td.push(size[i].name)
          }
        }
      }
      //添加常规
      if (wd && wd[0] != '常规') {
        wd.unshift('常规');
      }
      if (td && td[0] != '常规糖') {
        td.unshift('常规糖');
      }
    }

    // //////console.log(wd)
    // //////console.log(td)
    this.setData({
      wd: wd,
      td: td,
      listData: this.data.listData,
      size: size, //温度+糖度
      tem: aTem, //后加的小料
      showModalStatus: !this.data.showModalStatus,
      currentType: type,
      currentIndex: index,
      sizeIndex: 0,
      sugarIndex: 0,
      temIndex: 0
    });

  },
  selectInfo2: function() {
    this.setData({
      showModalStatus: !this.data.showModalStatus
    });
  },
  chooseSE: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var itemName = e.currentTarget.dataset.name;
    if (type == 0) {
      this.setData({
        sizeIndex: index
      });
    }
    if (type == 1) {
      this.setData({
        sugarIndex: index
      });
    }
    if (type == 2) {
      this.setData({
        temIndex: index
      });
    }

    //判断外带使用
    if (itemName) {
      that.setData({
        wname: '',
        itemName: itemName,
        waidai: that.data.waidai
      });
    }
    if (itemName != "低脂芝士" && itemName != "芝士") {
      that.data.waidai.status = 0;
      that.setData({
        waidai: that.data.waidai
      });
    }
  },

  //添加购物车
  addToCart: function(e) {
    //////console.log("click");
    var that = this;
    //防止重复点击
    that.setData({
      clickStatus: false
    });


    //外带初始化（隐藏）
    that.data.waidai.status = 0
      this.setData({
        itemName: '',
        waidai: that.data.waidai
      });

    var f = false;
    var a = this.data
    var currentFoodName = a.listData[a.currentType].diss[a.currentIndex]; //当前菜品名字
    //减号判断
    if (currentFoodName.num) {
      currentFoodName.num = currentFoodName.num + 1;
    } else {
      currentFoodName.num = 1;
    }
    that.setData({
      listData: a.listData
    });
    // ////////console.log(currentFoodName)

    //判断有无小料
    var supplyCondiments = a.listData[a.currentType].diss[a.currentIndex].supplyCondiments;
    // ////////console.log(supplyCondiments)
    if (supplyCondiments) {
      var marketPrice = supplyCondiments[a.temIndex].marketPrice;
    } else {
      var marketPrice = 0;
    }

    if (a.wname) {
      var price = parseInt(a.listData[a.currentType].diss[a.currentIndex].price * 100) + parseInt(marketPrice * 100) + 100;
    } else {
      var price = parseInt(a.listData[a.currentType].diss[a.currentIndex].price * 100) + parseInt(marketPrice * 100);
    }
    //////console.log('a.size')
    //////console.log(a.size)
    //////console.log(a.tem)
    if (a.size.length || a.tem) {
      if (a.tem) {
        //外带判断
        if (a.wname) {
          var remark = a.tem[a.temIndex].name + "+" + a.wd[a.sizeIndex] + "+" + a.td[a.sugarIndex] + "+" + a.wname;
        } else {
          var remark = a.tem[a.temIndex].name + "+" + a.wd[a.sizeIndex] + "+" + a.td[a.sugarIndex];
        }
      } else {
        var remark = a.wd[a.sizeIndex] + "+" + a.td[a.sugarIndex];
      }
      //////console.log(remark)
      var remark_gg = a.wd[a.sizeIndex] + "+" + a.td[a.sugarIndex];
      //////console.log(remark_gg)
    } else {
      var remark = a.wd[a.sizeIndex] + "+" + a.td[a.sugarIndex];
      var remark_gg = a.wd[a.sizeIndex] + "+" + a.td[a.sugarIndex];
      // var remark_gg = '';
    }
    if (a.tem) {
      var remark_xl = a.tem[a.temIndex].name;
    } else {
      var remark_xl = '';
    }
 
    var addItem = {
      "name": a.listData[a.currentType].diss[a.currentIndex].name,
      "id": a.listData[a.currentType].diss[a.currentIndex].id,
      "typeName": a.listData[a.currentType].name,
      "tpId": a.listData[a.currentType].diss[a.currentIndex].id,
      "quantity": 1, //number
      "price": price, //转成分
      "packagePrice": 0,
      "packageQuantity": 0,
      // "remark": a.size[a.sizeIndex].name+ "+" + a.sugar[a.sugarIndex] + "+" + a.tem[a.temIndex],
      "remark": remark,
      "remark_xl": remark_xl, //小料
      "remark_gg": remark_gg, //规格
      "totalFee": price, //sum
      "imgUrl": a.listData[a.currentType].diss[a.currentIndex].imgUrl
    }

    var sumMonney = a.sumMonney + price;
    var cartList = that.data.cartList;


    //遍历购物车找到被点击的菜品，数量加1
    if (that.data.cartList) {
      for (var i in cartList) {
        if (cartList[i].name == a.listData[a.currentType].diss[a.currentIndex].name && cartList[i].remark == remark) {
          cartList[i].quantity += 1;
          f = true;
          break;
        }
      }
    }
    if (!f) {
      cartList.push(addItem);
    }
    that.setData({
      cartList: cartList,
      showModalStatus: false,
      sumMonney: sumMonney,
      cupNumber: a.cupNumber + 1
    });
  },
  showCartList: function() {
    var that = this;
    if (that.data.cartList.length != 0) {
      that.setData({
        showCart: !that.data.showCart,
      });
    }

  },
  clearCartList: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否清空购物车内所有商品？',
      success: function(res) {
        if (res.confirm) {
          //清空商品列表数量
          for (var i in that.data.listData) {
            for (var j in that.data.listData[i].diss) {
              if (that.data.listData[i].diss[j].num) {
                that.data.listData[i].diss[j].num = 0
              }
            }
          }
          that.setData({
            listData: that.data.listData,
            cartList: [],
            showCart: false,
            cupNumber: 0,
            sumMonney: 0
          });
        } else if (res.cancel) {}
      }
    });
  },
  //点击减号弹出购物车
  minus: function() {
    this.setData({
      showCart: true
    });
  },
  //加商品
  addNumber: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cartList = this.data.cartList;
    cartList[index].quantity++;
    var totalFee = this.data.sumMonney + cartList[index].price;

    //减号判断
    var a = this.data
    for (var i in a.listData) {
      for (var j in a.listData[i].diss) {
        var aDiss = a.listData[i].diss;
        if (cartList[index].typeName == a.listData[i].name && cartList[index].name == a.listData[i].diss[j].name) {
          a.listData[i].diss[j].num = a.listData[i].diss[j].num + 1;
          that.setData({
            listData: a.listData
          });
        }
      }
    }
    cartList[index].totalFee += cartList[index].price;
    this.setData({
      cartList: cartList,
      sumMonney: totalFee,
      cupNumber: this.data.cupNumber + 1
    });
  },
  decNumber: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cartList = this.data.cartList;

    //减号判断
    var a = this.data
    for (var i in a.listData) {
      for (var j in a.listData[i].diss) {
        var aDiss = a.listData[i].diss;
        if (cartList[index].typeName == a.listData[i].name && cartList[index].name == a.listData[i].diss[j].name) {
          a.listData[i].diss[j].num = a.listData[i].diss[j].num - 1;
          that.setData({
            listData: a.listData
          });
        }
      }
    }

    var totalFee = this.data.sumMonney - cartList[index].price;
    cartList[index].totalFee -= cartList[index].price;
    cartList[index].quantity == 1 ? cartList.splice(index, 1) : cartList[index].quantity--;
    this.setData({
      cartList: cartList,
      sumMonney: totalFee,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber - 1
    });

  },
  goBalance: function() {
    var that = this;
    var tel = wx.getStorageSync('tel');
    if (!tel) { //判断帮号没有
      wx.navigateTo({
        url: '../bindStyle/bindStyle?cardStyle=' + 1
      });
    } else {
      if (this.data.sumMonney != 0) {
        wx.setStorageSync('cartList', this.data.cartList);
        wx.setStorageSync('sumMonney', this.data.sumMonney);
        wx.setStorageSync('cupNumber', this.data.cupNumber);
        wx.navigateTo({
          url: '../balance/balance?adress=' + that.data.adress + '&type=' + that.data.type + '&time=' + that.data.time + '&shopId=' + that.data.shopId
        })
      }
    }
  },

  onReady: function() {

  },

  scroll: function(e) {
    var a = this.data;
    var h0 = a.arr[0];
    var h1 = a.arr[0] + a.arr[1];
    var h2 = a.arr[0] + a.arr[1] + a.arr[2];
    var h3 = a.arr[0] + a.arr[1] + a.arr[2] + a.arr[3];
    var h4 = a.arr[0] + a.arr[1] + a.arr[2] + a.arr[3] + a.arr[4];
    var h5 = a.arr[0] + a.arr[1] + a.arr[2] + a.arr[3] + a.arr[4] + a.arr[5];
    var h6 = a.arr[0] + a.arr[1] + a.arr[2] + a.arr[3] + a.arr[4] + a.arr[5] + a.arr[6];
    var h7 = a.arr[0] + a.arr[1] + a.arr[2] + a.arr[3] + a.arr[4] + a.arr[5] + a.arr[6] + a.arr[7];
    var h8 = a.arr[0] + a.arr[1] + a.arr[2] + a.arr[3] + a.arr[4] + a.arr[5] + a.arr[6] + a.arr[7] + a.arr[8];

    var dis = e.detail.scrollTop

    if (dis > 0 && dis < h0) {
      this.setData({
        activeIndex: 0
      })

      return;
    }
    if (dis >= h0 && dis < h1) {
      this.setData({
        activeIndex: 1
      })

      return;
    }
    if (dis > h1 && dis < h2) {
      this.setData({
        activeIndex: 2
      })
      //////console.log(a.activeIndex);
      return;
    }
    if (dis > h2 && dis < h3) {
      this.setData({
        activeIndex: 3
      })
      // ////////console.log(a.activeIndex);
      return;
    }
    if (dis > h3 && dis < h4) {
      this.setData({
        activeIndex: 4
      })
      //////////console.log(a.activeIndex);
      return;
    }
    if (dis > h4 && dis < h5) {
      this.setData({
        activeIndex: 5
      })
      // ////////console.log(a.activeIndex);
      return;
    }
    if (dis > h5 && dis < h6) {
      this.setData({
        activeIndex: 6
      })
      // ////////console.log(a.activeIndex);
      return;
    }
    if (dis > h6 && dis < h7) {
      this.setData({
        activeIndex: 7
      })
      //////////console.log(a.activeIndex);
      return;
    }
    if (dis > h7 && dis < h8) {
      this.setData({
        activeIndex: 8
      })
      //////////console.log(a.activeIndex);
      return;
    }
    if (dis > h8) {
      this.setData({
        activeIndex: 9
      })
      //////////console.log(a.activeIndex);
      return;
    }


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