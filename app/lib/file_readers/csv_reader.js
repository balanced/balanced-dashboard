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

	fields: Balanced.computed.slice("rows", 1),

	rows: function() {
		var body = this.get("body") || "";
		return body.length ?
			$.csv.toArrays(body) : [];
	}.property("body"),

});
