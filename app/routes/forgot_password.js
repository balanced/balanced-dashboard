Balanced.ForgotPasswordRoute = Balanced.Route.extend({
  setupController: function (controller, model) {
    controller.set('submitted', false);
    controller.set('hasError', false);
    this._super(controller, model.fp);
  },

  model: function() {
    var fp =  Balanced.ForgotPassword.create();

    return {
      fp: fp
    };
  }
});