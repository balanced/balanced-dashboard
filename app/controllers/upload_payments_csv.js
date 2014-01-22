Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	init: function() {
		this._super();
		var reader = Balanced.CsvReader.create();
		this.set("reader", reader);
	},

	csvColumnNames: function() {
		return [];
	}.property("reader.body"),

	csvRowObjects: function() {
		var self = this;
		return this.get("reader").getObjects().map(function(object, i) {
			var mappedObject = {};
			var keysMapping = {
				"bank_account_id": "bank_account.id",
				"amount_in_cents": "credit.amount",
				"new_bank_account_routing_number": "bank_account.routing_number",
				"new_bank_account_number": "bank_account.account_number",
				"new_bank_account_name": "bank_account.name",
				"new_bank_account_type": "bank_account.type",
				"appears_on_statement_as": "credit.appears_on_statement_as",
				"description": "credit.description",
				"new_customer_email": "customer.email",
				"new_customer_name": "customer.name"
			};

			_.each(object, function(value, key) {
				if (i === 0) {
					self.get("csvColumnNames").pushObject(key);
				}
				if (keysMapping[key]) {
					key = keysMapping[key];
				}
				mappedObject[key] = value;
			});
			return Balanced.CsvPaymentRow.create({
				baseObject: mappedObject
			});
		});
	}.property("reader.body"),

	actions: {
		submit: function() {
			Balanced.BatchProcessor.create()
				.parallel(2)
				.each(this.get("csvRowObjects"), function(index, paymentRow, done) {
					return paymentRow.process().then(done, done);
				})
				.end();
		}
	}
});
