var middleware = require('./middleware');
var users = require('./users');
var sessions = require('./sessions');

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

    // Validate the given session with an Authy 2FA token
    app.post('/session/verify', sessions.verify);

    // resend an authorization token
    app.post('/session/resend', sessions.resend);
};