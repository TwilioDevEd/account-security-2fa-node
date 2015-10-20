var User = require('../models/User');
var Session = require('../models/Session');
var config = require('../config');
var crypto = require('crypto');
var Qs = require('qs');

// Extract user model information for every request based on an auth token
exports.loadUser = function(request, response, next) {
    var token = request.get('X-API-TOKEN');
    if (!token) return next();

    // Find session by token, if it exists
    Session.findOne({
        token: token
    }, function(err, doc) {
        if (err || !doc) return next();

        // Store session model on request
        request.session = doc;

        User.findById(doc.userId, function(err, doc) {
            if (doc && !err) request.user = doc;
            return next();
        });
    });
};

// Authentication middleware
exports.loginRequired = function(request, response, next) {
    if (!request.session || !request.session.confirmed) {
        response.status(403).send({
            status: 403,
            message: 'Your session has expired - please log in again.'
        });
    } else {
        next();
    }
};

var sort = function alphabeticalSort (a, b) {
    return a.localeCompare(b);
};

function sortObject(object){
    var sortedObj = {},
    keys = Object.keys(object);

    keys.sort(function(key1, key2){
        key1 = key1.toLowerCase(), key2 = key2.toLowerCase();
        if(key1 < key2) return -1;
        if(key1 > key2) return 1;
        return 0;
    });

    for(var index in keys){
        var key = keys[index];
        if(typeof object[key] == 'object' && !(object[key] instanceof Array) && object[key] != null){
            sortedObj[key] = sortObject(object[key]);
        } else {
            sortedObj[key] = object[key];
        }
    }
    return sortedObj;
}

// Authenticate Authy request
exports.signRequest = function(request, reponse, next) {
    var key = config.authyApiKey;
    var url = request.protocol + '://' + request.get('host') + request.originalUrl;
    var params = Qs.stringify(sortObject(request.body));
    params = params.replace(/%20/g, "+");
    var nonce = request.get("X-Authy-Signature-Nonce");  

    // format of Authy digest
    var message = nonce + "|" + request.method + "|" + url + "|" + params;
    
    var theirs = (request.get("X-Authy-Signature")).trim();
    var mine = crypto.createHmac('sha256', key).update(message).digest('base64');
    if (theirs != mine) {
        response.status(401).send({
            status: 401,
            message: "This request is unsigned."
        });
    } else {
        console.log(theirs, mine);
        console.log(theirs == mine);
        next();
    }
};