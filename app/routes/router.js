Balanced.Router.map(function () {
    this.resource("marketplaces", {path: "/marketplaces"}, function () {
        this.route("index", {path: "/"});
        this.resource("marketplaces.show", { path: "/:marketplace_id" }, function () {
//            this.resource("update", { path: "/edit" });
        });
//        this.route("create");
    });
});


Balanced.MarketplacesIndexRoute = Ember.Route.extend({
    model: function () {
        return Balanced.Marketplace.find();
    },
    renderTemplate: function () {
        //  TODO: wtf: cannot use . in template name...
        this.render(
            'marketplaces_index', {
                controller: this.controller
            }
        );
    }
});


Balanced.MarketplacesShowRoute = Ember.Route.extend({
    model: function (params) {
        return Balanced.Marketplace.find(params.marketplace_id);
    },

    renderTemplate: function () {
        //  TODO: wtf: cannot use . in template name...
        this.render('marketplaces_show');
    }
});
