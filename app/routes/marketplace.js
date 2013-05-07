Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplaceURI = Balanced.Marketplace.constructUri(params.marketplace_id);
    return Balanced.Marketplace.find(marketplaceURI);
  },

  // if we passed a lite marketplace to #linkTo, need this to find the real marketplace
  setupController: function(controller, model) {
    if(model._type === "marketplaceLite") {
      controller.set("content", Balanced.Marketplace.find(model.uri));
    }
  },

  renderTemplate: function() {
    this.render();
    this.render('marketplace_sidebar', {
      into: 'marketplace',
      outlet: 'sidebar',
      controller: 'marketplace'
    });
    this.render('header', {
      into: 'application',
      outlet: 'header'
    });
  }
});
