var app = getApp();
var server = require('../../utils/server');
Page({
  data: {
    predictions: [],
    searchWords: '',
    placeholder: 'Ex: 203 Lester St, Toronto ON',
  },
  onLoad: function () {

  },
  onShow: function () {

  },
  inputSearch: function (e) {

    this.setData({
      searchWords: e.detail.value
    });
  },
  doSearch: function () {
    wx.showLoading({
      title: '搜索中...',
    })
    var self = this;
    //获取地址
    server.postJSON('https://supereat.ca/api/autofind_location', {
      AddrString: this.data.searchWords,
      Key: 'IIIc0Co9lU0fnOczgSL52HOqoLFQGC'
    }, function (res) {
      console.log(res);
      console.log(res.data.response);
      var response = res.data.response;
      if (response == undefined) {
        wx.showToast({
          title: '查询失败',
        })
        return;
      }
      if (response.httpCode == 200) {
        var predictionsList = response.List.predictions;
        wx.hideLoading();
        self.setData({
          predictions: predictionsList,
          showResult: true
        });
        console.log("------------成功-------------" + predictionsList[0].description);
      } else {
        console.log("------------失败-------------");
      }
    }, function (res) {
      wx.showToast({
        title: '查询失败',
      })
      console.log("------------超时-------------");
    })

  },
  select: function (e) {
    console.log(e);
    var address = e.currentTarget.dataset.address;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      address: address
    })

    wx.navigateBack();

  }

});

