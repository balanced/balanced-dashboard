import Computed from "balanced-dashboard/utils/computed";
import Model from "./core/model";
import Utils from "balanced-dashboard/lib/utils";

var FundingInstrument = Model.extend({
	customer: Model.belongsTo('customer', 'customer'),

	title_description: Computed.fmt('last_four', 'funding_instrument_name', '%@ %@'),
	description_with_type: Computed.fmt('type_name', 'description', '%@: %@'),
	funding_instrument_name: Computed.orProperties('brand', 'formatted_bank_name'),
	funding_instrument_type: Computed.orProperties('type_name', 'account_type'),
	expected_credit_date: function() {
		return moment().addBusinessDays(this.get('expected_credit_days_offset')).format();
	}.property('expected_credit_days_offset'),
	isRemoved: Ember.computed.equal('status', 'removed'),
	isCard: false,
	isBankAccount: false,
	formatted_bank_name: function() {
		if (this.get('bank_name')) {
			return Utils.formatBankName(this.get('bank_name'));
		} else {
			return undefined;
		}
	}.property('bank_name'),

	// TODO - fix the API to return the transactions_uri, then get rid of this hack
	transactions_uri: function() {
		var id = this.get('id');
		if (!id) {
			return id;
		}
		return '/%@/%@/transactions'.fmt(this.get('route_name'), this.get('id'));
	}.property('id', 'route_name')
});

export default FundingInstrument;
