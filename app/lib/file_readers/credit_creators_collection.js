var Computed = {
	isEvery: function(propertyName) {
		return function() {
			return this.isEvery(propertyName);
		}.property("@each." + propertyName);
	}
};
Balanced.CreditCreatorsCollection = Ember.ArrayProxy.extend({

	isExistingCustomers: Computed.isEvery("isExisting"),

	isLoading: Ember.computed.not("isLoaded"),
	isLoaded: Computed.isEvery("isLoaded"),

	isSaved: Computed.isEvery("isSaved"),

	isEmpty: Ember.computed.equal("content.length", 0),
	isInvalid: Ember.computed.gt("invalid.length", 0),
	isValid: Ember.computed.not("isInvalid"),

	valid: function() {
		return this.filterBy("isValid");
	}.property("content.@each.isValid"),

	invalid: function() {
		return this.filterBy("isInvalid");
	}.property("content.@each.isInvalid"),

	hasValid: Ember.computed.gt("valid.length", 0),

	save: function(callback) {
		var savedCredits = [];
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
	},

	toCsvString: function() {
		var writer = new Balanced.CsvWriter();
		var firstObject = this.get("firstObject");
		var fieldNames = firstObject ?
			firstObject.get("fieldNames").slice() :
			[];

		fieldNames.push("errors");
		writer.addColumnNames(fieldNames);
		this.forEach(function(creditCreator) {
			writer.addRow(creditCreator.toLabeledCsvRowObject());
		});
		return writer.toCsvString();
	}

});

Balanced.CreditCreatorsCollection.reopenClass({
	fromCsvText: function(marketplace, text) {
		var reader = Balanced.CsvReader.create({
			body: text
		});
		var content = reader.getObjects().map(function(row) {
			return Balanced.CreditCreator.fromCsvRow(marketplace, row);
		});
		return Balanced.CreditCreatorsCollection.create({
			content: content
		});
	}
});
