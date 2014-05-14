Balanced.MarketplaceTransactionsRoute = Balanced.AuthRoute.extend({
  pageTitle: 'Transactions',
  defaultType: 'transaction',
  setupController: function(controller, model) {
    this._super(controller, model);

    var activityController = controller;
    console.log(controller, model);
    activityController.refresh();

    var defaultSort = this.get('defaultSort');
    if (defaultSort && defaultSort !== activityController.get('sortField')) {
      activityController.set('sortField', defaultSort);
    }

    var defaultType = this.get('defaultType');
    if (!defaultType) {
      return;
    }

    if (activityController.get('category') !== defaultType) {
      activityController.set('type', defaultType);
    } else {
      activityController.send('reload');
    }
  }
});