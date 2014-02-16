Balanced.CreditCreatorsCollection = Ember.ArrayProxy.extend({

	isEmpty: Ember.computed.equal("content.length", 0),
	hasItems: Ember.computed.not("isEmpty"),

	isInvalid: Ember.computed.gt("invalid.length", 0),
	isValid: Ember.computed.not("isInvalid"),

	valid: function() {
		return this.filterBy("isInvalid", false);
	}.property("content.@each.isInvalid", "content.length"),

	invalid: function() {
		return this.filterBy("isInvalid");
	}.property("content.@each.isInvalid", "content.length"),

	total: function() {
		var total = 0;
		this.forEach(function(item) {
			var amount = item.get("amount");
			total += amount;
		});
		return total;
	}.property("content.length", "content.@each.amount"),

	save: function(callback) {
		var savedCredits = [];
		var self = this;
		var creators = this.get("content");

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

Balanced.CreditCreatorsCollection.reopenClass({
	fromCsvText: function(text) {
		var reader = Balanced.CsvReader.create({
			body: text
		});
		var content = reader.getObjects().map(function(row) {
			return Balanced.CreditCreator.fromCsvRow(row);
		});
		return Balanced.CreditCreatorsCollection.create({
			content: content
		});
	}
});
