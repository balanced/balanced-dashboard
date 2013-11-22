Balanced.SearchMarketplaceView = Balanced.View.extend({
	templateName: 'marketplaces/_search_marketplace',
	tagName: 'form',

	query: null,
	results: null,

	isSubmitting: false,

	hasResults: function() {

	}.property('results'),

	actions: {
		submit: function() {
			if (this.get('isSubmitting')) {
				return;
			}
			this.set('isSubmitting', true);

			var self = this;
			var query = this.get('query');

			Balanced.NET.ajax({
				url: ENV.BALANCED.AUTH + '/admin/marketplaces?q=' + encodeURIComponent(query),
				type: 'GET'
			}).done(function (response, status, jqxhr) {
				console.log(response);
				self.set('results', response);
			}).complete(function () {
				self.set('isSubmitting', false);
			});
		}
	}
});
