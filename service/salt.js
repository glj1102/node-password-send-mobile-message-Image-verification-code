var crypto = require('crypto');

function getRandomSalt(length){
    var charCollection="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result="";
    for(var i=0;i<length;i++)
    {
        var stringLength = Math.random()*62;
        result += charCollection.charAt(Math.ceil(stringLength)%62);
    }
    return result;
}

function combinePlainPasswordAndSalt(plainPassword,salt){
    return salt+plainPassword;
}

function xor(a,b,length){
    var result="";
    for(var i=0;i<length;i++){
        var temp_xor_charCode= a.charCodeAt(i) ^ b.charCodeAt(i);
        result+=temp_xor_charCode;
    }
    return result;
}

exports.encrypt=function(plainPassword,appKey){
    var result={};
    var salt=getRandomSalt(64);
    var combinedPassword=combinePlainPasswordAndSalt(plainPassword,salt);
    var saltedPassword = crypto.createHmac('SHA256', new Buffer(appKey,'utf-8')).update(combinedPassword).digest('hex');
    var xoredPassword=xor(salt,saltedPassword,salt.length);
    result.encryptPassword=xoredPassword;
    result.salt=salt;
    console.log('encrypt,','plainPassword:',plainPassword,',appKey:',appKey,',result:',result);
    return result;
}

exports.verify=function(plainPassword,appKey,salt,encryptPassword){
    var combinedPassword=combinePlainPasswordAndSalt(plainPassword,salt);
    var saltedPassword = crypto.createHmac('SHA256', new Buffer(appKey,'utf-8')).update(combinedPassword).digest('hex');
    var xoredPassword=xor(salt,saltedPassword,salt.length);
    console.log('verify,','plainPassword:',plainPassword,',appKey:',appKey,',salt:',salt,',encryptPassword:',encryptPassword,',result:',xoredPassword == encryptPassword);
    return xoredPassword == encryptPassword;

}

//var r=encrypt('123456','secret');
//console.log(r);
//var t=verify('123456','secret',r.salt,r.encryptPassword);
//console.log(t);
