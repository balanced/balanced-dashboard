require('app/views/detail_views/summary_section_view');

Balanced.ListSectionView = Balanced.SummarySectionView.extend({
	templateName: "detail_views/list_section",
});

Balanced.OrderBuyersSectionView = Balanced.ListSectionView.extend({
	title: function() {
		var titleText = '<i class="icon-customers non-interactive"></i> %@ ';
		var total = this.get('total');

		if (total) {
			titleText += '(%@)'.fmt(total);
		}

		return Balanced.Utils.safeFormat(titleText, "Buyers").htmlSafe();
	}.property('total'),

	resources: Ember.computed.alias("buyersResults"),

	total: Ember.computed.alias("buyersResults.total"),

	buyersResults: function() {
		return this.get("model").getBuyersResultsLoader({
			limit: 20
		}).get("results");
	}.property("model"),


	linkedResources: function() {
		return this.resourceLinks("buyersResults");
	}.property("buyersResults", "buyersResults.length")
});
