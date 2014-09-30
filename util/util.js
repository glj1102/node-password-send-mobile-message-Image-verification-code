var dateFormat = require('dateformat');
var err = require("../config/err.js");
exports.getOptions=function getOptions(host,port,path,type){
    var options = {
        host: host,
        port: port,
        path: path,
        method: type,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return options;
};

exports.getCode = function getCode() {
   var len = 32;
   var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var maxPos = $chars.length;
   var code = '';
   for (i = 0; i < len; i++) {
       code += $chars.charAt(Math.floor(Math.random() * maxPos));
   }
   return code;
}

exports.getErrMessage = function(code,request){
    var result = {"code":code,"message":err[code],"request":request};
    return result;
}

exports.page = function page(count,pagesize){
    var page=0;
    if(count%pagesize==0){
        page=count/pagesize;
    }else
        page=parseInt(count/pagesize)+1;
    return page;
}


