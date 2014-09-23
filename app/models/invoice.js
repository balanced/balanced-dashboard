var ComputedUri = function(key) {
	return Balanced.computed.concat('uri', '/' + key);
};
var ComputedDate = function(p) {
	return function() {
		var period = this.get('period');
		if (!period) {
			return this.get('created_at');
		}
		return period[p];
	}.property('period');
};

Balanced.Invoice = Balanced.Model.extend({
	route_name: 'invoice',

	page_title: Balanced.computed.fmt('sequence_number', 'No. %@'),
	type_name: 'Account statement',

	source: Balanced.Model.belongsTo('source', 'funding-instrument'),

	bank_account_debits: Balanced.Model.hasMany('bank_account_debits', 'debit'),
	card_debits: Balanced.Model.hasMany('card_debits', 'debit'),
	debits: Balanced.Model.hasMany('debits', 'debit'),
	credits: Balanced.Model.hasMany('bank_account_credits', 'credit'),
	holds: Balanced.Model.hasMany('holds', 'hold'),
	failed_credits: Balanced.Model.hasMany('failed_credits', 'credit'),
	lost_debit_chargebacks: Balanced.Model.hasMany('lost_debit_chargebacks', 'debit'),
	refunds: Balanced.Model.hasMany('refunds', 'refund'),
	reversals: Balanced.Model.hasMany('reversals', 'reversal'),
	settlements: Balanced.Model.hasMany('settlements', 'settlement'),
	disputes: Balanced.Model.hasMany('disputes', 'dispute'),

	from_date: ComputedDate(0),
	to_date: ComputedDate(1),

	typeChanged: function() {
		if (this.get('type') === 'fee') {
			this.set('type', 'transaction');
		}
	}.observes('type').on('init'),

	invoice_type: function() {
		if (this.get('isDispute')) {
			return 'Disputes';
		} else {
			return 'Transactions';
		}
	}.property('isDispute'),

	getInvoicesLoader: function() {
		return Balanced.DisputesResultsLoader.create({
			// Note: The Api is throwing an error when fetching the disputes using /invoices/:invoice_id/disputes
			// so we are defaulting this to created_at for now.
			// description: "Unable to sort on unknown field "initiated_at" Your request id is OHM4eadba4c092211e4b88e02b12035401b."
			sort: "created_at,desc",
			path: this.get("disputes_uri"),
		});
	},

	getTransactionsLoader: function(attributes) {
		attributes = _.extend({
			invoice: this
		}, attributes);
		return Balanced.InvoiceTransactionsResultsLoader.create(attributes);
	},

	isDispute: Ember.computed.equal('type', 'dispute'),

	hasHoldsFee: Ember.computed.gt('holds_total_fee', 0),

	subtotal: function() {
		var total = this.get('total_fee');
		var adjustments = this.get('adjustments_total_fee');
		if (Ember.isNone(total) || Ember.isNone(adjustments)) {
			return undefined;
		}
		return total - adjustments;
	}.property('total_fee', 'adjustments_total_fee'),

	is_scheduled: Ember.computed.equal('state', 'scheduled'),

	status: function() {
		if (this.get('total_fee') === 0) {
			return 'paid';
		} else {
			return this.get('state');
		}
	}.property('state', 'total_fee'),

	is_not_paid: function() {
		return this.get('status') !== 'paid';
	}.property('status'),

	reversal_fee: 0,

	// TODO - take all these URIs out once invoice has links for them
	bank_account_debits_uri: ComputedUri('bank_account_debits'),
	card_debits_uri: ComputedUri('card_debits'),
	debits_uri: ComputedUri('debits'),
	bank_account_credits_uri: ComputedUri('bank_account_credits'),
	holds_uri: ComputedUri('holds'),
	failed_credits_uri: ComputedUri('failed_credits'),
	lost_debit_chargebacks_uri: ComputedUri('lost_debit_chargebacks'),
	refunds_uri: ComputedUri('refunds'),
	reversals_uri: ComputedUri('reversals'),
	disputes_uri: ComputedUri('disputes')
});

export default Balanced.Invoice;
