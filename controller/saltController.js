/**
 * Created by heiwu on 7/21/14.
 */
var salt = require("../service/salt.js");
var us = require("underscore")._;
var util = require("../util/util.js");

exports.encrypt = function (req, res) {
    var ct = req.headers["content-type"].split(";");
    var b = us.contains(ct, "application/json");
    if (!b) {
        var result = util.getErrMessage("100000", req.url);
        res.json(result);
        return;
    }
    var plainPassword = req.params.password;
    var appKey = req.params.key;
    if (plainPassword == undefined || plainPassword == "") {
        var result = util.getErrMessage("100001", req.url);
        res.json(result);
        return;
    } else if (appKey == undefined || appKey == "") {
        var result = util.getErrMessage("100002", req.url);
        res.json(result);
        return;
    }
    var result = salt.encrypt(plainPassword, appKey);
    res.json(result);
}

exports.verify = function (req, res) {
    var ct = req.headers["content-type"].split(";");
    var b = us.contains(ct, "application/json");
    if (!b) {
        var result = util.getErrMessage("101000", req.url);
        res.json(result);
        return;
    }
    var password = req.params.password;
    var appKey = req.params.key;
    var _salt = req.params.salt;
    var encryptPassword = req.params.encryptPassword;
    if (password == undefined || password == "") {
        var result = util.getErrMessage("101001", req.url);
        res.json(result);
        return;
    } else if (appKey == undefined || appKey == "") {
        var result = util.getErrMessage("101002", req.url);
        res.json(result);
        return;
    } else if (_salt == undefined || _salt == "") {
        var result = util.getErrMessage("101003", req.url);
        res.json(result);
        return;
    } else if (encryptPassword == undefined || encryptPassword == "") {
        var result = util.getErrMessage("101004", req.url);
        res.json(result);
        return;
    }
    var result = salt.verify(password, appKey, _salt, encryptPassword);
    var data = {"result": result};
    res.json(data);
}