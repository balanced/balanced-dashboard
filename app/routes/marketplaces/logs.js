Balanced.LogsRoute = Balanced.AuthRoute.extend({
    model: function () {
        var logUri = Balanced.Log.constructUri();
        var logs = Balanced.Log.find(logUri);
        console.log(logs);
        return logs;
    }
});

Balanced.LogRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var logUri = Balanced.Log.constructUri(params.log_id);
        var log = Balanced.Log.find(logUri);
        return log;
    }
});