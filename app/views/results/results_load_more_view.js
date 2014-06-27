Balanced.ResultsLoadMoreView = Balanced.View.extend({
	tagName: "tfoot",
	templateName: "results/results_load_more_button",
	actions: {
		loadMore: function(results) {
			results.loadNextPage();
		}
	}
});
