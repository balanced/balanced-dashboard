import Computed from "../utils/computed";
import Model from "./core/model";

var isStatus = function(status) {
	return Ember.computed.equal('status', status);
};

var Transaction = Model.extend(Ember.Validations, {
	customer: Model.belongsTo('customer', 'customer'),
	events: Model.hasMany('events', 'event'),

	isUnlinked: Ember.computed.not("links.order"),

	amount_dollars: function() {
		if (this.get('amount')) {
			return (this.get('amount') / 100).toFixed(2);
		} else {
			return '';
		}
	}.property('amount'),

	customer_name_summary: Ember.computed.oneWay('customer.display_me_with_email'),
	customer_display_me: Ember.computed.oneWay('customer.display_me'),
	customer_email: Ember.computed.oneWay('customer.email'),

	page_title: Computed.orProperties('description', 'id'),
	events_uri: Computed.concat('uri', '/events'),

	dasherized_funding_instrument_type: function() {
		if (this.get('funding_instrument_type')) {
			return Ember.String.dasherize(this.get('funding_instrument_type'));
		} else {
			return '';
		}
	}.property('funding_instrument_type'),

	status_description: function() {
		if (this.get('is_failed')) {
			if (this.get('failure_reason') || this.get('failure_reason_code')) {
				return this.get('failure_reason') || this.get('failure_reason_code');
			}
			return 'The transaction failed, no failure reason was given.';
		} else {
			return undefined;
		}
	}.property('is_failed', 'status', 'failure_reason', 'failure_reason_code'),

	is_failed: isStatus('failed'),
	is_pending: isStatus('pending'),
	is_succeeded: isStatus('succeeded')
});

Transaction.reopenClass({
	findAppearsOnStatementAsInvalidCharacters: function(originalString) {
		// ASCII letters (a-z and A-Z)
		// Digits (0-9)
		// Special characters (.<>(){}[]+&!$;-%_?:#@~=\'" ^`|)
		var SPECIAL_CHARS_REGEXP = /[.<>(){}\[\]+&!$;\-%_?:#@~=\\'" \^`|\w]/g;
		return originalString
			.replace(SPECIAL_CHARS_REGEXP, '')
			.split("")
			.uniq()
			.join("");
	}
});

export default Transaction;
