Balanced.MarketplaceController = Balanced.ObjectController.extend({

    formattedEscrowAmount: function () {
        var escrow = this.get('in_escrow');
        if (isNaN(escrow)) {
            return '$--';
        }
        return Balanced.Utils.formatCurrency(escrow);
    }.property('in_escrow')
});

Balanced.MarketplaceIndexController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceTransactionsController = Balanced.ObjectController.extend(
    Balanced.DownloadControllerMixin,
    {
        needs: ['marketplace'],

        loadMore: function () {
            this.get('content').get('transactions').loadNextPage();
        }
    }
);

Balanced.MarketplaceFundingInstrumentsController = Balanced.ObjectController.extend(
    Balanced.DownloadControllerMixin,
    {
        needs: ['marketplace'],

        loadMore: function () {
            this.get('content').get('funding_instruments').loadNextPage();
        }
    }
);

Balanced.MarketplaceCreditsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceDebitsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceHoldsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceRefundsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});
