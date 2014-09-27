import Ember from "ember";

var ResultsLoadMoreView = Ember.View.extend({
	tagName: "tfoot",
	templateName: "results/results-load-more",
	actions: {
		loadMore: function(results) {
			results.loadNextPage();
		}
	}
});

export default ResultsLoadMoreView;
