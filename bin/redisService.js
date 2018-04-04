var redisUtil = require('./redisUtils');
var crypto = require('crypto');

var noncePrefix = 'socks5api:tmp:nonce:';
var socks5HashKey = 'socks5';

function makeNonceKey(nonce) {
    return noncePrefix + nonce;
}

var redisService = {
    saveNonce:function (nonce) {
        var redisClient = redisUtil.getRedisClient();
        var key = makeNonceKey(nonce);
        redisClient.set(key, '1');
        redisClient.expire(key, 60);
    },
    checkNonce:function (nonce,callback) {
        var redisClient = redisUtil.getRedisClient();
        var key = makeNonceKey(nonce);
        redisClient.get(key,function (err,res) {
            if(err || !res)
            {
                callback(null);
            }
            else
            {
                callback(res);
            }
        });
    },
    saveSocksUserAndPass:function (user,pass) {
        var redisClient = redisUtil.getRedisClient();
        redisClient.hset(socks5HashKey,user,pass);
        console.log('add socks5 user :'+user);
    },
    deleteSocksUser:function (user,passHash) {
        var redisClient = redisUtil.getRedisClient();
        redisClient.hget(socks5HashKey,user,function (err,resp) {
            if(!err && resp){
                var realPassHash = crypto.createHash('sha256').update(resp).digest('hex');
                if(realPassHash.substr(0,32) == passHash){
                    console.log('delete socks5 user :'+user);
                    redisClient.hdel(socks5HashKey,user);
                }
            }
        });
    }

}

module.exports = redisService;