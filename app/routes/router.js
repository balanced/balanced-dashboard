Balanced.Route = Ember.Route.extend({

});

Balanced.Router.map(function () {
    this.route("root", {path: "/"});
    this.resource("marketplaces", {path: "/marketplaces"}, function () {
        this.route("index", {path: "/"});
        this.resource("marketplaces.show", { path: "/:marketplace_id" }, function () {
//            this.resource("update", { path: "/edit" });
        });
//        this.route("create");
    });
    this.resource('login', {path: '/login'}, function () {
        this.route("create");
    });
});


Balanced.MarketplacesIndexRoute = Balanced.Route.extend({
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


Balanced.MarketplacesShowRoute = Balanced.Route.extend({
    model: function (params) {
        return Balanced.Marketplace.find(params.marketplace_id);
    },

    renderTemplate: function () {
        //  TODO: wtf: cannot use . in template name...
        this.render('marketplaces_show');
    }
});


Balanced.LoginCreateRoute = Balanced.Route.extend({
    renderTemplate: function () {
        this.render('auth_login');
    }
});
