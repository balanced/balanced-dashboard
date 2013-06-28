Balanced.MarketplaceController = Balanced.ObjectController.extend({
    needs: 'paySellerModal',

    message_message: null,
    message_type: null,

    formattedEscrowAmount: function () {
        var escrow = this.get('in_escrow');
        if (isNaN(escrow)) {
            return '$--';
        }
        return Balanced.Utils.formatCurrency(escrow);
    }.property('in_escrow'),

    alertMessage: function (data) {
        this.set('message_message', data.message);
        this.set('message_type', data.type);
    },

    dismissAlert: function () {
        this.set('message_message', null);
        this.set('message_type', null);
    },

    openPaySellerModal: function() {
        this.get('controllers.paySellerModal').open();
    }
});

Balanced.MarketplaceCreditsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceDebitsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceHoldsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceRefundsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});

Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend({
    needs: ['marketplace']
});