import Ember from "ember";
import CreditReversalsResultsLoader from "balanced-dashboard/models/results-loaders/credit-reversals";

var CreditsController = Ember.ObjectController.extend({
	needs: ['marketplace'],

	reversalsLoader: function() {
		return CreditReversalsResultsLoader.create({
			credit: this.get("model")
		});
	}.property("model")
});

export default CreditsController;
