Balanced.LogsIndexRoute = Balanced.Route.extend({
    page_title: 'Logs'
});

Balanced.LogsRoute = Balanced.IframeRoute.extend({
    param: 'log_id',
    title: 'Logs',
    resource: 'logs'
});

Balanced.LogsLogRoute = Balanced.ShowResource.extend({
    param: 'log_id',
    title: 'Log',
    resource: 'logs'
});
