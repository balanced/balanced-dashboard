Balanced.PaymentsCsvReader = Balanced.CsvReader.extend({

	mapRowsToCredit: function(mapping) {
		var mappedRows = this.mapColumnsToCreditAttributes(mapping);
		return mappedRows.map(function(row) {
			return Balanced.Credit.create(row);
		});
	}

});
