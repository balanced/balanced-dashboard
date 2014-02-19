require('app/components/modal');

Balanced.ApiKeyDeleteModalComponent = Balanced.ModalComponent.extend({
	moreWarning: function() {
		return this.key.get('secret') === this.marketplaceSecret;
	}.property('key'),
	displayDelete: function() {
		if (this.get('oneKey')) {
			return false;
		}
		if (this.get('moreWarning') && !this.get('haveOtherSecrets')) {
			return false;
		}
		return true;
	}.property('moreWarning', 'key', 'oneKey', 'haveOtherSecrets'),

	init: function() {
		window.apikeydelc = window.apikeydelc || {};
		window.apikeydelc[this.key.get('id')] = this;
		this._super();
	},

	actions: {
		confirm: function() {
			this.hide();
			this.sendAction('action', this.get('key'));
		}
	}
});
