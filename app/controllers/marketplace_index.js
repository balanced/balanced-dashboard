Balanced.MarketplaceIndexController = Balanced.ObjectController.extend({
  needs: ["marketplace"],

  deleteCard: function(card) {
  	card.delete();
  },

  deleteBankAccount: function(bankAccount) {
  	bankAccount.delete();
  }
});
