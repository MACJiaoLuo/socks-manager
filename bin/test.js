var crypto = require('crypto');
var aes256js = require('./aes256Cipher');
var signService = require('./signService');
var request = require('request');


var old_user = 'old_socks5_user';
var old_pass = 'old_socks5_pass';

var data = {};
data.uuid           = 'uuid'
data.tg_userId      = '123456';
data.old_user       = old_user;//16 byte
data.old_pass_hash  = crypto.createHash('sha256').update(old_pass).digest('hex').substr(0,32);//32 byte

var req = {};
req.nonce          = crypto.randomBytes(16).toString('hex');
req.timestamp      = new Date().getTime() / 1000;
req.data           = aes256js.encrypt(aes256js.makeEncryptKey(req.nonce,req.timestamp),aes256js.makeIv,JSON.stringify(data));

req.sign           = signService.sign(req.data,req.nonce,req.timestamp);

console.log('request: '+JSON.stringify(req));


var options = {
    uri: 'http://127.0.0.1:3000/api/update',
    method: 'POST',
    json: req
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('response: '+JSON.stringify(body)) // Print the shortened url.
    }
});