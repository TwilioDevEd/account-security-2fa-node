var User = require('../models/User');
var Session = require('../models/Session');

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