var server = require('../../utils/server.js');
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
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      server.postJSON('https://supereat.ca/api/login_user', {        
        email: '41666@qq.com',
        password: 123456,
        login_type: 2,
        language: 1,
        user_type: 3,
        device_id: '50eae3243fc75b1f',
        device_token: '',
      }, function (res) {
        console.log(res);
        var response = res.data.response;
        if (response.httpCode == 200) {
          self.setData({

          });
          // 这里修改成跳转的页面 
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          console.log("------------成功-------------");
        } else {

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