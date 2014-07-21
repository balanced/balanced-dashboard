Balanced.CreditsController = Balanced.ObjectController.extend({
	needs: ['marketplace'],

	pageType: function() {
		return Balanced.Utils.capitalize(this.get("model.type_name"));
	}.property("model.type_name"),

	pageTitle: function() {
		return Balanced.Utils.formatCurrency(this.get("model.amount"));
	}.property("model.amount"),

	reversalsLoader: function() {
		return Balanced.CreditReversalsResultsLoader.create({
			credit: this.get("model")
		});
	}.property("model")
});
