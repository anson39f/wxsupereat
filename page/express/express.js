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
    gatwayList:[18,21],
    items: [
      {
        product_id: 3674,
        quantity: 5,
        discount_price: 33,
        ingredients: {
          0: {
            ingredient_id: 21,
            price: "15"
          },
          ingredient_name: "Ground Beef"
        },
        item_offer: "0",
        special_req: ""
      }
    ],
    payment_array: {
      coupon_amount: "0",
      delivery_charge: "10",
      payment_gateway_commission: 5,
      coupon_type: "0",
      currency_code: "",
      service_tax: "15.264",
      order_status: 1,
      invoice_id: "",
      payment_gateway_id: 25,
      vendor_commission: 273.6,
      outlet_name: "KFC",
      vendor_key: "KFC",
      payment_status: 0,
      delivery_instructions: "",
      tax_label_name: "VAT",
      admin_commission: 39.664,
      delivery_cost: 0,
      total: 313.264,
      sub_total: 288,
      tax_percentage: "5.3",
      transaction_staus: 1,
      contact_address: "Pramara Niwas, 22nd Main Rd, Jeewan Griha Colony, 2nd Phase, JP Nagar, Bengaluru, Karnataka 560078, India",
      contact_email: "kfc@mailinator.com",
      store_id: 179,
      transaction_amount: 313.264,
      delivery_date: "2017-08-30",
      order_type: 1,
      coupon_id: "0",
      outlet_id: 53,
      order_key: "",
      transaction_id: "",
      payer_id: "",
      items: []
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
    payment_array.vendor_key = cartList[0].shopName
    payment_array.service_tax = taxcount;
    payment_array.tax_label_name = tax_label_name;
    payment_array.tax_percentage = tax_percentage;
    payment_array.delivery_date = server.initDate();

    payment_array.items = [];
    for (var index in cartList) {
      var item = {};
      item.product_id = cartList[index].productId;
      item.quantity = cartList[index].num;
      item.discount_price = cartList[index].price;
      item.ingredients = cartList[index].ingredients;
      item.item_offer = 0;
      item.special_req = '';
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
    wx.showLoading({
      title: '加载中',
    });
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
      fail: function (res) {
        wx.hideLoading();

        wx.showModal({
          title: '提示',
          content: '请先添加收货信息',
          cancelText: '取消',
          confirmText: '添加',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/page/add/add?type=1'
              })
            } else if (res.cancel) {

            }
          }
        })
        return;

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

  //获取距离
  getDistance: function (option) {
    wx.showLoading({
      title: '加载中',
    })
    var contact_address = option.contact_address;
    var contact_email = option.contact_email
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
      //basefee =(order_amount >= minimum-free_amount) ? 0 : basefee;
      // finalfee = basefee + (distance / basekmunit) * baserate;
      var response = res.data.response;
      if (response.httpCode == 200) {
        var distance = response.distance;
        var basedistance = option.basedistance;
        var baserate = option.baserate;
        var delivery_cost_fixed = option.delivery_cost_fixed;
        var minimum_free_amount = option.minimum_free_amount
        var transportation;


        var cityIndex = app.globalData.cityIndex;
        var cityList = app.globalData.city_list;
        var cityId = cityList[cityIndex].id;
        if (minimum_free_amount < self.data.payment_array.sub_total) {
          transportation = 0;
        } else {
          if (basedistance < distance) {
            var distance_fee;
            if (cityId == 71) {//ottawa
              distance_fee = (distance - basedistance) / 5;
            } else {
              distance_fee = (distance - basedistance);
            }
            transportation = distance_fee * baserate + delivery_cost_fixed;
          } else {
            transportation = delivery_cost_fixed;
          }
        }


        transportation = server.toDecimal(transportation);
        var total = self.data.cart.total + transportation + self.data.tax;
        var payment_array = self.data.payment_array;
        payment_array.total = server.toDecimal(total);
        payment_array.contact_address = contact_address;
        payment_array.contact_email = contact_email;
        payment_array.transaction_amount = server.toDecimal(total);
        payment_array.delivery_charge = transportation
        self.setData({
          transportation: transportation,
          total: server.toDecimal(total),
          payment_array: payment_array
        });
        wx.hideLoading();
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
    }, function (res) {
      wx.showModal({
        title: '提示',
        content: '网络好像有点问题，请重新请求！',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            self.getDistance(option)
          }
        }
      })
      console.log("------------超时-------------");
    })
  },

  actionSheetTap: function () {
    var self = this;
    var payment_array = this.data.payment_array;
    wx.showActionSheet({
      itemList: ['cash', 'debit'],
      success: function (e) {
        console.log(e.tapIndex);
        console.log('支付方式' +self.data.gatwayList[e.tapIndex]);
        payment_array.payment_gateway_id = self.data.gatwayList[e.tapIndex];
        self.setData({
          payment_array: payment_array
        })
        if (e.tapIndex != undefined) {
          self.confirm();
        }
      }
    })
  },

  confirm: function () {
    var self = this;
    var cityIndex = app.globalData.cityIndex;
    var cityList = app.globalData.city_list;
    var cityId = cityList[cityIndex].id;
    var pay = this.data.payment_array;
    var index = this.data.index;
    var list = this.data.addressList;
    if (list.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请先添加收货信息',
        cancelText: '取消',
        confirmText: '添加',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/page/add/add?type=1'
            })
          } else if (res.cancel) {

          }
        }
      })
      return;
    }

    // wx.showToast({
    //   title: '正在为您提交订单',
    //   icon: 'loading',
    //   mask: true,
    //   success: function () {
    //   }
    // })

    wx.showLoading({
      title: '正在为您提交订单',
    });
    server.postJSON('https://supereat.ca/api/guest-offline-payment', {
      language: app.globalData.language,
      payment_array: JSON.stringify(pay),
      mobile: list[index].mobile,
      login_type: 3,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
      city_id: cityId,
      guest_type: 1,
      address: list[index].address,
      first_name: list[index].firstname,
      device_token: 1,
      device_id: 1,
      last_name: list[index].lastname,
      email: list[index].email,
      address_type: 1,
      flat_number: list[index].roomnumber,
      location_id: server.getLocation(cityId),
      landmark: list[index].buzzcode
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '恭喜',
          content: '订单发送成功！下订单过程顺利完成。',
          success: function (res) {
            if (res.confirm) {
              wx.removeStorageSync(self.data.orderList[0].shopId);
              wx.switchTab({
                url: '../index/index'
              })
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
        wx.hideLoading();
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
    }, function (res) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '网络好像有点问题，请重新提交订单！',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            self.confirm()
          }
        }
      })
      console.log("------------超时-------------");
    })

  }

});
