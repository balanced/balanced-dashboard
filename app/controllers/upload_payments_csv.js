Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	init: function() {
		this._super();

		var defaultText = [
			"bank_account_id,new_customer_name,new_customer_email,new_bank_account_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,amount,appears_on_statement_as,description",
			",,,,,Dwyane Braggart,CHEcking,15,Payment #1771,8 Ladies Dancing (Giggity)",
			",,,121000358,123123123,Dwyane Braggart,CHECKING,15,Payment #1771,8 Ladies Dancing (Giggity)",
			",Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKG,16,Payment #9746,5 Gold Rings",
			",Harry Tan,harry.tan@example.org,121000358,123123123,Harry Tan,CHECKING,-19,Payment #7891,11 Pipers Piping",
			",Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECking,10,Payment #5425,7 Swans a Swimming",
			",Tommy Tang,tommy.tang@example.org,121000358,123123123,Tommy Tang,SAVINGS,1,Payment #5119,a Partridge in a Pear Tree.",
			",Dwyane Braggart,dwyane.braggart@example.org,121000358,123123123,Dwyane Braggart,SAVINGS,54,Payment #7050,Three French Hens",
			",Charlie Chan,charlie.chan@example.org,121000358,123123123,Charlie Chan,CHECKING,32,Payment #4818,4 Calling Birds",
			",John Foo,john.foo@example.org,121000358,123123123,John Foo,SAVINGS,17,Payment #4805,7 Swans a Swimming",
			",Harrison Ford,harrison.ford@example.org,121000358,123123123,Harrison Ford,CHECKING,43,Payment #2720,a Partridge in a Pear Tree."
		].join("\n");
		this.refresh(defaultText);
	},

	refresh: function(text) {
		var collection = Balanced.CreditCreatorsCollection.fromCsvText(text);
		this.set("creditCreators", collection);
	},

	save: function(callback) {
		var self = this;
		var collection = self.get("creditCreators");
		collection.save(function () {
			callback();
			var count = collection.filter(function (creator) {
				return creator.get("isComplete");
			}).length;
			self.transitionToRoute('activity');
			self.refresh("");
			self.send('alert', {
				message: "" + count + " payouts were successfully submitted",
				persists: false,
				type: "success"
			});
		});
	},

	actions: {
		removeCreditCreator: function(creator) {
			this.get("creditCreators").removeObject(creator);
		}
	}
});
