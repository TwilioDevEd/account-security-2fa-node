(function() {
    app.views.SignupView = app.views.BaseView.extend({
        // name of the template file to load from the server
        templateName: 'signup',

        // UI events
        events: {
            'submit #signupForm': 'signup'
        },

        initialize: function() {
            var self = this;
            // default behavior, render page into #page section
            app.router.on('route:signup', function() {
                self.render();
            });
        },

        // Handle signup form submission
        signup: function(e) {
            var self = this;

            e.preventDefault();
            app.set('message', null);

            $.ajax('/user', {
                method: 'POST',
                data: {
                    fullName: self.$('#fullName').val(),
                    phone: self.$('#phone').val(),
                    email: self.$('#email').val(),
                    password: self.$('#password').val()
                }
            }).done(function(data) {
                // After signup the session is valid right away
                app.set('token', data.token);
                app.router.navigate('user', {
                    trigger: true
                });
            }).fail(function(err) {
                var msg = 'Sorry, an error occurred, please try again.';
                if (err.responseJSON && err.responseJSON.message)
                    msg = err.responseJSON.message;

                app.set('message', {
                    error: true,
                    message: msg
                });
            });
        }
    });
})();