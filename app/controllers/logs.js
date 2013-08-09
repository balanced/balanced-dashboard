Balanced.LogsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'created_at',
    sortOrder: 'desc',
    results_type: 'Balanced.Log',
    type: null,
    limit: 20,

    currentEndpointFilter: null,
    statusRollupFilterSucceeded: true,
    statusRollupFilterFailed: true,

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
    },

    setStatusRollupFilter: function() {
        if(this.get('statusRollupFilterSucceeded') && !this.get('statusRollupFilterFailed')) {
            this.changeStatusRollupFilter([
                '2xx'
            ]);
        } else if(this.get('statusRollupFilterFailed') && !this.get('statusRollupFilterSucceeded')) {
            this.changeStatusRollupFilter([
                '3xx',
                '4xx',
                '5xx'
            ]);
        } else {
            this.changeStatusRollupFilter(null);
        }
    }.observes('statusRollupFilterSucceeded', 'statusRollupFilterFailed')
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});
