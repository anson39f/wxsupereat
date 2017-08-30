var app = getApp()
var server = require('../../utils/server.js');

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
    transportation: 0,
    pay: 0,
    is_empty: false,
    option: {},
    cart: {
      count: 0,
      total: 0
    },
    items: [
      {
        "product_id": 3674,
        "quantity": 5,
        "discount_price": 33,
        "ingredients": {
          "0": {
            "ingredient_id": 21,
            "price": "15"
          },
          "ingredient_name": "Ground Beef"
        },
        "item_offer": "0"
      }
    ],
    payment_array: {
      "user_id": "163",
      "store_id": "",
      "outlet_id": '',
      "vendor_key": "",
      "total": "262.72",
      "sub_total": '',
      "contact_address": "Pramara Niwas, 22nd Main Rd, Jeewan Griha Colony, 2nd Phase, JP Nagar, Bengaluru, Karnataka 560078, India",
      "contact_email": "kfc@mailinator.com",
      "outlet_name": "KFC",
      "service_tax": "12.72",
      "tax_label_name": "VAT",
      "tax_percentage": "5.3",
      "order_status": "1",
      "order_key": "",
      "transaction_staus": "1",
      "transaction_amount": "262.72",
      "currency_code": "$",
      "payment_gateway_id": "25",
      "delivery_charge": "10",
      "payment_status": "0",
      "admin_commission": "35",
      "vendor_commission": "228",
      "payment_gateway_commission": "5",
      "delivery_instructions": "",
      "delivery_address": "3",
      "delivery_slot": "0",
      "delivery_cost": "0",
      "delivery_date": "2017-08-28",
      "order_type": "1",
      "coupon_type": "0",
      "coupon_id": "0",
      "coupon_amount": "0",
      "items":
      [
        {
          "product_id": 3674,
          "quantity": 5,
          "discount_price": 33,
          "ingredients": {
            "0": {
              "ingredient_id": 21,
              "price": "15"
            },
            "ingredient_name": "Ground Beef"
          },
          "item_offer": "0"
        }
      ]
    }
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
    var contact_address = option.contact_address;
    var vendors_id = option.vendors_id;
    console.log('下单：');
    console.log(option);
    this.setData({
      option: option
    })

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

    var taxcount = res.count * tax_percentage * 0.01;

    var payment_array = self.data.payment_array;
    payment_array.store_id = vendors_id;
    payment_array.outlet_id = shopId;
    payment_array.sub_total = res.total;
    payment_array.outlet_name = cartList[0].shopName;
    payment_array.service_tax = taxcount;
    payment_array.tax_label_name = tax_label_name;
    payment_array.tax_percentage = tax_percentage;
    
    payment_array.items = [];
    for (var index in cartList) { 
      var item = {};     
      item.product_id = cartList[index].productId;
      item.quantity = cartList[index].num;
      item.discount_price = cartList[index].price;
      item.ingredients = {};
      item.item_offer = 0;
      payment_array.items.push(item);
    };

    console.log("payment_array:");
    console.log(payment_array);

    this.setData({
      // total: res.total,
      count: res.count,
      orderList: res.cartList,
      pay: pay,
      tax: taxcount,
      taxNme: tax_label_name,
      is_empty: is_empty,
      cart: {
        count: res.count,
        total: res.total
      },
      payment_array: payment_array,
    });

  },
  onShow: function () {
    var self = this;
    var address = [];
    var option = this.data.option;
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
        self.getDistance(option);
      },
    })

  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    var option = this.data.option;
    this.getDistance(option);
  },

  getDistance: function (option) {
    var contact_address = option.contact_address;
    var self = this;
    var list = this.data.addressList;
    var index = this.data.index;
    console.log('地址数组');
    console.log(list);
    var useraddress = list[index].address;
    var email = list[index].email;
    self.setData({
      transportation: 0,
      total: 0
    });
    server.postJSON('https://supereat.ca/api/wx_distance', {
      useraddress: useraddress,//666 spadina ave, toronto
      shopaddress: contact_address,
      apikey: 'mazQ1KCHKYpRjADvPmJAuaiDdzv0UO8X',
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        var distance = response.distance;
        var basedistance = option.basedistance;
        var baserate = option.baserate;
        var delivery_cost_fixed = option.delivery_cost_fixed;
        var transportation;
        if (basedistance < distance) {
          var distance_fee = (distance - basedistance) / 5;
          transportation = distance_fee * baserate + delivery_cost_fixed;
        } else {
          transportation = delivery_cost_fixed;
        }
        transportation = server.toDecimal(transportation);
        var total = self.data.cart.total + transportation + self.data.tax;
        var payment_array = self.data.payment_array;
        payment_array.total = server.toDecimal(total);
        payment_array.contact_address = useraddress;
        payment_array.contact_email = email;
        payment_array.transaction_amount = transportation;
        self.setData({
          transportation: transportation,
          total: server.toDecimal(total),
          payment_array: payment_array
        });
        console.log("------------成功 距离-------------" + response.distance);
      } else {
        wx.showModal({
          showCancel: false,
          title: '收货地址无效',
          content: '请重新选择地址',
          success: function (res) {

          }
        })
        console.log("------------失败-------------");
      }
    })
  },

  confirm: function () {
    var self = this;
    var pay = this.data.payment_array;

    wx.showToast({
      title: '正在为您提交订单',
      icon: 'loading',
      mask: true,
      success: function () {
        server.postJSON('https://supereat.ca/api/offline_payment', {
          language: 2,
          user_id: 163,
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjIwMDAwMDAwMDAwMCwic3ViIjo0LCJpc3MiOiJodHRwOlwvXC9mb29kLm9kZGFwcHouY29tXC9hcGlcL2xvZ2luX3VzZXIiLCJpYXQiOjE1MDM5MDMzNTYsIm5iZiI6MTUwMzkwMzM1NiwianRpIjoiSmNHVGVtN05ZQUxKd0VVRSJ9.5syewrMf0ii- XnnCbn5ObYr8iK2rd6 - qWhO4Ki9mJl0',
          payment_array: JSON.stringify(pay)
        }, function (res) {
          console.log(res);
          var response = res.data.response;
          if (response.httpCode == 200) {
            wx.showModal({
              showCancel: false,
              title: '恭喜',
              content: '订单发送成功！下订单过程顺利完成。',
              success: function (res) {
                if (res.confirm) {
                  wx.removeStorageSync(self.data.orderList[0].shopId);
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
          } else {
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
        })
      }
    })
  }
});

