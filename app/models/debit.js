require('app/models/transaction');

Balanced.Debit = Balanced.Transaction.extend({
	source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),
	hold: Balanced.Model.belongsTo('hold', 'Balanced.Hold'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),

	type_name: function() {
		return "Debit";
	}.property(),

	route_name: function() {
		return "debits";
	}.property(),

	funding_instrument_description: function() {
		return this.get('source.description');
	}.property('source.description'),

	status_description: function() {
		if (this.get('status') === 'failed') {
			if(this.get('failure_reason') || this.get('failure_reason_code')) {
				return this.get('failure_reason') || this.get('failure_reason_code');
			}
			return 'The debit failed, no failure reason was given.';
		} else {
			return undefined;
		}
	}.property('status', 'failure_reason', 'failure_reason_code')
});

Balanced.TypeMappings.addTypeMapping('debit', 'Balanced.Debit');
