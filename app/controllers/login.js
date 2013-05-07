Balanced.LoginController = Balanced.ObjectController.extend(Auth.SignInController, {
    email: null,
    password: null,
    loginError: false,
    loginResponse: "",

    init: function() {
        // Not a huge fan of this, better way?
        jQuery("body").css("background-color", "#f2f1ec");
    },
    signIn: function() {
        this.registerRedirect();
        Auth.signIn({
            email_address: this.get('email'),
            password: this.get('password')
        });
        var self = this;
        Auth.on('signInError', function() {
            self.set('loginError', true);
            var response = Auth.get('jqxhr');

            if(response.status === 401) {
                self.set('loginResponse', 'Invalid e-mail address or password.');
                return;
            }

            if(typeof response.responseText !== "undefined") {
                var responseText = JSON.parse(response.responseText);

                var errorText = "";
                if(typeof responseText.email_address !== "undefined") {
                    self.set('loginResponse', responseText.email_address[0].replace("This", "E-Mail"));
                } else if(typeof responseText.password !== "undefined") {
                    self.set('loginResponse', responseText.password[0].replace("This", "Password"));
                }
            }
        });
        Auth.on('signInSuccess', function() {
            self.set('loginError', false);
        });
    }
});
