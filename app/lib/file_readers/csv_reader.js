Balanced.CsvReader = Ember.Object.extend({

	column_names: function(key, value) {
		if (arguments.length > 1) {
			this.get("rows")[0] = value;
		}
		return this.get("rows")[0];
	}.property("rows"),

	fields: function() {
		return this.get("rows").slice(1);
	}.property("rows"),

	rows: function() {
		return $.csv.toArrays(this.get("body"));
	}.property("body"),

	columnsMatch: function(other) {
		var columns = this.get("column_names");
		return _.difference(columns, other).length === 0;
	},

	getObjects: function(mapping) {
		var columnNames = this.get("column_names");
		var rows = this.get("fields");

		return rows.map(function(row) {
			var obj = {};
			columnNames.forEach(function(columnName, i) {
				if (!Ember.isNone(mapping) && !Ember.isNone(mapping[columnName])) {
					columnName = mapping[columnName];
				}
				obj[columnName] = row[i];
			});
			return obj;
		});
	}

});
