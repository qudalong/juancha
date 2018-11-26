var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    click: true,
    btnStatus: true,
    arr: [],
    ck: false,
    itemArr: [],
    imgArr: [],
    ckArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var a = that.data;
    var v_order_no = options.v_order_no ? options.v_order_no : "55340328873361407";
    //获取所有标签
    wx.request({
      url: url + 'cocontrol/seachAllstar.htm',
      method: 'POST',
      data: {},
      header: {
        token: wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.success) {
          console.log(res.data.dataList)
          that.setData({
            dataList: res.data.dataList
          });
        }
      }
    });

    //回显查询
    wx.request({
      url: url + 'cocontrol/getCocoByOrder.htm',
      method: 'POST',
      data: {
        v_order_no: v_order_no
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log('回显.....................')
        console.log(res)
        if (res.data.data) {

          var i_star = res.data.data.i_star;
          var commTrys = res.data.data.commTrys;
          var v_path = url + res.data.data.v_path;
          console.log(v_path)
          //回显点亮星星
          for (var i = 0; i < i_star; i++) {
            that.data.imgArr[i] = '/image/star_solid@3x.png'
          }
          // 回显标签
          if (i_star == 1) {
            for (var i in a.dataList) {
              if (a.dataList[i].i_star_num == 1) {
                a.arr.push(a.dataList[i])
              }
            }
          } else if (i_star == 2) {
            for (var i in a.dataList) {
              if (a.dataList[i].i_star_num == 2) {
                a.arr.push(a.dataList[i])
              }
            }
          } else if (i_star == 3) {
            for (var i in a.dataList) {
              if (a.dataList[i].i_star_num == 3) {
                a.arr.push(a.dataList[i])
              }
            }
          } else if (i_star == 4) {
            for (var i in a.dataList) {
              if (a.dataList[i].i_star_num == 4) {
                a.arr.push(a.dataList[i])
              }
            }
          } else if (i_star == 5) {
            for (var i in a.dataList) {
              if (a.dataList[i].i_star_num == 5) {
                a.arr.push(a.dataList[i])
              }
            }
          }
          //回显点亮
          console.log(commTrys)
          console.log(a.arr)
          for (var i in a.arr) {
            for (var j in commTrys) {
              if (a.arr[i].v_remake == commTrys[j].v_mark) {
                a.arr[i].i_flag = 0;
              }
            }
          }
          that.setData({
            imageURL: v_path,
            backData: res.data.data,
            imgArr: that.data.imgArr,
            arr: that.data.arr,
            btnStatus: false
          });

        }
      }
    });

    //初始化星星
    for (var i = 0; i < 5; i++) {
      that.data.imgArr[i] = '/image/star_line@3x.png'
    }
    that.setData({
      imgArr: that.data.imgArr,
      v_order_no: v_order_no
    });
  },

  //提交
  submit: function() {
    var that = this;
    var a = that.data;

    if (!a.v_star) {
      wx.showToast({
        title: '请选择评价星级',
        icon: 'none'
      });
      return;
    } else if (!a.ckArr.length) {
      wx.showToast({
        title: '请选择评价结果',
        icon: 'none'
      });
      return;
    } else {
      var v_star_mark = a.ckArr.join("|");
    }
    if (a.imageURL) {
      var filePath = a.imageURL
    } else {
      var filePath = 'http://tmp/wx483ea7133f8fbd65.o6zAJsyl5smMs03ppwYAsuEDJ42g.aM6hPF4436zE32fbd537e6bc052757beadcb831d3286.png'
    }
    wx.uploadFile({
      url: url + 'cocontrol/saveMarkstr.htm',
      filePath: filePath,
      name: 'file',
      formData: {
        v_order_no: a.v_order_no,
        // v_order_no: '55340328873361408',
        v_remake: a.v_remake ? a.v_remake : '',
        v_star: a.v_star,
        v_star_mark: v_star_mark
      },
      success: function(res) {
        console.log('上传图片成功');
        that.setData({
          click: false
        });
        wx.showToast({
          title: '评价成功',
        });
        wx.switchTab({
          url: '../index/index',
        })
   
      }
    });
  },

  //单个评价
  selectItem: function(e) {
    var that = this;
    var a = that.data;
    var index = e.currentTarget.dataset.index;

    if (a.arr[index].i_flag == 1) {
      a.arr[index].i_flag = 0;
      a.ckArr.push(a.arr[index].v_remake);
    } else {
      a.arr[index].i_flag = 1;
      for (var j in that.data.ckArr) {
        if (a.arr[index].v_remake == a.ckArr[j]) {
          a.ckArr.splice(j, 1)
        }
      }
    }
    that.setData({
      arr: a.arr,
      ckArr: a.ckArr
    });
  },

  //输入评价
  inputEval: function(e) {
    var val = e.detail.value;
    this.setData({
      v_remake: val
    });
  },

  //点击星星
  selectStar: function(e) {
    var that = this;
    var a = that.data;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < 5; i++) {
      if (i > index) {
        that.data.imgArr[i] = '/image/star_line@3x.png'
      } else {
        that.data.imgArr[i] = '/image/star_solid@3x.png'
      }
    }

    //点击不同星星
    var arr = [];
    if (index == 0) {
      for (var i in a.dataList) {
        if (a.dataList[i].i_star_num == 1) {
          arr.push(a.dataList[i])
        }
      }
    } else if (index == 1) {
      for (var i in a.dataList) {
        if (a.dataList[i].i_star_num == 2) {
          arr.push(a.dataList[i])
        }
      }
    } else if (index == 2) {
      for (var i in a.dataList) {
        if (a.dataList[i].i_star_num == 3) {
          arr.push(a.dataList[i])
        }
      }
    } else if (index == 3) {
      for (var i in a.dataList) {
        if (a.dataList[i].i_star_num == 4) {
          arr.push(a.dataList[i])
        }
      }
    } else if (index == 4) {
      for (var i in a.dataList) {
        if (a.dataList[i].i_star_num == 5) {
          arr.push(a.dataList[i])
        }
      }
    }
    that.setData({
      v_star: index + 1,
      imgArr: that.data.imgArr,
      ckArr: [],
      arr: arr
    });
  },


  //添加图片
  addImg: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              var filePath = tempFilePaths[0];
              console.log('filePath=' + filePath)
              that.setData({
                imageURL: filePath
              });
            }
          })
        } else if (res.tapIndex == 1) { //相机
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              var filePath = tempFilePaths[0];
              console.log('filePath=' + filePath)
              that.setData({
                imageURL: filePath
              });
            }
          });
        }
      }
    })
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