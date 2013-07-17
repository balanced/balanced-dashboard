Balanced.LogsController = Balanced.ObjectController.extend(Balanced.ResultsTable, {
    needs: ['marketplace']
});

Balanced.LogController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});