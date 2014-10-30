import Ember from "ember";
import CsvReader from "./csv-reader";
import CreditCreator from "./credit-creator";
import CsvWriter from "../csv-writer";

var isEvery = function(propertyName) {
	return function() {
		return this.isEvery(propertyName);
	}.property("@each." + propertyName);
};

var CreditCreatorsCollection = Ember.ArrayProxy.extend({

	isDataPresent: false,
	isDataMissing: Ember.computed.not("isDataPresent"),

	isExistingCustomers: isEvery("isExisting"),

	isLoading: Ember.computed.not("isLoaded"),
	isLoaded: isEvery("isLoaded"),

	isSaved: isEvery("isSaved"),

	isEmpty: Ember.computed.equal("content.length", 0),
	isInvalid: Ember.computed.gt("invalid.length", 0),
	isValid: Ember.computed.not("isInvalid"),

	canSubmit: function() {
		return this.get("isValid") && (this.get("valid.length") > 0);
	}.property("isInvalid", "valid.length"),

	valid: function() {
		return this.get("content").filterBy("isValid");
	}.property("@each.isValid"),

	invalid: function() {
		return this.get("content").filterBy("isInvalid");
	}.property("@each.isInvalid"),

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
		var writer = new CsvWriter();
		var firstObject = this.get("firstObject");
		var fieldNames = firstObject ?
			firstObject.get("fieldNames").slice() : [];

		fieldNames.push("errors");
		writer.addColumnNames(fieldNames);
		this.forEach(function(creditCreator) {
			writer.addRow(creditCreator.toLabeledCsvRowObject());
		});
		return writer.toCsvString();
	}
});

CreditCreatorsCollection.reopenClass({
	fromCsvText: function(marketplace, text) {
		if (text === undefined) {
			return this.create({
				content: []
			});
		}
		var reader = CsvReader.create({
			body: text
		});

		var columnNames = reader.getColumnNames();
		if (!CreditCreator.isValidCreditCreatorColumns(columnNames)) {
			throw new Error("ColumnsMissing");
		}

		var content = reader.getObjects().map(function(row) {
			return CreditCreator.fromCsvRow(marketplace, row);
		});
		return this.create({
			isDataPresent: true,
			content: content
		});
	}
});

export default CreditCreatorsCollection;
