(function() {
    app.views.LoginView = app.views.BaseView.extend({
        // name of the template file to load from the server
        templateName: 'login',

        // UI events
        events: {
            'submit #loginForm': 'login'
        },

        initialize: function() {
            var self = this;
            // default behavior, render page into #page section
            app.router.on('route:login', function() {
                self.render();
            });
        },

        // Hit login service
        login: function(e) {
            var self = this;

            e.preventDefault();
            app.set('message', null);
            $.ajax('/session', {
                method: 'POST',
                data: {
                    email: self.$('#email').val(),
                    password: self.$('#password').val()
                }
            }).done(function(data) {
                // If session returns oneTouch status.success wait for oneStatus approval
                app.set('token', data.token);
                if (data.authyResponse.success) {
                    app.set('onetouch', true);
                    app.set('message', {
                        error: false,
                        message: 'Awaiting One Touch approval.'
                    });
                    self.checkOneTouchStatus();
                } else {
                    app.router.navigate('verify', {
                        trigger: true
                    });
                }
            }).fail(function(err) {
                app.set('message', {
                    error: true,
                    message: err.responseJSON.message ||
                        'Sorry, an error occurred, please log in again.'
                });
            });
        },

        checkOneTouchStatus: function() {
            var self = this;
            $.ajax('/authy/status', {
                method: 'GET',
                headers: {
                    'X-API-TOKEN': app.get('token')
                }
            }).done(function(data) {
                if (data.status == 'approved') {
                    app.router.navigate('user', {
                        trigger: true
                    });
                } else if (data.status == 'denied') {
                    app.router.navigate('verify', {
                        trigger: true
                    });
                    app.set('message', {
                        error: true,
                        message: 'OneTouch Login request denied.'
                    });
                } else {
                    setTimeout(self.checkOneTouchStatus(), 3000);
                }
            });
        }
    });
})();