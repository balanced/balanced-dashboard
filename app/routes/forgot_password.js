Balanced.ForgotPasswordRoute = Balanced.Route.extend({
    setupController: function (controller, model) {
      controller.set('submitted', false);
      controller.set('hasError', false);
      controller.set('content', model.fp);
    },

    model: function() {
      var fp =  Balanced.ForgotPassword.create({
        uri: '/password',
        email_address: null
      });

      return {
        fp: fp
      };
    }
});