var server = require('../../utils/server.js');
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
    var self = this;
    // wx.getStorage({
    //   key: 'address',
    //   success: function (res) {
    //     self.setData({
    //       addressList: res.data
    //     })
    //   },
    // })
    wx.showLoading({
      title: '加载中',
    })
    var self = this;
    var token = app.globalData.token;
    var user_id = app.globalData.user_id;
    //获取地址
    server.postJSON('https://supereat.ca/api/get_address', {
      user_id: user_id,
      token: token,
      language: app.globalData.language,
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        self.setData({
          addressList: response.address_list
        })
        wx.hideLoading()
        console.log("------------成功-------------");
      } else {
        wx.hideLoading()
        console.log("------------失败-------------");
      }
    })

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

  }
})

