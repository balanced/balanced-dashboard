Balanced.ActivityTransactionsController = Balanced.ObjectController.extend(
    Balanced.DownloadControllerMixin,
    {
        needs: ['marketplace'],

        loadMore: function () {
            this.get('content').get('transactions').loadNextPage();
        }
    }
);

Balanced.ActivityCustomersController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, {
    needs: ['marketplace'],

    loadMore: function () {
        this.get('content').get('customers').loadNextPage();
    }
});

Balanced.ActivityFundingInstrumentsController = Balanced.ObjectController.extend(
    Balanced.DownloadControllerMixin,
    {
        needs: ['marketplace'],

        loadMore: function () {
            this.get('content').get('funding_instruments').loadNextPage();
        }
    }
);
