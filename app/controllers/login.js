Balanced.LoginController = Balanced.ObjectController.extend(Auth.SignInController, {
    email: null,
    password: null,
    loginError: false,
    loginResponse: "",

    signIn: function() {
        this.registerRedirect();
        Auth.signIn({
            email_address: this.get('email'),
            password: this.get('password')
        });
        var self = this;
        Auth.on('signInError', function() {
            self.set('loginError', true);
            self.set('loginResponse', Auth.get('jqxhr').statusText);
        });
        Auth.on('signInSuccess', function() {
            self.set('loginError', false);
        });
    },
    dismissError: function() {
        this.set('loginError', false);
    }
});
