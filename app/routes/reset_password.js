Balanced.ResetPasswordRoute = Balanced.Route.extend({
    title: 'Reset password',

    setupController: function (controller, model) {
        controller.set('submitted', false);
        controller.set('hasError', false);
        this._super(controller, model.rp);
    },

    model: function (params) {
        var rp = Balanced.ResetPassword.create({
            isLoaded: true,
            token: params.token
        });

        return {
            rp: rp
        };
    }
});
