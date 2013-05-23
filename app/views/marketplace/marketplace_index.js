Balanced.MarketplaceIndexView = Balanced.View.extend({
  openEditMarketplaceInfoModal: function() {
    this.get('editMarketplaceInfoModal').open();
  },

  openAddBankAccountModal: function() {
  	this.get('addBankAccountModal').open();
  },

  openAddCallbackModal: function() {
  	this.get('addCallbackModal').open();
  }
});
