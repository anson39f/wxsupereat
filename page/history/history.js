var app = getApp()
var server = require('../../utils/server.js');
Page({
  data: {
    orderList: [],
    count: 0,
    total: 0,
    pay: 0,
    is_empty: false
  },
  onLoad: function (option) {
    var self = this;
    if (option.pay) {
      var pay = option.pay;
      if (parseFloat(option.total) > 0)
        var is_empty = true;
      else
        var is_empty = false;
    }
    else {
      var pay = 0;
    }

    //获取订单列表
    server.postJSON('https://supereat.ca/api/orders', {
      country_id: 65,
      language: app.globalData.language,
      user_id: app.globalData.user_id,
      token: app.globalData.token,
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        var addressString = [];
        for (var index in response.city_list) {
          addressString.push(response.city_list[index].city_name);
        }
        self.setData({
          addressString: addressString,
          city_list: response.city_list,
        });
        app.globalData.city_list = response.city_list;
        console.log("------------成功-------------");
      } else {
        self.setData({
          address: '获取失败'
        });
        console.log("------------失败-------------");
      }
    });

    this.setData({
      // total: orderList.total,
      // count: orderList.count,
      // orderList: cartList,
      pay: pay,
      is_empty: is_empty
    });
  },
  onShow: function () { },
  confirm: function () {

  }
});

