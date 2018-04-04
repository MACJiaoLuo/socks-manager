/**
 * Created by Awesometic
 * references: https://gist.github.com/ericchen/3081970
 * This source is updated example code of above source code.
 * I added it two functions that are make random IV and make random 256 bit key.
 * It's encrypt returns Base64 encoded cipher, and also decrpyt for Base64 encoded Cipher
 */

var crypto = require('crypto');

var AESCrypt = {};

AESCrypt.encrypt = function(cryptKey, crpytIv, plainData) {
    var encipher = crypto.createCipheriv('aes-256-ctr', cryptKey, crpytIv),
        encrypted = encipher.update(plainData, 'utf8', 'binary');

    encrypted += encipher.final('binary');

    return new Buffer(encrypted, 'binary').toString('hex');
};

AESCrypt.decrypt = function(cryptKey, cryptIv, encrypted) {
    encrypted = new Buffer(encrypted, 'hex').toString('binary');

    var decipher = crypto.createDecipheriv('aes-256-ctr', cryptKey, cryptIv),
        decrypted = decipher.update(encrypted, 'binary', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
};

AESCrypt.makeIv = '1234567890123456';

AESCrypt.sharedPassword = 'this_is_a_password?';

AESCrypt.makeEncryptKey = function(nonce,timestamp) {
    var hash = crypto.createHash('sha256').update(AESCrypt.sharedPassword+nonce+timestamp).digest('hex');
    return hash.substr(0,32);
}

module.exports = AESCrypt;

function test() {
    var testKey = crypto.createHash('sha256').update('123456').digest('hex');
    testKey = testKey.substr(0,32);

    var encrytext = AESCrypt.encrypt(testKey,AESCrypt.makeIv,"text");
    console.log(encrytext);

    var decrytext = AESCrypt.decrypt(testKey,AESCrypt.makeIv,encrytext);
    console.log(decrytext);
}
