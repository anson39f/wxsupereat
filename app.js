var server = require('./utils/server');
var WXBizDataCrypt = require('utils/RdWXBizDataCrypt');
App({
  globalData: {
    hasLogin: false,
    cartList: [],
    userInfo: [],
    city_list:[],
    cityIndex:8,
    url: "https://supeat.ca/",
    shops: [],
    user_id: '',
    token: '',
    email: '',
    latitude:'',
    longitude:'',
    language:2,
  },
  onLaunch: function () {
    console.log('App Launch')
    var self = this;
    var rd_session = wx.getStorageSync('rd_session');
    if (!rd_session) {
      self.login();
    } else {
      wx.checkSession({
        success: function () {
          // 登录态未过期
          console.log('登录态未过期')
          self.rd_session = rd_session;
          self.getUserInfo();
        },
        fail: function () {
          //登录态过期
          console.log('过期');
          self.login();
        }
      })
    }
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        self.globalData.latitude = res.latitude;
        self.globalData.longitude = res.longitude;
      }
    });
    // var pc = new WXBizDataCrypt('', '123456');
    var timestamp = Date.parse(new Date());
    var data = WXBizDataCrypt.encrypted(timestamp, 12364562101404525254);
    console.log(timestamp + ':加密后 data: ' + data);
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },

  rd_session: null,
  login: function () {
    // var self = this;
    // wx.login({
    // 	success: function (res) {
    // 		console.log('wx.login', res)
    // 		server.getJSON('dwq/WxAppApi/setUserSessionKey.php', {code: res.code}, function (res) {
    // 			self.rd_session = res.data.rd_session;
    // 			self.globalData.hasLogin = true;
    // 			wx.setStorageSync('rd_session', self.rd_session);
    // 			self.getUserInfo();
    // 		});
    // 	}
    // });
  },
  getUserInfo: function () {
    var self = this;
    wx.getUserInfo({
      success: function (res) {
        
      }
    });
  }
})
