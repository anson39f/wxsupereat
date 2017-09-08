var app = getApp();
var server = require('../../utils/server');
Page({
  data: {
    filterId: 1,
    address: '获取中..',
    index: 0,
    addressString: [],
    city_list: [],
    banners: [],
    language: '2',
    icons: [
      [
        {
          id: 1,
          img: '/imgs/index/noodles.png',
          name: '中餐',
          url: ''
        },
        {
          id: 2,
          img: '/imgs/index/cutlery.png',
          name: '西餐',
          url: ''
        },
        {
          id: 3,
          img: '/imgs/index/southkorea.png',
          name: '韩国',
          url: ''
        },
        {
          id: 4,
          img: '/imgs/index/halalsign.png',
          name: '清真',
          url: ''
        }
      ]
    ],
    url: app.globalData.url,
    shops: [],

  },
  onLoad: function () {
    var self = this;
    wx.showLoading({
      title: '加载中',
    });

    this.setData({
      language: app.globalData.language,
    });

    this.getCityList();

    //获取商店列表
    server.postJSON('https://supereat.ca/api/store_list', {
      city: 69,//71
      location: server.getLocation(69),//1035
      category_ids: "",
      cuisine_ids: "",
      language: app.globalData.language,
      sortby: "",
      orderby: ""
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        var arry = [];
        var open = [];
        var close = [];
        open = response.open_store_list;
        close = response.closed_store_list;
        arry = arry.concat(open);
        arry = arry.concat(close);
        self.setData({
          shops: arry
        });

        self.setData({
          banners: response.banners
        });
        app.globalData.shops = arry;
        wx.hideLoading();
        console.log("------------成功-------------" + arry.length);
      } else {
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
            self.getCityList();
          }
        }
      })
      console.log("------------超时-------------");
    })
    // wx.startPullDownRefresh({
    //   success:function(){
    //     self.onPullDownRefresh();
    //   }
    // })
  },

  getCityList: function () {
    var self = this;
    //获取城市
    server.postJSON('https://supereat.ca/api/city-list', {
      country_id: 65,
      language: app.globalData.language,
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
          address: response.city_list[8].city_name,
        });
        app.globalData.city_list = response.city_list;
        console.log("------------成功-------------");
      } else {
        self.setData({
          address: '获取失败'
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
            self.getCityList()
          }
        }
      })
      console.log("------------超时-------------");
    })
  },

  getStoreList: function () {
    wx.showLoading({
      title: '加载中',
    });
    var self = this;
    var city = this.data.city_list[this.data.index];
    //获取商店列表
    server.postJSON('https://supereat.ca/api/store_list', {
      city: city.id,//71
      location: server.getLocation(city.id),//1035
      category_ids: "",
      cuisine_ids: "",
      language: app.globalData.language,
      sortby: "",
      orderby: ""
    }, function (res) {
      console.log(res);
      var response = res.data.response;
      if (response.httpCode == 200) {
        var arry = [];
        var open = [];
        var close = [];
        open = response.open_store_list;
        close = response.closed_store_list;
        arry = arry.concat(open);
        arry = arry.concat(close);
        self.setData({
          shops: arry
        });

        self.setData({
          banners: response.banners
        });
        app.globalData.shops = arry;
        wx.hideLoading();
        console.log("------------成功-------------" + arry.length);
      } else {
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
            self.getStoreList()
          }
        }
      })
      console.log("------------超时-------------");
    })
  },

  time_range: function (sourceTime) {
    var args = sourceTime.split("-");
    var beginTime = args[0];
    var endTime = args[1];
    var strb = beginTime.split(":");
    if (strb.length != 2) {
      return false;
    }
    var stre = endTime.split(":");
    if (stre.length != 2) {
      return false;
    };

    var b = new Date();
    var e = new Date();
    var n = new Date();
    n.setMinutes(n.getMinutes() + n.getTimezoneOffset() - 300);
    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);

    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
      return true;
    } else {
      console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在该时间范围内！");
      return false;
    }
  },

  onShow: function () {
    if (this.data.language != app.globalData.language) {
      this.getStoreList();
      this.setData({
        language: app.globalData.language
      })
    }

  },
  onScroll: function (e) {
    if (e.detail.scrollTop > 100 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 100 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }
  },
  tapSearch: function () {
    wx.navigateTo({ url: 'search' });
  },
  toNearby: function () {
    var self = this;
    self.setData({
      scrollIntoView: 'nearby'
    });
    self.setData({
      scrollIntoView: null
    });
  },
  tapFilter: function (e) {
    switch (e.target.dataset.id) {
      case '1':
        this.data.shops.sort(function (a, b) {
          return a.id > b.id;
        });
        break;
      case '2':
        this.data.shops.sort(function (a, b) {
          return a.sales < b.sales;
        });
        break;
      case '3':
        this.data.shops.sort(function (a, b) {
          return a.distance > b.distance;
        });
        break;
    }
    this.setData({
      filterId: e.target.dataset.id,
      shops: this.data.shops
    });
  },
  tapBanner: function (e) {
    var name = this.data.banners[e.target.dataset.id].banner_link;
    wx.showModal({
      title: '提示',
      content: '您点击了“' + name + '”活动链接，活动页面暂未完成！',
      showCancel: false
    });
  },
  isClose: function (e) {
    var item = e.target.dataset.getItem;
    // wx.showModal({
    //   title: '提示',
    //   content: '您点击了“' + item.starttime + '”活动链接，活动页面暂未完成！',
    //   showCancel: false
    // });

  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      address: this.data.addressString[e.detail.value],
      shops: []
    })
    app.globalData.cityIndex = e.detail.value;
    this.getStoreList();
  },
});

