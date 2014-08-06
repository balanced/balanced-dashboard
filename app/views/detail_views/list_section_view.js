require('app/views/detail_views/summary_section_view');

Balanced.ListSectionView = Balanced.SummarySectionView.extend({
	templateName: "detail_views/list_section",
});

Balanced.OrderBuyersSectionView = Balanced.ListSectionView.extend({
	title: function() {
		var titleText = '<i class="icon-customers non-interactive"></i>%@';
		var total = this.get('total');

		if (total) {
			titleText += ' (%@)'.fmt(total);
		}

		return Balanced.Utils.safeFormat(titleText, "Buyers").htmlSafe();
	}.property('total'),

	resources: Ember.computed.alias("model.buyers"),
	total: Ember.computed.alias("model.buyers.total"),

	linkedResources: function() {
		return this.resourceLinks("model.buyers");
	}.property("model.buyers", "model.buyers.length", "model.meta")
});
