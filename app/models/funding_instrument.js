require('app/models/mixins/meta_array');

Balanced.FundingInstrument = Balanced.Model.extend(
	Balanced.MetaArrayMixin, {
		customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),

		title_description: Balanced.computed.fmt('name', 'last_four', '%@ (%@)'),
		description_with_type: Balanced.computed.fmt('type_name', 'description', '%@: %@'),
		funding_instrument_name: Balanced.computed.orProperties('brand', 'formatted_bank_name'),
		funding_instrument_type: Balanced.computed.orProperties('type_name'),

		formatted_bank_name: function() {
			if (this.get('bank_name')) {
				// return Balanced.Utils.toTitleCase(this.get('bank_name'));
				return Balanced.Utils.sanitizeBankName(Balanced.Utils.toTitleCase(this.get('bank_name')));
			} else {
				return null;
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
