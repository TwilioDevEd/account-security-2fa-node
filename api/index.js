var middleware = require('./middleware');
var users = require('./users');
var sessions = require('./sessions');
var bodyParser = require('body-parser');

// Mount API routes on the Express web app
module.exports = function(app) {
    // Look for session information before API requests
    app.use(middleware.loadUser);

    // Create a new user
    app.post('/user', users.create);

    // Get information about the currently logged in user
    app.get('/user', middleware.loginRequired, users.getUser);

    // Create a new session
    app.post('/session', sessions.create);

    // Log out (destroy a session)
    app.delete('/session', middleware.loginRequired, sessions.destroy);

    // Check the OneTouch status on the user
    app.get('/authy/status', sessions.authyStatus);

    // The webhook that Authy will call on a OneTouch event
    app.post('/authy/callback', bodyParser.json(), middleware.validateSignature, sessions.authyCallback);

    // Validate the given session with an Authy 2FA token
    app.post('/session/verify', sessions.verify);

    // resend an authorization token
    app.post('/session/resend', sessions.resend);
};