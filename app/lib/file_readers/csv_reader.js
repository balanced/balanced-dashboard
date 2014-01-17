Balanced.CsvReader = Ember.Object.extend({

	column_names: function() {
		return this.get("rows")[0];
	}.property("rows"),

	rows: function() {
		return $.csv.toArrays(this.get("body"));
	}.property("body"),

	columnsMatch: function (other) {
		var columns = this.get("column_names");
		return Ember.isArray(columns) && Ember.compare(other, columns) === 0;
	},

	getObjects: function(mapping) {
		var columnNames = this.get("column_names");
		var rows = this.get("rows").slice(1);
		return rows.map(function(row) {
			var obj = {};
			columnNames.forEach(function(columnName, i) {
				if (!Ember.none(mapping) && !Ember.none(mapping[columnName])) {
					columnName = mapping[columnName];
				}
				obj[columnName] = row[i];
			});
			return obj;
		});
	}

});
