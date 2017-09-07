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
      AddrString: this.data.searchWords
    }, function (res) {
      console.log(res);
      var response = res.data.response;
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
    })
    
  },

});

