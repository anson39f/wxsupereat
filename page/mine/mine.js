var app = getApp();
var server = require('../../utils/server');
Page({
  data: {
    email: app.globalData.email
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
      that.update();
      console.log(userInfo)
    });
  },
  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      email: app.globalData.email
    });
    console.log(this.data.userInfo);
  },
  order: function () {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: '/page/order/order'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/page/login/login'
            })
          } else if (res.cancel) {
            
          }
        }
      })
    }
  },

  address:function(){
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: '/page/address/address'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/page/login/login'
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  }
});

