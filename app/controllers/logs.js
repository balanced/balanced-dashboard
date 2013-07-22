Balanced.LogsIndexController = Balanced.ObjectController.extend(Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'status',
    sortOrder: 'desc',
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});