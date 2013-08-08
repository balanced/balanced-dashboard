Balanced.LogsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'created_at',
    sortOrder: 'desc',
    results_type: 'Balanced.Log',
    type: null,

    results_base_uri: function () {
        return '/v1/logs';
    }.property(),

    extra_filtering_params: function () {
        return {
            'method[in]': 'post,put,delete',
        };
    }.property()
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});
