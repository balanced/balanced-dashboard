Balanced.CsvReader = Ember.Object.extend({
	rows: function() {
		return $.csv.toArrays(this.get("body"));
	}.property("body"),
	hashes: function() {
		return $.csv.toObjects(this.get("body"));
	}.property("body")
});
