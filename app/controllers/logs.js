Balanced.LogsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'created_at',
    sortOrder: 'desc'
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});