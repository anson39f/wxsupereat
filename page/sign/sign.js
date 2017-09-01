var server = require('../../utils/server.js');
var app = getApp();
Page({
  data: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    showModalStatus: false,
    hiddenmodalput: true,
    code: '',
  },
  firstInput: function (e) {
    this.setData({
      firstname: e.detail.value
    })
  },
  lastInput: function (e) {
    this.setData({
      lastname: e.detail.value
    })
  },

  emailInput: function (e) {
    this.setData({
      email: e.detail.value
    })
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

  // 获取输入验证码
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 注册
  sign: function () {
    var self = this;
    var firstname = this.data.firstname;
    var lastname = this.data.lastname;
    var email = this.data.email;
    var phone = this.data.phone;
    var password = this.data.password;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '电话和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else if (this.data.email.length == 0 || this.data.firstname.length == 0 || this.data.lastname.length == 0) {
      wx.showToast({
        title: '邮箱和姓名不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      server.postJSON('https://supereat.ca/api/signup_user', {
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password,
        phone: phone,
        gender: '',
        terms_condition: 1,
        login_type: 2,
        language: 1,
        guest_type: 0,
        user_type: 3,
        device_id: '1',
        device_token: '1',
      }, function (res) {
        console.log(res);
        var response = res.data.response;
        if (response.httpCode == 200) {
          app.globalData.token = response.token;
          app.globalData.user_id = response.user_id;
          self.setData({
            token:response.token,
            user_id:response.user_id,
            hiddenmodalput: false
          });
          // 这里修改成跳转的页面 
          // wx.showToast({
          //   title: '注册成功',
          //   icon: 'success',
          //   duration: 2000
          // })
          console.log("------------成功-------------");
        } else {

          console.log("------------失败-------------");
        }
      })
    }
  },

  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //重新发送验证码
  cancel: function () {
    var self = this;
    var phone = this.data.phone;
    var user_id = this.data.user_id;

    server.postJSON('https://supereat.ca/api/send-otp-new-mobile', {
      language: "2",
      phone: phone,
      user_id: user_id,
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        // 这里修改成跳转的页面 
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
        console.log("------------成功-------------");
      } else {

        console.log("------------失败-------------");
      }
    })
  },
  //确认 验证码
  confirm: function () {
    var self = this;    
    var code = this.data.code;
    var phone = this.data.phone;
    var password = this.data.password;
    var user_id = this.data.user_id;
    
    server.postJSON('https://supereat.ca/api/verify-otp-new-mobile', {
      language: "2",
      phone: phone,
      otp: code,
      user_id: user_id,
      type: "1",
      password: password
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        // self.modalinput();
        self.setData({
          hiddenmodalput: true
        })
        // 这里修改成跳转的页面 
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000
        })
        console.log("------------成功-------------");
      } else {

        console.log("------------失败-------------");
      }
    })
  },


  //弹框
  powerDrawer: function () {
    this.util('open')
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})
