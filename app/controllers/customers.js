Balanced.CustomersIndexController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, {
    needs: ['marketplace'],

    loadMore: function () {
        this.get('content').get('customers').loadNextPage();
    }
});
