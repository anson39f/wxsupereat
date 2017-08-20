var app = getApp();
var server = require('../../utils/server');
Page({
  data: {
    filterId: 1,
    address: '广州天河大厦',
    banners: [
      {
        id: 3,
        img: 'https://supeat.ca/apiv1/ADimage/9/1.jpg',
        url: '',
        name: '马队长'
      },
      {
        id: 1,
        img: 'https://supeat.ca/apiv1/ADimage/9/2.jpg',
        url: '',
        name: '告别午高峰'
      },
      {
        id: 2,
        img: 'https://supeat.ca/apiv1/ADimage/9/3.jpg',
        url: '',
        name: '金牌好店'
      }
    ],
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
    shops: app.globalData.shops,
    imagepath: [],
  },
  onLoad: function () {
    var self = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        server.getJSON('dwq/WxAppApi/location.php', {
          latitude: latitude,
          longitude: longitude
        }, function (res) {
          console.log(res)
          if (res.data.status != -1) {
            self.setData({
              // address: res.data.result.address_component.street_number
            });
          } else {
            self.setData({
              address: '定位失败'
            });
          }
        });
      }
    });

    server.getJSON('https://supeat.ca/apiv1/getdata.php', {
      areaid: 9
    }, function (res) {
      console.log(res)
      if (res.statusCode == 200) {
        var list = res.data;
        var arry = [];
        for (var i = 0; i < list.length; i++) {
          var time = list[i].starttime;
          var flag = self.time_range(time);
          if (flag) {
            arry.push('/imgs/index/openingcn.png');
          } else {
            arry.push('/imgs/index/closed_cn.png');
          }
        }
        self.setData({
          imagepath: arry
        });
        self.setData({
          shops: res.data
        });
        app.globalData.shops = res.data;
        console.log("------------成功-------------" + res.data[0].shopname + " : " + app.globalData.shops[0].shopname);
      } else {
        console.log("----------失败---------------" + res);
      }
    });

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
    var name = this.data.banners[e.target.dataset.id].name;
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

  }
});

