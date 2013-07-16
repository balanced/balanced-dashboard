Balanced.LogsRoute = Balanced.AuthRoute.extend({
    setupController: function(controller, model) {
        controller.set('content', model);
    },

    model: function () {
        var logUri = Balanced.Log.constructUri();
        return Balanced.Log.find(logUri);
    }
});

Balanced.LogRoute = Balanced.AuthRoute.extend({
    setupController: function(controller, model) {
        controller.set('content', model);
    },

    model: function (params) {
        var logUri = Balanced.Log.constructUri(params.log_id);
        return Balanced.Log.find(logUri);
    }
});