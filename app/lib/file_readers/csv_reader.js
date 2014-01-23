Balanced.CsvReader = Ember.Object.extend({

	getParsedColumnNames: function() {
		var self = this;
		return (this.get("column_names") || []).map(function(columnName) {
			return columnName.split(".");
		});
	},

	getObjects: function() {
		var columnNames = this.get("column_names");

		var rows = this.get("fields");
		return rows.map(function(columns) {
			var object = {};
			columnNames.forEach(function(name, i) {
				object[name] = columns[i];
			});
			return object;
		});
	},

	column_names: function() {
		return this.get("rows")[0] || [];
	}.property("rows"),

	fields: function() {
		return this.get("rows").slice(1);
	}.property("rows"),

	rows: function() {
		var body = this.get("body");
		return body ?
			$.csv.toArrays(body) : [];
	}.property("body"),

});

Balanced.PaymentsCsvReader = Balanced.CsvReader.extend({

	getCreditCreators: function() {
		return this.getObjects().map(function(row) {
			return Balanced.CreditCreator.fromCsvRow(row);
		});
	},

	saveCreditCreators: function(creators, callback) {
		var savedCredits = [];

		var saveSingle = function(creator, rest) {
			creator.save().then(function(result) {
				savedCredits.push(result);
				if (rest.length > 0) {
					saveSingle(rest[0], rest.slice(1));
				} else {
					callback(savedCredits);
				}
			});
		};

		saveSingle(creators[0], creators.slice(1));
	}

});
