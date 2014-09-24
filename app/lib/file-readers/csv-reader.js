import Computed from "balanced-dashboard/utils/computed";

var CsvReader = Ember.Object.extend({

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

	fields: Computed.slice("rows", 1),

	rows: function() {
		var body = this.get("body") || "";
		return body.length ?
			$.csv.toArrays(body) : [];
	}.property("body"),

});

export default CsvReader;
