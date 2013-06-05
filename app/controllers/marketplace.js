Balanced.MarketplaceController = Balanced.ObjectController.extend({
});

Balanced.MarketplaceIndexController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceTransactionsController = Balanced.ObjectController.extend(
    Balanced.DownloadControllerMixin,
    {
        needs: ['marketplace']
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
