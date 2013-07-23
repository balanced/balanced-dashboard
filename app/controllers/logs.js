Balanced.LogsIndexController = Balanced.ObjectController.extend(Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'human_readable_date',
    sortOrder: 'desc',
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});