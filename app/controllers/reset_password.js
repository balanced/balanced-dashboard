Balanced.ResetPasswordController = Balanced.ObjectController.extend({
  password: null,
  password_confirm: null,
  submitted: false,
  hasError: false,

  resetPassword: function() {
      if(!this.get('password') ||
         !this.get('password_confirm') ||
         this.get('password') !== this.get('password_confirm') ||
         !Balanced.Utils.isValidPassword(this.get('password'))) {
        this.set('hasError', true);
        return;
      } else {
        this.set('hasError', false);
      }

      var self = this;

      var rp = Balanced.ResetPassword.create({
        uri: '/password/' + this.get('token'),
        password: this.get('password'),
        isLoaded: true
      });

      rp.one('becameInvalid', function() {
        self.set('hasError', true);
      });

      rp.one('becameError', function() {
        self.set('hasError', true);
      });

      rp.update().then(function() {
        self.set('submitted', true);
        self.set('password', '');
        self.set('password_confirm', '');
        self.set('submitted', true);
      });
  }
});