/**
 * Created by Fabian on 12.08.2016.
 */
var redis = require("redis");

var loginUrl;
var redisClient;

function checkLoggedIn(req, res, next) {
    var sessionCookie = req.cookies.get('WIPHPSESSID');
    if(!sessionCookie) {
        redirect(res);
        return;
    }
    redisClient.get("PHPREDIS_SESSION:"+sessionCookie.toString(), function (err, reply) {
        if(err || reply == null || reply.toString().indexOf('userid') === -1) {
            //User not logged in, redirecting
            redirect(res);
            return;
        }
        next();
    });
}

function redirect(res) {
    res.writeHead(301, {Location: loginUrl});
    res.end();
}

module.exports = {
    init: function(config) {
        loginUrl = config.phpsession.loginUrl;
        //Connecting to redis based on configuration
        redisClient = redis.createClient(config.phpsession.port, config.phpsession.host, {db: config.phpsession.db});
        redisClient.auth(config.phpsession.password);
        return checkLoggedIn;
    }
};