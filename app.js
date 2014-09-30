/**
 * Created by heiwu on 7/4/14.
 */
var restify = require("restify");
var conf = require("./config/conf.js");
var saltController = require("./controller/saltController.js");
var imageVerify = require("./controller/imageVerify.js");
var phoneMessage = require("./controller/phoneMessage.js");
var bunyan = require('bunyan');
var schedule = require("node-schedule");
var log = bunyan.createLogger({
            name: "commons",
            serializers: {
                req: bunyan.stdSerializers.req,
                res: myResSerializer
            }
          });
var server = restify.createServer({
    name: 'commons',
    version: '1.0.0',
    log:log
});

function myResSerializer(res) {
    return {
        statusCode: res.statusCode,
        url: res.req.url,
        headers: res._headers,
        data: res._body
    }
}
server.pre(function (request, response, next) {
    request.log.info({ req: request }, 'REQUEST');
    next();
});

server.pre(restify.pre.userAgentConnection());

server.on('NotFound',function (request, response, cb) {
    response.send('Not Found');
    cb();
});

server.on('after',function (request, response, route,error) {
    response.log.info({ res: response }, 'RESPONSE');
});


server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.conditionalRequest());

server.post('/commons/password/encrypt',saltController.encrypt); //加密
server.post('/commons/password/verify',saltController.verify);//密码验证
server.get('/commons/picture/fetch',imageVerify.fetch_image);//获取图片验证码
server.post('/commons/picture/verify',imageVerify.verify_image);//图片验证码验证
server.get('/commons/phone/send',phoneMessage.send_message);//发送手机短信
server.post('/commons/phone/verify',phoneMessage.verify_message);//验证手机短信
test();
function test() {
    var rule = new schedule.RecurrenceRule();
    var times = [];
    for (var i = 1; i < 60; i++) {
    　   times.push(i);
    }
    rule.second = times;
　　var c = 0;
　　var j = schedule.scheduleJob(rule, function () {
        c++;
      　console.log(c);
    });
}


server.listen(conf.local_port, function () {
    console.log('%s listening at %s', server.name, server.url);

});

