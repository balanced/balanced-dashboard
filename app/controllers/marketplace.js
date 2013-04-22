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
