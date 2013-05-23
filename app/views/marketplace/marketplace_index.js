Balanced.MarketplaceIndexView = Balanced.View.extend({
  openEditMarketplaceInfoModal: function() {
    this.get('editMarketplaceInfoModal').open();
  },

  openEditOwnerInfoModal: function() {
  	this.get('editOwnerInfoModal').open();
  },

  openAddBankAccountModal: function() {
  	this.get('addBankAccountModal').open();
  },

  openAddCallbackModal: function() {
  	this.get('addCallbackModal').open();
  }
});
