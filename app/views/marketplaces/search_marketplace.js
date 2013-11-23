Balanced.SearchMarketplaceView = Balanced.View.extend({
	templateName: 'marketplaces/_search_marketplace',
	tagName: 'form',

	query: null,

	isSubmitting: false,

	hasResults: function() {
		return this.get('query') && this.get('results');
	}.property('results', 'query'),

	results: function() {
		var query = this.get('query');

		if (!query) {
			return this.set('isSubmitting', false);
		}

		if (this.get('isSubmitting')) {
			return;
		}
		this.set('isSubmitting', true);

		var self = this;

		var searchArray = Balanced.ModelArray.newArrayLoadedFromUri(ENV.BALANCED.AUTH + '/admin/marketplaces?q=' + encodeURIComponent(query), 'Balanced.Marketplace');
		searchArray.on('didLoad', function() {
			self.set('isSubmitting', false);
		});

		return searchArray;
	}.property('query')
});
