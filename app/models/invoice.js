import Model from "./core/model";
import Computed from "balanced-dashboard/utils/computed";

var computedUri = function(key) {
	return Computed.concat('uri', '/' + key);
};
var computedDate = function(p) {
	return function() {
		var period = this.get('period');
		if (!period) {
			return this.get('created_at');
		}
		return period[p];
	}.property('period');
};

var Invoice = Model.extend({
	route_name: 'invoice',

	page_title: Computed.fmt('sequence_number', 'No. %@'),
	type_name: 'Account statement',

	source: Model.belongsTo('source', 'funding-instrument'),

	bank_account_debits: Model.hasMany('bank_account_debits', 'debit'),
	card_debits: Model.hasMany('card_debits', 'debit'),
	debits: Model.hasMany('debits', 'debit'),
	credits: Model.hasMany('bank_account_credits', 'credit'),
	holds: Model.hasMany('holds', 'hold'),
	failed_credits: Model.hasMany('failed_credits', 'credit'),
	lost_debit_chargebacks: Model.hasMany('lost_debit_chargebacks', 'debit'),
	refunds: Model.hasMany('refunds', 'refund'),
	reversals: Model.hasMany('reversals', 'reversal'),
	settlements: Model.hasMany('settlements', 'settlement'),
	disputes: Model.hasMany('disputes', 'dispute'),

	from_date: computedDate(0),
	to_date: computedDate(1),

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
		var DisputesResultsLoader = require("balanced-dashboard/models/results-loaders/disputes")["default"];
		return DisputesResultsLoader.create({
			// Note: The Api is throwing an error when fetching the disputes using /invoices/:invoice_id/disputes
			// so we are defaulting this to created_at for now.
			// description: "Unable to sort on unknown field "initiated_at" Your request id is OHM4eadba4c092211e4b88e02b12035401b."
			sort: "created_at,desc",
			path: this.get("disputes_uri"),
		});
	},

	getTransactionsLoader: function(attributes) {
		var InvoiceTransactionsResultsLoader = require("balanced-dashboard/models/results-loaders/invoice-transactions")["default"];
		attributes = _.extend({
			invoice: this
		}, attributes);
		return InvoiceTransactionsResultsLoader.create(attributes);
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
	bank_account_debits_uri: computedUri('bank_account_debits'),
	card_debits_uri: computedUri('card_debits'),
	debits_uri: computedUri('debits'),
	bank_account_credits_uri: computedUri('bank_account_credits'),
	holds_uri: computedUri('holds'),
	failed_credits_uri: computedUri('failed_credits'),
	lost_debit_chargebacks_uri: computedUri('lost_debit_chargebacks'),
	refunds_uri: computedUri('refunds'),
	reversals_uri: computedUri('reversals'),
	disputes_uri: computedUri('disputes')
});

export default Invoice;
