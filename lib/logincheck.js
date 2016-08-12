/**
 * Created by Fabian on 12.08.2016.
 */
var redis = require("redis");

var loginUrl;
var redisClient;

function checkLoggedIn(req, res, next) {
    var sessionCookie = req.cookies.get('WIPHPSESSID');
    console.log("DEBUG: check if user is logged in, cookie: ", sessionCookie);
    redisClient.get("PHPREDIS_SESSION:"+sessionCookie.toString(), function (err, reply) {
        console.log("DEBUG: redis result: ", err, reply);
        if(err || reply == null || reply.toString().indexOf('userid') === -1) {
            //User not logged in, redirecting
            res.writeHead(301, {Location: loginUrl});
            res.end();
            console.log("DEBUG: redirecting to login url");
            return;
        }
        console.log("DEBUG: user is logged in, continuing");
        next();
    });
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