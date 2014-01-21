require('app/models/mixins/meta_array');

Balanced.Transaction = Balanced.Model.extend(
	Balanced.MetaArrayMixin, {
		account: Balanced.Model.belongsTo('account', 'Balanced.Account'),
		customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),
		events: Balanced.Model.hasMany('events', 'Balanced.Event'),

		amount_dollars: function() {
			if (this.get('amount')) {
				return (this.get('amount') / 100).toFixed(2);
			} else {
				return '';
			}
		}.property('amount'),

		customer_name_summary: function() {
			if (this.get('customer')) {
				return this.get('customer.display_me_with_email');
			} else {
				return 'None';
			}
		}.property('customer'),

		page_title: function() {
			return this.get('description') || this.get('id');
		}.property('description', 'id'),

		events_uri: function() {
			return this.get('uri') + '/events';
		}.property(),

		status_description: function() {
			if (this.get('status') === 'failed') {
				if (this.get('failure_reason') || this.get('failure_reason_code')) {
					return this.get('failure_reason') || this.get('failure_reason_code');
				}
				return 'The transaction failed, no failure reason was given.';
			} else {
				return Ember.String.capitalize(this.get('status'));
			}
		}.property('status', 'failure_reason', 'failure_reason_code'),

		is_failed: function() {
			return this.get('status') === 'failed';
		}.property('status'),

		is_pending: function() {
			return this.get('status') === 'pending';
		}.property('status')
	});
