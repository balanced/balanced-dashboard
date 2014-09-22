import Ember from "ember";

var CreditsController = Ember.ObjectController.extend({
	needs: ['marketplace'],

	reversalsLoader: function() {
		return Balanced.CreditReversalsResultsLoader.create({
			credit: this.get("model")
		});
	}.property("model")
});

export default CreditsController;
