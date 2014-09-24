import Computed from "balanced-dashboard/utils/computed";
import Transaction from "./transaction";
import Model from "./core/model";
import Utils from "balanced-dashboard/lib/utils";

var Debit = Transaction.extend({

	refund_amount: Ember.computed.oneWay('amount'),
	type_name: "Debit",
	route_name: "debits",

	source: Model.belongsTo('source', 'funding-instrument'),
	hold: Model.belongsTo('card_hold', 'hold'),
	refunds: Model.hasMany('refunds', 'refund'),
	dispute: Model.belongsTo('dispute', 'dispute'),
	order: Model.belongsTo('order', 'order'),

	getDisputesLoader: function(attributes) {
		var DisputesResultsLoader = require("balanced-dashboard/models/results-loaders/disputes")["default"];
		attributes = _.extend({
			path: this.get("dispute_uri")
		}, attributes);
		return DisputesResultsLoader.create(attributes);
	},

	funding_instrument_description: Ember.computed.alias('source.description'),
	last_four: Ember.computed.alias('source.last_four'),
	funding_instrument_name: Ember.computed.alias('source.brand'),
	funding_instrument_type: Ember.computed.alias('source.type_name'),
	max_refund_amount_dollars: Computed.transform('refund_amount', Utils.centsToDollars),
	recipient: function() {
		return this.get('customer') ? 'customer' : 'card';
	}.property('customer'),

	recipient_name: function() {
		if (this.get('customer')) {
			return this.get('customer.display_me_with_email');
		} else {
			return '%@ (%@)'.fmt(this.get('last_four'), this.get('funding_instrument_name'));
		}
	}.property('customer.display_me_with_email', 'last_four', 'funding_instrument_name'),

	get_refunds: function() {
		var self = this;

		this.get('refunds').then(function(refunds) {
			self.set('refund_amount', refunds.reduce(function(amount, refund) {
				if (!refund.get('is_failed')) {
					return amount - refund.get('amount');
				} else {
					return amount;
				}
			}, self.get('amount')));
		});
	}.on('didLoad'),

	can_refund: function() {
		return this.get('is_succeeded') && (this.get('refund_amount') > 0) && !this.get('dispute');
	}.property('amount', 'refund_amount', 'is_succeeded', 'dispute')
});

export default Debit;
