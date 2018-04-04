var crypto = require('crypto');

var signPassword = 'this_is_sign_password';

var signService = {
    checkSign:function (nonce,timestamp,data,sign) {
        var realSign = crypto.createHash('sha256').update(signPassword+nonce+timestamp).digest('hex');
        if(realSign.substr(0,32) == sign){
            return true;
        }
        return false;
    },
    sign:function (data,nonce,timestamp) {
        var sign = crypto.createHash('sha256').update(signPassword+nonce+timestamp).digest('hex');
        return sign.substr(0,32);
    }
};


module.exports = signService;