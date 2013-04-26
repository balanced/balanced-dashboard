Balanced.MarketplaceRoute = Balanced.Route.extend({
  renderTemplate: function() {
    this.render();
    this.render('marketplace_sidebar', {
      into: 'application',
      outlet: 'sidebar',
      controller: 'marketplace'
    });
  }
});
