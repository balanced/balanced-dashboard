Balanced.MarketplaceIndexController = Balanced.ObjectController.extend({
  needs: ["marketplace"],

  fullyLoaded: function() {
    var ownerAccount = this.get('owner_account');
    return this.get('isLoaded')
      && this.get('callbacks').get('isLoaded')
      && ownerAccount.get('isLoaded')
      && ownerAccount.get('customer').get('isLoaded')
      && ownerAccount.get('bank_accounts').get('isLoaded')
      && ownerAccount.get('cards').get('isLoaded');
  }.property(
    'isLoaded',
    'callbacks.isLoaded',
    'owner_account.isLoaded',
    'owner_account.customer.isLoaded',
    'owner_account.bank_accounts.isLoaded',
    'owner_account.cards.isLoaded'
    ),

  deleteCard: function(card) {
  	card.delete();
  },

  deleteBankAccount: function(bankAccount) {
  	bankAccount.delete();
  },

  deleteCallback: function(callback) {
  	callback.delete();
  }
});
