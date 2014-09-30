/**
 * Created by heiwu on 7/22/14.
 */
//require the Twilio module and create a REST client
var crypto = require('crypto');
var cache = require('im-cache');
var us = require("underscore")._;
var util = require("../util/util.js");
var twilio = require('twilio');
var client = new twilio.RestClient('ACCOUNT_SID', 'AUTH_TOKEN');
exports.send_message=function(req,res){
    var code = randomCode();
    var phone = req.headers.phone;
    if(phone==undefined || phone==""){
        var result = util.getErrMessage("104000",req.url);
        res.json(result);
        return;
    }
    //Send an text message
    client.sendMessage({
        to: '+'+phone, // Any number Twilio can deliver to
        from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
        body: '欢迎使用好课网，您的验证码：'+ code// body of the SMS message
    }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
            var code_md5=crypto.createHash('md5').update(code).digest('hex');
            cache.set(code_md5, code, 1000*60*30);
            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."
            res.writeHead(200, { 'Content-Type': 'application/json','code_md5':code_md5});
            res.json({"result":"success"});
        }else{
            console.log(err);
            res.json({"result":"fail"});
        }

    });
}

exports.verify_message = function(req,res){
    var ct = req.headers["content-type"].split(";");
    var b=us.contains(ct,"application/json");
    if(!b){
        var result = util.getErrMessage("105000",req.url);
        res.json(result);
        return;
    }
    var req_code = req.params.code;
    var code_md5 = req.params.code_md5;
    if(req_code==undefined || req_code==""){
        var result = util.getErrMessage("105002",req.url);
        res.json(result);
        return;
    }else if(code_md5==undefined || code_md5==""){
        var result = util.getErrMessage("105001",req.url);
        res.json(result);
        return;
    }
    var local_code = cache.get(code_md5);
    var b = false;
    if(req_code==local_code)
        b=true;
        cache.remove(code_md5);
    var result = {"result":b};
    res.json(result);
}

function randomCode(){
    var str="0123456789";
    var code = '';
    for(i = 0; i < 6; i++){
        code = code + str.charAt(Math.random() * 10);
    }
    return code;
}