Balanced.LogsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'created_at',
    sortOrder: 'desc',
    results_type: 'Balanced.Log',
    type: null,
    currentEndpointFilter: null,
    limit: 20,

    results_base_uri: function () {
        return '/v1/logs';
    }.property(),

    extra_filtering_params: function () {
        return {
            'method[in]': 'post,put,delete'
        };
    }.property(),

    setEndPointFilter: function (endpoint) {
        this.changeEndpointFiler(endpoint);

        if (endpoint) {
            this.set('currentEndpointFilter', Balanced.Utils.toTitleCase(endpoint));
        } else {
            this.set('currentEndpointFilter', null);
        }
    }
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});
