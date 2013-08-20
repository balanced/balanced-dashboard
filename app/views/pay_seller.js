Balanced.PaySellerModalView = Balanced.View.extend({

    templateName: 'modals/pay_seller',

    amount_dollars: 0,

    didInsertElement: function () {
        this.get('controller').on('openPaySellerModal', this, this.open);
    },

    willDestroyElement: function () {
        this.get('controller').off('openPaySellerModal', this, this.open);
    },

    open: function () {
        var credit = Balanced.Credit.create({uri: '/v1/credits'});
        credit.set('bank_account', Balanced.BankAccount.create({'type': 'checking'}));
        this.set('model', credit);
        this.set('amount_dollars', null);

        $('#pay-seller').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        var credit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('amount_dollars'));
        } catch (error) {
            credit.set('validationErrors', {'amount': error});
            return;
        }
        credit.set('amount', cents);

        credit.save().then(function (credit) {
            $('#pay-seller').modal('hide');

            // this junk is in here because of the iframe code. Take it out when we clean that up!
            var marketplace = self.get('controllers.marketplace.model');
            window.location.hash = '#' +
                Balanced.Utils.uriToDashboardFragment(marketplace.get('uri')) +
                Balanced.Utils.uriToDashboardFragment(credit.get('uri'));

            // This is what we should be doing to transition
            // self.transitionToRoute('credits.credit', credit);
        });
    }
});
