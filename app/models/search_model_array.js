require('app/models/core/model_array');

Balanced.SearchModelArray = Balanced.ModelArray.extend(Ember.SortableMixin, {
	total_credits: function() {
		return this.get('counts.credit');
	}.property('counts.credit'),

	total_debits: function() {
		return this.get('counts.debit');
	}.property('counts.debit'),

	total_holds: function() {
		return this.get('counts.hold');
	}.property('counts.hold'),

	total_refunds: function() {
		return this.get('counts.refund');
	}.property('counts.refund'),

	total_accounts: function() {
		return this.get('counts.account');
	}.property('counts.account'),

	total_bank_accounts: function() {
		return this.get('counts.bank_account');
	}.property('counts.bank_account'),

	total_cards: function() {
		return this.get('counts.card');
	}.property('counts.card'),

	total_orders: function() {
		return this.get('counts.order');
	}.property('counts.order'),

	total_transactions: function() {
		return this.get('total_credits') + this.get('total_debits') + this.get('total_holds') + this.get('total_refunds');
	}.property('total_credits', 'total_debits', 'total_holds', 'total_refunds'),

	total_funding_instruments: function() {
		return this.get('total_bank_accounts') + this.get('total_cards');
	}.property('total_bank_accounts', 'total_cards'),
});

Balanced.SearchModelArray.reopenClass({
	newArrayLoadedFromUri: function(uri, defaultType) {
		return Balanced.ModelArray.newArrayLoadedFromUri.call(this, uri, defaultType);
	},

	newArrayCreatedFromJson: function(json, defaultType) {
		return Balanced.ModelArray.newArrayCreatedFromJson.call(this, json, defaultType);
	}
});
