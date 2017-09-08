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
    showModalStatus: false,
    ingredients: {
      "0": {
        "ingredient_id": 21,
        "price": "15"
      },
      "ingredient_name": "Ground Beef"
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

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
      language: app.globalData.language,
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
        wx.showLoading({
          title: '加载失败',
        })
        console.log("------------失败-------------");
      }
      }, function (res) {
        wx.showModal({
          title: '提示',
          content: '网络好像有点问题，请重新打开！',
          showCancel: false,
          confirmText: '确定',
          success: function (res) {
            if (res.confirm) {
              self.getShopDetail(id)
            }
          }
        })
        console.log("------------超时-------------");
      })
  },

  getShopMenu: function (id) {
    var self = this;
    server.postJSON('https://supereat.ca/api/store_product_mob', {
      location: 1032,//1035
      language: app.globalData.language,
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
        wx.hideLoading();
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
    }, function (res) {
      wx.showModal({
        title: '提示',
        content: '网络好像有点问题，请重新打开！',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            self.getShopMenu(id)
          }
        }
      })
      console.log("------------超时-------------");
    })
  },

  // 设置菜单的显示的数量
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

  checkProductId: function (id) {
    var list = this.data.product;
    for (var index in list) {
      if (list[index].product_id === id) {
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
    var name = e.currentTarget.dataset.name;
    var img = e.currentTarget.dataset.pic;
    var productId = e.currentTarget.dataset.productid;
    console.log('productId:' + productId);
    var list = this.data.cartList;
    var productList = this.data.product;
    var selectIndex = this.checkProductId(productId);
    this.setData({
      selectProduct: productList[selectIndex],
    })

    var product;
    var index;
    if ((index = this.checkOrderSame(name))) {
      product = list[index];
      var num = product.num;
      var price = product.pay / product.num;
      product.num = num + 1;
      product.pay = this.toDecimal(price * product.num);
    } else {
      product = {
        "price": price,
        "num": 1,
        "name": name,
        'img': img,
        "shopId": this.data.shopId,
        "shopName": this.data.shop.outlet_name,
        "pay": this.toDecimal(price),
        "productId": productId,
        "ingredients": {},
      }
      if (productList[selectIndex].ingred_type_list.length > 0) {
        this.setData({
          productItem: product
        });
        this.powerDrawer();
        return;
      }
      list.push(product);
      console.log('购物车：');
      console.log(list);

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
        var price = product.pay / product.num;
        list[index].num = num - 1;
        product.pay = this.toDecimal(price * product.num);
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
    var total = this.data.cart.total + order.pay / order.num;
    // total = Math.round(parseFloat(total));
    total = this.toDecimal(total);
    this.saveCart(count, total);
    this.checkProductName(this.data.product);
  },
  deduceCount: function (product) {
    var count = this.data.cart.count - 1;
    var price;
    if (product.num == 0) {
      price = product.pay
    } else {
      price = product.pay / product.num;
    }
    var total = this.data.cart.total - price;
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

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var selectProduct = this.data.selectProduct;
    var res = e.detail.value;
    var ingredients = this.data.ingredients;
    var item = {};
    var list = [];
    var type_list = selectProduct.ingred_type_list;
    for (var index in type_list) {
      var checkbox = 'checkbox-group' + index;
      var radio = 'radio-group' + index;

      console.log(res[checkbox]);
      console.log(res[radio]);
      if (res[checkbox].length > 0) {
        for (var i in res[checkbox]) {
          list.push(res[checkbox][i]);
        }
      } else {
        if (type_list[index].required == 1 && res[radio] == '') {
          wx.showToast({
            title: 'Select all required fields.',
          })
          return;
        }
      }
      if (res[radio] != '') {
        list.push(res[radio]);
      }
    }

    console.log('选项规格数组');
    console.log(list);
    var nameString = '';
    var sumPrice = 0;
    for (var index in list) {
      var subItem = {};
      var itemList = list[index].split('@');
      subItem.ingredient_id = itemList[0];
      subItem.price = itemList[2];
      sumPrice += parseFloat(itemList[2]);
      item[index] = subItem;
      nameString += itemList[1] + ',';
    }
    nameString = nameString.substring(0, nameString.length - 1);
    item.ingredient_name = nameString;
    item.ingredient_names = nameString;//游客下单
    console.log('ingredients对象：');
    console.log(item);
    var productItem = this.data.productItem;
    productItem.ingredients = item;
    productItem.pay = sumPrice + productItem.price;
    productItem.name = productItem.name + '(' + nameString + ')';
    console.log('productItem对象：');
    console.log(productItem);
    var cartList = this.data.cartList;

    var product;
    var index;
    if ((index = this.checkOrderSame(productItem.name))) {
      product = cartList[index];
      var num = product.num;
      var price = product.pay / product.num;
      product.num = num + 1;
      product.pay = this.toDecimal(price * product.num);
    } else {
      cartList.push(productItem);
    }

    this.setData({
      cartList: cartList,
      localList: server.filterEmptyObject(list)
    });
    this.checkProductName(this.data.product);
    this.addCount(productItem);
    this.powerDrawer();
  },

  //提交订单
  submit: function (e) {
    if (this.data.shop.open_restaurant != 1) {
      wx.showModal({
        title: '提示',
        content: '该商店已打烊！',
        showCancel: false
      });
      return;
    }
    var shop = this.data.shop;
    var total = this.data.cart.total;
    var shopId = this.data.shopId;
    console.log(shop);

    if (!app.globalData.hasLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        cancelText: '快速支付',
        confirmText: '登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/page/login/login'
            })
          } else if (res.cancel) {
            wx.navigateTo({
              url: '/page/express/express?pay=1&total=' + total + '&shopId=' + shopId
              + '&tax_percentage=' + shop.tax_percentage + '&tax_label_name=' + shop.tax_label_name
              + '&delivery_cost_fixed=' + shop.delivery_cost_fixed
              + '&baserate=' + shop.baserate + '&basedistance=' + shop.basedistance
              + '&contact_address=' + shop.contact_address + '&vendors_id=' + shop.vendors_id
              + '&contact_email=' + shop.contact_email
            })
          }
        }
      })
      return;
    }

    wx.navigateTo({
      url: '/page/order/order?pay=1&total=' + total + '&shopId=' + shopId
      + '&tax_percentage=' + shop.tax_percentage + '&tax_label_name=' + shop.tax_label_name
      + '&delivery_cost_fixed=' + shop.delivery_cost_fixed
      + '&baserate=' + shop.baserate + '&basedistance=' + shop.basedistance
      + '&contact_address=' + shop.contact_address + '&vendors_id=' + shop.vendors_id
      + '&contact_email=' + shop.contact_email
    })
  },

  //弹框
  powerDrawer: function () {
    if (this.data.showModalStatus) {
      this.util('close');
    } else {
      this.util('open');
    }

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

});

