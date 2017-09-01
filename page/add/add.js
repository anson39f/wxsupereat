// add.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.getStorage({
      key: 'address',
      success: function (res) {
        console.log(res.data)
        self.setData({
          addressList: res.data
        });
      },
    })
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

  },
  formSubmit: function (e) {
    var token = app.globalData.token = response.token;
    var user_id = app.globalData.user_id = response.user_id;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var res = e.detail.value;
    if (res.firstname == '' || res.lastname == '' || res.mobile == '' || res.address == '') {
      wx.showToast({
        title: '请完善信息,如无请填无'
      })
    } else {
      var mobilere = /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/;
      var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      var result = mobilere.test(res.mobile);
      if (!result) {
        wx.showToast({
          title: '手机号码格式错误'
        })
        return;
      }
      var eresult = emailre.test(res.email);
      if (!eresult) {
        wx.showToast({
          title: '邮箱码格式错误'
        })
        return;
      }

      // var list = this.data.addressList;
      // list.push(e.detail.value);
      // wx.setStorage({
      //   key: 'address',
      //   data: list,
      // })

      //保存地址
      server.postJSON('https://supereat.ca/api/store_address', {
        landmark: "123",
        country_id: "59",
        latitude: 23.1148329732031,
        user_id: "2",
        longtitude: 113.3314157277346,
        city_id: 53,
        token: '',
        address: "Tianhe Tianhe, Guangzhou, Guangdong China",
        language: "1",
        location_id: 71,
        address_type: "1",
        flat_number: "123",
      }, function (res) {
        console.log(res);
        var response = res.data.response;
        if (response.httpCode == 200) {
          app.globalData.token = response.token;
          app.globalData.user_id = response.user_id;
          self.setData({
          });
          
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          console.log("------------成功-------------");
        } else {

          console.log("------------失败-------------");
        }
      })


      wx.navigateBack({
        url: '../address/address'
      })
    }
  },
})