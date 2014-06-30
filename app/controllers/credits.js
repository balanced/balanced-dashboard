Balanced.CreditsController = Balanced.ObjectController.extend({
	needs: ['marketplace'],

	reversalsLoader: function() {
		return Balanced.CreditReversalsResultsLoader.create({
			credit: this.get("model")
		});
	}.property("model")
});
