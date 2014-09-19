import Ember from "ember";
Balanced.ResultsLoadMoreView = Ember.View.extend({
	tagName: "tfoot",
	templateName: "results/results_load_more",
	actions: {
		loadMore: function(results) {
			results.loadNextPage();
		}
	}
});
