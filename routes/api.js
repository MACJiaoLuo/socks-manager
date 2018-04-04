var express = require('express');
var router = express.Router();
var secureService = require('../bin/SecureService');
var socksService = require('../bin/socksService');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('socks-mamager');
});

/**
 *
 * {
  "nonce":"4563456",
  "timestamp":"1522407392",
  "data":"{}",
  "sign":"xxx"
}
 */

router.post('/update', function(req, res, next) {
  var body = req.body;
  //完整性检查
  if(body && body.nonce && body.timestamp && body.data && body.sign){
    secureService.check(body,function (data) {
        if(data){
            var response = socksService.requestSocksProxy(data);
            var respEncrypt = secureService.encryptResponse(response);
            res.send(respEncrypt);
        }else {
            res.send('');
        }
    });
  }else {
      res.send('');
  }
});

module.exports = router;
