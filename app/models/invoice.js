Balanced.Invoice = Balanced.Model.extend({
	source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),

	bank_account_debits: Balanced.Model.hasMany('bank_account_debits', 'Balanced.Debit'),
	card_debits: Balanced.Model.hasMany('card_debits', 'Balanced.Debit'),
	debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
	credits: Balanced.Model.hasMany('credits', 'Balanced.Credit'),
	holds: Balanced.Model.hasMany('holds', 'Balanced.Hold'),
	failed_credits: Balanced.Model.hasMany('failed_credits', 'Balanced.Credit'),
	lost_debit_chargebacks: Balanced.Model.hasMany('lost_debit_chargebacks', 'Balanced.Debit'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
	reversals: Balanced.Model.hasMany('reversals', 'Balanced.Reversal'),
	settlements: Balanced.Model.hasMany('settlements', 'Balanced.Settlement'),

	from_date: function() {
		var period = this.get('period');
		if(!period) {
			return period;
		}
		return period[0];
	}.property('period'),

	to_date: function() {
		var period = this.get('period');
		if(!period) {
			return period;
		}
		return period[1];
	}.property('period'),

	subtotal: function() {
		var total = this.get('total_fee');
		var adjustments = this.get('adjustments_total_fee');
		if(Ember.isNone(total) || Ember.isNone(adjustments)) {
			return undefined;
		}
		return total - adjustments;
	}.property('total_fee', 'adjustments_total_fee'),

	is_scheduled: function() {
		return this.get('state') === 'scheduled';
	}.property('state'),

	reversal_fee: function() {
		return 0;
	}.property()
});

Balanced.TypeMappings.addTypeMapping('invoice', 'Balanced.Invoice');
