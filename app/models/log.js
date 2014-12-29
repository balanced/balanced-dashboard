import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import Model from "./core/model";
import Utils from "balanced-dashboard/lib/utils";

var Log = Model.extend({
	uri: '/logs',
	route_name: 'log',
	type_name: 'Log',

	order: Model.belongsToWithUri('order', 'order_uri'),
	debit: Model.belongsToWithUri('debit', 'debit_uri'),
	credit: Model.belongsToWithUri('credit', 'credit_uri'),
	refund: Model.belongsToWithUri('refund', 'refund_uri'),
	reversal: Model.belongsToWithUri('reversal', 'reversal_uri'),
	hold: Model.belongsToWithUri('hold', 'hold_uri'),
	customer: Model.belongsToWithUri('customer', 'customer_uri'),
	card: Model.belongsToWithUri('card', 'card_uri'),
	bank_account: Model.belongsToWithUri('bank_account', 'bank_account_uri'),

	order_uri: Ember.computed.reads('message.response.body.orders.0.href'),
	debit_uri: Ember.computed.reads('message.response.body.debits.0.href'),
	credit_uri: Ember.computed.reads('message.response.body.credits.0.href'),
	refund_uri: Ember.computed.reads('message.response.body.refunds.0.href'),
	reversal_uri: Ember.computed.reads('message.response.body.reversals.0.href'),
	hold_uri: Ember.computed.reads('message.response.body.credits.0.href'),
	customer_uri: Ember.computed.reads('message.response.body.customers.0.href'),
	card_uri: Ember.computed.reads('message.response.body.cards.0.href'),
	bank_account_uri: Computed.orProperties('message.response.body.bank_accounts.0.href', 'message.request.payload.bank_account_uri'),

	page_title: Computed.fmt('message.request.method', 'short_url', '%@ %@'),
	short_url: Computed.transform('message.request.url', Utils.stripDomain),
	condensed_request_url: Computed.transform('short_url', Utils.prettyLogUrl),
	status: function() {
		var status_code = this.get('status_rollup');
		if (status_code === '2XX') {
			return 'succeeded';
		} else if (status_code === '3XX' || status_code === '4XX') {
			return 'failed';
		}
	}.property('status_rollup'),

	status_code: Ember.computed.alias('message.response.status'),
	additional: Ember.computed.reads('message.response.body.errors.0.additional'),

	// Handling the difference between rev 1.0 and 1.1
	category_code: Computed.orProperties('message.response.body.category_code', 'message.response.body.errors.0.category_code'),
	description: Computed.orProperties('message.response.body.description', 'message.response.body.errors.0.description'),

	ip_address: function() {
		return "%@ %@".fmt(this.get("message.request.headers.X-Real-Ip"), this.get("geo_ip"));
	}.property("message.request.headers.X-Real-Ip", "geo_ip"),

	geo_ip: function() {
		var ip = this.get('message.request.headers.X-Real-Ip');

		if (ip) {
			var self = this;

			Utils.geoIP(ip, function(result) {
				self.set('geo_ip', result);
			});
		}
	}.property('message.request.headers.X-Real-Ip'),
});

export default Log;
