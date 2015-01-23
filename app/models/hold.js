import Ember from "ember";
import Model from "./core/model";
import Computed from "balanced-dashboard/utils/computed";
import Transaction from "./transaction";

var Hold = Transaction.extend({
	card: Model.belongsTo('card', 'funding-instrument'),
	source: Ember.computed.alias('card'),
	debit: Model.belongsTo('debit', 'debit'),

	status: function() {
		var apiStatus = this.get("__json.status");
		if (this.get('debit')) {
			return 'captured';
		} else if (this.get('voided_at')) {
			return 'voided';
		} else if (this.get('is_expired')) {
			return 'expired';
		} else if (!Ember.isBlank(apiStatus)) {
			return apiStatus;
		}
		else {
			return "created";
		}
	}.property('debit', 'voided_at', 'is_expired', "__json.status"),

	expires_at_date: function() {
		var expirationString = this.get("expires_at");
		return moment(expirationString, moment.ISO_8601).toDate();
	}.property("expires_at"),

	is_expired: function() {
		return moment(this.get("expires_at_date")).isBefore(new Date());
	}.property('expires_at_date'),

	can_void_or_capture: function() {
		return ["created", "succeeded"].contains(this.get("status"));
	}.property("status"),
	type_name: 'Hold',
	route_name: 'holds',
	funding_instrument_description: Ember.computed.readOnly('card.description'),
	customer: Computed.orProperties('debit.customer', 'card.customer'),
	last_four: Ember.computed.readOnly('card.last_four'),
	funding_instrument_name: Ember.computed.readOnly('card.brand'),
	funding_instrument_type: Ember.computed.alias('card.type_name')
});

export default Hold;
