var signService = require('./signService');
var redisService = require('./redisService');
var aes256js = require('./aes256Cipher');
var crypto = require('crypto');

//解密请求数据
function decryptData(body) {
    var d = decrypt(body.data,body.nonce,body.timestamp);
    var data = JSON.parse(d);
    return data;
}

//加密响应数据
function encryptData(response) {
    response.nonce = crypto.randomBytes(16).toString('hex');
    response.timestamp = new Date().getTime()/1000;
    var d = encrypt(JSON.stringify(response.data),response.nonce,response.timestamp);
    var data = {};
    data.nonce = response.nonce;
    data.timestamp = response.timestamp;
    data.data = d;
    data.sign = signService.sign(d,response.nonce,response.timestamp);
    return JSON.stringify(data);
}

//解密方法
function decrypt(data,nonce,timestamp) {
    var result = aes256js.decrypt(aes256js.makeEncryptKey(nonce,timestamp),aes256js.makeIv,data);
    return result;
}

//加密方法
function encrypt(data,nonce,timestamp) {
    var result = aes256js.encrypt(aes256js.makeEncryptKey(nonce,timestamp),aes256js.makeIv,data);
    return result;
}

var secureService = {
    check:function (body,callback) {
        if(signService.checkSign(body.nonce,body.timestamp,body.data,body.sign)){
            //判断timestamp参数是否有效
            if(Number(new Date().getTime()/1000) - Number(body.timestamp) > 60){
                return callback(null);
            }
            //判断nonce参数是否在已存在
            redisService.checkNonce(body.nonce,function (nonceStatus) {
                if(nonceStatus){
                    return callback(null);
                }else{
                    //记录本次请求的nonce参数
                    redisService.saveNonce(body.nonce);
                    //开始处理合法的请求
                    var data = decryptData(body);
                    return callback(data);
                }
            });
        }else{
            callback(null);
        }
    },
    encryptResponse:function(response){
        var encryptResponse = encryptData(response);
        return encryptResponse;
    }
};


module.exports =secureService;