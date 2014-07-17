Balanced.SummarySectionView = Balanced.View.extend({
	templateName: "detail_views/summary_section",
	linkedResource: function(className, title, resourceModel, value) {
		var model = this.get('model');

		return {
			className: className,
			title: title,
			resourceModelPath: model.get(resourceModel + '.route_name'),
			resourceModel: model.get(resourceModel),
			value: model.get(resourceModel + '.' + value)
		};
	}
});

Balanced.CustomerSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: function() {
		if (this.get('model.status') === 'unverified') {
			return 'You may credit this customer, but we recommend collecting more information of this customer for underwriting purposes.';
		}
		return null;
	}.property('model.status'),

	learnMore: function() {
		return {
			className: 'learn-more-unverified',
			text: "For an individual, you may collect full legal name, email, permanent street address, and last four digits of SSN. For a business, we also recommend collecting the full business name and EIN number."
		};
	}.property()

});

Balanced.CardSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		console.log(this.linkedResource('icon-customers', 'Customer', 'customer', 'display_me'))
		return [
			this.linkedResource('icon-customers', 'Customer', 'customer', 'display_me')
		];
	}.property()
});

Balanced.BankAccountSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return [
			this.linkedResource('icon-customers', 'Customer', 'customer', 'display_me')
		];
	}.property()
});
