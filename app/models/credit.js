import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import Transaction from "./transaction";
import Rev1Serializer from "../serializers/rev1";
import Model from "./core/model";
import Utils from "balanced-dashboard/lib/utils";

var Credit = Transaction.extend({
	reversal_amount: Ember.computed.oneWay('amount'),
	uri: '/credits',
	type_name: "Credit",
	route_name: "credits",

	destination: Model.belongsTo('destination', 'funding-instrument'),
	reversals: Model.hasMany('reversals', 'reversal'),
	order: Model.belongsTo('order', 'order'),

	funding_instrument_description: Ember.computed.alias('destination.description'),
	last_four: Ember.computed.alias('destination.last_four'),
	funding_instrument_name: Ember.computed.alias('destination.formatted_bank_name'),
	funding_instrument_type: Ember.computed.alias('destination.type_name'),
	max_reversal_amount_dollars: Computed.transform('reversal_amount', Utils.centsToDollars),

	failure_reasonChanged: function() {
		if (Ember.isEmpty(this.get('failure_reason'))) {
			return;
		}
		var formattedMessage = this.get('failure_reason').replace(/of\s(\d+)(\d\d)/g, 'of $$' + '$1.$2');
		this.set('failure_reason', formattedMessage);
	}.observes('failure_reason', 'amount').on('init'),

	get_reversals: function() {

		var self = this;

		this.get('reversals').then(function(reversals) {
			self.set('reversal_amount', reversals.reduce(function(amount, reversal) {
				if (!reversal.get('is_failed')) {
					return amount - reversal.get('amount');
				} else {
					return amount;
				}
			}, self.get('amount')));
		});
	}.on('didLoad'),

	can_reverse: function() {
		return (!this.get('is_failed')) && (this.get('reversal_amount') > 0 && this.get('funding_instrument_type') !== 'Debit card');
	}.property('is_failed', 'reversal_amount', 'funding_instrument_type'),

	status_description: function() {
		if (this.get('is_pending')) {
			if (this.get('funding_instrument_type') === 'Debit card') {
				return "Funds will be available within 2-3 business days";
			} else {
				return "Credit is processing. Funds will be available the next business day unless there is an issue with the bank account.";
			}

		} else if (this.get('is_succeeded')) {
			return "Funds are now available. If there is an issue with the bank account, a \"Failed\" status and rejection reason will be displayed here.";
		} else if (this.get('is_failed')) {
			if (this.get('failure_reason') || this.get('failure_reason_code')) {
				return this.get('failure_reason') || this.get('failure_reason_code');
			}
			return "The transaction failed. No failure reason was given.";
		} else {
			return undefined;
		}
	}.property('is_pending', 'is_succeeded', 'is_failed', 'failure_reason', 'failure_reason_code', 'funding_instrument_type'),
});

Credit.reopenClass({
	serializer: Rev1Serializer.extend({
		serialize: function(record) {
			var json = this._super(record);

			var fundingInstrument = record.get('destination');
			if (fundingInstrument) {
				if (fundingInstrument.constructor.serializer) {
					json.destination = fundingInstrument.constructor.serializer.serialize(fundingInstrument);
				} else {
					json.destination = fundingInstrument;
				}
			}

			if (!Ember.isBlank(json.order_uri)) {
				json.order = json.order_uri;
				delete json.order_uri;
			}

			return json;
		}
	}).create(),
});

export default Credit;
