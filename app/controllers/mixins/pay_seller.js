Balanced.PaySeller = Ember.Mixin.create({
    needs: ['marketplace'],

    show_pay_seller: false,

    pay_seller_amount_dollars: 0,

    isSubmitting: false,

    openPaySellerModal: function () {
        this.set('isSubmitting', false);

        var credit = Balanced.Credit.create({uri: '/v1/credits'});
        credit.set('bank_account', Balanced.BankAccount.create());
        this.set('pay_seller_model', credit);

        this.set('show_pay_seller', true);
    },

    closePaySellerModal: function () {
        this.set('isSubmitting', false);
        this.set('show_pay_seller', false);
    },

    paySeller: function () {
        if (this.get('isSubmitting')) {
            return;
        }

        this.set('isSubmitting', true);
        var self = this;
        var credit = this.get('pay_seller_model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('pay_seller_amount_dollars'));
        } catch (error) {
            this.set('isSubmitting', false);
            credit.set('validationErrors', {'amount': error});
            return;
        }
        credit.set('amount', cents);

        credit.create().then(function (credit) {
            self.set('isSubmitting', false);
            self.closePaySellerModal();

            // this junk is in here because of the iframe code. Take it out when we clean that up!
            var marketplace = self.get('controllers.marketplace.model');
            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(marketplace.get('uri')) + Balanced.Utils.uriToDashboardFragment(credit.get('uri'));

            // This is what we should be doing to transition
            // self.transitionToRoute('credits.credit', credit);
        }, function () {
            self.set('isSubmitting', false);
        });
    }
});
