Balanced.Invoice = Balanced.Model.extend({
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
	}.property('period')
});

Balanced.TypeMappings.addTypeMapping('invoice', 'Balanced.Invoice');
