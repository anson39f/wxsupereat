var server = require('../../utils/server.js');
var app = getApp();
Page({
  data: {
    phone: '',
    password: ''
  },

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {
    var token = app.globalData.token;
    var user_id = app.globalData.user_id;
    var phone = this.data.phone;
    var password = this.data.password;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '登录中...',
      })
      server.postJSON('https://supereat.ca/api/login_user', {
        email: phone,
        password: password,
        login_type: 2,
        language: app.globalData.language,
        user_type: 3,
        device_id: '1',
        device_token: '1',
      }, function (res) {
        console.log(res);
        var response = res.data.response;
        if (response.httpCode == 200) {
          app.globalData.token = response.token;
          app.globalData.user_id = response.user_id;
          app.globalData.email = response.email;
          app.globalData.hasLogin = true;
          wx.hideLoading();
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              url: '../mine/mine'
            })
          }, 2000);  
          console.log("------------成功-------------");
        } else {
          wx.hideLoading();
          wx.showToast({
            title: response.Message,
            icon: 'loading',
            duration: 2000
          })
          console.log("------------失败-------------");
        }
      })
     

    }
  },

  // 注册 
  sign: function () {
    wx.navigateTo({
      url: '../sign/sign',
    })
  }
})