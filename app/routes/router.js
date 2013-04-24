Balanced.Route = Ember.Route.extend({
});

Balanced.AuthRoute = Auth.Route.extend({
});

Balanced.Router.map(function () {
  this.resource("marketplace", { path: "/marketplaces/:marketplace_id" }, function() {
    this.route("activity", { path: "/activity" });
    this.route("invoices", { path: "/invoices" });
    this.route("logs", { path: "/logs" });

    this.route("credits", { path: "/credits/:credit_id"});
    this.route("debits", { path: "/debits/:debit_id"});
    this.route("refunds", { path: "/refunds/:refund_id"});

    this.route("accounts", { path: "/accounts/:account_id"});
  });
  this.resource('login');
});

Balanced.ApplicationRoute = Balanced.Route.extend({
  setupController: function(controller, model) {
    this.controllerFor('marketplaces').set('model', Balanced.Marketplace.find());

    Ember.Instrumentation.subscribe("iframe.linkclicked", {
      before: function(name, timestamp, payload) {
        // forward the event to the application controller - see controllers/application.js
        controller.send('iframeLinkClicked', payload);
      },
      after: function() {}
    });
  }
});

Balanced.MarketplaceActivityRoute = Balanced.AuthRoute.extend({
});
Balanced.MarketplaceInvoicesRoute = Balanced.AuthRoute.extend({
});
Balanced.MarketplaceLogsRoute = Balanced.AuthRoute.extend({
});

Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
});

Balanced.MarketplaceCreditsRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/credits/" + params.credit_id + "?embedded=1";
  }
});

Balanced.MarketplaceDebitsRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/debits/" + params.debit_id + "?embedded=1";
  }
});

Balanced.MarketplaceRefundsRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/refunds/" + params.refund_id + "?embedded=1";
  }
});

Balanced.MarketplaceAccountsRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/accounts/" + params.account_id + "?embedded=1";
  }
});
