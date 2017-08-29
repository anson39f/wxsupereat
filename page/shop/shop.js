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
    containerHeight: 920,
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
    // if (typeof this.data.cartList[this.data.shopId] == 'undefined' || server.isEmptyObject(this.data.cartList[this.data.shopId])) {
    //   var cartList = this.data.cartList;
    //   cartList[this.data.shopId] = [];
    //   this.setData({
    //     cartList: cartList
    //   })
    // }
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
      city: '69',//71
      outlet_id: id,
      location: 1032,//1035
      language: '2',
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
      location: 1032,//1035
      language: '2',
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
        self.checkProductName(self.data.product);
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

  checkProductName: function (product) {
    var list = this.data.cartList;
    if (list.lenght == 0 || product.lenght == 0) {
      return false;
    };
    for (var index in list) {
      for (var i in product) {
        if (list[index].name === product[i].product_name) {
          product[i].count = list[index].num;
        }
      }
    }
    this.setData({
      product: product
    })
    return false;
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
    var price = parseFloat(e.currentTarget.dataset.price);
    // var price = e.currentTarget.dataset.price;
    var name = e.currentTarget.dataset.name;
    var img = e.currentTarget.dataset.pic;
    var list = this.data.cartList;
    var product;
    var index;
    if (index = this.checkOrderSame(name)) {
      product = list[index];
      var num = product.num;
      product.num = num + 1;
      product.pay = this.toDecimal(product.price * product.num);
    } else {
      product = {
        "price": price,
        "num": 1,
        "name": name,
        'img': img,
        "shopId": this.data.shopId,
        "shopName": this.data.shop.outlet_name,
        "pay": this.toDecimal(price),
      }
      console.log(product);
      list.push(product);

    }
    this.setData({
      cartList: list,
      localList: server.filterEmptyObject(list)
    });
    this.checkProductName(this.data.product);
    this.addCount(product);
  },
  tapReduceCart: function (e) {
    var name = e.currentTarget.dataset.name;
    var price = parseFloat(e.currentTarget.dataset.price);
    var list = this.data.cartList;
    var index, product;
    if (index = this.checkOrderSame(name)) {
      var num = list[index].num
      if (num > 1) {
        product = list[index];
        list[index].num = num - 1;
        product.pay = this.toDecimal(product.price * product.num);
        this.checkProductName(this.data.product);
      } else {
        product = list[index];
        product.num = 0;
        this.checkProductName(this.data.product);
        list.splice(index, 1);
      }
    }
    this.setData({
      cartList: list,
      localList: server.filterEmptyObject(list)
    });
    console.log(list);
    this.deduceCount(product);
  },
  addCount: function (order) {
    var count = this.data.cart.count + 1;
    var total = this.data.cart.total + order.price;
    // total = Math.round(parseFloat(total));
    total = this.toDecimal(total);
    this.saveCart(count, total);
    this.checkProductName(this.data.product);
  },
  deduceCount: function (product) {
    var count = this.data.cart.count - 1,
      total = this.data.cart.total - product.price;
    // total = Math.round(parseFloat(total));
    total = this.toDecimal(total);
    this.saveCart(count, total);

  },
  saveCart: function (count, total) {
    // total = Math.round(parseFloat(total));    
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
  //保留两位小数  
  //功能：将浮点数四舍五入，取小数点后2位 
  toDecimal: function (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return;
    }
    f = Math.round(x * 100) / 100;
    return f;
  },
  follow: function () {
    this.setData({
      followed: !this.data.followed
    });
  },
  onGoodsScroll: function (e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true,
        containerHeight: 1220
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false,
        containerHeight: 920
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
    var shop = this.data.shop;
    var total = this.data.cart.total;
    var shopId = this.data.shopId;
    console.log(shop);
    wx.navigateTo({
      url: '/page/order/order?pay=1&total=' + total + '&shopId=' + shopId
      + '&tax_percentage=' + shop.tax_percentage + '&tax_label_name=' + shop.tax_label_name
      + '&delivery_cost_fixed=' + shop.delivery_cost_fixed
      + '&baserate=' + shop.baserate + '&basedistance=' + shop.basedistance
      + '&contact_address=' + shop.contact_address
    })
  }
});

