Balanced.LogsIndexRoute = Balanced.AuthRoute.extend({
    model: function () {
        var logUri = Balanced.Log.constructUri();
        return Balanced.ModelArray.newArrayLoadedFromUri(logUri, 'Balanced.Log');
    }
});

Balanced.LogsLogRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var logUri = Balanced.Log.constructUri(params.log_id);
        return Balanced.Log.find(logUri);
    }
});
