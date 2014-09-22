import Ember from "ember";

var ResultsLoadMoreView = Ember.View.extend({
	tagName: "tfoot",
	templateName: "results/results_load_more",
	actions: {
		loadMore: function(results) {
			results.loadNextPage();
		}
	}
});

export default ResultsLoadMoreView;
