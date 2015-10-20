var Session = require('../models/Session');
var User = require('../models/User');
var error = require('./response_utils').error;
var ok = require('./response_utils').ok;

// Create a new session, first testing username/password combo
exports.create = function(request, response) {
    var email = request.body.email;
    var candidatePassword = request.body.password;

    // Look for a user by the given username
    User.findOne({
        email: email
    }, function(err, user) {
        if (err || !user) return invalid();

        // We have a user for that username, test password
        user.comparePassword(candidatePassword, function(err, match) {
            if (err || !match) return invalid();
            return valid(user);
        });
    });

    // respond with a 403 for a login error
    function invalid() {
        error(response, 403, 'Invalid username/password combination.');
    }

    // respond with a new session for a valid password, and send a 2FA token
    function valid(user) {
        Session.createSessionForUser(user, false, function(err, sess, authyResponse) {
            if (err || !sess) {
                error(response, 500, 
                    'Error creating session - please log in again.');
            } else {
                // Send the unique token for this session and the onetouch response
                response.send({
                    token: sess.token,
                    authyResponse: authyResponse
                });
            }
        });
    }
};

// Destroy the given session (log out)
exports.destroy = function(request, response) {
    request.session && request.session.remove(function(err, doc) {
        if (err) {
            error(response, 500, 'There was a problem logging you out - please retry.');
        } else {
            ok(response);
        }
    });
};

// Public webhook for Authy to POST to
exports.authyCallback = function(request, response) {
    var authyId = request.body.authy_id;

    // Look for a user with the authy_id supplies
    User.findOne({
        authyId: authyId
    }, function(err, user) {
        if (err || !user) return invalid();
        user.authyStatus = request.body.status;
        user.save();
    });
    response.end();
};

// Internal endpoint for checking the status of OneTouch
exports.authyStatus = function(request, response) {
    var status = (request.user) ? request.user.authyStatus : 'unverified';
    if (status == 'approved') {
        request.session.confirmed = true;
        request.session.save(function(err) {
            if (err) return error(response, 500, 
                'There was an error validating your session.');
        });
    }
    if (!request.session) {
        return error(response, 404, 'No valid session found for this user.');
    } else {
        response.send({ status: status });
    }   
};

// Validate a 2FA token 
exports.verify = function(request, response) {
    var oneTimeCode = request.body.code;

    if (!request.session || !request.user) {
        return error(response, 404, 'No valid session found for this token.');
    }

    // verify entered authy code
    request.user.verifyAuthyToken(oneTimeCode, function(err) {
        if (err) return error(response, 401, 'Invalid confirmation code.');

        // otherwise we're good! Validate the session
        request.session.confirmed = true;
        request.session.save(function(err) {
            if (err) return error(response, 500, 
                'There was an error validating your session.');

            response.send({
                token: request.session.token
            });
        });
    });
};

// Resend validation code
exports.resend = function(request, response) {
    if (!request.user) return error(response, 404, 
        'No user found for this session, please log in again.');

    // Otherwise resend the code
    request.user.sendAuthyToken(function(err) {
        if (!request.user) return error(response, 500, 
            'No user found for this session, please log in again.');

        ok(response);
    });
};