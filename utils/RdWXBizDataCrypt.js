// 引入CryptoJS
var Crypto = require('cryptojs/cryptojs.js').Crypto;
var app = getApp();

function RdWXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

function decryptData(encryptedData, iv) {
  var key = "1234567812345678";
  // var key = "1234567812345678";
  var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
  var eb = Crypto.util.base64ToBytes('ByQ/XKnzLDJxyAjpSpZ5XQ==');
  var kb = Crypto.charenc.UTF8.stringToBytes(key);//KEY
  var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
  var result = Crypto.AES.decrypt(eb, kb, { asBpytes: true, mode: mode, iv: vb });
  console.log('encryptResult解密：' + result);
  return result
}

// 加密
function encrypted(encryptedData, iv) {
  var key = "bcb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3";
  // var key = "1234567812345678";
  var iv = iv;

  // 对称解密使用的算法为 AES-128-CBC，数据采用PKCS#7填充
  var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
  var eb = Crypto.charenc.UTF8.stringToBytes('hello world');
  var kb = Crypto.charenc.UTF8.stringToBytes(key);//KEY
  var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
  var result = Crypto.AES.encrypt(eb, kb, { iv: vb, mode: mode, asBpytes: true });

  console.log('encryptResult加密：' + result);

  decryptData('', '');
  return result
}

// module.exports = RdWXBizDataCrypt
module.exports = {
  encrypted: encrypted
}