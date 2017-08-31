var server = require('../../utils/server.js');
Page({
  data: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    showModalStatus: false,
    hiddenmodalput:true
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

  // 注册
  sign: function () {
    this.modalinput();
    return;
    var self = this;
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
        first_name: 'test',
        last_name: 'jiujiu',
        email: '4166678@qq.com',
        password: 123456,
        phone: 3656516202,
        gender: '',
        terms_condition: 1,
        login_type: 2,
        language: 1,
        guest_type: 0,
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
            title: '注册成功',
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

  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
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
