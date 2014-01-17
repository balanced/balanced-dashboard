Balanced.CsvReader = Ember.Object.extend({

	rows: function() {
		return $.csv.toArrays(this.get("body"));
	}.property("body"),

	hashes: function() {
		var columnNames = this.get("columnNames");
		var rows = this.get("rows").slice(1);
		return rows.map(function(row) {
			var obj = {};
			columnNames.forEach(function(name, i) {
				obj[name] = row[i];
			});
			return obj;
		});
	}.property("rows", "columnNames"),

	columnNames: function() {
		return this.get("rows")[0];
	}.property("rows"),

	mapRowToAttributes: function(row, mapping) {
		var attributes = {};
		for (var destinationName in mapping) {
			attributes[destinationName] = row[mapping[destinationName]];
		}
		return attributes;
	},

	mapRowsToAttributes: function(mapping) {
		var self = this;
		return this.get("rows").map(function(row) {
			return self.mapRowToAttributes(row, mapping);
		});
	}

});
