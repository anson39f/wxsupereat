var app = getApp()
var common = require('../../utils/server.js');
Page({
  data: {
    orderList: [],
    addressList: [],
    addressString: [],
    index: 0,
    count: 0,
    total: 0,
    tax: 0,
    taxNme: '',
    pay: 0,
    is_empty: false,
    cart: {
      count: 0,
      total: 0
    },
  },
  onLoad: function (option) {
    var self = this;
    var pay = 1;
    if (!option.pay) {
      return;
    }
    if (parseFloat(option.total) > 0)
      var is_empty = true;
    else
      var is_empty = false;

    var pay = option.pay;
    var shopId = option.shopId;
    var tax_label_name = option.tax_label_name;
    var tax_percentage = option.tax_percentage;
    var delivery_cost_fixed = option.delivery_cost_fixed;
    var baserate = option.baserate;
    var basedistance = option.basedistance;
    console.log('下单：');
    console.log(option);

    var res = wx.getStorageSync(shopId);
    var cartList = res.cartList;
    // for (var index in cartList) {
    //   if (pay == 0) var is_empty = false;
    //   if (!common.isEmptyObject(cartList[index])) {

    //     var total = 0;
    //     if (pay == 0) is_empty = true;
    //     total += cartList[index].num * cartList[index].price;
    //     var orderDetail = {
    //       name: cartList[index].shopName,
    //       shopId: cartList[index].shopId,
    //       order: cartList[index],
    //       total: total,
    //       pay: cartList[index].pay,
    //     }
    //     cartList.push(orderDetail);
    //   }
    // }
    var taxcount = res.count * tax_percentage*0.01;
    console.log(taxcount + ' ' + tax_percentage);
    this.setData({
      total: res.total,
      count: res.count,
      orderList: res.cartList,
      pay: pay,
      tax: taxcount,
      taxNme: tax_label_name,
      is_empty: is_empty,
      cart: {
        count: res.count,
        total: res.total
      }
    });

  },
  onShow: function () {
    var self = this;
    var address = [];
    wx.getStorage({
      key: 'address',
      success: function (res) {
        var list = res.data;
        for (var index in list) {
          var string = list[index].firstname + ' ' + list[index].mobile + ' ' + list[index].address;
          address.push(string);
        }
        console.log(address);
        self.setData({
          addressString: address,
          addressList: list
        })
      },
    })

  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  confirm: function () {
    var templateData = this.data.orderList;
    console.log(templateData)
    var res = wx.getStorageSync('orderList');
    if (res) {
      var cartList = res.cartList;
    }
    wx.showToast({
      title: '正在为您提交订单',
      icon: 'loading',
      mask: true,
      success: function () {
        wx.request({
          url: 'https://test2.zuzuche.com/dwq/WxAppApi/sendTemplate.php',
          data: {
            rd_session: app.rd_session,
            nick_name: app.globalData.userInfo.nickName,
            avatar_url: app.globalData.userInfo.avatarUrl,
            data: templateData,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            if (res.data.errcode) {
              wx.showModal({
                showCancel: false,
                title: '恭喜',
                content: '订单发送成功！下订单过程顺利完成，你看到的费用暂不包括配送费以及优惠。',
                success: function (res) {
                  if (res.confirm) {
                    wx.removeStorageSync('orderList');
                    wx.navigateBack();
                  }
                }
              })
              // for(var index in cartList){
              // 	if(typeof cartList[index] !== null){
              // 		for(var key in cartList[index]){
              // 			cartList[index]['pay'] = 1;
              // 		}
              // 	}								
              // }
              // wx.setStorage({
              // 	key: 'orderList',
              // 	data: {
              // 		cartList: cartList,
              // 		count: res.count,
              // 		total: res.total,
              // 	}
              // });
            }
            else {
              console.log('下单失败');
              wx.showModal({
                showCancel: false,
                title: '提交订单失败',
                content: '请在重新授权后提交订单',
                success: function (res) {
                  if (res.confirm) {
                    app.getUserInfo();
                  }
                }
              })
            }
          }
        })
      }
    })
  }
});

