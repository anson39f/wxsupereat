var app = getApp()
var common = require('../../utils/server.js');
Page({
  data: {
    orderList: [],
    count: 0,
    total: 0,
    pay: 0,
    is_empty: false,
    cart: {
      count: 0,
      total: 0
    },
  },
  onLoad: function (option) {
    var pay = 1;
    if (option.pay) {
      var pay = option.pay;
      var shopId = option.shopId;
      if (parseFloat(option.total) > 0)
        var is_empty = true;
      else
        var is_empty = false;
    }
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
    this.setData({
      total: res.total,
      count: res.count,
      orderList: res.cartList,
      pay: pay,
      is_empty: is_empty,
      cart: {
        count: res.count,
        total: res.total
      }
    });
  },
  onShow: function () { },
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

