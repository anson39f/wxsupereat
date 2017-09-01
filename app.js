var server = require('./utils/server');
var WXBizDataCrypt = require('utils/RdWXBizDataCrypt');
App({
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
	globalData: {
		hasLogin: false,
		cartList: [],
		userInfo: [],
    url: "https://supeat.ca/",
		shops: [],
    user_id:'',
    token:'',
    email:''
	},
	rd_session: null,
	login: function() {
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
	getUserInfo: function() {
		var self = this;
		wx.getUserInfo({
			success: function(res) {
				self.globalData.userInfo = res.userInfo;
				server.getJSON('dwq/WxAppApi/checkSignature.php', {
					rd_session: self.rd_session,
					signature: res.signature,
					raw_data: res.rawData
				}, function (res) {
					if (!res.data.is_pass) {
						// TODO:验证有误处理
						self.login();
					}
				});
			}			
		});
	}
})
