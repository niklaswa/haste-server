/**
 * Created by Fabian on 12.08.2016.
 */
var redis = require("redis"),
    cookies = require('cookies');

var loginUrl;
var redisClient;

function checkLoggedIn(req, res, next) {
    var sessionCookie = cookies.get('WIPHPSESSID');
    redisClient.get("PHPREDIS_SESSION:"+sessionCookie.toString(), function (err, reply) {
        if(err || reply == null || reply.toString().indexOf('userid') === -1) {
            //User not logged in, redirecting
            res.writeHead(301, {Location: loginUrl});
            res.end();
            return;
        }
        next();
    });
}

module.exports = {
    init: function(config) {
        loginUrl = config.phpsession.loginUrl;
        //Connecting to redis based on configuration
        redisClient = redis.createClient({
            host: config.phpsession.host,
            port: config.phpsession.port,
            auth_redis: config.phpsession.password,
            db: config.phpsession.db
        });
        return checkLoggedIn;
    }
};