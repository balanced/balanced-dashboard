Balanced.MarketplaceInitialDepositRoute = Balanced.AuthRoute.extend({
    model: function () {
        var form = Balanced.InitialDeposit.create(),
            marketplace = this.modelFor('marketplace');
        return {
            form: form,
            marketplace: marketplace
        };
    },
    setupController: function (controller, model) {
        this._super(controller, model.form);
    },
    events: {
        onComplete: function () {
            var marketplace = this.modelFor('marketplace');
            this.transitionTo('activity', marketplace);
        },
        onCardDebit: function (items) {
            var debit = items.debit, tokenizedCard = items.card;
            var marketplace = this.modelFor('marketplace');
            var self = this;
            //  the controller knows nothing about the mp so set here
            tokenizedCard.set('uri', marketplace.get('owner_customer.cards_uri'));
            debit.set('uri', marketplace.get('owner_customer.debits_uri'));

            //  saving this will associate the card to the marketplace owner
            tokenizedCard.create().then(function (associatedCard) {
                //  uri of card changes once tokenized, now we know it and can
                // set on the debit
                debit.set('source_uri', associatedCard.get('uri'));
                debit.create().then(function (debit) {

                    //  annnnd we're done
                    self.transitionTo('activity', marketplace);
                });
            });
        },
        onSkip: function () {
            var marketplace = this.modelFor('marketplace');
            marketplace.refresh();
            this.transitionTo('activity', marketplace);
        },
        passAlertMessage: function (type, message) {
            // TODO: i'm pretty sure this is the wrong way to do this but i am
            // not sure how to pass messages between controllers.
            this.controllerFor('marketplace').send('alertMessage', {
                type: type,
                message: message
            });
        }
    }
});
