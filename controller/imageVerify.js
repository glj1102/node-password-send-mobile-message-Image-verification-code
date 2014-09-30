/**
 * Created by heiwu on 7/21/14.
 */
var Canvas = require('canvas');
var crypto = require('crypto');
var cache = require('im-cache');
var us = require("underscore")._;
var util = require("../util/util.js");
exports.fetch_image = function (req, res) {
    var width = req.headers.width==undefined ? 90 : Number(req.header.width);
    var height = req.headers.height==undefined ? 30 : Number(req.header.height);
    if(isNaN(width)){
        var result = util.getErrMessage("102000",req.url);
        res.json(result);
        return;
    }else if(isNaN(height)){
        var result = util.getErrMessage("102001",req.url);
        res.json(result);
        return;
    }
    var canvas = new Canvas(width, height),
        ctx = canvas.getContext('2d'),
        items = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRSTUVWXYZ0123456789'.split(''),
        vcode = '',
        textColors = ['#FD0', '#6c0', '#09F', '#f30', '#aaa', '#3cc', '#cc0', '#A020F0', '#FFA500', '#A52A2A', '#8B6914', '#FFC0CB', '#90EE90'];

    ctx.fillStyle = modBgColor();
    ctx.fillRect(0, 0, width, height);
    ctx.font = 'bold 20px sans-serif';

    ctx.globalAlpha = .8;
    for (var i = 0; i < 4; i++) {
        var rnd = Math.random();
        var item = Math.round(rnd * (items.length - 1));
        var color = Math.round(rnd * (textColors.length - 1));
        ctx.fillStyle = textColors[color];
        ctx.fillText(items[item], 5 + i*20, 25);
        vcode += items[item];
    }
    canvas.toBuffer(function(err, buf){
        var image_md5=crypto.createHash('md5').update(buf).digest('hex');
        cache.set(image_md5, vcode.toLowerCase(), 1000*60*30);
        res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': buf.length ,'image_md5':image_md5});
        res.end(buf);
    });
};

exports.verify_image = function(req,res){
    var ct = req.headers["content-type"].split(";");
    var b=us.contains(ct,"application/json");
    if(!b){
        var result = util.getErrMessage("103000",req.url);
        res.json(result);
        return;
    }
    var image_md5 = req.params.image_md5;
    var req_code = req.params.code;
    if(image_md5==undefined || image_md5==""){
        var result = util.getErrMessage("103001",req.url);
        res.json(result);
        return;
    }else if(req_code==undefined || req_code==""){
        var result = util.getErrMessage("103002",req.url);
        res.json(result);
        return;
    }
    var local_code = cache.get(image_md5);
    var b = false;
    console.log("local_code:"+local_code);
    console.log("req_code:"+req_code.toLocaleLowerCase());
    if(req_code.toLowerCase()==local_code)
        b=true;
        cache.remove(image_md5);
    var result = {"result":b};
    res.json(result);
}

function modBgColor(){
    var str="0123456789abcde";
    var color = '#';
    for(i = 0; i < 6; i++){
        color = color + str.charAt(Math.random() * 15);
    }
    return color;
}