var app = getApp();
var server = require('../../utils/server.js');
Page({
  data: {
    cart: {
      count: 0,
      total: 0
    },
    url: app.globalData.url,
    cartList: [],
    localList: [],
    showCartDetail: false,
    defaultImg: 'http://global.zuzuche.com/assets/images/common/zzc-logo.png',
  },
  onLoad: function (options) {
    var shopId = options.id;
    // var shop = server.selectedShopDetail(shopId) // throw Exception
    var shop;
    this.getShopDetail(shopId); // throw Exception

    var res = wx.getStorageSync(shopId);
    console.log(res);
    if (res) {
      this.setData({
        cart: {
          count: res.count,
          total: res.total
        }
      });
      if (!server.isEmptyObject(res.cartList)) {
        this.setData({
          cartList: res.cartList,
          localList: server.filterEmptyObject(res.cartList)
        })
      }
    }
    if (typeof this.data.cartList[this.data.shopId] == 'undefined' || server.isEmptyObject(this.data.cartList[this.data.shopId])) {
      var cartList = this.data.cartList;
      cartList[this.data.shopId] = [];
      this.setData({
        cartList: cartList
      })
    }
    console.log(this.data.localList, this.data.cartList)
  },
  onShow: function () {
    this.setData({
      classifySeleted: 0
    });
  },
  getShopDetail: function (id) {
    var self = this;
    server.postJSON('https://supereat.ca/api/store_info_mob', {
      city: '71',
      outlet_id: id,
      location: 1035,
      language: "1",
      user_id: '',
      category_id: '',
      user_id: '',
      token: ''
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        self.setData({
          shopId: id,
          shop: response.outlet_detail
        });
        self.getShopMenu('most-1');
        console.log("------------成功-------------" + response.outlet_detail.category_list.length);
      } else {
        this.setData({
          shopId: id,
          shop: response.outlet_detail
        })
        console.log("------------失败-------------");
      }
    })
  },

  getShopMenu: function (id) {
    var self = this;
    server.postJSON('https://supereat.ca/api/store_product_mob', {
      location: 1035,
      language: "1",
      user_id: '',
      category_id: id,
      outlet_id: this.data.shop.outlets_id,
      store_id: this.data.shop.vendors_id,
      product_name: ''
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        for (var index in response.product_list) {
          response.product_list[index].count = 0;
        }
        self.setData({
          product: response.product_list
        })
        console.log(response.product_list);
        console.log("------------成功-------------");
      } else {
        wx.showModal({
          title: '提示',
          content: '网络好像有点问题，请重新打开！',
          showCancel: false
        });
        console.log("------------失败-------------");
      }
    })
  },
  checkOrderSame: function (name) {
    var list = this.data.cartList;
    for (var index in list) {
      if (list[index].name === name) {
        if (index == 'undefined') {
          return false;
        }
        return index;
      }
    }
    return false;
  },
  tapAddCart: function (e) {
    var price = parseFloat(e.target.dataset.price);
    var name = e.target.dataset.name;
    var img = e.target.dataset.pic;
    var list = this.data.cartList;
    var product;
    var index;
    if (this.checkOrderSame(name)) {
      product = list[this.checkOrderSame(name)];
      var count = product.count;
      product.count = count + 1;
    } else {
      var order = {
        "price": price,
        "num": 1,
        "name": name,
        'img': img,
        "shopId": this.data.shopId,
        "shopName": this.data.shop.outlet_name,
        "pay": 0,
      }
      list.push(order);

    }
    this.setData({
      cartList: list,
      localList: server.filterEmptyObject(list)
    });
    this.addCount(order);
  },
  tapReduceCart: function (e) {
    var name = e.target.dataset.name;
    var price = parseFloat(e.target.dataset.price);
    var list = this.data.cartList;
    var index, sortedList = [];
    if (index = this.checkOrderSame(name)) {
      var num = list[this.data.shopId][index].num
      if (num > 1) {
        sortedList = list[this.data.shopId][index];
        list[this.data.shopId][index].num = num - 1;
      }
      else {
        sortedList = list[this.data.shopId][index]
        list[this.data.shopId].splice(index, 1);
      }
    }
    this.setData({
      cartList: list,
      localList: server.filterEmptyObject(list)
    });
    this.deduceCount(sortedList);
  },
  addCount: function (order) {
    var count = this.data.cart.count + 1,
      total = this.data.cart.total + order.price;
    total = Math.round(parseFloat(total));
    this.saveCart(count, total);
  },
  deduceCount: function (list) {
    var count = this.data.cart.count - 1,
      total = this.data.cart.total - list.price;
    total = Math.round(parseFloat(total));
    this.saveCart(count, total);
  },
  saveCart: function (count, total) {
    total = Math.round(parseFloat(total));
    if (typeof total == null)
      total = 0;
    this.setData({
      cart: {
        count: count,
        total: total
      }
    });
    wx.setStorage({
      key: this.data.shopId,
      data: {
        cartList: this.data.cartList,
        count: this.data.cart.count,
        total: this.data.cart.total,
      }
    })
  },
  follow: function () {
    this.setData({
      followed: !this.data.followed
    });
  },
  onGoodsScroll: function (e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }

    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = this.data.shop.category_list.length;

    // this.data.shop.category_list.forEach(function (classify, i) {
    //   var _h = 70 + classify.category_list.length * (46 * 3 + 20 * 2);
    //   if (scrollTop >= h - 100 / scale) {
    //     classifySeleted = classify.id;
    //   }
    //   h += _h;
    // });

    this.setData({
      classifySeleted: classifySeleted
    });
  },
  tapClassify: function (e) {
    var id = e.target.dataset.id;
    console.log(id);
    this.getShopMenu(this.data.shop.category_list[id].category_id);
    this.setData({
      product: [],
      classifyViewed: id
    });
    console.log(this.data.classifyViewed)
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: id
      });
    }, 100);
  },
  showCartDetail: function () {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    });
  },
  submit: function (e) {
    var total = this.data.cart.total
    wx.navigateTo({
      url: '/page/order/order?pay=1&total=' + total
    })
  }
});

