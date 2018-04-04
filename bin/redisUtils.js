var redis = require('redis');
//redis
var redisClient;
var redisHost = '10.144.0.144';
var redisPort = '6379';
var redisPassword = "redis";

var redisDB = 0;

function connectRedis() {
    var redisOpt = {auth_pass:redisPassword};
    redisClient = redis.createClient(redisPort, redisHost,redisOpt);
    redisClient.on('ready',function (resp) {
        console.log('redis ready');
    });
}
//connect redis
connectRedis();

var redisUtils = {
    getRedisClient:function () {
        return redisClient;
    }
};

module.exports = redisUtils;