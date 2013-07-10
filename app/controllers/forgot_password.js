Balanced.ForgotPasswordController = Balanced.ObjectController.extend({
  email_address: null,
  submitted: false,
  hasError: false,

  forgotPass: function() {
    if(!this.get('email_address')) {
      this.set('hasError', true);
      return;
    } else {
      this.set('hasError', false);
    }

    var self = this;

    var fp = Balanced.ForgotPassword.create({
      uri: '/password',
      email_address: this.get('email_address')
    });

    fp.one('becameInvalid', function() {
      self.set('hasError', true);
    });

    fp.one('becameError', function() {
      self.set('hasError', true);
    });

    fp.create().then(function(response) {
      self.set('email_address', '');
      self.set('submitted', true);
    });
  }
});