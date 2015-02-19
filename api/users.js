var User = require('../models/User');
var Session = require('../models/Session');
var error = require('./response_utils').error;
var ok = require('./response_utils').ok;

// Create a new User
exports.create = function(request, response) {
    var p = request.body;
    var newUser = new User({
        fullName: p.fullName,
        email: p.email,
        phone: p.phone,
        countryCode: p.countryCode,
        password: p.password
    });

    newUser.save(function(err, doc) {
        if (err) {
            error(response, 500, 'Error saving new user - please try again.');
        } else {
            // Create a pre-authorized session token for the new user
            Session.createSessionForUser(doc, true, function(err, sessionDoc) {
                if (err) {
                    error(response, 500, 'Your user was created but we could '
                        + 'not log you in - please log in again.');
                } else {
                    response.send({
                        token: sessionDoc.token
                    });
                }
            });
        }
    });
};

// get info for currently logged in username
exports.getUser = function(request, response) {
    if (request.user) {
        var u = request.user;
        response.send({
            fullName: u.fullName,
            email: u.email,
            phone: u.phone
        });
    } else {
        error(response, 404, 
            'No user found for session - please log in again.');
    }
};