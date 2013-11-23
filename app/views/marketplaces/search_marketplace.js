Balanced.SearchMarketplaceView = Balanced.View.extend({
	templateName: 'marketplaces/_search_marketplace',
	tagName: 'form',

	query: null,
	results: null,

	isSubmitting: false,

	hasResults: function() {
		return this.get('query') && this.get('results');
	}.property('results', 'query'),

	results: function () {
		var query = this.get('query');
		console.log(query);

		if (!query) {
			return this.set('isSubmitting', false);
		}

		if (this.get('isSubmitting')) {
			console.log('isSubmitting')
			return;
		}
		this.set('isSubmitting', true);

		var self = this;

		var searchArray = Balanced.ModelArray.newArrayLoadedFromUri(ENV.BALANCED.AUTH + '/admin/marketplaces?q=' + encodeURIComponent(query), 'Balanced.Marketplace');
		searchArray.on('didLoad', function () {
			self.set('isSubmitting', false);
		});

		return searchArray;
	}.property('query'),

	actions: {
		submit: function() {
			console.log('submit', this.get('query'));

			// Balanced.NET.ajax({
			// 	url: ,
			// 	type: 'GET'
			// }).done(function (response, status, jqxhr) {
			// 	console.log(response);
			// 	self.set('results', response);
			// }).complete(function () {
			// 	self.set('isSubmitting', false);
			// });
		}
	}
});
