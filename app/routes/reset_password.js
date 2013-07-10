Balanced.ResetPasswordRoute = Balanced.Route.extend({
    setupController: function (controller, model) {
      controller.set('submitted', false);
      controller.set('hasError', false);
      controller.set('content', model.rp);
    },

    model: function(params) {
      var rp =  Balanced.ResetPassword.create({
        uri: '/password/' + params.token,
        password: null,
        token: params.token
      });

      return {
        rp: rp
      };
    }
});