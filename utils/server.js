function __args() {
  var setting = {};
  if (arguments.length === 1 && typeof arguments[0] !== 'string') {
    setting = arguments[0];
  } else {
    setting.url = arguments[0];
    if (typeof arguments[1] === 'object') {
      setting.data = arguments[1];
      setting.success = arguments[2];
      setting.fail = arguments[3];
    } else {
      setting.success = arguments[1];
    }
  }
  if (setting.url.indexOf('https://') !== 0) {
    // setting.url = '';
  }
  return setting;
}
function __json(method, setting) {
  setting.method = method;
  setting.header = {
    'content-type': 'application/json'
  };
  wx.request(setting);
}
//初始化时间重写方法
function initDate(){
  Date.prototype.format = function (format) {
    var date = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
      }
    }
    return format;
  }
  var newDate = new Date();
  console.log('当前日期：' + newDate.format('yyyy-MM-dd'));
  return newDate.format('yyyy-MM-dd');
}

function formatTime(date) {
  const year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isEmptyObject(obj) {
  if ((typeof obj === "object" && !(obj instanceof Array)) || ((obj instanceof Array) && obj.length <= 0)) {
    var isEmpty = true;
    for (var prop in obj) {
      isEmpty = false;
      break;
    }
    return isEmpty;
  }
  return false;
}

function filterEmptyObject(list) {
  var cartList = [];
  for (var index in list) {
    if (!this.isEmptyObject(list[index])) {
      cartList.push(list[index])
    }
  }
  return cartList;
}

function selectedShopDetail(shopId) {
  var app = getApp();
  for (var i = 0; i < app.globalData.shops.length; ++i) {
    console.log("---globalData.shops----" + app.globalData.shops[i].outlets_id)
    if (app.globalData.shops[i].outlets_id == shopId) {
      console.log("---globalData.shops----" + app.globalData.shops[i].shoplogo);
      return app.globalData.shops[i]
    }
  }

  return null;
}

//保留两位小数  
//功能：将浮点数四舍五入，取小数点后2位 
function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x * 100) / 100;
  return f;
}


//传cityid获取locationid
function getLocation(id) {
  var locationId = '';
  switch (id) {
    case 70:
      locationId = 1033;
      break;
    case 69:
      locationId = 1032;
      break;
    case 71:
      locationId = 1035;
      break;
    case 72:
      locationId = 1034;
      break;
    case 73:
      locationId = 1036;
      break;
    case 74:
      locationId = 1037;
      break;
    case 75:
      locationId = 1038;
      break;
    case 76:
      locationId = 1039;
      break;
    case 77:
      locationId = 1040;
      break;
  }
  return locationId;
}

module.exports = {
  getJSON: function () {
    __json('GET', __args.apply(this, arguments));
  },
  postJSON: function () {
    __json('POST', __args.apply(this, arguments));
  },
  formatTime: formatTime,
  isEmptyObject: isEmptyObject,
  selectedShopDetail: selectedShopDetail,
  filterEmptyObject: filterEmptyObject,
  toDecimal: toDecimal,
  getLocation: getLocation,
  initDate:initDate,
}
