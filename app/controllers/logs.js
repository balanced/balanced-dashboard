Balanced.LogsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'log.message.date',
    sortOrder: 'desc',
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});