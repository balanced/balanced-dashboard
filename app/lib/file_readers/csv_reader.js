Balanced.CsvReader = Ember.Object.extend({

	getParsedColumnNames: function() {
		return this.getColumnNames().map(function(columnName) {
			return columnName.split(".");
		});
	},

	getObjects: function() {
		var columnNames = this.getColumnNames();

		var rows = this.get("fields");
		return rows.map(function(columns) {
			var object = {};
			columnNames.forEach(function(name, i) {
				object[name] = columns[i];
			});
			return object;
		});
	},

	getColumnNames: function() {
		return this.get("rows")[0] || [];
	},

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
			var innerCallback = function(result) {
				savedCredits.push(result);
				if (rest.length > 0) {
					saveSingle(rest[0], rest.slice(1));
				} else {
					callback(savedCredits);
				}
			};

			creator.save().then(innerCallback, innerCallback);
		};

		saveSingle(creators[0], creators.slice(1));
	}

});
