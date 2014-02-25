require('app/components/modal');

Balanced.ApiKeyDeleteModalComponent = Balanced.ModalComponent.extend({
	moreWarning: function() {
		return this.key.get('secret') === this.marketplaceSecret;
	}.property('key', 'marketplaceSecret'),
	displayDelete: function() {
		if (this.get('oneKey')) {
			return false;
		}
		if (this.get('moreWarning') && !this.get('haveOtherSecrets')) {
			return false;
		}
		return true;
	}.property('moreWarning', 'key', 'oneKey', 'haveOtherSecrets'),

	actions: {
		confirm: function() {
			this.hide();
			this.sendAction('action', this.get('key'));
		}
	}
});
