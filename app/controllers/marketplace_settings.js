Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend({
    needs: ["marketplace"],

    fullyLoaded: function () {
        var ownerCustomer = this.get('owner_customer');
        return this.get('isLoaded') &&
            ownerCustomer.get('isLoaded') &&
            ownerCustomer.get('bank_accounts').get('isLoaded') &&
            ownerCustomer.get('cards').get('isLoaded') &&
            this.get('callbacks').get('isLoaded');
    }.property(
        'isLoaded',
        'owner_customer.isLoaded',
        'owner_customer.bank_accounts.isLoaded',
        'owner_customer.cards.isLoaded',
        'callbacks.isLoaded'
    ),

    promptToDeleteCallback: function (callback) {
        this.callback = callback;
        $('#delete-callback').modal('show');
    },

    deleteCallback: function () {
        this.callback.delete();
        $('#delete-callback').modal('hide');
    },

    promptToDeleteBankAccount: function (bankAccount) {
        this.bankAccount = bankAccount;
        $('#delete-bank-account').modal('show');
    },

    deleteBankAccount: function () {
        this.bankAccount.delete();
        $('#delete-bank-account').modal('hide');
    },

    promptToDeleteCard: function (card) {
        this.card = card;
        $('#delete-card').modal('show');
    },

    deleteCard: function () {
        this.card.delete();
        $('#delete-card').modal('hide');
    },

    marketplaceSecret: function () {
        var uri = this.get('uri');
        var user = Balanced.Auth.get('user');
        var currentUserMarketplace = user.user_marketplace_for_uri(uri);

        if(currentUserMarketplace) {
            return currentUserMarketplace.get('secret');
        }

        if(Balanced.Auth.getGuestAPIKey()) {
            return Balanced.Auth.getGuestAPIKey();
        }

        return '';
    }.property('uri', 'Balanced.Auth.user.user_marketplaces.@each.uri')
});
