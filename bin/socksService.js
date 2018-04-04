var redisService = require('./redisService');
var crypto = require('crypto');


var socksService = {
    requestSocksProxy:function(req){

        var uuid          = req.uuid;
        var tg_userId     = req.tg_userId;
        var old_user      = req.old_user;//16 byte
        var old_pass_hash = req.old_pass_hash;//32 byte

        //生成新用户
        var user = crypto.randomBytes(16).toString('hex');
        var pass = crypto.randomBytes(16).toString('hex');
        redisService.saveSocksUserAndPass(user,pass);

        //删除旧用户,如果有
        if(old_user && old_pass_hash){
            redisService.deleteSocksUser(old_user,old_pass_hash);
        }

        var data = {};
        data.status = '0';
        data.desc = 'success';
		
		//socks5 代理服务器
        data.ip = '192.168.2.21';
        data.port = '2222';
		//用户名密码
        data.user = user;
        data.pass = pass;

        var resp = {};
        resp.data = data;
        return resp;
    }
};


module.exports = socksService;