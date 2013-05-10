Balanced.MarketplaceController = Balanced.ObjectController.extend({

});

Balanced.MarketplaceIndexController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.MarketplaceActivityController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.MarketplaceInvoicesController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.MarketplaceLogsController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.MarketplaceLogController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.MarketplaceCreditsController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.MarketplaceDebitsController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.MarketplaceHoldsController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.MarketplaceRefundsController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});
