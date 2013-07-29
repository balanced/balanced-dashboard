Balanced.LogsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'date_created',
    sortOrder: 'desc'
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});