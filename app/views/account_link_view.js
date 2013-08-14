/*
 * A specialized LinkView, when a account link is clicked, we get the a Customer from the server and
 * transition to customer view with it
 */
Balanced.AccountLinkView = Ember.LinkView.extend({
    click: function (event) {
        var isSimpleClick = Ember.ViewUtils.isSimpleClick;
        var get = Ember.get;

        if (!isSimpleClick(event)) { return true; }

        event.preventDefault();
        if (this.bubbles === false) { event.stopPropagation(); }

        if (get(this, '_isDisabled')) { return false; }

        var router = this.get('router');

        /* above code is from Ember.js, below is where our code kicks in,
         * the Account object should be loaded dynamicaly and converted into a Customer object
         */
        var obj = this.parameters.params[0];
        if (obj.constructor !== Balanced.Account) {
            throw new Ember.Error('AccountLinkView is dedicated for presenting Account object link only');
        }

        var app_route = this.container.lookup('route:application');
        var marketplace = app_route.modelFor('marketplace');
        var accountId = obj.get('id');
        obj = marketplace.then(function (marketplace) {
            var customerUri = marketplace.get('customers_uri') + '/' + accountId;
            router.transitionTo('customers', Balanced.Customer.find(customerUri));
        });
    }
});
